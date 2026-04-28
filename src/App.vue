<script setup>
defineProps({ page: { type: Object, required: true } });
</script>

<template>
  <component :is="page" />
</template>
