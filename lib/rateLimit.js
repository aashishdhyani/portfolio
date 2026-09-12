// Basic in-memory rate limiter.
//
// NOTE: this state lives in the Node.js process, so it resets on restart
// and is NOT shared across multiple serverless instances (e.g. separate
// Lambda invocations on Vercel). It's fine as a first line of defense
// against obvious abuse from a single client, but for real production
// traffic protection, replace this with a shared store such as
// Upstash Redis or Vercel KV.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map();

export function isRateLimited(identifier) {
  const now = Date.now();
  const entry = hits.get(identifier);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(identifier, { windowStart: now, count: 1 });
    return false;
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return true;
  }

  return false;
}
