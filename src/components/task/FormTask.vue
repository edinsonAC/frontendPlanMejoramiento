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
          <a-col :xs="20" :sm="20" :md="23" :lg="23" :xl="23">
            <label>Nombre</label>
            <a-form-item
                name="tareNombre"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-input v-model:value="formState.tareNombre" placeholder="Nombre de la tarea"/>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="23" :lg="23" :xl="23">
            <label>Descripción</label>
            <a-form-item
                name="tareDescripcion"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-textarea v-model:value="formState.tareDescripcion" placeholder="Descripción de la tarea"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="space-around" type="flex">
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Rol</label>
            <a-form-item
                name="respId"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-select v-model:value="formState.respId" placeholder="Rol">
                <a-select-option v-for="responsable in responsibles" :key="responsable.respId"
                                 :value="responsable.respId">
                  {{ responsable.respNombre }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Asignar a</label>
            <a-form-item
                name="usuaId"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-select v-model:value="formState.usuaId" placeholder="Rol">

              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="space-around" type="flex">
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Inicio / Fin</label>
            <a-form-item name="range-picker" v-bind="rangeConfig">
              <a-range-picker :value="[formState.tareFechaInicio, formState.tareFechaFin]"
                              @update:value="onUpdateValue" value-format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Peso de la tarea</label>
            <a-form-item name="tarePeso">
              <a-slider
                  v-model:value="formState.tarePeso"
                  :marks="{
          0: '0%',
          20: '20%',
          40: '40%',
          60: '60%',
          80: '80%',
          100: '100%',
        }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around">
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Documento Soporte</label>
            <a-form-item name="upload" extra="">
              <a-upload
                  v-model:fileList="formState.upload"
                  name="logo"
                  action="/upload.do"
                  list-type="picture"
              >
                <a-button>
                  <template #icon>
                    <UploadOutlined/>
                  </template>
                  Click para cargar archivo
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="11" :lg="11" :xl="11">
            <label>Línea base</label>
            <a-form-item
                name="tareLineaBase"
                :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
            >
              <a-input v-model:value="formState.tareLineaBase" placeholder="Línea base de la tarea."/>
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
  responsibles: Array,
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
  }
})

const formState = reactive({
  tareNombre: '',
  tareDescripcion: '',
  tarePeso: '',
  tareMeta: '',
  tareLineaBase: '',
  tareDocumentoLineaBase: '',
  acmeId: '',
  tareFechaInicio: '',
  tareFechaFin: '',
  usuaId: '',
  respId: '',
  tareRecursos: '',
  tareOrden: 0
});

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Seleccione el rango de fechas.',
    },
  ],
};
const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateTask(values)
  } else {
    registerTask(values)
  }
}

const onUpdateValue = (e) => {
  formState.tareFechaInicio = e[0];
  formState.tareFechaFin = e[1];
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