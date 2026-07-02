import '../styles/base.css';
import { createApp } from 'vue';
import App from '../App.vue';
import Contact from '../pages/Contact.vue';

createApp(App, { page: Contact }).mount('#app');
