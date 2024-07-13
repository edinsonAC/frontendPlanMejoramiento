<template>
  <a-row v-if="loading" class="loader" justify="center">
    <a-spin size="large" :indicator="indicator">
    </a-spin>
  </a-row>
</template>
<script setup>
import {ref, h} from "vue";
import {LoadingOutlined} from '@ant-design/icons-vue';

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '100px',
  },
  spin: true,
});

const props = defineProps({
  loading: Boolean
})
</script>
<style scoped>

.loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: white;
}

.ant-spin-text {
  margin-top: 5% !important;
  font-size: 20px;
}
</style>