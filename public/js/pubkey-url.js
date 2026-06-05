'use strict';

import { importPublicKeyCompact } from './crypto.js';

/** X25519 public key, base64url (no padding). */
export const PUBKEY_COMPACT_RE = /^[A-Za-z0-9_-]{40,48}$/;

export function isValidPublicKeyCompact(compact) {
  return typeof compact === 'string' && PUBKEY_COMPACT_RE.test(compact);
}

/** Read public key from /k/{compact} (preferred over server-injected boot). */
export function publicKeyFromPath(pathname = location.pathname) {
  const m = String(pathname).match(/^\/k\/([A-Za-z0-9_-]+)\/?$/);
  return m?.[1] ?? null;
}

export async function assertPublicKeyCompact(compact) {
  if (!isValidPublicKeyCompact(compact)) throw new Error('invalid public key');
  await importPublicKeyCompact(compact);
}

export function publicKeyToUrl(base, compact) {
  if (!isValidPublicKeyCompact(compact)) throw new Error('invalid public key');
  return `${base.replace(/\/$/, '')}/k/${compact}`;
}