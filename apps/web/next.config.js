const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.unsplash.com'],
  },
  webpack: (config) => {
    // Add alias for monorepo packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ecohabit/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@ecohabit/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@ecohabit/firebase': path.resolve(__dirname, '../../packages/firebase/src'),
    };

    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
