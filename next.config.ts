import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Rewrite /uploads/* to /api/uploads/* as fallback
  // Primary: standalone serves from .next/standalone/public/uploads/ (symlink)
  // Fallback: API route reads from /app/public/uploads/ directly
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
