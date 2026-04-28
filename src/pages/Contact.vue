<script setup>
import Button from '../components/Button.vue';

const meta = [
  { label: 'Languages', value: 'English · Українська' },
  { label: 'Time zone', value: 'GMT+2 / +3 (Ukraine)' },
  { label: 'Hours', value: 'Mon–Fri · 09:00–18:00' },
  { label: 'Reply within', value: '~1 business day' },
];

const checklist = [
  'What the app is for, and who it\'s for',
  'Where you are today (idea / wireframes / existing app to audit)',
  'Any privacy or regulatory constraints (GDPR, HIPAA, etc.)',
  'Rough timeline and budget if you have them',
];
</script>

<template>
  <section class="section page">
    <p class="t-label">Contact</p>
    <h1 class="t-display contact-heading">Let's talk about your app.</h1>
    <p class="t-body contact-lede">
      Email is the only way in — no forms, no calendars, no analytics, no third parties.
      Reply usually within one business day.
    </p>

    <div class="email-block">
      <p class="t-label">Write to</p>
      <p class="email-addr"><span aria-label="yholiakh at gmail dot com">yholiakh [at] gmail.com</span></p>
      <Button variant="primary" href="mailto:yholiakh@gmail.com">Open in mail app →</Button>
      <p class="t-small email-hint">or copy the address ↑</p>
    </div>

    <dl class="meta-grid">
      <div v-for="m in meta" :key="m.label" class="meta-item">
        <dt class="t-label">{{ m.label }}</dt>
        <dd class="t-body meta-val">{{ m.value }}</dd>
      </div>
    </dl>

    <div class="checklist">
      <h2 class="t-h2">What to include in your first email</h2>
      <ul>
        <li v-for="c in checklist" :key="c" class="t-body">{{ c }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-3); max-width: 18ch; }
.contact-lede { color: var(--on-surface-muted); max-width: 60ch; margin-bottom: var(--sp-6); }

.email-block {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-card);
  padding: var(--sp-5) var(--sp-4);
  text-align: center;
  margin-bottom: var(--sp-4);
}
.email-addr {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 1.1rem;
  background: var(--background);
  border: 1px solid var(--outline);
  border-radius: var(--radius-sm);
  padding: var(--sp-2) var(--sp-3);
  display: inline-block;
  margin: var(--sp-2) 0 var(--sp-3);
  user-select: all;
  color: var(--on-surface);
}
.email-hint { margin-top: var(--sp-2); }

.meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}
@media (min-width: 600px) {
  .meta-grid { grid-template-columns: 1fr 1fr; }
}
.meta-item {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-sm);
  padding: var(--sp-3) var(--sp-4);
}
.meta-val { margin-top: var(--sp-1); }

.checklist {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-card);
  padding: var(--sp-4);
}
.checklist h2 { margin-bottom: var(--sp-2); }
.checklist ul { padding-left: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-2); }
.checklist li::marker { color: var(--primary); }
</style>
