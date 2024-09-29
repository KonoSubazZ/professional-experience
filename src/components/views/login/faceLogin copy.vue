<template>
  <div class="intype_face">
    <audio id="audioFace" :src="audioSrc"></audio>
    <p>请把你的脸部放在识别的指示框架里面<br />以便于准确识别个人信息</p>
    <img class="faceImg" src="../../../assets/image/face_img.png" />
    <div id="video" class="video-box" v-loading="ploadings">
      <video
        ref="cam"
        id="inputVideo"
        autoplay
        muted
        playsinline
        :width="videoWidth"
        style="object-fit: cover"
        :height="videoHeight"
      />
      <canvas id="my-overlay" />
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
const trackerTask = ref(null);
const mediaStreamTrack = ref(null);
const uploadLock = ref(true);
const isPhoto = ref(true);
window.resetSetItem = resetSetItem;

const checkCamera = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    ElMessage.error("没有检测到摄像头");
  } else {
    console.log("进来了");
    ploadings.value = true;
    navigator.mediaDevices.enumerateDevices().then((data) => {
      console.log("data了", data);
      nextTick(() => {
        let list = data.filter((it) => {
          return it.label.indexOf("HM0230C") > -1 || it.kind == "videoinput";
        });
        if (!list || !list.length) {
          ElMessage.error("没有检测到摄像头");
          ploadings.value = false;
          return;
        }
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: {
                exact:
                  list.filter((as) => as.label.indexOf("HM0230C") > -1)
                    .length !== 0
                    ? list.filter((as) => as.label.indexOf("HM0230C") > -1)[0]
                        .deviceId
                    : list[0].deviceId,
              },
            },
          })
          .then((stream) => {
            console.log("这里了");
            ploadings.value = false;
            let video = document.querySelector("#video video");
            video.srcObject = stream;
            mediaStreamTrack.value = stream;
            nextTick(() => {
              video.value = document.querySelector("#video video");
              let canvas = document.getElementsByTagName("canvas")[0];
              let context = canvas.getContext("2d");
              // 固定写法
              let tracker = new window.tracking.ObjectTracker("face");
              tracker.setInitialScale(4);
              tracker.setStepSize(2);
              tracker.setEdgesDensity(0.1);
              // 等待视频元数据加载完成后播放视频
              video.onloadedmetadata = function (e) {
                video.play();
              };
              trackerTask.value = window.tracking.track(
                "#inputVideo",
                tracker,
                {
                  camera: true,
                }
              );

              tracker.on("track", function (event) {
                // 检测出人脸 绘画人脸位置
                context.clearRect(0, 0, canvas.width, canvas.height);
                event.data.forEach(function (rect) {
                  context.strokeStyle = "#ff9159";
                  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                });
                if (event.data.length > 0) {
                  if (isPhoto.value) {
                    // setTimeout(() => {
                    uploadLock.value && pictrue();
                    // }, 1000);
                    isPhoto.value = false;
                  }
                }
              });
            });
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
    let canvas = document.getElementsByTagName("canvas")[0];
    let video = document.getElementsByTagName("video")[0];
    // let v = document.getElementById("video");
    // let vInfo = v.getBoundingClientRect();
    canvas.width = videoWidth.value;
    canvas.height = videoHeight.value;
    canvas.style.objectFit = "cover";
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, videoWidth.value, videoHeight.value);
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
      ploadings.value = false;
      uploadLock.value = true;
      isPhoto.value = true;
      ElMessage.error(res.message);
    }
  });
};
const playAudio = (lable) => {
  let audio
  try {
     audio = document.getElementById("audioFace");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioFaceDOM---try catch提前返回!!!"
    );
    return;
  }
  // let audio = document.getElementById("audioFace");
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
    playAudio("faceAudio");
  });
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