<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Tipo de Situación']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <FormSituationType :update="false" @saveInfo="getTypesOfSituation" :item="null"></FormSituationType>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListSituationType :data="typesOfSituation" :loader="loaderTable"
                         @getList="getTypesOfSituation"></ListSituationType>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import FormSituationType from "../../components/situation-type/FormSituationType.vue";
import ListSituationType from "../../components/situation-type/ListSituationType.vue";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";


const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getTypesOfSituation()
})

const loaderTable = ref(false)
const typesOfSituation = ref([])

const getTypesOfSituation = () => {
  loaderTable.value = true
  axiosInstance.get('/situation-type').then(res => {
    if (res.status == 200) {
      typesOfSituation.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>