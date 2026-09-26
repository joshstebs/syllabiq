/**
 * Tiny in-memory token-bucket rate limiter for brute-forceable and
 * quota-burning endpoints (auth, chat).
 *
 * NOTE on scope: this is per serverless instance and resets on cold start
 * or redeploy. That's a deliberate trade-off — no new infra (Redis/Upstash)
 * was added. It still stops naive brute force and runaway scripts, which is
 * the threat being addressed. If abuse becomes targeted, graduate to a
 * shared store.
 */

interface Bucket {
  tokens: number;
  lastRefillMs: number;
}

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the map can't grow forever on a long-lived instance.
let lastSweepMs = 0;
function sweep(nowMs: number, windowMs: number) {
  if (nowMs - lastSweepMs < 60_000) return;
  lastSweepMs = nowMs;
  for (const [key, bucket] of buckets) {
    if (nowMs - bucket.lastRefillMs > windowMs * 2) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds the client should wait before retrying (0 when allowed). */
  retryAfterSec: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const nowMs = Date.now();
  sweep(nowMs, windowMs);

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefillMs: nowMs };
    buckets.set(key, bucket);
  }

  // Refill proportionally to elapsed time.
  const elapsedMs = nowMs - bucket.lastRefillMs;
  if (elapsedMs > 0) {
    bucket.tokens = Math.min(limit, bucket.tokens + (elapsedMs / windowMs) * limit);
    bucket.lastRefillMs = nowMs;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterSec: 0 };
  }

  // Time until one token is available.
  const retryAfterSec = Math.max(1, Math.ceil(((1 - bucket.tokens) / limit) * (windowMs / 1000)));
  return { allowed: false, retryAfterSec };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitedResponse(retryAfterSec: number, message = "Too many requests. Please slow down and try again shortly.") {
  return Response.json(
    { error: message, retryAfterSec },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}
