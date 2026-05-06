# Colorful-Home Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the colorful-home design (`docs/superpowers/specs/2026-04-29-colorful-home-design.md`) on top of the existing Vue 3 + Vite stack. Branch is `feature/landing-page-warm-home`, started from `main` (so the codebase still has the original purple Material design — this plan replaces it).

**Architecture:** Same multi-page Vite, same `useTheme.js`, same `[data-theme]` attribute, same inline pre-paint script. CSS custom property *names* in `src/styles/tokens.css` are unchanged for the eight existing tokens; only *values* change. Six new accent tokens are added. All animation is CSS keyframes (no JS), gated by `prefers-reduced-motion`. Decorations are inline SVG in page templates (no new components).

**Tech Stack:** Vue 3 SFC, Vite 6, vanilla CSS custom properties, vitest. One new verification script.

**Reference docs (read these first):**
- Spec: `docs/superpowers/specs/2026-04-29-colorful-home-design.md`
- Prototype HTML (canonical visual truth): `prototypes/colorful-home/index.html`, `night.html`, `work.html`, `contact.html`
- Project conventions: `CLAUDE.md`

**Key strategic note for implementers:** Several utility patterns (the `.fade-up` reveal, the `.spec`/`.spec-key`/`.spec-val` blocks for /work and /contact, the `.principles` numbered list, the body-level sunlight gradient) are used by all three pages. **Put these in `src/styles/base.css`, not duplicated in each page.** This is different from the de-slopping plan which duplicated locally; the colorful-home design has more CSS and we need to share to stay under the 15 kB CSS gz budget.

---

## Task 1: Add `check:no-purple` verification script

**Files:**
- Create: `scripts/check-no-purple.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the script**

Create `scripts/check-no-purple.mjs`:

```js
// Fails if any source file references retired purple brand color.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const HEX_LITERALS = ['BB86FC', '6750A4', 'D4A8FF'];
const WORD_LITERALS = ['purple'];
const SCAN_DIRS = ['src', 'tests', 'public'];
const SCAN_EXT = new Set(['.js', '.mjs', '.vue', '.html', '.css', '.svg', '.json']);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let failed = false;

function scan(file, body) {
  for (const hex of HEX_LITERALS) {
    if (body.toLowerCase().includes(hex.toLowerCase())) {
      console.error(`FAIL: ${file} contains hex "${hex}"`);
      failed = true;
    }
  }
  for (const word of WORD_LITERALS) {
    const re = new RegExp(`(^|[^a-z])${word}(?![a-z])`, 'i');
    if (re.test(body)) {
      console.error(`FAIL: ${file} contains word "${word}"`);
      failed = true;
    }
  }
}

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (!SCAN_EXT.has(extname(file))) continue;
    scan(file, readFileSync(file, 'utf8'));
  }
}

for (const f of ['index.html', 'work/index.html', 'contact/index.html', 'vite.config.js']) {
  if (!existsSync(f)) continue;
  scan(f, readFileSync(f, 'utf8'));
}

if (failed) process.exit(1);
console.log('OK no purple references anywhere');
```

- [ ] **Step 2: Wire into package.json**

In the `scripts` block, add `"check:no-purple": "node scripts/check-no-purple.mjs"` after the existing `check:bundle-size` entry, and update the `check` chain to include `&& npm run check:no-purple` before `&& npm run check:bundle-size`:

```json
"check": "npm run test:run && npm run build && npm run check:no-react && npm run check:no-tracking && npm run check:no-purple && npm run check:bundle-size"
```

- [ ] **Step 3: Verify it fails on current state**

Run `npm run check:no-purple`. Expected: 4 FAILs (`src/styles/tokens.css` × 2, `public/favicon.svg` × 2). This is the failing test before later tasks fix it.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-no-purple.mjs package.json
git commit -m "Add check:no-purple verification script (currently failing — captures the surface to swap)"
```

---

## Task 2: Swap `tokens.css` to colorful-home palette

**Files:** Modify `src/styles/tokens.css`.

- [ ] **Step 1: Replace file contents**

Replace `src/styles/tokens.css` with:

```css
/* Defaults: applied when no [data-theme] is set yet (e.g. JS off + no CSS @media match). */
:root {
  /* Spacing rhythm — 4px base */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 16px;
  --sp-4: 24px;
  --sp-5: 32px;
  --sp-6: 48px;
  --sp-7: 64px;
  --sp-8: 96px;

  /* Radius scale */
  --radius-chip: 8px;
  --radius-sm: 12px;
  --radius-card: 14px;
  --radius-lg: 26px;
  --radius-pill: 999px;

  /* Layout */
  --page-max: 1080px;
  --page-pad-mobile: 24px;
  --page-pad-tablet: 40px;
  --page-pad-desktop: 56px;

  /* Motion */
  --motion-fast: 220ms;
  --motion-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-soft:   cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* Day theme (warm five-color) */
[data-theme='light'] {
  --background: #FAF1E0;
  --surface: #FFFAF0;
  --surface-variant: #F4E8CE;
  --surface-deep: #F4E8CE;
  --outline: rgba(138, 111, 80, 0.18);
  --primary: #8B4A2E;
  --primary-light: #C97B5C;
  --on-primary: #FFFFFF;
  --on-surface: #3E2C1A;
  --on-surface-soft: #5C4A33;
  --on-surface-muted: #8A6F50;
  --accent-ochre: #D4A04A;
  --accent-sage:  #7A9978;
  --accent-sky:   #87B5D6;
  --accent-rose:  #D4847A;
  --shadow-card: 0 4px 18px rgba(60, 30, 10, 0.06);
  --shadow-fab:  0 4px 14px rgba(201, 123, 92, 0.30);
  --shadow-fab-hover: 0 10px 22px rgba(201, 123, 92, 0.38);
  --glow-1: rgba(212, 160, 74, 0.22);
  --glow-2: rgba(135, 181, 214, 0.18);
}

/* Night theme (warm hearth) */
[data-theme='dark'] {
  --background: #1A130D;
  --surface: #251A11;
  --surface-variant: #100A06;
  --surface-deep: #100A06;
  --outline: rgba(232, 168, 124, 0.16);
  --primary: #E8A87C;
  --primary-light: #B36A3F;
  --on-primary: #2A1810;
  --on-surface: #F0E4CF;
  --on-surface-soft: #C9B697;
  --on-surface-muted: #8E7A5E;
  --accent-ochre: #E8A87C;
  --accent-sage:  #6E8C68;
  --accent-sky:   #5C7C9C;
  --accent-rose:  #D6816F;
  --accent-ember: #D26646;
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.30);
  --shadow-fab:  0 4px 20px rgba(232, 168, 124, 0.30), 0 0 36px rgba(210, 102, 70, 0.18);
  --shadow-fab-hover: 0 10px 28px rgba(232, 168, 124, 0.40), 0 0 48px rgba(210, 102, 70, 0.25);
  --glow-1: rgba(232, 168, 124, 0.18);
  --glow-2: rgba( 92, 124, 156, 0.12);
  --glow-ember: rgba(210, 102, 70, 0.06);
}

/* CSS-only fallback when JS is disabled and no [data-theme] attribute exists. */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --background: #FAF1E0;
    --surface: #FFFAF0;
    --surface-variant: #F4E8CE;
    --surface-deep: #F4E8CE;
    --outline: rgba(138, 111, 80, 0.18);
    --primary: #8B4A2E;
    --primary-light: #C97B5C;
    --on-primary: #FFFFFF;
    --on-surface: #3E2C1A;
    --on-surface-soft: #5C4A33;
    --on-surface-muted: #8A6F50;
    --accent-ochre: #D4A04A;
    --accent-sage:  #7A9978;
    --accent-sky:   #87B5D6;
    --accent-rose:  #D4847A;
    --shadow-card: 0 4px 18px rgba(60, 30, 10, 0.06);
    --shadow-fab:  0 4px 14px rgba(201, 123, 92, 0.30);
    --shadow-fab-hover: 0 10px 22px rgba(201, 123, 92, 0.38);
    --glow-1: rgba(212, 160, 74, 0.22);
    --glow-2: rgba(135, 181, 214, 0.18);
  }
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --background: #1A130D;
    --surface: #251A11;
    --surface-variant: #100A06;
    --surface-deep: #100A06;
    --outline: rgba(232, 168, 124, 0.16);
    --primary: #E8A87C;
    --primary-light: #B36A3F;
    --on-primary: #2A1810;
    --on-surface: #F0E4CF;
    --on-surface-soft: #C9B697;
    --on-surface-muted: #8E7A5E;
    --accent-ochre: #E8A87C;
    --accent-sage:  #6E8C68;
    --accent-sky:   #5C7C9C;
    --accent-rose:  #D6816F;
    --accent-ember: #D26646;
    --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.30);
    --shadow-fab:  0 4px 20px rgba(232, 168, 124, 0.30), 0 0 36px rgba(210, 102, 70, 0.18);
    --shadow-fab-hover: 0 10px 28px rgba(232, 168, 124, 0.40), 0 0 48px rgba(210, 102, 70, 0.25);
    --glow-1: rgba(232, 168, 124, 0.18);
    --glow-2: rgba( 92, 124, 156, 0.12);
    --glow-ember: rgba(210, 102, 70, 0.06);
  }
}
```

