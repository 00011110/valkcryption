'use strict';

/** Best-effort wipe of UTF-8 bytes copied from a string (JS strings are immutable). */
export function zeroizeString(str) {
  if (typeof str !== 'string' || !str.length) return;
  const u = new TextEncoder().encode(str);
  u.fill(0);
}

export function zeroizePayload(payload) {
  if (!payload) return;
  zeroizeString(payload.c);
  zeroizeString(payload.s);
}