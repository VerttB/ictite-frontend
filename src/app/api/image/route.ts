import { fetchNewsImage, NewsImageError } from "@/core/utils/newsImageProxy";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response("Informe o endereço da imagem.", {
            status: 400,
            headers: { "Cache-Control": "no-store" },
        });
    }

    try {
        const image = await fetchNewsImage(url);
        return new Response(image.bytes, {
            headers: {
                "Content-Type": image.contentType,
                "Cache-Control": "public, max-age=86400",
                "X-Content-Type-Options": "nosniff",
                "Content-Security-Policy": "default-src 'none'; sandbox",
            },
        });
    } catch (error) {
        return new Response(
            error instanceof NewsImageError
                ? error.message
                : "Não foi possível carregar a imagem.",
            {
                status: error instanceof NewsImageError ? error.status : 502,
                headers: { "Cache-Control": "no-store" },
            }
        );
    }
}
