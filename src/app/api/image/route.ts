export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return new Response("Missing url", { status: 400 });
    }

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        if (!res.ok) {
            return new Response("Failed to fetch image", { status: 500 });
        }

        const buffer = await res.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": res.headers.get("content-type") || "image/jpeg",
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (err) {
        return new Response("Error fetching image", { status: 500 });
    }
}
