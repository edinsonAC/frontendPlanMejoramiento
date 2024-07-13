<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Factor']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormFactor :factor-types="factorsType" @saveInfo="getFactors"></FormFactor>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListFactor :data="factors" :loader="loaderTable"></ListFactor>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import FormFactor from "../../components/factor/FormFactor.vue";
import ListFactor from "../../components/factor/ListFactor.vue";
import axiosInstance from "../../plugins/axios.js";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getFactorTypes()
  getFactors()
})

const loaderTable = ref(false)
const factors = ref([])
const factorsType = ref([])

const getFactorTypes = () => {
  axiosInstance.get('/factor-type').then(res => {
    if (res.status == 200) {
      factorsType.value = res.data
    }
  })
}

const getFactors = () => {
  loaderTable.value = true
  axiosInstance.get('/factor').then(res => {
    if (res.status == 200) {
      factors.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>