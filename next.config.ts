import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
      {
        pathname: '/api/image-proxy',
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
