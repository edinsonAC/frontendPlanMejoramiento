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
        <a-form-item v-if="store.isAdmin"
                     label="Programa académico"
                     name="pracId"
                     :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.pracId" placeholder="Seleccione Programa Académico">
            <a-select-option v-for="program in programs" :key="program.pracId" :value="program.pracId">
              {{ program.pracNombre }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="Nombre"
            name="plmeNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.plmeNombre" placeholder="Nombre plan mejoramiento"/>
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
  programs: Array,
  update: Boolean,
  item: Object
})

onBeforeMount(() => {
  if (props.update) {
    formState.plmeNombre = props.item['plmeNombre']
    formState.pracId = store.isAdmin ? props.item['pracId'] : store.user.pracId
  }
})

const formState = reactive({
  plmeNombre: null,
  pracId: null,
});

const onFinish = values => {
  store.setLoader(true)
  if (!store.isAdmin) values['pracId'] = store.user.pracId

  if (props.update) {
    updateInvestmentProgram(values)
  } else {
    registerInvestmentProgram(values)
  }
}


const registerInvestmentProgram = (values) => {
  axiosInstance.post('/improvement-plan', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.plmeNombre = null
      formState.pracId = null
      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const updateInvestmentProgram = (values) => {
  axiosInstance.put(`/improvement-plan/${props.item.pracId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.plmeNombre = null
      formState.pracId = null
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