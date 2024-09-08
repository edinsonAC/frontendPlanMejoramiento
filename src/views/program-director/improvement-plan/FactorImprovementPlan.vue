<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="space-between">
          <BreadCrumbComponent :paths="['Plan Mejoramiento','Factores']"></BreadCrumbComponent>
          <a-button type="primary" @click="router.back()">Volver</a-button>
        </a-row>
        <a-row type="flex" justify="center">
          <h2>{{ improvementPlan.plmeNombre }}</h2>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListFactor :data="factors" :loader="loaderTable" :agrements="[]" :factor-types="[]"
                        :plan="true" @getList="getFactors"></ListFactor>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>

import BreadCrumbComponent from "../../../components/share/BreadCrumbComponent.vue";
import ListFactor from "../../../components/factor/ListFactor.vue";

import {computed, onBeforeMount, ref} from "vue";

import axiosInstance from "../../../plugins/axios.js";
import {storeApp} from "../../../stores/store.js";
import {useRoute} from "vue-router";
import router from "../../../router/index.js";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getFactors()
  getImprovementPlan()
})
const loaderTable = ref(false)
const factors = ref([])
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
const route = useRoute()
const plmeId = computed(() => {
  return route.params.plan
})

const improvementPlan = ref([])
const getImprovementPlan = () => {
  axiosInstance.get('/improvement-plan/' + plmeId.value).then(res => {
    if (res.status == 200) {
      improvementPlan.value = res.data
    }
  })
}

</script>

<style scoped>

</style>