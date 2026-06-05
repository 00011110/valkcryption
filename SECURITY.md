# Valkcryption security model

## True end-to-end

- **X25519 + AES-256-GCM** in the browser (Web Crypto API).
- **Private keys** live in IndexedDB on the user device only.
- **Messages** live in the URL fragment (`/p#m=…`). Browsers do not send `#…` to the server.

## What you still need to trust

| Trust | Why |
|-------|-----|
| **JavaScript delivery** | A compromised server could serve malicious JS and exfiltrate keys. |
| **URL / platform metadata** | Chat apps see the full link you paste (ciphertext, not plaintext). |

## What you do *not* need to trust

- **Operator reading messages** — we never receive ciphertext or plaintext for messages.
- **Same Wi‑Fi users** — each browser has its own keypair.

## Cryptographic context string

Message AEAD uses the fixed domain separator `valkcryption|msg|v1` (see `public/js/crypto.js`). **Do not change it** on a live instance — existing links would fail to decrypt.

## Limits

- New device / cleared site data → import key backup from `/keys`.
- Long messages → longer URLs (~2000 char practical limit).
- Some in-app browsers strip URL fragments — open in Safari/Chrome when possible.