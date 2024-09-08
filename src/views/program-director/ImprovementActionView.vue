<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="space-between">
          <BreadCrumbComponent
              :paths="['Plan de Mejoramiento','Factor','Acciónes de mejoras']"></BreadCrumbComponent>
          <a-button type="primary" @click="router.back()">Volver</a-button>
        </a-row>
        <a-row type="flex" justify="center">
          <h2>{{ improvementPlan.plmeNombre }}</h2>
        </a-row>
        <a-row>
          <progress-bar :percentaje="progressAction"></progress-bar>
        </a-row>
        <a-row v-if="progressAction < 100" type="flex" justify="end" style="margin-bottom: 1%">
          <router-link :to="`/plan-mejoramiento/${plmeId}/factor/${factId}/accion-mejora/0`">
            <a-button type="primary"
                      size="small"> Crear Acción de Mejora
            </a-button>
          </router-link>
        </a-row>
        <a-row type="flex" justify="space-around">
          <a-card size="small" title="Filtros" style="width: 100%">
            <a-row type="flex" justify="space-around">
              <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <label>Situación Intervenir</label>
                <a-select style="width:100%" v-model:value="searchSituation" placeholder="Seleccione situación"
                          :allow-clear="true">
                  <a-select-option v-for="situation in situationTypes" :key="situation.tisiId"
                                   :value="situation.tisiId">
                    {{ situation.tisiNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <label>Programa Inversión</label>
                <a-select style="width:100%" v-model:value="searchProgram" placeholder="Seleccione programa"
                          :allow-clear="true">
                  <a-select-option v-for="program in investmentPrograms" :key="program.prinId" :value="program.prinId">
                    {{ program.prinNombre }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
        <a-row style="margin-top: 2%" type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <ListImprovementAction :data="improvementActionsFiltered"></ListImprovementAction>
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
import ListImprovementAction from "../../components/improvement-action/ListImprovementAction.vue";
import {useRoute} from 'vue-router'
import router from "../../router/index.js";
import ProgressBar from "../../components/improvement-action/ProgressBar.vue";

const route = useRoute()
const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getInvestmentProgram()
  getImprovementPlan()
  getFactors()
  getSituationType()
  getImprovementActionByPlmeIdAndFactId()
})

const improvementActions = ref([])
const plmeId = computed(() => {
  return route.params.plan
})

const searchSituation = ref(undefined)
const searchProgram = ref(undefined)

const improvementActionsFiltered = computed(() => {
  const searchSituationLower = searchSituation.value !== undefined ? searchSituation.value.toString().toLowerCase() : ""
  const searchProgramLower = searchProgram.value !== undefined ? searchProgram.value.toString().toLowerCase() : ""

  return improvementActions.value.filter((item) => {
    const tisiId = item.tisiId?.toString().toLowerCase() || ""
    const prinId = item.prinId?.toString().toLowerCase() || ""

    return (
        tisiId.includes(searchSituationLower) &&
        prinId.includes(searchProgramLower)
    )
  })
})

const progressAction = computed(() => {
  let total = 0;
  improvementActions.value.forEach(e => total += e.acmePeso)
  return total
})

const factId = computed(() => {
  return route.params.factor
})


const getImprovementActionByPlmeIdAndFactId = () => {
  axiosInstance.get(`/improvement-action/improvement-plan/${plmeId.value}/factor/${factId.value}`).then(res => {
    if (res.status == 200) {
      improvementActions.value = res.data
      store.setLoader(false)
    }
  })
}

const improvementPlan = ref([])
const getImprovementPlan = () => {
  axiosInstance.get('/improvement-plan/' + plmeId.value).then(res => {
    if (res.status == 200) {
      improvementPlan.value = res.data
    }
  })
}

const factors = ref([])
const getFactors = () => {
  axiosInstance.get('/factor').then(res => {
    if (res.status == 200) {
      factors.value = res.data
    }
  })
}

const situationTypes = ref([])
const getSituationType = () => {
  axiosInstance.get('/situation-type').then(res => {
    if (res.status == 200) {
      situationTypes.value = res.data
    }
  })
}

const investmentPrograms = ref([])
const getInvestmentProgram = () => {
  axiosInstance.get('/investment-program/improvement-plan/' + plmeId.value).then(res => {
    if (res.status == 200) {
      investmentPrograms.value = res.data
    }
  })
}


const resetInfo = () => {

}
</script>
<style scoped>

</style>