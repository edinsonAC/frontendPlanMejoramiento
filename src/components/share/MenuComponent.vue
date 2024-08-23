<template>
  <a-menu v-model:selectedKeys="selectedKeys" mode="inline" theme="light" :items="isAdmin ? itemsAdmin: items"
          @select="changePage"
          style="height: 100%">
  </a-menu>
</template>
<script setup>
import {
  SlidersOutlined,
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

const selectedKeys = ref(['1'])
const isAdmin = computed(() => {
  const store = storeApp()
  return store.isAdmin
})

const imgUser = computed(() => {
  const store = storeApp()
  return store.user.usuaFoto || '';
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
            label: 'Plan de Desarrollo Institucional',
            key: '/plan-desarrrollo',
            icon: () => h(SlidersOutlined),
          },
          {
            label: 'Acuerdo',
            key: '/acuerdo',
            icon: () => h(BlockOutlined),
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
    children: [
      {
        label: 'Planes de Mejoramiento',
        key: '/plan-mejoramiento',
        icon: () => h(DesktopOutlined),
      },
    ],
  },
  {
    key: '3',
    icon: () => h(TeamOutlined),
    label: 'PROYECTOS',
    title: 'PROYECTOS',
  },
]);
const items = ref([
  /*  ...(
        imgUser.value
            ? [{
              key: '/',
              icon: () => h(AAvatar, {src: imgUser.value, size: 'large'}), // Usa la variable imgUser
            }]
            : []
    ),*/
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'PLAN DE MEJORAMIENTO',
    title: 'PLAN DE MEJORAMIENTO',
    children: [
      {
        label: 'Planes de Mejoramiento',
        key: '/plan-mejoramiento',
        icon: () => h(DesktopOutlined),
      },
    ],
  },
  {
    key: '3',
    icon: () => h(TeamOutlined),
    label: 'PROYECTOS',
    title: 'PROYECTOS',
  },
]);


const changePage = (e) => {
  router.push(e.key)
}

</script>
<style scoped>

</style>