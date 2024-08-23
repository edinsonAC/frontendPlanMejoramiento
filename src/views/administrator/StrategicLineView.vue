<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Linea Estratégica']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <FormStrategicLine @saveInfo="getStrategicLine"
                               :development-plans="developmentPlans"></FormStrategicLine>
          </a-col>
        </a-row>
        <a-row style="margin-top: 3%" type="flex" justify="space-around" v-show="false">
          <a-card size="small" title="Filtros" style="width: 100%">
            <a-row type="flex" justify="start">
              <a-col :xs="24" :sm="24" :md="10" :lg="12" :xl="12">
                <label>Ejes Estratégicos</label>
                <a-select style="width:100%" v-model:value="searchEje" placeholder="Seleccione eje"
                          :allow-clear="true">
                  <a-select-option v-for="eje in strategicAxis" :key="eje.ejesId" :value="eje.ejesId">
                    {{ eje.ejesNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
        <a-row style="margin-top: 3%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListStrategicLine :data="strategicLinesFiltered" :loader="loaderTable"
                               :development-plans="developmentPlans"
                               @getList="getStrategicLine"></ListStrategicLine>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import {computed, onBeforeMount, ref} from "vue";
import {storeApp} from "../../stores/store.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import FormStrategicLine from "../../components/strategic-line/FormStrategicLine.vue";
import ListStrategicLine from "../../components/strategic-line/ListStrategicLine.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getStrategicLine()
  getDevelopmentPlans()
})

const loaderTable = ref(false)
const strategicLines = ref([])
const searchEje = ref(undefined)

const strategicLinesFiltered = computed(() => {
  const searchEjeLower = searchEje.value !== undefined ? searchEje.value.toString().toLowerCase() : ""

  return strategicLines.value.filter((item) => {
    const ejesId = item.ejesId?.toString().toLowerCase() || ""

    return (ejesId.includes(searchEjeLower))
  })
})

const developmentPlans = ref([])
const getDevelopmentPlans = () => {
  axiosInstance.get('/development-plan').then(res => {
    if (res.status == 200) {
      developmentPlans.value = res.data
    }
  })
}


const strategicAxis = ref([])

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