<script setup>
import {ref, computed} from 'vue'
import {useRouter, useRoute, RouterLink, RouterView} from 'vue-router'

// Import Ant Design Vue styles by less entry
import esES from 'ant-design-vue/es/locale/es_ES';
import {storeApp} from "./stores/store.js";

const logged = computed(() => {
  const store = storeApp()
  return store.isAuth
})

const ruta = computed(() => {
  const route = useRoute()
  return route
})

</script>

<template>
  <a-config-provider :locale="esES">
    <a-layout class="layout">
      <!--      <loader :loading="load" :option="loaderOption"></loader>-->
      <a-layout-header v-if="logged && ruta != undefined && !['login'].includes(ruta.path)">
        <!--        <Header></Header>-->
      </a-layout-header>
      <a-layout-content :class="!['login', 'login-admin', 'forgot'].includes(ruta.path) ? 'margin-auto' : ''">
        <!--        <NavBarNotification v-if="logged"></NavBarNotification>-->
        <div class="style-router-view">
          <RouterView/>
        </div>
      </a-layout-content>
      <a-layout-footer v-if="logged && ruta.path != 'login'" style="text-align: center; color: #FFFFFF">
        <!-- todo  Cambiar nombre plataforma  -->
        Copyright © {{ new Date().getFullYear() }}
        <a href="/" target="_blank">Te Auditamos</a>. Todos los derechos reservados.
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
