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
