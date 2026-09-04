import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://3.25.164.245:8000/:path*",
      },
    ];
  },
};

export default nextConfig;