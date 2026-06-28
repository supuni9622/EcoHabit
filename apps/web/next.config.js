const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.unsplash.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    // Add alias for monorepo packages (points directly to src, bypassing build)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ecohabit/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@ecohabit/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@ecohabit/firebase': path.resolve(__dirname, '../../packages/firebase/src'),
    };

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
