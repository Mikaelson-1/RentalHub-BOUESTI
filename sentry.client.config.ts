import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  dist: process.env.VERCEL_ENV || "local",

  // Session replay disabled — enable if you want video-style replays in Sentry.
  // replaysSessionSampleRate: 0.01,
  // replaysOnErrorSampleRate: 1.0,
});
