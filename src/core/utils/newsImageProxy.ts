import { lookup } from "node:dns";
import { get } from "node:https";
import type { LookupFunction } from "node:net";
import ipaddr from "ipaddr.js";

export const MAX_NEWS_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const IMAGE_TIMEOUT_MS = 8000;
const allowedDomains = ["cdninstagram.com", "fbcdn.net"];

export class NewsImageError extends Error {
    constructor(
        public status: number,
        message = "Não foi possível carregar a imagem da notícia."
    ) {
        super(message);
    }
}

export function validateNewsImageUrl(value: string): URL {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new NewsImageError(400, "Endereço de imagem inválido.");
    }
    if (
        url.protocol !== "https:" ||
        (url.port && url.port !== "443") ||
        url.username ||
        url.password ||
        !allowedDomains.some(
            (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
        )
    ) {
        throw new NewsImageError(403, "Origem de imagem não permitida.");
    }
    url.hash = "";
    return url;
}

export function isPublicImageAddress(address: string): boolean {
    try {
        return ipaddr.process(address).range() === "unicast";
    } catch {
        return false;
    }
}

// A verificação ocorre na resolução usada pelo próprio socket, evitando uma segunda consulta DNS.
export const publicImageLookup: LookupFunction = (hostname, options, callback) => {
    lookup(hostname, { all: true }, (error, addresses) => {
        if (error) {
            callback(error, []);
            return;
        }
        if (
            !addresses.length ||
            addresses.some(({ address }) => !isPublicImageAddress(address))
        ) {
            callback(new NewsImageError(403, "Destino de imagem não permitido."), []);
            return;
        }
        const matching = options.family
            ? addresses.filter(({ family }) => family === options.family)
            : addresses;
        if (!matching.length) {
            callback(new NewsImageError(502), []);
            return;
        }
        if (options.all) callback(null, matching);
        else callback(null, matching[0].address, matching[0].family);
    });
};

function matchesImageSignature(bytes: Buffer, type: string): boolean {
    if (type === "image/jpeg")
        return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (type === "image/png")
        return bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (type === "image/gif")
        return ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6));
    if (type === "image/webp")
        return (
            bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
        );
    if (type === "image/avif")
        return (
            bytes.toString("ascii", 4, 8) === "ftyp" &&
            ["avif", "avis"].includes(bytes.toString("ascii", 8, 12))
        );
    return false;
}

type ImageHop =
    | { location: string }
    | { bytes: Uint8Array<ArrayBuffer>; contentType: string };

function readImage(url: URL, signal: AbortSignal): Promise<ImageHop> {
    return new Promise((resolve, reject) => {
        const request = get(
            url,
            {
                lookup: publicImageLookup,
                agent: false,
                signal,
                headers: {
                    Accept: "image/jpeg,image/png,image/webp,image/gif,image/avif",
                    "Accept-Encoding": "identity",
                },
                maxHeaderSize: 16384,
            },
            (response) => {
                response.on("error", reject);
                if ([301, 302, 303, 307, 308].includes(response.statusCode || 0)) {
                    const location = response.headers.location;
                    response.destroy();
                    if (!location) {
                        reject(new NewsImageError(502));
                        return;
                    }
                    resolve({ location });
                    return;
                }
                const contentType =
                    response.headers["content-type"]
                        ?.split(";")[0]
                        .trim()
                        .toLowerCase() || "";
                if (response.statusCode !== 200) {
                    response.destroy();
                    reject(new NewsImageError(502));
                    return;
                }
                if (
                    ![
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                        "image/avif",
                    ].includes(contentType) ||
                    (response.headers["content-encoding"] &&
                        response.headers["content-encoding"] !== "identity")
                ) {
                    response.destroy();
                    reject(new NewsImageError(415));
                    return;
                }
                const declaredLength = Number(response.headers["content-length"] || 0);
                if (
                    !Number.isFinite(declaredLength) ||
                    declaredLength > MAX_NEWS_IMAGE_BYTES
                ) {
                    response.destroy();
                    reject(new NewsImageError(413));
                    return;
                }
                const chunks: Buffer[] = [];
                let size = 0;
                response.on("data", (chunk: Buffer) => {
                    size += chunk.length;
                    if (size > MAX_NEWS_IMAGE_BYTES) {
                        response.destroy();
                        reject(new NewsImageError(413));
                        return;
                    }
                    chunks.push(chunk);
                });
                response.on("aborted", () => reject(new NewsImageError(502)));
                response.on("end", () => {
                    const bytes = Buffer.concat(chunks);
                    if (!matchesImageSignature(bytes, contentType)) {
                        reject(new NewsImageError(415));
                        return;
                    }
                    resolve({ bytes: Uint8Array.from(bytes), contentType });
                });
            }
        );
        request.on("error", reject);
    });
}

export async function fetchNewsImage(value: string) {
    let url = validateNewsImageUrl(value);
    const signal = AbortSignal.timeout(IMAGE_TIMEOUT_MS);
    try {
        for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
            const result = await readImage(url, signal);
            if ("bytes" in result) return result;
            url = validateNewsImageUrl(new URL(result.location, url).href);
        }
        throw new NewsImageError(502);
    } catch (error) {
        if (signal.aborted) throw new NewsImageError(504);
        if (error instanceof NewsImageError) throw error;
        throw new NewsImageError(502);
    }
}
