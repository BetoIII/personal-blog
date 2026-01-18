import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  transpilePackages: ["geist"],
  // Suppress sourcemap warnings in development
  productionBrowserSourceMaps: false,
  // Allow images from Notion
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        protocol: "https",
        hostname: "notion.so",
      },
    ],
  },
  experimental: {
    // Suppress turbopack sourcemap warnings
    turbo: {
      rules: {
        "*.ts": {
          loaders: ["ts-loader"],
        },
      },
    },
  },
  // Suppress webpack warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default withMDX(nextConfig);
