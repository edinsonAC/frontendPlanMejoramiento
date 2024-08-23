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
            name="acueNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.acueNombre" placeholder="Nombre acuerdo"/>
        </a-form-item>
        <a-form-item
            label="Descripción"
            name="acueDescripcion"
            :rules="[{ required: false, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.acueDescripcion" placeholder="Descripción"/>
        </a-form-item>
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

const emit = defineEmits(['saveInfo', 'updateInfo'])
const props = defineProps({
  update: Boolean,
  item: Object
})
const store = storeApp()

const formState = reactive({
  acueNombre: null,
  acueDescripcion: null
});


onBeforeMount(() => {
  if (props.update) {
    formState.acueNombre = props.item['acueNombre']
    formState.acueDescripcion = props.item['acueDescripcion']
  }
})

const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateAgrement(values)
  } else {
    registerAgrement(values)
  }
}

const registerAgrement = (values) => {
  axiosInstance.post('/agrement', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.acueNombre = null
      formState.acueDescripcion = null
      emit('saveInfo')
      store.setLoader(false)
    }
  })
}

const updateAgrement = (values) => {
  axiosInstance.put(`/agrement/${props.item.acueId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.acueNombre = null
      formState.acueDescripcion = null
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