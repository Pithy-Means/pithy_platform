import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import withPWA from "next-pwa";

// Resolve __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracing: true,
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "development",
  },
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

// Configure PWA with improved settings
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  maximumFileSizeToCacheInBytes: 5000000,
  fallbacks: {
    // Fallbacks help the PWA be more reliable
    document: '/offline', // Fallback HTML document
  },
});

// Export the configuration with PWA enabled
export default withPWAConfig(nextConfig);