<script setup>
import Button from '../components/Button.vue';

const chips = ['iOS', 'Android', 'Privacy engineering', 'App testing'];
</script>

<template>
  <section class="section page">
    <p class="t-label">Work</p>
    <h1 class="t-display work-heading">Selected projects.</h1>
    <p class="t-body work-lede">
      An honest empty state — we're a young studio. Most work is still under NDA or in
      progress, and we'd rather show nothing than fake it.
    </p>

    <div class="empty">
      <div class="empty-icon" aria-hidden="true">◇</div>
      <h2 class="t-h2">First public case studies coming soon</h2>
      <p class="t-body empty-body">
        We're working with our first clients on what we can share publicly. When we can,
        you'll find the case studies here.
      </p>
    </div>

    <article class="nda">
      <h2 class="t-h2">Currently shipped under NDA</h2>
      <p class="t-body nda-body">
        We've delivered work on iOS and Android that we can't show on a public page. Happy
        to walk through it on a call — including code, architecture, and the privacy
        choices behind it.
      </p>
      <ul class="chips" aria-label="Service areas">
        <li v-for="c in chips" :key="c" class="chip">{{ c }}</li>
      </ul>
    </article>

    <div class="cta-row">
      <Button variant="primary" href="/contact/">Book an intro call →</Button>
    </div>
  </section>
</template>

<style scoped>
.work-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 14ch; }
.work-lede { color: var(--on-surface-muted); max-width: 60ch; margin-bottom: var(--sp-6); }

.empty {
  background: var(--surface);
  border: 1px dashed var(--outline);
  border-radius: var(--radius-card);
  padding: var(--sp-6) var(--sp-4);
  text-align: center;
  margin-bottom: var(--sp-3);
}
.empty-icon { font-size: 1.6rem; color: var(--primary); opacity: 0.7; margin-bottom: var(--sp-2); }
.empty h2 { margin-bottom: var(--sp-2); }
.empty-body { color: var(--on-surface-muted); max-width: 50ch; margin: 0 auto; }

.nda {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-card);
  padding: var(--sp-4);
  box-shadow: var(--shadow-card);
}
.nda h2 { margin-bottom: var(--sp-2); }
.nda-body { color: var(--on-surface-muted); margin-bottom: var(--sp-3); max-width: 60ch; }
.chips { display: flex; flex-wrap: wrap; gap: var(--sp-2); list-style: none; }
.chip {
  background: var(--surface-variant);
  color: var(--on-surface-muted);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
}

.cta-row { margin-top: var(--sp-6); }
</style>
