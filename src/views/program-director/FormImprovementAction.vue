<template>
  <a-row type="flex" justify="space-around">
    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <a-card class="card-chart">
        <a-row type="flex" justify="space-between">
          <BreadCrumbComponent
              :paths="['Plan Mejoramiento','Planes de mejoramiento','Acción de mejora']"></BreadCrumbComponent>
          <a-button type="primary" @click="router.back()">Volver</a-button>
        </a-row>
        <a-row v-if="improvementPlan" type="flex" justify="center">
          <h2>{{ improvementPlan.plmeNombre }}</h2>
        </a-row>
        <a-row align="middle" justify="space-around" type="flex" class="form-comp">
          <a-col :xs="20" :sm="20" :md="24" :lg="24" :xl="24">
            <a-form
                :model="formState"
                name="basic"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
              <a-row type="flex" justify="space-around">
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Factor</label>
                  <a-form-item
                      name="factId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.factId" placeholder="Seleccionar Factor">
                      <a-select-option v-for="fact in factors" :key="fact.factId" :value="fact.factId">
                        {{ fact.factNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Proceso</label>
                  <a-form-item
                      name="procId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.procId" placeholder="Seleccionar Proceso">
                      <a-select-option v-for="proc in procesess" :key="proc.procId" :value="proc.procId">
                        {{ proc.procNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Tipo Situación</label>
                  <a-form-item
                      name="tisiId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.tisiId" placeholder="Seleccionar situacion">
                      <a-select-option v-for="situation in situationTypes" :key="situation.tisiId"
                                       :value="situation.tisiId">
                        {{ situation.tisiNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Eje Estrategico</label>
                  <a-form-item
                      name="ejesId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.ejesId" placeholder="Seleccionar Eje"
                              @change="listStrategicLineByEjesId">
                      <a-select-option v-for="eje in axisEstrategics" :key="eje.ejesId" :value="eje.ejesId">
                        {{ eje.ejesNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Línea Estrategica</label>
                  <a-form-item
                      name="liesId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.liesId" placeholder="Seleccionar Línea"
                              @change="getInvestmentProgramByLiesId">
                      <a-select-option v-for="linea in strategicLines" :key="linea.liesId" :value="linea.liesId">
                        {{ linea.liesNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                  <label>Programa Inversión</label>
                  <a-form-item
                      name="prinId"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-select v-model:value="formState.prinId" placeholder="Seleccionar Programa">
                      <a-select-option v-for="program in investmenPrograms" :key="program.prinId"
                                       :value="program.prinId">
                        {{ program.prinNombre }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col :xs="20" :sm="20" :md="23" :lg="23" :xl="23">
                  <label>Descripción</label>
                  <a-form-item
                      name="acmeDescripcion"
                      :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
                  >
                    <a-textarea v-model:value="formState.acmeDescripcion" placeholder="Descripción"></a-textarea>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-button type="primary" html-type="submit"> {{ acmeId != 0 ? 'Guardar' : 'Registrar' }}</a-button>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
        <a-row v-if="acmeId != 0" type="flex" justify="space-around" style="margin-top: 5%">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-row justify="space-around" type="flex" class="form-comp">
              <a-row v-if="improvementPlan" type="flex" justify="start" style="width: 100%">
                <h2>Tareas</h2>
              </a-row>
              <a-col :xs="20" :sm="20" :md="24" :lg="24" :xl="24">
                <ListTask :loader="loaderTable" :data="tasks"></ListTask>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>

</template>
<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import axiosInstance from "../../plugins/axios.js";
import BreadCrumbComponent from "../../components/share/BreadCrumbComponent.vue";
import {storeApp} from "../../stores/store.js";
import {useRoute} from "vue-router";
import {openNotification} from "../../lib/util.js";
import router from "../../router/index.js";
import ListTask from "../../components/task/ListTask.vue";

const route = useRoute()
const store = storeApp()

onBeforeMount(() => {
  store.setLoader(true)
  getFactors()
  getSituationType()
  getProcesses()
  getImprovementPlan()
  getAxisStrategics()

  if (acmeId.value != 0) {
    getImprovementAction()
    getTasks()
  }
})

const plmeId = computed(() => {
  return route.params.plan
})

const acmeId = computed(() => {
  return route.params.accion
})


const formState = reactive({
  factId: null,
  procId: null,
  tisiId: null,
  ejesId: null,
  liesId: null,
  prinId: null,
  acmeDescripcion: null
});
const situationTypes = ref([])
const getSituationType = () => {
  axiosInstance.get('/situation-type').then(res => {
    if (res.status == 200) {
      situationTypes.value = res.data
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

const procesess = ref([])
const getProcesses = () => {
  axiosInstance.get('/process').then(res => {
    if (res.status == 200) {
      procesess.value = res.data
    }
  })
}


const improvementPlan = ref(null)
const getImprovementPlan = () => {
  axiosInstance.get('/improvement-plan/' + plmeId.value).then(res => {
    if (res.status == 200) {
      improvementPlan.value = res.data
    }
  })
}

const improvementAction = ref(null)
const getImprovementAction = () => {
  axiosInstance.get('/improvement-action/' + acmeId.value).then(res => {
    if (res.status == 200) {
      improvementAction.value = res.data
      formState.tisiId = res.data.tisiId
      formState.procId = res.data.procId
      formState.factId = res.data.factId
      formState.liesId = res.data.programaInversion.liesId
      formState.ejesId = res.data.programaInversion.lineaEstrategica.ejesId
      listStrategicLineByEjesId(formState.ejesId)
      getInvestmentProgramByLiesId(formState.liesId)
      formState.prinId = res.data.prinId
      formState.acmeDescripcion = res.data.acmeDescripcion
    }
  })
}

const axisEstrategics = ref([])
const getAxisStrategics = () => {
  axiosInstance.get('/strategic-axis').then(res => {
    if (res.status == 200) {
      axisEstrategics.value = res.data
    }
  })
}

const strategicLines = ref([]);
const listStrategicLineByEjesId = (value) => {
  store.setLoader(true)
  axiosInstance(`/strategic-line/axis-strategic/${value}`).then(res => {
    if (res.status == 200 || res.status == 201) {
      strategicLines.value = res.data
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const investmenPrograms = ref([]);
const getInvestmentProgramByLiesId = (value) => {
  store.setLoader(true)
  axiosInstance(`/investment-program/strategic-line/${value}`).then(res => {
    if (res.status == 200 || res.status == 201) {
      investmenPrograms.value = res.data
      store.setLoader(false)
    }
  })
}

const onFinish = values => {
  values['plmeId'] = plmeId.value
  store.setLoader(true)
  if (acmeId.value != 0) {
    updateImprovementAction(values)
  } else {
    registerImprovementAction(values)
  }
}

const updateImprovementAction = (values) => {
  store.setLoader(true)
  axiosInstance.put(`/improvement-action/${acmeId.value}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      openNotification('success', 'Información', 'Se ha editado con éxito la acción de mejora.')
      store.setLoader(false)
    }
  })
}

const registerImprovementAction = (values) => {
  store.setLoader(true)
  axiosInstance.post(`/improvement-action`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      router.push(`/plan-mejoramiento/${plmeId.value}/accion-mejora`)
      openNotification('success', 'Información', 'Se ha registrado con éxito la acción de mejora.')
    }
  })
}

const tasks = ref([])
const loaderTable = ref(false)

const getTasks = () => {
  loaderTable.value = true
  axiosInstance.get(`/task/improvement-action/${acmeId.value}`).then(res => {
    if (res.status == 200) {
      tasks.value = res.data
    }
    loaderTable.value = false

  }).catch(err => {
    loaderTable.value = false
  })
}


const onFinishFailed = values => {
}
</script>
<style scoped>
.form-comp {
  padding: 20px;
  background-color: #eff3f5;
  border-radius: 10px;
}
</style>