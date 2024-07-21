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
                openNotification("error", "Información", "No tienes permisos para continuar");
                store.logout();
                router.push('/login')
                break
            case 403:
                openNotification("error", "Información", "Se ha expirado la sesion.");
                store.logout();
                router.push('/login')
                break
            case 404:
                openNotification("error", "Información", msg);
                break
        }


        return response;
    },
    (error) => {
        const store = storeApp();
        store.setLoader(false);
        let resp = error.response;
        let msg = resp ? resp.data.error : 'Se ha producido un error.';
        let url = error.config ? error.config.url : '';
        let codeStatus = resp ? resp.status : 500;


        switch (codeStatus) {
            case 401:
                if (url != '/login' && url != '/login-admin') {
                    openNotification("error", "Información", "Se ha expirado la sesion.");
                    store.logout();
                    router.push('/login')
                } else {
                    openNotification("error", "Información", msg);
                }
                break
            case 403:
                openNotification("error", "Información", "Se ha expirado la sesion.");
                store.logout();
                router.push('/login')
                break
            case 404:
                openNotification("error", "Información", msg);
                break
            default:
                openNotification("error", "Información", msg);
                break
        }
        return Promise.reject(error);
    }
);

export default function () {
    return axiosInstance;
}
