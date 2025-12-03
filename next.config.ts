import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // Generate routes as directories with index.html (e.g., /metrics/index.html)
  /* config options here */
};

export default nextConfig;
