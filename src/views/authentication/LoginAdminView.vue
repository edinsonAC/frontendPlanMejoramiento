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
                 :style="{ display: 'flex', justifyContent: 'center', marginBottom: '5%' }">
            <img src='../../assets/images/logo_ufps.png' width="300"/>
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
                  name="usuario"
                  :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
              >
                <a-input v-model:value="formState.usuario" placeholder="Usuario"/>
              </a-form-item>
              <a-form-item
                  name="password"
                  :rules="[{ required: true, message: 'Este campo es obligatorio' }]"
              >
                <a-input-password v-model:value="formState.password" placeholder="Contraseña"/>
              </a-form-item>
              <a-row type="flex" justify="space-around">
                <a-button type="primary" html-type="submit">Iniciar Sesión</a-button>
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
  usuario: null,
  password: null,
});


const onFinish = values => {
  console.log("???? ", values)
  store.setLoader(true)

  axiosInstance.post("/login-admin", values).then(res => {
    if (res.status == 200) {
      let token = res.data.token
      store.setAdmin(true)
      store.login(token, {"usuaNombre": 'ADMIN'})
      router.push("/")
    }
  }).catch(err => {
    console.log(" ----?? ")
  })
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