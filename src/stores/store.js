import {defineStore} from 'pinia'

export const storeApp = defineStore('storeApp', {
    state: () => ({
        loader: false,
        user: null,
        isAdmin: false,
        isAuth: false,
        token: ""
    }),
    getters: {
        getUser(state) {
            return state.user
        },
        getAuth(state) {
            return state.isAuth;
        },
        getIsAdmin(state) {
            return state.isAdmin;
        },
        getLoader(state){
            return state.loader
        }
    },
    actions: {
        // any amount of arguments, return a promise or not
        setLoader(value) {
            this.loader = value
        },
        setUser(data) {
            this.user = data
        },
        setAuth(value) {
            this.isAuth = value;
        },
        setAdmin(value) {
            this.isAdmin = value;
        },
        setToken(value) {
            this.token = value;
        },
        login(token, user) {
            localStorage.setItem("token", token);
            this.setToken(token)
            this.setUser(user)
            this.setAuth(true)
        },
        logout() {
            localStorage.clear()
            this.setToken("")
            this.setUser(null)
            this.setAuth(false)
            this.setAdmin(false)
        }
    },
})