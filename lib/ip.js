'use strict';

const crypto = require('node:crypto');

function normalizeIp(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let ip = raw.trim();
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (ip.includes(',')) ip = ip.split(',')[0].trim();
  if (ip.startsWith('[') && ip.endsWith(']')) ip = ip.slice(1, -1);
  return ip;
}

function readClientIp(req, trustProxy) {
  if (trustProxy) {
    const xff = req.headers['x-forwarded-for'];
    if (xff) return normalizeIp(String(xff));
    const real = req.headers['x-real-ip'];
    if (real) return normalizeIp(String(real));
  }
  return normalizeIp(req.socket.remoteAddress || '');
}

/**
 * One-way key for rate limiting. Raw IP is not stored; buffer is zero-filled after use.
 */
function rateLimitKey(req, trustProxy, pepper) {
  const ipBuf = Buffer.from(readClientIp(req, trustProxy), 'utf8');
  try {
    return crypto.createHmac('sha256', pepper).update(ipBuf).digest('hex');
  } finally {
    ipBuf.fill(0);
  }
}

module.exports = { rateLimitKey };