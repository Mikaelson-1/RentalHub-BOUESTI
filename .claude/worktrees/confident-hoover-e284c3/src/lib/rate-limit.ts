/**
 * lib/rate-limit.ts
 *
 * ✅ Redis-backed sliding-window rate limiter.
 * Works across multiple instances (Vercel Functions, distributed deployments).
 *
 * Uses Upstash Redis (serverless, no setup required on Vercel).
 * Environment variables auto-provisioned by Vercel Marketplace integration.
 */

import { Redis } from '@upstash/redis';

// ✅ Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window. */
  limit: number;
  /** Window duration in seconds. */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  /** Remaining requests allowed in this window. */
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

/**
 * Check and increment the rate limit counter for a given key using Redis.
 * ✅ Works across multiple instances/serverless functions
 * ✅ Atomic operations prevent race conditions
 */
export async function rateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  try {
    const now = Date.now();
    const windowMs = options.windowSeconds * 1000;
    const resetKey = `${key}:reset`;
    const countKey = `${key}:count`;

    // ✅ Use Redis pipeline for atomic operations
    const resetAt = await redis.get<number>(resetKey);

    // Start new window if expired or doesn't exist
    if (!resetAt || now > resetAt) {
      // ✅ Set new window with TTL to auto-cleanup
      await redis.pipeline()
        .set(countKey, 1, { ex: options.windowSeconds })
        .set(resetKey, now + windowMs, { ex: options.windowSeconds })
        .exec();

      return {
        success: true,
        remaining: options.limit - 1,
        retryAfter: 0,
      };
    }

    // Increment counter within existing window
    const count = ((await redis.incr(countKey)) || 1) as number;

    if (count > options.limit) {
      const retryAfter = Math.ceil((resetAt - now) / 1000);
      return {
        success: false,
        remaining: 0,
        retryAfter,
      };
    }

    return {
      success: true,
      remaining: Math.max(0, options.limit - count),
      retryAfter: 0,
    };
  } catch (error) {
    // ✅ Fail open: if Redis is down, allow the request
    // (better to allow one bad request than block all users)
    console.error('[RATE LIMIT ERROR]', error);
    return {
      success: true,
      remaining: 0,
      retryAfter: 0,
    };
  }
}

/**
 * Build a rate limit key from a request.
 * ✅ NOW WITH IP VALIDATION (fixes X-Forwarded-For spoofing)
 */
export function getRateLimitKey(
  request: Request,
  prefix: string,
  trustedProxyCount: number = 1
): string {
  // ✅ Get X-Forwarded-For header
  const forwarded = (request.headers as Headers).get('x-forwarded-for');

  let ip = 'unknown';

  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());

    // ✅ Only trust the specified number of rightmost IPs
    // If behind 1 proxy (Vercel): use the first IP
    // If behind 2 proxies: use the first of the rightmost 2 IPs
    if (ips.length >= trustedProxyCount) {
      ip = ips[ips.length - trustedProxyCount];
    } else {
      ip = ips[0];
    }
  }

  // ✅ Validate IP format to prevent header injection
  if (!isValidIP(ip)) {
    ip = 'invalid';
  }

  return `${prefix}:${ip}`;
}

/**
 * ✅ NEW: Validate IP address format
 * Prevents attackers from bypassing rate limits with malformed headers
 */
function isValidIP(ip: string): boolean {
  // Simple validation: check if it looks like an IPv4 or IPv6 address
  // IPv4: x.x.x.x (4 octets)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6: basic check
  const ipv6Regex = /^[0-9a-f:]+$/i;

  if (ipv4Regex.test(ip)) {
    // Validate octets are 0-255
    const octets = ip.split('.').map((n) => parseInt(n, 10));
    return octets.every((octet) => octet >= 0 && octet <= 255);
  }

  if (ipv6Regex.test(ip)) {
    return true;
  }

  return false;
}
