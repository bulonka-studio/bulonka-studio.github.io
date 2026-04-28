# Bulonka Studio Landing Page — Design Spec

- **Date:** 2026-04-27
- **Status:** Draft, awaiting user approval
- **Owner:** Bulonka Studio
- **Repo:** `bulonka-studio.github.io`
- **Live target:** https://bulonka-studio.com

## 1. Problem and goals

Bulonka Studio's site (`bulonka-studio.com`) currently serves a placeholder page from a Vite + React + Vue starter. There is no positioning, no content, no contact path, and no visual identity beyond an existing brand icon (`files/bulonka-studio-icon.svg`, accent `#BB86FC`).

Build the actual studio landing page. It must:

- Position Bulonka Studio as a **B2B mobile app development studio focused on user privacy**.
- Make a credible case today, when the studio is a solo founder operation, without faking team size or portfolio.
- Leave clean room to grow into a small studio with a real public portfolio without restructuring.
- Walk the privacy talk technically: no third-party requests, no analytics, no web fonts, no cookies, minimal JS.
- Replace the React+Vue hybrid with a single-framework, lighter, more honest stack (Vue 3 only).

Success criterion: a prospect from a privacy-careful sector (fintech, healthcare, NGOs, mission-driven founders) can land on `/`, understand within ten seconds what the studio does and how it differs, and reach a working contact path within one click.

## 2. Audience and positioning

- **Primary audience:** B2B clients seeking a privacy-respecting mobile app — full builds (idea → ship) and privacy-specialist engagements (audits / hardening of existing apps).
- **Secondary audience:** technical co-founders who care that the engineer they hire understands modern mobile UX, not just security theater.
- **Not the audience:** end users of consumer apps (no app downloads here), recruiters, press.
- **Tone:** Modern / Material 3 dark / app-aesthetic. The page itself looks like a mobile product. Confident, not flashy.
- **Differentiator:** "We don't ship analytics SDKs you didn't ask for" — privacy is not marketing copy, it's the project default.

### Principled exclusions (live on the page as content)

The studio will not take work in:

- Gambling
- Adult content

These exclusions are surfaced in the *Principles* section as a feature, not hidden in fine print.

## 3. Scope

### In scope (v1)

- Three pages plus existing privacy policy: `/`, `/work`, `/contact`, `/privacy`.
- Single dark theme **and** single light theme with system-preference default + manual toggle.
- Multi-page Vite build that ships real HTML at every URL.
- Vue 3 SPA components, no SPA routing (each page loads independently).
- Mailto-only contact — no forms, no calendar integrations, no third-party services.
- A11y, perf, and SEO commitments enumerated in §7.
- GitHub Pages deploy continues to work via the existing `.github/workflows/deploy.yml`.

### Out of scope (v1)

- TypeScript. Plain Vue 3 SFCs with `<script setup>`.
- i18n. Page is English only at launch. Ukrainian-speaking clients are welcomed via email (mentioned on `/contact`).
- Blog or writing section.
- Newsletter signup.
- Forms backend, calendar booking, contact form.
- Testimonials section, client-logo wall — no real material to show.
- Any outbound link to GitHub or social profiles. (Explicit user decision; reduces tracking surface to zero.)
- Light-theme animations beyond a CSS color transition.
- Theme-switch toast / confirmation UI.

## 4. Information architecture

```
/                  Home (long scroll)
  ├ Hero
  ├ Services (3 cards)
  ├ How we work / Principles
  ├ About / Founder
  └ Contact CTA → /contact

/work              Empty-state work page (honest, with NDA panel)

/contact           Mailto-only contact page

/privacy           Existing privacy policy (untouched in v1)
```

**Top nav, every page:** `Bulonka Studio` (logo, → `/`) · `Work` · `Contact`. Three items, no hamburger needed.

**Footer, every page:** `© Bulonka Studio` · `Privacy` · `Contact email` (obfuscated). No GitHub link, no social links, no third-party badges.

## 5. Page-by-page content structure

### 5.1 `/` — Home

