<template>
  <div class="head" style="height: 700px">
    <!-- 进配置页弹框  -->
    <div style="
        display: flex;
        z-index: 1000;
        align-items: center;
        justify-content: center;
        background-color: var(--el-overlay-color-lighter);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
      " v-if="dialogTableVisible">
      <div style="
          padding: 20px;
          box-sizing: border-box;
          width: 500px;
          height: 300px;
          border-radius: 10px;
          background-color: white;
        ">
        <div style="
            height: 60px;
            display: flex;
            justify-content: center;
            font-size: 29px;
          ">
          管理员密码
        </div>
        <div style="margin-top: 50px">
          <el-input ref="adminText" id="adminText" data-mode @click.stop type="password" show-password style="
              border: 1px solid #ccc;
              height: 40px !important;
              font-size: 12px !important;
            " v-model="inputInfo.adminText"></el-input>
          <div style="
              margin: 30px;
              margin-top: 50px;
              display: flex;
              align-items: center;
              justify-content: space-evenly;
            ">
            <el-button type="primary" @click="saveExe">确认</el-button>
            <el-button @click="(dialogTableVisible = false), (inputInfo.adminText = '')">
              取消
            </el-button>
          </div>
        </div>
      </div>
      <Key-Board id="sss" @change="keyChange" :blurHide="false" :color="'#06f'" />
    </div>
    <audio id="audioOutLogin" :src="audioSrc"></audio>
    <div class="head_top" style="height: 575px">
      <div class="title">
        <!-- <img  src="../../assets/image/head.png" @click="goSetting"> -->
        <p style="
            font-size: 40px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(255, 145, 89, 1);
          " @click.stop="goSetting">
          {{ title || "24h图书借还书柜" }}
        </p>
        <div class="time" style="position: absolute; left: 50%; transform: translateX(-50%)">
          <span>
            {{ dateHours }}
          </span>
        </div>
        <div class="time">
          <p style="
              height: 100%;
              display: flex;
              align-items: center;
              margin-right: 10px;
            ">
            <i style="font-size: 50px; color: #ff9159" :class="`qi-${icoWeather}`"></i>
          </p>
          <div style="display: flex; align-items: center; flex-direction: column" class="time_right">
            <p>
              {{ thermal.text }}
              {{ `${thermal.temp ? thermal.temp : "-7"}℃` }}
            </p>
            <p>{{ dateDay }}</p>
          </div>
        </div>
      </div>
      <el-carousel indicator-position="none" :interval="3000" :autoplay="autoplay" @change="getIndex">
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <videoPlay v-if="!item.img" :src="item.video" :ref="'videoPlayer' + index" id="myVideo" width="100%"
            height="478px" aspectRatio="16:9" preload="auto" :loop="false" :fluid="true" :muted="true"
            :webFullScreen="false" :autoPlay="true" :control="false" :playsinline="true" @play="onPlay"
            @ended="onEnded" />
          <img v-else class="el_img" :src="item.img" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="head_bottom" style="padding: 74px 10px" v-if="true">
      <div class="back" v-if="route !== 'index' && route !== 'managerBook'">
        <img src="../../assets/image/back.png" />
        <span @click="goBack">{{ backText }}</span>
      </div>
      <div class="langs" v-if="route == 'index' || route == 'managerBook'">
        <!--          <img src="../../assets/image/langs.png">-->
        <!--          <span>中文</span>-->
      </div>
      <div class="headText">
        <span>{{ headText }}</span>
      </div>

      <div class="gologin" v-if="route != 'login' && JSON.stringify(userInfo) == '{}'">
        <img src="../../assets/image/login.png" />
        <span @click="goLogin">请登录</span>
      </div>
      <div class="outlogin" v-if="JSON.stringify(userInfo) != '{}'">
        <img src="../../assets/image/edit.png" />
        <span @click="outLogin">退出登录</span>
      </div>
    </div>
    <Key-Board @change="keyChange" :blurHide="false" :color="'#06f'" />
  </div>
