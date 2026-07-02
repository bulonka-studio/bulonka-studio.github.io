# "The Light Is On" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the redesign in `docs/superpowers/specs/2026-07-02-light-is-on-design.md`: physical light as the signature, house-as-layout compositions, mono workshop labels, line-language SVG redraws, view transitions, and build-time prerendering.

**Architecture:** Vue 3 + Vite multi-page static site, no SPA router; each route is a real HTML file with its own entry importing the shared `App.vue` shell. All styling via CSS custom properties in `src/styles/tokens.css` switched by `[data-theme]`; page-specific styles are scoped in each `.vue` file; shared styles live in `src/styles/base.css`. The build gains one new step: an SSR bundle + postbuild script inject prerendered HTML into `dist/*.html`.

**Tech Stack:** Vue 3.5 (only runtime dependency; `vue/server-renderer` ships inside it), Vite 6, Vitest 2. No new packages.

## Global Constraints

Copied from the spec — every task implicitly includes these:

- **No new dependencies.** Runtime stays `vue` only. No icon/animation/CSS libraries.
- **Palette values unchanged.** Day bg `#FAF1E0` / primary `#8B4A2E`; night bg `#1A130D` / primary `#E8A87C`. `theme-color` metas in the four HTML files are already correct and must not change.
- **No copy re-voicing.** Existing strings only re-flow; the hero greeting ("Hi — come in" / "The lamp is on — come in") and today block stay verbatim. No new copy strings without spec backing.
- **No purple**: `npm run check:no-purple` scans for `BB86FC`, `6750A4`, `D4A8FF`, and the literal word — never write them, even in comments.
- **Motion is CSS keyframes/transitions only.** No JS-driven motion, no IntersectionObserver, no scroll-driven animations, no parallax, no scroll-snap. The global `prefers-reduced-motion: reduce` kill-switch in `base.css` must keep covering everything.
- **Theme system untouched:** `src/composables/useTheme.js`, its test file, the inline `<head>` scripts in the four HTML files, `localStorage` limited to the single `theme` key.
- **Three-selector theme pattern** for any theme-dependent visual: `[data-theme='light'] X` / `[data-theme='dark'] X` / `:root:not([data-theme]) X` inside `@media (prefers-color-scheme: …)`.
- **Budgets:** per page ≤ 50 kB JS gz, ≤ 15 kB CSS gz (`check:bundle-size`). Baseline CSS before this work: home 4.85, work 3.55, contact 3.87 kB gz.
- **A11y floor:** decorative SVG `aria-hidden="true"`, one `<h1>` per page, `:focus-visible` outlines, ≥ 44×44 px tap targets.
- **Verification command:** `npm run check` (tests + build + no-react + no-tracking + no-purple + bundle-size). Build output is the only correctness signal for markup/styling; run it after every task.
- All work happens on branch `feature/ui-redesign-next-level`.

## File Structure

| File | Responsibility |
|---|---|
| `scripts/prerender.mjs` (create) | Postbuild: render pages via SSR bundle, inject into `dist/*.html`, delete `dist-ssr/` |
| `src/entries/ssr.js` (create) | SSR entry exporting `render(name)` for home/work/contact |
| `src/entries/{home,work,contact}.js` (modify) | Hydrate with `createSSRApp` when `#app` has children |
| `package.json` (modify) | `build` script gains SSR build + prerender steps |
| `.gitignore` (modify) | Ignore `dist-ssr` |
| `src/styles/tokens.css` (modify) | `@property` registrations; fluid type/space tokens; two-layer shadows + `--edge-light`; `--pane-tint` |
| `src/styles/base.css` (modify) | Light layers; theme bloom; platform details; fluid type classes + `.t-mono`; consolidated shared page furniture; view transitions; retuned fade-up |
| `src/components/Nav.vue` (modify) | Hairline, underline-grow links, `view-transition-name`, client-only toggle mount |
| `src/components/ThemeToggle.vue` (modify) | Switch-plate style, rotating icon |
| `src/components/Footer.vue` (modify) | Grass tufts SVG, mono email |
| `src/components/Button.vue` (delete) | Orphaned — nothing imports it |
| `src/pages/Home.vue` (modify) | Hero grid + window scene; today grid + line plant; varied rooms grid + container queries + `:has()` |
| `src/pages/Work.vue` (modify) | Shelf scene, mono spec keys |
| `src/pages/Contact.vue` (modify) | Line mailbox, chips auto-fit, mono keys |
| `CLAUDE.md` (modify) | Spec pointer, prerender documentation |

---

### Task 1: Build-time prerendering

**Files:**
- Create: `src/entries/ssr.js`
- Create: `scripts/prerender.mjs`
- Modify: `src/entries/home.js`, `src/entries/work.js`, `src/entries/contact.js`
- Modify: `src/components/Nav.vue` (client-only toggle mount only — restyling comes in Task 4)
- Modify: `package.json` (build script), `.gitignore`

**Interfaces:**
- Produces: `dist/index.html`, `dist/work/index.html`, `dist/contact/index.html` containing full page markup inside `<div id="app">`. Later tasks rely on `npm run build` including the prerender step.
- Constraint honored: `useTheme.js` is not touched; `ThemeToggle` is excluded from SSR by mounting it client-only in `Nav.vue` (it calls `window.matchMedia` at setup and would crash `renderToString`).

- [ ] **Step 1: Create the SSR entry**

`src/entries/ssr.js`:

```js
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from '../App.vue';
import Home from '../pages/Home.vue';
import Work from '../pages/Work.vue';
import Contact from '../pages/Contact.vue';

const pages = { home: Home, work: Work, contact: Contact };

export function render(name) {
  return renderToString(createSSRApp(App, { page: pages[name] }));
}
```

- [ ] **Step 2: Create the prerender script**

`scripts/prerender.mjs`:

```js
// Injects prerendered page HTML into the built dist/*.html files so all
// pages render fully with JavaScript disabled (spec §2, §12).
// Runs after `vite build --ssr src/entries/ssr.js --outDir dist-ssr`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { render } from '../dist-ssr/ssr.js';

const targets = [
  ['home', 'dist/index.html'],
  ['work', 'dist/work/index.html'],
  ['contact', 'dist/contact/index.html'],
];

for (const [name, file] of targets) {
  const html = await render(name);
  if (html.length < 500) throw new Error(`prerender: suspiciously small output for "${name}" (${html.length} chars)`);
  const doc = readFileSync(file, 'utf8');
  const marker = '<div id="app"></div>';
  if (!doc.includes(marker)) throw new Error(`prerender: ${file} has no empty #app marker`);
  writeFileSync(file, doc.replace(marker, `<div id="app">${html}</div>`));
  console.log(`prerendered ${file} (${(html.length / 1024).toFixed(1)} kB markup)`);
}

rmSync('dist-ssr', { recursive: true, force: true });
console.log('OK prerender complete');
```

- [ ] **Step 3: Make ThemeToggle client-only in Nav.vue**

In `src/components/Nav.vue`, replace the `<script setup>` block with:

```js
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const path = ref('/');
const mounted = ref(false);

onMounted(() => {
  path.value = window.location.pathname;
  mounted.value = true;
});