- [ ] **Step 2: Verify**

```
npm run check:no-purple   # tokens.css FAILs gone; only favicon.svg should remain
npm run test:run          # useTheme tests still pass (token names preserved)
npm run build             # success
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Swap color tokens to colorful-home palette (warm five-color day, hearth night)"
```

---

## Task 3: Update `base.css` with shared utilities, animations, and reduced-motion guard

**Files:** Modify `src/styles/base.css`.

This task pulls a bunch of styles into base so they're not duplicated across pages: typography fixes, the body-level sunlight/lamp gradient, the `.fade-up` reveal, the `.spec` sheet pattern (used by /work and /contact), the `.principles` numbered list (used by /home and the checklist on /contact), and the global `prefers-reduced-motion` kill-switch.

- [ ] **Step 1: Replace file contents**

Replace `src/styles/base.css` with:

```css
@import './tokens.css';

/* Mini reset */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
html, body { height: 100%; }
img, svg { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }
ol, ul { list-style: none; }

/* Body */
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}
body {
  background: var(--background);
  color: var(--on-surface);
  font-size: 1rem;
  line-height: 1.6;
  overflow-x: hidden;
  transition: background var(--motion-fast) var(--motion-soft), color var(--motion-fast) var(--motion-soft);
  position: relative;
}

/* Body-level sunlight gradient: two glows that drift very slowly. Theme-aware via tokens. */
body::before {
  content: '';
  position: fixed;
  inset: -10vh -20vw;
  background:
    radial-gradient(ellipse 50vmin 70vmin at 18% 25%, var(--glow-1), transparent 55%),
    radial-gradient(ellipse 36vmin 56vmin at 85% 75%, var(--glow-2), transparent 55%);
  pointer-events: none;
  animation: sunlight 90s ease-in-out infinite alternate;
  z-index: 0;
}
@keyframes sunlight {
  0%   { transform: translate(-3vw, -2vh) rotate(-2deg); }
  100% { transform: translate( 3vw,  2vh) rotate( 2deg); }
}

/* Night-only ember flicker overlay (var --glow-ember undefined in day → renders transparent). */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 50vmin 70vmin at 22% 28%, var(--glow-ember, transparent), transparent 50%);
  pointer-events: none;
  animation: flicker 6s steps(1, end) infinite;
  z-index: 0;
  mix-blend-mode: screen;
}
@keyframes flicker {
  0%, 22%, 27%, 60%, 65%, 100% { opacity: 0.95; }
  23%, 26%                      { opacity: 0.55; }
  61%, 64%                      { opacity: 0.70; }
  90%, 93%                      { opacity: 0.80; }
}

/* Type scale */
.t-display { font-size: 2.4rem; line-height: 1.05; font-weight: 600; letter-spacing: -0.025em; }
.t-h1      { font-size: 1.7rem; line-height: 1.15; font-weight: 600; }
.t-h2      { font-size: 1.2rem; line-height: 1.25; font-weight: 600; }
.t-body    { font-size: 1rem;   line-height: 1.6;  font-weight: 400; }
.t-small   { font-size: 0.78rem; line-height: 1.5;  font-weight: 400; color: var(--on-surface-muted); }
.t-label   { font-size: 0.78rem; line-height: 1.4;  font-weight: 500; color: var(--on-surface-muted); }

@media (min-width: 720px) {
  .t-display { font-size: clamp(2.4rem, 5vw, 3.4rem); }
  .t-h1      { font-size: 2.1rem; }
}

/* Focus */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Skip-to-content */
.skip-link {
  position: absolute;
  left: var(--sp-3);
  top: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  background: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-pill);
  font-weight: 600;
  transform: translateY(-200%);
  transition: transform var(--motion-fast) var(--motion-soft);
  z-index: 100;
}
.skip-link:focus-visible { transform: translateY(0); }

/* Page container */
.page {
  max-width: var(--page-max);
  margin: 0 auto;
  padding-left: var(--page-pad-mobile);
  padding-right: var(--page-pad-mobile);
  position: relative;
  z-index: 1;
}
@media (min-width: 720px) { .page { padding-left: var(--page-pad-tablet); padding-right: var(--page-pad-tablet); } }
@media (min-width: 1080px) { .page { padding-left: var(--page-pad-desktop); padding-right: var(--page-pad-desktop); } }

/* Sections */
.section { padding-top: var(--sp-7); padding-bottom: var(--sp-7); position: relative; }
@media (min-width: 720px) { .section { padding-top: var(--sp-8); padding-bottom: var(--sp-8); } }

/* Load-time staggered fade-in */
.fade-up {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeUp 700ms var(--motion-soft) forwards;
}
.fade-up.delay-1 { animation-delay: 80ms; }
.fade-up.delay-2 { animation-delay: 240ms; }
.fade-up.delay-3 { animation-delay: 400ms; }
.fade-up.delay-4 { animation-delay: 560ms; }
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* Spec sheet — used on /work (NDA cards) and /contact (meta chips reuse a variant) */
.spec { display: grid; grid-template-columns: 1fr; gap: 0; max-width: 80ch; }
.spec-key {
  padding: var(--sp-4) 0 var(--sp-2);
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  border-top: 1px solid var(--outline);
}
.spec-val {
  padding: 0 0 var(--sp-4);
  color: var(--on-surface-soft);
  max-width: 60ch;
}
.spec :first-child.spec-key { border-top: none; padding-top: 0; }
@media (min-width: 720px) {
  .spec { grid-template-columns: 14ch 1fr; column-gap: var(--sp-6); row-gap: 0; }
  .spec-key { padding: var(--sp-4) 0; border-top: 1px solid var(--outline); }
  .spec-val { padding: var(--sp-4) 0; border-top: 1px solid var(--outline); }
  .spec :first-child.spec-key,
  .spec :first-child.spec-key + .spec-val { border-top: 1px solid var(--outline); }
}

/* Principles list — used on /home and as the /contact checklist */
.numbered {
  list-style: none;
  counter-reset: p;
  max-width: 64ch;
  padding-left: 0;
}
.numbered > li {
  counter-increment: p;
  padding: var(--sp-3) 0;
  border-bottom: 1px solid var(--outline);
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: var(--sp-3);
  align-items: baseline;
  font-size: 1rem;
}
.numbered > li::before {
  content: "✿";
  font-size: 1.15rem;
  line-height: 1;
}
/* Five-color florette cycle */
.numbered--cycle > li:nth-child(1)::before { color: var(--accent-ochre); }
.numbered--cycle > li:nth-child(2)::before { color: var(--accent-sage); }
.numbered--cycle > li:nth-child(3)::before { color: var(--primary-light); }
.numbered--cycle > li:nth-child(4)::before { color: var(--accent-sky); }
.numbered--cycle > li:nth-child(5)::before { color: var(--accent-rose); }

/* Reduced motion — kill all animation/transition */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  body::before, body::after { animation: none !important; }
  .fade-up { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 2: Verify**

```
npm run build              # success
npm run test:run           # tests pass
npm run check:no-purple    # only favicon.svg failures remain
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/base.css
git commit -m "Move shared utilities into base.css: fade-up, spec sheet, numbered list, sunlight, reduced-motion guard"
```

---

## Task 4: Re-tint `files/bulonka-studio-icon.svg` to currentColor

Same as the de-slopping plan Task 4. Replace the file with this content:

```xml
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <rect width="1024" height="1024" fill="#15120E"/>
  <path d="M300 340 Q300 310 330 310 L355 310 Q370 310 370 325 Q370 340 355 340 L345 340 Q325 340 325 360 L325 480 Q325 512 295 512 Q325 512 325 544 L325 664 Q325 684 345 684 L355 684 Q370 684 370 699 Q370 714 355 714 L330 714 Q300 714 300 684 Z" fill="#E5DCC8"/>
  <path d="M724 340 Q724 310 694 310 L669 310 Q654 310 654 325 Q654 340 669 340 L679 340 Q699 340 699 360 L699 480 Q699 512 729 512 Q699 512 699 544 L699 664 Q699 684 679 684 L669 684 Q654 684 654 699 Q654 714 669 714 L694 714 Q724 714 724 684 Z" fill="#E5DCC8"/>
  <path d="M512 520 Q480 520 458 540 Q436 560 436 585 Q436 615 460 635 Q484 655 512 655 Q540 655 564 635 Q588 615 588 585 Q588 560 566 540 Q544 520 512 520 Z"/>
  <ellipse cx="428" cy="490" rx="28" ry="32" transform="rotate(-15 428 490)"/>
  <ellipse cx="480" cy="448" rx="26" ry="32" transform="rotate(-5 480 448)"/>
  <ellipse cx="544" cy="448" rx="26" ry="32" transform="rotate(5 544 448)"/>
  <ellipse cx="596" cy="490" rx="28" ry="32" transform="rotate(15 596 490)"/>
