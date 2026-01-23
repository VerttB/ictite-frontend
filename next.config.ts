import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: "standalone",
    basePath: isProd ? "/ictite/v1/web" : "",
    assetPrefix: isProd ? "/ictite/v1/web" : "",
    trailingSlash: true,
    reactCompiler: true,
    typedRoutes: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "http", hostname: "200.128.66.226" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },
            { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
            { protocol: "https", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
            { protocol: "https", hostname: "minimakerlab.com.br" },
            { protocol: "https", hostname: "simcc.uesc.br", pathname: "/**" },
            { protocol: "http", hostname: "simcc.uesc.br", pathname: "/**" },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
