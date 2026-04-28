<script setup>
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const path = ref('/');

onMounted(() => {
  path.value = window.location.pathname;
});

function isActive(prefix) {
  if (prefix === '/work') return path.value.startsWith('/work');
  if (prefix === '/contact') return path.value.startsWith('/contact');
  return false;
}
</script>

<template>
  <header class="nav-bar">
    <div class="page nav-inner">
      <a href="/" class="brand" aria-label="Bulonka Studio — home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name">Bulonka Studio</span>
      </a>
      <nav aria-label="Primary">
        <a href="/work/" :class="['nav-link', { 'nav-link--active': isActive('/work') }]">Work</a>
        <a href="/contact/" :class="['nav-link', { 'nav-link--active': isActive('/contact') }]">Contact</a>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-bar {
  border-bottom: 1px solid var(--outline);
  background: var(--background);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--on-surface);
}
.brand-mark {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--primary) 70%, white), var(--primary) 60%, color-mix(in srgb, var(--primary) 60%, black));
}
nav { display: inline-flex; align-items: center; gap: var(--sp-3); }
.nav-link {
  font-size: 0.85rem;
  color: var(--on-surface-muted);
  padding: 0.4rem 0.2rem;
  border-bottom: 1px solid transparent;
  transition: color var(--motion-fast) var(--motion-ease), border-bottom-color var(--motion-fast) var(--motion-ease);
}
.nav-link:hover { color: var(--on-surface); }
.nav-link--active { color: var(--primary); border-bottom-color: var(--primary); }
</style>
