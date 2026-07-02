# Bulonka Studio — Colorful-Home Design Spec

- **Date:** 2026-04-29
- **Status:** Draft, awaiting user approval
- **Owner:** Bulonka Studio
- **Repo:** `bulonka-studio.github.io`
- **Branch:** `feature/landing-page-warm-home` (parallel to `feature/landing-page`)
- **Live target:** https://bulonka-studio.com (if this direction is the one merged)
- **Visual source of truth:** `prototypes/colorful-home/index.html`, `night.html`, `work.html`, `contact.html`. The prototype HTML is canonical for visual treatment, motion, decoration, and copy. This spec turns that prototype into something implementable against the existing Vue 3 + Vite stack.
- **Supersedes (in part):** §5 (page content), §6.1 (color tokens), §6.4 (Service card / Phone mockup), and copy fragments in §5.1–§5.3 of `2026-04-27-landing-page-design.md`. Architecture (§7 SEO, §7 a11y, §8 build, §9 acceptance criteria, §11 non-goals) of that prior spec stands unchanged unless restated here.
- **Parallel to:** `2026-04-28-de-slopping-design.md`. Both specs target the same problem (the original purple-Material design reads as AI-generated). They are alternative directions; only one ships to production.

## 1. Problem and goal

The original landing page reads as AI-generated (purple-Material default, three-card grid, phone mockup, arrow CTAs). The de-slopping spec answered that with austere, single-accent, motionless restraint. This spec answers it differently: with **warmth, multiple colors, and gentle motion** — a "feels-like-home" register that is also unlikely to be the median LLM default.

Success criterion: a prospect who lands on `/` reads the site as "a small studio with a person in it" rather than either "a generated SaaS landing page" or "a serious privacy practice." It still has to credibly carry the privacy positioning.

## 2. Audience and positioning

Unchanged from the prior specs:
- **Primary audience:** B2B clients seeking a privacy-respecting mobile app.
- **Tone differentiator:** quiet warmth, not slick polish; lived-in, not corporate.
- **Voice:** institutional third-person ("Bulonka Studio is a small practice"), with two narrow exceptions where the warmth carries the copy:
  - The hero greeting pill ("Hi — come in").
  - The today/workbench block (uses a soft "we / I" only if the founder writes it; otherwise stays third-person).

## 3. Scope

### In scope
- Replace color tokens with the five-color warm palette (day) plus a parallel night palette.
- Add `[data-theme="dark"]` palette as a "warm hearth at night" variant — same tokens, evening-mode values.
- Replace base typography rules: drop uppercase labels, lighten display weight, add a small set of universal keyframes (fadeUp, sunlight drift) and a `prefers-reduced-motion` kill-switch.
- Re-tint the brand SVG (same path as the de-slopping spec).
- Delete `PhoneMockup.vue` and `ServiceCard.vue`.
- Restyle `Button.vue` to a single bouncy variant with a multi-color glow shadow.
- Restyle `Nav.vue` (pulsing brand dot, day↔night toggle reuses existing `ThemeToggle.vue`).
- Restyle `Footer.vue` (signoff line, real mailto link).
- Rewrite `Home.vue`, `Work.vue`, `Contact.vue` with the new content, structure, and inline SVG decorations from the prototype.
- Add `check:no-purple` verification script (mirrors the de-slopping spec).
- Update per-page HTML meta (titles, descriptions, theme-color values).
- Update `CLAUDE.md` to point at this spec.

### Out of scope
- Architecture changes. Multi-page Vite, no SPA router, three HTML inputs — unchanged.
- The theme system itself. `useTheme.js`, the inline pre-paint script, `localStorage.theme` — unchanged.
- New web fonts. Zero web fonts loaded (system stack only) — unchanged.
- Privacy budget. Per-page ≤ 50 kB JS gz, ≤ 15 kB CSS gz, zero third-party requests, zero cookies — unchanged.
- New dependencies. No icon library, no animation library, no SVG-import plugin. All decoration is inline SVG in page templates.
- New Vue components. Decorations live inline in page templates; the JSX would just be SVG markup, no logic.
- Changes to `/privacy` (still a hand-maintained `public/privacy/index.html`).
- Mobile gestures, scroll-driven animations, scroll-snap. Motion is CSS keyframes only.
- A11y, SEO, deploy workflow — unchanged from prior spec unless restated.

