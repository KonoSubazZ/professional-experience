import Vue from "vue";

import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import {ipcRenderer} from "electron"
import {
  MessageBox
} from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
import global_func from "./api/global_func";
import axios from "./api/request";
import filters from "./api/filters"
import filter from "./api/filter"
import {message} from './store/resetMessage'

// if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.$func = global_func;
Vue.prototype.$axios = axios;
Vue.prototype.$filter = filter;
Vue.prototype.$bus = new Vue();
ipcRenderer.on("init",(data)=>{
  console.log("initData",data)
})

for (let k in filters) {
  Vue.filter(k, filters[k])
}
Vue.use(ElementUI);
Vue.prototype.$hint = message;

const errorHandler = (error, vm) => {
  console.log(error, vm)
  store.dispatch('add_to_error_log', JSON.stringify(error))
  global_func.toast({
    content: "系统出现错误，请联系管理员",
    type: "ERROR"
  })
  return
}
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this)
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
