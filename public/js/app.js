'use strict';

import { decryptMessage, encryptMessage } from './crypto.js';
import { exportBackup, importBackup, loadIdentity } from './keys.js';
import { consumePayloadFromUrl, payloadToUrl, payloadToUrlQuery } from './payload-url.js';
import { zeroizePayload } from './zeroize.js';

const BASE = document.querySelector('meta[name="base-url"]')?.content?.replace(/\/$/, '') || '';
const BOOT = window.__VC_BOOT__ || {};

function $(id) {
  return document.getElementById(id);
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const prev = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => {
      btn.textContent = prev;
    }, 1400);
  });
}

function fmtExpiry(ms) {
  if (ms <= 0) return 'expired';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d ? `${d}d ` : ''}${h}h ${m}m ${sec}s`;
}

function tickExpiry(el, expiresAt) {
  if (!el || !expiresAt) return;
  const tick = () => {
    el.textContent = `Expires in ${fmtExpiry(expiresAt - Date.now())}`;
  };
  tick();
  setInterval(tick, 1000);
}

function loadName() {
  const input = $('name');
  if (!input) return;
  input.value = localStorage.getItem('vc_name') || '';
  input.addEventListener('input', () => localStorage.setItem('vc_name', input.value.trim()));
}

function withName(text) {
  const n = localStorage.getItem('vc_name');
  return n ? `${n}: ${text}` : text;
}

async function registerShortId(identity) {
  let shortId = localStorage.getItem('vc_short_id');
  if (!shortId) {
    shortId = randomShortId();
  }
  const res = await fetch(`${BASE}/api/u`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shortId,
      publicKeyCompact: identity.compact,
      publicKeyHash: identity.publicKeyHash,
    }),
  });
  const data = await res.json();
  if (res.status === 409) {
    for (let i = 0; i < 5; i++) {
      shortId = randomShortId();
      const retry = await fetch(`${BASE}/api/u`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortId,
          publicKeyCompact: identity.compact,
          publicKeyHash: identity.publicKeyHash,
        }),
      });
      const rd = await retry.json();
      if (retry.ok) {
        localStorage.setItem('vc_short_id', rd.shortId);
        return rd;
      }
    }
    throw new Error('could not register profile id');
  }
  if (!res.ok) throw new Error(data.error || 'register failed');
  localStorage.setItem('vc_short_id', data.shortId);
  return data;
}

function randomShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  const arr = crypto.getRandomValues(new Uint8Array(8));
  for (let i = 0; i < 8; i++) s += chars[arr[i] % chars.length];
  return s;
}

function buildProfileInvite(profileUrl) {
  return withName(
    `Let's talk privately via Valkcryption (encrypted in the browser — the site operator can't read messages).

1) Open this link in Chrome/Firefox/Safari (not an in-app preview if you can avoid it):
${profileUrl}

2) Write your message and send me back the encrypted link it gives you.

My messages only decrypt in my browser; back up keys if you switch devices.`
  );
}

async function initCompose() {
  const identity = await loadIdentity();
  const pubEl = $('my-pubkey');
  const linkEl = $('my-link');
  const reg = await registerShortId(identity);
  const profileUrl = `${BASE}/u/${reg.shortId}`;

  if (pubEl) pubEl.textContent = identity.compact;
  if (linkEl) linkEl.textContent = profileUrl;

  const params = new URLSearchParams(location.search);
  const toParam = params.get('to');
  const peerInput = $('peer-key');
  if (toParam && peerInput) peerInput.value = toParam;

  if (BOOT.shortId) {
    const r = await fetch(`${BASE}/api/u/${BOOT.shortId}`);
    const data = await r.json();
    if (r.ok && peerInput) peerInput.value = data.publicKeyCompact;
  }

  $('copy-profile')?.addEventListener('click', () => {
    copyText(buildProfileInvite(profileUrl), $('copy-profile'));
  });

  $('btn-create')?.addEventListener('click', async () => {
    const peer = $('peer-key')?.value.trim();
    const plain = $('plaintext')?.value || '';
    if (!peer) {
      alert('Paste the recipient public key or open their /u/ link first.');
      return;
    }
    if (!plain) {
      alert('Write a message first.');
      return;
    }
    const payload = await encryptMessage(plain, peer, {
      compact: identity.compact,
      privateKey: identity.privateKey,
    });
    let msgUrl;
    try {
      msgUrl = payloadToUrl(BASE, payload);
    } catch (e) {
      alert(e.message || 'Link too long');
      return;
    }
    const out = $('output');
    const footer = `\n\n---\nthis message was encrypted with Valkcryption. Only the intended recipient can decrypt it in their browser. The server never receives this ciphertext (it is in the # part of the URL).\n${msgUrl}`;
    const full = withName(msgUrl) + footer;
    if (out) out.value = full;
    $('result-block')?.classList.remove('hidden');
  });

  $('copy-output')?.addEventListener('click', () => {
    const out = $('output');
    if (out) copyText(out.value, $('copy-output'));
  });

  $('copy-output-query')?.addEventListener('click', async () => {
    const peer = $('peer-key')?.value.trim();
    const plain = $('plaintext')?.value || '';
    if (!peer || !plain) return;
    const payload = await encryptMessage(plain, peer, {
      compact: identity.compact,
      privateKey: identity.privateKey,
    });
    try {
      const qUrl = payloadToUrlQuery(BASE, payload);
      copyText(withName(qUrl), $('copy-output-query'));
    } catch (e) {
      alert(e.message);
    }
  });
}

