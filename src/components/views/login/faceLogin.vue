<template>
  <div class="intype_face">
    <audio id="audioFace" :src="audioSrc"></audio>
    <p>请把你的脸部放在识别的指示框架里面<br />以便于准确识别个人信息</p>
    <img class="faceImg" src="../../../assets/image/face_img.png" />
    <div id="video" class="video-box" v-loading="ploadings">
      <video
        ref="videoRef"
        id="inputVideo"
        autoplay
        muted
        playsinline
        :width="videoWidth"
        style="object-fit: cover"
        :height="videoHeight"
      />
      <canvas id="my-overlay" ref="canvasRef" />
      <div class="scan-top"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { UserService } from "@api/request";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import pic from "@utils/image";
import filter from "@utils/filter";
import resetSetItem from "@utils/session";
import { ElMessage } from "element-plus";
const router = useRouter();
const store = useStore();
const audioSrc = ref("");
const videoWidth = ref(410);
const videoHeight = ref(525);
const interval = ref("");
const ploadings = ref(false);
const video = ref(null);
const videoRef = ref(null);
const canvasRef = ref(null);
const trackerTask = ref(null);
const mediaStreamTrack = ref(null);
const uploadLock = ref(true);
const isPhoto = ref(true);
window.resetSetItem = resetSetItem;
const threeTime = ref(3);
const checkCamera = () => {
  console.log("checkCamera被调用了");
  //navigator
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    ElMessage.error("没有检测到摄像头");
  } else {
    ploadings.value = true;
    navigator.mediaDevices.enumerateDevices().then((data) => {
      console.log(
        "navigator.mediaDevices.enumerateDevices() ---有摄像头data",
        data
      );
      nextTick(() => {
        const videoinputList = data.filter(
          (it) => it.label.includes("HM0230C") || it.kind === "videoinput"
        );
        if (!videoinputList.length) {
          ElMessage.error("没有检测到摄像头");
          ploadings.value = false;
          return;
        }
        // 默认摄像头-- 第一项0
        let VidioIndex = 0;
        // 多种摄像头  -- 定义摄像头类型的优先级顺序
        const vedioPriorities = ["RGB", "HD", "IR"];
        // 遍历优先级顺序，查找对应类型的摄像头
        vedioPriorities.some((type) => {
          const index = videoinputList.findIndex((item) =>
            item.label.includes(type)
          );
          if (index !== -1) {
            VidioIndex = index;
            return true; // 中断循环
          }
        });
        
        console.log(videoinputList);
        console.log("摄像头索引", VidioIndex);
        // // 没找到摄像头 这三种类型的["RGB", "HD", "IR"]
        // if (VidioIndex == undefined&&!videoinputList.length) {
        //   VidioIndex = videoinputList.length > 0 ? 0 : 0;
        // }
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: {
                exact: videoinputList[VidioIndex].deviceId,
              },
            },
          })
          .then((stream) => {
            ploadings.value = false;
            setTimeout(() => {
              videoRef.value.srcObject = stream;
              videoRef.value.play();
              let context = canvasRef.value.getContext("2d");
              context.willReadFrequently = true;
              let tracker = new window.tracking.ObjectTracker("face");
              trackerTask.value = window.tracking.track(
                "#inputVideo",
                tracker,
                {
                  camera: false,
                }
              );
              tracker.on("track", function (event) {
                // 检测出人脸 绘画人脸位置
                context.clearRect(
                  0,
                  0,
                  canvasRef.value.width,
                  canvasRef.value.height
                );
              });
              setTimeout(() => {
                pictrue();
              }, 3000);
            }, 0);
          }, 0);
      }).catch((err) => {
        ElMessage.error("没有检测到摄像头");
        ploadings.value = false;
      });
    });
  }
};

const pictrue = () => {
  uploadLock.value = false;
  nextTick(() => {
    let canvas = canvasRef.value;
    let video = videoRef.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.objectFit = "cover";
    let context = canvas.getContext("2d"); //创建一个画布
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); //在画布上面画出视频内容
    if (interval.value) {
      clearInterval(interval.value);
    }
    let photo = canvas
      .toDataURL("image/png")
      .replace("data:image/png;base64,", "");
    faceLogin(photo);
  });
};

const faceLogin = (photo) => {
  let param = {
    photo,
    platformId: String(store.getters.platform.platformId),
  };
  ploadings.value = true;
  UserService.faceLogin(param).then((res) => {
    if (res.code == 0) {
      ploadings.value = false;
      store.dispatch("setUserInfo", res.data);
      resetSetItem("user", JSON.stringify(res.data));
      ElMessage.success(`登录成功，欢迎您 ${filter.hideName(res.data.name)}`);
      if (interval.value) {
        clearInterval(interval.value);
      }
      nextTick(() => {
        playAudio("login");
      });
      router.push(sessionStorage.getItem("path") || "/");
      sessionStorage.removeItem("path");
    } else {
      if (threeTime.value > 0) {
        threeTime.value -= 1;
      }
      if (threeTime.value == 0) {
        ElMessage.error("失败次数较多,将在1s后跳转首页");
        setTimeout(() => {
          ploadings.value = false;
          uploadLock.value = true;
          isPhoto.value = true;
          router.push("/index");
        }, 1000);
      } else {
        ploadings.value = false;
        uploadLock.value = true;
        isPhoto.value = true;
        if (res.code == -1) {
          ElMessage.error("识别错误,请重试");
        } else {
          ElMessage.error(res.message);
        }
        setTimeout(() => {
          pictrue();
        }, 3000);
      }
    }
  });
};
const playAudio = (lable) => {
  let audio = document.getElementById("audioFace");
  if (!audio) {
    return;
  }
  audio.addEventListener("canplay", () => {
    console.log("加载成功");
    audio.play();
  });
  audio.addEventListener("play", () => {
    console.log("播放成功");
  });
  if (!lable) {
    audio.pause();
    audioSrc.value = "";
  } else {
    audioSrc.value = pic[lable];
  }
};

onMounted(() => {
  nextTick(() => {
    // 异步后执行
    playAudio("faceAudio");
  });
  // 先执行
  checkCamera();
});

onUnmounted(() => {
  mediaStreamTrack.value && mediaStreamTrack.value.getTracks()[0].stop();
  trackerTask.value && trackerTask.value.stop();
});
</script>
<style lang="less" scoped>
.video-box {
  overflow: hidden;
  position: absolute;
  top: 44.4%;
  left: 50%;
  transform: translate(-50%, -55%);
  z-index: 5;
}

.faceImg {
  width: 550px;
  height: 550px;
  z-index: 10;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
}

.scan-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#1da1f2, rgba(255, 255, 255, 0));
  animation: toTop 2s ease-in infinite;
}

@keyframes toTop {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
}

.intype_face {
  p {
    letter-spacing: 2px;
    text-align: center;
    line-height: 30px;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
#my-overlay {
  width: 729px;
  height: 560px;
  position: absolute;
  top: -30px;
  left: -181px;
  z-index: 2;
  object-fit: fill;
}
</style>