import {createRouter, createWebHistory} from "vue-router";
import {storeApp} from "/src/stores/store.js"
import {parseJwt} from "/src/lib/util.js"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/authentication/LoginView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/login-admin",
            name: "login-admin",
            component: () => import("../views/authentication/LoginAdminView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/home",
            name: "home",
            meta: {requiresAuth: true}, // marcador de rutas protegidas
            component: () => import("../views/home/HomeView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/programa-academico",
            name: "programa-academico",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/AcademicProgramView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/factor",
            name: "factor",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/FactorView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/eje-estrategico",
            name: "eje-estrategico",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/AxisStrategicView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/linea-estrategica",
            name: "linea-estrategica",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/StrategicLineView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/programa-inversion",
            name: "programa-inversion",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/InvestmentProgramView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/proceso",
            name: "proceso",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/ProcessView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        {
            path: "/tipo-situacion",
            name: "tipo-situacion",
            meta: {requiresAuth: true},
            component: () => import("../views/administrator/SituationTypeView.vue"),
            beforeEnter: (to, from, next) => before(to, from, next)
        },
        /*
                       {
                           path: "/redireccionar",
                           name: "redirect",
                           component: () => import("../views/authentication/RedirectView.vue"),
                           beforeEnter: (to, from, next) => before(to, from, next)
                       },
                       */
        {
            path: "/:catchAll(.*)",
            component: () => import("../views/ErrorView.vue")
        }
    ]
});

async function before(to, from, next) {
    // const hasToken = await store.dispatch('hasToken');
    // next(hasToken ? { name: 'adminOrders' } : undefined);
    next();
}

router.beforeEach((to, from) => {
    // ✅ This will work because the router starts its navigation after
    // the router is installed and pinia will be installed too
    let routesAdmin = ["/reportes", "/licencias"];

    try {
        const store = storeApp();
        if (to.meta.requiresAuth && !store.isAuth) return "/login";

        if (to.fullPath == "/")
            return store.isAuth ? "/home" : "/login";

        if (
            (to.fullPath == "/login" || to.fullPath == "/login-admin") &&
            store.isAuth
        )
            return "/";

        if (routesAdmin.includes(to.fullPath))
            return "/";
    } catch (error) {
        console.log("Error ", error);
    }
});

export default router;
