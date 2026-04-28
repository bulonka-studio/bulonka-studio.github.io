<script setup>
defineProps({
  title: { type: String, required: true },
  glyph: { type: String, default: '●' },
});
</script>

<template>
  <article class="card">
    <div class="card-icon" aria-hidden="true">{{ glyph }}</div>
    <h3 class="t-h2">{{ title }}</h3>
    <p class="t-body card-body"><slot /></p>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--outline);
  border-radius: var(--radius-card);
  padding: var(--sp-4);
  box-shadow: var(--shadow-card);
  transition: transform var(--motion-fast) var(--motion-ease), border-color var(--motion-fast) var(--motion-ease);
}
.card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--primary) 40%, var(--outline)); }
.card-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--primary-container);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: var(--sp-3);
}
.card h3 { margin-bottom: var(--sp-2); }
.card-body { color: var(--on-surface-muted); }
</style>
