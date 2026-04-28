<script setup>
defineProps({
  variant: { type: String, default: 'primary', validator: v => ['primary', 'ghost', 'text'].includes(v) },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <a v-if="href" :href="href" class="btn" :class="`btn--${variant}`">
    <slot />
  </a>
  <button v-else :type="type" class="btn" :class="`btn--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
  min-height: 44px;
  padding: 0.7rem 1.1rem;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background var(--motion-fast) var(--motion-ease),
              color var(--motion-fast) var(--motion-ease),
              transform var(--motion-fast) var(--motion-ease),
              box-shadow var(--motion-fast) var(--motion-ease);
  white-space: nowrap;
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn--primary {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: var(--shadow-fab);
}
.btn--ghost {
  background: transparent;
  color: var(--on-surface);
  border: 1px solid var(--outline);
}
.btn--ghost:hover { background: var(--surface-variant); }

.btn--text {
  background: transparent;
  color: var(--primary);
  padding: 0.4rem 0.2rem;
  min-height: 0;
  border-radius: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
}
.btn--text:hover { transform: none; border-bottom-color: var(--primary); }
</style>
