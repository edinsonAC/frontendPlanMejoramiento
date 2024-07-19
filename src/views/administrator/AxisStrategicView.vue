<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Eje Estrategico']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormAxisStrategic :update="false" @saveInfo="getAxisStrategies" :item="null"></FormAxisStrategic>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListAxisStrategic :data="axisStrategies" :loader="loaderTable"
                               @getList="getAxisStrategies"></ListAxisStrategic>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import FormAxisStrategic from "../../components/axis-strategic/FormAxisStrategic.vue";
import ListAxisStrategic from "../../components/axis-strategic/ListAxisStrategic.vue";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";

import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";


const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getAxisStrategies()
})

const loaderTable = ref(false)
const axisStrategies = ref([])

const getAxisStrategies = () => {
  loaderTable.value = true
  axiosInstance.get('/strategic-axis').then(res => {
    if (res.status == 200) {
      axisStrategies.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>