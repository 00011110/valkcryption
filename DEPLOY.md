# Deploying Valkcryption

No npm install step. Requires **Node.js 22+** (built-in SQLite).

## Environment

Copy `.env.example` and set at least:

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Public HTTPS origin (no trailing slash), e.g. `https://paste.example.com` |
| `GITHUB_URL` | Repository URL for the “Source” footer link |
| `DATA_DIR` | Writable directory for SQLite + rate-limit pepper |
| `PORT` / `HOST` | Listen address (often `127.0.0.1` behind a reverse proxy) |
| `TRUST_PROXY` | Set `1` when behind nginx/Caddy so rate limits see client IPs |

```bash
export BASE_URL=https://paste.example.com
export GITHUB_URL=https://github.com/you/valkcryption
export DATA_DIR=./data
export PORT=8443
export HOST=127.0.0.1
export TRUST_PROXY=1
node server.js
```

## Reverse proxy (TLS)

Terminate HTTPS in Caddy, nginx, or similar. Proxy to the Node process.

**Caddy (example)**

```
paste.example.com {
	encode gzip
	reverse_proxy 127.0.0.1:8443
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Frame-Options "DENY"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "no-referrer"
	}
}
```

**systemd (example)** — adjust paths and user to your layout:

```ini
[Unit]
Description=Valkcryption
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/valkcryption
EnvironmentFile=/opt/valkcryption/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

## Access logs and `?m=` links

Prefer `#m=` links (fragments are not sent to the server). If users must use `?m=` fallback, configure your reverse proxy to **not log query strings**, or redact `m=` — otherwise ciphertext could appear once in access logs.

## Verify

- Create a profile link, send a message, open the paste URL in the recipient browser — decrypt works.
- Same link in a private window without key backup — decrypt should fail.