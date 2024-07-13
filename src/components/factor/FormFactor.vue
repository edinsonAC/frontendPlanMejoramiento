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
            label="Tipo Factor"
            name="tifaId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.tifaId" placeholder="Seleccione tipo factor">
            <a-select-option v-for="factorType in factorTypes" :key="factorType.tifaId" :value="factorType.tifaId">
              {{ factorType.tifaNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="factNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.factNombre" placeholder="Nombre programa academico"/>
        </a-form-item>
        <a-row type="flex" justify="space-around">
          <a-button type="primary" html-type="submit">Guardar</a-button>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import {reactive} from "vue";
import axiosInstance from "../../plugins/axios.js";
import {storeApp} from "../../stores/store.js";
import {openNotification} from "../../lib/util.js";

const store = storeApp()

const emit = defineEmits(['saveInfo'])
const props = defineProps({
  factorTypes: Array,
})

const formState = reactive({
  factNombre: null,
  tifaId: null,
});

const onFinish = values => {
  store.setLoader(true)
  axiosInstance.post('/factor', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.factNombre = null
      formState.tifaId = null
      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
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