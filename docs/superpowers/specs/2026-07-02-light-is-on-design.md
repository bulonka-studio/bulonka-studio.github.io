# Bulonka Studio — "The Light Is On" Design Spec

- **Date:** 2026-07-02
- **Status:** Approved in brainstorming (2026-07-02), awaiting implementation
- **Owner:** Bulonka Studio
- **Repo:** `bulonka-studio.github.io`
- **Branch:** `feature/ui-redesign-next-level`
- **Live target:** https://bulonka-studio.com
- **Origin brief:** `docs/prompts/2026-07-02-ui-redesign-next-level.md`
- **Supersedes (in part):** `2026-04-29-colorful-home-design.md` — §5.3 (typography), §5.4 (component styling and decoration drawing style), §5.5 (layout primitives), §5.6 (motion table), §5.8 (fade-up cascade), and the layout portions of §6.1–§6.5.
- **Inherits unchanged:** 2026-04-29 §1–§4 (problem, audience, positioning, voice and copy rules), §5.1 (palette token names and values), §5.2 (brand mark), §5.7 (site-facts block stays dropped), §7 (performance, accessibility, SEO), §8 (technical architecture), §10–§11 (risks and non-goals) — except where a section below explicitly restates a point.

## 1. Problem and goal

The colorful-home design shipped the right identity: warm day/night palette, house metaphor, inline SVG decorations, gentle motion. Its craft ceiling is composition. Every page is the same single-column stack of full-width sections revealed by the same cascade; decorations are absolutely-positioned corner garnish that disappears below 980px; depth is one soft shadow; the type scale is timid at desktop widths.

This redesign keeps the identity and raises the craft. Three decisions, made in brainstorming, define it:

1. **The signature is light itself.** Day and night stop being palette swaps and become lighting conditions: sun through a window by day, a lamp casting a pool by night, and a theme toggle that behaves like a real switch.
2. **The house becomes the layout system.** Rooms feel like rooms — varied widths, asymmetry, decorations woven into the grid. Mobile keeps the personality.
3. **A mono workshop voice labels everything.** The monospace already used for email CTAs becomes the label voice throughout — kickers, stamps, meta keys — like labeled jars in a workshop.

Success criterion is unchanged from 2026-04-29 §1: the site reads as "a small studio with a person in it." If it reads as a generated SaaS landing page, it failed regardless of technique count.

## 2. Scope

### In scope

- Rework `src/styles/tokens.css` (additive: light-system tokens, layered shadow tokens, fluid type/space tokens; all existing token names and palette values stay).
- Rework `src/styles/base.css` (light system, type scale, motion set, view transitions, shared component styles consolidated from pages).
- Rework `src/pages/Home.vue`, `Work.vue`, `Contact.vue` layouts; redraw all inline SVG decorations in one line language.
- Restyle `Nav.vue`, `Footer.vue`, `ThemeToggle.vue`.
- **Build-time prerendering** (added 2026-07-02 during planning, user-approved). The brief's non-negotiable "pages fully render without JavaScript" was found to be untrue of the shipped site — entries mount into an empty `#app` div. Fix: a new SSR entry (`src/entries/ssr.js`) is bundled with `vite build --ssr` and a postbuild script (`scripts/prerender.mjs`) injects each page's rendered HTML into its built `dist/*.html`; client entries hydrate with `createSSRApp` when `#app` has children (dev server keeps plain `createApp`). Uses `vue/server-renderer`, which ships inside the existing `vue` dependency — zero new packages. `ThemeToggle` becomes client-only-mounted in `Nav.vue` (a 44px placeholder holds its space) because `useTheme` touches browser APIs at setup; `useTheme.js` itself stays untouched.
- Delete the orphaned `src/components/Button.vue` (nothing imports it).
- Update `CLAUDE.md` design-spec pointer to this spec and document the prerender step.

### Out of scope (all unchanged)