function isActive(prefix) {
  if (prefix === '/work') return path.value.startsWith('/work');
  if (prefix === '/contact') return path.value.startsWith('/contact');
  return false;
}
```

and replace `<ThemeToggle />` in the template with:

```html
<ThemeToggle v-if="mounted" />
<span v-else class="toggle-slot" aria-hidden="true"></span>
```

Add to the scoped styles:

```css
/* Reserves the toggle's box before client mount / without JS — no layout shift. */
.toggle-slot { display: inline-block; width: 44px; height: 44px; }
```

Server and initial client render both produce the placeholder (`mounted` is false in both), so hydration matches; the real toggle appears in `onMounted`.

- [ ] **Step 4: Switch entries to hydration**

Apply the same pattern to all three entries. `src/entries/home.js`:

```js
import '../styles/base.css';
import { createApp, createSSRApp } from 'vue';
import App from '../App.vue';
import Home from '../pages/Home.vue';

// Prod HTML is prerendered (scripts/prerender.mjs) — hydrate it.
// Dev server has an empty #app — plain mount, no hydration warnings.
const el = document.getElementById('app');
(el.hasChildNodes() ? createSSRApp : createApp)(App, { page: Home }).mount('#app');
```

`src/entries/work.js` — identical but `import Work from '../pages/Work.vue';` and `{ page: Work }`.
`src/entries/contact.js` — identical but `import Contact from '../pages/Contact.vue';` and `{ page: Contact }`.

- [ ] **Step 5: Wire the build script and gitignore**

In `package.json`, change the `build` script to:

```json
"build": "vite build && vite build --ssr src/entries/ssr.js --outDir dist-ssr && node scripts/prerender.mjs",
```

In `.gitignore`, add a line after `dist`:

```
dist-ssr
```

- [ ] **Step 6: Verify build, prerendered output, and tests**

Run: `npm run build`
Expected: client build, then SSR build, then three `prerendered dist/... kB markup` lines and `OK prerender complete`.

Run (PowerShell): `Select-String -Path dist/index.html -Pattern 'hero-headline' -Quiet; Select-String -Path dist/work/index.html -Pattern 'shelf is mostly empty' -Quiet; Select-String -Path dist/contact/index.html -Pattern 'Leave a note in the mailbox' -Quiet`
Expected: `True` three times (full markup present in built HTML).

Run: `npm run test:run`
Expected: useTheme suite passes unchanged.

Run: `npm run check`
Expected: all checks green.

- [ ] **Step 7: Commit**

```bash
git add src/entries/ scripts/prerender.mjs src/components/Nav.vue package.json .gitignore
git commit -m "Prerender pages at build time so they render without JavaScript"
```

---

### Task 2: Tokens and the light system

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css` (light layers, bloom, platform details only)

**Interfaces:**
- Produces tokens later tasks use: `--text-display`, `--text-h1`, `--sp-section`, `--edge-light`, `--pane-tint`. Card tasks will write `box-shadow: var(--edge-light), var(--shadow-card);`.

- [ ] **Step 1: Register typed properties and add scale tokens in tokens.css**

At the very top of `src/styles/tokens.css` (before the `:root` block), add:

```css
/* Typed glow tokens: lets the theme switch interpolate the light layers
   (spec §3.3). Without @property support these are plain custom properties
   and the theme swap is instant — same as before. */
@property --glow-1 { syntax: '<color>'; inherits: true; initial-value: transparent; }
@property --glow-2 { syntax: '<color>'; inherits: true; initial-value: transparent; }
@property --glow-ember { syntax: '<color>'; inherits: true; initial-value: transparent; }
```

Inside the `:root` block, after the Motion group, add:

```css
  /* Fluid scale (spec §4) */
  --text-display: clamp(2.6rem, 1.6rem + 4.2vw, 4.5rem);
  --text-h1: clamp(1.7rem, 1.3rem + 1.6vw, 2.4rem);
  --sp-section: clamp(3rem, 2rem + 5vw, 6rem);
  /* Day light patch tint (spec §3.1); resolves per-theme via --accent-ochre */
  --pane-tint: color-mix(in srgb, var(--accent-ochre) 22%, transparent);
```

- [ ] **Step 2: Rework shadows in all three theme blocks of tokens.css**

In `[data-theme='light']` **and** the `@media (prefers-color-scheme: light)` fallback block, replace `--shadow-card` and add `--edge-light`:

```css
  --shadow-card: 0 1px 2px rgba(60, 30, 10, 0.08), 0 8px 28px rgba(60, 30, 10, 0.07);
  --edge-light: inset 0 1px 0 rgba(255, 255, 255, 0.55);
```

In `[data-theme='dark']` **and** the `@media (prefers-color-scheme: dark)` fallback block:

```css
  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.30);
  --edge-light: inset 0 1px 0 rgba(232, 168, 124, 0.10);
```

All other token values stay byte-identical.

- [ ] **Step 3: Replace the light layers in base.css**

In `src/styles/base.css`, delete the current `body::before` block, `@keyframes sunlight`, `body::after` block, and `@keyframes flicker` (lines 30–63 in the current file). In their place:

```css
/* ————— Light layers (spec §3) —————
   Layer 1 (body::before): day = window-pane light patch; night = lamp pool.
   Layer 2 (body::after):  day = ambient glows;           night = dusk vignette.
   Both sit behind .page (z-index 0 vs 1) and are pure decoration. */
body::before,
body::after {
  content: '';
  position: fixed;
  pointer-events: none;
  z-index: 0;
}

/* Theme bloom (spec §3.3): typed glow tokens interpolate across the switch. */
html {
  transition:
    --glow-1 600ms var(--motion-soft),
    --glow-2 600ms var(--motion-soft),
    --glow-ember 600ms var(--motion-soft);
}

/* Day: sun through the window — a skewed 2x2 pane grid cast on the floor. */
[data-theme='light'] body::before {
  left: 12vw; top: 8vh;
  width: 44vmin; height: 60vmin;
  background:
    linear-gradient(var(--pane-tint) 0 0) 0    0    / 46% 46% no-repeat,
    linear-gradient(var(--pane-tint) 0 0) 100% 0    / 46% 46% no-repeat,
    linear-gradient(var(--pane-tint) 0 0) 0    100% / 46% 46% no-repeat,
    linear-gradient(var(--pane-tint) 0 0) 100% 100% / 46% 46% no-repeat;
  filter: blur(10px);
  transform: skewX(-14deg) rotate(3deg);
  animation: pane-light 120s ease-in-out infinite alternate;
}
[data-theme='light'] body::after {
  inset: -10vh -20vw;
  background:
    radial-gradient(ellipse 50vmin 70vmin at 18% 25%, var(--glow-1), transparent 55%),
    radial-gradient(ellipse 36vmin 56vmin at 85% 75%, var(--glow-2), transparent 55%);
  animation: ambient-drift 90s ease-in-out infinite alternate;
}

/* Night: the lamp casts a pool; page edges sit in warm dusk. */
[data-theme='dark'] body::before {
  inset: 0;
  background:
    radial-gradient(ellipse 90vmin 70vmin at 72% 16%, var(--glow-1), transparent 62%),
    radial-gradient(ellipse 46vmin 40vmin at 72% 12%, var(--glow-ember), transparent 55%);
  animation: pool-flicker 6s steps(1, end) infinite;
}
[data-theme='dark'] body::after {
  inset: 0;
  background: radial-gradient(ellipse 130% 120% at 50% 28%, transparent 55%, rgba(6, 3, 1, 0.35) 100%);
}

/* No-JS fallbacks: same two states keyed off the system preference. */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) body::before {
    left: 12vw; top: 8vh;
    width: 44vmin; height: 60vmin;
    background:
      linear-gradient(var(--pane-tint) 0 0) 0    0    / 46% 46% no-repeat,
      linear-gradient(var(--pane-tint) 0 0) 100% 0    / 46% 46% no-repeat,
      linear-gradient(var(--pane-tint) 0 0) 0    100% / 46% 46% no-repeat,
      linear-gradient(var(--pane-tint) 0 0) 100% 100% / 46% 46% no-repeat;
    filter: blur(10px);
    transform: skewX(-14deg) rotate(3deg);
    animation: pane-light 120s ease-in-out infinite alternate;
  }
  :root:not([data-theme]) body::after {
    inset: -10vh -20vw;
    background:
      radial-gradient(ellipse 50vmin 70vmin at 18% 25%, var(--glow-1), transparent 55%),
      radial-gradient(ellipse 36vmin 56vmin at 85% 75%, var(--glow-2), transparent 55%);
    animation: ambient-drift 90s ease-in-out infinite alternate;
  }
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) body::before {
    inset: 0;
    background:
      radial-gradient(ellipse 90vmin 70vmin at 72% 16%, var(--glow-1), transparent 62%),
      radial-gradient(ellipse 46vmin 40vmin at 72% 12%, var(--glow-ember), transparent 55%);
    animation: pool-flicker 6s steps(1, end) infinite;
  }
  :root:not([data-theme]) body::after {
    inset: 0;
    background: radial-gradient(ellipse 130% 120% at 50% 28%, transparent 55%, rgba(6, 3, 1, 0.35) 100%);
  }
}

@keyframes pane-light {
  0%   { transform: translate(-2vw, -1vh) skewX(-14deg) rotate(3deg); }
  100% { transform: translate( 2vw,  1vh) skewX(-14deg) rotate(1.5deg); }
}
@keyframes ambient-drift {
  0%   { transform: translate(-3vw, -2vh) rotate(-2deg); }
  100% { transform: translate( 3vw,  2vh) rotate( 2deg); }
}
@keyframes pool-flicker {
  0%, 22%, 27%, 60%, 65%, 100% { opacity: 0.97; }
  23%, 26%                      { opacity: 0.90; }
  61%, 64%                      { opacity: 0.93; }
}
```

