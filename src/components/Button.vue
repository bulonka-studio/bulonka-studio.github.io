<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <a v-if="href" :href="href" class="btn">
    <slot />
  </a>
  <button v-else :type="type" class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  min-height: 44px;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-card);
  background: var(--primary);
  color: var(--on-primary);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-fab);
  transition: transform 220ms var(--motion-bounce), box-shadow var(--motion-fast) var(--motion-soft);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-fab-hover);
  text-decoration: none;
}
</style>
