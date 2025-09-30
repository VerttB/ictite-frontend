import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["picsum.photos", "200.128.66.226", "images.unsplash.com", "plus.unsplash.com"],
    unoptimized: true
    
  },
  output:'standalone',
  basePath: '/ictite/v1/web',
   

};

export default nextConfig;
