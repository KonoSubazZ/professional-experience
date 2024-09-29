<template>
  <div class="face-info" v-loading="successLoading">
    <div class v-if="status == 'start'">
      <div class="face-box">
        <p class="tip" style="width: 100%">{{ scanTip }}</p>
        <div class="w-scan margin-center posi-rela" :class="appType == 'two' ? 'card-scan' : ''" style="width: 600px">
          <img class="loading" :class="appType == 'two' ? 'card-scan' : ''" src="@/assets/images/child/face_loading.png"
            alt />
          <div class="posi-scan w-scan-posi">
            <div id="video" class="video-box" v-if="startStatus == 'loading'">
              <video id="video1" width="100%" style="object-fit: cover" height="100%"></video>
              <canvas id="canvas" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                  " width="300" height="300"></canvas>
              <div class="video-canvas"></div>
              <!-- <canvas
                style="background-color: aquamarine; position: absolute; top: 0"
                id="screenshotCanvas"
                width="320"
                height="320"
              ></canvas> -->
            </div>
            <div class="scan-top" v-if="startStatus == 'loading'"></div>
            <div class="people-show" v-if="startStatus == 'start'">
              <img src="@/assets/images/card/people_info.png" alt />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row flex-center">
        <button class="form-blue-btn mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
          style="font-size: 25px" @click="start" :disabled="startStatus == 'loading'">
          {{ startStatus == "start" ? "开始采集" : "正在采集" }}
        </button>
      </div>
    </div>
    <div class v-if="status == 'fail'">
      <div class="face-box">
        <div class="w-scan margin-center posi-rela" :class="appType == 'two' ? 'card-scan' : ''">
          <img class="loading" src="@/assets/images/child/face_loading.png" alt />
          <div class="posi-scan w-scan-posi">
            <div class="scan-top" v-if="startStatus == 'loading'"></div>
            <div class="people-show" v-if="startStatus == 'start'">
              <img src="@/assets/images/card/people_info.png" alt />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row flex-center">
        <button class="form-blue-btn font-24 mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
          @click="start">
          重新采集
        </button>
      </div>
    </div>
    <div v-if="status == 'success'">
      <div class="face-box">
        <div class="w-scan-card margin-center posi-rela">
          <img class="loading bor-rad-round" style="object-fit: cover" :src="faceDraw" alt />
        </div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button class="form-blue-btn font-24 mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
          @click="confirmInfo">
          确认
        </button>
        <button class="form-yellow-btn font-24 mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
          @click="start">
          重新采集人脸信息
        </button>
        <button v-if="this.manageSetting.selfServiceCardMachineIsIdCard" class="form-yellow-btn font-24 mr-10"
          :style="{ borderRadius: skin != 'child' ? '5px' : '' }" @click="back">
          重新采集身份信息
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer.js";
import "@/assets/tracking/face-min";
export default {
  data() {
    return {
      status: "start",
      startStatus: "start",
      mediaStatus: false,
      testReader: "",
      interval: "",
      faceDraw: "",
      successLoading: false,
      uploadLock: true, // 上传锁
      scanTip: "请点击开始采集按钮",
      duide: false,
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    appType() {
      return this.$store.state.Setting.appType;
      // return "one";
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    face() {
      return this.$store.state.User.face;
    },
    setting() {
      return this.$store.state.Setting.manageSetting;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
  },
  created() {
    console.log('这里么');
    this.$store.dispatch("add_to_log", "人脸认证");

    this.testReader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.successLoading = false;
    this.$store.dispatch("modifyCaption", "请将脸部对准摄像头，确保光线充足");
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.readFail();
      }
    },
  },
  destroyed() {
    // this.$nextTick(() => {
    //   this.$store.commit("set_label_name", "");
    // });
    // if (this.interval) {
    //   clearInterval(this.interval);
    // }
  },
  methods: {
    /**
     * 测试摄像头 未知型号
     */
    checkCamera() {
      // this.stopMediaStreamTrack();
      console.log('走的这');
      this.duide = false;
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        this.$store.dispatch("add_to_error_log", "当前浏览器不支持该功能");
        this.$func.toast({
          content: "当前浏览器不支持该功能，请联系管理员",
          type: "ERROR",
        });
        this.mediaStatus = false;
      } else {
        navigator.mediaDevices.enumerateDevices().then((data) => {
          this.infoList = data.map((it) => {
            return it.kind + ":" + it.label + "id=" + it.deviceId;
          });
          this.$nextTick(() => {
            let video = document.querySelector("#video video");
            let list = data.filter((it) => {
              return (
                (this.appType == "two" && it.kind == "videoinput") ||
                // && it.label.indexOf("RGB") > -1) ||
                (this.appType == "one" && it.kind == "videoinput")
              );
            });
            if (!list || !list.length) {
              this.mediaStatus = false;
              this.readFail("未找到摄像头");
              this.$func.toast({
                content: "未找到摄像头，请联系管理员",
                type: "ERROR",
              });
              return;
            }
            navigator.mediaDevices
              .getUserMedia({
                video: true,
                // video: {
                //   deviceId: {
                //     exact: list[0].deviceId,
                //   },
                // },
              })
              .then((stream) => {
                stream.getTracks().forEach(function (track) {
                  track.stop();
                });
                this.video = document.querySelector("#video video");
                let canvas = document.getElementById("canvas");
                let context = canvas.getContext("2d");
                video.srcObject = stream
                let tracker = new window.tracking.ObjectTracker("face");
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                // 等待视频元数据加载完成后播放视频
                video.onloadedmetadata = function (e) {
                  video.play();
                };
                window.tracking.track("#video1", tracker, {
                  camera: true,
                });
                let _this = this;
                tracker.on("track", function (event) {
                  // 检测出人脸 绘画人脸位置
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  event.data.forEach(function (rect) {
                    context.strokeStyle = "#32CD99";
                    context.strokeRect(
                      rect.x,
                      rect.y,
                      rect.width,
                      rect.height
                    );

                    if (_this.interval) {
                      clearInterval(_this.interval);
                    }
                    if (event.data.length) {
                      _this.scanTip = "脸部信息采集中，请保持不动...";
                      if (_this.duide == false) {
                        setTimeout(() => {
                          _this.uploadLock && _this.pictrue();
                          _this.video.srcObject = null
                          // _this.stopMediaStreamTrack();
                          // stream.getTracks().forEach(function (track) {
                          //   track.stop();
                          // });
                        }, 2000);
                        _this.duide = true;
                      }
                    }
                    // _this.stopMediaStreamTrack()
                    // 上传图片
                    // _this.uploadLock && _this.screenshotAndUpload();
                  });
                });
                // this.stopMediaStreamTrack()
                // if (this.interval) {
                //   clearInterval(this.interval);
                // }
                // this.interval = setInterval(() => {
                //   this.pictrue();
                // }, 2000);
              })
              .catch((err) => {
                this.$message.error("未识别到脸部");
                this.$store.dispatch("add_to_error_log", "未获取到视频流");
                this.$func.toast({
                  content: "获取视频失败，请联系管理员",
                  type: "ERROR",
                });
              });
          });
        });
      }
    },
    /**
     * 截取图片
     */
    // 关闭摄像头
    // stopMediaStreamTrack() {
    //   if (typeof window.stream === "object") {
    //     //	this.videoEl是视频流容器，也就是video标签，需要在data中声明这个变量，然后在打开摄像头的方法中this.videoEl.srcObject = window.stream
    //     this.videoEl.srcObject = null;
    //     window.stream.getTracks().forEach((track) => track.stop());
    //   }
    // },
    pictrue() {
      this.duide = true;
      let canvas = document.getElementsByTagName("canvas")[0];
      let video = document.getElementById("video1");
      let v = document.getElementById("video");
      // let vInfo = v.getBoundingClientRect();
      canvas.width = video.videoWidth == undefined ? 0 : video.videoWidth;
      canvas.height = video.videoHeight == undefined ? 0 : video.videoHeight;
      canvas.style.objectFit = "cover";
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      this.$store.dispatch("add_to_log", "开始调用人脸认证api");
      let status = this.testReader.testFace({
        img: canvas
          .toDataURL("image/png", 0.8)
          .replace("data:image/png;base64,", ""),
      });
      this.$store.dispatch("add_to_log", "人脸认证分数:" + status);
      if (status == 600) {
        this.$store.dispatch("add_to_error_log", "调用人脸api失败");
        this.$global_func.toast({
          content: "系统出现错误，请联系管理员",
          type: "ERROR",
        });
      } else {
        if (
          status * 100 >=
          this.setting.selfServiceCardMachineIsFaceRecognitionScore
        ) {
          clearInterval(this.interval);
          this.$store.dispatch("add_to_log", "人脸认证成功");
          // this.$store.dispatch(
          //   "modifyFace",
          //   canvas.toDataURL("image/png", 0.8)
          // );
          // this.authSuccess();
          this.uploadLock = false; // 上传锁
          if (this.duide === true) {
            this.uploadImg(canvas.toDataURL("image/png"));
          }
        }
      }
    },
    /**
     * 上传人脸图片
     */
    uploadImg(url) {
      this.uploadLock = true; // 上传锁
      let file = this.$func.toFile(url, "face");

      let data = new FormData();
      data.append("file", file);
      data.append("type", 1);
      this.$store.dispatch("add_to_log", "上传人脸图片");
      this.$axios
        .post("/other/uploadFile", data)
        .then((res) => {
          this.$store.dispatch("modifyFace", res.data);
          this.$store.dispatch("add_to_log", "上传人脸图片成功");
          // console.log(res);
          this.faceDraw = url;
          this.authSuccess();
        })
        .catch((err) => {
          this.$store.dispatch(
            "add_to_error_log",
            "上传人脸信息失败，请联系管理员"
          );
          this.readFail("上传人脸信息失败，请联系管理员");
        });
      this.uploadLock = false;
    },
    /**
     * @description:开始采集
     */
    start() {
      this.scanTip = "请将脸部对准摄像头";
      this.uploadLock = true;
      this.status = "start";
      this.startStatus = "loading";
      this.successLoading = false;
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "camera");
      });
      this.$store.dispatch("modifyCaption", "请将脸部对准摄像头，确保光线充足");
      this.checkCamera();
    },
    /**
     * 采集失败
     */
    readFail(msg) {
      this.uploadLock = false;
      this.status = "fail";
      this.startStatus = "start";
      this.$store.dispatch("add_to_log", msg || "人脸认证失败");

      this.$store.dispatch(
        "modifyCaption",
        msg || "采集人脸信息失败，请重试或联系管理员"
      );
    },
    /**
     * @description:采集成功，获取图片
     */
    authSuccess() {
      this.status = "success";
      this.$store.dispatch("add_to_log", "人脸认证成功");
      this.video.srcObject = null
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "faceInfo");
      });
      this.$store.dispatch("modifyCaption", "请确定采集的人脸信息");
    },
    /**
     * @description:确定采集的人脸信息
     */
    confirmInfo() {
      // this.uploadLock=false // 上传锁
      let path = this.$func.getNextPath(this.list);
      console.log("confirm info", path);
      this.$router.push(path);
    },
    /**
     * @description:重新采集身份信息
     */
    back() {
      this.video.srcObject = null
      this.$router.push({ path: '/getCard', query: { index: false } });

    },
  },
};
</script>

<style lang="less" scoped>
@keyframes toTop {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(-100%);
  }
}

#video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.face-info {
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.posi-scan {
  position: absolute;
  //   background-color: rgba(0, 0, 0, 0.5);
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  transform: translateY(-50%);

  .scan-top {
    width: 100%;
    height: 100%;
    // transform: translateY(-30%);
    background: linear-gradient(rgba(29, 161, 242, 0.5),
        rgba(29, 161, 242, 0.1),
        rgba(29, 161, 242, 0));
    animation: toTop 2s ease-in infinite;
    z-index: 99;
  }

  .people-show {
    width: 100%;
    height: 100%;
  }
}

.card-scan {
  height: 450px !important;
  width: 450px !important;
}

.w-scan-posi {
  width: 300px !important;
  height: 300px !important;
}

.w-scan-card {
  width: 400px;
  height: 400px;
}

#screenshotCanvas {
  display: none;
}

.face-box {
  position: relative;
}

.tip {
  position: absolute;
  top: 20px;
  // left: 40%;
  z-index: 5;
  font-size: 1.6rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 800;
  color: #aa1010;
  line-height: 25px;
  text-align: center;
}
</style>