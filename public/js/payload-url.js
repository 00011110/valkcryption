'use strict';

import { zeroizeString } from './zeroize.js';

export const MAX_FRAGMENT_URL = 2000;

export function payloadToUrl(base, payload) {
  const json = JSON.stringify(payload);
  const b64 = b64url(new TextEncoder().encode(json));
  const url = `${base.replace(/\/$/, '')}/p#m=${b64}`;
  if (url.length > MAX_FRAGMENT_URL) {
    throw new Error(`Link too long (${url.length} chars). Shorten your message.`);
  }
  return url;
}

/** Fallback when a client strips # fragments — may appear once in proxy logs. */
export function payloadToUrlQuery(base, payload) {
  const json = JSON.stringify(payload);
  const b64 = b64url(new TextEncoder().encode(json));
  const url = `${base.replace(/\/$/, '')}/p?m=${b64}`;
  if (url.length > MAX_FRAGMENT_URL) {
    throw new Error(`Link too long (${url.length} chars). Shorten your message.`);
  }
  return url;
}

export function parsePayloadB64(b64) {
  if (!b64 || !/^[A-Za-z0-9_-]+$/.test(b64)) return null;
  try {
    const json = new TextDecoder().decode(b64urlDecode(b64));
    const payload = JSON.parse(json);
    if (payload?.v !== 1 || !payload.c || !payload.s) return null;
    return payload;
  } catch {
    return null;
  }
}

export function payloadFromHash(hash) {
  if (!hash || !hash.startsWith('#')) return null;
  const m = hash.match(/^#m=([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  return parsePayloadB64(m[1]);
}

/**
 * Read ciphertext from #m= (preferred) or ?m= (fallback).
 * If ?m= was used, move to # and strip query immediately, then zeroize the query copy.
 */
export function consumePayloadFromUrl() {
  const fromHash = payloadFromHash(location.hash);
  if (fromHash) return { payload: fromHash, via: 'fragment' };

  const params = new URLSearchParams(location.search);
  const raw = params.get('m');
  if (!raw) return { payload: null, via: null };

  const payload = parsePayloadB64(raw);

  if (payload) {
    history.replaceState(null, '', `${location.pathname}#m=${raw}`);
  } else {
    history.replaceState(null, '', location.pathname);
  }
  params.delete('m');
  zeroizeString(raw);

  return { payload, via: 'query' };
}

function b64url(bytes) {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}