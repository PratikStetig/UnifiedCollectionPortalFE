import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',  // Tells Next.js to prepare a static export
  // Add any other custom configuration here if needed
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
