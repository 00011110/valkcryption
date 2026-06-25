'use strict';

import { decryptMessage, encryptMessage } from './crypto.js';
import { exportBackup, importBackup, loadIdentity } from './keys.js';
import { consumePayloadFromUrl, payloadToUrl, payloadToUrlQuery } from './payload-url.js';
import {
  assertPublicKeyCompact,
  isValidPublicKeyCompact,
  publicKeyFromPath,
  publicKeyToUrl,
} from './pubkey-url.js';
import { growAllTextareas, growTextarea } from './auto-grow.js';
import { zeroizePayload } from './zeroize.js';

const BASE =
  (typeof location !== 'undefined' && location.origin) ||
  document.querySelector('meta[name="base-url"]')?.content?.replace(/\/$/, '') ||
  '';

function cryptoUnavailableMessage() {
  const port = location.port || '8443';
  if (location.hostname === '0.0.0.0') {
    return `Web Crypto is blocked on 0.0.0.0. Open http://127.0.0.1:${port} instead.`;
  }
  return `Could not access Web Crypto. Open http://127.0.0.1:${port} (not IP-only HTTP).`;
}

function boot() {
  return window.__VC_BOOT__ || {};
}

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

function formatOutgoingPaste(linkUrl) {
  return (
    withName(linkUrl) +
    '\n\n---\nEncrypted with Valkcryption. Only the recipient can decrypt in their browser. Ciphertext is in the # part of the link above.'
  );
}

function buildKeyInvite(keyUrl) {
  return withName(
    `Let's talk privately via Valkcryption (encrypted in the browser — the site operator can't read messages).

1) Open this link in Chrome/Firefox/Safari (not an in-app preview if you can avoid it):
${keyUrl}

2) Write your message and send me back the encrypted link it gives you.

My messages only decrypt in my browser; back up keys if you switch devices.`
  );
}

function fillPeerKey(compact) {
  const peerInput = $('peer-key');
  if (peerInput && isValidPublicKeyCompact(compact)) peerInput.value = compact;
}

async function initCompose() {
  const pubEl = $('my-pubkey');
  const linkEl = $('my-link');
  let identity;
  let keyUrl;
  try {
    if (!globalThis.crypto?.subtle) throw new Error('no subtle');
    identity = await loadIdentity();
    keyUrl = publicKeyToUrl(BASE, identity.compact);
    if (pubEl) pubEl.textContent = identity.compact;
    if (linkEl) linkEl.textContent = keyUrl;
  } catch {
    if (pubEl) pubEl.textContent = cryptoUnavailableMessage();
    if (linkEl) linkEl.textContent = '—';
    return;
  }

  const params = new URLSearchParams(location.search);
  const toParam = params.get('to');
  if (toParam) fillPeerKey(toParam);
  const fromPath = publicKeyFromPath();
  if (fromPath) fillPeerKey(fromPath);
  else if (boot().publicKeyCompact) fillPeerKey(boot().publicKeyCompact);

  $('copy-key-link')?.addEventListener('click', () => {
    copyText(buildKeyInvite(keyUrl), $('copy-key-link'));
  });

  $('btn-create')?.addEventListener('click', async () => {
    const peer = $('peer-key')?.value.trim();
    const plain = $('plaintext')?.value || '';
    if (!peer || !isValidPublicKeyCompact(peer)) {
      alert('Paste a valid recipient public key or open their /k/… link first.');
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
    const full = formatOutgoingPaste(msgUrl);
    if (out) {
      out.value = full;
      $('result-block')?.classList.remove('hidden');
      growTextarea(out);
    }
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
        const full = formatOutgoingPaste(msgUrl);
        const out = $('reply-output');
        if (out) {
          out.value = full;
          $('reply-block')?.classList.remove('hidden');
          growTextarea(out);
        }
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
    fillPeerKey(senderCompact);
    setupReply();
  } catch {
    if (status) status.textContent = 'Cannot decrypt — wrong device, cleared keys, or corrupted link.';
    if (plainEl) plainEl.textContent = '';
    $('key-missing')?.classList.remove('hidden');
    setupReply();
  }
}

async function initKey() {
  const el = $('key-pubkey');
  const compact = publicKeyFromPath() || boot().publicKeyCompact;
  if (!compact) {
    if (el) el.textContent = 'No public key in URL.';
    return;
  }
  try {
    await assertPublicKeyCompact(compact);
  } catch {
    if (el) el.textContent = 'Invalid public key in URL.';
    return;
  }
  if (el) el.textContent = compact;
  const link = $('compose-link');
  if (link) link.href = `${BASE}/?to=${encodeURIComponent(compact)}`;
}

async function initKeys() {
  $('export-btn')?.addEventListener('click', async () => {
    const pass = $('backup-pass')?.value;
    if (!pass || pass.length < 8) {
      alert('Use a passphrase of at least 8 characters.');
      return;
    }
    const backup = await exportBackup(pass);
    const box = $('backup-json');
    if (box) {
      box.value = JSON.stringify(backup);
      growTextarea(box);
    }
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

function initPgp() {
  $('pgp-toggle')?.addEventListener('click', () => {
    const b = $('pgp-block');
    if (b) b.style.display = b.style.display === 'block' ? 'none' : 'block';
  });
}

function initPrivacy() {
  $('purge-server')?.addEventListener('click', () => {
    alert(
      'Message links keep ciphertext in the URL hash only (not on server). Your private keys live only in this browser — use Keys page to export a backup before clearing site data.'
    );
  });
}

loadName();
initPgp();
initPrivacy();
growAllTextareas();

const page = document.body.dataset.page;
if (page === 'compose') initCompose().catch(() => {});
if (page === 'paste') initPaste().catch(() => {});
if (page === 'key') initKey().catch(() => {});
if (page === 'keys') initKeys();