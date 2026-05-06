import { describe, it, expect, beforeEach } from 'vitest';
import { mockMatchMedia } from '../vitest.setup.js';

// Re-import per test to reset module state if any. The composable does not
// keep singleton state, but importing inside `it` blocks keeps tests isolated.

async function loadComposable() {
  const mod = await import('../src/composables/useTheme.js');
  return mod.useTheme;
}

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('defaults to dark when no localStorage and system prefers dark', async () => {
    mockMatchMedia(false); // prefersLight = false → dark
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('defaults to light when no localStorage and system prefers light', async () => {
    mockMatchMedia(true);
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reads localStorage="dark" overriding system pref', async () => {
    mockMatchMedia(true); // system says light
    localStorage.setItem('theme', 'dark');
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reads localStorage="light" overriding system pref', async () => {
    mockMatchMedia(false); // system says dark
    localStorage.setItem('theme', 'light');
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('falls back to system pref when localStorage value is invalid', async () => {
    mockMatchMedia(true);
    localStorage.setItem('theme', 'banana');
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('light');
  });

  it('toggle() flips theme, persists to localStorage, and updates data-theme', async () => {
    mockMatchMedia(false); // start dark
    const useTheme = await loadComposable();
    const { theme, toggle } = useTheme();
    expect(theme.value).toBe('dark');

    toggle();
    expect(theme.value).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    toggle();
    expect(theme.value).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('after a manual toggle, ignores subsequent system pref changes', async () => {
    const mq = mockMatchMedia(false); // start dark (system)
    const useTheme = await loadComposable();
    const { theme, toggle } = useTheme();

    toggle(); // user picks light
    expect(theme.value).toBe('light');

    mq.fireSystemChange(true); // system flips to light — no change observable
    mq.fireSystemChange(false); // system flips to dark — should NOT change theme
    expect(theme.value).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('without manual override, follows system pref changes', async () => {
    const mq = mockMatchMedia(false); // start dark
    const useTheme = await loadComposable();
    const { theme } = useTheme();
    expect(theme.value).toBe('dark');

    mq.fireSystemChange(true); // system flips to light
    expect(theme.value).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    // localStorage stays empty — no manual override happened
    expect(localStorage.getItem('theme')).toBeNull();
  });
});
