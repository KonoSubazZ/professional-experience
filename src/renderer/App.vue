<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// import { func } from "electron-edge-js";
export default {
  name: "electron-vue",
  mounted() {
   // this.init();
  },
  watch:{
    $route(val){
      console.log(this.$route.fullPath)
    }
  },
  methods: {
    init() {
      document.addEventListener(
        "keydown",
        function (event) {
          if (
            (event.ctrlKey === true || event.metaKey === true) &&
            (event.which === 61 ||
              event.which === 107 ||
              event.which === 173 ||
              event.which === 109 ||
              event.which === 187 ||
              event.which === 189)
          ) {
            event.preventDefault();
          }
        },
        false
      );
      document.addEventListener(
        "DOMMouseScroll",
        function (event) {
          if (event.ctrlKey === true || event.metaKey) {
            event.preventDefault();
          }
        },
        false
      );

      document.addEventListener("mousewheel", function (ev) {
        if (ev.ctrlKey) {
          ev.preventDefault();
          return false;
        }
      });

      // 禁止双指放大
      document.documentElement.addEventListener(
        "touchstart",
        function (event) {
          if (event.touches.length > 1) {
            event.preventDefault();
          }
        },
        false
      );
    },
  },
};
</script>

<style>
@import "~@/assets/less/common.less";
/* CSS */
body {
  margin: 0;
  overflow: hidden;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-active {
  opacity: 1;
}

.fade-leave-active {
  opacity: 0;
}
/* .fade-enter需要放在.fade-enter-active的后面 */
.fade-enter {
  opacity: 0;
}
</style>