- Copy re-voicing. Strings may re-flow across new layouts; the words stay. The two warmth exceptions (hero greeting, today block) stay verbatim.
- Palette values, `theme-color` metas (background values are unchanged, so metas are too).
- Theme system architecture: inline pre-paint scripts in all four HTML files, `useTheme.js` and its Vitest suite, `localStorage.theme`, the `[data-theme]` + `:root:not([data-theme])` token structure.
- Architecture: multi-page Vite, no SPA router, no new dependencies, no new Vue components.
- `/privacy` (static HTML).
- JS-driven motion, IntersectionObserver, scroll-driven animations, parallax, scroll-snap — all still banned.

## 3. The light system (signature)

One physical story unifies both themes: **there is a window in this studio, and light comes through it.** Light never sits above content (all light layers are `z-index: 0` pseudo-elements behind the `.page` stacking context, `pointer-events: none`) and never reduces text contrast below AA.

### 3.1 Day — sun through the window

- `body::before` renders a **window-pane light patch**: a skewed 2×2 pane grid drawn as four soft gradient tiles (four `no-repeat` linear-gradient backgrounds with mullion gaps between them) on a sized, skewed, blurred pseudo-element, lying across the hero area like sun cast on a floor. It drifts imperceptibly (`pane-light` keyframe, ~120s, alternate). Tint: `color-mix(in srgb, var(--accent-ochre) 20%, transparent)` with a `filter: blur()` soft edge. Plain gradients and transforms — no support cliff.
- The existing two ambient glows (`--glow-1`, `--glow-2`) remain as supporting warmth at reduced opacity.

### 3.2 Night — the lamp casts a pool

- `body::before` renders one large radial pool of warm light (`--glow-1` retuned) centered near the hero lamp position (upper area of the viewport), falling off toward the page edges.
- `body::after` becomes a **dusk vignette**: page edges darken gently (radial gradient toward `rgba(6, 3, 1, 0.35)` at the corners). Darkening backgrounds only ever raises text contrast at the edges.
- The ember flicker survives, moved *into* the pool: a subtle stepped opacity variation (0.90–0.97) on the pool itself rather than a separate screen-blended overlay. `--accent-ember` and `--glow-ember` stay as its color source.

### 3.3 The switch — theme change as a lighting event

- Glow and background tokens are registered with `@property` (`syntax: '<color>'`, `inherits: true`, valid `initial-value`) so they interpolate on theme change: `--glow-1`, `--glow-2`, `--glow-ember`.
- `html` carries `transition: --glow-1 600ms var(--motion-soft), --glow-2 600ms var(--motion-soft), --glow-ember 600ms var(--motion-soft)`; `body`'s existing background/color transition is raised to 600ms for the same event. Flipping the toggle blooms the lamp pool out over ~600ms.
- Without `@property` support: instant swap (current behavior). With `prefers-reduced-motion: reduce`: instant swap (the global kill-switch already zeroes transitions).

### 3.4 Warm platform details

- `::selection` — soft ochre background, `--on-surface` text.
- `scrollbar-color` — `--primary-light` on `--surface-variant` (terracotta on cream by day, amber on walnut by night).
- `accent-color: var(--primary)`.

## 4. Typography and space

System stacks only, zero web fonts — unchanged. Three voices:

| Voice | Stack | Treatment |
|---|---|---|
| Display | system sans (existing stack) | weight 650, `clamp(2.6rem, 1.6rem + 4.2vw, 4.5rem)`, letter-spacing −0.03em, line-height 1.02, `text-wrap: balance` |
| Body | system sans | 1rem/1.6 (lede 1.08rem on `--on-surface-soft`), `text-wrap: pretty` |
| Workshop mono | `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` | 0.72–0.8rem, weight 500, letter-spacing 0.04em — kickers, the "This week" stamp, meta chip keys, CTA button, footer email |

- `.t-h1` goes fluid: `clamp(1.7rem, 1.3rem + 1.6vw, 2.4rem)`. `.t-h2` ≈ 1.25rem. `.t-label` is replaced by the mono voice (`.t-mono`).
- Written copy stays sentence case per the inherited voice rules; where a tiny mono label renders uppercase it is CSS `text-transform`, as the existing stamp and kicker already do.
- Section rhythm goes fluid: `--sp-section: clamp(3rem, 2rem + 5vw, 6rem)` replaces the fixed `--sp-7`/`--sp-8` section padding pair. The 4px-base `--sp-*` scale stays for component-level spacing.

