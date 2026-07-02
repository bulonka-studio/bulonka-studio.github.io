<script setup>
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const path = ref('/');
const mounted = ref(false);

onMounted(() => {
  path.value = window.location.pathname;
  mounted.value = true;
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
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="brand-name">Bulonka Studio</span>
      </a>
      <nav aria-label="Primary">
        <a href="/work/" :class="['nav-link', { 'nav-link--active': isActive('/work') }]">Work</a>
        <a href="/contact/" :class="['nav-link', { 'nav-link--active': isActive('/contact') }]">Contact</a>
        <ThemeToggle v-if="mounted" />
        <span v-else class="toggle-slot" aria-hidden="true"></span>
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
  border-bottom: 1px solid var(--outline);
  view-transition-name: nav; /* stays planted while pages crossfade */
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--sp-2);
  padding-bottom: var(--sp-2);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.005em;
  color: var(--on-surface);
  min-height: 44px;
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
  padding: 0.7rem 0.4rem;
  background: linear-gradient(var(--primary-light), var(--primary-light)) no-repeat left calc(100% - 6px) / 0% 2px;
  transition: color var(--motion-fast) var(--motion-soft), background-size var(--motion-fast) var(--motion-soft);
}
.nav-link:hover { color: var(--on-surface); background-size: 100% 2px; }
.nav-link--active { color: var(--primary); font-weight: 600; background-size: 100% 2px; }
.toggle-slot { display: inline-block; width: 44px; height: 44px; }
</style>
