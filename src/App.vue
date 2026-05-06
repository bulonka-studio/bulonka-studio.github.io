<script setup>
import Nav from './components/Nav.vue';
import Footer from './components/Footer.vue';

defineProps({ page: { type: Object, required: true } });
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <Nav />
  <main id="main">
    <component :is="page" />
  </main>
  <Footer />
</template>
