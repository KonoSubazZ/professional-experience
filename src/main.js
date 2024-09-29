import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Video from "video.js";
import "video.js/dist/video-js.css";
import Vue from "vue";
import scroll from "vue-seamless-scroll";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/index.css";
import "./assets/font_ico/iconfont.css";
import imageSetting from "./utils/imageSetting";
import VueScroll from "@david-j/vue-j-scroll";
Vue.use(VueScroll);
import VueParticles from "vue-particles";
// import LazyLoad from '../src/components/lazyload' // 导入自定义指令
// Vue.directive('lazy', LazyLoad);
// 注册自定义指令

(Vue.prototype.$bis = null), //是哪个版本
  (Vue.prototype.$TY = imageSetting.TY), //通用版本的图
  (Vue.prototype.$DJ = imageSetting.DJ), //党建版本的图
  Vue.use(VueParticles);
Vue.prototype.$videos = Video;
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.use(scroll);


new Vue({
  strict: false,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
/**
 * 处理el-table的ResizeObserver loop limit exceeded问题
 */

const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
  
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}