#### Hero
- Headline (working draft, finalize during implementation): *"Privacy-first mobile apps, built end-to-end."*
- Sub-headline: *"iOS and Android. We design, ship, and audit apps that respect your users."*
- Primary CTA: pill button **"Start a project →"** linking to `/contact`.
- Secondary CTA: ghost button **"See how we work"**, smooth-scrolls to *Principles* section.
- Visual element: stylized abstract phone mockup. **No screenshots of real apps.** Pure shapes that read "mobile."

#### Services (3 cards)
| Title | One-line | 2-3 line description |
|---|---|---|
| Build | Full app development, end-to-end | iOS and Android. Discovery → design → ship → maintain. Built privacy-first from day one. |
| Privacy engineering | Hardening for existing apps | Audits, threat modeling, on-device ML, end-to-end encryption, data minimization. |
| App testing | Device, network, privacy-behavior testing | What your app actually does on a user's device — and what it sends where. |

Card icons: simple geometric SVG glyphs in `primary-container`, no icon font, no third-party icon library.

#### How we work / Principles
Numbered list of 4–6 stances. Working draft (refine during implementation):
1. No third-party SDKs without your explicit approval.
2. No analytics shipped by default. If you need them, we discuss what, where it goes, and what consent looks like.
3. Data minimization is the spec, not a stretch goal.
4. Cross-platform when it serves the user; native when it serves the privacy model.
5. We don't take gambling or adult app projects.

#### About / Founder
Single column, narrative paragraph (~80–120 words). First-person voice. Mentions:
- Years of professional mobile experience — **TBD, founder to specify** (see §10).
- Platforms shipped — **TBD, founder to specify**.
- Privacy / security background.
- Open-source presence (described, not linked).
- Languages (English, Ukrainian).
- Time zone (Ukraine, GMT+2 / +3 DST).

No headshot in v1.

#### Contact CTA band
Slim full-width band: *"Have a project in mind?"* + single FAB-style button → `/contact`. Mirrors the hero CTA so the page bookends.

### 5.2 `/work`

- Page heading: **"Selected projects."**
- Lede paragraph (~2 sentences): honest framing — young studio, most work under NDA or in progress, prefer empty over fake.
- **Empty-state card** with "First public case studies coming soon" message and brief explanation.
- **NDA panel:** "Currently shipped under NDA" — paragraph explaining that work has been delivered on iOS and Android that can't be shown on a public page, and that the founder is happy to walk through it (including code, architecture, and privacy choices) on a call. Chips show service areas only: `iOS`, `Android`, `Privacy engineering`, `App testing`. **No specific industries claimed** — wording is intentionally generic until the founder confirms which sectors they can credibly speak to (see §10).
- CTA at bottom: pill button **"Book an intro call →"** linking to `/contact`.

### 5.3 `/contact`

- Page heading: **"Let's talk about your app."**
- Lede paragraph: *"Email is the only way in — no forms, no calendars, no analytics, no third parties. Reply usually within one business day."*
- **Email block:**
  - Address shown as plain text (human-readable, scraper-resistant): `evgenijj.gljakhvskijj [at] gmail.com`. ⚠️ See §10, item 2 — privacy-positioning concern with using a Gmail address; documented but proceeding per founder decision.
  - Pill button labeled **"Open in mail app →"** with a real `mailto:` href.
  - Sub-text: "or copy the address ↑".
- **Meta grid (2×2):** Languages (`English · Українська`) · Time zone (`GMT+2 / +3 (Ukraine)`) · Hours (`Mon–Fri · 09:00–18:00`) · Reply within (`~1 business day`).
- **"What to include in your first email" checklist:**
  - What the app is for, and who it's for
  - Where you are today (idea / wireframes / existing app to audit)
  - Any privacy or regulatory constraints (GDPR, HIPAA, etc.)
  - Rough timeline and budget if you have them

## 6. Visual system

### 6.1 Color tokens

Implemented as CSS custom properties on `:root`, switched via `[data-theme="dark"]` and `[data-theme="light"]` attributes on `<html>`.

**Dark theme (default for `prefers-color-scheme: dark`):**

| Token | Value | Use |
|---|---|---|
| `--background` | `#0F0E13` | Page background |
| `--surface` | `#1A1622` | Cards |
| `--surface-variant` | `#2A2434` | Chips, dividers, inset elements |
| `--outline` | `#3D3848` | Borders |
| `--primary` | `#BB86FC` | Accents and CTAs (existing brand purple) |
| `--on-primary` | `#1B0E33` | Text on primary |
| `--primary-container` | `rgba(187, 134, 252, 0.15)` | Tinted backgrounds (e.g. service-card icons) |
| `--on-surface` | `#E7E2EE` | Body text |
| `--on-surface-muted` | `#B5AFC0` | Secondary text |

