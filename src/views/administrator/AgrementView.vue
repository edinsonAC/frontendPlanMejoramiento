<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Acuerdo']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
            <FormAgrement :update="false" @saveInfo="getAgrement" :item="null"></FormAgrement>
          </a-col>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListAgrement :data="agrements" :loader="loaderTable"
                         @getList="getAgrement"></ListAgrement>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import FormAgrement from "../../components/agrement/FormAgrement.vue";
import ListAgrement from "../../components/agrement/ListAgrement.vue";
import {onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getAgrement()
})

const loaderTable = ref(false)
const agrements = ref([])

const getAgrement = () => {
  loaderTable.value = true
  axiosInstance.get('/agrement').then(res => {
    if (res.status == 200) {
      agrements.value = res.data
      store.setLoader(false)
      loaderTable.value = false

    }
  })
}

</script>
<style scoped>

</style>