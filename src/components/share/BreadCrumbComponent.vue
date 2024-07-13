<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="path in paths">{{ path}}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script setup>
const props = defineProps({
  paths: Array,
})
</script>

<style scoped>

</style>