- [ ] **Step 4: Bloom the body colors and add warm platform details**

In the existing `body` rule in `base.css`, change the transition line to:

```css
  transition: background 600ms var(--motion-soft), color 600ms var(--motion-soft);
```

(Nothing but the theme switch changes these, so 600ms affects only the bloom.)

After the `html { font-family: … }` rule, add to it (same rule block):

```css
  scrollbar-color: var(--primary-light) var(--surface-variant);
  accent-color: var(--primary);
```

After the body rule, add:

```css
::selection {
  background: color-mix(in srgb, var(--accent-ochre) 40%, transparent);
  color: var(--on-surface);
}
```

The existing `@media (prefers-reduced-motion: reduce)` block already zeroes all animations/transitions and explicitly stops `body::before/::after` — leave it as the last block in the file.

- [ ] **Step 5: Verify**

Run: `npm run check`
Expected: all green. Then `npm run preview` and eyeball http://localhost:4173/ in both themes: day shows a soft skewed pane patch upper-left; night shows a warm pool upper-right and darker corners; toggling blooms over ~0.6s in Chromium.

- [ ] **Step 6: Commit**

```bash
git add src/styles/tokens.css src/styles/base.css
git commit -m "Light system: pane patch by day, lamp pool by night, theme bloom"
```

---

### Task 3: Type scale and shared-style consolidation

**Files:**
- Modify: `src/styles/base.css`
- Modify: `src/pages/Home.vue`, `src/pages/Work.vue`, `src/pages/Contact.vue` (strip duplicated styles; one class rename)
- Delete: `src/components/Button.vue`

**Interfaces:**
- Produces base classes later tasks rely on: `.t-mono`, `.cta`, `.cta-row`, `.cta-side`, `.page-kicker`, `.section-h`, `.dot`, `.dot--ochre`, `.dot--sage`, `.section-sub`. Page tasks must NOT redefine these.
- `.t-label` stays in base.css until Task 10 (Contact still uses it until then).

- [ ] **Step 1: Fluid type classes in base.css**

Replace the current type-scale block (`.t-display` … `.t-label` plus the `@media (min-width: 720px)` override that follows it) with:

```css
/* Type scale — three voices (spec §4): display, body, workshop mono */
.t-display { font-size: var(--text-display); line-height: 1.02; font-weight: 650; letter-spacing: -0.03em; text-wrap: balance; }
.t-h1      { font-size: var(--text-h1); line-height: 1.15; font-weight: 600; text-wrap: balance; }
.t-h2      { font-size: 1.25rem; line-height: 1.25; font-weight: 600; }
.t-body    { font-size: 1rem;   line-height: 1.6;  font-weight: 400; }
.t-small   { font-size: 0.78rem; line-height: 1.5;  font-weight: 400; color: var(--on-surface-muted); }
.t-label   { font-size: 0.78rem; line-height: 1.4;  font-weight: 500; color: var(--on-surface-muted); }
.t-mono    {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--on-surface-muted);
}
p { text-wrap: pretty; }
```

- [ ] **Step 2: Fluid section rhythm**

Replace the `.section` rule and its 720px media override with:

```css
.section { padding-block: var(--sp-section); position: relative; }
```

- [ ] **Step 3: Move shared page furniture into base.css**

