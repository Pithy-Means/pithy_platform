/** @type {import('next').NextConfig} */

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import withBundleAnalyzer from "@next/bundle-analyzer";
import chokidar from "chokidar";

// Resolve __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const nextConfig = {
  reactStrictMode: true,  // keep react strict for better practices
  // swcMinify: true,  // No longer configurable

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
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay rebuild after the first change
    };

    // Custom watcher using chokidar
    const watcher = chokidar.watch(resolve(__dirname, "src/**/*"), {
      ignored: /node_modules/, // Ignore node_modules
      persistent: true,
    });

    watcher.on("change", (path) => {
      console.log(`[chokidar] File changed: ${path}`);
      // Here you can add additional logic, like triggering a rebuild
    });

    return config;
  },
  
  // Cache-Control Headers
  async headers() {
    return [
      {
        source:
          "/(.*).(js|css|woff|woff2|ttf|otf|eot|ico|jpg|jpeg|png|svg|gif|webp|avif)",
        // source: "/:path*",
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
  images: {
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.microlink.io',
          pathname: '/**', // This allows images from any path on this domain
        },
      ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // // Incremental Static Regeneration not configured globally but per page basis
  // async revalidate() {
  //     return {
  //         revalidate: 60, // Revalidate pages every 60 seconds
  //     };
  // },
};

export default bundleAnalyzer(nextConfig);
