<template>
  <div class="phone" role="img" aria-label="Stylized mobile phone illustration">
    <div class="phone-card"><span class="bar"></span><span class="bar bar--short"></span></div>
    <div class="phone-card"><span class="bar"></span><span class="bar bar--short"></span></div>
    <div class="phone-card"><span class="bar"></span><span class="bar bar--short"></span></div>
  </div>
</template>

<style scoped>
.phone {
  width: 180px;
  height: 340px;
  border-radius: 28px;
  background: linear-gradient(155deg, var(--surface), color-mix(in srgb, var(--background) 90%, black));
  border: 1px solid var(--outline);
  padding: 24px 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  position: relative;
  margin: 0 auto;
}
.phone::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 5px;
  background: var(--surface-variant);
  border-radius: 4px;
}
.phone-card {
  background: var(--primary-container);
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-top: 10px;
}
.phone-card:first-of-type { margin-top: 18px; }
.bar {
  display: block;
  height: 8px;
  background: color-mix(in srgb, var(--primary) 40%, transparent);
  border-radius: 4px;
  margin-bottom: 6px;
  width: 70%;
}
.bar--short { width: 40%; background: color-mix(in srgb, var(--on-surface) 30%, transparent); margin-bottom: 0; }
</style>
