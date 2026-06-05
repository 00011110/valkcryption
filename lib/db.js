'use strict';

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

function openDatabase(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'valkcryption.sqlite');
  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS public_ids (
      short_id TEXT PRIMARY KEY,
      public_key_compact TEXT NOT NULL,
      public_key_hash TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_public_ids_expires ON public_ids(expires_at);
  `);
  return db;
}

function purgeExpired(db, now = Date.now()) {
  db.prepare('DELETE FROM public_ids WHERE expires_at < ?').run(now);
}

function registerPublicId(db, { shortId, publicKeyCompact, publicKeyHash, expiresAt }, now = Date.now()) {
  purgeExpired(db, now);
  const byHash = db
    .prepare('SELECT short_id FROM public_ids WHERE public_key_hash = ? AND expires_at > ?')
    .get(publicKeyHash, now);
  if (byHash && byHash.short_id !== shortId) {
    return { error: 'collision', field: 'public_key_hash' };
  }
  const byId = db.prepare('SELECT public_key_hash FROM public_ids WHERE short_id = ?').get(shortId);
  if (byId && byId.public_key_hash !== publicKeyHash) {
    return { error: 'collision', field: 'short_id' };
  }
  db.prepare(
    `INSERT INTO public_ids (short_id, public_key_compact, public_key_hash, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(short_id) DO UPDATE SET
       public_key_compact = excluded.public_key_compact,
       public_key_hash = excluded.public_key_hash,
       expires_at = excluded.expires_at`
  ).run(shortId, publicKeyCompact, publicKeyHash, now, expiresAt);
  return { ok: true };
}

function getPublicId(db, shortId, now = Date.now()) {
  purgeExpired(db, now);
  return db
    .prepare(
      `SELECT short_id, public_key_compact, public_key_hash, expires_at
       FROM public_ids WHERE short_id = ? AND expires_at > ?`
    )
    .get(shortId, now);
}

module.exports = {
  openDatabase,
  purgeExpired,
  registerPublicId,
  getPublicId,
};