import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "troika-three-text"],
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
