import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: "standalone",
    basePath: isProd ? "/ictite/v1/web" : "",
    assetPrefix: isProd ? "/ictite/v1/web" : "",
    trailingSlash: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "http", hostname: "200.128.66.226" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },
            { protocol: "http", hostname: "localhost" },
            { protocol: "https", hostname: "minimakerlab.com.br" },
        ],
        unoptimized: isProd ? true : false,
    },
};

export default nextConfig;