</template>
<script>
import {
  getCurrentInstance,
  defineComponent,
  reactive,
  ref,
  toRaw,
  onUnmounted,
  nextTick,
  computed,
  watch,
} from "vue";
import pic from "@utils/image";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { videoPlay } from "vue3-video-play";
import "vue3-video-play/dist/style.css";
import { otherInterface } from "@api/request";
import resetSetItem from "@utils/session";
import axios from "axios";
export default defineComponent({
  components: { videoPlay },
  computed: {
    route() {
      return this.$route.name;
    },
    headText() {
      return this.$store.getters.getHead_text;
    },
    backText() {
      return this.$route.name == "login" ? "取消登录" : "返回";
    },
  },
  setup() {
    window.resetSetItem = resetSetItem;
    const audioSrc = ref("");
    const store = useStore();
    const router = useRouter();
    const title = ref(store.getters.platform.title);
    const {
      appContext: {
        config: { globalProperties },
      },
    } = getCurrentInstance();
    const state = reactive({
      timer: null,
    });
    const userInfo = ref({});
    const { proxy } = getCurrentInstance();
    const index = ref(0);
    const autoplay = ref(true);
    const dateHours = ref("");
    const dateDay = ref("");
    const thermal = ref({});
    const weatherImg = ref("");
    const imgList = ref([]);
    const isOperate = computed(() =>
      ["start"].includes(store.getters.getStatus)
    );

    const videoUrl = ref([]);
    const picUrl = ref(
      store.getters.getCabinetInfo.background
        ? store.getters.getCabinetInfo.background.split("\\").join("/")
        : []
    );
    videoUrl.value.concat(picUrl.value).forEach((it) => {
      if (it.indexOf("mp4") !== -1) {
        imgList.value.push({
          video: store.getters.platform.info.http + "/" + it,
        });
      } else {
        imgList.value.push({
          img: store.getters.platform.info.http + "/" + it,
        });
      }
    });
    window.addEventListener("setItem", () => {
      userInfo.value = JSON.parse(sessionStorage.getItem("user"));
    });

    const getIndex = (nowIndex, oldIndex) => {
      let myVideo = proxy.$refs["videoPlayer" + nowIndex];
      if (myVideo) {
        myVideo[0].pause();
        myVideo[0].currentTime = 0;
        index.value = nowIndex;
        listenVideo();
      }
    };
    const listenVideo = () => {
      let myVideo = proxy.$refs["videoPlayer" + index.value];
      if (myVideo) {
        myVideo[0].play(() => {
          autoplay.value = false;
        });
      }
    };
    const onPlay = () => {
      autoplay.value = false;
    };
    const onEnded = () => {
      autoplay.value = true;
    };
    const goBack = () => {
      console.log(store.getters.getLockException, 'store.getters.getLockException')
      if (store.getters.getLockException) return;
      if (!isOperate.value) return;
      let path = toRaw(router).currentRoute.value.fullPath;
      if (path === "/myBorrowDetail") {
        router.go(-1);
      } else {
        if (JSON.parse(sessionStorage.getItem("isLogin")) === 1) {
          sessionStorage.removeItem("isLogin");
          router.push("/");
          return;
        }
        router.go(-1);
      }
    };
    const goLogin = () => {
      if (
        !store.getters.getCabinetInfo.openAdminLogin &&
        !store.getters.getCabinetInfo.openCardLogin &&
        !store.getters.getCabinetInfo.openCodeLogin &&
        !store.getters.getCabinetInfo.openFaceLogin
      ) {
        return ElMessage.error("暂未开放登录功能");
      }
      router.push("/login");
    };
    //退出登录
    const outLogin = () => {
      // 盘点图书不能退出
      console.log(store.getters.getLockException, 'store.getters.getLockException')
      if (store.getters.getLockException) return;
      if (!isOperate.value) return;

      // const status = store.getters.getStatus;
      // if (["borrowLoading", "doorLoading"].includes(status)) return;
      ElMessageBox.confirm("确定退出登录吗？", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        store.dispatch("setUserInfo", {});
        sessionStorage.removeItem("user");
        resetSetItem("user", JSON.stringify({}));
        router.push("/index");
        ElMessage.success("已退出登录");
        nextTick(() => {
          playAudio("outLogin");
        });
        setTimeout(() => {
          removeListener();
        }, 1000);
      });
    };
    const playAudio = (label) => {
      let audio;
      try {
        audio = document.getElementById("audioOutLogin");
      } catch (error) {
        console.log(
          "这里是因为异步settimeout导致没有获取到audioOutLoginDOM---try catch提前返回!!!"
        );
        return;
      }
      // let audio = document.getElementById("audioOutLogin");
      audio.addEventListener("canplay", () => {
        console.log("加载成功");
        audio.play();
      });
      audio.addEventListener("play", () => {
        console.log("播放成功");
      });
      audio.play();
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
        audio = document.getElementById("audioOutLogin");
      } catch (error) {
        console.log(
          "这里是因为异步settimeout导致没有获取到audioOutLoginDOM---try catch提前返回!!!"
        );
        return;
      }
      // let audio = document.getElementById("audioOutLogin");
      audio.removeEventListener("canplay", audio.play());
    };
    //时间定时
    state.timer = setInterval(() => {
      dateHours.value = globalProperties.dataTime.dateFormatHours(new Date());
      dateDay.value = globalProperties.dataTime.dateFormatDay(new Date());
    }, 1000);
    //天气接口
    const icoWeather = ref("");
    const getWeather = () => {
      // 获取当前位置
      axios
        .get(
          "https://restapi.amap.com/v3/ip?key=400ecb0c08d1d12cf962afee160ef551"
        )
        .then((resIp) => {
          if (resIp.data) {
            let location = resIp.data.rectangle.split(";")[0];
            // 获取当前城市天气
            axios
              .get(
                `https://devapi.qweather.com/v7/weather/now?location=${location}&key=0996725bde674cc2897eca74494a9d5b`
              )
              .then((res) => {
                thermal.value.temp = res.data.now.temp;
                thermal.value.text = res.data.now.text;
                icoWeather.value = res.data.now.icon;
                //     weatherImg.value = pic[res.data.wea_img];
              });
          }
        });
    };
    getWeather();
    setInterval(() => {
      getWeather();
    }, 3600000);

    let number_c = 0;
    let interval = null;
    const dialogTableVisible = ref(false);
    const inputInfo = ref({
      adminText: "", //
    });
    //进入配置页面
    const keyChange = () => {
      inputInfo.value.adminText = document.getElementById("adminText").value;
    };
    const goSetting = () => {
      clearTimeout(interval);
      if (number_c >= 3) {
        dialogTableVisible.value = true;
        // router.push("/setting");
      } else {
        number_c = number_c + 1;
      }
      interval = setTimeout(() => {
        number_c = 0;
      }, 2000);
    };
    // 进配置也
    const saveExe = () => {
      var date = new Date();
      var year = date.getFullYear();

      var month = date.getMonth() + 1;

      var day = date.getDate();

      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      var today = "LJZT" + year + month + day;
      if (inputInfo.value.adminText !== today)
        return ElMessage.error("管理员密码错误");
      store.dispatch("setUserInfo", {});
      sessionStorage.removeItem("user");
      resetSetItem("user", JSON.stringify({}));
      router.push("/setting");
    };
    //监听离开页面
    onUnmounted(() => {
      clearInterval(state.timer);
      state.timer = null;
    });
    return {
      userInfo,
      audioSrc,
      autoplay,
      dateHours,
      dateDay,
      thermal,
      weatherImg,
      imgList,
      goBack,
      goLogin,
      outLogin,
      getWeather,
      getIndex,
      onPlay,
      onEnded,
      goSetting,
      icoWeather,
      title,
      dialogTableVisible,
      saveExe,
      inputInfo,
      keyChange,
    };
  },
});
</script>
<style lang="less" scoped>
/deep/.el-carousel__arrow {
  display: none !important;
}