## 4. Voice and copy guidelines

Inherits §4 of the 2026-04-28 de-slopping spec, with one relaxation:

**Relaxed:** The hero greeting line and the day↔night toggle copy may use a friendly first-or-second-person register ("Hi — come in", "The lamp is on — come in"). These are deliberate warmth signals, scoped to two short strings on Home.

**All other rules unchanged from the de-slopping spec:**
- No rhythmic tricolons (literal product lists fine).
- No "X — not Y" reversals.
- No arrow CTAs.
- Em-dash budget: at most one per ~150 words of body copy on a page; no two em-dashes in the same paragraph.
- No empty intensifiers (seamless, elegant, robust, etc.).
- CTAs are concrete email-as-link, not generic verbs.
- Section labels are sentence case.

A reviewer should be able to mechanically check this list against new copy, with the two-string exception above noted.

## 5. Visual system

### 5.1 Palette — warm five-color, day + night

**CSS custom property names are unchanged from the existing `src/styles/tokens.css`** for the core eight tokens (`--background`, `--surface`, `--surface-variant`, `--outline`, `--primary`, `--on-primary`, `--on-surface`, `--on-surface-muted`). Five additional accent tokens are introduced (`--accent-ochre`, `--accent-sage`, `--accent-sky`, `--accent-rose`, plus `--surface-deep` for the deeper paper tone). Token names like `--c-terra` from the prototype are renamed to align with the existing system; the prototype is the visual truth, not the variable-name truth.

**Day theme (`[data-theme="light"]` and the matching `prefers-color-scheme: light` fallback):**

| Token | Value | Use |
|---|---|---|
| `--background` | `#FAF1E0` | Warm cream paper |
| `--surface` | `#FFFAF0` | Cards / today block |
| `--surface-variant` | `#F4E8CE` | Deeper paper / window pane bg |
| `--surface-deep` | `#F4E8CE` | Same as variant; alias for clarity in templates |
| `--outline` | `rgba(138, 111, 80, 0.18)` | Borders, hairlines |
| `--primary` | `#8B4A2E` | Deep terracotta — accent for headings, CTAs, links |
| `--primary-light` | `#C97B5C` | Lighter terracotta — used for shadows, decorations, day-mode brand-dot |
| `--on-primary` | `#FFFFFF` | Text on primary |
| `--on-surface` | `#3E2C1A` | Body text (warm cocoa) |
| `--on-surface-soft` | `#5C4A33` | Slightly softened body — used in lede |
| `--on-surface-muted` | `#8A6F50` | Secondary text (warm grey-brown) |
| `--accent-ochre` | `#D4A04A` | Warm yellow-orange — sun, plant flower, ochre principle marker |
| `--accent-sage` | `#7A9978` | Garden green — plant leaves, today stamp, sage marker |
| `--accent-sky` | `#87B5D6` | Soft window blue — Test room, sky panes |
| `--accent-rose` | `#D4847A` | Dusty rose — accent in gradient text, principle marker, mailbox flag |

**Night theme (`[data-theme="dark"]` and matching `prefers-color-scheme: dark` fallback) — "warm hearth at night":**

| Token | Value | Use |
|---|---|---|
| `--background` | `#1A130D` | Deep walnut |
| `--surface` | `#251A11` | Card-warm |
| `--surface-variant` | `#100A06` | Mullion/deepest paper |
| `--surface-deep` | `#100A06` | Alias |
| `--outline` | `rgba(232, 168, 124, 0.16)` | Borders |
| `--primary` | `#E8A87C` | Lamp amber |
| `--primary-light` | `#B36A3F` | Deeper amber for shadows / lamp shade |
| `--on-primary` | `#2A1810` | Dark text on amber |
| `--on-surface` | `#F0E4CF` | Lamp-light cream |
| `--on-surface-soft` | `#C9B697` | Softened body text |
| `--on-surface-muted` | `#8E7A5E` | Secondary |
| `--accent-ochre` | `#E8A87C` | Same as primary in night — single warm accent |
| `--accent-sage` | `#6E8C68` | Night garden moss |
| `--accent-sky` | `#5C7C9C` | Window-at-night blue |
| `--accent-rose` | `#D6816F` | Warm rose (mailbox flag, principle marker) |
| `--accent-ember` | `#D26646` | Glowing ember — used for night-only flicker overlay |

