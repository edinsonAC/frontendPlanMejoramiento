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
          <a-select v-model:value="formState.ejesId" placeholder="Seleccione eje estratégico">
            <a-select-option v-for="eje in strategicAxis" :key="eje.ejesId" :value="eje.ejesId">
              {{ eje.ejesNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="liesNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.liesNombre" :maxlength="400" placeholder="Nombre línea estratégica"/>
        </a-form-item>
        <a-form-item
            label="Objetivos"
            name="liesObjetivos"
        >
          <a-textarea v-model:value="formState.liesObjetivos" :maxlength="1500" placeholder="Objetivos"></a-textarea>
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
  update: Boolean,
  item: Object,
  developmentPlans: Array
})

onBeforeMount(() => {
  if (props.update) {
    formState.liesNombre = props.item['liesNombre']
    formState.liesObjetivos = props.item['liesObjetivos']
    formState.ejesId = props.item['ejesId']
    formState.pdiId = props.item['pdiId']
    getStrategicAxis(formState.pdiId)
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

const formState = reactive({
  liesNombre: null,
  liesObjetivos: null,
  ejesId: null,
  pdiId: null,
});

const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateStrategicLine(values)
  } else {
    registerStrategicLine(values)
  }
}
const strategicAxis = ref([])

const onchangeList = (id) => {
  formState.ejesId = null
  getStrategicAxis(id)
}

const getStrategicAxis = (id) => {
  axiosInstance.get('/strategic-axis/development-plan/' + id).then(res => {
    if (res.status == 200) {
      strategicAxis.value = res.data
    }
  })
}


const registerStrategicLine = (values) => {
  axiosInstance.post('/strategic-line', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.liesNombre = null
      formState.liesObjetivos = null
      formState.ejesId = null
      formState.pdiId = null

      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const updateStrategicLine = (values) => {
  axiosInstance.put(`/strategic-line/${props.item.liesId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.liesNombre = null
      formState.ejesId = null
      formState.liesObjetivos = null
      formState.pdiId = null

      emit('updateInfo')
      store.setLoader(false)
    }
  }).catch(er => {
    openNotification('error', 'Error', 'Se ha producido un error editando la información.')
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