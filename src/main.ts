import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './store/index.ts'
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
const app = createApp(App)
// 注册 Vue3SeamlessScroll 组件
app.component("Vue3SeamlessScroll", Vue3SeamlessScroll);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
