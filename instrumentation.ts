// Sentry Server-side Instrumentation
// This file is automatically loaded by Next.js during server startup

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,

      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
      dist: process.env.VERCEL_ENV || "local",
    });
  }
}
