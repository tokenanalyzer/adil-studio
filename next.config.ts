import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingExcludes: {
    "*": [
      "./supabase/**/*",
      "./**/*.sql"
    ]
  }
};

export default nextConfig;
