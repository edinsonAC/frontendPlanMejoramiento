<template>
  <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="light" :items="isAdmin ? itemsAdmin: items"
          @select="changePage"
          style="height: 100%">
  </a-menu>
</template>
<script setup>
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  PieChartOutlined,
  BookOutlined,
  ProjectOutlined,
  GatewayOutlined,
  PartitionOutlined,
  BlockOutlined,
  FileProtectOutlined,
  DesktopOutlined,
  TeamOutlined
} from '@ant-design/icons-vue';
import {computed, h, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";

const selectedKeys = ref([])
const isAdmin = computed(() => {
  const store = storeApp()
  return store.isAdmin
})


const itemsAdmin = ref([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'INFORMACIÓN PREDETERMINADA',
    title: 'INFORMACIÓN PREDETERMINADA',
    children: [
      {
        type: 'group',
        children: [
          {
            label: 'Programa Académico',
            key: '/programa-academico',
            icon: () => h(BookOutlined),
          },
          {
            label: 'Factores',
            key: '/factor',
            icon: () => h(GatewayOutlined),
          },
          {
            label: 'Ejes Estratégicos',
            key: '/eje-estrategico',
            icon: () => h(GatewayOutlined),
          },
          {
            label: 'Líneas Estratégicas',
            key: '/linea-estrategica',
            icon: () => h(PartitionOutlined),
          },
          {
            label: 'Programas Inversión',
            key: '/programa-inversion',
            icon: () => h(ProjectOutlined),
          },
          {
            label: 'Procesos',
            key: '/proceso',
            icon: () => h(BlockOutlined),
          },
          {
            label: 'Tipo Situación',
            key: '/tipo-situacion',
            icon: () => h(FileProtectOutlined),
          },
        ],
      },
    ],
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'PLAN DE MEJORAMIENTO',
    title: 'PLAN DE MEJORAMIENTO',
  },
  {
    key: '3',
    icon: () => h(TeamOutlined),
    label: 'PROYECTOS',
    title: 'PROYECTOS',
  },
]);
const items = ref([
  {
    key: 'mail',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    title: 'Navigation One',
  },
  {
    key: 'app',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Two',
    title: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: () => h(SettingOutlined),
    label: 'Navigation Three - Submenu',
    title: 'Navigation Three - Submenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
]);


const changePage = (e) => {
  console.log("??? ", e.key)
  router.push(e.key)
}

</script>
<style scoped>

</style>