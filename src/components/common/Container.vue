<template>
  <audio id="audioContainer" :src="audioSrc"></audio>
  <div id="well-container" ref="container" @touchmove="isDo1" @click="isDo1">

    <Head></Head>
    <router-view></router-view>
    <Footer></Footer>
    <div class="messageBox" v-if="isOutLogin" @click="closeDialog">
      <div class="content">
        <p>即将退出登录</p>
        <p class="time">{{ isOutLoginTime }}</p>
      </div>
    </div>
  </div>
</template>
<script>


import hardware from "@api/hardwareDeviceApi";
import pic from "@utils/image";
import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  defineComponent,
  watch,
  computed,
} from "vue";
import { debounce } from "@utils/debounce";
import { ElMessage, ElMessageBox } from "element-plus";
import Head from "./Head.vue";
import Footer from "./Footer.vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import resetSetItem from "@utils/session";
import { openRFIDReader, setLatticeList, sendExceptionSMSMAIL } from "@utils/read.js"
export default defineComponent({
  name: "WContainer",
  components: {
    Head,
    Footer,
  },
  props: {
    options: Object,
  },
  setup(ctx) {
    window.resetSetItem = resetSetItem;
    const init = hardware.init();
    const store = useStore();
    const router = useRouter();
    const doorStatus = store.getters.getStatus;
    const audioSrc = ref("");
    const userInfo = ref(null);
    const container = ref(null);
    //设置多久无人操作
    const clickTime = ref(null); //当前点击的时间
    let times = localStorage.getItem("standbyTime")
      ? Number(localStorage.getItem("standbyTime")) * 60 * 1000
      : 5 * 60 * 1000;
    // let times = store.getters.getCabinetInfo.caseWaitingInfo ? (store.getters.getCabinetInfo.caseWaitingInfo.time * 1000) : 300000;
    const responseTime = ref(times); //5分钟不响应自动跳转待机页
    const outLoginTimeOut = ref(null);
    const isOutLogin = ref(false);
    const isOutLoginTime = ref(5);
    const time = ref(null);
    const nowTime = ref(new Date());
    const audioTime = ref(null);
    const outTime = ref(null); // 30s自动退出timer
    const timeOut = ref(null); //点击后的定时器 退出到待机页timer

    const sterilizingLampStartTime = ref(null); //开始的消毒时间任务
    const sterilizingLampEndTime = ref(null); //结束的消毒时间任务
    const sterilizingLampOnceMoreTime = ref(null); //再次开启的定时器
    store.dispatch("setOutLoginTime", 30 * 1000);

    const standbyTimer = ref(null); // 待机页定时器timer
    const logoutTimer = ref(null); // 自动退出登录timer
    const showDialogTimer = ref(null); // 登出提示弹窗timer
    const countdownTimer = ref(null); // 倒计时循环timer
    //const startTime = ref(new Date()); // 进入页面时间
    //let endTime; // 进行操作的时间 每次触发屏幕的事件都会更新最新

    const isOperate = computed(() =>
      ["start"].includes(store.getters.getStatus)
    );
    // watch(store.getters.getStatus, () => {
    //   isDo1();
    // });
    watch(
      () => store.state.status,
      (newValue) => {
        isDo1();
      },
      { deep: true }
    );

    const { route } = useRoute();
    // 主要用来判读是否 退出登录 返回待机页等逻辑
    const isDo = () => {
      clearTimeout(outTime.value); // 待机页面
      // ----------------后加的消毒灯逻辑
      // 当点击屏幕立刻清空定时器,立刻停止消毒
      if (JSON.parse(localStorage.getItem("openLamp"))) {
        clearInterval(sterilizingLampOnceMoreTime.value);
        // 再次开启一个定时器,期限就是配置页再次开启的时间
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const startTime =
          (currentHour < 10 ? "0" + currentHour : currentHour.toString()) +
          ":" +
          (currentMinute < 10 ? "0" + currentMinute : currentMinute.toString());
        const startParts = startTime.split(":");
        const endParts = localStorage.getItem("endTime").split(":");
        const startTimeT = localStorage.getItem("startTime").split(":");
        const startTimeHour = parseInt(startTimeT[0]);
        const startTimeMinute = parseInt(startTimeT[1]);
        const startHour = parseInt(startParts[0]);
        const startMinute = parseInt(startParts[1]);
        const endHour = parseInt(endParts[0]);
        const endMinute = parseInt(endParts[1]);
        console.log(startHour * 60 + startMinute, "startHour--当前");
        console.log(
          startTimeHour * 60 + startTimeMinute,
          "startTimeHour---开始"
        );
        console.log(endHour * 60 + endMinute, "endHour---结束");
        if (
          startHour * 60 + startMinute >=
          startTimeHour * 60 + startTimeMinute &&
          startHour * 60 + startMinute <= endHour * 60 + endMinute
        ) {
          init.closeZYX();
          clearInterval(sterilizingLampStartTime.value);
          clearInterval(sterilizingLampEndTime.value);
        }
        // 计算时间间隔（以分钟为单位）
        let intervalMinutes =
          endHour * 60 + endMinute - (startHour * 60 + startMinute);
        sterilizingLampOnceMoreTime.value = setInterval(() => {
          if (intervalMinutes > Number(localStorage.getItem("reactivation"))) {
            init.openZYX();
            sterilizingLampEnd();
          }
          clearInterval(sterilizingLampOnceMoreTime.value);
        }, Number(localStorage.getItem("reactivation")) * 60000);
      }
      // ----------------------------------------
      clickTime.value = new Date(); //设置点击时间为当前时间
      // if (nowTime.value - clickTime.value <= responseTime.value) {
      //   //如果距离上次点击小于要求时间
      //   clearTimeout(timeOut.value);
      // }

      // if (clickTime.value - nowTime.value <= responseTime.value) {
      //   //如果距离上次点击小于要求时间
      //   clearTimeout(timeOut.value);
      // }

      // if (clickTime.value - nowTime.value <= 1000 * 60 * 2) {
      //   //如果距离上次点击小于要求时间
      //   clearTimeout(outLoginTimeOut.value);
      // }

      // 是否退出到待机页 -- 借还书页面 不会退出

      if (!["/borrow", "/return"].includes(route.path)) {
        timeOut.value = setTimeout(() => {
          store.dispatch("setUserInfo", {});
          resetSetItem("user", JSON.stringify({}));
          router.push("/standby"); //跳转到待机页面
        }, responseTime.value);
      }
      /*
      timeOut.value =
        !timeOut.value &&
        setTimeout(() => {
          if (
            window.location.href.indexOf("borrow") == -1 ||
            window.location.href.indexOf("return") == -1
          ) {
            store.dispatch("setUserInfo", {});
            resetSetItem("user", JSON.stringify({}));
            router.push("/standby"); //跳转到待机页面
          }
          // clearTimeout(timeOut.value);
        }, responseTime.value);
      */
      window.addEventListener("setItem", () => {
        userInfo.value = JSON.parse(sessionStorage.getItem("user"));
        // doorStatus.value = sessionStorage.getItem('lockStatus');
      });

      // 倒计时退出登录逻辑
      outTime.value =
        !outTime.value &&
        setTimeout(() => {
          // 正在盘点过程中 不能退出
          console.log(
            store.getters.getStatus,
            "store.getters.getStatus---------"
          );
          console.log(isOperate.value, "isOperate.value----------------");
          if (!isOperate.value) return;

          if (JSON.stringify(userInfo.value) !== "{}" || userInfo.value.id) {
            outLoginTimeOut.value = setTimeout(() => {
              nextTick(() => {
                playAudio("timeOut");
              });
              audioTime.value = setTimeout(() => {
                isOutLogin.value = true;
                clearTimeout(outLoginTimeOut.value);
                time.value = setInterval(() => {
                  isOutLoginTime.value--;
                  if (isOutLoginTime.value < 0) {
                    isOutLoginTime.value = 5;
                    isOutLogin.value = false;
                    store.dispatch("setUserInfo", {});
                    resetSetItem("user", JSON.stringify({}));
                    console.log(
                      JSON.parse(sessionStorage.getItem("user")),
                      "退出登录的地方"
                    );
                    router.push("/index");
                    ElMessage.success("已退出登录");
                    removeListener();
                    clearTimeout(audioTime.value);
                    clearInterval(time.value); //清空定时器
                    clearTimeout(outTime.value);
                  }
                }, 1000);
              }, 5000);
            }, store.state.outLoginTime);
          }
        }, 1000);
      //如果登录的话
    };

    const isDo1 = () => {
      // 清除待机页 和 自动退出登录 逻辑
      standbyTimer.value && clearTimeout(standbyTimer.value);
      logoutTimer.value && clearTimeout(logoutTimer.value);
      showDialogTimer.value && clearTimeout(showDialogTimer.value);
      countdownTimer.value && clearInterval(countdownTimer.value);

      // ----------------后加的消毒灯逻辑
      // 当点击屏幕立刻清空定时器,立刻停止消毒
      if (JSON.parse(localStorage.getItem("openLamp"))) {
        clearInterval(sterilizingLampOnceMoreTime.value);
        // 再次开启一个定时器,期限就是配置页再次开启的时间
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const startTime =
          (currentHour < 10 ? "0" + currentHour : currentHour.toString()) +
          ":" +
          (currentMinute < 10 ? "0" + currentMinute : currentMinute.toString());
        const startParts = startTime.split(":");
        const endParts = localStorage.getItem("endTime").split(":");
        const startTimeT = localStorage.getItem("startTime").split(":");
        const startTimeHour = parseInt(startTimeT[0]);
        const startTimeMinute = parseInt(startTimeT[1]);
        const startHour = parseInt(startParts[0]);
        const startMinute = parseInt(startParts[1]);
        const endHour = parseInt(endParts[0]);
        const endMinute = parseInt(endParts[1]);
        console.log(startHour * 60 + startMinute, "startHour--当前");
        console.log(
          startTimeHour * 60 + startTimeMinute,
          "startTimeHour---开始"
        );
        console.log(endHour * 60 + endMinute, "endHour---结束");
        if (
          startHour * 60 + startMinute >=
          startTimeHour * 60 + startTimeMinute &&
          startHour * 60 + startMinute <= endHour * 60 + endMinute
        ) {
          init.closeZYX();
          clearInterval(sterilizingLampStartTime.value);
          clearInterval(sterilizingLampEndTime.value);
        }
        // 计算时间间隔（以分钟为单位）
        let intervalMinutes =
          endHour * 60 + endMinute - (startHour * 60 + startMinute);
        sterilizingLampOnceMoreTime.value = setInterval(() => {
          if (intervalMinutes > Number(localStorage.getItem("reactivation"))) {
            init.openZYX();
            sterilizingLampEnd();
          }
          clearInterval(sterilizingLampOnceMoreTime.value);
        }, Number(localStorage.getItem("reactivation")) * 60000);
      }
      window.addEventListener("setItem", () => {
        userInfo.value = JSON.parse(sessionStorage.getItem("user"));
        // doorStatus.value = sessionStorage.getItem('lockStatus');
      });
      // 用户在借还书页面 以及柜门开启操作状态 不能自动退出和进入待机页
      console.log(isOperate.value, "---isOperate container---");
      // if (!["#/borrow", "#/return"].includes(path) && isOperate.value) {
      if (isOperate.value) {
        // console.log( responseTime.value,' responseTime.value');
        standbyTimer.value = setTimeout(() => {
          // 清空信息 调转到待机页
          store.dispatch("setUserInfo", {});
          resetSetItem("user", JSON.stringify({}));
          console.log("router.push()");
          router.push("/standby");
        }, responseTime.value);

        // 用户已登录才会进行登出操作
        // if (JSON.stringify(userInfo.value) !== "{}" || userInfo.value.id) {
        const userInfo = sessionStorage.getItem("user");
        // 未登录

        if (userInfo == "{}" || !userInfo) return;
        logoutTimer.value = setTimeout(() => {
          //播放音频
          playAudio("timeOut");

          // 5秒后展示弹窗
          showDialogTimer.value = setTimeout(() => {
            isOutLogin.value = true;
            // 五秒倒计时
            countdownTimer.value = setInterval(() => {
              isOutLoginTime.value--;
              if (isOutLoginTime.value < 0) {
                isOutLoginTime.value = 5;
                isOutLogin.value = false;
                store.dispatch("setUserInfo", {});
                resetSetItem("user", JSON.stringify({}));
                router.push("/index");
                ElMessage.success("已退出登录");
                removeListener();
                // clearTimeout(audioTime.value);
                clearInterval(countdownTimer.value); //清空定时器
                // clearTimeout(outTime.value);
              }
            }, 1000);
          }, 5 * 1000);
        }, store.state.outLoginTime);
      }
      // }
    };
    const closeDialog = () => {
      removeListener();
      // clearTimeout(audioTime.value);
      // clearTimeout(outLoginTimeOut.value);
      // clearInterval(time.value); //清空定时器
      isOutLogin.value = false;
      isOutLoginTime.value = 5;
      nowTime.value = new Date();
    };

    const playAudio = (label) => {
      let audio;
      try {
        audio = document.getElementById("audioContainer");
      } catch (error) {
        console.log(
          "这里是因为异步settimeout导致没有获取到dom---try catch提前返回!!!"
        );
        return;
      }
      audio.addEventListener("canplay", () => {
        console.log("加载成功");
        audio.play();
      });
      audio.addEventListener("play", () => {
        console.log("播放成功");
      });

      if (!label) {
        audio.pause();
        audioSrc.value = "";
      } else {
        audioSrc.value = pic[label];
      }
    };

    const removeListener = () => {
      let audio;
      try {
        audio = document.getElementById("audioContainer");
      } catch (error) {
        console.log(
          "这里是因为异步settimeout导致没有获取到audioContainerDOM---try catch提前返回!!!"
        );
        return;
      }
      audio.removeEventListener("canplay", playAudio());
    };

    const refName = "WellContainer";
    // 屏幕宽度
    const width = ref(0);
    // 屏幕高度
    const height = ref(0);
    // 原始屏幕宽度
    const originalWidth = ref(0);
    // 原始屏幕高度
    const originalHeight = ref(0);
    // 控制显示
    const ready = ref(false);
    /*
     * dom:well-container的dom
     * observer: window.MutationObserver(Bom实例)监听dom改变
     */
    let dom, observer;

    //设置初始值
    const initSize = () => {
      return new Promise((resolve) => {
        nextTick(() => {
          dom = document.getElementById("well-container");
          // 获取大屏的传入尺寸
          if (ctx.options && ctx.options.width && ctx.options.height) {
            //传入宽高
            width.value = ctx.options.width;
            height.value = ctx.options.height;
          } else {
            //可见宽高
            width.value = 1080;
            height.value = 1920;
          }
          // 获取画布尺寸
          if (!originalWidth.value || !originalHeight.value) {
            //屏幕分辨率宽高
            originalWidth.value = window.screen.width;
            originalHeight.value = window.screen.height;
          }
          resolve();
        });
      });
    };

    const updateSize = () => {
      if (width.value && height.value) {
        dom.style.width = `${width.value}px`;
        dom.style.height = `${height.value}px`;
      } else {
        dom.style.width = `${originalWidth.value}px`;
        dom.style.height = `${originalHeight.value}px`;
      }
    };

    const updateScale = () => {
      // 获取真实的视口尺寸
      const currentWidth = document.body.clientWidth;
      const currentHeight = document.body.clientHeight;
      // 获取大屏最终的宽高
      const realWidth = width.value || originalWidth.value;
      const realHeight = height.value || originalHeight.value;
      // console.log(currentWidth, currentHeight)
      // 缩放比例  = 分辨率宽高 / 传入宽高(可视宽高)
      const widthScale = currentWidth / realWidth;
      const heightScale = currentHeight / realHeight;
      //如果dom存在,就按照比例缩放
      dom && (dom.style.transform = `scale(${widthScale}, ${heightScale})`);
    };

    //重置缩放比例
    const onResize = async () => {
      await initSize();
      updateScale();
    };

    const initMutationObserver = () => {
      //监听元素属性变化
      const MutationObserver = window.MutationObserver;
      //如果变化,就用onResize重置屏幕所缩放比例
      observer = new MutationObserver(onResize);
      observer.observe(dom, {
        attributes: true,
        attributeFilter: ["style"],
        attributeOldValue: true,
      });
    };
    //移除监听属性
    const removeMutationObserver = () => {
      if (observer) {
        observer.disconnect();
        observer.takeRecords();
        observer = null;
      }
    };
    // 开启定时器对比开启消毒灯的时间,如果一样那么久开启消毒灯
    const sterilizingLampStart = () => {
      // console.log(localStorage.getItem("endTime"), "----endTime");
      // console.log(localStorage.getItem("startTime"), "----startTime");
      // 获取开始时间和结束时间
      clearInterval(sterilizingLampStartTime.value);
      sterilizingLampStartTime.value = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const startTime =
          (currentHour < 10 ? "0" + currentHour : currentHour.toString()) +
          ":" +
          (currentMinute < 10 ? "0" + currentMinute : currentMinute.toString());
        console.log(startTime, "---startTime");
        if (localStorage.getItem("startTime") == startTime) {
          console.log("开始消毒了");
          init.openZYX();
          // 开启结束时间的任务,到了结束时间后结束紫外灯
          sterilizingLampEnd();
        }
      }, 5000);
    };
    const sterilizingLampEnd = () => {
      clearInterval(sterilizingLampStartTime.value);
      clearInterval(sterilizingLampEndTime.value);
      sterilizingLampEndTime.value = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const endTime =
          (currentHour < 10 ? "0" + currentHour : currentHour.toString()) +
          ":" +
          (currentMinute < 10 ? "0" + currentMinute : currentMinute.toString());
        console.log(endTime, "---endTime");
        if (localStorage.getItem("endTime") == endTime) {
          console.log("结束消毒了");
          init.closeZYX();
          clearInterval(sterilizingLampEndTime.value);
        }
      }, 5000);
    };
    onMounted(async () => {

      isDo1();
      //如果停机维护的话
      if (
        store.getters.getCabinetInfo &&
        store.getters.getCabinetInfo.status == 2
      ) {
        return router.push("/standby");
      }
      store.dispatch("setDoorStatus", "关");
      // 连接读者卡
      init.openReadCard();
      init.connectLight();

      /*
      let openData = init.open(store.getters.platform.info.rfidIP); //打开读写板连接
      console.log(openData, '----0-openData--7-----');
      */

      // 连接读写版 封装方法增加失败重连
      const maxAttempts = 3;
      const isConnected = openRFIDReader(() => init.open(store.getters.platform.info.rfidIP), maxAttempts);
      // 在这里处理无法成功打开连接的情况
      if (!isConnected) {
        ElMessage({
          type: 'warning',
          message: '设备状态异常，暂时无法使用，请联系管理员!',
        })

        document.getElementById("well-container").addEventListener('click', function (event) {
          ElMessageBox.confirm(
            '设备状态异常，暂时无法使用，请联系管理员',
            '警告',
            {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              // icon: markRaw(Delete),
            }
          )
          event.preventDefault();
          event.stopPropagation();
        }, true);

        // sendmail
        sendExceptionSMSMAIL(store.getters.platform.id, 1, 0);
        setTimeout(() => {
          router.push("/standby");
        }, 60 * 1000)
      }




      if (JSON.parse(localStorage.getItem("openLamp"))) {
        sterilizingLampStart(); //消毒灯的执行
      } else {
        clearInterval(sterilizingLampStartTime.value);
        clearInterval(sterilizingLampEndTime.value);
        clearInterval(sterilizingLampOnceMoreTime.value);
      }
      setTimeout(() => {
        init.openLight();

        // 开启消毒灯
        // init.openZYX();
      }, 1500);
      ready.value = false;

      await initSize();
      updateSize();
      updateScale();
      window.addEventListener("resize", debounce(10, onResize));
      initMutationObserver();
      ready.value = true;

      // 生成柜门记录
      setLatticeList()
    });

    onUnmounted(() => {
      init.closeLight();
      setTimeout(() => {
        init.close();
      }, 1000); //断开读者板连接
      setTimeout(() => {
        init.closeConnectLight();
      }, 1500);
      window.removeEventListener("resize", onResize);
      removeMutationObserver();
    });

    return {
      audioSrc,
      isOutLoginTime,
      isOutLogin,
      refName,
      ready,
      // isDo,
      closeDialog,
      isDo1,
    };
  },
});
</script>
<style>
#well-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  background: linear-gradient(135.48deg,
      rgba(249, 154, 132, 1) 0%,
      rgba(245, 235, 202, 1) 100%);
  transform-origin: left top;
  overflow: hidden;
  transition: 0.3s;
}

.messageBox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0, 0.5);
}

.messageBox .content {
  width: 500px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}

.content p {
  font-size: 40px;
  margin: 15px;
}

.content .time {
  font-size: 70px !important;
  text-align: center;
  line-height: 240px;
  color: #61ca74;
}
</style>