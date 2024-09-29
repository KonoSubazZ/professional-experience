<template>
  <div class="ceshi">
    <div class="left">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <i class="el-icon-bank-card"></i>
          <span slot="title">测试读者卡（750F）</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-postcard"></i>
          <span slot="title">测试身份证（IDM40）</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-video-camera"></i>
          <span slot="title">测试摄像头（未知型号）</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-printer"></i>
          <span slot="title">测试打印机（TX80）</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-receiving"></i>
          <span slot="title">测试出卡（F3）</span>
        </el-menu-item>
        <el-menu-item index="back">
          <i class="el-icon-d-arrow-left"></i>
          <span slot="title">返回上一页</span>
        </el-menu-item>
      </el-menu>
      <div class="loading-modal" @click="showMessage" v-if="checkLoading"></div>
      <!-- <div class="flex-row">
        <el-button type="primary" class="mr" @click="readCard"
          >{{
            !readCardStatus ? "开始" : "停止"
          }}测试读者卡读取（750F）</el-button
        >
        <el-button>750F设备配置</el-button>
      </div>
      <div class="flex-row">
        <el-button type="primary" class="mr" @click="readCard"
          >{{
            !readCardStatus ? "开始" : "停止"
          }}测试身份证读取（IDM40）</el-button
        >
      </div>
      <div class="flex-row">
        <el-button type="primary" class="mr" @click="readCard"
          >{{
            !readCardStatus ? "开始" : "停止"
          }}测试摄像头（未知型号）</el-button
        >
      </div>
      <div class="flex-row">
        <el-button type="primary" class="mr" @click="readCard"
          >{{
            !readCardStatus ? "开始" : "停止"
          }}测试打印机打印（TX80）</el-button
        >
      </div>
      <div class="flex-row">
        <el-button type="primary" class="mr" @click="readCard"
          >{{ !readCardStatus ? "开始" : "停止" }}测试出卡（F3）</el-button
        >
      </div>
      <div class="flex-row">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
      </div> -->
    </div>
    <div class="moddle">
      <div class="form rfid">
        <div v-if="defaultActive == 1">
          <div class="form-title">750F设备配置</div>
          <!-- <el-form label-width="100px">
            <el-form-item label="读者卡类型">
              <el-select v-model="setting.readerCard.type">
                <el-option label="IC" value="IC"></el-option>
                <el-option label="RFID" value="RFID"></el-option>
              </el-select>
            </el-form-item>
          </el-form> -->
          <!-- <el-button type="primary" size="small" @click="startCheck">
            {{ readCardStatus ? "正在读卡，点击停止" : "未开始，点击读卡" }}
          </el-button> -->
        </div>
        <div style="margin-bottom: 15px" v-if="defaultActive == 2">
          <div class="form-title">IDM40设备测试</div>
        </div>
        <div style="margin-bottom: 15px" v-if="defaultActive == 3">
          <div class="form-title">人脸设备测试</div>
        </div>

        <div v-if="defaultActive == 4">
          <div class="form-title">请输入打印内容</div>
          <div class="form-status" style="width: 100%">
            <el-input
              type="textarea"
              resize="none"
              v-model="printValue"
              :autoize="{
                minRows: 5,
              }"
              style="width: 100%"
            ></el-input>
          </div>
        </div>
        <div v-if="defaultActive == 5">
          <el-button
            type="primary"
            v-if="!connectStatus"
            @click="connect"
            size="small"
            >连接</el-button
          >
          <el-button
            type="primary"
            v-if="connectStatus"
            @click="startCheck"
            size="small"
            >读卡</el-button
          >
          <el-button
            type="primary"
            v-if="connectStatus"
            size="small"
            @click="frontCardDeliver"
            >出卡</el-button
          >
        </div>
        <div>
          <el-button  v-if="defaultActive != 5 && defaultActive != 4" type="primary" size="small" @click="startCheck">{{
            checkLoading ? "停止测试" : "开始测试"
          }}</el-button>
          <el-button
            type="primary"
            v-if="defaultActive == 3 && checkLoading"
            size="small"
            @click="pictrue"
            >开始拍照</el-button
          >
          <el-button
            type="primary"
            v-if="defaultActive == 4"
            size="small"
            @click="startCheck"
            >打印</el-button
          >
        </div>
      </div>

      <div class="book-list">
        <template v-if="defaultActive != 3">
          <div v-for="(item, index) in infoList" :key="index">{{ item }}</div>
          <div v-if="(!infoList || !infoList.length) && defaultActive != 3">
            未读取到数据
          </div>
        </template>
        <div v-if="defaultActive == 3" class="video-line">
          <div class="video-caption" v-if="pictrueStatus">
            人脸分数：{{ pictrueStatus }}
          </div>

          <div id="video" class="video-box">
            <video width="100%" style="object-fit: cover" height="100%"></video>
            <div
              class="video-canvas"
              :style="pictrueStatus ? 'opacity:1' : 'opacity:0'"
            >
              <canvas width="100%" height="100%"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hardWare from "../../../../api/hardWare_renderer";
