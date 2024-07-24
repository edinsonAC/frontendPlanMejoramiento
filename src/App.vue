<template>
  <a-config-provider :locale="esES"
                     :theme="{
      token: {
        colorPrimary: '#dd4b39',
      },
    }"
  >
    <a-layout style="min-height: 100vh">
      <LoadingComponent :loading="loader"></LoadingComponent>
      <a-layout-sider v-if="logged && ruta != undefined && !['/login'].includes(ruta.path)"
                      v-model:collapsed="collapsed" collapsible>
        <div class="logo"/>
        <MenuComponent></MenuComponent>
      </a-layout-sider>
      <a-layout class="layout">
        <a-layout-header
            v-if="logged && ruta != undefined && !['/login'].includes(ruta.path)">
          <HeaderComponent></HeaderComponent>
        </a-layout-header>
        <a-layout-content style=" height: 100%"
                          :class="!['/login', '/login-admin', '/forgot'].includes(ruta.path) ? 'margin-auto' : ''">
          <div class="style-router-view">
            <RouterView/>
          </div>
        </a-layout-content>
        <a-layout-footer v-if="logged && ruta.path != '/login'" style="text-align: center;">
          Copyright © {{ new Date().getFullYear() }}
          <a href="/" target="_blank">UFPS</a>. Todos los derechos reservados.
        </a-layout-footer>
      </a-layout>

    </a-layout>
  </a-config-provider>
</template>
<script setup>
import {ref, computed} from 'vue'
import {useRouter, useRoute, RouterLink, RouterView} from 'vue-router'

// Import Ant Design Vue styles by less entry
import esES from 'ant-design-vue/es/locale/es_ES';
import {storeApp} from "./stores/store.js";
import LoadingComponent from "./components/share/LoadingComponent.vue";
import HeaderComponent from "./components/share/HeaderComponent.vue";
import MenuComponent from "./components/share/MenuComponent.vue";

const collapsed = ref(false);

const logged = computed(() => {
  const store = storeApp()
  return store.isAuth
})
const loader = computed(() => {
  const store = storeApp()
  return store.loader
})

const ruta = computed(() => {
  const route = useRoute()
  return route
})

</script>
<style>
.ant-layout-header {
  height: auto !important;
}

.ant-layout-header > ul {
  line-height: 46px !important;
}


.layout {
  min-height: 100%;
}

.style-router-view > div {
  width: 100%;
  padding: 24px;
  min-height: 600px;
  height: 100%;
  /*  position: fixed;*/
}


.style-router-view > div {
  padding: 24px;
  min-height: 600px;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

</style>
