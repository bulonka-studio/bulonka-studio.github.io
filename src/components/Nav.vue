<script setup>
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const path = ref('/');

onMounted(() => { path.value = window.location.pathname; });

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
        <span class="brand-dot" aria-hidden="true"></span>
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
  background: var(--background);
  position: sticky;
  top: 0;
  z-index: 10;
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
  font-size: 1.05rem;
  letter-spacing: -0.005em;
  color: var(--on-surface);
}
.brand-dot {
  width: 14px;
  height: 14px;
  background: var(--primary-light);
  border-radius: 50%;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-light) 22%, transparent);
  animation: pulse 4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px  color-mix(in srgb, var(--primary-light) 22%, transparent); }
  50%      { box-shadow: 0 0 0 10px color-mix(in srgb, var(--primary-light) 6%, transparent); }
}
nav { display: inline-flex; align-items: center; gap: var(--sp-3); }
.nav-link {
  font-size: 0.95rem;
  color: var(--on-surface-soft);
  padding: 0.4rem 0.4rem;
  border-bottom: 2px solid transparent;
  transition: color var(--motion-fast) var(--motion-soft), border-bottom-color var(--motion-fast) var(--motion-soft);
}
.nav-link:hover { color: var(--on-surface); }
.nav-link--active { color: var(--primary); border-bottom-color: var(--primary-light); font-weight: 600; }
</style>