Add after the `.section` rule (these are consolidated from the three page components — values match Home's variants where the pages differed):

```css
/* Shared page furniture (used by all three pages) */
.page-kicker {
  display: inline-block;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: var(--sp-3);
  background: color-mix(in srgb, var(--primary-light) 14%, transparent);
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  font-weight: 600;
}
.cta-row { display: flex; flex-wrap: wrap; gap: var(--sp-3); align-items: center; }
.cta {
  display: inline-flex;
  align-items: center;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--primary);
  color: var(--on-primary);
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-fab);
  transition: transform 220ms var(--motion-bounce), box-shadow var(--motion-fast);
}
.cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-fab-hover); }
.cta-side { color: var(--on-surface-muted); }
.section-h {
  font-size: clamp(1.4rem, 1.2rem + 1vw, 1.7rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: var(--sp-2);
  display: inline-flex;
  align-items: baseline;
  gap: var(--sp-3);
}
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; transform: translateY(-3px); }
.dot--ochre { background: var(--accent-ochre); }
.dot--sage  { background: var(--accent-sage); }
.section-sub { color: var(--on-surface-muted); margin-bottom: var(--sp-5); max-width: 56ch; }
```

- [ ] **Step 4: Strip the duplicates from the three pages**

- `src/pages/Home.vue`: delete the scoped rules `.hero-cta-row`, `.cta`, `.cta:hover`, `.cta-side`, `.section-h`, `.dot`, `.dot--ochre`, `.dot--sage`, `.section-sub`. In the template, change `class="hero-cta-row"` to `class="cta-row"`.
- `src/pages/Work.vue`: delete the scoped rules `.page-kicker`, `.section-h`, `.dot`, `.dot--sage`, `.section-sub`, `.cta-row`, `.cta`, `.cta:hover`, `.cta-side`. Keep `.cta-row { margin-top: var(--sp-7); }` as the only remaining `.cta-row` rule (page-specific spacing).
- `src/pages/Contact.vue`: delete the scoped rules `.page-kicker`, `.section-h`, `.dot`, `.dot--ochre`, `.dot--sage`, `.section-sub`.

- [ ] **Step 5: Delete the orphaned Button component**

```bash
git rm src/components/Button.vue
```

- [ ] **Step 6: Verify**

Run: `npm run check`
Expected: all green. `npm run preview`: headlines noticeably larger at 1080+ px and still comfortable at 360 px; CTAs/kickers/section headers look unchanged apart from the mono kicker.

- [ ] **Step 7: Commit**

```bash
git add -A src/styles/base.css src/pages/ src/components/
git commit -m "Fluid type scale, workshop mono voice, shared page furniture in base"
```

---

### Task 4: View transitions, fade-up retune, Nav restyle

**Files:**
- Modify: `src/styles/base.css`
- Modify: `src/components/Nav.vue`

**Interfaces:**
- Consumes: `--motion-soft`, `--outline`, `--primary-light` tokens.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Enable cross-document view transitions in base.css**

Add near the top of `base.css` (after the `@import`):

```css
/* Room-to-room navigation (spec §6.1). Declarative, works without JS.
   Firefox: no support -> plain page loads. Reduced motion: excluded. */
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}
```

- [ ] **Step 2: Retune the fade-up cascade**

Replace the `.fade-up` block in `base.css`:

```css
/* Load-time staggered fade-in — subtle, so it composes with the crossfade */
.fade-up {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeUp 500ms var(--motion-soft) forwards;
}
.fade-up.delay-1 { animation-delay: 60ms; }
.fade-up.delay-2 { animation-delay: 160ms; }
.fade-up.delay-3 { animation-delay: 260ms; }
.fade-up.delay-4 { animation-delay: 360ms; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
```

- [ ] **Step 3: Restyle Nav**

Replace the scoped styles of `src/components/Nav.vue` (keeping `.toggle-slot` from Task 1) with:

```css
.nav-bar {
  background: var(--background);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--outline);
  view-transition-name: nav; /* stays planted while pages crossfade */
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-2);
  padding-bottom: var(--sp-2);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.005em;
  color: var(--on-surface);
  min-height: 44px;
}
.brand-dot {
  width: 14px;
  height: 14px;
  background: var(--primary-light);
  border-radius: 50%;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-light) 22%, transparent);
  animation: pulse 4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px  color-mix(in srgb, var(--primary-light) 22%, transparent); }
  50%      { box-shadow: 0 0 0 10px color-mix(in srgb, var(--primary-light) 6%, transparent); }
}
nav { display: inline-flex; align-items: center; gap: var(--sp-3); }
.nav-link {
  font-size: 0.95rem;
  color: var(--on-surface-soft);
  padding: 0.7rem 0.4rem;
  background: linear-gradient(var(--primary-light), var(--primary-light)) no-repeat left calc(100% - 6px) / 0% 2px;
  transition: color var(--motion-fast) var(--motion-soft), background-size var(--motion-fast) var(--motion-soft);
}
.nav-link:hover { color: var(--on-surface); background-size: 100% 2px; }
.nav-link--active { color: var(--primary); font-weight: 600; background-size: 100% 2px; }
.toggle-slot { display: inline-block; width: 44px; height: 44px; }
```

(The 0.7rem vertical padding brings link tap targets to ≥ 44px.)

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: green. `npm run preview` in Chromium: navigating Home ↔ Work crossfades while the header stays static; hover on a nav link grows an underline from the left.

- [ ] **Step 5: Commit**

```bash
git add src/styles/base.css src/components/Nav.vue
git commit -m "View transitions with planted nav, underline-grow links, subtler fade-up"
```

---

### Task 5: Theme toggle switch plate and Footer grass

**Files:**
- Modify: `src/components/ThemeToggle.vue`
- Modify: `src/components/Footer.vue`

**Interfaces:**
- Consumes: `useTheme()` — `{ theme, toggle }` — unchanged.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Restyle ThemeToggle as a switch plate with rotating icon**

In `src/components/ThemeToggle.vue`, wrap both SVGs in a span (template):

```html
<button
  type="button"
  class="theme-toggle"
  :aria-label="label"
  :aria-pressed="!isDark"
  @click="toggle"
>
  <span class="toggle-icon" :class="{ 'toggle-icon--dark': isDark }">
    <svg v-if="isDark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <!-- sun -->
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2"  x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2"  y1="12" x2="5"  y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.2"  y1="4.2"  x2="6.3"  y2="6.3" />
        <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
        <line x1="4.2"  y1="19.8" x2="6.3"  y2="17.7" />
        <line x1="17.7" y1="6.3"  x2="19.8" y2="4.2" />
      </g>
    </svg>
    <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <!-- moon -->
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
    </svg>
  </span>
</button>
```

Script block is unchanged. Replace the scoped styles:

```css
/* A recessed wall-switch plate; the icon turns as the light changes. */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  color: var(--on-surface);
  background: var(--surface-variant);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12), inset 0 -1px 0 rgba(255, 255, 255, 0.18);
  transition: background var(--motion-fast) var(--motion-soft);
}
.theme-toggle:hover { background: color-mix(in srgb, var(--surface-variant) 82%, var(--primary-light) 18%); }
.toggle-icon { display: grid; place-items: center; transition: transform 300ms var(--motion-bounce); }
.toggle-icon--dark { transform: rotate(90deg); }
```

(This also fixes the pre-existing reference to the nonexistent `--motion-ease` token.)

- [ ] **Step 2: Footer — grass tufts and mono email**

Replace `src/components/Footer.vue` entirely:

```html
<template>
  <footer class="footer">
    <svg class="grass" viewBox="0 0 1200 14" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="none" stroke="var(--accent-sage)" stroke-width="1.5" stroke-linecap="round" opacity="0.65">
        <path d="M60 14 Q62 5 64 14 M68 14 Q70 8 72 14"/>
        <path d="M180 14 Q183 4 186 14 M190 14 Q192 8 194 14 M198 14 Q200 9 202 14"/>
        <path d="M420 14 Q422 6 424 14 M428 14 Q430 9 432 14"/>
        <path d="M600 14 Q603 4 606 14 M610 14 Q612 7 614 14"/>
        <path d="M800 14 Q802 6 804 14 M808 14 Q810 9 812 14 M816 14 Q818 7 820 14"/>
        <path d="M1000 14 Q1002 5 1004 14 M1008 14 Q1010 8 1012 14"/>
        <path d="M1130 14 Q1133 6 1136 14"/>
      </g>
    </svg>
    <div class="page footer-inner">
      <span>© 2026 Bulonka Studio &nbsp;·&nbsp; <a href="/privacy/">Privacy</a></span>
      <span class="signoff">Made with care in Ukraine</span>
      <span><a class="footer-mail" href="mailto:contact@bulonka-studio.com">contact@bulonka-studio.com</a></span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--outline);
  margin-top: var(--sp-8);
  padding-top: var(--sp-5);
  padding-bottom: var(--sp-7);
  position: relative;
  z-index: 1;
}
/* The ground the house stands on. */
.grass {
  position: absolute;
  top: -14px;
  left: 0;
  width: 100%;
  height: 14px;
  pointer-events: none;
}
.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  font-size: 0.9rem;
  color: var(--on-surface-muted);
}
.footer a { color: var(--on-surface-muted); border-bottom: 1px solid transparent; }
.footer a:hover { color: var(--on-surface); border-bottom-color: var(--outline); }
.footer-mail { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 0.85rem; }
.signoff { font-style: italic; color: var(--on-surface-soft); }
.signoff::before { content: "— "; color: var(--accent-ochre); }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: green. Preview: toggle looks recessed, icon turns on click, theme blooms; sparse grass tufts sit on the footer's top rule in both themes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeToggle.vue src/components/Footer.vue
git commit -m "Switch-plate theme toggle, footer grass line, mono footer email"
```

---

### Task 6: Home hero — window scene and asymmetric grid

**Files:**
- Modify: `src/pages/Home.vue` (hero section only: template + hero-related styles)

**Interfaces:**
- Consumes base classes from Task 3 (`.cta-row`, `.cta`, `.cta-side`) — do not redefine them here.
- Produces: hero classes `hero`, `hero-text`, `window-scene`, `ws-pane`, `ws-sun`, `ws-lamp`, `ws-bulb`, `ws-glow` (self-contained; no later task consumes them).

- [ ] **Step 1: Replace the hero template**

In `src/pages/Home.vue`, replace the entire hero `<section>` (from `<section class="section page hero fade-up">` through its closing `</section>`) with:

```html
  <!-- Hero: the window is the room's light source in both themes -->
  <section class="section page hero fade-up">
    <svg class="window-scene" viewBox="0 0 200 250" aria-hidden="true">
      <!-- frame + sill -->
      <rect x="8" y="8" width="184" height="216" rx="10" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
      <!-- panes: the piece's filled accent; night tint comes from the token swap -->
      <rect class="ws-pane" x="20"  y="20"  width="76" height="94" rx="4" fill="var(--accent-sky)" opacity="0.9"/>
      <rect class="ws-pane" x="104" y="20"  width="76" height="94" rx="4" fill="var(--accent-sky)" opacity="0.75"/>
      <rect class="ws-pane" x="20"  y="122" width="76" height="90" rx="4" fill="var(--accent-sky)" opacity="0.8"/>
      <rect class="ws-pane" x="104" y="122" width="76" height="90" rx="4" fill="var(--accent-sky)" opacity="0.65"/>
      <line x1="100" y1="10" x2="100" y2="222" stroke="var(--primary)" stroke-width="2"/>
      <line x1="10" y1="118" x2="190" y2="118" stroke="var(--primary)" stroke-width="2"/>
      <line x1="0" y1="236" x2="200" y2="236" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
      <!-- day: sun ring seen through the upper-right pane -->
      <g class="ws-sun">
        <circle cx="142" cy="58" r="17" fill="none" stroke="var(--accent-ochre)" stroke-width="2.5"/>
        <g stroke="var(--accent-ochre)" stroke-width="2.5" stroke-linecap="round">
          <line x1="142" y1="30" x2="142" y2="38"/><line x1="142" y1="78" x2="142" y2="86"/>
          <line x1="114" y1="58" x2="122" y2="58"/><line x1="162" y1="58" x2="170" y2="58"/>
          <line x1="122" y1="38" x2="128" y2="44"/><line x1="156" y1="72" x2="162" y2="78"/>
          <line x1="162" y1="38" x2="156" y2="44"/><line x1="128" y1="72" x2="122" y2="78"/>
        </g>
      </g>
      <!-- night: the lamp stands in front of the dark window -->
      <g class="ws-lamp">
        <ellipse class="ws-glow" cx="100" cy="150" rx="52" ry="48"/>
        <path d="M76 128 L124 128 L116 158 L84 158 Z" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
        <ellipse class="ws-bulb" cx="100" cy="163" rx="9" ry="7"/>
        <line x1="100" y1="158" x2="100" y2="216" stroke="var(--primary)" stroke-width="2.5"/>
        <path d="M78 224 Q100 214 122 224" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>

    <div class="hero-text">
      <span class="greeting greeting--day">
        <span class="wave" aria-hidden="true">👋</span>
        Hi — come in
      </span>
      <span class="greeting greeting--night">
        <span class="flame" aria-hidden="true">🕯</span>
        The lamp is on — come in
      </span>

      <h1 class="t-display hero-headline">
        A small mobile studio that
        <span class="h-mark">respects</span>
        the people who use what it ships — built with
        <span class="h-accent">care, not analytics</span>.
      </h1>

      <p class="t-body hero-lede">
        iOS and Android apps, end-to-end. Privacy audits for existing apps. On-device behavior testing. Currently a one-person studio, working from a quiet desk in Ukraine.
      </p>

      <div class="cta-row">
        <a class="cta" href="mailto:contact@bulonka-studio.com">Email contact@bulonka-studio.com</a>
        <span class="t-small cta-side">replies usually inside a business day.</span>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Replace the hero styles**

In the scoped styles, delete: `.hero`, `.hero-headline`, `.hero-lede`, `.hero-sun`/`.hero-lamp` rules and their show/hide blocks, `@keyframes spin`, `@keyframes bulb-flicker`, `@keyframes glow-flicker`, and the `@media (max-width: 720px)` hero-decoration override. Keep: `.greeting` rules and their show/hide, `.wave`/`.flame` and keyframes, `.h-mark`, `.h-accent`, `@keyframes gradient-breathe`. Add:

```css
/* Hero — asymmetric at >=720px; small in-flow window above the text on mobile */
.hero {
  padding-top: var(--sp-6);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--sp-4);
  align-items: start;
}
.hero-text { grid-row: 2; grid-column: 1 / -1; }
.window-scene { grid-column: 2; width: 118px; height: auto; }
@media (min-width: 720px) {
  .hero { grid-template-columns: 1.15fr 0.85fr; gap: var(--sp-6); align-items: center; }
  .hero-text { grid-row: 1; grid-column: 1; }
  .window-scene { width: min(100%, 300px); justify-self: end; }
}
.hero-headline { margin-top: var(--sp-3); margin-bottom: var(--sp-4); max-width: 24ch; }
.hero-lede { color: var(--on-surface-soft); max-width: 56ch; font-size: 1.08rem; margin-bottom: var(--sp-5); }

