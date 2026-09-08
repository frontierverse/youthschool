import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 20 MiB of files, plus multipart headers and the post text.
      bodySizeLimit: "21mb",
    },
  },
};

export default nextConfig;
