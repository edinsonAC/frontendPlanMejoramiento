<template>
  <a-row align="middle" justify="space-around" type="flex" class="form-comp">
    <a-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
      <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            label="Plan de Desarrollo Institucional"
            name="pdiId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.pdiId" placeholder="Seleccione PDI" @change="onchangeList">
            <a-select-option v-for="dev in developmentPlansFiltered" :key="dev.pdiId" :value="dev.pdiId">
              {{ dev.pdiNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Eje Estratégico"
            name="ejesId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.ejesId" placeholder="Seleccione eje estratégico"
                    @change="listStrategicLineByEjesId">
            <a-select-option v-for="eje in strategicAxis" :key="eje.ejesId" :value="eje.ejesId">
              {{ eje.ejesNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Línea Estratégica"
            name="liesId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.liesId" placeholder="Seleccione línea estratégica">
            <a-select-option v-for="linea in strategicLines" :key="linea.liesId" :value="linea.liesId">
              {{ linea.liesNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="prinNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.prinNombre" :maxlength="200" placeholder="Nombre programa inversión"/>
        </a-form-item>
        <a-row type="flex" justify="space-around">
          <a-button type="primary" html-type="submit">{{ update ? 'Guardar' : 'Registrar' }}</a-button>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>
<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import axiosInstance from "../../plugins/axios.js";
import {storeApp} from "../../stores/store.js";
import {openNotification} from "../../lib/util.js";

const store = storeApp()
const emit = defineEmits(['saveInfo', 'updateInfo'])

const props = defineProps({
  developmentPlans: Array,
  update: Boolean,
  item: Object
})

onBeforeMount(() => {
  if (props.update) {
    formState.prinNombre = props.item['prinNombre']
    formState.pdiId = props.item['pdiId']
    getStrategicAxis(formState.pdiId)
    formState.ejesId = props.item['ejesId']
    listStrategicLineByEjesId(formState.ejesId)
    formState.liesId = props.item['liesId']
  }
})

const developmentPlansFiltered = computed(() => {
  return props.developmentPlans.filter((item) => {
    if (!props.update)
      return item.pdiState
    else
      return item
  })
})

const strategicLines = ref([]);
const formState = reactive({
  prinNombre: null,
  liesId: null,
  ejesId: null
});

const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateInvestmentProgram(values)
  } else {
    registerInvestmentProgram(values)
  }
}


const registerInvestmentProgram = (values) => {
  axiosInstance.post('/investment-program', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.prinNombre = null
      formState.liesId = null
      formState.ejesId = null
      formState.pdiId = null
      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const updateInvestmentProgram = (values) => {
  axiosInstance.put(`/investment-program/${props.item.prinId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.prinNombre = null
      formState.liesId = null
      formState.ejesId = null
      formState.pdiId = null
      emit('updateInfo')
      store.setLoader(false)
    }
  }).catch(er => {
    openNotification('error', 'Error', 'Se ha producido un error editando la información.')
  })
}

const listStrategicLineByEjesId = (values) => {
  axiosInstance(`/strategic-line/axis-strategic/${values}`).then(res => {
    if (res.status == 200 || res.status == 201) {
      strategicLines.value = res.data
      store.setLoader(false)
    }
  })
}


const onchangeList = (id) => {
  formState.ejesId = null
  getStrategicAxis(id)
}
const strategicAxis = ref([])

const getStrategicAxis = (id) => {
  axiosInstance.get('/strategic-axis/development-plan/' + id).then(res => {
    if (res.status == 200) {
      strategicAxis.value = res.data
    }
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