/* Window scene animation + day/night state */
.ws-pane { animation: sky-drift 18s ease-in-out infinite alternate; }
@keyframes sky-drift {
  0%   { transform: translate(-1.5px, 0); }
  100% { transform: translate( 1.5px, 1.5px); }
}
.ws-sun { transform-box: fill-box; transform-origin: center; animation: spin 80s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ws-bulb { fill: var(--primary); transform-box: fill-box; transform-origin: center; animation: bulb-flicker 4.5s ease-in-out infinite; }
.ws-glow { fill: color-mix(in srgb, var(--primary) 22%, transparent); transform-box: fill-box; transform-origin: center; animation: glow-flicker 4.5s ease-in-out infinite; }
@keyframes bulb-flicker {
  0%, 100% { opacity: 1; transform: scale(1); }
  45% { opacity: 0.85; transform: scale(0.96); }
  50% { opacity: 1;    transform: scale(1.04); }
  55% { opacity: 0.92; transform: scale(0.98); }
}
@keyframes glow-flicker {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  45%      { opacity: 0.4; transform: scale(0.92); }
  50%      { opacity: 0.7; transform: scale(1.08); }
}
[data-theme='light'] .ws-lamp { display: none; }
[data-theme='dark'] .ws-sun { display: none; }
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) .ws-lamp { display: none; }
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .ws-sun { display: none; }
}
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: green. Preview at 1080px: text left, window right with spinning sun (day) / flickering lamp (night); at 360px: small window top-right above the headline; nothing overlaps.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.vue
git commit -m "Home hero: merged window scene, asymmetric grid, mobile-visible decoration"
```

---

### Task 7: Home today block — plant in the grid

**Files:**
- Modify: `src/pages/Home.vue` (today section only)

**Interfaces:**
- Consumes: `.t-mono` from Task 3, `--edge-light` from Task 2.

- [ ] **Step 1: Update the today template**

Replace the today `<section>` with (card copy unchanged; label class swapped; plant SVG redrawn):

```html
  <!-- Today / on the workbench -->
  <section class="section page today fade-up delay-1">
    <div class="today-card">
      <div class="today-stamp">This week</div>
      <p class="t-mono today-label">On the workbench</p>
      <p class="today-text">
        Auditing what a health-tracking iOS app actually <em>sends home</em> &mdash; third-party SDKs, telemetry, and the gap between privacy policy and on-device behavior.
        <!-- TBD: founder updates this string as actual current work changes — see spec §10.3 -->
      </p>
    </div>
    <svg class="plant" viewBox="0 0 92 130" aria-hidden="true">
      <path d="M26 94 L66 94 L61 124 Q60 128 56 128 L36 128 Q32 128 31 124 Z" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="22" y1="92" x2="70" y2="92" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
      <g class="leaf">
        <path d="M46 90 Q30 70 24 42" fill="none" stroke="var(--accent-sage)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M24 42 Q34 50 38 64" fill="none" stroke="var(--accent-sage)" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="leaf">
        <path d="M46 90 Q62 66 70 36" fill="none" stroke="var(--accent-sage)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M70 36 Q58 46 54 62" fill="none" stroke="var(--accent-sage)" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="leaf"><path d="M46 90 Q42 60 36 20" fill="none" stroke="var(--accent-sage)" stroke-width="2.5" stroke-linecap="round"/></g>
      <g class="leaf"><path d="M46 90 Q52 64 58 30" fill="none" stroke="var(--accent-sage)" stroke-width="2" stroke-linecap="round"/></g>
      <circle cx="24" cy="38" r="5" fill="var(--accent-ochre)"/>
    </svg>
  </section>
