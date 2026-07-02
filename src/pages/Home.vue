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

    <div class="cta-row">
      <a class="cta" href="mailto:contact@bulonka-studio.com">Email contact@bulonka-studio.com</a>
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
