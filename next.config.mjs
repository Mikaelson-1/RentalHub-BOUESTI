import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { withSentryConfig } from '@sentry/nextjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root detection when running from a git worktree
  outputFileTracingRoot: __dirname,
  // Keep dev and production artifacts separate to avoid cache collisions.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    // Only allow images from trusted storage providers.
    // Add your CDN / object-storage hostname here when you migrate from base64.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Vercel Blob storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry configuration
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in production
  silent: process.env.NODE_ENV !== 'production',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to avoid ad blockers
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,
});
