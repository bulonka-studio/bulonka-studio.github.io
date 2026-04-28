import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE ?? '/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        work: resolve(import.meta.dirname, 'work/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
      },
    },
  },
});