## 5. Depth

- `--shadow-card` becomes two layers: a tight contact shadow plus a soft ambient one (e.g. `0 1px 2px rgba(60,30,10,0.08), 0 8px 28px rgba(60,30,10,0.07)` day; deeper equivalents at night).
- Cards (`today-card`, rooms, email card, meta chips) get a 1px inset top-edge highlight (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.5)` day / a faint amber equivalent at night) — the "light hits the top of objects" cue.
- `--shadow-fab` / `--shadow-fab-hover` stay (CTA glow is part of the light story).

## 6. Motion

All motion is CSS keyframes or CSS transitions; the global reduced-motion kill-switch in `base.css` stays and covers everything below. View transitions are additionally wrapped in `@media (prefers-reduced-motion: no-preference)`.

### 6.1 Cross-document view transitions

- `@view-transition { navigation: auto; }` — MPA navigation between `/`, `/work/`, `/contact/` crossfades.
- The header carries `view-transition-name: nav`: the nav and brand visibly stay planted while page content changes — walking between rooms. Default crossfade timing; no custom choreography beyond the named nav.
- Declarative CSS: works without JS. Firefox (no support yet) gets normal page loads. The inline pre-paint theme script runs before first paint on the incoming page, so no wrong-theme frame enters the transition snapshot.

### 6.2 Animation table (replaces 2026-04-29 §5.6 table)

| Name | Selector | Duration | Notes |
|---|---|---|---|
| `pane-light` | `body::before` (day) | ~120s alternate | window-pane patch drift; replaces `sunlight` |
| `lamp-pool` flicker | `body::before` (night) | 6s steps | subtle 0.90–0.97 opacity; replaces separate `flicker` overlay |
| theme bloom | `html` / `body` transition | 600ms | §3.3; not a keyframe |
| `pulse` / `glow` | `.brand-dot` | 4s / 3.4s | unchanged |
| `gradient-breathe` | `.h-accent` | 14s | unchanged (background-position breathe) — see §10 for why the `@property` angle rewrite was rejected |
| `fadeUp` | `.fade-up` | 500ms, 8px rise | retuned shorter/subtler to compose with crossfade; same stagger classes |
| underline grow | `.nav-link` | 220ms transition | background-size 0%→100% from left |
| toggle rotate | `.theme-toggle` icon wrapper | 300ms transition | 90° rotation on theme-bound class |
| `spin` | hero sun ring | 80s linear | retuned to new art |
| `bulb-flicker` / `glow-flicker` | hero lamp parts | 4.5s | retuned to new art |
| `leaf-wave` | plant leaves | 6s, staggered | retuned to new art |
| `sky-drift` | window scene panes | 18s alternate | retuned to new art |
| `flag-flip` / `letter-poke` | mailbox | 4.8s | retuned to new art |
| `envelope-tilt` | shelf envelope | 8s alternate | retuned to new art |
| `wave` / `flame` | greeting emoji | 2.4s / 1.8s | unchanged |

### 6.3 Hover choreography

`.rooms:has(.room:hover) .room:not(:hover)` dims siblings slightly (opacity ≈ 0.75, small transition) — attention behaves like light moving to the room you are in. Without `:has()`: plain per-room hover, today's behavior.

## 7. Decorations — one line language

All decorations are redrawn as a single stroke-based family: **2px strokes, rounded caps and joins, `--primary` stroke color, exactly one filled accent per piece.** Inline SVG in page templates, `aria-hidden="true"`, no new components — all unchanged policies. Line art is expected to cost fewer bytes than the current filled shapes.

| Decoration | Page | Filled accent | Notes |
|---|---|---|---|
| Window scene | Home hero | sky panes (`--accent-sky`); night adds a small amber-filled bulb | **New; merges sun + window into one drawing.** Day: ochre sun ring + rays (stroke only) inside an upper pane. Night: panes go night-blue via the token swap, a line-art lamp stands in front — stroke-outlined shade, amber-filled bulb — source of the §3.2 pool. Same three-selector day/night show/hide pattern as the current sun/lamp. |
| Potted plant | Home, today section | one ochre flower | line stems and leaves in sage strokes |
| Shelf + envelope | Work | rose "B" seal | envelope leans on a drawn shelf line with bracket supports; deliberate empty space |
| Mailbox | Contact | rose flag | line box and post; flag stays filled — it is the accent |
| Grass tufts | Footer | none | sparse sage stroke tufts above the top hairline; one small inline SVG strip in the footer template, a few hundred bytes |

The old standalone sun, lamp, and window drawings are retired in favor of the merged window scene. Room icons (house, magnifier, sound wave) already speak this language and stay.

**Mobile rule:** no decoration is `display: none` below 980px anymore. Decorations scale down (window scene to ~40%, plant and mailbox proportionally) and stay in flow. The desktop-only pattern from 2026-04-29 §5.4 is superseded.

## 8. Shell

### 8.1 Nav

- Sticky, solid `--background`, hairline bottom border (`--outline`). No backdrop blur.
- Brand dot pulse unchanged.
- Nav links: underline grows from the left on hover (`background: linear-gradient(...) no-repeat left bottom / 0% 2px`, transition `background-size`); active page keeps the full underline and `--primary` text.
- `view-transition-name: nav` on the header element.

### 8.2 Theme toggle

- Restyled as a wall-switch plate: 44×44 rounded square (`--radius-sm`), `--surface-variant` background, soft inset shadow (recessed).
- The sun/moon icon wrapper rotates 90° through the swap via a theme-bound class; CSS transition does the motion.
- Still the only `useTheme` consumer; still absent without JS; `aria-label`/`aria-pressed` behavior unchanged.

### 8.3 Footer

- Single-row layout stays; email address goes mono.
- Grass tufts (§7) sit above the top hairline — the ground the house stands on.
- Signoff line unchanged: italic "Made with care in Ukraine" with ochre em-dash prefix.

## 9. Page compositions

Copy is not re-voiced anywhere in this section; only layout changes.

### 9.1 Home — the living room

Section order unchanged: hero → today → rooms → house rules → footer.

**Hero** — asymmetric two-column at ≥720px (`1.15fr 0.85fr`): left is greeting pill, headline (display scale, `balance`), lede, CTA row; right is the window scene (§7), vertically centered. The day light patch (§3.1) angles away from the window — light physically comes from it. Below 720px the hero header becomes a flex row: greeting left, window scene right at ~40% scale, in flow (no absolute positioning, no overlap risk).

**Today / workbench** — the dashed sage card keeps its border, stamp, and hover tilt. The plant moves into the grid beside the card (a two-column grid at ≥720px), slightly overlapping the card's right edge like a plant next to a pinned note; below 720px it sits small at the card's corner. "On the workbench" label goes mono.

**Three rooms** — varied-size grid at ≥720px: `grid-template-columns: 1fr 1.4fr`, Build spans both rows on the left (tall room), Audit and Test stack on the right (wide rooms). Below 720px: single column stack. Each `.room` is a container (`container-type: inline-size`): tall/narrow rooms stack icon-over-title (current layout); wide rooms (container ≥ ~380px) switch to icon-beside-text. `@supports not (container-type: inline-size)`: viewport media query approximates the same split. Tinted gradients, icon treatments, and hover lift stay; sibling-dim choreography per §6.3.

**House rules** — deliberately quiet: the single-column florette list stays as-is. After three expressive sections the page needs one calm one.

### 9.2 Work — the shelf

The headline says the shelf is mostly empty, so the page draws the shelf. Order: page header (kicker mono) → shelf scene → NDA spec → CTA.

- **Shelf scene** — a full-width horizontal shelf line with line-art bracket supports; the envelope (§7) leans on it at the right end, keeping its tilt animation; the remaining shelf length is deliberate empty space. The existing empty-state heading and body sit above the shelf. The emptiness reads composed, not apologetic.
- **NDA spec sheet** — the `dl` definition grid stays; keys go mono.
- CTA row unchanged.

### 9.3 Contact — the mailbox

Order unchanged: page header → mailbox block → details → checklist.

- **Mailbox block** — redrawn mailbox left, email card right. The email card keeps its multi-color glow halo — now explicitly the one glowing object on the page, part of the light story. Email link stays mono terracotta with underline.
- **Details meta** — four tinted chips stay; keys go mono; the grid becomes `repeat(auto-fit, minmax(180px, 1fr))` so chips self-organize by available width.
- **Checklist** — florette list unchanged.

## 10. Modern CSS — used and rejected

Everything used degrades gracefully; `@supports` guards only where absence would break layout.

| Feature | Used for | Without support |
|---|---|---|
| `@view-transition` | room-to-room navigation, nav persistence | normal page loads (Firefox) |
| `@property` | theme bloom (§3.3) | instant swap |
| `:has()` | rooms sibling-dim | plain per-room hover |
| Container queries | room internal layout | explicit viewport-media fallback via `@supports not` |
| Fluid `clamp()` type + space | §4 | n/a (universal) |
| `text-wrap: balance` / `pretty` | headings / body | plain wrapping |
| CSS nesting | authoring in scoped styles, sparingly | n/a (build targets support it) |
| `::selection`, `scrollbar-color`, `accent-color` | §3.4 | browser defaults |

**Rejected, deliberately:**

- **`light-dark()` token collapse** — would need a duplicate fallback block for older browsers anyway, defeating the point; the explicit triple structure in `tokens.css` is what makes the no-JS contract provable; gzip flattens the repetition.
- **Subgrid** — the varied-size rooms grid makes cross-card alignment moot; the chips are single-line pairs. No place where it earns its bytes.
- **`@starting-style`** — the retuned keyframe `fadeUp` has broader support and already does the job; replacing it adds risk without visible gain.
- **`@property` `<angle>` animation for `.h-accent`** — in browsers without `@property`, animating an unregistered custom property interpolates discretely: the gradient angle would visibly jump mid-cycle. There is no clean `@supports` gate for `@property`. The existing `background-position` breathe is smooth everywhere; it stays.
- **Scroll-driven animations, scroll-snap, parallax** — banned by the brief.

## 11. CSS budget strategy

Budget: ≤ 15 kB gz CSS per page (`check:bundle-size` enforces; JS budget ≤ 50 kB gz is not under pressure).

1. **Consolidate first, add second.** `.page-kicker`, `.cta`, `.cta-side`, `.section-h`, `.dot`, `.section-sub` are duplicated across the three page components today — they move to `base.css` once. This buys back the bytes the new layout spends.
2. The light system is two pseudo-elements, gradients, and one `clip-path` — no images.
3. Line-art SVGs are expected smaller than the current filled drawings.
4. The triple token structure stays; gzip flattens it.
5. If any page lands over budget, a named CSS audit pass (duplicate declarations, unused selectors) happens **before** shipping.

## 12. Accessibility, no-JS, privacy — contracts restated

- **Reduced motion:** the global kill-switch in `base.css` covers all animations and transitions above; `@view-transition` additionally sits inside `@media (prefers-reduced-motion: no-preference)`; theme swap becomes instant.
- **No-JS:** `:root:not([data-theme])` fallback blocks stay untouched; every theme-dependent visual (window scene day/night, greeting, light layers) uses the same three-selector pattern the current greeting/sun/lamp use. View transitions are declarative and work without JS. Pages render fully **because the build prerenders them into the HTML** (§2); only the toggle disappears (it is client-only-mounted). This closes a gap in the previous specs, which claimed no-JS rendering that client-side mounting could not deliver.
- **A11y:** decorative SVGs `aria-hidden`; one `<h1>` per page; skip link; `:focus-visible` 2px `--primary-light` outline on every interactive element; ≥ 44×44 px targets; day muted `#8A6F50` on `#FAF1E0` untouched (~5:1, AA); the night vignette only darkens backgrounds, raising edge contrast.
- **Privacy:** zero new requests of any kind; zero web fonts; `localStorage` stays one key; `npm run check` green is the definition of done.

