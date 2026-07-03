/* global crypto */
'use strict';

const VC_DOMAIN = new TextEncoder().encode('valkcryption.com|msg|v1');

export async function generateKeyPair() {
  const pair = await crypto.subtle.generateKey({ name: 'X25519' }, true, ['deriveKey', 'deriveBits']);
  const pubRaw = await crypto.subtle.exportKey('raw', pair.publicKey);
  const compact = b64url(new Uint8Array(pubRaw));
  const privJwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
  return { pair, compact, privJwk, publicKey: pair.publicKey, privateKey: pair.privateKey };
}

export async function importPublicKeyCompact(compact) {
  const raw = b64urlDecode(compact);
  return crypto.subtle.importKey('raw', raw, { name: 'X25519' }, true, []);
}

export async function importPrivateJwk(jwk) {
  return crypto.subtle.importKey('jwk', jwk, { name: 'X25519' }, true, ['deriveKey', 'deriveBits']);
}

async function deriveMessageKey(privateKey, publicKey) {
  const bits = await crypto.subtle.deriveBits(
    { name: 'X25519', public: publicKey },
    privateKey,
    256
  );
  const ikm = new Uint8Array(bits);
  const salt = new Uint8Array(0);
  const info = VC_DOMAIN;
  const key = await crypto.subtle.importKey('raw', await hkdf(ikm, salt, info, 32), { name: 'AES-GCM' }, false, [
    'decrypt',
    'encrypt',
  ]);
  return key;
}

async function hkdf(ikm, salt, info, length) {
  const base = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    base,
    length * 8
  );
}

export async function encryptMessage(plaintext, recipientCompact, senderKeys) {
  const recipientPub = await importPublicKeyCompact(recipientCompact);
  const aesKey = await deriveMessageKey(senderKeys.privateKey, recipientPub);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(iv.length + enc.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(enc), iv.length);
  const senderCompact = senderKeys.compact;
  return {
    v: 1,
    c: b64url(combined),
    s: senderCompact,
  };
}

export async function decryptMessage(payload, recipientPrivateKey) {
  const senderPub = await importPublicKeyCompact(payload.s);
  const aesKey = await deriveMessageKey(recipientPrivateKey, senderPub);
  const combined = b64urlDecode(payload.c);
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, data);
  return new TextDecoder().decode(plain);
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