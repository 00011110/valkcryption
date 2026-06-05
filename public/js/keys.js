'use strict';

import { generateKeyPair, importPrivateJwk, publicKeyHash } from './crypto.js';

const DB_NAME = 'valkcryption';
const STORE = 'keys';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadIdentity() {
  let record = await idbGet('identity');
  if (record?.privJwk) {
    const privateKey = await importPrivateJwk(record.privJwk);
    return {
      compact: record.compact,
      privJwk: record.privJwk,
      publicKeyHash: record.publicKeyHash,
      privateKey,
      publicKey: null,
      createdAt: record.createdAt,
    };
  }
  const { compact, privJwk, privateKey, publicKey } = await generateKeyPair();
  const hash = await publicKeyHash(compact);
  record = { compact, privJwk, publicKeyHash: hash, createdAt: Date.now() };
  await idbSet('identity', record);
  return { compact, privJwk, publicKeyHash: hash, privateKey, publicKey, createdAt: record.createdAt };
}

export async function replaceIdentity(record) {
  await idbSet('identity', record);
  return loadIdentity();
}

export async function exportBackup(passphrase) {
  const record = await idbGet('identity');
  if (!record) throw new Error('no keys');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    await pbkdf2(passphrase, salt),
    'AES-GCM',
    false,
    ['encrypt']
  );
  const enc = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    new TextEncoder().encode(JSON.stringify(record))
  );
  return {
    v: 1,
    salt: b64(new Uint8Array(salt)),
    iv: b64(new Uint8Array(iv)),
    data: b64(new Uint8Array(enc)),
  };
}

export async function importBackup(passphrase, backup) {
  const salt = unb64(backup.salt);
  const iv = unb64(backup.iv);
  const data = unb64(backup.data);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    await pbkdf2(passphrase, salt),
    'AES-GCM',
    false,
    ['decrypt']
  );
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, keyMaterial, data);
  const record = JSON.parse(new TextDecoder().decode(dec));
  await idbSet('identity', record);
  return loadIdentity();
}

async function pbkdf2(passphrase, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, [
    'deriveBits',
  ]);
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 310_000, hash: 'SHA-256' },
    base,
    256
  );
}

function b64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function unb64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}