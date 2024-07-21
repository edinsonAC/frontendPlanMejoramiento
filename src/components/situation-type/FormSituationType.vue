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
            label="Nombre"
            name="tisiNombre"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-input v-model:value="formState.tisiNombre" placeholder="Nombre tipo situación"/>
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
  tisiNombre: null,
});

onBeforeMount(() => {
  if (props.update) {
    formState.tisiNombre = props.item['tisiNombre']
  }
})


const onFinish = values => {
  store.setLoader(true)
  if (props.update) {
    updateSituationType(values)
  } else {
    registerSituationType(values)
  }
}

const registerSituationType = (values) => {
  axiosInstance.post('/situation-type', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.tisiNombre = null
      emit('saveInfo')
      store.setLoader(false)
    }
  })
}

const updateSituationType = (values) => {
  axiosInstance.put(`/situation-type/${props.item.tisiId}`, values).then(res => {
    if (res.status == 200 || res.status == 201) {
      formState.tisiNombre = null
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