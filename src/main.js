import {createApp} from 'vue'
import {markRaw} from "vue";
import router from "./router";
import {createPinia} from "pinia";
import './style.css'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import interceptor from "./lib/interceptor.js";


const CLIENT_ID_GOOGLE = import.meta.env.VITE_ID_CLIENT_GOOGLE;


const pinia = createPinia();
pinia.use(({store}) => {
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
app.use(interceptor);
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
    clientId: CLIENT_ID_GOOGLE
})

app.mount('#app')
