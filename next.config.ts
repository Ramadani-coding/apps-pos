import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  devIndicators: false,
  images: {
    domains: ["https://akhavsvnzzjxhxyfiebs.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akhavsvnzzjxhxyfiebs.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
