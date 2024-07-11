import {defineStore} from 'pinia'

export const storeApp = defineStore('storeApp', {
    state: () => ({
        loader: false,
        user: null,
        isAuth: false
    }),
    getters: {
        getUser(state) {
            return state.user
        },
        getAuth(state) {
            return state.isAuth;
        },
    },
    actions: {
        // any amount of arguments, return a promise or not
        setUser(data) {
            this.user = data
        },
        setAuth(boolean) {
            this.isAuth = boolean;
        },
    },
})