export default {
  name: "landing-page",

  data() {
    return {
      test: "", //硬件接口实例
      checkLoading: false,
      defaultActive: "1", //默认测试内容
      readCardStatus: false, //750f读取状态
      idCardStatus: false, //身份证读取状态 true正在读取。
      printStatus: false, //打印状态
      printValue: "", //需要打印的内容；
      connectStatus: false, //出卡机连接状态
      mediaStatus: false, //视频测试状态
      pictrueStatus: 0, //人脸照片分数

      setting: {
        readerCard: {
          type: "IC",
        },
      },
      config: "",

      infoList: [], //数据存放列表
    };
  },
  computed: {
    configName() {
      return `750F设备配置`;
    },
  },
  created() {
    this.test = hardWare.init();
    this.config = this.test.config;
  },
  methods: {
    /**
     * 切换测试内容
     */
    handleSelect(e) {
      console.log(e);
      if (e == "back") {
        this.$router.go(-1);
      } else {
        this.infoList = [];
        this.defaultActive = e;
      }
    },
    /**
     * 开始测试  根据选择测试内容
     */
    startCheck() {
      this.$message.success(this.checkLoading ? "停止测试" : "开始测试");
      this.checkLoading = !this.checkLoading;
      switch (Number(this.defaultActive)) {
        case 1:
          this.checkReadCard();
          break;
        case 2:
          this.checkIdCard();
          break;
        case 3:
          this.checkCamera();
          break;
        case 4:
          this.checkLoading = !this.checkLoading;
          this.checkPrint();
          break;
        case 5:
          this.checkLoading = !this.checkLoading;
          this.startCardDeliver();
          break;
      }
    },
    /**
     * 出卡机 F3
     */
    startCardDeliver() {
      this.infoList = [this.test.startCardDeliver()];
    },
    /**
     * 弹出卡片
     */
    frontCardDeliver() {
      this.infoList = this.test.frontCardDeliver();
    },
    /**
     * 连接出卡机
     */
    connect() {
      this.connectStatus = this.test.connectCardDeliver();
    },
    /**
     * 读者卡测试 750F 设备调用
     */
    checkReadCard() {
      let type = this.setting.readerCard.type;
      let func = (data) => {
        this.infoList = [data];
      };
      if (!this.readCardStatus) {
        this.readCardStatus = this.test.readReaderCard(type, func);
        if (this.readCardStatus == 601) {
          this.$message.error("调用读者卡失败");
        }
      } else {
        this.readCardStatus = !this.test.stopReaderCard();
        this.infoList = [];
      }
    },
    /**
     * 身份证测试 IDM40 设备调用
     */
    checkIdCard() {
      if (!this.idCardStatus) {
        this.idCardStatus = this.test.readIdCard((data) => {
          this.infoList = [data];
        });
      } else {
        this.idCardStatus = this.test.stopReadIdCard();
        this.infoList = [];
      }
    },
    /**
     * 测试摄像头 未知型号
     */
    checkCamera() {
      if (!this.mediaStatus) {
        this.mediaStatus = true;
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.enumerateDevices
        ) {
          this.$message.error("当前浏览器不支持该功能");
          this.mediaStatus = false;
        } else {
          navigator.mediaDevices.enumerateDevices().then((data) => {
            this.infoList = data.map((it) => {
              return it.kind + ":" + it.label + "id=" + it.deviceId;
            });
            console.log(data);
            this.$nextTick(() => {
              let video = document.querySelector("#video video");
              let list = data.filter((it) => {
                return it.kind == "videoinput"
              });
              if (!list || !list.length) {
                this.$message.error("未找到摄像头");
                this.mediaStatus = false;
                return;
              }
              navigator.mediaDevices
                .getUserMedia({
                  video: {
                    deviceId: {
                      exact: list[0].deviceId,
                    },
                  },
                })
                .then((stream) => {
                  video.src = window.URL.createObjectURL(stream);
                  video.play();
                });
            });
          });
        }
      } else {
        let video = document.querySelector("#video video");
        video.src = "";
        this.mediaStatus = false;
        this.infoList = [];
        this.pictrueStatus = 0;

        this.clearPictrue();
      }
    },
    /**
     * 测试打印机
     */
    checkPrint() {
      this.$message.success("开始打印");
      console.log(this.test.startPrint);
      if (!this.printValue) {
        this.$message.error("请输入打印内容");
        return;
      }
      this.printStatus = this.test.startPrint(this.printValue);
      if (this.printStatus == 606) {
        this.$message.error("打印调用失败");
      } else {
        this.printValue = "";
      }
    },
    /**
     * 测试办卡
     */
    checkCard() {},
    showMessage() {
      this.$message.warning("请先停止测试");
    },
    /**
     * 截取图片
     */
    pictrue() {
      let canvas = document.getElementsByTagName("canvas")[0];
      let video = document.getElementsByTagName("video")[0];
      let v = document.getElementById("video");
      let vInfo = v.getBoundingClientRect();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.objectFit = "cover";
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      // console.log("成功", canvas.toDataURL("image/png"));
      if (this.timePictue) {
        clearTimeout(this.timePictue);
      }
      this.myPictrue = true;
      this.pictrueStatus = 0;
      let status = this.test.testFace({
        img: canvas
          .toDataURL("image/png", 0.8)
          .replace("data:image/png;base64,", ""),
      });
      status = status * 100;
      if (status == 60000) {
        this.$message.error("百度人脸调用失败");
      } else if (status >= 60) {
        this.pictrueStatus = status;
        this.myPictrue = false;
        clearTimeout(this.timePictue);
      } else {
        this.timePictue = setTimeout(() => {
          this.pictrue();
        }, 500);
      }
    },
    /**
     * 清除图片
     */
    clearPictrue() {
      let canvas = document.getElementsByTagName("canvas")[0];
      canvas.height = 0;
      this.myPictrue = false;
      clearTimeout(this.timePictue);
    },
  },
};
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
/deep/.el-menu {
  border-right: none !important;
}
.loading-modal {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.28);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.video-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.video-caption {
  transform: translateY(-20px);
  font-weight: bold;
  color: #999;
}
.video-box {
  width: 400px;
  height: 400px;
  min-width: 400px;
  min-height: 400px;
  border: 1px solid #ccc;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.video-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.form-status {
  width: 100px;
  text-align: left;
  font-size: 14px;
  margin-bottom: 1rem;
  text-align: center;
}
.form-status.error {
  color: red;
}
.form-status.success {
  color: green;
}

