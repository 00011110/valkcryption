'use strict';

/**
 * Humble footer slideshow — silent, no video/audio.
 * Edit public/ads.json to add slots; set enabled: true.
 */
(async function initAds() {
  const root = document.getElementById('ad-footer');
  if (!root) return;

  let config;
  try {
    const res = await fetch('/ads.json', { cache: 'no-store' });
    config = await res.json();
  } catch {
    root.hidden = true;
    return;
  }

  if (!config.enabled || !Array.isArray(config.slots) || config.slots.length === 0) {
    root.hidden = true;
    return;
  }

  const label = document.getElementById('ad-label');
  const track = document.getElementById('ad-slideshow');
  if (!track) return;

  if (label && config.label) label.textContent = config.label;

  const slots = config.slots.filter((s) => s && (s.text || s.image));
  if (slots.length === 0) {
    root.hidden = true;
    return;
  }

  root.hidden = false;
  const interval = Math.max(5000, Number(config.intervalMs) || 10000);

  slots.forEach((slot, i) => {
    const slide = document.createElement('div');
    slide.className = 'ad-slide';
    slide.dataset.index = String(i);
    if (i === 0) slide.classList.add('active');

    const inner = document.createElement(slot.href ? 'a' : 'div');
    if (slot.href) {
      inner.href = slot.href;
      inner.rel = 'noopener noreferrer sponsored';
      inner.target = '_blank';
    }

    if (slot.image) {
      const img = document.createElement('img');
      img.src = slot.image;
      img.alt = slot.alt || slot.text || 'Sponsor';
      img.loading = 'lazy';
      img.decoding = 'async';
      inner.appendChild(img);
    }
    if (slot.text) {
      const span = document.createElement('span');
      span.className = 'ad-text';
      span.textContent = slot.text;
      inner.appendChild(span);
    }

    slide.appendChild(inner);
    track.appendChild(slide);
  });

  let idx = 0;
  const slides = track.querySelectorAll('.ad-slide');

  function show(n) {
    slides.forEach((el, j) => el.classList.toggle('active', j === n));
  }

  if (slides.length > 1) {
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, interval);
  }
})();