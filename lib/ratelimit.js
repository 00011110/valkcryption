'use strict';

/** In-memory buckets keyed by hashed client id only. Entries expire within RATE_WINDOW_MS. */
const buckets = new Map();
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 5 * 60 * 1000);

function purgeBuckets(now = Date.now()) {
  for (const [key, b] of buckets) {
    if (now - b.start > RATE_WINDOW_MS) buckets.delete(key);
  }
}

function rateLimit(hashedClientKey, { max = 30 } = {}) {
  const now = Date.now();
  purgeBuckets(now);
  let b = buckets.get(hashedClientKey);
  if (!b || now - b.start > RATE_WINDOW_MS) {
    b = { start: now, count: 0 };
    buckets.set(hashedClientKey, b);
  }
  b.count += 1;
  return b.count <= max;
}

module.exports = { rateLimit, RATE_WINDOW_MS, purgeBuckets };