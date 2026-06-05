'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');

const { rateLimitKey } = require('./lib/ip');
const { rateLimit } = require('./lib/ratelimit');
const { zeroizeString } = require('./lib/zeroize');
const dbm = require('./lib/db');

const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const PORT = Number(process.env.PORT || 8443);
const HOST = process.env.HOST || '0.0.0.0';
const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:8443').replace(/\/$/, '');
const GITHUB_URL = (process.env.GITHUB_URL || 'https://github.com/YOUR_USERNAME/valkcryption').replace(/\/$/, '');
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const PUBID_TTL_MS = Number(process.env.PUBID_TTL_MS || 90 * 24 * 60 * 60 * 1000);

const RATE_PEPPER = process.env.RATE_PEPPER || (() => {
  const p = path.join(DATA_DIR, '.rate_pepper');
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  const generated = crypto.randomBytes(32).toString('hex');
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(p, generated, { mode: 0o600 });
  return generated;
})();

const db = dbm.openDatabase(DATA_DIR);

const AD_FOOTER = fs.readFileSync(path.join(ROOT, 'public', 'partials', 'ad-footer.html'), 'utf8');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
};

function readBody(req, max = 16 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => {
      chunks.push(c);
      if (Buffer.concat(chunks).length > max) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(obj));
}

function sendHtml(res, code, html) {
  res.writeHead(code, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; base-uri 'self'; form-action 'self'",
  });
  res.end(html);
}

function loadTemplate(name) {
  return fs.readFileSync(path.join(ROOT, 'public', name), 'utf8');
}

function injectPage(template, vars) {
  let html = template;
  const all = { BASE_URL, GITHUB_URL, AD_FOOTER, ...vars };
  for (const [k, v] of Object.entries(all)) {
    html = html.split(`{{${k}}}`).join(String(v ?? ''));
  }
  if (!html.includes('id="ad-footer"')) {
    html = html.replace('</body>', `${AD_FOOTER}\n</body>`);
  }
  return html;
}

function serveStatic(urlPath, res) {
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT, 'public', safe);
  if (!filePath.startsWith(path.join(ROOT, 'public')) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const ext = path.extname(filePath);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
}

function clientKey(req) {
  return rateLimitKey(req, TRUST_PROXY, RATE_PEPPER);
}

/** If ?m= present, validate shape and zeroize — never log or embed in HTML. */
function wipeQueryCiphertext(url) {
  const m = url.searchParams.get('m');
  if (m) {
    if (!/^[A-Za-z0-9_-]{16,4096}$/.test(m)) {
      zeroizeString(m);
      return false;
    }
    zeroizeString(m);
  }
  return true;
}

async function handleApi(req, res, url) {
  const rlKey = clientKey(req);
  const now = Date.now();

  if (url.pathname.startsWith('/api/u/') && req.method === 'GET') {
    const shortId = url.pathname.slice('/api/u/'.length);
    if (!/^[a-z0-9]{4,16}$/.test(shortId)) return sendJson(res, 400, { error: 'invalid id' });
    const row = dbm.getPublicId(db, shortId, now);
    if (!row) return sendJson(res, 404, { error: 'not found or expired' });
    return sendJson(res, 200, {
      shortId: row.short_id,
      publicKeyCompact: row.public_key_compact,
      publicKeyHash: row.public_key_hash,
      expiresAt: row.expires_at,
    });
  }

  if (url.pathname === '/api/u' && req.method === 'POST') {
    if (!rateLimit(`u:${rlKey}`, { max: 10 })) {
      return sendJson(res, 429, { error: 'rate limit' });
    }
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return sendJson(res, 400, { error: 'invalid json' });
    }
    const { shortId, publicKeyCompact, publicKeyHash } = body;
    if (!shortId || !publicKeyCompact || !publicKeyHash) {
      return sendJson(res, 400, { error: 'missing fields' });
    }
    if (!/^[a-z0-9]{4,16}$/.test(shortId)) return sendJson(res, 400, { error: 'invalid short id' });
    const result = dbm.registerPublicId(
      db,
      {
        shortId,
        publicKeyCompact,
        publicKeyHash,
        expiresAt: now + PUBID_TTL_MS,
      },
      now
    );
    if (result.error === 'collision') return sendJson(res, 409, { error: 'id or key collision' });
    return sendJson(res, 201, {
      shortId,
      url: `${BASE_URL}/u/${shortId}`,
      expiresAt: now + PUBID_TTL_MS,
    });
  }

  return sendJson(res, 404, { error: 'not found' });
}

function renderPage(file, extra = {}) {
  return injectPage(loadTemplate(file), extra);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, BASE_URL);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);

    if (
      url.pathname.startsWith('/css/') ||
      url.pathname.startsWith('/js/') ||
      url.pathname === '/ads.json'
    ) {
      return serveStatic(url.pathname.slice(1), res);
    }

    if (url.pathname === '/p' || url.pathname === '/p/') {
      if (url.searchParams.has('m')) wipeQueryCiphertext(url);
      return sendHtml(res, 200, renderPage('paste.html'));
    }

    const userMatch = url.pathname.match(/^\/u\/([a-z0-9]{4,16})$/);
    if (userMatch) {
      return sendHtml(
        res,
        200,
        renderPage('user.html', { PAGE_BOOT: JSON.stringify({ shortId: userMatch[1] }) })
      );
    }

    const routes = {
      '/': 'compose.html',
      '/privacy': 'privacy.html',
      '/contact': 'contact.html',
      '/keys': 'keys.html',
    };
    if (routes[url.pathname]) {
      return sendHtml(res, 200, renderPage(routes[url.pathname], { PAGE_BOOT: '{}' }));
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Valkcryption listening on http://${HOST}:${PORT}`);
  console.log(`Public URL: ${BASE_URL}`);
  console.log(`Source: ${GITHUB_URL}`);
});