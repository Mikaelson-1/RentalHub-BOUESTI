import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Uncomment when adding real listing images from Cloudinary:
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default config;
