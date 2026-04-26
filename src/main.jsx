import { createRoot } from 'react-dom/client';
import { createApp } from 'vue';
import ReactApp from './ReactApp.jsx';
import VueApp from './VueApp.vue';

const reactRoot = document.getElementById('react-root');
if (reactRoot) {
  createRoot(reactRoot).render(<ReactApp />);
}

const vueRoot = document.getElementById('vue-root');
if (vueRoot) {
  createApp(VueApp).mount(vueRoot);
}