</svg>
```

Then commit:
```bash
git add files/bulonka-studio-icon.svg
git commit -m "Re-tint source brand icon: currentColor + warm-earth background"
```

---

## Task 5: Replace `public/favicon.svg`

Replace the file with this content (`#C97B5C` paw on warm-dark background — same as the de-slopping plan):

```xml
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#15120E"/>
  <path d="M300 340 Q300 310 330 310 L355 310 Q370 310 370 325 Q370 340 355 340 L345 340 Q325 340 325 360 L325 480 Q325 512 295 512 Q325 512 325 544 L325 664 Q325 684 345 684 L355 684 Q370 684 370 699 Q370 714 355 714 L330 714 Q300 714 300 684 Z" fill="#E5DCC8"/>
  <path d="M724 340 Q724 310 694 310 L669 310 Q654 310 654 325 Q654 340 669 340 L679 340 Q699 340 699 360 L699 480 Q699 512 729 512 Q699 512 699 544 L699 664 Q699 684 679 684 L669 684 Q654 684 654 699 Q654 714 669 714 L694 714 Q724 714 724 684 Z" fill="#E5DCC8"/>
  <path d="M512 520 Q480 520 458 540 Q436 560 436 585 Q436 615 460 635 Q484 655 512 655 Q540 655 564 635 Q588 615 588 585 Q588 560 566 540 Q544 520 512 520 Z" fill="#C97B5C"/>
  <ellipse cx="428" cy="490" rx="28" ry="32" transform="rotate(-15 428 490)" fill="#C97B5C"/>
  <ellipse cx="480" cy="448" rx="26" ry="32" transform="rotate(-5 480 448)" fill="#C97B5C"/>
  <ellipse cx="544" cy="448" rx="26" ry="32" transform="rotate(5 544 448)" fill="#C97B5C"/>
  <ellipse cx="596" cy="490" rx="28" ry="32" transform="rotate(15 596 490)" fill="#C97B5C"/>
</svg>
```

After this, `npm run check:no-purple` should print `OK no purple references anywhere`.

```bash
git add public/favicon.svg
git commit -m "Re-render favicon with terracotta accent on warm-dark ground"
```

