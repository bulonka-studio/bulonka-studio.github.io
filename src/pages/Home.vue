<script setup>
import Button from '../components/Button.vue';
import ServiceCard from '../components/ServiceCard.vue';
import PhoneMockup from '../components/PhoneMockup.vue';

const services = [
  {
    title: 'Build',
    glyph: '▲',
    body: 'iOS and Android, end-to-end. Discovery → design → ship → maintain. Built privacy-first from day one.',
  },
  {
    title: 'Privacy engineering',
    glyph: '●',
    body: 'Audits, threat modeling, on-device ML, end-to-end encryption, and data minimization for existing apps.',
  },
  {
    title: 'App testing',
    glyph: '◆',
    body: "What your app actually does on a user's device — and what it sends where. Device, network, and privacy-behavior testing.",
  },
];

const principles = [
  'No third-party SDKs without your explicit approval.',
  'No analytics shipped by default. If you need them, we discuss what, where it goes, and what consent looks like.',
  'Data minimization is the spec, not a stretch goal.',
  'Cross-platform when it serves the user; native when it serves the privacy model.',
  "We don't take gambling or adult app projects.",
];
</script>

<template>
  <!-- Hero -->
  <section class="section page hero">
    <div class="hero-text">
      <p class="t-label">Mobile development &amp; privacy engineering</p>
      <h1 class="t-display hero-headline">Privacy-first mobile apps, built end-to-end.</h1>
      <p class="t-body hero-sub">iOS and Android. We design, ship, and audit apps that respect your users.</p>
      <div class="hero-ctas">
        <Button variant="primary" href="/contact/">Start a project →</Button>
        <Button variant="ghost" href="#principles">See how we work</Button>
      </div>
    </div>
    <div class="hero-visual">
      <PhoneMockup />
    </div>
  </section>

  <!-- Services -->
  <section class="section page" id="services">
    <p class="t-label">Services</p>
    <h2 class="t-h1 section-heading">Three ways we work with clients.</h2>
    <div class="services-grid">
      <ServiceCard v-for="s in services" :key="s.title" :title="s.title" :glyph="s.glyph">
        {{ s.body }}
      </ServiceCard>
    </div>
  </section>

  <!-- Principles -->
  <section class="section page" id="principles">
    <p class="t-label">How we work</p>
    <h2 class="t-h1 section-heading">Privacy is the default, not the upsell.</h2>
    <ol class="principles">
      <li v-for="(p, i) in principles" :key="i" class="t-body">{{ p }}</li>
    </ol>
  </section>

  <!-- About -->
  <section class="section page" id="about">
    <p class="t-label">About</p>
    <h2 class="t-h1 section-heading">A small studio, on purpose.</h2>
    <p class="t-body about-body">
      Bulonka Studio is a privacy-focused mobile development practice based in Ukraine
      (GMT+2 / +3). I've shipped iOS and Android apps for clients who care about what
      happens to their users' data — and I founded the studio so that this could be the
      default, not the exception. I work in English and Ukrainian, contribute to open
      source in the privacy and mobile space, and prefer projects where data minimization
      is part of the spec rather than an afterthought.
      <!-- TBD: founder to refine — see spec §10 item 1 -->
    </p>
  </section>

  <!-- Contact CTA -->
  <section class="section page contact-band">
    <h2 class="t-h1 contact-band-text">Have a project in mind?</h2>
    <Button variant="primary" href="/contact/">Start a project →</Button>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-7);
  align-items: center;
}
@media (min-width: 880px) {
  .hero { grid-template-columns: 1.4fr 1fr; gap: var(--sp-8); }
}
.hero-text { display: flex; flex-direction: column; gap: var(--sp-3); }
.hero-headline { max-width: 18ch; }
.hero-sub { color: var(--on-surface-muted); max-width: 36ch; }
.hero-ctas { display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-top: var(--sp-3); }
.hero-visual { display: flex; justify-content: center; }

.section-heading { margin-top: var(--sp-2); margin-bottom: var(--sp-5); max-width: 22ch; }

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 720px) {
  .services-grid { grid-template-columns: repeat(3, 1fr); }
}

.principles {
  list-style: decimal;
  padding-left: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  max-width: 60ch;
}
.principles li::marker { color: var(--primary); font-weight: 700; }

.about-body { max-width: 60ch; color: var(--on-surface-muted); }

.contact-band {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-3);
  padding-top: var(--sp-7);
  padding-bottom: var(--sp-7);
  border-top: 1px solid var(--outline);
  border-bottom: 1px solid var(--outline);
  background: var(--surface);
}
.contact-band-text { max-width: none; }
@media (min-width: 720px) {
  .contact-band { flex-direction: row; justify-content: space-between; align-items: center; }
}
</style>
