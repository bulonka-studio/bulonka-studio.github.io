import { afterEach } from 'vitest';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.clear(); } catch { /* JSDOM safety */ }
});
