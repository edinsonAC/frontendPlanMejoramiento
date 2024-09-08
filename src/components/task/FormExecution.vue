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
        <a-row justify="space-around" type="flex">
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Año</label>
            <a-form-item
                name="ejecAnio"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-input v-model:value="formState.ejecAnio" placeholder="Descripción de la ejecución"/>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Semestre</label>
            <a-form-item
                name="ejecSemestre"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-select v-model:value="formState.ejecSemestre" placeholder="Rol">
                <a-select-option :key="1" :value="1">
                  1
                </a-select-option>
                <a-select-option :key="2" :value="2">
                  2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="space-around" type="flex">
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Asignar a</label>
            <a-form-item
                name="usuaId"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-select v-model:value="formState.usuaId" placeholder="Rol">
                <a-select-option v-for="user in users" :key="user.usuaId" :value="user.usuaId">
                  {{ user.usuaNombre }} {{ user.usuaApellido }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Inicio / Fin</label>
            <a-form-item name="ejecFechaEjecucion"
                         :rules=" [{required: true,message: 'Este campo es obligatorio',}]">
              <a-date-picker
                  v-model:value="formState.ejecFechaEjecucion"
                  value-format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around">
          <a-col :xs="20" :sm="20" :md="23" :lg="23" :xl="23">
            <label>Descripción</label>
            <a-form-item
                name="ejecDescripcion"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-textarea v-model:value="formState.ejecDescripcion" placeholder="Descripción de la ejecución"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around">
          <a-button type="primary" html-type="submit"> {{ update ? 'Guardar' : 'Registrar' }}</a-button>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>
<script setup>
import {onBeforeMount, reactive} from "vue";
import axiosInstance from "../../plugins/axios.js";
import {storeApp} from "../../stores/store.js";
import {
  UploadOutlined
} from '@ant-design/icons-vue';

const store = new storeApp();

const emit = defineEmits(['saveInfo', 'updateInfo'])
const props = defineProps({
  update: Boolean,
  item: Object,
  users: Array,
  tareId: Number
})

onBeforeMount(() => {
  if (props.update) {
    formState.tareId = props.item['tareId']
    formState.tareNombre = props.item['tareNombre']
    formState.tareDescripcion = props.item['tareDescripcion']
    formState.usuaId = props.item['usuaId']
    formState.respId = props.item['respId']
    formState.tarePeso = Number(props.item['tarePeso'])
    formState.tareMeta = props.item['tareMeta']
    formState.tareLineaBase = props.item['tareLineaBase']
    formState.tareDocumentoLineaBase = props.item['tareDocumentoLineaBase']
    formState.acmeId = props.item['acmeId']
    formState.tareFechaInicio = props.item['tareFechaInicio']
    formState.tareFechaFin = props.item['tareFechaFin']
    formState.tareRecursos = props.item['tareRecursos']
    formState.tareOrden = props.item['tareOrden']

    formState.rangeDuration = [formState.tareFechaInicio, formState.tareFechaFin]
  }
})

const formState = reactive({
  ejecDescricion: '',
  ejecAvance: '',
  tareId: '',
  ejecFechaEjecucion: '',
  usuaId: '',
  ejecSemestre: '',
  ejecAnio: ''
});

const onFinish = values => {
  store.setLoader(true)
  values.tareFechaInicio = formState.rangeDuration[0]
  values.tareFechaFin = formState.rangeDuration[1]
  values.acmeId = props.acmeId
  if (props.update) {
    updateTask(values)
  } else {
    registerTask(values)
  }
}

const registerTask = (values) => {
  axiosInstance.post('/task', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      emit('saveInfo')
      store.setLoader(false)
    }
  })
}

const updateTask = (values) => {
  axiosInstance.put(`/task/${props.item.pracId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      emit('updateInfo')
      store.setLoader(false)
    }
  })
}

const onFinishFailed = values => {

}


</script>


<style scoped>

</style>