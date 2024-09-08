<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="start">
          <BreadCrumbComponent :paths="['Información Predeterminada','Programa Inversión']"></BreadCrumbComponent>
        </a-row>
        <a-row style="margin-top: 1%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <FormInvestmentProgram :development-plans="developmentPlans"
                                   @saveInfo="getInvestmentProgram"></FormInvestmentProgram>
          </a-col>
        </a-row>
        <a-row style="margin-top: 3%" type="flex" justify="space-around">
          <a-card size="small" title="Filtros" style="width: 100%">
            <a-row type="flex" justify="space-around">
              <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
                <label>Plan de desarrollo Institucional</label>
                <a-select style="width:100%" @change="getStrategicAxis" placeholder="Seleccione PDI"
                          :allow-clear="true">
                  <a-select-option v-for="dev in developmentPlans" :key="dev.pdiId" :value="dev.pdiId">
                    {{ dev.pdiNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
                <label>Ejes Estratégicos</label>
                <a-select style="width:100%" v-model:value="searchEje" placeholder="Seleccione eje"
                          @change="listStrategicLineByEjesId"
                          :allow-clear="true">
                  <a-select-option v-for="eje in strategicAxis" :key="eje.ejesId" :value="eje.ejesId">
                    {{ eje.ejesNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
                <label>Línea Estratégica</label>
                <a-select style="width:100%" v-model:value="searchLinea" placeholder="Seleccione Línea"
                          :allow-clear="true">
                  <a-select-option v-for="line in strategicLines" :key="line.liesId" :value="line.liesId">
                    {{ line.liesNombre }}
                  </a-select-option>
                </a-select>
              </a-col>

            </a-row>
          </a-card>
        </a-row>
        <a-row style="margin-top: 5%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
            <ListInvestmentProgram :data="investmentProgramsFiltered" :loader="loaderTable"
                                   :development-plans="developmentPlans"
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
  getDevelopmentPlans()
  getInvestmentProgram()
})

const loaderTable = ref(false)
const investmentPrograms = ref([])
const strategicLines = ref([])
const searchEje = ref(undefined)
const searchLinea = ref(undefined)

const investmentProgramsFiltered = computed(() => {
  const searchEjeaLower = searchEje.value !== undefined ? searchEje.value : 0
  const searchLineaLower = searchLinea.value !== undefined ? searchLinea.value : 0

  if (searchEjeaLower != 0 && searchLineaLower != 0) {
    return investmentPrograms.value.filter((item) => {
      const ejesId = item.lineaEstrategica.ejesId
      const liesId = item.lineaEstrategica.liesId

      return ejesId == searchEjeaLower && liesId == searchLineaLower
    })
  }
  if (searchEjeaLower != 0) {
    return investmentPrograms.value.filter((item) => {
      const ejesId = item.lineaEstrategica.ejesId
      return ejesId == searchEjeaLower
    })
  }
  return investmentPrograms.value
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

const getStrategicAxis = (id) => {
  if (id) {
    searchEje.value = undefined
    strategicAxis.value = []
    axiosInstance.get('/strategic-axis/development-plan/' + id).then(res => {
      if (res.status == 200) {
        strategicAxis.value = res.data
      }
    })
  } else {
    searchEje.value = undefined
    strategicAxis.value = []
  }

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

const listStrategicLineByEjesId = () => {
  if (searchEje.value != undefined) {
    axiosInstance(`/strategic-line/axis-strategic/${searchEje.value}`).then(res => {
      if (res.status == 200 || res.status == 201) {
        strategicLines.value = res.data
      }
    })
  }

}
</script>
<style scoped>

</style>