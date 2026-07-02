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
  <!-- Hero: the window is the room's light source in both themes -->
  <section class="section page hero fade-up">
    <div class="hero-top">
      <span class="greeting greeting--day">
        <span class="wave" aria-hidden="true">👋</span>
        Hi — come in
      </span>
      <span class="greeting greeting--night">
        <span class="flame" aria-hidden="true">🕯</span>
        The lamp is on — come in
      </span>
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
    </div>
    <div class="hero-text">
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
/* Hero — mobile: greeting and window share the top row; desktop: two columns
   via display:contents so hero-top's children become grid items */
.hero {
  padding-top: var(--sp-4);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-2);
}
.hero-top { display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); }
.window-scene { width: 84px; height: auto; flex: none; }
@media (min-width: 720px) {
  .hero { grid-template-columns: 1.15fr 0.85fr; grid-template-rows: auto 1fr; column-gap: var(--sp-6); padding-top: var(--sp-6); }
  .hero-top { display: contents; }
  .greeting { grid-column: 1; grid-row: 1; justify-self: start; }
  .hero-text { grid-column: 1; grid-row: 2; }
  .window-scene { grid-column: 2; grid-row: 1 / 3; align-self: center; justify-self: end; width: min(100%, 300px); }
}
.hero-headline { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 24ch; }
.hero-lede { color: var(--on-surface-soft); max-width: 56ch; font-size: 1rem; margin-bottom: var(--sp-4); }
@media (min-width: 720px) {
  .hero-headline { margin-top: var(--sp-3); margin-bottom: var(--sp-4); }
  .hero-lede { font-size: 1.08rem; margin-bottom: var(--sp-5); }
}

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
  margin-bottom: 0;
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
  left: -2px; right: -2px; bottom: 0.1em;
  height: 0.16em;
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
.today-stamp {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
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

.plant { width: 64px; height: 90px; justify-self: end; margin-top: calc(-1 * var(--sp-4)); }
@media (min-width: 720px) {
  .plant { width: 92px; height: 130px; margin: 0 0 0 calc(-1 * var(--sp-4)); }
}
.plant .leaf { transform-box: fill-box; transform-origin: 50% 100%; animation: leaf-wave 6s ease-in-out infinite; }
.plant .leaf:nth-of-type(2) { animation-delay: -1.5s; }
.plant .leaf:nth-of-type(3) { animation-delay: -3s; }
.plant .leaf:nth-of-type(4) { animation-delay: -4.5s; }
@keyframes leaf-wave { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }

.rooms-section { position: relative; }

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
</style>
