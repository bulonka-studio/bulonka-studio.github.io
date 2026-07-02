import '../styles/base.css';
import { createApp, createSSRApp } from 'vue';
import App from '../App.vue';
import Work from '../pages/Work.vue';

// Prod HTML is prerendered (scripts/prerender.mjs) — hydrate it.
// Dev server has an empty #app — plain mount, no hydration warnings.
const el = document.getElementById('app');
(el.hasChildNodes() ? createSSRApp : createApp)(App, { page: Work }).mount('#app');
