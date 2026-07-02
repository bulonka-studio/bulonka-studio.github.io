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
    <span class="toggle-icon" :class="{ 'toggle-icon--dark': isDark }">
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
    </span>
  </button>
</template>

<style scoped>
/* A recessed wall-switch plate; the icon turns as the light changes. */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  color: var(--on-surface);
  background: var(--surface-variant);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12), inset 0 -1px 0 rgba(255, 255, 255, 0.18);
  transition: background var(--motion-fast) var(--motion-soft);
}
.theme-toggle:hover { background: color-mix(in srgb, var(--surface-variant) 82%, var(--primary-light) 18%); }
.toggle-icon { display: grid; place-items: center; transition: transform 300ms var(--motion-bounce); }
.toggle-icon--dark { transform: rotate(90deg); }
</style>
