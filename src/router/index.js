import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/index.vue";
const { ipcRenderer } = require("electron");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/homesetting",
    name: "homesetting",
    component: () => import("../views/setting.vue"),
  },
  {
    path: "/jiaoyan",
    name: "jiaoyan",
    component: () => import("../views/jiaoYan.vue"),
  },

  {
    path: "/choose",
    name: "choose",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/choose/choose.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../components/choose/setting.vue"
      ),
  },
];

const router = new VueRouter({
  routes,
});

const whiteList = ["/jiaoyan"]
router.beforeEach((to, from, next) => {
  // 获取设备编号
  if (!localStorage.getItem("deviceInfoReceived")) {
    let data = ipcRenderer.sendSync("getDeviceInfo");
    localStorage.setItem("deviceInfoReceived", true); // 设置标记表示设备信息已接收
    localStorage.setItem("deviceInfo", JSON.stringify(data));
  }

  if (whiteList.includes(to.path)) {
    next()

  } else {
    const isCanPass = localStorage.getItem("SECRETKEY")
    // 没有设置密钥
    if (!isCanPass) {
      next("/jiaoyan"); 
    }else{
      next()
    }
  }
  // if (to.path !== "/jiaoyan") {
  //   if (!keypas) {
  //     if (!localStorage.getItem("deviceInfoReceived")) {
  //       let data = ipcRenderer.sendSync("getDeviceInfo");
  //       localStorage.setItem("deviceInfoReceived", true); // 设置标记表示设备信息已接收
  //       localStorage.setItem("deviceInfo", JSON.stringify(data));
  //     }
  //     next("/jiaoyan");
  //   } else {
  //     if (!localStorage.getItem("confirmVersion") && to.path !== "/homesetting") {
  //       next("/homesetting");
  //     } else {
  //       next();
  //     }
  //   }
  // } else {
  //   next()
  // }
});
export default router;
