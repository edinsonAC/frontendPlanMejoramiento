<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent
              :paths="['Información Predeterminada','Plan de Desarrollo Institucional']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <FormDevelopmentPlan @saveInfo="getDevelopmentPlans"></FormDevelopmentPlan>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListDevelopmentPlan :data="developmentPlans" :loader="loaderTable"
                                 @getList="getDevelopmentPlans"></ListDevelopmentPlan>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import FormDevelopmentPlan from "../../components/development-plan/FormDevelopmentPlan.vue";
import ListDevelopmentPlan from "../../components/development-plan/ListDevelopmentPlan.vue";
import axiosInstance from "../../plugins/axios.js";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getDevelopmentPlans()
})

const loaderTable = ref(false)
const developmentPlans = ref([])

const getDevelopmentPlans = () => {
  loaderTable.value = true
  axiosInstance.get('/development-plan').then(res => {
    if (res.status == 200) {
      developmentPlans.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>