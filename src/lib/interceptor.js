import {openNotification} from "./util.js";
import axiosInstance from "../plugins/axios.js";
import {storeApp} from "../stores/store.js";
import router from "../router/index.js";
/*import constantes from "@/lib/constantes.js";*/


//HTTP request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const store = storeApp();
        let urlReq = config.url;

        if (!urlReq.includes("/login")) {
            if (localStorage.getItem("token")) {
                let token = localStorage.getItem("token");
                if (token) config.headers.Authorization = `${token}`;
            } else {
                store.logout();
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//HTTP response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        const store = storeApp();
        store.setLoader(false);

        //Not logged in or session expired
        let codeStatus = response.data.code
        let msg = response.data.message
        switch (codeStatus) {
            case 401:
                openNotification("error", "Información", "Se ha expirado la sesion.");
                store.logout();
                router.push('/')
                break
            case 404:
                openNotification("error", "Información", msg);
                break
        }


        return response;
    },
    (error) => {
        const store = storeApp();
        let resp = error.response;
        let msg = resp.data.error;
        let url = error.config.url;
        let codeStatus = resp.status

        store.setLoader(false);

        switch (codeStatus) {
            case 401:
                if (url != '/login' && url != '/login-admin') {
                    openNotification("error", "Información", "Se ha expirado la sesion.");
                    store.logout();
                } else {
                    openNotification("error", "Información", msg);
                }
                break
            case 404:
                openNotification("error", "Información", msg);
                break
        }
        return Promise.reject(error);
    }
);

export default function () {
    return axiosInstance;
}
