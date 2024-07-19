<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Linea Estratégica']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormStrategicLine :ejes="strategicAxis" @saveInfo="getStrategicLine"></FormStrategicLine>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListStrategicLine :data="strategicLines" :loader="loaderTable" :ejes="strategicAxis"
                               @getList="getStrategicLine"></ListStrategicLine>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import FormStrategicLine from "../../components/strategic-line/FormStrategicLine.vue";
import ListStrategicLine from "../../components/strategic-line/ListStrategicLine.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getStrategicAxis()
  getStrategicLine()
})

const loaderTable = ref(false)
const strategicLines = ref([])
const strategicAxis = ref([])

const getStrategicAxis = () => {
  axiosInstance.get('/strategic-axis').then(res => {
    if (res.status == 200) {
      strategicAxis.value = res.data
    }
  })
}

const getStrategicLine = () => {
  loaderTable.value = true
  axiosInstance.get('/strategic-line').then(res => {
    if (res.status == 200) {
      strategicLines.value = res.data
      store.setLoader(false)
      loaderTable.value = false
    }
  }).catch(err => {
    store.setLoader(false)
    loaderTable.value = false
  })
}

</script>
<style scoped>

</style>