import '../styles/base.css';
import { createApp } from 'vue';
import App from '../App.vue';
import Work from '../pages/Work.vue';

createApp(App, { page: Work }).mount('#app');