---

## Task 6: Regenerate OG preview image — DEFERRED

Same as de-slopping plan Task 6. The PNG `public/bulonka-studio-preview.png` should eventually be regenerated. Skip and note in TODO; rest of plan proceeds without it.

---

## Task 7: Restyle `Button.vue` to bouncy mono variant

Replace `src/components/Button.vue`:

```vue
<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <a v-if="href" :href="href" class="btn">
    <slot />
  </a>
  <button v-else :type="type" class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  min-height: 44px;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-card);
  background: var(--primary);
  color: var(--on-primary);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-fab);
  transition: transform 220ms var(--motion-bounce), box-shadow var(--motion-fast) var(--motion-soft);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-fab-hover);
  text-decoration: none;
}
</style>
```

```bash
git add src/components/Button.vue
git commit -m "Restyle Button to bouncy mono variant with multi-state shadow"
```

---

## Task 8: Restyle `Nav.vue` — pulsing brand dot

Replace `src/components/Nav.vue`:

```vue
<script setup>
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const path = ref('/');

onMounted(() => { path.value = window.location.pathname; });

function isActive(prefix) {
  if (prefix === '/work') return path.value.startsWith('/work');
  if (prefix === '/contact') return path.value.startsWith('/contact');
  return false;
}
</script>

<template>
  <header class="nav-bar">
    <div class="page nav-inner">
      <a href="/" class="brand" aria-label="Bulonka Studio — home">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="brand-name">Bulonka Studio</span>
      </a>
      <nav aria-label="Primary">
        <a href="/work/" :class="['nav-link', { 'nav-link--active': isActive('/work') }]">Work</a>
        <a href="/contact/" :class="['nav-link', { 'nav-link--active': isActive('/contact') }]">Contact</a>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-bar {
  background: var(--background);
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.005em;
  color: var(--on-surface);
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
  padding: 0.4rem 0.4rem;
  border-bottom: 2px solid transparent;
  transition: color var(--motion-fast) var(--motion-soft), border-bottom-color var(--motion-fast) var(--motion-soft);
}
.nav-link:hover { color: var(--on-surface); }
.nav-link--active { color: var(--primary); border-bottom-color: var(--primary-light); font-weight: 600; }
</style>
```

```bash
git add src/components/Nav.vue
git commit -m "Restyle Nav: pulsing brand dot, terracotta active underline"
```

---

## Task 9: Restyle `Footer.vue` — mailto + signoff

Replace `src/components/Footer.vue`:

```vue
<template>
  <footer class="footer">
    <div class="page footer-inner">
      <span>© 2026 Bulonka Studio &nbsp;·&nbsp; <a href="/privacy/">Privacy</a></span>
      <span class="signoff">Made with care in Ukraine</span>
      <span><a href="mailto:yholiakh@gmail.com">yholiakh@gmail.com</a></span>
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
.signoff { font-style: italic; color: var(--on-surface-soft); }
.signoff::before { content: "— "; color: var(--accent-ochre); }
</style>
```

```bash
git add src/components/Footer.vue
git commit -m "Footer: real mailto link, italic signoff with ochre em-dash"
```

---

## Task 10: Rewrite `src/pages/Home.vue`

Full content. Note this template includes BOTH the day sun SVG and the night lamp SVG; CSS controls visibility.

