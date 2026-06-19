'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const { zeroizeString } = require('./lib/zeroize');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8443);
const HOST = process.env.HOST || '0.0.0.0';
const BASE_URL = (process.env.BASE_URL || 'https://valkcryption.com').replace(/\/$/, '');
const GITHUB_URL = (process.env.GITHUB_URL || 'https://github.com/00011110/valkcryption').replace(/\/$/, '');

const PUBKEY_COMPACT_RE = /^[A-Za-z0-9_-]{40,48}$/;

const AD_FOOTER = fs.readFileSync(path.join(ROOT, 'public', 'partials', 'ad-footer.html'), 'utf8');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
};

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

function renderPage(file, extra = {}) {
  return injectPage(loadTemplate(file), extra);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, BASE_URL);
  try {
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

    const keyMatch = url.pathname.match(/^\/k\/([A-Za-z0-9_-]+)$/);
    if (keyMatch && PUBKEY_COMPACT_RE.test(keyMatch[1])) {
      return sendHtml(
        res,
        200,
        renderPage('key.html', { PAGE_BOOT: JSON.stringify({ publicKeyCompact: keyMatch[1] }) })
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