async function initPaste() {
  const identity = await loadIdentity();
  const status = $('decrypt-status');
  const plainEl = $('decrypted');
  const expiryEl = $('paste-expiry');

  let senderCompact = null;

  const setupReply = () => {
    $('btn-reply')?.addEventListener('click', async () => {
      const reply = $('reply-plain')?.value || '';
      if (!reply || !senderCompact) return;
      const payload = await encryptMessage(reply, senderCompact, {
        compact: identity.compact,
        privateKey: identity.privateKey,
      });
      try {
        const msgUrl = payloadToUrl(BASE, payload);
        const footer = `\n\n---\nthis message was encrypted with Valkcryption. Only the intended recipient can decrypt it in their browser. The server never receives this ciphertext (it is in the # part of the URL).\n${msgUrl}`;
        const full = withName(msgUrl) + footer;
        const out = $('reply-output');
        if (out) out.value = full;
        $('reply-block')?.classList.remove('hidden');
      } catch (e) {
        alert(e.message || 'Link too long');
      }
    });
    $('copy-reply')?.addEventListener('click', () => {
      const out = $('reply-output');
      if (out) copyText(out.value, $('copy-reply'));
    });
  };

  try {
    const { payload, via } = consumePayloadFromUrl();
    if (!payload) {
      if (status) {
        status.textContent = 'No message in this link. Use the full URL including #m=… (or ?m=… fallback).';
      }
      setupReply();
      return;
    }
    if (expiryEl) {
      expiryEl.textContent =
        via === 'query'
          ? '?m= was converted to #m= and wiped from the address bar. Prefer # links when possible.'
          : 'Ciphertext is in #m=… — not sent to the server.';
    }
    if (status) status.textContent = 'Decrypted locally in your browser.';
    const plain = await decryptMessage(payload, identity.privateKey);
    zeroizePayload(payload);
    if (plainEl) plainEl.textContent = plain;
    senderCompact = payload.s;
    if ($('peer-key')) $('peer-key').value = senderCompact;
    setupReply();
  } catch {
    if (status) status.textContent = 'Cannot decrypt — wrong device, cleared keys, or corrupted link.';
    if (plainEl) plainEl.textContent = '';
    $('key-missing')?.classList.remove('hidden');
    setupReply();
  }
}

async function initUser() {
  const shortId = BOOT.shortId;
  const res = await fetch(`${BASE}/api/u/${shortId}`);
  const data = await res.json();
  if (!res.ok) {
    $('user-status').textContent = 'Profile not found or expired.';
    return;
  }
  $('user-pubkey').textContent = data.publicKeyCompact;
  tickExpiry($('user-expiry'), data.expiresAt);
  $('compose-link').href = `${BASE}/?to=${encodeURIComponent(data.publicKeyCompact)}`;
}

async function initKeys() {
  $('export-btn')?.addEventListener('click', async () => {
    const pass = $('backup-pass')?.value;
    if (!pass || pass.length < 8) {
      alert('Use a passphrase of at least 8 characters.');
      return;
    }
    const backup = await exportBackup(pass);
    $('backup-json').value = JSON.stringify(backup);
  });
  $('import-btn')?.addEventListener('click', async () => {
    const pass = $('backup-pass')?.value;
    try {
      const backup = JSON.parse($('backup-json')?.value || '');
      await importBackup(pass, backup);
      alert('Keys restored. Reload other tabs.');
    } catch {
      alert('Import failed — check passphrase and backup file.');
    }
  });
}

function initPrivacy() {
  $('purge-server')?.addEventListener('click', () => {
    alert(
      'Default message links keep ciphertext in the URL hash only (not on server). Your private keys live only in this browser — use Keys page to export a backup before clearing site data.'
    );
  });
}

loadName();
initPrivacy();

const page = document.body.dataset.page;
if (page === 'compose') initCompose();
if (page === 'paste') initPaste();
if (page === 'user') initUser();
if (page === 'keys') initKeys();