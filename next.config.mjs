/** @type {import('next').NextConfig} */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Resolve __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
   
    webpack: (config) => {
        config.cache = {
            type: 'filesystem',
            buildDependencies: {
                config: [resolve(__dirname, 'next.config.mjs')],
            },
            cacheDirectory: resolve(__dirname, '.next/cache/webpack'),
        };
        return config;
    },
};

export default bundleAnalyzer(nextConfig);
