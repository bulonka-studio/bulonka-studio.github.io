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