```vue
<script setup>
const principles = [
  'No third-party SDK ships without explicit approval.',
  'Analytics is something to discuss in scope. There is no default.',
  'Data minimization is in the spec from day one.',
  'Native when it serves the privacy model. Cross-platform when it serves the user.',
  'Gambling and adult-content projects are declined.',
];
</script>

<template>
  <!-- Hero -->
  <section class="section page hero fade-up">
    <!-- Day decoration -->
    <svg class="hero-sun" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="18"/>
      <line x1="50" y1="6"  x2="50" y2="20"/>
      <line x1="50" y1="80" x2="50" y2="94"/>
      <line x1="6"  y1="50" x2="20" y2="50"/>
      <line x1="80" y1="50" x2="94" y2="50"/>
      <line x1="18" y1="18" x2="28" y2="28"/>
      <line x1="72" y1="72" x2="82" y2="82"/>
      <line x1="82" y1="18" x2="72" y2="28"/>
      <line x1="28" y1="72" x2="18" y2="82"/>
    </svg>

    <!-- Night decoration -->
    <svg class="hero-lamp" viewBox="0 0 96 110" aria-hidden="true">
      <ellipse class="glow" cx="48" cy="44" rx="44" ry="42"/>
      <path d="M22 18 L74 18 L66 50 L30 50 Z" fill="var(--primary-light)" opacity="0.85"/>
      <path d="M22 18 L74 18 L66 50 L30 50 Z" fill="none" stroke="var(--primary)" stroke-width="1.5" opacity="0.7"/>
      <ellipse class="bulb" cx="48" cy="56" rx="10" ry="8"/>
      <line x1="48" y1="50" x2="48" y2="92" stroke="var(--primary-light)" stroke-width="3"/>
      <ellipse cx="48" cy="100" rx="20" ry="4" fill="var(--primary-light)"/>
    </svg>

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

    <div class="hero-cta-row">
      <a class="cta" href="mailto:yholiakh@gmail.com">Email yholiakh@gmail.com</a>
      <span class="t-small cta-side">replies usually inside a business day.</span>
    </div>
  </section>

  <!-- Today / on the workbench -->
  <section class="section page today fade-up delay-1">
    <div class="today-card">
      <div class="today-stamp">This week</div>
      <p class="t-label today-label">On the workbench</p>
      <p class="today-text">
        Auditing what a health-tracking iOS app actually <em>sends home</em> &mdash; third-party SDKs, telemetry, and the gap between privacy policy and on-device behavior.
        <!-- TBD: founder updates this string as actual current work changes — see spec §10.3 -->
      </p>
    </div>
    <!-- Potted plant decoration (desktop only) -->
    <svg class="plant" viewBox="0 0 92 130" aria-hidden="true">
      <path d="M22 92 L70 92 L66 124 Q66 128 62 128 L30 128 Q26 128 26 124 Z" fill="var(--primary-light)"/>
      <rect x="20" y="86" width="52" height="8" rx="2" fill="var(--primary)"/>
      <ellipse cx="46" cy="92" rx="22" ry="3" fill="var(--on-surface)" opacity="0.35"/>
      <g class="leaf"><path d="M46 88 Q22 70 18 36 Q34 44 44 70 Z" fill="var(--accent-sage)"/></g>
      <g class="leaf"><path d="M46 86 Q70 64 78 30 Q60 42 50 70 Z" fill="var(--accent-sage)" opacity="0.85"/></g>
      <g class="leaf"><path d="M46 86 Q34 56 30 14 Q44 32 48 68 Z" fill="var(--accent-sage)" opacity="0.7"/></g>
      <g class="leaf"><path d="M46 86 Q56 60 62 22 Q50 40 48 68 Z" fill="var(--accent-sage)" opacity="0.55"/></g>
      <circle cx="22" cy="36" r="5" fill="var(--accent-ochre)"/>
      <circle cx="22" cy="36" r="2" fill="var(--accent-rose)"/>
    </svg>
  </section>

  <!-- Three rooms (services) -->
  <section class="section page rooms-section fade-up delay-2" id="services">
    <h2 class="section-h"><span class="dot dot--ochre"></span>Three rooms in this studio</h2>
    <p class="t-body section-sub">Each one is something the studio has shipped before — paid, on a real project, end to end.</p>

    <!-- Window decoration (desktop only) -->
    <svg class="window-deco" viewBox="0 0 96 110" aria-hidden="true">
      <rect x="2" y="2" width="92" height="106" rx="6" fill="var(--surface-deep)" stroke="var(--primary)" stroke-width="2"/>
      <rect class="sky" x="8"  y="8"  width="38" height="46" rx="2" fill="var(--accent-sky)"/>
      <rect class="sky" x="50" y="8"  width="38" height="46" rx="2" fill="var(--accent-sky)" opacity="0.85"/>
      <rect class="sky" x="8"  y="58" width="38" height="44" rx="2" fill="var(--accent-sky)" opacity="0.9"/>
      <rect class="sky" x="50" y="58" width="38" height="44" rx="2" fill="var(--accent-sky)" opacity="0.75"/>
      <line x1="48" y1="6" x2="48" y2="104" stroke="var(--primary)" stroke-width="2"/>
      <line x1="4"  y1="56" x2="92" y2="56" stroke="var(--primary)" stroke-width="2"/>
      <circle cx="20" cy="22" r="4" fill="var(--accent-ochre)"/>
    </svg>

    <div class="rooms">
      <div class="room room--build">
        <div class="room-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 21h16M6 21V8l6-4 6 4v13M10 13h4M10 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3 class="room-title">Build</h3>
        <p class="room-body">Full apps, idea to App Store. iOS native, Android native, and KMP when it earns its keep.</p>
      </div>

      <div class="room room--audit">
        <div class="room-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <h3 class="room-title">Audit</h3>
        <p class="room-body">Privacy and behavior reviews of existing apps. Threat models, SDK reviews, encryption, data-minimization.</p>
      </div>

      <div class="room room--test">
        <div class="room-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M2 12c4-6 16-6 20 0M6 12c2-3 10-3 12 0M10 12c1-1 3-1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/></svg>
        </div>
        <h3 class="room-title">Test</h3>
        <p class="room-body">What an app actually does on a real device, and what it sends where. Network traces and behavior reports.</p>
      </div>
    </div>
  </section>

  <!-- House rules -->
  <section class="section page fade-up delay-3" id="principles">
    <h2 class="section-h"><span class="dot dot--sage"></span>House rules</h2>
    <p class="t-body section-sub">Defaults the studio holds, written down so a new client can disagree before signing.</p>
    <ol class="numbered numbered--cycle">
      <li v-for="(p, i) in principles" :key="i">{{ p }}</li>
    </ol>
  </section>
</template>

<style scoped>
/* Hero */
.hero { padding-top: var(--sp-7); }
.hero-headline { margin-top: var(--sp-3); margin-bottom: var(--sp-4); max-width: 24ch; }
.hero-lede { color: var(--on-surface-soft); max-width: 56ch; font-size: 1.08rem; margin-bottom: var(--sp-5); }

.greeting {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.92rem;
  color: var(--on-surface-soft);
  background: color-mix(in srgb, var(--accent-ochre) 18%, transparent);
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  font-weight: 500;
  margin-bottom: var(--sp-5);
}
[data-theme='light'] .greeting--night,
:root:not([data-theme]) .greeting--night { display: none; }
[data-theme='dark']  .greeting--day { display: none; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .greeting--day { display: none; }
  :root:not([data-theme]) .greeting--night { display: inline-flex; }
}

.wave { display: inline-block; animation: wave 2.4s ease-in-out infinite; transform-origin: 70% 80%; }
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-12deg); }
  40% { transform: rotate( 14deg); }
  60% { transform: rotate( -8deg); }
  80% { transform: rotate(  4deg); }
}
.flame { display: inline-block; animation: flame 1.8s ease-in-out infinite; transform-origin: 50% 80%; }
@keyframes flame {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-8deg) scale(1.05); }
  50% { transform: rotate( 6deg) scale(0.95); }
  75% { transform: rotate(-4deg) scale(1.02); }
}

.h-mark { position: relative; display: inline-block; }
.h-mark::after {
  content: '';
  position: absolute;
  left: -2px; right: -2px; bottom: 6px;
  height: 10px;
  background: var(--accent-sage);
  opacity: 0.30;
  z-index: -1;
  border-radius: 2px;
  transform: skewY(-1.5deg);
}
.h-accent {
  background: linear-gradient(120deg, var(--primary-light) 0%, var(--accent-ochre) 50%, var(--accent-rose) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
  animation: gradient-breathe 14s ease-in-out infinite;
}
@keyframes gradient-breathe {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.hero-cta-row { display: flex; flex-wrap: wrap; gap: var(--sp-3); align-items: center; }
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
.cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-fab-hover); text-decoration: none; }
.cta-side { color: var(--on-surface-muted); }

/* Hero corner decorations */
.hero-sun, .hero-lamp { position: absolute; top: var(--sp-3); right: var(--sp-3); pointer-events: none; }
.hero-sun { width: 96px; height: 96px; opacity: 0.78; animation: spin 80s linear infinite; }
.hero-sun circle { fill: var(--accent-ochre); }
.hero-sun line { stroke: var(--accent-ochre); stroke-width: 3; stroke-linecap: round; }
@keyframes spin { to { transform: rotate(360deg); } }

.hero-lamp { width: 96px; height: 110px; opacity: 0.95; }
.hero-lamp .bulb { fill: var(--primary); animation: bulb-flicker 4.5s ease-in-out infinite; transform-origin: center; }
.hero-lamp .glow { fill: color-mix(in srgb, var(--primary) 22%, transparent); animation: glow-flicker 4.5s ease-in-out infinite; transform-origin: center; }
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

[data-theme='light'] .hero-lamp,
:root:not([data-theme]) .hero-lamp { display: none; }
[data-theme='dark'] .hero-sun { display: none; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .hero-sun { display: none; }
  :root:not([data-theme]) .hero-lamp { display: block; }
}

@media (max-width: 720px) {
  .hero-sun, .hero-lamp { width: 56px; height: 64px; top: var(--sp-2); right: var(--sp-2); }
}

/* Today block */
.today { padding-top: var(--sp-3); padding-bottom: var(--sp-7); }
.today-card {
  background: var(--surface);
  border: 1.5px dashed color-mix(in srgb, var(--accent-sage) 55%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--sp-5) var(--sp-5);
  max-width: 78ch;
  position: relative;
  transition: transform 250ms var(--motion-bounce);
  box-shadow: var(--shadow-card);
}
.today-card:hover { transform: translateY(-2px) rotate(-0.25deg); }
.today-stamp {
  position: absolute;
  top: -14px; right: var(--sp-4);
  background: var(--accent-sage);
  color: var(--on-primary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  transform: rotate(-3deg);
  box-shadow: 0 3px 10px color-mix(in srgb, var(--accent-sage) 28%, transparent);
}
.today-label { margin-bottom: var(--sp-2); }
.today-text { font-size: 1.05rem; line-height: 1.55; color: var(--on-surface); }
.today-text em {
  font-style: normal;
  background: linear-gradient(transparent 60%, color-mix(in srgb, var(--accent-ochre) 32%, transparent) 60%);
  padding: 0 2px;
}

.plant {
  position: absolute;
  right: 4%;
  bottom: var(--sp-5);
  width: 92px;
  height: 130px;
  pointer-events: none;
  display: none;
}
@media (min-width: 980px) { .plant { display: block; } }
.plant .leaf { transform-origin: 50% 100%; animation: leaf-wave 6s ease-in-out infinite; }
.plant .leaf:nth-child(2) { animation-delay: -1.5s; }
.plant .leaf:nth-child(3) { animation-delay: -3s; }
.plant .leaf:nth-child(4) { animation-delay: -4.5s; }
@keyframes leaf-wave { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }

/* Sections common */
.section-h {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: var(--sp-2);
  display: inline-flex;
  align-items: baseline;
  gap: var(--sp-3);
}
.dot {
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  transform: translateY(-3px);
}
.dot--ochre { background: var(--accent-ochre); }
.dot--sage  { background: var(--accent-sage); }
.section-sub { color: var(--on-surface-muted); margin-bottom: var(--sp-5); max-width: 56ch; }

/* Three rooms */
.rooms-section { position: relative; }
.window-deco {
  position: absolute;
  top: var(--sp-7); right: 6%;
  width: 96px; height: 110px;
  pointer-events: none;
  opacity: 0.85;
  display: none;
}
@media (min-width: 980px) { .window-deco { display: block; } }
.window-deco .sky { animation: sky-drift 18s ease-in-out infinite alternate; transform-origin: center; }
@keyframes sky-drift {
  0%   { transform: translateX(-2px) translateY(0); }
  100% { transform: translateX( 2px) translateY(2px); }
}

.rooms { display: grid; grid-template-columns: 1fr; gap: var(--sp-3); }
@media (min-width: 720px) { .rooms { grid-template-columns: repeat(3, 1fr); } }
.room {
  padding: var(--sp-5) var(--sp-4) var(--sp-5);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--outline);
  transition: transform 280ms var(--motion-bounce), box-shadow 280ms;
}
.room:hover { transform: translateY(-5px); }
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
</style>
```

