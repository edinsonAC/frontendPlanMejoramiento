<template>
  <a-row align="middle" justify="space-around" type="flex" class="form-comp">
    <a-col :xs="20" :sm="20" :md="23" :lg="23" :xl="23">
      <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            label="Nombre"
            name="pdiNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.pdiNombre" placeholder="Nombre plan"/>
        </a-form-item>
        <a-form-item
            label="Periodo"
            name="pdiPeriodo"
            :rules="[{ required: true, message: 'Este campo es obligatorio' },
             { pattern: /^\d{4}-\d{4}$/, message: 'El formato debe ser 0000-0000' }
            ]"
        >
          <a-input v-model:value="formState.pdiPeriodo" :maxlength="9" placeholder="2000-2020"/>
        </a-form-item>
        <a-form-item
            label="Descripción"
            name="pdiDescripcion"
            :rules="[{ required: false, message: 'Este campo es obligatorio' }]"
        >
          <a-textarea v-model:value="formState.pdiDescripcion" placeholder="Descripción"/>
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
  update: Boolean,
  item: Object
})

onBeforeMount(() => {
  if (props.update) {
    formState.pdiNombre = props.item['pdiNombre']
    formState.pdiDescripcion = props.item['pdiDescripcion']
    formState.pdiPeriodo = props.item['pdiPeriodo']
  }
})

const formState = reactive({
  pdiDescripcion: null,
  pdiNombre: null,
  pdiPeriodo: null,
});

const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateDevelopmentPlan(values)
  } else {
    registerDevelopmentPlan(values)
  }
}


const registerDevelopmentPlan = (values) => {
  axiosInstance.post('/development-plan', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.pdiNombre = null
      formState.pdiDescripcion = null
      formState.pdiPeriodo = null
      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const updateDevelopmentPlan = (values) => {
  axiosInstance.put(`/development-plan/${props.item.pdiId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.pdiNombre = null
      formState.pdiDescripcion = null
      formState.pdiPeriodo = null
      emit('updateInfo')
      store.setLoader(false)
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