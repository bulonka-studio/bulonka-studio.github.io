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
npm run check      # full verification: tests + build + no-react + no-tracking + no-purple + bundle-size
```

The build is the only correctness signal for markup/styling; `vitest` covers the `useTheme` composable; `npm run check` enforces the privacy/perf budgets from the design spec.

## Architecture

Vue 3 + Vite multi-page static site. **No SPA router.** Each route is a real HTML file emitted by Vite from a separate input:

- `index.html`              → `dist/index.html`              (mounts `pages/Home.vue`)
- `work/index.html`         → `dist/work/index.html`         (mounts `pages/Work.vue`)
- `contact/index.html`      → `dist/contact/index.html`      (mounts `pages/Contact.vue`)
- `privacy/index.html`      → `dist/privacy/index.html`      (static HTML — no Vue mount)

Each HTML file imports its own tiny entry script in `src/entries/`. Each entry imports the same `src/App.vue` shell (`<Skip-link> <Nav> <PageSlot> <Footer>`) and passes the appropriate page component as a prop.

**Prerendering:** `npm run build` runs three steps: client build → `vite build --ssr src/entries/ssr.js --outDir dist-ssr` → `node scripts/prerender.mjs`, which injects each page's rendered HTML into `dist/*.html` (so pages work without JavaScript) and deletes `dist-ssr/`. Entries hydrate with `createSSRApp` when `#app` has children. `ThemeToggle` is client-only-mounted in `Nav.vue` (SSR would crash on `window.matchMedia`); a 44px placeholder prevents layout shift.

**Theme system** (spec §6.6):
- CSS custom properties in `src/styles/tokens.css`, switched via `[data-theme="dark|light"]` on `<html>`.
- A short inline `<head>` script reads `localStorage.theme` (or system preference) and applies the attribute *before* paint to prevent flash of wrong theme.
- `src/composables/useTheme.js` exposes `{ theme, toggle }`. `toggle()` flips the theme, persists to localStorage, and writes the attribute. After a manual toggle, system-pref changes are ignored. With no manual toggle, the composable follows the system.
- The theme toggle button (`src/components/ThemeToggle.vue`) is the only Vue component that uses `useTheme`. With JavaScript disabled, the button never mounts, and the page falls back to system preference via `@media (prefers-color-scheme)` rules in `tokens.css`.

**Privacy / perf invariants enforced by `npm run check`:**
- Zero references to React in package.json or any source file.
- Zero references to known tracking hosts (Google Analytics/Fonts, GTM, Facebook, Segment, Mixpanel, Hotjar, Amplitude, Sentry, Cloudflare Insights) anywhere in `dist/`.
- Zero references to the retired Material 3 purple palette (`BB86FC`, `6750A4`, `D4A8FF`) or the literal word `purple`. Enforced by `scripts/check-no-purple.mjs`.
- Per-page bundle budget: ≤ 50 kB JS gzipped, ≤ 15 kB CSS gzipped.

**No web fonts loaded** — system font stack only. Adding `link rel="preconnect"` to a font CDN will fail `check:no-tracking`.

**Surface design (palette, typography, copy, motion):**
- Canonical spec: `docs/superpowers/specs/2026-07-02-light-is-on-design.md` — supersedes the layout/typography/motion sections of the 2026-04-29 colorful-home spec (which remains authoritative for voice, palette values, and brand mark).
- Brand color: `#8B4A2E` (deep terracotta) primary, `#C97B5C` light companion. Five accent tokens: ochre, sage, sky, rose (day) plus ember (night-only).
- Decorations are inline SVG in one stroke-based line language (2px, rounded caps, one filled accent each): window scene (Home hero, merges sun+lamp), plant (Home), shelf + envelope (Work), mailbox (Contact), grass tufts (Footer).
- All animation is CSS keyframes, gated by `prefers-reduced-motion: reduce` in `src/styles/base.css`.
- Copy guidelines (no rhythmic tricolons, no "X — not Y" reversals, no arrow CTAs, em-dash budget, sentence-case labels) live in spec §4. Two scoped exceptions: the hero greeting strings ("Hi — come in", "The lamp is on — come in") and the today-on-workbench block use a softer voice.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. **Every merge to `main` is a production deploy** to https://bulonka-studio.com (custom domain set via `public/CNAME`).

The Vite `base` is controlled by the `GITHUB_PAGES_BASE` env var (`vite.config.js`). CI sets it to `/` because the site is served at the apex of the custom domain — not at `/<repo>/`. If you ever disable the custom domain, `base` must change to `/bulonka-studio.github.io/` or asset URLs will 404.

## Static assets

- Anything in `public/` is copied verbatim into `dist/` at build time and is **not** processed by Vite.
- `privacy/index.html` (repo root) is a hand-maintained static page wired as a Vite input. No Vue, no entry script — it flows through the build only so the base-URL rewriting stays consistent with the other pages.
- `public/CNAME` must contain only `bulonka-studio.com`. GitHub Pages reads this file to bind the custom domain; deleting or modifying it will break the live domain.
- `files/` (repo root, not `public/`) holds source brand assets (icons, preview image) and is **not** shipped to production.