Verify: `npm run build`, `npm run check:no-purple`, `npm run check`. All green.

```bash
git add src/pages/Home.vue
git commit -m "Rewrite Home: hero (sun/lamp), today block, three rooms, house rules — colorful-home"
```

---

## Task 11: Rewrite `src/pages/Work.vue`

```vue
<script setup>
const ndaSheet = [
  { key: 'Platforms', val: 'iOS · Android' },
  { key: 'Surfaces',  val: 'Privacy engineering · App testing · Full builds' },
  { key: 'What can be shown', val: 'Code, architecture, and the privacy choices behind shipped work — walked through on a call.' },
];
</script>

<template>
  <section class="section page page-h fade-up">
    <span class="page-kicker">Selected projects</span>
    <h1 class="t-display work-heading">The shelf is mostly empty &mdash; on purpose.</h1>
    <p class="t-body work-lede">
      Bulonka Studio is a young practice. Most current work ships under NDA. It's preferable to show nothing here than to fake a portfolio.
    </p>
  </section>

  <section class="section page fade-up delay-1">
    <div class="empty-grid">
      <svg class="envelope" viewBox="0 0 200 130" aria-hidden="true">
        <rect x="6" y="20" width="188" height="100" rx="6" fill="var(--surface)" stroke="var(--primary)" stroke-width="1.6"/>
        <path d="M6 24 L100 76 L194 24" fill="none" stroke="var(--primary)" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M6 24 L100 76 L194 24 L194 20 L6 20 Z" fill="var(--surface-deep)"/>
        <rect x="22" y="40" width="156" height="60" rx="3" fill="var(--surface)" stroke="var(--outline)"/>
        <line x1="32" y1="56" x2="160" y2="56" stroke="var(--primary-light)" stroke-width="2" opacity="0.5"/>
        <line x1="32" y1="64" x2="140" y2="64" stroke="var(--on-surface-muted)" stroke-width="1" opacity="0.5"/>
        <line x1="32" y1="72" x2="150" y2="72" stroke="var(--on-surface-muted)" stroke-width="1" opacity="0.5"/>
        <circle cx="100" cy="92" r="14" fill="var(--accent-rose)"/>
        <text x="100" y="96" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="var(--on-primary)">B</text>
      </svg>
      <div>
        <h2 class="t-h1 empty-h">First public case studies are coming.</h2>
        <p class="t-body empty-body">When something can be shown publicly, it lands here. Until then, the shelf stays honest.</p>
      </div>
    </div>
  </section>

  <section class="section page fade-up delay-2">
    <h2 class="section-h"><span class="dot dot--sage"></span>Currently shipped under NDA</h2>
    <p class="t-body section-sub">Bulonka Studio has delivered work that can't be shown on a public page. Happy to walk through it on a call.</p>

    <dl class="spec">
      <template v-for="row in ndaSheet" :key="row.key">
        <dt class="spec-key">{{ row.key }}</dt>
        <dd class="spec-val t-body">{{ row.val }}</dd>
      </template>
    </dl>

    <div class="cta-row">
      <a class="cta" href="mailto:yholiakh@gmail.com">Email yholiakh@gmail.com</a>
      <span class="t-small cta-side">to schedule a walk-through.</span>
    </div>
  </section>
</template>

<style scoped>
.page-h { padding-top: var(--sp-7); }
.page-kicker {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: var(--sp-3);
  background: color-mix(in srgb, var(--primary-light) 14%, transparent);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-weight: 600;
}
.work-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 18ch; }
.work-lede { color: var(--on-surface-soft); max-width: 60ch; font-size: 1.06rem; }

.empty-grid { display: grid; grid-template-columns: 1fr; gap: var(--sp-5); align-items: center; max-width: 880px; }
@media (min-width: 720px) { .empty-grid { grid-template-columns: 200px 1fr; } }
.envelope {
  width: 200px; height: 130px;
  margin: 0 auto;
  transform-origin: center;
  animation: envelope-tilt 8s ease-in-out infinite alternate;
}
@keyframes envelope-tilt {
  0%   { transform: rotate(-3deg) translateY(0); }
  100% { transform: rotate( 2deg) translateY(-4px); }
}
.empty-h { margin-bottom: var(--sp-2); }
.empty-body { color: var(--on-surface-soft); max-width: 56ch; }

.section-h {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: var(--sp-2);
  display: inline-flex;
  align-items: baseline;
  gap: var(--sp-3);
}
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; transform: translateY(-3px); }
.dot--sage { background: var(--accent-sage); }
.section-sub { color: var(--on-surface-muted); margin-bottom: var(--sp-5); max-width: 56ch; }

.cta-row { display: flex; flex-wrap: wrap; gap: var(--sp-3); align-items: center; margin-top: var(--sp-7); }
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
.cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-fab-hover); text-decoration: none; }
.cta-side { color: var(--on-surface-muted); }
</style>
```