The night theme's `--accent-ember` has no day equivalent; it's used only by the night-mode flicker overlay (§5.6). Day templates reference no ember tokens.

### 5.2 Brand mark

Same as the de-slopping spec §5.2. Re-tint `files/bulonka-studio-icon.svg` to use `currentColor` for the paw fill; render `public/favicon.svg` with a fixed `#C97B5C` paw on `#15120E` warm-dark background. Purple is fully retired from this repo. Enforced by `scripts/check-no-purple.mjs` (added in implementation Task 1).

The `Nav.vue` brand-mark gradient swatch is replaced by a small solid terracotta dot with a pulsing halo — see §5.5.

### 5.3 Typography

System fonts only — unchanged. Type scale stays from the prior spec, with two adjustments:

- `.t-label` drops `text-transform: uppercase` and the wide tracking. Sentence case, mid-grey.
- `.t-display` font-weight 600 (was 700). Letter-spacing -0.025em (slightly tighter).

Typography scale otherwise unchanged.

### 5.4 Components

**Delete:**
- `src/components/PhoneMockup.vue`
- `src/components/ServiceCard.vue`

**Restyle:**
- `Button.vue` — single visible variant: mono font (0.95rem), 14px corner radius (slightly softer than the de-slopping 4px), terracotta background, white text, multi-state shadow (4px terracotta-glow at rest → 10px elevated on hover). Uses `cubic-bezier(0.34, 1.56, 0.64, 1)` for the bouncy lift. The `variant` prop is kept for backward compat but ignored.
- `Nav.vue` — brand mark becomes a solid `--primary-light` dot with a pulsing halo (4s loop). Theme toggle moves to a `☾` / `☀` Unicode glyph link styled with `--primary-light`. Existing `ThemeToggle.vue` JS logic is reused; only its rendered glyph changes.
- `Footer.vue` — sentence-case row with sage middle-dot separators, real mailto link, italicized signoff line "Made with care in Ukraine" prefixed by an ochre em-dash.

**Decorations — inline SVG, not new components:**

The prototype introduces six SVG decorations. Each lives inline in the page template that uses it. None has logic. None is reused. Vue components would add abstraction over no real code:

| Decoration | Page | Position | Animation |
|---|---|---|---|
| Sun | Home (day) | Hero, top-right corner | 80s linear spin |
| Lamp | Home (night) | Hero, top-right corner | bulb + glow halo flicker (4.5s irregular) |
| Potted plant | Home | Today section, right side ≥980px | 6s leaf wave (4 leaves on offsets) |
| Framed window | Home | Rooms section, right side ≥980px | 18s sky-pane drift |
| Envelope | Work | Empty-state, alongside heading | 8s tilt-and-rise |
| Mailbox | Contact | Mailbox block, alongside email card | 4.8s flag flip + letter poke |

Show/hide between day/night for the hero corner: render *both* the sun SVG and the lamp SVG in the page, with CSS attribute selectors `[data-theme="dark"] .hero-sun { display: none; }` and `[data-theme="light"] .hero-lamp { display: none; }`. Total HTML weight added: ~1.2 kB raw, ~0.5 kB gz.

### 5.5 Layout primitives

**Hero**
- Greeting pill (rounded, soft accent-tinted background): "Hi — come in" (day) / "The lamp is on — come in" (night).
- Headline display-weight 600, max 24ch, with two visual treatments:
  - A `.h-mark` span on one word ("respects") wraps in a `::after` pseudo-element rendering a sage rectangle behind the text, opacity 0.30, slightly skewed.
  - A `.accent` span on the closing phrase ("care, not analytics") gradients across `--primary` → `--accent-ochre` → `--accent-rose` and breathes (background-position animation, 14s).