## 13. Acceptance criteria

The work is done when all of the following are true:

1. `npm run check` is green: `test:run` (useTheme suite untouched and passing), `build`, `check:no-react`, `check:no-tracking`, `check:no-purple`, `check:bundle-size`.
2. Both themes verified in a real browser at 360, 768, and 1080+ px widths on all three Vue pages plus `/privacy` (untouched but must still build and render).
3. No flash of wrong theme on load or on navigation between pages (view transitions included).
4. Theme toggle blooms (≈600ms) in supporting browsers; swaps instantly under `prefers-reduced-motion: reduce` and in browsers without `@property`.
5. `prefers-reduced-motion: reduce` yields a calm, fully readable site: no animation plays, view transitions off, content complete.
6. With JavaScript disabled: all pages render fully, theme follows system preference, window scene shows the correct day/night state, only the toggle button is missing.
7. Decorations are visible at 360px (scaled, in flow); nothing overlaps or clips text at any width.
8. Day muted text `#8A6F50` on `#FAF1E0` is unchanged; night vignette areas spot-checked ≥ AA for any text over them.
9. Hero CTA visible above the fold at 360×740 (amended 2026-07-02 during verification: the inherited 360×640 figure was never met by the shipped colorful-home design either; 360×740 is the modern-baseline viewport. Measured after the mobile-hero compression fix: CTA bottom 714px.)
10. `view-transition-name: nav` holds the header static during navigation in Chromium and Safari 18.2+; Firefox falls back to normal loads without errors.
11. Rooms grid: tall-Build/wide-Audit-Test at ≥720px, stacked below; container-query internal layouts switch correctly; `@supports` fallback verified by toggling support off in devtools.
12. Copy diff against current pages shows re-flow only — no re-voiced strings; the two warmth exceptions verbatim; em-dash budget holds; labels sentence case in written copy.
13. All decorative SVG `aria-hidden="true"`; one `<h1>` per page; skip link works; every interactive element shows a `:focus-visible` outline; tap targets ≥ 44×44 px.
14. `theme-color` metas unchanged (backgrounds unchanged) and still in lockstep with `--background`.
15. `CLAUDE.md` points at this spec as the canonical design spec and documents the prerender step.
16. Prerender: built `dist/index.html`, `dist/work/index.html`, `dist/contact/index.html` contain the full page markup inside `#app`; with JS enabled, Vue hydrates without console hydration-mismatch warnings; `dist-ssr/` (SSR bundle) is not deployed and is gitignored.
17. The gut check from the brief: the result still reads as a small studio with a person in it.

