/** @type {import('next').NextConfig} */
// import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';
const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
    reactStrictMode: true,
    // webpack5: true,
    swcMinify: true,
   
    webpack: (config) => {
        config.cache = {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename],
            },
            // cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
        };
        return config;
    },
};

export default bundleAnalyzer(nextConfig);
