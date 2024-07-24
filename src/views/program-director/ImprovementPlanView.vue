<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Plan Mejoramiento','Planes de mejoramiento']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
            <FormImprovementPlan :programs="academicPrograms" @saveInfo="resetInfo"></FormImprovementPlan>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListImprovementPlan :data="improvementPlans" :loader="loaderTable" :programs="academicPrograms"
                                 @getList="resetInfo"></ListImprovementPlan>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import FormImprovementPlan from "../../components/improvement-plan/FormImprovementPlan.vue";
import ListImprovementPlan from "../../components/improvement-plan/ListImprovementPlan.vue";
import axiosInstance from "../../plugins/axios.js";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  if (store.isAdmin) {
    getAcademicPrograms()
    getImprovementPlans()
  } else {
    let pracId = store.user.pracId
    getImprovementPlansByPracId(pracId)
  }
})

const loaderTable = ref(false)
const improvementPlans = ref([])
const academicPrograms = ref([])

const getAcademicPrograms = () => {
  axiosInstance.get('/academic-program').then(res => {
    if (res.status == 200) {
      academicPrograms.value = res.data
    }
  })
}

const getImprovementPlans = () => {
  loaderTable.value = true
  axiosInstance.get('/improvement-plan').then(res => {
    if (res.status == 200) {
      improvementPlans.value = res.data
      store.setLoader(false)
      loaderTable.value = false
    }
  })
}

const getImprovementPlansByPracId = (id) => {
  loaderTable.value = true
  axiosInstance.get(`/improvement-plan/academic-program/${id}`).then(res => {
    if (res.status == 200) {
      improvementPlans.value = res.data
      store.setLoader(false)
      loaderTable.value = false
    }
  })
}

const resetInfo = () => {
  if (store.isAdmin) {
    getImprovementPlans()
  } else {
    let pracId = store.user.pracId
    getImprovementPlansByPracId(pracId)
  }
}
</script>
<style scoped>

</style>