/deep/.d-player-video-main {
  object-fit: cover !important;
  border-bottom-left-radius: 800px 164px !important;
  border-bottom-right-radius: 800px 164px !important;
}

.el_img {
  border-bottom-left-radius: 800px 164px !important;
  border-bottom-right-radius: 800px 164px !important;
  width: inherit;
  height: inherit;
}

/deep/.el-button {
  margin-right: 15px !important;
}

/deep/.el-carousel--horizontal {
  border-bottom-left-radius: 800px 164px !important;
  border-bottom-right-radius: 800px 164px !important;
}

/deep/.el-carousel__container {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  pointer-events: none !important;
  height: 603px !important;
  overflow: hidden;
}

:deep(.el-carousel__item) {
  overflow: inherit !important;
}

.head {
  margin: 15px;
  border-radius: 15px;
  // background: rgba(255, 145, 89, 1);
  position: relative;
  z-index: 100;
  background: url(../../assets/image/backYuan.png) no-repeat;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
}

.head_top {
  background-image: url("../../assets/image/backBook.png");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 15px;
  border-bottom-left-radius: 15px 15px;
  border-bottom-right-radius: 15px 15px;
  position: relative;

  .title {
    position: absolute;
    width: 98.1%;
    z-index: 10;
    height: 60px;
    background: rgba(255, 255, 255, 0.75);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    display: flex;
    padding: 10px;
    justify-content: space-between;

    .time {
      display: flex;

      span:nth-child(1) {
        font-size: 50px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 145, 89, 1);
      }

      .time_right {
        p {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 145, 89, 1);
        }
      }

      img {
        margin: 0 10px 0 10px;
      }
    }

    img {
      width: 60px;
      height: 60px;
    }
  }
}

.head_bottom {
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .headText {
    letter-spacing: 2px;
    font-size: 36px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #fff;
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }

  .gologin {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .gologin,
  .outlogin {
    span {
      padding-right: 15px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #fff;
    }
  }

  .outlogin {
    display: flex;
    align-items: center;

    img {
      width: 30px;
      margin-right: 5px;
    }
  }

  .langs {
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #fe6d8e;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .back {
    display: flex;
    align-items: center;

    img {
      width: 38px;
      height: 38px;
    }

    span {
      letter-spacing: 2px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>