```bash
git add src/pages/Work.vue
git commit -m "Rewrite Work: tilting envelope empty-state, NDA spec sheet, mailto CTA"
```

---

## Task 12: Rewrite `src/pages/Contact.vue`

```vue
<script setup>
const meta = [
  { key: 'Languages', val: 'English · Українська', tone: 'ochre' },
  { key: 'Time zone', val: 'GMT+2 / +3 (Ukraine)', tone: 'sage' },
  { key: 'Hours',     val: 'Mon–Fri · 09:00–18:00', tone: 'sky' },
  { key: 'Reply within', val: '~1 business day',    tone: 'rose' },
];

const checklist = [
  "What the app is for, and who it's for.",
  'Where you are today (idea, wireframes, or an existing app to audit).',
  'Any privacy or regulatory constraints (GDPR, HIPAA, etc.).',
  'Rough timeline and budget if you have them.',
];
</script>

<template>
  <section class="section page page-h fade-up">
    <span class="page-kicker">Contact</span>
    <h1 class="t-display contact-heading">Leave a note in the mailbox.</h1>
    <p class="t-body contact-lede">
      Email is the only way in. No forms, no calendars, no analytics, no third parties. Reply usually inside a business day.
    </p>
  </section>

  <section class="section page fade-up delay-1">
    <div class="mailbox-grid">
      <svg class="mailbox" viewBox="0 0 200 200" aria-hidden="true">
        <rect x="92" y="120" width="16" height="76" fill="var(--primary)" rx="2"/>
        <path d="M30 60 Q30 40 50 40 L150 40 Q170 40 170 60 L170 120 Q170 130 160 130 L40 130 Q30 130 30 120 Z" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="2"/>
        <path d="M30 60 Q30 40 50 40 L150 40 Q170 40 170 60" fill="none" stroke="var(--primary)" stroke-width="2" opacity="0.4"/>
        <rect x="58" y="78" width="84" height="20" rx="6" fill="var(--surface-deep)" stroke="var(--primary)" stroke-width="1"/>
        <g class="letters">
          <rect x="64" y="62" width="28" height="20" fill="var(--surface)" stroke="var(--on-surface-muted)" stroke-width="0.8" transform="rotate(-6 78 72)"/>
          <rect x="100" y="60" width="32" height="22" fill="var(--surface-deep)" stroke="var(--on-surface-muted)" stroke-width="0.8" transform="rotate( 4 116 71)"/>
        </g>
        <g class="flag">
          <rect x="170" y="60" width="3" height="40" fill="var(--primary)"/>
          <polygon points="173,60 198,64 198,82 173,78" fill="var(--accent-rose)"/>
        </g>
        <line x1="20" y1="196" x2="180" y2="196" stroke="var(--on-surface-muted)" stroke-width="1" opacity="0.3"/>
        <path d="M70 196 Q72 188 74 196 M76 196 Q78 190 80 196" stroke="var(--accent-sage)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M124 196 Q126 188 128 196 M130 196 Q132 190 134 196" stroke="var(--accent-sage)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>

      <div class="email-card">
        <p class="t-label email-label">Write to</p>
        <a class="email-link" href="mailto:yholiakh@gmail.com">yholiakh@gmail.com</a>
        <p class="t-small email-side">Opens your mail app. The flag goes up when something arrives.</p>
      </div>
    </div>
  </section>

  <section class="section page fade-up delay-2">
    <h2 class="section-h"><span class="dot dot--sage"></span>Details</h2>
    <p class="t-body section-sub">A few things worth knowing before the first email.</p>

    <div class="meta">
      <div v-for="m in meta" :key="m.key" :class="['meta-item', `meta-item--${m.tone}`]">
        <p class="t-label meta-key">{{ m.key }}</p>
        <p class="meta-val">{{ m.val }}</p>
      </div>
    </div>
  </section>

  <section class="section page fade-up delay-3">
    <h2 class="section-h"><span class="dot dot--ochre"></span>What to include in your first email</h2>
    <p class="t-body section-sub">Helps the studio give you a useful answer instead of asking three rounds of clarifying questions.</p>
    <ol class="numbered numbered--cycle">
      <li v-for="(c, i) in checklist" :key="i">{{ c }}</li>
    </ol>
  </section>
</template>

<style scoped>
.page-h { padding-top: var(--sp-7); }
.page-kicker {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: var(--sp-3);
  background: color-mix(in srgb, var(--primary-light) 14%, transparent);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-weight: 600;
}
.contact-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 18ch; }
.contact-lede { color: var(--on-surface-soft); max-width: 60ch; font-size: 1.06rem; }

.mailbox-grid { display: grid; grid-template-columns: 1fr; gap: var(--sp-7); align-items: center; max-width: 880px; }
@media (min-width: 720px) { .mailbox-grid { grid-template-columns: 200px 1fr; } }
.mailbox { width: 200px; height: 200px; margin: 0 auto; }
.mailbox svg { width: 100%; height: 100%; }
.mailbox .flag { transform-origin: 33% 100%; animation: flag-flip 4.8s ease-in-out infinite; }
@keyframes flag-flip {
  0%, 35% { transform: rotate(0deg); }
  45%, 75% { transform: rotate(-90deg); }
  85%, 100% { transform: rotate(0deg); }
}
.mailbox .letters { animation: letter-poke 4.8s ease-in-out infinite; }
@keyframes letter-poke {
  0%, 30% { transform: translateY(0); }
  45%, 70% { transform: translateY(-6px); }
  90%, 100% { transform: translateY(0); }
}

.email-card {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-lg);
  padding: var(--sp-5) var(--sp-5);
  box-shadow: var(--shadow-card);
  position: relative;
}
.email-card::before {
  content: '';
  position: absolute;
  inset: -6px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-light) 18%, transparent), color-mix(in srgb, var(--accent-sage) 18%, transparent) 50%, color-mix(in srgb, var(--accent-sky) 18%, transparent));
  border-radius: 30px;
  z-index: -1;
  filter: blur(14px);
  opacity: 0.7;
}
.email-label { margin-bottom: var(--sp-2); }
.email-link {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 1.45rem;
  color: var(--primary);
  font-weight: 600;
  letter-spacing: -0.01em;
  border-bottom: 2px solid color-mix(in srgb, var(--primary-light) 50%, transparent);
  padding-bottom: 2px;
  transition: border-color var(--motion-fast);
}
.email-link:hover { border-bottom-color: var(--primary); text-decoration: none; }
.email-side { color: var(--on-surface-muted); margin-top: var(--sp-2); }

.section-h {
  font-size: 1.4rem;
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

.meta { display: grid; grid-template-columns: 1fr; gap: var(--sp-3); max-width: 80ch; }
@media (min-width: 720px) { .meta { grid-template-columns: repeat(2, 1fr); } }
.meta-item {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-card);
  transition: transform 220ms var(--motion-bounce);
}
.meta-item:hover { transform: translateY(-2px); }
.meta-item--ochre { background: color-mix(in srgb, var(--accent-ochre) 16%, transparent); }
.meta-item--sage  { background: color-mix(in srgb, var(--accent-sage)  16%, transparent); }
.meta-item--sky   { background: color-mix(in srgb, var(--accent-sky)   18%, transparent); }
.meta-item--rose  { background: color-mix(in srgb, var(--accent-rose)  16%, transparent); }
.meta-key { margin-bottom: var(--sp-1); }
.meta-val { font-size: 1.04rem; color: var(--on-surface); }
</style>
```

