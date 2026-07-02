<script setup>
import { computed } from 'vue';
import { useTheme } from '../composables/useTheme.js';

const { theme, toggle } = useTheme();

const isDark = computed(() => theme.value === 'dark');
const label = computed(() => isDark.value ? 'Switch to light theme' : 'Switch to dark theme');
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :aria-pressed="!isDark"
    @click="toggle"
  >
    <svg v-if="isDark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <!-- sun -->
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2"  x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2"  y1="12" x2="5"  y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.2"  y1="4.2"  x2="6.3"  y2="6.3" />
        <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
        <line x1="4.2"  y1="19.8" x2="6.3"  y2="17.7" />
        <line x1="17.7" y1="6.3"  x2="19.8" y2="4.2" />
      </g>
    </svg>
    <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <!-- moon -->
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  color: var(--on-surface);
  transition: background var(--motion-fast) var(--motion-ease);
}
.theme-toggle:hover { background: var(--surface-variant); }
</style>
