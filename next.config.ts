import type { NextConfig } from "next";

// Public site URL: explicit env wins, otherwise fall back to the Vercel production domain at build time.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
};

export default nextConfig;
