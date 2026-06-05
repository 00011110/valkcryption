'use strict';

/** Overwrite string contents in a Buffer copy, then discard (best-effort in V8). */
function zeroizeString(str) {
  if (typeof str !== 'string' || str.length === 0) return;
  const buf = Buffer.from(str, 'utf8');
  buf.fill(0);
}

module.exports = { zeroizeString };