<template>
  <a-progress :percent="percentaje" />
</template>
<script setup>
const props = defineProps({
  percentaje: Number,
})
</script>
<style scoped>

</style>