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
            label="Eje Estratégico"
            name="ejesId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.ejesId" placeholder="Seleccione eje estratégico">
            <a-select-option v-for="eje in ejes" :key="eje.ejesId" :value="eje.ejesId">
              {{ eje.ejesNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="liesNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.liesNombre" placeholder="Nombre programa academico"/>
        </a-form-item>
        <a-form-item
            label="Objetivos"
            name="liesObjetivos"
        >
          <a-textarea v-model:value="formState.liesObjetivos" placeholder="Objetivos"></a-textarea>
        </a-form-item>
        <a-row type="flex" justify="space-around">
          <a-button type="primary" html-type="submit">{{ update ? 'Guardar' : 'Registrar' }}</a-button>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>
<script setup>
import {onBeforeMount, reactive} from "vue";
import axiosInstance from "../../plugins/axios.js";
import {storeApp} from "../../stores/store.js";
import {openNotification} from "../../lib/util.js";

const store = storeApp()
const emit = defineEmits(['saveInfo', 'updateInfo'])

const props = defineProps({
  ejes: Array,
  update: Boolean,
  item: Object
})

onBeforeMount(() => {
  if (props.update) {
    formState.liesNombre = props.item['liesNombre']
    formState.liesObjetivos = props.item['liesObjetivos']
    formState.ejesId = props.item['ejesId']
  }
})

const formState = reactive({
  liesNombre: null,
  liesObjetivos: null,
  ejesId: null
});

const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateStrategicLine(values)
  } else {
    registerStrategicLine(values)
  }
}


const registerStrategicLine = (values) => {
  axiosInstance.post('/strategic-line', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.liesNombre = null
      formState.liesObjetivos = null
      formState.ejesId = null

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