<template>
  <div class="container-login">
    <a-row align="middle" justify="space-around" type="flex">
      <a-col :xs="23" :sm="23" :md="12" :lg="12" :xl="12">
        <a-row
            :style="{ background: 'linear-gradient(335deg, rgba(193,193,193,1) 1%, rgba(249,243,243,1) 60%)', borderRadius: '10px',padding: '10px' }"
            type="flex"
            justify="center">
          <a-col :xs="20" :sm="20" :md="24" :lg="24" :xl="24">
            <h3 :style="{ textAlign: 'center', color: 'black' }">
              Seguimiento y Gestión Plan De Mejoramiento
            </h3>
          </a-col>
          <a-col :xs="20" :sm="20" :md="24" :lg="24" :xl="24"
                 :style="{ display: 'flex', justifyContent: 'center' }">
            <img src='../../assets/images/logo.png' width="600"/>
          </a-col>
          <a-col :xs="20" :sm="20" :md="18" :lg="18" :xl="18">
            <a-form
                :model="formState"
                name="basic"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
              <a-form-item
                  name="pracId"
                  :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
              >
                <a-select v-model:value="formState.pracId" placeholder="Programa acádemico">
                  <a-select-option v-for="program in academicPrograms" :key="program.pracId" :value="program.pracId">
                    {{ program.pracNombre }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item
                  name="tiusId"
                  :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
              >
                <a-select v-model:value="formState.tiusId" placeholder="Seleccione un rol">
                  <a-select-option v-for="userType in userTypes" :key="userType.tiusId" :value="userType.tiusId">
                    {{ userType.tiusNombre }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-row v-if="formState.pracId != null && formState.tiusId != null" type="flex" justify="space-around">
                <GoogleLogin :callback="callback"/>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import axiosInstance from "../../plugins/axios.js";
import {reactive, onBeforeMount, ref} from 'vue';
import {openNotification} from "../../lib/util.js";
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";

const store = storeApp()
const formState = reactive({
  pracId: null,
  tiusId: null,
});

const academicPrograms = ref([]);
const userTypes = ref([]);
onBeforeMount(() => {
  store.setLoader(true)
  getAcademicPrograms()
  getUserTypes()
})

const getAcademicPrograms = () => {
  axiosInstance("/academic-program").then(res => {
    if (res.status) {
      academicPrograms.value = res.data
      store.setLoader(false)
    }
  }).catch(err => {
    openNotification("error", 'Atención', 'Se ha producido un error con los programas académicos.')
  })
};

const getUserTypes = () => {
  axiosInstance("/user-type").then(res => {
    userTypes.value = res.data
  }).catch(err => {
    openNotification("error", 'Atención', 'Se ha producido un error con los programas académicos.')
  })
};

const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  if (response) {
    let body = {
      token: response.credential,
      tiusId: formState.tiusId,
      pracId: formState.pracId,
    }
    login(body)
  } else {
    openNotification("error", 'Atención', 'Se ha producido un error.')
  }
}

const login = (values) => {
  store.setLoader(true)
  axiosInstance.post("/login", values).then(res => {
    if (res.status == 200) {
      let token = res.data.token
      let user = res.data.usuario
      store.setAdmin(false)
      store.login(token, user)
      router.push("/plan-mejoramiento")
    }
  })
};

const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

</script>


<style scoped>

.container-login {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  background: #dd4b39;
}

.container-login > div {
  width: 100% !important;
}


</style>