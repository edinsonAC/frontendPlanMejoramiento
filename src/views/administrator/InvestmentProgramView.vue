<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Programa Inversión']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <FormInvestmentProgram :ejes="strategicAxis" @saveInfo="getInvestmentProgram"></FormInvestmentProgram>
          </a-col>
        </a-row>
        <a-row style="margin-top: 3%" type="flex" justify="space-around">
          <a-card size="small" title="Filtros" style="width: 100%">
            <a-row type="flex" justify="space-around">
              <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <label>Ejes Estratégicos</label>
                <a-select style="width:100%" @change="listStrategicLineByEjesId" placeholder="Seleccione eje"
                          :allow-clear="true">
                  <a-select-option v-for="eje in strategicAxis" :key="eje.ejesId" :value="eje.ejesId">
                    {{ eje.ejesNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <label>Líneas Estratégicas</label>
                <a-select style="width:100%" v-model:value="searchLine" placeholder="Seleccione línea"
                          :allow-clear="true">
                  <a-select-option v-for="linea in strategicLines" :key="linea.liesId" :value="linea.liesId">
                    {{ linea.liesNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListInvestmentProgram :data="investmentProgramsFiltered" :loader="loaderTable" :ejes="strategicAxis"
                                   @getList="getInvestmentProgram"></ListInvestmentProgram>
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
import FormInvestmentProgram from "../../components/investment-program/FormInvestmentProgram.vue";
import ListInvestmentProgram from "../../components/investment-program/ListInvestmentProgram.vue";

const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getStrategicAxis()
  getInvestmentProgram()
})

const loaderTable = ref(false)
const investmentPrograms = ref([])
const strategicAxis = ref([])
const strategicLines = ref([])
const searchLine = ref(undefined)


const investmentProgramsFiltered = computed(() => {
  const searchLineaLower = searchLine.value !== undefined ? searchLine.value.toString().toLowerCase() : ""

  return investmentPrograms.value.filter((item) => {
    const liesId = item.liesId?.toString().toLowerCase() || ""

    return (liesId.includes(searchLineaLower))
  })
})


const getStrategicAxis = () => {
  axiosInstance.get('/strategic-axis').then(res => {
    if (res.status == 200) {
      strategicAxis.value = res.data
    }
  })
}

const getInvestmentProgram = () => {
  loaderTable.value = true
  axiosInstance.get('/investment-program').then(res => {
    if (res.status == 200) {
      investmentPrograms.value = res.data
      store.setLoader(false)
      loaderTable.value = false
    }
  }).catch(err => {
    store.setLoader(false)
    loaderTable.value = false
  })
}

const listStrategicLineByEjesId = (values) => {
  searchLine.value = undefined
  axiosInstance(`/strategic-line/axis-strategic/${values}`).then(res => {
    if (res.status == 200 || res.status == 201) {
      strategicLines.value = res.data
      store.setLoader(false)
    }
  })
}
</script>
<style scoped>

</style>