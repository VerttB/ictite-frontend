import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import type { IncomingMessage } from "node:http";
import type { RequestOptions } from "node:https";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/image/route";
import {
    fetchNewsImage,
    isPublicImageAddress,
    MAX_NEWS_IMAGE_BYTES,
    publicImageLookup,
    validateNewsImageUrl,
} from "./newsImageProxy";

const { getMock, lookupMock } = vi.hoisted(() => ({
    getMock: vi.fn(),
    lookupMock: vi.fn(),
}));
vi.mock("node:https", () => ({ get: getMock }));
vi.mock("node:dns", () => ({ lookup: lookupMock }));
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
type Reply = {
    status?: number;
    type?: string;
    location?: string;
    length?: string;
    chunks?: Buffer[];
};
let replies: Reply[];
beforeEach(() => {
    replies = [];
    getMock.mockReset();
    lookupMock.mockReset();
    getMock.mockImplementation(
        (
            _url: URL,
            options: RequestOptions,
            callback: (response: IncomingMessage) => void
        ) => {
            expect(options.lookup).toBe(publicImageLookup);
            expect(options.agent).toBe(false);
            const request = new EventEmitter();
            queueMicrotask(() => {
                const reply = replies.shift();
                if (!reply) {
                    request.emit("error", new Error("Missing controlled response"));
                    return;
                }
                const stream = new PassThrough();
                const response = stream as unknown as IncomingMessage;
                response.statusCode = reply.status ?? 200;
                response.headers = {
                    "content-type": reply.type ?? "image/png",
                    location: reply.location,
                    "content-length": reply.length,
                };
                callback(response);
                for (const chunk of reply.chunks ?? [png]) {
                    if (!stream.destroyed) stream.write(chunk);
                }
                if (!stream.destroyed) stream.end();
            });
            return request;
        }
    );
});
afterEach(() => vi.restoreAllMocks());

describe("destinos de imagem", () => {
    it.each([
        "http://localhost:8000/openapi.json",
        "https://127.0.0.1",
        "https://[::1]",
        "file:///etc/passwd",
        "https://cdninstagram.com.evil.test/x",
        "https://evil-cdninstagram.com/x",
        "https://cdninstagram.com:8443/x",
        "https://user:password@cdninstagram.com/x",
        "not-a-url",
    ])("bloqueia %s antes de abrir conexão", async (url) => {
        await expect(fetchNewsImage(url)).rejects.toThrow();
        expect(getMock).not.toHaveBeenCalled();
    });
    it.each([
        "https://scontent-fco2-1.cdninstagram.com/photo.jpg",
        "https://instagram.ftij3-2.fna.fbcdn.net/photo.jpg",
    ])("preserva domínio cadastrado: %s", (url) =>
        expect(validateNewsImageUrl(url).href).toBe(url)
    );
    it.each([
        "127.0.0.1",
        "10.1.2.3",
        "172.16.0.1",
        "192.168.1.1",
        "169.254.169.254",
        "100.64.0.1",
        "0.0.0.0",
        "192.0.2.1",
        "224.0.0.1",
        "::1",
        "::",
        "fc00::1",
        "fe80::1",
        "2001:db8::1",
        "::ffff:127.0.0.1",
        "::ffff:10.0.0.1",
    ])("recusa IP não público %s", (address) => {
        expect(isPublicImageAddress(address)).toBe(false);
    });
    it.each(["8.8.8.8", "2606:4700:4700::1111"])(
        "aceita endereço público %s",
        (address) => {
            expect(isPublicImageAddress(address)).toBe(true);
        }
    );
    it("recusa DNS com endereço interno mesmo junto a endereço público", () => {
        lookupMock.mockImplementation((_hostname, _options, callback) =>
            callback(null, [
                { address: "8.8.8.8", family: 4 },
                { address: "127.0.0.1", family: 4 },
            ])
        );
        const callback = vi.fn();
        publicImageLookup("cdninstagram.com", { all: true }, callback);
        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({ status: 403 }),
            []
        );
    });
    it("devolve ao socket os endereços públicos da consulta validada", () => {
        const addresses = [{ address: "8.8.8.8", family: 4 }];
        lookupMock.mockImplementation((_hostname, _options, callback) =>
            callback(null, addresses)
        );
        const callback = vi.fn();
        publicImageLookup("cdninstagram.com", { all: true }, callback);
        expect(callback).toHaveBeenCalledWith(null, addresses);
        expect(lookupMock).toHaveBeenCalledTimes(1);
    });
});