**Light theme (default for `prefers-color-scheme: light`):**

| Token | Value | Use |
|---|---|---|
| `--background` | `#FBFAFC` | Page background |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-variant` | `#F1EEF6` | Chips, dividers |
| `--outline` | `#C7C3CD` | Borders |
| `--primary` | `#6750A4` | Accents and CTAs (deeper sibling of brand purple — necessary for WCAG AA on white) |
| `--on-primary` | `#FFFFFF` | Text on primary |
| `--primary-container` | `#EADDFF` | Tinted backgrounds |
| `--on-surface` | `#1B1B1F` | Body text |
| `--on-surface-muted` | `#5C5860` | Secondary text |

**Why two primary purples:** `#BB86FC` on `#FFFFFF` is 3.0:1 contrast — fails WCAG AA for body and small UI. `#6750A4` is 7.4:1 (passes AAA) and is the same hue at lower value, so it still reads as "Bulonka purple." The brand purple `#BB86FC` is preserved unchanged in dark theme.

### 6.2 Typography

System font stack only — **zero web fonts loaded**.

- Sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- Mono: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.

| Role | Size / line-height | Weight | Tracking |
|---|---|---|---|
| Display | `2.4rem / 1.05` | 700 | `-0.02em` |
| H1 | `1.7rem / 1.15` | 600 | normal |
| H2 | `1.2rem / 1.25` | 600 | normal |
| Body | `0.95rem / 1.55` | 400 | normal |
| Small | `0.78rem / 1.5` | 400 | normal |
| Label | `0.7rem / 1.4` | 600 | `0.1em`, uppercase |

### 6.3 Spacing rhythm

4px base unit (Material standard). Scale: `4, 8, 16, 24, 32, 48, 64, 96`.
- Section vertical padding: `96` desktop, `64` mobile.
- Page max-width: `1120px`.
- Page horizontal padding: `24` mobile, `40` tablet, `64` desktop.

### 6.4 Components

- **Pill button (FAB-style primary):** background `--primary`, text `--on-primary`, padding `0.55rem 1.05rem`, border-radius `999px`, subtle box-shadow.
- **Ghost button:** transparent background, 1px `--outline` border, text `--on-surface`, same shape as primary.
- **Text button:** text `--primary` with 1px underline at 40% opacity.
- **Service card:** background `--surface`, 1px `--outline` border, border-radius `16px`, padding `1.1rem 1.2rem`, subtle elevation shadow.
- **Phone mockup:** 110×200 (hero) or scaled, rounded `22px`, 1px `--outline` border, dark gradient interior, subtle "speaker bar" detail. Pure CSS shapes, no image asset.
- **Theme toggle:** sun/moon icon button in nav, `aria-pressed` reflects current theme.
- **Border-radius scale:** `8` (chips), `12` (small cards), `16` (cards), `999` (pills).

### 6.5 Motion

- All non-essential motion limited to ~150ms ease-out hover/focus transitions on cards and buttons.
- `prefers-reduced-motion: reduce` sets all transition durations to `0s`.
- No scroll-jacking, no parallax, no auto-playing animations, no entrance animations.

### 6.6 Theme switch behavior

- **Default:** the page reads `prefers-color-scheme` and applies `data-theme="dark"` or `data-theme="light"` accordingly.
- **Manual toggle:** sun/moon button in the top nav. On click, sets `data-theme` to the opposite value and persists the choice in `localStorage` under key `theme` (values `"light"` | `"dark"`).
- **Hydration:** a small inline script in `<head>` runs before paint to read `localStorage.theme` and apply it to `<html>`, preventing a flash of wrong theme. Inline script is the only inline JS on the page.
- **No-JS fallback:** the toggle button is hidden if JS is disabled. The page still respects system preference via CSS `@media (prefers-color-scheme)`.
- **Privacy posture:** `localStorage` is first-party only, never sent to any server, never used for tracking. The single key is `theme`.

## 7. Performance, accessibility, SEO commitments

