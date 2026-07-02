import { afterEach } from 'vitest';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.clear(); } catch { /* JSDOM safety */ }
});

/**
 * Stub window.matchMedia for theme tests.
 * Pass `prefersLight` to choose which media query matches.
 * Returns { fireSystemChange(nextPrefersLight) } so tests can simulate OS theme change.
 */
export function mockMatchMedia(prefersLight) {
  let listeners = [];
  let current = !!prefersLight;
  const make = (query) => {
    const isLightQuery = query === '(prefers-color-scheme: light)';
    return {
      get matches() { return isLightQuery ? current : !current; },
      media: query,
      addEventListener: (_, cb) => { listeners.push({ cb, isLightQuery }); },
      removeEventListener: (_, cb) => { listeners = listeners.filter(l => l.cb !== cb); },
      dispatchEvent: () => false,
    };
  };
  Object.defineProperty(window, 'matchMedia', { writable: true, configurable: true, value: make });
  return {
    fireSystemChange(nextPrefersLight) {
      current = !!nextPrefersLight;
      listeners.forEach(({ cb, isLightQuery }) => {
        cb({ matches: isLightQuery ? current : !current });
      });
    },
  };
}
