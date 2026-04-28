# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server with HMR
npm run build      # production build to dist/
npm run preview    # serve the built dist/ locally to verify before pushing
npm run test       # vitest in watch mode
npm run test:run   # vitest one-shot
npm run check      # full verification: tests + build + no-react + no-tracking + bundle-size
```

The build is the only correctness signal for markup/styling; `vitest` covers the `useTheme` composable; `npm run check` enforces the privacy/perf budgets from the design spec.

## Architecture

Vue 3 + Vite multi-page static site. **No SPA router.** Each route is a real HTML file emitted by Vite from a separate input:

- `index.html`              → `dist/index.html`              (mounts `pages/Home.vue`)
- `work/index.html`         → `dist/work/index.html`         (mounts `pages/Work.vue`)
- `contact/index.html`      → `dist/contact/index.html`      (mounts `pages/Contact.vue`)

Each HTML file imports its own tiny entry script in `src/entries/`. Each entry imports the same `src/App.vue` shell (`<Skip-link> <Nav> <PageSlot> <Footer>`) and passes the appropriate page component as a prop.

**Theme system** (spec §6.6):
- CSS custom properties in `src/styles/tokens.css`, switched via `[data-theme="dark|light"]` on `<html>`.
- A short inline `<head>` script reads `localStorage.theme` (or system preference) and applies the attribute *before* paint to prevent flash of wrong theme.
- `src/composables/useTheme.js` exposes `{ theme, toggle }`. `toggle()` flips the theme, persists to localStorage, and writes the attribute. After a manual toggle, system-pref changes are ignored. With no manual toggle, the composable follows the system.
- The theme toggle button (`src/components/ThemeToggle.vue`) is the only Vue component that uses `useTheme`. With JavaScript disabled, the button never mounts, and the page falls back to system preference via `@media (prefers-color-scheme)` rules in `tokens.css`.

**Privacy / perf invariants enforced by `npm run check`:**
- Zero references to React in package.json or any source file.
- Zero references to known tracking hosts (Google Analytics/Fonts, GTM, Facebook, Segment, Mixpanel, Hotjar, Amplitude, Sentry, Cloudflare Insights) anywhere in `dist/`.
- Per-page bundle budget: ≤ 50 kB JS gzipped, ≤ 15 kB CSS gzipped.

**No web fonts loaded** — system font stack only. Adding `link rel="preconnect"` to a font CDN will fail `check:no-tracking`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. **Every merge to `main` is a production deploy** to https://bulonka-studio.com (custom domain set via `public/CNAME`).

The Vite `base` is controlled by the `GITHUB_PAGES_BASE` env var (`vite.config.js`). CI sets it to `/` because the site is served at the apex of the custom domain — not at `/<repo>/`. If you ever disable the custom domain, `base` must change to `/bulonka-studio.github.io/` or asset URLs will 404.

## Static assets

- Anything in `public/` is copied verbatim into `dist/` at build time and is **not** processed by Vite. `public/privacy/index.html` is a hand-maintained standalone page (privacy policy) — it is not part of the React/Vue bundle.
- `public/CNAME` must contain only `bulonka-studio.com`. GitHub Pages reads this file to bind the custom domain; deleting or modifying it will break the live domain.
- `files/` (repo root, not `public/`) holds source brand assets (icons, preview image) and is **not** shipped to production.