```bash
git add src/pages/Contact.vue
git commit -m "Rewrite Contact: mailbox SVG with flag-flip + letters, glow email card, colored meta chips"
```

---

## Task 13: Update per-page HTML meta

For each of `index.html`, `work/index.html`, `contact/index.html`, update three things:

1. **`theme-color`** — change from old palette values to:
   - light: `#FAF1E0`
   - dark: `#1A130D`

2. **`<title>` and descriptions** for `index.html`:
   - title: `Bulonka Studio — mobile apps that respect their users`
   - description: `Bulonka Studio is a small mobile studio building privacy-respecting iOS and Android apps. Audits and on-device behavior testing for existing apps. Based in Ukraine.`
   - same for og:title and og:description

3. For `work/index.html`:
   - title: `Work — Bulonka Studio`
   - description: `The shelf is mostly empty on purpose. Most current work ships under NDA — Bulonka Studio is happy to walk through it on a call.` (one em-dash, OK)

4. For `contact/index.html`:
   - title: `Contact — Bulonka Studio`
   - description: `Email Bulonka Studio at yholiakh@gmail.com. No forms, no calendars, no third parties.`

Run `npm run build` and `npm run check:no-purple` to verify.

```bash
git add index.html work/index.html contact/index.html
git commit -m "Update per-page meta: new headlines, descriptions, theme-color values"
```

---

## Task 14: Delete `PhoneMockup.vue` and `ServiceCard.vue`

```bash
grep -r "PhoneMockup\|ServiceCard" src/ index.html work/index.html contact/index.html
# Expect: no matches.

rm src/components/PhoneMockup.vue src/components/ServiceCard.vue
npm run build
git add -u src/components/
git commit -m "Delete PhoneMockup and ServiceCard (replaced by inline SVG decorations)"
```

---

## Task 15: Update `CLAUDE.md`

Add `check:no-purple` to the check chain in the Commands block. Update the privacy/perf invariants section to mention purple is retired and note `scripts/check-no-purple.mjs`. Add a new Surface Design subsection pointing at this spec:

```markdown
**Surface design (palette, typography, copy, motion):**
- Canonical spec: `docs/superpowers/specs/2026-04-29-colorful-home-design.md` — supersedes §5–§6 of the 2026-04-27 spec.
- Brand color: `#8B4A2E` (deep terracotta) primary, `#C97B5C` light companion. Five accent tokens: ochre, sage, sky, rose (day) plus ember (night-only).
- Components `PhoneMockup` and `ServiceCard` no longer exist. Decorations are inline SVG in page templates: sun (Home day), lamp (Home night), plant, window, envelope (Work), mailbox (Contact).
- All animation is CSS keyframes, gated by `prefers-reduced-motion: reduce` in `src/styles/base.css`.
- Copy guidelines (no rhythmic tricolons, no "X — not Y" reversals, no arrow CTAs, em-dash budget, sentence-case labels) live in spec §4. Two scoped exceptions: the hero greeting strings ("Hi — come in", "The lamp is on — come in") and the today-on-workbench block use a softer voice.
```

```bash
git add CLAUDE.md
git commit -m "CLAUDE.md: document colorful-home spec, retired purple, animation conventions"
```

---

## Task 16: Final acceptance pass

- [ ] **Step 1:** `npm run check` — all 6 steps green.
- [ ] **Step 2:** `npm run preview` — visit `/`, `/work`, `/contact`, `/privacy` in both themes. Verify all visuals from spec §6 and §9 acceptance criteria.
- [ ] **Step 3:** Bundle audit — verify each page is under the 15 kB CSS gz budget (this design is closer to the limit than the de-slopping direction). If over, audit `base.css` for redundant declarations.
- [ ] **Step 4:** Reduced-motion test — toggle system motion preference; confirm all animations stop.
- [ ] **Step 5:** Contrast check on the pairs in spec §5.1 (both themes). Report ratios.
- [ ] **Step 6:** Em-dash audit — `grep -n "—\|&mdash;" src/pages/*.vue` and verify no paragraph has 2+ em-dashes.
- [ ] **Step 7:** Visual sanity at 320, 720, 1280 px in both themes. Decorations should hide below 980 px and not break layout.
- [ ] **Step 8:** Commit any acceptance-pass tweaks needed.

---

## Self-review checklist

After all tasks complete:

- All spec §3 in-scope items implemented? ✓
- Token names unchanged for existing eight, six new accents added? Task 2.
- All decorations match the prototype HTML visual? Tasks 10–12.
- No paragraph in shipped copy has 2+ em-dashes? Task 16 step 6.
- `npm run check` green? Task 16 step 1.
- Both themes render correctly with `prefers-reduced-motion: reduce`? Task 16 step 4.
- `PhoneMockup.vue` and `ServiceCard.vue` deleted? Task 14.
- No purple references? Task 1 + final check in Task 16.
