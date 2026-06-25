# Deploying Valkcryption

No npm install step. Requires **Node.js 18+**. The app is **stateless** (no database).

## Environment

Copy `.env.example` and set at least:

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Public HTTPS origin (no trailing slash), e.g. `https://paste.example.com` |
| `GITHUB_URL` | Repository URL for the “Source” footer link |
| `PORT` / `HOST` | Listen address (often `127.0.0.1` behind a reverse proxy) |

```bash
export BASE_URL=https://paste.example.com
export GITHUB_URL=https://github.com/you/valkcryption
export PORT=8443
export HOST=127.0.0.1
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

**systemd (example)**

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

- Copy your `/k/…` share link, send a message, open the paste URL in the recipient browser — decrypt works.
- Same link in a private window without key backup — decrypt should fail.