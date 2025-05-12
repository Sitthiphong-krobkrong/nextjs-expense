import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? "/nextjs-expense" : "",
  assetPrefix: isProd ? "/nextjs-expense/" : "",
};

export default nextConfig;
