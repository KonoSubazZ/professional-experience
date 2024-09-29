import { createApp } from "vue";
import router from "./router/index";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Elementplus from "element-plus";
import "element-plus/dist/index.css";
import "lib-flexible/flexible.js";
import dataTime from "./utils/dateTime";
import store from "./store";


import App from "./App.vue";
const app = createApp(App);
import "vue-keyboard-virtual-next/keyboard.min.css";
import KeyBoard from "vue-keyboard-virtual-next";
import "../public/tracking/build/tracking-min.js"
import "../public/tracking/build/data/face-min.js";
import "../public/tracking/build/data/mouth-min.js";
app.config.globalProperties.dataTime = dataTime; //挂载全局的方法
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router);
app.use(Elementplus);
app.use(store);
app.use(KeyBoard);
app.mount("#app");
