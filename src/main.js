import { createApp } from 'vue'
import { markRaw } from "vue";
import router from "./router";
import axiosInstance from './plugins/axios';
import { createPinia } from "pinia";
import './style.css'
import App from './App.vue'


const pinia = createPinia();
pinia.use(({ store }) => {
    store.$router = markRaw(router);
    const serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    };

    const fromStorage = serializer.deserialize(
        window.localStorage.getItem("piniaState")
    );

    if (fromStorage) store.$patch(fromStorage);

    store.$subscribe(
        (mutation, state) => {
            window.localStorage.setItem(
                "piniaState",
                serializer.serialize(
                    state.hasOwnProperty("storeApp") ? state.storeApp : state
                )
            );
        },
        {
            detached: true,
        }
    );
});

const app = createApp(App);
app.use(pinia);
app.use(router);

app.config.globalProperties.$axios = axiosInstance;

app.mount('#app')
