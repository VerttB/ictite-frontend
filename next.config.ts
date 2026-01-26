import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: isProd ? '/ictite/v1/web' : '',
  assetPrefix: isProd ? '/ictite/v1/web' : '',
  trailingSlash: true,
  images: {
    domains: ["picsum.photos", "200.128.66.226", "images.unsplash.com", "plus.unsplash.com", "localhost", "minimakerlab.com.br"],
    unoptimized: isProd ? true : false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ]
  },
};

export default nextConfig;
