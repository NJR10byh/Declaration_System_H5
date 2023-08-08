import {createApp} from "vue";

import TDesign from "tdesign-mobile-vue";
import "tdesign-mobile-vue/es/style/index.css";

import {store} from "./store";
import router from "./router";
import "@/style/index.less";
import "./permission";
import App from "./App.vue";

const app = createApp(App);

app.use(TDesign);
app.use(store);
app.use(router);

app.mount("#app");