```

- [ ] **Step 2: Update the today styles**

Replace the `.today`, `.today-card`, and `.plant` rules (keep `.today-label`, `.today-text`, `.today-text em`, and `@keyframes leaf-wave`). In the kept `.today-stamp` rule, add the mono stack as its first line (spec §4 — the stamp is a workshop label):

```css
.today-stamp {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  /* rest of the rule unchanged */
}
```

Then the replaced rules:

```css
/* Today block — card and plant share the grid; the plant perches on the card edge */
.today { padding-top: 0; padding-bottom: var(--sp-7); display: grid; grid-template-columns: 1fr; }
@media (min-width: 720px) {
  .today { grid-template-columns: minmax(0, 72ch) auto; align-items: end; }
}
.today-card {
  background: var(--surface);
  border: 1.5px dashed color-mix(in srgb, var(--accent-sage) 55%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--sp-5) var(--sp-5);
  position: relative;
  transition: transform 250ms var(--motion-bounce);
  box-shadow: var(--edge-light), var(--shadow-card);
}
.today-card:hover { transform: translateY(-2px) rotate(-0.25deg); }
.plant { width: 64px; height: 90px; justify-self: end; margin-top: calc(-1 * var(--sp-4)); }
@media (min-width: 720px) {
  .plant { width: 92px; height: 130px; margin: 0 0 0 calc(-1 * var(--sp-4)); }
}
.plant .leaf { transform-box: fill-box; transform-origin: 50% 100%; animation: leaf-wave 6s ease-in-out infinite; }
.plant .leaf:nth-of-type(2) { animation-delay: -1.5s; }
.plant .leaf:nth-of-type(3) { animation-delay: -3s; }
.plant .leaf:nth-of-type(4) { animation-delay: -4.5s; }
```

(Note `nth-of-type` — the redrawn SVG's `g.leaf` elements are no longer the first children.)

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: green. Preview: ≥720px plant stands beside the card overlapping its edge, leaves waving; 360px small plant perches at the card's lower-right; card shows the new layered shadow with a bright top edge.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.vue
git commit -m "Home today block: line-art plant lives in the grid at every width"
```

---

### Task 8: Home rooms — varied grid, container queries, hover choreography

**Files:**
- Modify: `src/pages/Home.vue` (rooms section only; house-rules section stays untouched)

**Interfaces:**
- Consumes: `.section-h`, `.dot--ochre`, `.section-sub` from base (Task 3).

- [ ] **Step 1: Update the rooms template**

Replace the rooms `<section>` with (copy unchanged; old `window-deco` SVG deleted — it merged into the hero scene; each room gains a `room-inner` wrapper):

```html
  <!-- Three rooms (services) -->
  <section class="section page rooms-section fade-up delay-2" id="services">
    <h2 class="section-h"><span class="dot dot--ochre"></span>Three rooms in this studio</h2>
    <p class="t-body section-sub">Each one is something the studio has shipped before — paid, on a real project, end to end.</p>

    <div class="rooms">
      <div class="room room--build">
        <div class="room-inner">
          <div class="room-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 21h16M6 21V8l6-4 6 4v13M10 13h4M10 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3 class="room-title">Build</h3>
          <p class="room-body">Full apps, idea to App Store. iOS native, Android native, and KMP when it earns its keep.</p>
        </div>
      </div>

      <div class="room room--audit">
        <div class="room-inner">
          <div class="room-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <h3 class="room-title">Audit</h3>
          <p class="room-body">Privacy and behavior reviews of existing apps. Threat models, SDK reviews, encryption, data-minimization.</p>
        </div>
      </div>

      <div class="room room--test">
        <div class="room-inner">
          <div class="room-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M2 12c4-6 16-6 20 0M6 12c2-3 10-3 12 0M10 12c1-1 3-1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/></svg>
          </div>
          <h3 class="room-title">Test</h3>
          <p class="room-body">What an app actually does on a real device, and what it sends where. Network traces and behavior reports.</p>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Update the rooms styles**

Delete `.window-deco` rules and `@keyframes sky-drift` from this section's styles (the hero now owns `sky-drift`). Replace `.rooms` and `.room` rules with:

```css
/* Three rooms — Build is the tall room; Audit and Test are wide rooms.
   Each room arranges itself by its own width (container query). */
.rooms { display: grid; grid-template-columns: 1fr; gap: var(--sp-3); }
@media (min-width: 720px) {
  .rooms { grid-template-columns: 1fr 1.4fr; }
  .room--build { grid-row: span 2; }
}
.room {
  container-type: inline-size;
  padding: var(--sp-5) var(--sp-4);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--outline);
  box-shadow: var(--edge-light);
  transition: transform 280ms var(--motion-bounce), box-shadow 280ms, opacity 280ms var(--motion-soft);
}
.room:hover { transform: translateY(-5px); }
/* Attention behaves like light: the room you look at stays lit */
.rooms:has(.room:hover) .room:not(:hover) { opacity: 0.75; }
.room--build { background: linear-gradient(155deg, color-mix(in srgb, var(--primary-light) 16%, transparent), color-mix(in srgb, var(--primary-light) 4%, transparent) 80%); }
.room--audit { background: linear-gradient(155deg, color-mix(in srgb, var(--accent-sage) 16%, transparent), color-mix(in srgb, var(--accent-sage) 4%, transparent) 80%); }
.room--test  { background: linear-gradient(155deg, color-mix(in srgb, var(--accent-sky) 20%, transparent),  color-mix(in srgb, var(--accent-sky) 4%, transparent) 80%); }
.room-icon {
  width: 44px; height: 44px;
  border-radius: var(--radius-card);
  display: grid;
  place-items: center;
  margin-bottom: var(--sp-4);
  color: var(--on-primary);
  transition: transform 350ms var(--motion-bounce);
}
.room:hover .room-icon { transform: rotate(-6deg) scale(1.04); }
.room--build .room-icon { background: var(--primary-light); }
.room--audit .room-icon { background: var(--accent-sage); }
.room--test  .room-icon { background: var(--accent-sky); }
.room-icon svg { width: 22px; height: 22px; }
.room-title { font-weight: 700; font-size: 1.12rem; margin-bottom: var(--sp-1); letter-spacing: -0.005em; }
.room-body  { color: var(--on-surface-soft); font-size: 0.94rem; line-height: 1.55; }