- Lede paragraph: max 56ch, on `--on-surface-soft`, font-size 1.08rem.
- Single CTA: monospaced terracotta button containing the literal email address, with bouncy hover and warm shadow-glow.
- "replies usually inside a business day" sub-line in `--muted` to the right of the CTA, wraps to next line on mobile.

**Today (workbench) block**
- One-card section between hero and services. Dashed sage border, `--surface` background, soft shadow.
- Top-right tag: a sage `--accent-sage` rotated stamp pill saying "This week".
- Two-line content: a small `--muted` label "On the workbench", then a sentence describing what's currently being worked on. One word in that sentence gets a soft ochre highlighter (`background: linear-gradient(transparent 60%, rgba(212,160,74,0.32) 60%)`) — visual flourish, no semantic meaning.
- Hover: lifts 2px and rotates -0.25deg.

**Three rooms (services)**
- Section heading: "Three rooms in this studio" with a small ochre dot before it.
- Sub-line: "Each one is something the studio has shipped before — paid, on a real project, end to end."
- Three rooms in a `1fr / 1fr 1fr 1fr` grid. Each room has:
  - 26px corner radius
  - A diagonal-gradient background tinted by service: terracotta for Build, sage for Audit, sky for Test
  - A 44×44 colored square icon container in the same accent, white SVG inline glyph (line-drawn house, magnifier, sound-wave)
  - Title at 1.12rem 700-weight
  - Body at 0.94rem `--on-surface-soft`
- Hover: room lifts 5px; icon rotates -6deg and scales 1.04. Bouncy easing.
- Window decoration sits in the section header at the top-right on desktop only.

**House rules (principles)**
- Section heading: "House rules" with a sage dot before it.
- Sub-line: "Defaults the studio holds, written down so a new client can disagree before signing."
- Numbered list rendered with `list-style: none`; each `<li>` gets a flower-glyph pseudo-element `✿` whose color cycles: ochre, sage, terracotta, sky, rose. Hairline rule between rows.
- Five principles (verbatim from the de-slopping spec; copy unchanged).

### 5.6 Motion

All motion is CSS keyframes. The full set of animations:

| Name | Selector | Duration | Loop | Notes |
|---|---|---|---|---|
| `sunlight` | `body::before` (day) | 90s | infinite alternate | Two radial gradients, drift translate + slight rotate |
| `lamp-drift` | `body::before` (night) | 90s | infinite alternate | Same shape as sunlight, amber + night-blue glows |
| `flicker` | `body::after` (night) | 6s | infinite | Stepped opacity, ember-color, screen-blended |
| `pulse` | `.brand-dot` (day) | 4s | infinite | Halo expands/fades |
| `glow` | `.brand-dot` (night) | 3.4s | infinite | Same shape with warm-amber halo |
| `gradient-breathe` | `.accent` (text) | 14s | infinite | Background-position 0→100→0 |
| `fadeUp` | `.fade-up` | 700ms | once on mount | Section reveal |
| `spin` | `.hero-sun` | 80s | infinite linear | Day only |
| `bulb-flicker` / `glow-flicker` | `.hero-lamp` parts | 4.5s | infinite | Night only |
| `leaf-wave` | `.plant .leaf` | 6s | infinite | 4 leaves on -1.5s offsets |
| `sky-drift` | `.window-deco .sky` | 18s | infinite alternate | Slight translate |
| `flag-flip` | `.mailbox .flag` | 4.8s | infinite | Rotate 0→-90→0 |
| `letter-poke` | `.mailbox .letters` | 4.8s | infinite | Rise then settle, in sync with flag |
| `envelope-tilt` | `.envelope` | 8s | infinite alternate | Rotate + small Y translate |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` zeroes `animation-duration` and `transition-duration` for all elements globally, plus explicitly stops `body::before` and `body::after`. No motion plays for users who prefer none.

### 5.7 Site facts block — dropped

The de-slopping spec includes an inline "site facts" block (0 third-party requests · 0 cookies · etc.). The colorful-home direction does not include this block — the today-on-workbench block does the personal-warmth work instead, and the privacy invariants stay verifiable via `npm run check`. The privacy claim is carried by the *behavior* of the page (zero requests, zero cookies) rather than by an explicit on-page stat.

### 5.8 Section reveals on page load

Every section above the fold (hero, today, services, principles, footer) gets a `.fade-up` class with a `.delay-N` modifier, so they reveal in a staggered cascade on page mount:

- Hero: no delay (fade-up starts immediately)
- Today: 80ms delay
- Rooms: 240ms delay
- Principles: 400ms delay
- Footer: 560ms delay

Each fade-up is `opacity 0 → 1, translateY(12px) → 0`, 700ms `cubic-bezier(0.22, 0.61, 0.36, 1)`. Disabled by `prefers-reduced-motion`.

## 6. Page-by-page content

### 6.1 `/` — Home (day)

Verbatim from `prototypes/colorful-home/index.html`. Order of sections:

1. **Header** — brand (with pulsing dot), `Work`, `Contact`, theme toggle (☾).
2. **Hero**
   - Greeting pill: *"Hi — come in"* (preceded by 👋 emoji — see §10 risk note).
   - Headline: *"A small mobile studio that respects the people who use what it ships — built with care, not analytics."* (`respects` carries `.h-mark`; `care, not analytics` carries `.accent`.)
   - Lede: *"iOS and Android apps, end-to-end. Privacy audits for existing apps. On-device behavior testing. Currently a one-person studio, working from a quiet desk in Ukraine."*
   - CTA: `yholiakh@gmail.com` mailto button + side-text *"replies usually inside a business day."*
   - Sun SVG in top-right corner, day only.
3. **Today block** — sage-stamp "This week", label "On the workbench", text:
   *"Auditing what a health-tracking iOS app actually <em>sends home</em> — third-party SDKs, telemetry, and the gap between privacy policy and on-device behavior."* (Single em-dash. Single highlighted phrase.)
   - **Note:** the text is a working-default placeholder. The studio may want to update this string per actual current work; treat it as content that the founder edits as their work changes. See §10.3.
4. **Three rooms** — Build (terracotta), Audit (sage), Test (sky). Copy verbatim from the de-slopping spec services block.
5. **House rules** — five principles, verbatim from the de-slopping spec.
6. **Footer** — single row: `© 2026 Bulonka Studio · Privacy · yholiakh@gmail.com`. Italic signoff "Made with care in Ukraine" centered.

### 6.2 `/` — Home (night)

Same content as day, with three differences:

- Greeting pill: *"The lamp is on — come in"* (preceded by 🕯 emoji — see §10).
- Sun SVG hidden via CSS; lamp SVG visible.
- Body has the additional flickering ember overlay (`body::after`).

All other content identical. Theme switches via existing `ThemeToggle.vue` and `useTheme.js`.

### 6.3 `/work`

Verbatim from `prototypes/colorful-home/work.html`:

1. Page header with kicker "Selected projects", heading *"The shelf is mostly empty — on purpose."* (one em-dash, allowed within the per-paragraph limit), and lede explaining the empty state.
2. Empty-state with envelope SVG (tilting on 8s) + text: *"First public case studies are coming. When something can be shown publicly, it lands here. Until then, the shelf stays honest."*
3. NDA spec sheet — three colored cards: Platforms (terracotta tint), Surfaces (sage tint), What can be shown (sky tint, full width).
4. CTA: mailto button + *"to schedule a walk-through."* sub-text.

### 6.4 `/contact`

Verbatim from `prototypes/colorful-home/contact.html`:

1. Page header with kicker "Contact", heading *"Leave a note in the mailbox."*, lede.
2. Mailbox block — SVG mailbox on left (with flag-flip + letter-poke animation), email card on right with multi-color glow halo behind it. Email shown as monospaced terracotta link with underline.
3. Details meta — four colored chips: Languages (ochre), Time zone (sage), Hours (sky), Reply within (rose).
4. Checklist heading: *"What to include in your first email"*. Four items with rotating florette markers.

### 6.5 Nav and footer

**Nav:** brand-dot (pulsing terracotta), `Work`, `Contact`, theme toggle (☾ in day, ☀ in night). Active page underlined in `--primary-light` with a small terracotta-deep text color.

**Footer:** `© 2026 Bulonka Studio · Privacy · yholiakh@gmail.com` row, italicized signoff "Made with care in Ukraine" with an ochre em-dash prefix.

## 7. Performance, accessibility, SEO

Inherits §7 of the 2026-04-27 spec. Restated here so an implementer cannot regress:

### Performance budget (per page)
- Total JS shipped: < 50 kB gzipped.
- Total CSS shipped: < 15 kB gzipped. **Risk:** the colorful-home direction has substantially more CSS than the de-slopping direction (≥ 12 keyframes, more decoration declarations, multi-color palette). Implementer must verify each page is under 15 kB gz; if any page is over, the implementation plan calls for a CSS audit pass.
- Zero web fonts loaded.
- Zero third-party requests at runtime.
- Zero cookies.
- `localStorage` use limited to one key: `theme`.
- Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95.

### Accessibility
- Color contrast ≥ 4.5:1 for body text in both themes. **Risk:** the day theme uses a low-contrast cream background (`#FAF1E0`) with cocoa text (`#3E2C1A`) — verify ~14:1, fine. Muted text (`#8A6F50` on `#FAF1E0`) is ~5:1, passes AA. Night theme `--on-surface` (`#F0E4CF`) on `--background` (`#1A130D`) is ~12:1, passes AAA.
- Tap targets ≥ 44×44px on mobile.
- `prefers-reduced-motion` honored — all animation killed via the global selector in §5.6.
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, single `<h1>` per page.
- `:focus-visible` on every interactive element with a 2px outline in `--primary-light`.
- Email rendered as text + mailto link.
- All decorative SVG marked `aria-hidden="true"`.
- All animations are decorative; nothing depends on motion to convey meaning.

