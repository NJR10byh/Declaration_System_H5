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

        build: {
            outDir: 'dist_H5',//想要把dist修改成什么名字在这边改
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            }
        },

        server: {
            port: 3006,
            host: true,
            proxy: {
                "/userReport": { /* 测试环境 */
                    target: "http://120.24.253.160:8900",
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
