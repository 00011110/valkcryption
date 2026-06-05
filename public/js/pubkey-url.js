'use strict';

/** X25519 public key, base64url (no padding). */
export const PUBKEY_COMPACT_RE = /^[A-Za-z0-9_-]{40,48}$/;

export function isValidPublicKeyCompact(compact) {
  return typeof compact === 'string' && PUBKEY_COMPACT_RE.test(compact);
}

export function publicKeyToUrl(base, compact) {
  if (!isValidPublicKeyCompact(compact)) throw new Error('invalid public key');
  return `${base.replace(/\/$/, '')}/k/${compact}`;
}