### SEO
Same as the prior spec. Per-page `<title>`, meta description, OG tags, JSON-LD on Home, robots.txt, sitemap.xml. theme-color values updated to match the new palette (`#FAF1E0` for light, `#1A130D` for dark).

## 8. Technical architecture

Inherits §8 of the prior spec. Multi-page Vite, no SPA router, three HTML inputs, one Vue page per entry. No new files in `src/` beyond what already exists. No new dependencies.

The `useTheme.js` composable, the inline pre-paint script in each HTML, and the `localStorage.theme` key all stay unchanged. Token *names* in `src/styles/tokens.css` stay (with five new accent additions); only values change.

`scripts/check-no-purple.mjs` is added (mirrors §5.2 of the de-slopping spec).

## 9. Acceptance criteria

The work is done when **all** of the following are true:

1. `npm install && npm run build` succeeds with no warnings on a fresh clone.
2. `npm run preview` serves `dist/`. Direct visits to `/`, `/work`, `/contact`, `/privacy` all render correctly in both themes.
3. The page renders correctly with JavaScript disabled — content is visible, theme follows system preference, animations still play (CSS-only, no JS gate), only the theme toggle is missing.
4. Lighthouse mobile run on a production-equivalent build returns Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95.
5. Network tab on a fresh load shows zero requests to any host other than the site's own origin.
6. The site sets zero cookies. `localStorage` contains at most one key, `theme`.
7. axe-core scan returns zero violations on each page in both themes.
8. WCAG AA contrast on body text and UI controls in both themes. Implementer reports actual ratios for the pairs in §5.1.
9. mailto buttons on `/`, `/work`, `/contact` all open the user's default mail client.
10. Bundle size per page: total JS < 50 kB gz, total CSS < 15 kB gz.
11. **`npm run check` is green.** Specifically: `test:run`, `build`, `check:no-react`, `check:no-tracking`, `check:no-purple`, `check:bundle-size` all pass.
12. Zero references to `BB86FC`, `6750A4`, `D4A8FF`, the word "purple", or `react`/`react-dom` anywhere in `src/`, `public/`, the per-page HTMLs, or `vite.config.js`. (`check:no-purple` enforces.)
13. Em-dash discipline — no two em-dashes in the same paragraph of body copy. Manual review.
14. `files/bulonka-studio-icon.svg` uses `currentColor`; `public/favicon.svg` uses `#C97B5C` paw on `#15120E` background; `public/bulonka-studio-preview.png` is regenerated with the new accent (or carry-forward TBD per §10).
15. `PhoneMockup.vue` and `ServiceCard.vue` are deleted, not commented out, and no template imports them.
16. Token names in `src/styles/tokens.css` are unchanged for the eight existing tokens; the five new accent tokens (`--surface-deep`, `--accent-ochre`, `--accent-sage`, `--accent-sky`, `--accent-rose`, plus `--accent-ember` for night) are added. The night theme adds `--accent-ember`; day theme leaves it unset.
17. `prefers-reduced-motion: reduce` zeros all animation and transition durations. Tested by toggling system motion preference.
18. Both `[data-theme="dark"]` and `[data-theme="light"]` render the appropriate hero corner SVG (lamp vs sun) — controlled by CSS `display:none` on the inactive one.
19. Day↔night theme transition does not cause layout shift. Verified by visually toggling at multiple viewport widths.
20. Visual sanity at 320, 720, 1280 px in both themes:
    - Hero CTA visible above the fold.
    - Decorations (plant, window) hidden below 980 px and don't break layout.
    - Service rooms stack on mobile, three-column at 720 px.

