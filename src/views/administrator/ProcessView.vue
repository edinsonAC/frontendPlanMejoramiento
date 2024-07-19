<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Proceso']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormProcess :update="false" @saveInfo="getProcesses" :item="null"></FormProcess>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListProcess :data="processes" :loader="loaderTable"
                         @getList="getProcesses"></ListProcess>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import FormProcess from "../../components/process/FormProcess.vue";
import ListProcess from "../../components/process/ListProcess.vue";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getProcesses()
})

const loaderTable = ref(false)
const processes = ref([])

const getProcesses = () => {
  loaderTable.value = true
  axiosInstance.get('/process').then(res => {
    if (res.status == 200) {
      processes.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>