describe("transferência e respostas do proxy", () => {
    it("entrega imagem validada com cache e nosniff", async () => {
        replies.push({});
        const result = await GET(
            new Request(
                "https://ictite.test/api/image?url=https://cdninstagram.com/photo.png"
            )
        );
        expect(result.status).toBe(200);
        expect(result.headers.get("content-type")).toBe("image/png");
        expect(result.headers.get("cache-control")).toContain("public");
        expect(result.headers.get("x-content-type-options")).toBe("nosniff");
        expect(Buffer.from(await result.arrayBuffer())).toEqual(png);
    });
    it("bloqueia o OpenAPI sem buscar o endereço interno", async () => {
        const response = await GET(
            new Request(
                "https://ictite.test/api/image?url=http://localhost:8000/openapi.json"
            )
        );
        expect(response.status).toBe(403);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(getMock).not.toHaveBeenCalled();
    });
    it.each(["application/json", "text/html", "image/svg+xml"])(
        "recusa conteúdo %s",
        async (type) => {
            replies.push({ type });
            await expect(
                fetchNewsImage("https://cdninstagram.com/image")
            ).rejects.toMatchObject({ status: 415 });
        }
    );
    it("recusa JSON disfarçado de imagem", async () => {
        replies.push({ chunks: [Buffer.from('{"password":"never returned"}')] });
        await expect(
            fetchNewsImage("https://cdninstagram.com/image")
        ).rejects.toMatchObject({ status: 415 });
    });
    it.each([true, false])(
        "limita tamanho com ou sem Content-Length: %s",
        async (declared) => {
            replies.push(
                declared
                    ? { length: String(MAX_NEWS_IMAGE_BYTES + 1) }
                    : { chunks: [png, Buffer.alloc(MAX_NEWS_IMAGE_BYTES)] }
            );
            await expect(
                fetchNewsImage("https://cdninstagram.com/image")
            ).rejects.toMatchObject({ status: 413 });
        }
    );
    it("segue redirecionamento relativo permitido", async () => {
        replies.push({ status: 302, location: "/other.png" }, {});
        expect((await fetchNewsImage("https://cdninstagram.com/image")).bytes).toEqual(
            Uint8Array.from(png)
        );
        expect(getMock.mock.calls[1][0].href).toBe("https://cdninstagram.com/other.png");
    });
    it("recusa redirecionamento interno antes de conectar", async () => {
        replies.push({ status: 302, location: "http://127.0.0.1/openapi.json" });
        await expect(
            fetchNewsImage("https://cdninstagram.com/image")
        ).rejects.toMatchObject({ status: 403 });
        expect(getMock).toHaveBeenCalledTimes(1);
    });
    it("limita ciclos de redirecionamento", async () => {
        replies.push(
            ...Array.from({ length: 4 }, () => ({ status: 302, location: "/again" }))
        );
        await expect(
            fetchNewsImage("https://cdninstagram.com/image")
        ).rejects.toMatchObject({ status: 502 });
        expect(getMock).toHaveBeenCalledTimes(4);
    });
    it("interrompe a transferência e responde timeout", async () => {
        const controller = new AbortController();
        vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
        getMock.mockImplementation(() => {
            const request = new EventEmitter();
            queueMicrotask(() => {
                controller.abort();
                request.emit("error", new Error("aborted"));
            });
            return request;
        });
        await expect(
            fetchNewsImage("https://cdninstagram.com/image")
        ).rejects.toMatchObject({ status: 504 });
    });
    it("resposta sem URL não é armazenada em cache", async () => {
        const response = await GET(new Request("https://ictite.test/api/image"));
        expect(response.status).toBe(400);
        expect(response.headers.get("cache-control")).toBe("no-store");
    });
});