.ceshi {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  min-width: 1000px;
  overflow-x: scroll;

  .left {
    width: 33%;
    height: calc(100vh - 4rem);
    border: 1px solid #c0c4cc;
    border-radius: 4px;
    padding: 1rem;
    box-sizing: border-box;
    min-height: 580px;
    overflow-y: scroll;
    position: relative;
  }
  .moddle {
    height: calc(100vh - 4rem);
    border-radius: 4px;
    padding: 1rem;
    border: 1px solid #c0c4cc;
    width: 65%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 580px;
    overflow-y: scroll;
  }
  .form {
    padding: 1rem;
    box-sizing: border-box;
    border: 1px solid #c0c4cc;
    border-radius: 4px;
    margin-bottom: 1rem;
    height: 300px;
    .form-title {
      //   margin-left: 100px;
      margin-bottom: 1rem;
      font-weight: bold;
    }
    /deep/.el-form {
      .el-select {
        border-color: #c0c4cc;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
      }
    }
  }
  .book-list {
    width: 100%;
    border-radius: 4px;
    line-height: 20px;
    min-height: 300px;
    overflow: auto;
    padding: 1rem;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid #c0c4cc;
  }
}
.mr {
  margin-right: 1rem;
}
.flex-row {
  display: flex;
  margin-bottom: 1rem;
}
</style>