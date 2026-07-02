# UI redesign: warm home, next level

You are working in the Bulonka Studio website repository — a Vue 3 + Vite multi-page
static site deployed to https://bulonka-studio.com via GitHub Pages. Your task is a
full UI redesign of the three Vue pages and the shared shell. Keep the site's warm,
cosy, "feels-like-home" character — that idea is the soul of the brand and must
survive the redesign. What changes is the level of craft: layout, composition,
depth, micro-interactions, and responsiveness should feel like a 2026-grade site
built by someone who sweats details, using modern CSS platform features rather than
libraries.

This is an evolution of a shipped design, not a blank slate. Before anything else,
read:

- `CLAUDE.md` — commands, architecture, invariants
- `docs/superpowers/specs/2026-04-29-colorful-home-design.md` — the canonical
  design spec you are superseding in part
- `src/styles/tokens.css` and `src/styles/base.css` — the current token system
- `src/pages/Home.vue`, `src/pages/Work.vue`, `src/pages/Contact.vue`,
  `src/App.vue`, `src/components/{Nav,Footer,ThemeToggle}.vue`

## Process (required)

1. Create a fresh feature branch off the current work.
2. Invoke the `superpowers:brainstorming` skill and design the redesign with me
   before writing any code. Use the `frontend-design:frontend-design` skill for
   aesthetic direction during that design work.
3. Write the agreed design as a new spec in `docs/superpowers/specs/` that states
   which sections of the 2026-04-29 spec it supersedes and which it inherits.
4. Follow the superpowers flow: writing-plans → implementation → verification.
5. Verify visually in a real browser (both themes, 360 px / 768 px / 1080 px+
   widths, `prefers-reduced-motion`, JavaScript disabled) before claiming done.

## Keep — non-negotiable

- **Identity:** warm-home mood. Day = sunlit cream/terracotta (`#FAF1E0` bg,
  `#8B4A2E` primary family); night = lamp-lit walnut/amber (`#1A130D` bg,
  `#E8A87C` primary family). You may refine hues and add/retire accent tokens,
  but the palette must stay warm and the day/night metaphor must survive.
- **Voice:** copy rules in spec §4 (institutional third person, no tricolons, no
  "X — not Y" reversals, no arrow CTAs, em-dash budget, sentence-case labels,
  mailto-address-as-CTA). The two scoped warmth exceptions (hero greeting, today
  block) stay. A redesign may re-flow copy but not re-voice it.
- **Privacy/perf invariants** (`npm run check` enforces all of these):
  zero tracking hosts in `dist/`, zero web fonts (system stack only), zero React,
  no purple (`BB86FC`/`6750A4`/`D4A8FF` or the literal word), per-page budgets
  ≤ 50 kB JS gzipped and ≤ 15 kB CSS gzipped. The CSS budget is the pressure
  point — decoration-heavy ideas must be costed against it.
- **No new dependencies.** Runtime stays `vue` only. No icon, animation, or CSS
  libraries. No SPA router — each route stays a real HTML file.
- **Theme system architecture:** the inline `<head>` script that sets
  `data-theme` before paint (in all four HTML files), the
  `[data-theme='light'|'dark']` + `:root:not([data-theme])` token structure,
  `useTheme.js` semantics (its Vitest suite must stay green), and the no-JS
  fallback (pages fully render and theme follows system without JavaScript;
  only the toggle button may disappear).
- **Motion discipline:** CSS keyframes/transitions only. No JS-driven motion, no
  IntersectionObserver reveals, no scroll-driven animations
  (`animation-timeline`), no parallax, no scroll-snap. Everything gated by
  `prefers-reduced-motion: reduce`.
- **Accessibility:** skip link, `:focus-visible` outlines on every interactive
  element, ≥ 44×44 px tap targets, one `<h1>` per page, decorative SVG
  `aria-hidden`, day muted text stays ≥ AA contrast (don't lighten `#8A6F50`
  on `#FAF1E0`).
- **Housekeeping:** `localStorage` limited to the single `theme` key; per-page
  `theme-color` meta updated in lockstep with any `--background` change;
  `public/CNAME` untouched; `PhoneMockup`/`ServiceCard` components stay deleted;
  `/privacy` (static HTML) is out of scope.

## Redesign freely

Layout and composition of every section; spacing, radius, and type scales; the
inline SVG decoration set (keep, redraw, replace, or retire sun/lamp/plant/
window/envelope/mailbox); card and chip treatments; Nav and Footer; the theme
toggle's look; hover/focus micro-interactions; how the pages relate visually as
a "house" (Home = living room, Work = shelf, Contact = mailbox — the metaphor
may deepen or evolve).

## Modern technique menu

All zero-dependency, CSS-platform-native, and compatible with the guardrails.
Choose what serves the design — this is a menu, not a checklist. Wrap anything
without broad support in `@supports` so the site degrades gracefully.

- **Cross-document view transitions** (`@view-transition { navigation: auto }`)
  — declarative page-to-page morphs between Home/Work/Contact, e.g. the nav and
  brand persisting while content crossfades. Pure CSS, MPA-native, progressive
  enhancement. Must respect `prefers-reduced-motion`.
- **`@starting-style` + `transition-behavior: allow-discrete`** — entry
  transitions without keyframe boilerplate; a modern replacement for the
  `.fade-up` cascade.
- **Container queries** (`@container`, `cqi` units) — components that adapt to
  their container, not the viewport; would let cards/chips self-organize.
- **`:has()`** — parent-aware styling (e.g. section states, hover choreography
  across siblings) without JavaScript.
- **`@property`-typed custom properties** — animatable gradient angles/colors
  (the `.h-accent` gradient text could animate properly instead of
  background-position tricks).
- **`light-dark()` + `color-scheme`** — optionally collapse the triple palette
  duplication in `tokens.css`; only if the inline-script contract and no-JS
  fallback provably still hold.
- **Fluid everything** — extend `clamp()` beyond display type into a full fluid
  type + space scale.
- **`text-wrap: balance`** on headings, **`text-wrap: pretty`** on body copy.
- **Subgrid** — aligned internals across card rows.
- **CSS nesting** — authoring ergonomics in scoped styles.
- **Warm-tinted platform details** — `::selection`, `scrollbar-color`,
  `accent-color`; `clip-path`/`mask` for organic shapes on decorations.

## Acceptance criteria

- `npm run check` passes (tests + build + no-react + no-tracking + no-purple +
  bundle budgets).
- Both themes verified in a browser at 360/768/1080+ widths; no flash of wrong
  theme on load or navigation.
- `prefers-reduced-motion: reduce` yields a calm, fully readable site.
- With JavaScript disabled, all pages render correctly with system theme.
- New spec committed to `docs/superpowers/specs/`; `CLAUDE.md` design-spec
  pointer updated.
- The result still reads as "a small studio with a person in it" — if it looks
  like a generated SaaS landing page, it failed regardless of technique count.
