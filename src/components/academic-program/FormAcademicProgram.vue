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
            label="Código"
            name="pracCodigo"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.pracCodigo" placeholder="Código"/>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="pracNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.pracNombre" placeholder="Nombre programa academico"/>
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
  pracNombre: null,
  pracCodigo: null,
});

onBeforeMount(() => {
  if (props.update) {
    formState.pracNombre = props.item['pracNombre']
    formState.pracCodigo = props.item['pracCodigo']
  }
})


const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateProgramAcademic(values)
  } else {
    registerProgramAcademic(values)
  }
}

const registerProgramAcademic = (values) => {
  axiosInstance.post('/academic-program', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.pracNombre = null
      formState.pracCodigo = null
      emit('saveInfo')
      store.setLoader(false)
    }
  })
}

const updateProgramAcademic = (values) => {
  axiosInstance.put(`/academic-program/${props.item.pracId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.pracNombre = null
      formState.pracCodigo = null
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