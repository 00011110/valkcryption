'use strict';

/** Grow textarea to fit content; page scrolls, no inner scrollbars. */
export function growTextarea(el) {
  if (!el || el.tagName !== 'TEXTAREA') return;
  el.style.resize = 'none';
  el.style.overflow = 'hidden';

  const fit = () => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  if (!el.dataset.growBound) {
    el.dataset.growBound = '1';
    el.addEventListener('input', fit);
  }
  fit();
}

export function growAllTextareas(root = document) {
  root.querySelectorAll('textarea').forEach(growTextarea);
}