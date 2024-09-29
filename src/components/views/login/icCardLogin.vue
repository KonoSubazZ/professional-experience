<template>
  <div class="icCardType" v-loading="loading">
    <audio id="audioIC" :src="audioSrc"></audio>
    <div class="icCard_head">
      <span>请将您的读者证置于扫描区</span>
      <span style="margin-top: 10px">或将读者二维码对准识别框</span>
      <img src="../../../assets/image/ic_card_icon.png" />
    </div>
    <el-input
      type="textarea"
      v-model="icCode"
      @blur="getFocus"
      id="code-btn"
      style="opacity: 0"
    ></el-input>
  </div>
</template>
<script setup>
import pic from "@utils/image";
import { UserService } from "@api/request";
import { ElMessage } from "element-plus";
import filter from "@utils/filter";
import resetSetItem from "@utils/session";
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import hardware from "@api/hardwareDeviceApi";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const { ipcRenderer } = require("electron");
const init = hardware.init(); //将所有的这个关于读者卡的方法都导入进来
const store = useStore();
const router = useRouter();
const icCode = ref("");
const audioSrc = ref("");
const times = ref(null);
const loading = ref(false);
const Nindex = ref(0); //换行了几次
window.resetSetItem = resetSetItem;
let time = setTimeout(() => {
  console.log("准备出发");
  clearTimeout(time);
  router.push("/index");
}, 10000);
watch(
  icCode,
  (newValue, oldValue) => {
    if (!store.getters.getCabinetInfo.openCodeLogin) {
      return ElMessage.error("暂未开放扫码登录功能");
    }
    if (newValue && String(newValue).includes("\n")) {
      Nindex.value = Nindex.value + 1;
      if (Nindex.value == 1) {
        let icCodeValue = newValue;
        clearTimeout(times.value);
        times.value = setTimeout(() => {
          icCode.value = icCodeValue.replace(/\n/g, ""); //去掉自身的换行符
          icLogin();
        }, 1000);
      }

      // console.log('icCardLogin',newValue)
    }
  },
  { immediate: true }
);

const start = () => {
  clearTimeout(time);
  time = setTimeout(() => {
    console.log("准备出发");
    clearTimeout(time);
    router.push("/index");
  }, 10000);
  nextTick(() => {
    getFocus(); //先让这个input自动聚焦
  });
  setTimeout(() => {
    let status = init.readReaderCardTwo(); //这个方法如果是错误的那么就会返回601
    if (status !== 601) {
      ipcRenderer.on("readCardF750", (event, arg) => {
        console.log(arg, "----arg");
        if (typeof arg == "string") {
          icCode.value = arg;
          icLogin();
          init.stopReaderCardTwo(); //停止盘点
          if (!store.getters.getCabinetInfo.openCardLogin) {
            return ElMessage.error("暂未开放刷卡登录功能");
          }
          if (!store.getters.getCabinetInfo.openCodeLogin) {
            icLogin(arg);
          }
        }
      });
    } else {
      init.stopReaderCardTwo();
    }
    // 上面是新加的
    init.inventoryReadCard(); //盘点读者卡
    ipcRenderer.on("readCard", (event, arg) => {
      console.log(arg, "---arg");
      if (typeof arg == "string") {
        icCode.value = arg;
        init.stopReadCard(); //停止盘点
        if (!store.getters.getCabinetInfo.openCardLogin) {
          return ElMessage.error("暂未开放刷卡登录功能");
        }
        if (!store.getters.getCabinetInfo.openCodeLogin) {
          icLogin(arg);
        }
      } else {
        ElMessage.error("获取读者卡信息失败");
      }
    });
  }, 1500);
};

let timer = null;
let lock = false;

const dataConversion = (data) => {
  data = data.replace(/\s/g, "").replace(/(.{2})/g, "$1 ");
  data = data.split(" ").reverse().join("");
  return parseInt(data, 16);
};
const icLogin = (number) => {
  console.log(lock, "lock");
  if (lock) return;
  let p = /^[0-9a-zA-Z]*$/;

  let params = {
    readerNumber: dataConversion(icCode.value),
    platformId: String(store.getters.platform.platformId),
  };
  console.log(params.readerNumber, "转化后数据");
  loading.value = true;
  lock = true;
  UserService.icCardLogin(params)
    .then((res) => {
      if (res.code == 0) {
        store.dispatch("setUserInfo", res.data);
        resetSetItem("user", JSON.stringify(res.data));
        ElMessage.success(`登录成功，欢迎您 ${filter.hideName(res.data.name)}`);
        nextTick(() => {
          playAudio("login");
        });
        loading.value = false;
        clearTimeout(time);
        router.push(sessionStorage.getItem("path") || "/");
        sessionStorage.removeItem("path");
      } else {
        clearTimeout(time);
        time = setTimeout(() => {
          console.log("准备出发");
          clearTimeout(time);
          router.push("/index");
        }, 10000);
        ElMessage.error(res.message);

        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          start();
        }, 1000);
        loading.value = false;
        lock = false;
      }
    })
    .finally(() => {});
};

// icLogin()
const playAudio = (label) => {
  // let audio = document.getElementById("audioIC");
  let audio;
  try {
    audio = document.getElementById("audioIC");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioFaceDOM---try catch提前返回!!!"
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
// 刚开始的时候获取焦点，然后等他失去焦点的时候也会去获取焦点
const getFocus = () => {
  document.getElementById("code-btn").focus(); //先获取text的焦点
  document.getElementById("code-btn").select(); //然后再选取所有的文字
};
onUnmounted(() => {
  init.stopReadCard(); //停止盘点
  init.stopReaderCardTwo();
  ipcRenderer.removeAllListeners("readCard");
  clearTimeout(time);
  clearTimeout();
});
onMounted(() => {
  nextTick(() => {
    playAudio("ICaudio");
  });
  start();
});
</script>
<style lang="less" scoped>
.icCardType {
  .icCard_head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      margin-top: 115px;
      width: 300px;
      height: 200px;
    }

    span {
      font-size: 30px;
      letter-spacing: 2px;
      line-height: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }
}

:deep(.el-loading-mask) {
  left: 50% !important;
  top: 79% !important;
  transform: translate(-50%, -50%) !important;
  height: 891px !important;
  width: 1046px !important;
}

:deep(.circular) {
  width: 70px !important;
  height: 70px !important;
}

.search_btn {
  margin-top: 30px;
  padding: 15px;
  display: flex;
  justify-content: center;

  /deep/.el-button--primary {
    width: 100%;
    height: 80px;
    background: linear-gradient(-28deg, #6dd89b 0%, #98f1c7 100%);
    border: none;
    border-radius: 15px;
  }

  /deep/.el-button--primary span {
    letter-spacing: 2px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

.search_book {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 750px;
  position: relative;
}

.inputs {
  padding-left: 80px;
  height: 80px;
  width: 89%;
  font-size: 29px;
  outline: none;
  border: 1px solid #eee;
  border-radius: 10px;
}

.input img {
  position: absolute;
  left: 25px;
  top: 20px;
}
</style>
