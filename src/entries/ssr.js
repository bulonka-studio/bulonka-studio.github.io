import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from '../App.vue';
import Home from '../pages/Home.vue';
import Work from '../pages/Work.vue';
import Contact from '../pages/Contact.vue';

const pages = { home: Home, work: Work, contact: Contact };

export function render(name) {
  return renderToString(createSSRApp(App, { page: pages[name] }));
}
