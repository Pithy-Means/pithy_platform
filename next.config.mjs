import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});




import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
// import withBundleAnalyzer from "@next/bundle-analyzer";

// Resolve __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const bundleAnalyzer = withBundleAnalyzer({
  //   enabled: process.env.ANALYZE === "true",
  // });

  /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Webpack Configuration
  webpack: (config) => {
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [resolve(__dirname, "next.config.mjs")],
      },
      cacheDirectory: resolve(__dirname, ".next/cache/webpack"),
    };
    return config;
  },
  // Cache-Control Headers
  async headers() {
    return [
      {
        source:
          "/(.*).(js|css|woff|woff2|ttf|otf|eot|ico|jpg|jpeg|png|svg|gif|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};
export default withPWAConfig(nextConfig);

// module.exports = withPWA(nextConfig);
