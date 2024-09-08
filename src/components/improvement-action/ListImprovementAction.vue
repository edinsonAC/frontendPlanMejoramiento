<template>
  <div v-if="data">
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-descriptions title="" bordered style="margin-bottom: 1%">
            <a-descriptions-item label="Factor" :span="5">{{ item.factor.factNombre }}</a-descriptions-item>
            <a-descriptions-item label="Programa Inversión" :span="5">{{
                item.programaInversion.prinNombre
              }}
            </a-descriptions-item>
            <a-descriptions-item label="Situación Intervenir">{{ item.tipoSituacion.tisiNombre }}</a-descriptions-item>
            <a-descriptions-item label="Peso">
              <a-badge status="processing" :text="item.acmePeso + '%'"/>
            </a-descriptions-item>
            <a-descriptions-item label="Acciones">
              <a-button type="primary" size="small"
                        @click="router.push(`/plan-mejoramiento/${plmeId}/factor/${item.factId}/accion-mejora/${item.acmeId}`)">
                Editar
              </a-button>
            </a-descriptions-item>
            <a-descriptions-item label="Descripción" :span="11">
              {{ item.acmeDescripcion }}
            </a-descriptions-item>
          </a-descriptions>
        </a-list-item>
      </template>
    </a-list>
  </div>

</template>
<script setup>
import {reactive, ref, defineProps, computed} from 'vue';
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";
import {useRoute} from "vue-router";


const route = useRoute()

const props = defineProps({
  programs: Array,
  data: Array,
  loader: Boolean
})

const plmeId = computed(() => {
  return route.params.plan
})

const pagination = {
  onChange: page => {
    console.log(page);
  },
  pageSize: 5,
  size: 'small',
  showSizeChanger: true
};
</script>
<style scoped>

</style>