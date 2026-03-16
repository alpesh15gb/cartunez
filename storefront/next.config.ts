import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nhone.in',
      },
      {
        protocol: 'https',
        hostname: 'dieseltronic.in',
      },
      {
        protocol: 'https',
        hostname: 'www.neowheels.com',
      },
    ],
  },
};

export default nextConfig;