## 10. Risks and open items

1. **CSS bundle budget pressure.** The colorful-home direction has substantially more CSS than the de-slopping direction. Implementer must verify each page stays under 15 kB gz. If over, the plan includes a CSS audit pass (consolidating duplicated declarations, removing unused selectors). Mitigation also: shared `.spec`/`.principles`/`.fade-up` styles move into `base.css` rather than being duplicated per page (as they were in the de-slopping plan).
2. **Voice drift in implementation.** "Hi — come in" and "The lamp is on — come in" are scoped exceptions to institutional voice. Implementer must not extend warmth to other strings (no "let's chat", no "we'd love to hear from you"). Reviewer applies §4 mechanically.
3. **Today-block content as a moving target.** §6.1 lists a working default for the today block. The founder may want this updated to reflect actual current work. Document as a TBD; ship the placeholder and let the founder edit on a regular cadence (manually, no CMS).
4. **Emojis in hero greeting.** Two emojis appear in shipped copy: 👋 (day) and 🕯 (night). The original spec's emoji policy was inherited from a previous Claude Code instruction ("only use emojis if requested"). The user explicitly approved these in the prototype. Implementer renders them verbatim. If a future review wants them gone, they can be replaced with inline SVG hand / candle icons without other changes.
5. **OG preview image.** Same blocker as the de-slopping spec §10. Carries forward as option C (deferred).
6. **Founder bio specifics.** Same TBD as prior specs. Implementer either resolves with the founder or carries placeholder. Note that the colorful-home prototype omits a dedicated About section; the today block does the personal-warmth work. The founder may want a small About line added — defer to founder review.
7. **Brand purple in email signatures, GitHub avatar, off-site assets.** Out of scope for this repo; founder should be aware purple is retired in this brand system.

## 11. Non-goals — explicit

To prevent scope creep:

- This spec does **not** add a portfolio CMS, case-study authoring system, or any content tooling.
- This spec does **not** redesign `/privacy`. The standalone `public/privacy/index.html` stays as-is.
- This spec does **not** change the deploy workflow, `GITHUB_PAGES_BASE` pattern, or `CNAME`.
- This spec does **not** introduce a typeface, icon library, image CDN, or any third-party request.
- This spec does **not** add JavaScript-driven motion. All animation is CSS keyframes.
- This spec does **not** add a CMS for the today-on-workbench block. Updates to that string are manual edits to `src/pages/Home.vue`.
- This spec does **not** add scroll-driven animations, intersection-observer reveals, parallax, or scroll-snap. Section reveals fire once on mount and that's all.
- This spec does **not** define case-study authoring. That's a future spec.
