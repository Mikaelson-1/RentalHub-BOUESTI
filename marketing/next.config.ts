import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      // Uncomment when adding real listing images from Cloudinary:
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default config;
