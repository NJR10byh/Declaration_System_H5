import {ConfigEnv, loadEnv, UserConfig} from "vite";
import createVuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";

import path from "path";

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({mode}: ConfigEnv): UserConfig => {
    const {VITE_BASE_URL} = loadEnv(mode, CWD);
    return {
        base: VITE_BASE_URL,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },

        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        hack: `true; @import (reference) "${path.resolve("src/style/variables.less")}";`
                    },
                    math: "strict",
                    javascriptEnabled: true
                }
            }
        },

        plugins: [
            createVuePlugin(),
            vueJsx(),
            // viteMockServe({
            //   mockPath: 'mock',
            //   localEnabled: true,
            // }),
            svgLoader()
        ],

        server: {
            port: 3006,
            host: "localhost",
            proxy: {
                "/userReport": { /* 测试环境 */
                    target: "http://47.113.188.245:8900",
                    // 允许跨域
                    changeOrigin: true
                    // pathRewrite: { // 在发出请求后将 /userReport 替换为''空值，这样不影响接口请求
                    //   '^/userReport': ''
                    // }
                }
            }
        }
    };
};
