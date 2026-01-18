import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  transpilePackages: ["geist"],
  // Suppress sourcemap warnings in development
  productionBrowserSourceMaps: false,
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
