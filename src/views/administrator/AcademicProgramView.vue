<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Programa Academico']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormAcademicProgram :update="false" @saveInfo="getAcademicPrograms" :item="null"></FormAcademicProgram>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListAcademicProgram :data="academicPrograms" :loader="loaderTable"
                                 @getList="getAcademicPrograms"></ListAcademicProgram>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";

import FormAcademicProgram from "../../components/academic-program/FormAcademicProgram.vue";
import ListAcademicProgram from "../../components/academic-program/ListAcademicProgram.vue";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";

import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";


const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getAcademicPrograms()
})

const loaderTable = ref(false)
const academicPrograms = ref([])

const getAcademicPrograms = () => {
  loaderTable.value = true
  axiosInstance.get('/academic-program').then(res => {
    if (res.status == 200) {
      academicPrograms.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>