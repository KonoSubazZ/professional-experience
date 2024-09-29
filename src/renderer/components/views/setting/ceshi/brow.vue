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
          <span slot="title">测试阅读器（M201）</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-postcard"></i>
          <span slot="title">测试读者卡</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-video-camera"></i>
          <span slot="title">测试身份证</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-printer"></i>
          <span slot="title">测试条码</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-receiving"></i>
          <span slot="title">测试打印机</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-user"></i>
          <span slot="title">测试人脸识别</span>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="el-icon-receiving"></i>
          <span slot="title">测试出卡</span>
        </el-menu-item>
        <el-menu-item index="back">
          <i class="el-icon-d-arrow-left"></i>
          <span slot="title">返回上一页</span>
        </el-menu-item>
      </el-menu>
      <div class="loading-modal" @click="showMessage" v-if="checkLoading"></div>
    </div>
    <div class="moddle">
      <div class="form rfid">
        <div v-if="defaultActive == 1">
          <div class="form-title">M201设备测试</div>
          <!-- <el-form label-width="100px">
            <el-form-item label="接口类型">
              <el-select v-model="setting.rfidReader.type">
                <el-option label="USB" value="USB"></el-option>
                <el-option label="COM" value="COM"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="COM">
              <el-select v-model="setting.rfidReader.com">
                <el-option label="COM1" value="COM1"></el-option>
                <el-option label="COM2" value="COM2"></el-option>
                <el-option label="COM3" value="COM3"></el-option>
                <el-option label="COM4" value="COM4"></el-option>
                <el-option label="COM5" value="COM5"></el-option>
              </el-select>
            </el-form-item>
          </el-form> -->
        </div>
        <div v-if="defaultActive == 2" style="margin-bottom: 15px">
          <div class="form-title">750F设备测试</div>
          <!-- <el-form label-width="100px">
            <el-form-item label="读者卡类型">
              <el-select v-model="setting.readerCard.type">
                <el-option label="IC" value="IC"></el-option>
                <el-option label="RFID" value="RFID"></el-option>
              </el-select>
            </el-form-item>
          </el-form> -->
        </div>
        <div style="margin-bottom: 15px" v-if="defaultActive == 3">
          <div class="form-title">IDM40设备测试</div>
        </div>
        <div style="margin-bottom: 15px" v-if="defaultActive == 4">
          <div class="form-title">条码测试</div>
        </div>
        <div v-if="defaultActive == 5">
          <div class="form-title">请输入打印内容</div>
          <div class="form-status" style="width: 100%">
            <el-input
              type="textarea"
              resize="none"
              v-model="printValue"
              :autoize="{
                minRows: 5,
              }"
              style="width: 100%; margin-bottom: 1rem"
            ></el-input>
          </div>
        </div>
        <div style="margin-bottom: 15px" v-if="defaultActive == 6">
          <div class="form-title">人脸设备测试</div>
        </div>
        <div>
          <el-button
            v-if="
              defaultActive != 5 && defaultActive != 1 && defaultActive != 7
            "
            type="primary"
            size="small"
            @click="startCheck"
            >{{ checkLoading ? "停止测试" : "开始测试" }}</el-button
          >
          <div v-if="defaultActive == 1">
            <el-button
              type="primary"
              size="small"
              @click="startCheck('open')"
              >{{ rfidOpenStatus ? "打开" : "关闭" }}</el-button
            >
            <el-button
              type="primary"
              v-show="rfidOpenStatus"
              size="small"
              @click="startCheck('inventory')"
              >{{ rfidStatus ? "停止盘点" : "开始盘点" }}</el-button
            >
            <el-button
              type="primary"
              v-show="rfidOpenStatus"
              size="small"
              @click="rfidOut('out')"
              >借出</el-button
            >
            <el-button
              type="primary"
              v-show="rfidOpenStatus"
              size="small"
              @click="rfidIn('in')"
              >归还</el-button
            >
          </div>
          <el-button
            v-if="defaultActive == 5"
            type="primary"
            size="small"
            @click="startCheck"
            >打印</el-button
          >
          <el-button
            v-if="!myPictrue && mediaStatus"
            type="primary"
            size="small"
            @click="pictrue"
            >开始拍照</el-button
          >
          <el-button
            v-if="myPictrue && mediaStatus"
            type="primary"
            size="small"
            @click="clearPictrue"
          >
            停止拍照
          </el-button>
          <div v-if="defaultActive == 7">
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
        </div>
      </div>

      <div class="book-list">
        <div v-if="defaultActive != 4 && defaultActive != 6">
          <div v-for="(item, index) in infoList" :key="index">{{ item }}</div>
          <div v-if="!infoList || !infoList.length">未读取到数据</div>
          <div style="color: red">
            <div class="" v-if="errorList && errorList.length">错误数据</div>
            <div v-for="(item, index) in errorList" :key="index">
              {{ item }}
            </div>
          </div>
        </div>
        <div v-if="defaultActive == 4">
          <input
            type="text"
            id="input"
            placeholder="请点击开始测试,请保持输入框获取焦点"
          />
        </div>
        <div v-if="defaultActive == 6" class="video-line">
          <!-- <div class="video-caption">开始拍照</div> -->
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
import { write } from "fs";
import hardWare from "../../../../api/hardWare_renderer";
export default {
  name: "landing-page",

  data() {
    return {
      test: "", //硬件接口实例

      checkLoading: false,
      defaultActive: "1", //默认

      rfidStatus: false, //m201读取状态
      readCardStatus: false, //750f读取状态
      codeStatus: false, //条码测试状态
      printStatus: false, //打印
      printValue: "", //打印值
      mediaStatus: false, //视频测试状态
      myPictrue: "", //是否拍照
      pictrueStatus: 0, //人脸照片分数
      connectStatus: false, //出卡机连接状态
      setting: {
        rfidReader: {
          type: "USB",
          com: "COM5",
        },
        readerCard: {
          type: "IC",
        },
      },
      config: "",

      infoList: [], //数据存放列表
      errorList: [], //错误数据列表
      rfidOpenStatus: true,
    };
  },
  destroyed() {
    this.rfidStatus = this.test.stopInventoryRFIDReader();
  },
  created() {
    this.test = hardWare.init();
    this.config = this.test.config;
  },
  methods: {
    showMessage() {
      this.$message.warning("请先停止测试");
    },
    /**
     * 切换测试内容
     */
    handleSelect(e) {
      console.log(e);
      if (e == "back") {
        this.$router.go(-1);
      } else {
        this.defaultActive = e;
      }
    },
    /**
     * 开始测试  根据选择测试内容
     */
    startCheck(key) {
      // this.$message.success(this.checkLoading ? "停止测试" : "开始测试");
      this.checkLoading = !this.checkLoading;
      switch (Number(this.defaultActive)) {
        case 1:
          if (key == "inventory") {
            this.rfidRead();
          } else if (key == "open") {
            this.rfidOpen();
          }
          break;
        case 2:
          this.checkReadCard();
          break;
        case 3:
          this.checkIdCard();
          break;
        case 4:
          this.getCode(); //获取条码
          break;
        case 5:
          this.checkLoading = !this.checkLoading;

          this.checkPrint();
          break;
        case 6:
          this.checkCamera();
          break;
        case 7:
          this.checkLoading = !this.checkLoading;
          this.startCardDeliver();
          break;
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
            this.$nextTick(() => {
              let video = document.querySelector("#video video");
              let list = data.filter((it) => {
                return it.kind == "videoinput";
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
        this.pictrueStatus = 0;
        this.infoList = [];
        this.clearPictrue();
      }
    },
    /**
     * 获取条码
     */
    getCode() {
      let input = document.getElementById("input");
      if (!this.codeStatus) {
        input.focus();
      } else {
        input.blur();
      }
      this.codeStatus = !this.codeStatus;
    },
    /**
     * 打开rfid阅读器
     */
    rfidOpen() {
      if (!this.rfidOpenStatus) {
        //未打开,打开rfidAPI
        this.rfidOpenStatus = this.test.openRFIDReader();
        if (this.rfidOpenStatus == 608) {
          this.$message.error("阅读器打开api失败");
        }
      } else {
        this.rfidOpenStatus = !this.test.closeRFIDReader();
        if (this.rfidOpenStatus == 607) {
          this.$message.error("阅读器关闭api失败");
        }
      }
    },
    /**
     * m201 阅读器
     */
    rfidRead() {
      console.log(this.rfidStatus, "当前状态");
      if (!this.rfidStatus) {
        this.rfidStatus = this.test.inventoryRFIDReader((data) => {
          this.infoList = data;
          console.log(data);
        });
        if (this.rfidStatus == 614) {
          this.$message.error("阅读器开始盘点失败");
        }
      } else {
        this.rfidStatus = !this.test.stopInventoryRFIDReader();
        if (this.rfidStatus == 615) {
          this.$message.error("阅读器停止盘点失败");
        }
        this.infoList = [];
      }
    },
    /**
     * 借出图书
     */
    rfidOut() {
      if (!this.infoList || !this.infoList.length) {
        this.$message.error("请先盘点图书");
        return;
      }
      let error = [];
      this.infoList.forEach((it) => {
        let status = this.test.writeRFIDReaderOut(it.tag);
        if (status == 609) {
          error.push(it.tag);
        } else {
          console.log("write status:", status);
        }
      });
      this.errorList = error;
      this.$message.success("借出完成");
    },
    /**
     * 归还图书
     */
    rfidIn() {
      if (!this.infoList || !this.infoList.length) {
        this.$message.error("请先盘点图书");
        return;
      }
      let error = [];
      this.infoList.forEach((it) => {
        let status = this.test.writeRFIDReaderIn(it.tag);
        if (status == 609) {
          error.push(it.tag);
        } else {
          console.log("write status:", status);
        }
      });
      this.errorList = error;
      this.$message.success("归还完成");
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

        console.log(this.idCardStatus);
      } else {
        this.idCardStatus = !this.test.stopReadIdCard();
        this.infoList = [];
      }
    },

    /**
     * 关闭其他调用
     */

    /**
     * 返回上一页
     */
    goBack() {
      this.$router.goBack();
    },
    /**
     * 截取图片
     */
    pictrue() {
      let canvas = document.getElementsByTagName("canvas")[0];
      let video = document.getElementsByTagName("video")[0];
      let v = document.getElementById("video");
      let vInfo = v.getBoundingClientRect();

      canvas.width = v.offsetWidth;
      canvas.height = v.offsetHeight;
      if (this.timePictue) {
        clearTimeout(this.timePictue);
      }
      this.pictrueStatus = 0;
      this.myPictrue = true;
      setTimeout(() => {
        canvas.style.objectFit = "cover";
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, v.offsetWidth, v.offsetHeight);

        let status = this.test.testFace({
          img: canvas
            .toDataURL("image/png", 0.8)
            .replace("data:image/png;base64,", ""),
        });
        console.log(status);
        status = status * 100;
        if (status == 60000) {
          this.$message.error("百度人脸调用失败");
          return;
        } else if (status >= 60) {
          this.pictrueStatus = status;
          this.myPictrue = false;
          clearTimeout(this.timePictue);
        } else {
          this.timePictue = setTimeout(() => {
            this.pictrue();
          }, 500);
        }
      });
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
      console.log('121212');
      this.connectStatus = this.test.connectCardDeliver();
    },
  },
};
</script>

<style lang="less" scoped>
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
  width: 300px;
  height: 300px;
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
.ceshi {
  padding: 2rem;
  display: flex;
  .left {
    width: 35%;
    height: calc(100vh - 4rem);
    border: 1px solid #c0c4cc;
    border-radius: 4px;
    padding: 1rem;
    box-sizing: border-box;
    min-height: 580px;
    position: relative;
  }
  .moddle {
    height: calc(100vh - 4rem);
    width: 65%;
    padding: 0 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .form {
    padding: 1rem;
    box-sizing: border-box;
    border: 1px solid #c0c4cc;
    border-radius: 4px;
    margin-bottom: 1rem;
    height: 200px;
    .form-title {
      // margin-left: 100px;
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