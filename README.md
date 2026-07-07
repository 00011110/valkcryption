# Valkcryption

Pastebin-style **true end-to-end** encrypted links for chatting over Discord, email, SMS, etc.

- Keys: generated in the browser (X25519), stored in IndexedDB
- Server: **stateless** — no database. Message ciphertext lives in `#m=…`; public keys live in share URLs (`/k/…`)
- Zero npm dependencies — Node.js 18+ (no SQLite required)

> **Note:** As of the July 7 2026 update, Valkcryption uses `valkcryption.com|msg|v2`. Links encrypted before July 7 2026 (with v1 or earlier) cannot be decrypted here.
> To access old encrypted chats you must self-host the previous version of the code yourself.

## Quick start (local)

```bash
cp .env.example .env   # optional; edit BASE_URL / GITHUB_URL
export BASE_URL=http://127.0.0.1:8443 PORT=8443 HOST=0.0.0.0
# For JS server:
node server.js
# For Go server (from go/ dir):
cd go && go run .
```

Open `http://127.0.0.1:8443/`.

## Flow

1. Open `/` — copy your share link (`/k/{yourPublicKey}`)
2. Send that link to someone (one time)
3. They open it → write a message → copy `https://your-host/p/…#m=…`
4. You open the paste link in the **same browser** where your keys live → decrypt → reply

Back up keys at `/keys` before clearing browser data.

## Self-host

See [DEPLOY.md](DEPLOY.md). Set `BASE_URL` to your public HTTPS origin and `GITHUB_URL` to this repository (footer “Source” link).

## Optional footer sponsors

Edit `public/ads.json` — see [ADS.md](ADS.md).

## Security

See [SECURITY.md](SECURITY.md).