import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: [
                {
                    axios: [
                        // default imports
                        ["default", "axios"], // import { default as axios } from 'axios',
                    ],
                },
            ],
        }),
        // ...
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // css in js
                }),
            ],
        }),
    ],
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        "colorPrimary": "#dd4b39",
                        "link-color": "#0098D6",
                    },
                    javascriptEnabled: true,
                },
            },
        },
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/styles/main.scss";`,
            },
            less: {
                javascriptEnabled: true,
                modifyVars: {

                },
            },
        },
    },
});