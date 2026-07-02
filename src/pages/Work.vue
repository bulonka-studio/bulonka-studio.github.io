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
      <a class="cta" href="mailto:contact@bulonka-studio.com">Email contact@bulonka-studio.com</a>
      <span class="t-small cta-side">to schedule a walk-through.</span>
    </div>
  </section>
</template>

<style scoped>
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
</style>