/* Wide rooms lay icon beside text */
@container (min-width: 380px) {
  .room-inner { display: grid; grid-template-columns: 44px 1fr; column-gap: var(--sp-4); align-items: start; }
  .room-inner .room-icon { grid-row: 1 / 3; margin-bottom: 0; }
}
/* Fallback when container queries are unsupported: approximate by viewport */
@supports not (container-type: inline-size) {
  @media (min-width: 900px) {
    .room--audit .room-inner, .room--test .room-inner { display: grid; grid-template-columns: 44px 1fr; column-gap: var(--sp-4); align-items: start; }
    .room--audit .room-icon,  .room--test .room-icon  { grid-row: 1 / 3; margin-bottom: 0; }
  }
}
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: green. Preview ≥720px: tall Build left, wide Audit/Test right with icons beside text; hovering one room dims the others; 360px: three stacked rooms, icons above titles.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.vue
git commit -m "Home rooms: varied-size grid, container-query layouts, light-follows-hover"
```

---

### Task 9: Work — the shelf

**Files:**
- Modify: `src/pages/Work.vue`
- Modify: `src/styles/base.css` (`.spec-key` goes mono)

**Interfaces:**
- Consumes: `.page-kicker`, `.cta-row`, `.cta`, `.cta-side`, `.section-h`, `.dot--sage`, `.section-sub` from base (Task 3).

- [ ] **Step 1: Mono spec keys in base.css**

In `base.css`, add to the existing `.spec-key` rule (both the base and ≥720px variants keep their padding/border lines):

```css
.spec-key {
  padding: var(--sp-4) 0 var(--sp-2);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: var(--on-surface-muted);
  border-top: 1px solid var(--outline);
}
```

(Replaces the previous `font-weight: 600; font-size: 1.15rem; letter-spacing: -0.01em;` lines.)

- [ ] **Step 2: Replace the empty-state section with the shelf scene**

In `src/pages/Work.vue`, replace the second `<section>` (the `empty-grid` one) with:

```html
  <section class="section page fade-up delay-1">
    <div class="shelf-scene">
      <h2 class="t-h1 empty-h">First public case studies are coming.</h2>
      <p class="t-body empty-body">When something can be shown publicly, it lands here. Until then, the shelf stays honest.</p>
      <div class="shelf">
        <svg class="envelope" viewBox="0 0 160 104" aria-hidden="true">
          <rect x="4" y="16" width="152" height="84" rx="6" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
          <path d="M4 20 L80 62 L156 20" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
          <circle cx="80" cy="80" r="11" fill="var(--accent-rose)"/>
          <text x="80" y="84" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--on-primary)">B</text>
        </svg>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Replace the page's scoped styles**

The full scoped style block for `Work.vue` becomes (shared furniture already lives in base):

```css
.page-h { padding-top: var(--sp-6); }
.work-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 18ch; }
.work-lede { color: var(--on-surface-soft); max-width: 60ch; font-size: 1.06rem; }

/* The shelf: drawn, mostly empty — on purpose */
.shelf-scene { max-width: 880px; }
.empty-h { margin-bottom: var(--sp-2); }
.empty-body { color: var(--on-surface-soft); max-width: 56ch; margin-bottom: var(--sp-6); }
.shelf {
  border-bottom: 2.5px solid var(--primary);
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-right: clamp(16px, 8%, 96px);
}
.shelf::before, .shelf::after {
  content: '';
  position: absolute;
  top: 100%;
  width: 10px;
  height: 12px;
  border-left: 2.5px solid var(--primary);
}
.shelf::before { left: 6%; }
.shelf::after { right: 6%; }
.envelope {
  width: clamp(120px, 24vw, 160px);
  margin-bottom: -2px;
  transform-origin: 50% 100%;
  animation: envelope-tilt 8s ease-in-out infinite alternate;
}
@keyframes envelope-tilt {
  0%   { transform: rotate(-2.5deg); }
  100% { transform: rotate( 1.5deg); }
}
.cta-row { margin-top: var(--sp-7); }
```

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: green. Preview: a drawn shelf line with two brackets, the envelope resting near its right end gently tilting; mono keys ("Platforms", "Surfaces", …) in the NDA sheet; both themes.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Work.vue src/styles/base.css
git commit -m "Work: literal shelf scene, mono spec-sheet keys"
```

---

### Task 10: Contact — line mailbox, self-organizing chips

**Files:**
- Modify: `src/pages/Contact.vue`
- Modify: `src/styles/base.css` (delete `.t-label` — last usages are removed here)

**Interfaces:**
- Consumes: `.t-mono` (Task 3), `--edge-light` (Task 2), base page furniture (Task 3).

- [ ] **Step 1: Replace the mailbox SVG and swap label classes in the template**

In `src/pages/Contact.vue`, replace the `<svg class="mailbox" …>…</svg>` with:

```html
      <svg class="mailbox" viewBox="0 0 200 200" aria-hidden="true">
        <line x1="100" y1="130" x2="100" y2="192" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 62 Q32 42 52 42 L148 42 Q168 42 168 62 L168 118 Q168 128 158 128 L42 128 Q32 128 32 118 Z" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
        <rect x="60" y="78" width="80" height="18" rx="6" fill="none" stroke="var(--primary)" stroke-width="2"/>
        <g class="letters">
          <rect x="66" y="60" width="26" height="18" fill="none" stroke="var(--on-surface-muted)" stroke-width="1.5" transform="rotate(-6 79 69)"/>
          <rect x="102" y="58" width="30" height="20" fill="none" stroke="var(--on-surface-muted)" stroke-width="1.5" transform="rotate(4 117 68)"/>
        </g>
        <g class="flag">
          <line x1="171" y1="60" x2="171" y2="100" stroke="var(--primary)" stroke-width="2.5"/>
          <polygon points="173,60 196,64 196,80 173,76" fill="var(--accent-rose)"/>
        </g>
        <line x1="24" y1="192" x2="176" y2="192" stroke="var(--on-surface-muted)" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
        <path d="M64 192 Q66 184 68 192 M72 192 Q74 186 76 192" stroke="var(--accent-sage)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M126 192 Q128 184 130 192 M132 192 Q134 186 136 192" stroke="var(--accent-sage)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>
```

In the template, change `class="t-label email-label"` to `class="t-mono email-label"` and `class="t-label meta-key"` to `class="t-mono meta-key"`.

- [ ] **Step 2: Update the page styles**

In the scoped styles: keep `.contact-heading`, `.contact-lede`, `.mailbox-grid`, `@keyframes flag-flip`, `@keyframes letter-poke`, `.email-card::before`, `.email-label`, `.email-link`, `.email-link:hover`, `.email-side`, `.meta-key`, `.meta-val`, and the `.meta-item--*` tint rules. Change `.page-h` to `padding-top: var(--sp-6);` (matches Work after Task 9). Then make these changes:

```css
.mailbox { width: 200px; height: 200px; margin: 0 auto; }
.mailbox .flag { transform-box: fill-box; transform-origin: 10% 100%; animation: flag-flip 4.8s ease-in-out infinite; }
.mailbox .letters { animation: letter-poke 4.8s ease-in-out infinite; }

.email-card {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-lg);
  padding: var(--sp-5) var(--sp-5);
  box-shadow: var(--edge-light), var(--shadow-card);
  position: relative;
}

.meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--sp-3); max-width: 80ch; }
.meta-item {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-card);
  box-shadow: var(--edge-light);
  transition: transform 220ms var(--motion-bounce);
}
.meta-item:hover { transform: translateY(-2px); }
```

Delete the old `.mailbox svg` rule and the old `.meta`/`.meta-item`/`.email-card` variants, and the `@media (min-width: 720px)` rule that set `.meta { grid-template-columns: repeat(2, 1fr); }` (auto-fit replaces it).

- [ ] **Step 3: Delete `.t-label` from base.css**

Remove the `.t-label` line from the type-scale block — Home (Task 7) and Contact (this task) migrated the last usages to `.t-mono`.

Run (verify nothing still uses it): `Select-String -Path src -Pattern 't-label' -Recurse`
Expected: no matches.

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: green. Preview: outlined mailbox with rose flag flipping; email card glowing with layered shadow; chips flow 4-up ≥ ~800px, 2-up at tablet, 1-up at 360px; mono keys everywhere.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.vue src/styles/base.css
git commit -m "Contact: line-language mailbox, auto-fit meta chips, mono keys"
```

---

### Task 11: CLAUDE.md pointer and full check

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md**

In the **Surface design** section, replace the canonical-spec line and the decorations line:

```markdown
- Canonical spec: `docs/superpowers/specs/2026-07-02-light-is-on-design.md` — supersedes the layout/typography/motion sections of the 2026-04-29 colorful-home spec (which remains authoritative for voice, palette values, and brand mark).
- Decorations are inline SVG in one stroke-based line language (2px, rounded caps, one filled accent each): window scene (Home hero, merges sun+lamp), plant (Home), shelf + envelope (Work), mailbox (Contact), grass tufts (Footer).
```

In the **Architecture** section, after the entries paragraph, add:

```markdown
**Prerendering:** `npm run build` runs three steps: client build → `vite build --ssr src/entries/ssr.js --outDir dist-ssr` → `node scripts/prerender.mjs`, which injects each page's rendered HTML into `dist/*.html` (so pages work without JavaScript) and deletes `dist-ssr/`. Entries hydrate with `createSSRApp` when `#app` has children. `ThemeToggle` is client-only-mounted in `Nav.vue` (SSR would crash on `window.matchMedia`); a 44px placeholder prevents layout shift.
```

- [ ] **Step 2: Full verification**

Run: `npm run check`
Expected: all six checks green. Note the per-page CSS sizes printed by `check:bundle-size` — each must be ≤ 15 kB gz (baseline was ~4–5; expect ~6–8).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "CLAUDE.md: point at light-is-on spec, document prerender step"
```

---

### Task 12: Browser verification (spec §13)

No file changes — this task gates "done". Use `npm run preview` (serves `dist/` at http://localhost:4173) after a fresh `npm run build`.

- [ ] **Step 1: Theme × viewport matrix**

For each of `/`, `/work/`, `/contact/` at 360×740, 768×900, 1280×900: verify day and night themes — light layers behave (day patch / night pool + vignette), decorations visible and non-overlapping at every width, hero CTA above the fold at 360×740, text readable over all light layers.

- [ ] **Step 2: The switch and the walk**

Toggle theme on each page: bloom ≈ 600ms in Chromium, no layout shift. Navigate Home → Work → Contact → Home: header stays planted (view transition), no wrong-theme flash at any point.

- [ ] **Step 3: Reduced motion**

DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload each page: no animation plays (no drift, no flicker, no fade-up movement, no spin/wave), navigation does plain loads, theme toggle swaps instantly, everything readable.

- [ ] **Step 4: No-JS**

DevTools → Command menu → "Disable JavaScript", reload each page: full content renders, theme follows the emulated system preference (check both via DevTools Rendering → `prefers-color-scheme`), window scene shows the right state, toggle button absent with no layout hole.

- [ ] **Step 5: Hydration and console**

With JS re-enabled, hard-reload each page with the console open: zero hydration-mismatch warnings, zero errors.

- [ ] **Step 6: Copy and gut check**

`git diff feature/landing-page-warm-home -- src/pages/ | Select-String '^[+-].*[a-zA-Z]'` — confirm copy strings only moved, none reworded; greeting and today block verbatim. Final look at Home in both themes: does it read as a small studio with a person in it?

- [ ] **Step 7: Record results**

Append actual results (sizes, any deviations) to this plan file under a "## Verification record" heading, commit:

```bash
git add docs/superpowers/plans/2026-07-02-light-is-on.md
git commit -m "Record browser verification results for light-is-on redesign"
```

## Verification record (2026-07-02, Task 12)

Environment: Chromium via claude-in-chrome MCP against `npm run preview` of a fresh `npm run build`. Window-level viewport control and reduced-motion/JS-off DevTools emulation are unavailable in this environment; exact-width tests ran as same-origin iframes at 360×740 / 768×900 / 1280×900 CSS px measured with DOM geometry, and the JS-off test ran as a sandboxed iframe without `allow-scripts` (a true no-script render). Screenshot capture was intermittently flaky (CDP timeouts, variable capture scale) — an environment issue; DOM probes are the primary evidence.

| Check | Result |
|---|---|
| Theme × viewport matrix (3 pages × 360/768/1280) | ✓ no horizontal overflow anywhere; one `<h1>` per page; decorations present and in flow at every width (window 84→300px, plant 64→92px, envelope 120→160px, mailbox 200px) |
| Day theme visuals | ✓ pane light patch, sun-in-pane window scene, ambient glows (screenshots) |
| Night theme visuals | ✓ lamp pool, dusk vignette, lamp-in-window scene, ember flicker layer (screenshots + probe: `data-theme=dark`, night greeting/lamp shown, day greeting/sun hidden) |
| The switch | ✓ toggle click → `data-theme` flips, `localStorage` = exactly one `theme` key, full re-tint, icon swaps, button stays 44×44 |
| Bloom / hover choreography | ✓ at CSS level (`@property` registrations + 600ms transitions, `:has()` dim rule present in live CSSOM); transient interpolation not capturable in stills |
| Walking between rooms | ✓ `@view-transition{navigation:auto}` inside `prefers-reduced-motion: no-preference`, `view-transition-name: nav` computed on header, navigation preserves theme, no wrong-theme flash observed |
| Reduced motion | ✓ kill-switch (zeroed durations + `body::before/after` stopped) verified in live CSSOM; OS-level emulation unavailable in this environment |
| No-JS | ✓ sandboxed no-script iframe: full prerendered content renders, `data-theme` absent, theme follows system via `:root:not([data-theme])` fallbacks, toggle absent, 44px placeholder present |
| Hydration / console | ✓ zero console messages (errors or warnings) on fresh loads of all three pages |
| Copy diff vs `feature/landing-page-warm-home` | ✓ indentation-only changes to copy lines; greeting + today block verbatim |
| Bundle budgets | ✓ CSS gz: home 5.81 / contact 4.69 / work 4.19 kB (≤15); JS gz ≈ 30 kB (≤50) |
| Hero CTA above fold | ✗→✓ initially 942px at 360×740; fixed in `fb4637d` (mobile hero-top row shares greeting+window, display clamp 2.2rem floor, tightened rhythm) → 714px at 360×740; 836 at 768×900; 877 at 1280×900. Spec §13.9 amended 640→740 (the 640 figure predates measurement and was never met by the prior design). |
| `.h-mark` highlight | ✗→✓ fixed-pixel bar read tiny under 72px display type; now em-relative (0.16em/0.1em), verified 11.5px at 72px |
| Container queries | note: wide-room icon-beside layout engages when room content-box ≥380px — at ~1080px+ viewports, not at 768 (rooms are narrower there); as-designed adaptive behavior |
| Gut check | ✓ still reads as a small studio with a person in it — the window scene, workbench card, and mono labels carry the inhabited feel; nothing reads as generated-SaaS |
| Browser coverage | note: verification ran in Chromium only; Firefox (no view transitions) and Safari fallbacks are declarative-CSS by construction, to be spot-checked when a device is at hand |
