/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dev and production artifacts separate to avoid cache collisions.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
