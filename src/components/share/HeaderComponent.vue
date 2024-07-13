<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" style="justify-content: end" :items="items" @click="logout"/>
</template>
<script setup>
import {computed, h, ref} from 'vue';
import {LogoutOutlined} from '@ant-design/icons-vue';
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";

const store = storeApp()

const isAdmin = computed(() => {
  return store.isAdmin
})

const logout = () => {
  store.logout()
  router.push(isAdmin ? '/login-admin' : '/login')
}

const current = ref(['mail']);
const items = ref([
  {
    key: 'logout',
    icon: () => h(LogoutOutlined),
    label: 'Cerra sesión',
    title: 'Cerra sesión',
  },
]);
</script>
<style scoped>

</style>