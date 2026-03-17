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
      {
        protocol: 'https',
        hostname: 'autoformindia.com',
      },
      {
        protocol: 'https',
        hostname: 'api.autoformindia.com',
      },
      {
        protocol: 'https',
        hostname: 'cartunez.in',
      },
    ],
  },
};

export default nextConfig;