These are hard targets, not aspirations. The implementation plan must include verification.

### Performance / privacy budget (per page)

- Total JS shipped: **< 50 kB gzipped**.
- Total CSS shipped: **< 15 kB gzipped**.
- Zero web fonts loaded.
- Zero third-party requests at runtime (no Google Fonts, no analytics, no tag managers, no CDN-hosted scripts, no image CDNs).
- Zero cookies set by the site.
- `localStorage` use limited to one key: `theme`.
- All assets self-hosted from `bulonka-studio.com`.
- Lighthouse targets (mobile, throttled): Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95.

### Accessibility

- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for UI components, in both themes (already verified in token choice).
- Tap targets ≥ 44×44px on mobile.
- `prefers-reduced-motion: reduce` honored.
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, single `<h1>` per page, headings in document order.
- Skip-to-content link as the first focusable element.
- `:focus-visible` styles on every interactive element.
- Theme toggle: `<button>` with `aria-pressed` and a descriptive `aria-label` (e.g. "Switch to light theme").
- Email address rendered as text (selectable, screen-reader-friendly), not just a `mailto:` href.

### SEO

- Per-page `<title>` and `<meta name="description">`, set in HTML at build time (not via JS).
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) on each page.
- `og:image` uses `files/bulonka-studio-preview.png` (move into `public/` during implementation).
- `robots.txt` allowing all, pointing to `sitemap.xml`.
- `sitemap.xml` listing `/`, `/work`, `/contact`, `/privacy` with `lastmod`.
- JSON-LD `Organization` schema block on `/` with name, URL, description, contactPoint email.

## 8. Technical architecture

### 8.1 Stack consolidation

**Removed:**
- `react`, `react-dom` from `dependencies`
- `@vitejs/plugin-react` from `devDependencies`
- `src/ReactApp.jsx`, current `src/main.jsx`
- `<div id="react-root">` and `<div id="vue-root">` mounts in `index.html`
- React-include filter in `vite.config.js`

**Kept:**
- Vite 6, Vue 3, `@vitejs/plugin-vue`
- `GITHUB_PAGES_BASE` env-var pattern in `vite.config.js`
- `.github/workflows/deploy.yml` (no changes needed)
- `public/CNAME` (`bulonka-studio.com`)
- `public/privacy/index.html` (existing privacy policy)

**Final `package.json` dependency set:**
```json
{
  "dependencies": { "vue": "^3.5.13" },
  "devDependencies": { "@vitejs/plugin-vue": "^5.2.1", "vite": "^6.0.7" }
}
```

### 8.2 File layout (target)

```
index.html                       Home page entry (Vite multi-page input)
work/index.html                  /work entry
contact/index.html               /contact entry
src/
  entries/
    home.js                      Entry script for index.html — mounts App with Home.vue
    work.js                      Entry script for work/index.html — mounts App with Work.vue
    contact.js                   Entry script for contact/index.html — mounts App with Contact.vue
  App.vue                        Top-level shell: <Nav/> <Page/> <Footer/>
  styles/
    tokens.css                   :root + [data-theme] CSS custom properties
    base.css                     reset, body, type scale, focus-visible, skip-link
  composables/
    useTheme.js                  Reads system pref + localStorage; exposes current theme + toggle
  components/
    Nav.vue
    Footer.vue
    Button.vue                   primary / ghost / text variants via prop
    ServiceCard.vue
    PhoneMockup.vue              Pure-CSS abstract phone
    ThemeToggle.vue
  pages/
    Home.vue                     Hero + Services + Principles + About + ContactCta
    Work.vue                     Empty state + NDA panel + CTA
    Contact.vue                  Email block + meta + checklist
public/
  CNAME                          (untouched)
  favicon.svg                    Derived from files/bulonka-studio-icon.svg
  privacy/index.html             (untouched)
  bulonka-studio-preview.png     Moved from files/ for OG image
  robots.txt
  sitemap.xml
files/                           Source brand assets (kept out of dist/, unchanged)
docs/superpowers/specs/          This spec lives here
```

### 8.3 Routing — multi-page Vite (no router)

