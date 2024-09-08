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
            label="Plan de desarrollo Institucional PDI"
            name="pdiId"
            :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
        >
          <a-select v-model:value="formState.pdiId" placeholder="Seleccione PDI">
            <a-select-option v-for="pdi in developmentPlansFiltered" :key="pdi.pdiId" :value="pdi.pdiId">
              {{ pdi.pdiNombre }}
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
          <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
            <a-form-item label="Año inicio"
                         name="plmeAnioInicio"
                         :rules=" [{type: 'object',required: true,message: 'Este campo es obligatorio',}]"
            >
              <a-date-picker v-model:value="formState.plmeAnioInicio" picker="year"/>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
            <a-form-item label="Semestre Inicio"
                         name="plmeSemestreInicio"
                         :rules=" [{required: true,message: 'Este campo es obligatorio',}]"
            >
              <a-select v-model:value="formState.plmeSemestreInicio" placeholder="Semestre">
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
        <a-row type="flex" justify="space-around">
          <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
            <a-form-item label="Año final"
                         name="plmeAnioFin"
                         :rules=" [{type: 'object',required: true,message: 'Este campo es obligatorio',}]"
            >
              <a-date-picker v-model:value="formState.plmeAnioFin" picker="year"/>
            </a-form-item>
          </a-col>
          <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
            <a-form-item label="Semestre final"
                         name="plmeSemestreFin"
                         :rules=" [{required: true,message: 'Este campo es obligatorio',}]"
            >
              <a-select v-model:value="formState.plmeSemestreFin" placeholder="Semestre">
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
        <a-row type="flex" justify="space-around">
          <a-button type="primary" html-type="submit">{{ update ? 'Guardar' : 'Registrar' }}</a-button>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import {computed, onBeforeMount, reactive} from "vue";
import axiosInstance from "../../plugins/axios.js";
import {storeApp} from "../../stores/store.js";
import {openNotification} from "../../lib/util.js";

const store = storeApp()

const emit = defineEmits(['saveInfo', 'updateInfo'])

const props = defineProps({
  developmentPlans: Array,
  programs: Array,
  update: Boolean,
  item: Object
})

onBeforeMount(() => {
  if (props.update) {
    formState.plmeNombre = props.item['plmeNombre']
    formState.pracId = store.isAdmin ? props.item['pracId'] : store.user.pracId
    formState.pdiId = props.item['pdiId']
    formState.plmeAnioInicio = props.item['plmeAnioInicio']
    formState.plmeAnioFin = props.item['plmeAnioFin']
    formState.plmeSemestreInicio = props.item['plmeSemestreInicio']
    formState.plmeSemestreFin = props.item['plmeSemestreFin']
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
  plmeNombre: null,
  pracId: null,
  rangeDuration: null,
  pdiId: null,
  plmeSemestreInicio: null,
  plmeSemestreFin: null,
});

const onFinish = values => {
  const year1 = values.plmeAnioInicio.format('YYYY')
  const year2 = values.plmeAnioFin.format('YYYY')

  values.plmeAnioInicio = year1
  values.plmeAnioFin = year2

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
      formState.plmeAnioInicio = null
      formState.plmeAnioFin = null
      formState.plmeSemestreInicio = null
      formState.plmeSemestreFin = null
      formState.pdiId = null
      emit('saveInfo')
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification('error', 'Atención', 'Se ha producido un error.')
  })
}

const updateInvestmentProgram = (values) => {
  axiosInstance.put(`/improvement-plan/${props.item.plmeId}`, values).then(res => {
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