import { ref, watch } from 'vue';

const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

function readSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return DARK;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
}

function readStoredTheme() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === DARK || v === LIGHT ? v : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const stored = readStoredTheme();
  const isManual = ref(stored !== null);
  const theme = ref(stored ?? readSystemTheme());

  applyTheme(theme.value);

  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onSystemChange = (e) => {
    if (isManual.value) return;
    theme.value = e.matches ? LIGHT : DARK;
  };
  mq.addEventListener('change', onSystemChange);

  // flush: 'sync' makes data-theme updates observable without `await nextTick()`,
  // which keeps the tests simple and matches the user expectation that toggling
  // the theme repaints immediately.
  watch(theme, (next) => { applyTheme(next); }, { flush: 'sync' });

  function toggle() {
    const next = theme.value === DARK ? LIGHT : DARK;
    isManual.value = true;
    theme.value = next; // triggers the synchronous watcher above
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* no-op */ }
  }

  return { theme, toggle };
}