- `vite.config.js` is configured with `build.rollupOptions.input` listing the three HTML entries: `index.html`, `work/index.html`, `contact/index.html`.
- Each HTML entry imports its own tiny entry script (e.g. `src/entries/home.js`, `src/entries/work.js`, `src/entries/contact.js`). Each entry script does the same three things: import `App.vue`, import its page component (`pages/Home.vue` etc.), and `createApp(App, { page: PageComponent }).mount('#app')`. `App.vue` renders `<Nav/>`, the passed page, then `<Footer/>`.
- Pretty URLs `/work` and `/contact` work because GitHub Pages serves `dist/work/index.html` for requests to `/work/` automatically. Vite's multi-page build emits each entry into its own subdirectory.
- No SPA router runtime, no client-side routing, no 404-redirect dance.
- Nav highlighting of the current page is handled by reading `window.location.pathname` once when `Nav.vue` mounts.

### 8.4 Build and deploy

- `npm run build` produces `dist/` with three index.html files, hashed JS/CSS chunks, and copied `public/` assets.
- `.github/workflows/deploy.yml` is untouched. It runs `npm ci && npm run build` and uploads `dist/` to GitHub Pages.
- `GITHUB_PAGES_BASE=/` continues to be set in CI (apex domain via CNAME).

## 9. Acceptance criteria

The work is done when **all** of the following are true:

1. `npm install && npm run build` succeeds with no warnings on a fresh clone.
2. `npm run preview` serves `dist/`. Direct visits to `/`, `/work`, `/contact`, `/privacy` all render the correct page (no 404s, no flashes, no JS errors).
3. The page renders correctly with JavaScript disabled — content is visible, theme follows system preference, only the theme toggle and (if any) intra-page smooth-scroll are missing.
4. Lighthouse mobile run on the production-equivalent build returns Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO ≥ 95.
5. On the deployed production site (`bulonka-studio.com`), DevTools Network on a fresh load of any page shows **zero** requests to any host other than `bulonka-studio.com`. (For local dev/preview the host is `localhost` — same rule applies, just substitute the host.)
6. The site sets zero cookies. `localStorage` contains at most one key, `theme`.
7. axe-core accessibility scan returns zero violations on each page in both themes.
8. Color contrast on body text and UI controls passes WCAG AA in both themes (verified per the §6.1 token choices).
9. The `mailto:` button on `/contact` opens the user's default mail client with the To: address pre-filled.
10. Bundle size per page: total JS < 50 kB gzipped, total CSS < 15 kB gzipped.
11. The page deploys to `bulonka-studio.com` via the existing GitHub Actions workflow with no workflow changes.
12. No React, no `react-dom`, no `@vitejs/plugin-react` references remain anywhere in the repo.

## 10. Open items (TBD before implementation)

These are factual gaps. The implementation plan must either resolve them with the founder or carry them as documented placeholders that block the corresponding section.

1. **Founder bio specifics** (blocks §5.1 *About / Founder* copy): exact years of professional mobile experience, list of platforms shipped (iOS native / Android native / Flutter / React Native / KMP / etc.), and a short description of the privacy/security background to mention. Suggested resolution: founder writes one paragraph; implementation slots it in verbatim.
2. **Contact email choice — flag for reconsideration** (§5.3): the spec uses the founder's existing personal Gmail (`evgenijj.gljakhvskijj@gmail.com`) per the founder's choice. This is at slight odds with the privacy positioning (Google reads all incoming mail) and changing the address later means changing the publicly displayed string. Worth confirming before launch — switching to a custom-domain inbox (`hello@bulonka-studio.com`, served by a privacy-respecting provider like Proton or Fastmail) would resolve this. No code change needed for this spec; it is a content decision.
3. **Final copy for headline, sub-headline, principles list, founder paragraph, and the lede paragraphs on `/work` and `/contact`.** The spec provides working drafts that are good enough to ship if untouched, but the founder should review them before implementation hits "done."

## 11. Non-goals — explicit

To prevent scope creep during implementation:

- This spec does **not** define a CMS or admin UI. Content is plain Vue templates — edit a `.vue` file, commit, deploy.
- This spec does **not** define how case studies will be authored when the studio has portfolio material to publish. That is a future spec.
- This spec does **not** redesign the existing `/privacy` page. It remains as-is.
- This spec does **not** address email deliverability, inbox setup, or anti-spam for the contact email. The site simply links to whatever address the founder operates.
