<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="shadow"
          :items="items"
          @click="logout">

  </a-menu>
</template>
<script setup>
import {computed, h, ref} from 'vue';
import {LogoutOutlined} from '@ant-design/icons-vue';
import logo from '../../assets/images/logo_ufps.png'; // Importa la imagen
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";

const store = storeApp()

const isAdmin = computed(() => {
  return store.isAdmin
})

const logout = (values) => {
  if (values.key == 'logout') {
    store.setLoader(true)
    if (isAdmin.value) {
      store.logout()
      router.push('/login-admin')
    } else {
      store.logout()
      router.push('/login')
    }
  }
}

const current = ref(['mail']);
const items = ref([
  /*  {
      key: 'logo',
      icon: () => h('img', {src: logo, width: 150}),
    },*/
  {
    key: 'logout',
    icon: () => h(LogoutOutlined),
    label: 'Cerrar sesión',
    title: 'Cerrar sesión',
  },
]);
</script>
<style>
.row-header {
  width: 100%;
  background-color: #ffff;
  flex-flow: inherit;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.col-logo {
  display: flex;
  margin-left: 1%;
}

.shadow {
  display: flex;
  justify-content: end;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  align-items: center;
}

.shadow > li {
  display: flex !important;
  align-items: center !important;
}
</style>