## 14. Risks and open items

1. **CSS budget pressure** — the known pressure point. Mitigated by §11; measured per page, not in aggregate.
2. **View transitions + fade-up stacking** — the incoming page's fade-up cascade plays during/after the crossfade. Mitigated by the retuned subtler fade-up (8px/500ms); if it still feels heavy in browser verification, the fallback is to keep fade-up on first-load pages only via `:root` state — decided during verification, not speculatively.
3. **Window scene complexity** — the merged day/night drawing is the largest new SVG. If it exceeds ~2 kB raw it gets simplified before shipping.
4. **`@property` transition on `html`** — transitioning registered custom properties on the root during theme change is well-supported but under-trodden; verify no paint jank on low-end devices during the bloom. Fallback: shorten to 300ms or drop to instant.
5. **Today-block content** remains a founder-edited string (inherited TBD from 2026-04-29 §10.3).
6. **Hydration mismatches** — prerendered markup must match the client's initial render exactly. `Nav.vue`'s active-link state initializes to `'/'` on both server and client (set in `onMounted`), and the toggle is client-only behind a state that is false on both, so no mismatch is expected; verified via console in acceptance §13.16. This spec amends the "architecture unchanged" inheritance from 2026-04-29 §8 in exactly one way: the build gains the SSR bundle + prerender postbuild step.

## 15. Non-goals — explicit

Everything in 2026-04-29 §11 stands. Additionally:

- No custom per-element view-transition choreography beyond the named nav (no hero-morphs between pages).
- No decoration beyond the five pieces in §7 — the light system is the star; decorations stay supporting cast.
- No nav redesign beyond §8.1 (no menu systems, no mobile hamburger — three links fit at 360px).
