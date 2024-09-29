<template>
  <background :setting="backSetting">
    <template v-slot:body>
      <div class="setting-form posi-center-top-10">
        <div class="form-line" v-if="applicationType && applicationType !== 'card_machine'">
          <div class="form-label font-28">读写板类型</div>
          <div class="form-value">
            <el-select v-model="inputInfo.rfidType" class="form-input font-28"
              style="padding: 0 !important; border-radius: 6px !important">
              <el-option label="高频" value="hf"></el-option>
              <el-option label="超高频" value="uhf"></el-option>
            </el-select>
          </div>
        </div>
        <div class="form-line">
          <div class="form-label font-28">读写板型号</div>
          <div class="form-value">
            <el-select v-model="inputInfo.highBoard" class="form-input" placeholder="请选择"
              v-if="inputInfo.rfidType == 'hf'" style="
                                            padding: 0 !important;
                                            border-radius: 6px !important;
                                            display: flex !important;
                                          ">
              <el-option label="M201" value="M201"></el-option>
              <el-option label="RL8000" value="RL8000"></el-option>
              <el-option label="LR601" value="LR601"></el-option>
            </el-select>
            <el-select v-model="inputInfo.superBoard" class="form-input" placeholder="请选择" v-else style="
                                            padding: 0 !important;
                                            border-radius: 6px !important;
                                            display: flex !important;
                                          ">
              <el-option label="M60" value="M60"></el-option>
              <el-option label="UM200" value="UM200"></el-option>
              <el-option label="RRU9880" value="RRU9880"></el-option>
            </el-select>
          </div>
        </div>

        <div class="form-line" v-if="applicationType && applicationType !== 'card_machine'">
          <div class="form-label font-28">连接方式</div>
          <div class="form-value">
            <el-select v-model="inputInfo.readBlockType" class="form-input font-28"
              style="padding: 0 !important; border-radius: 6px !important">
              <el-option label="串口" value="串口"></el-option>
              <el-option label="USB" value="USB"></el-option>
            </el-select>
          </div>
        </div>

        <!-- <div class="form-line" v-if="applicationType && applicationType !== 'card_machine'">
          <div class="form-label font-28">办证配置</div>
          <div class="form-value">
            <el-radio-group class="ml40"  @input="getBase" v-model="base">
              <el-radio label="0">无</el-radio>
              <el-radio label="8">8进制</el-radio>
              <el-radio label="10">10进制</el-radio>
              <el-radio label="16">16进制</el-radio>
              <el-radio label="32">32进制</el-radio>
            
            </el-radio-group>
          </div>
        </div> -->

        <div class="form-line">

          <div class="form-label font-28">
            服务器地址
          </div>
          <div class="form-value">
            <div class="form-input font-28" style="padding: 0 !important; border-radius: 6px !important">
              <el-select v-model="inputInfo.selectHttp" style="width: 120px">
                <el-option label="http" value="http://"></el-option>
                <el-option label="https" value="https://"></el-option>
              </el-select>
              <input class="font-28 mr-10" ref="httpUrl" id="httpUrl" v-model="inputInfo.httpUrl"
                @blur="delName('httpUrl')" @focus="addName('httpUrl')" @click.stop type="text"
                placeholder="请输入地址，例(http://192.168.10.131:8003)" />
            </div>



          </div>
        </div>
        <div class="form-line" v-if="applicationType && applicationType !== 'card_machine'">
          <div class="form-label font-28">平台ID</div>
          <div class="form-value">
            <div class="form-input font-28" style="padding: 0 !important; border-radius: 6px !important">
              <input ref="platformid" id="platformid" class="font-28 mr-10" v-model="inputInfo.platformid"
                @blur="delName('platformid')" @focus="addName('platformid')" @click.stop type="text"
                placeholder="请输入平台ID" style="padding-left:18px" />
            </div>
          </div>
        </div>
        <div class="form-line" v-show="inputInfo.rfidType == 'uhf'">
          <div class="form-label font-28"> 标签类型</div>
          <div class="form-value">
            <div class="form-input" style="width: 70%;border-radius:5px">
              <el-radio-group style="width:98%;display:flex;margin:0 1%" v-model="inputInfo.radioone"
                @change="agreeChange">
                <el-radio label="true">默认</el-radio>
                <el-radio label="false">U9</el-radio>
              </el-radio-group>

            </div>
          </div>
        </div>
        <div class="form-line" v-show="inputInfo.radioone == 'false' || inputInfo.rfidType == 'hf'">
          <div class="form-label font-28"> 图书借还方式</div>
          <div class="form-value">
            <div class="form-input" style="border-radius:5px">
              <el-radio-group style="width:100%" v-model="inputInfo.radiotwo">
                <el-radio label="true">条码号</el-radio>
                <el-radio label="false">rfid</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="form-line">
          <div class="form-label font-28"> 办卡吐卡</div>
          <div class="form-value">
            <div class="form-input" style="border-radius:5px">

              <el-switch v-model="inputInfo.Tuka" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
        </div>

        <!-- <div class="form-line">
          <div style="width:100%;margin-left:13%;display:flex">
            <div class="rowbox" style="width: 40%">
              <div class="form-label font-28" style="width: 38%;margin:1%;">
                读取标签user区
              </div>
              <div class="form-value">
                <div class="form-input" style="width: 70%;border-radius:5px" >
                  <el-radio-group style="width:98%;display:flex;margin:0 1%" v-model="inputInfo.radioone" @change="agreeChange">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                  </el-radio-group>

                </div>
              </div>
            </div>
            <div class="rowbox" style="width: 40%;margin-left:-7%" v-show="inputInfo.radioone == 'false'" >
              <div class="form-label font-28" style="width: 38%">图书借还方式</div>
              <div class="form-value">
                <div class="form-input" style="width: 80%;border-radius:5px">
                  <el-radio-group style="width:100%" v-model="inputInfo.radiotwo">
                    <el-radio label="true">条码号</el-radio>
                    <el-radio label="false">UID</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div class="form-line">
          <div class="marginbox">
            <div class="rowbox">
              <div class="form-label font-28" style="margin-right:18px">管理密码</div>
              <div class="form-value">
                <div class="form-input" :class="className.indexOf('password') != -1
                  ? 'form-input-acitve'
                  : ''
                  " :style="skin != 'child' ? 'border-radius:5px' : ''" style="width: 85%">
                  <input class="font-28 mr-10" ref="password" id="password" v-model="inputInfo.password"
                    @blur="delName('password')" @focus="addName('password')" @click.stop
                    :type="showPassword ? 'text' : 'password'" placeholder="请输入" />
                  <img :src="showPassword
                    ? require('@/assets/images/child/eyeOpen.png')
                    : require('@/assets/images/child/eyeClose.png')
                    " class="w-24 pointer" alt @click="changeShow" />
                </div>
              </div>
            </div>
            <div class="rowbox">
              <div class="form-label font-28" style="margin-right:18px">硬件密码</div>
              <div class="form-value">
                <div class="form-input" :class="className.indexOf('hardware') != -1
                  ? 'form-input-acitve'
                  : ''
                  " :style="skin != 'child' ? 'border-radius:5px' : ''" style="width: 85%">
                  <input class="font-28 mr-10" ref="hardware" id="hardware" v-model="inputInfo.hardware"
                    @blur="delName('hardware')" @focus="addName('hardware')" @click.stop
                    :type="showHardwarePassword ? 'text' : 'password'" placeholder="请输入" />
                  <img :src="showHardwarePassword
                    ? require('@/assets/images/child/eyeOpen.png')
                    : require('@/assets/images/child/eyeClose.png')
                    " class="w-24 pointer" alt @click="showHardwarePassword = !showHardwarePassword" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-line" v-show="inputInfo.radioone == 'false' || inputInfo.rfidType == 'hf'">
          <div class="form-label font-28"> 设备状态</div>
          <div class="form-value" style="">
            <div class="form-input"
              style="width: 75%;border-radius:5px;height: auto !important;display: flex; flex-wrap: wrap; background-color: rgba(0, 0, 0, 0) !important;">
              <div v-for="(item, index) in deviceStatusList" :key="index" style="margin: 2px;">
                <el-alert :closable="false" :title="item.name" :type="item.type ? 'success' : 'error'" show-icon>
                </el-alert>
              </div>
            </div>
          </div>
        </div>
        <div class="form-line">

          <div class="form-btn">
            <button class="form-blue-btn font-24" :style="skin != 'child' ? 'border-radius:5px' : ''" @click="submit">
              完成并返回
            </button>

            <button class="form-blue-btn font-24" :style="skin != 'child' ? 'border-radius:5px' : ''" @click="goCheck">
              硬件测试
            </button>
            <button class="form-yellow-btn font-24" v-if="platform.password"
              :style="skin != 'child' ? 'border-radius:5px' : ''" @click="goModify">
              修改硬件密码
            </button>
            <button class="form-yellow-btn font-24" :style="skin != 'child' ? 'border-radius:5px' : ''"
              @click="stopUse">
              停止使用
            </button>
          </div>
        </div>
      </div>
      <keybord :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show">
      </keybord>
    </template>
  </background>
</template>
<script>
import background from "@/components/common/background";
import { cardReaderFn, rfidReaderFn, cameraFn, cardDeliverFn, readIdCardFn } from './service_utils.js'
import md5 from "md5";
import uuid from "uuidjs";
import { ipcRenderer } from "electron";
import test from "@/api/hardWare_renderer";
export default {
  components: {
    background,
    keybord: () => import("@/components/common/keyboard.vue"),
  },
  data() {
    return {
      base: "0",
      applicationType: null,
      backSetting: {
        showTime: false,
        titleType: "setting",
        back: false,
      },
      inputInfo: {
        radioone: "true",
        radiotwo: "true",
        rfidType: "hf",
        readBlockType: "串口",
        password: "",
        username: "",
        httpUrl: "",
        hardware: "",
        highBoard: "",
        superBoard: "",
        selectHttp: "",
        platformid: "",
        Tuka: false,//是否吐卡
        settingConfig: false,//是否要检测硬件是否开启(注:第一次打开需要先配置好初始化应用后才能获取)
      },
      className: "", //选中的输入框
      selectName: "",
      showPassword: false,
      showHardwarePassword: true,

      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      deviceStatusList: [
        { name: '读写板', type: false },
        { name: '摄像头', type: false },
        { name: '打印机', type: false },
        { name: '身份证阅读器', type: false },
        { name: '扫码器', type: false },
        { name: '吐卡器', type: false },
        { name: '刷卡器', type: false },
        { name: '网络连接状态', type: false },
      ],
      // 硬件连接的状态
      hardwareData: {
        cardReader: false,
        rfidReader: false,
        camera: false,
        cardDeliver: false,
        readIdCard: false,
      }
    };
  },
  computed: {
    highboard() {
      return this.$store.state.Setting.highboard;
    },
    superboard() {
      return this.$store.state.Setting.superboard;
    },
    skin() {
      return this.$store.state.Setting.skin;
    },
    rfidType() {
      return this.$store.state.Setting.rfidType;
    },
    readBlockType() {
      return this.$store.state.Setting.readBlockType;
    },
    TukaType() {
      return this.$store.state.Setting.Tuka
    },
    http() {
      return this.$store.state.Setting.httpUrl
        ? this.$store.state.Setting.httpUrl
        : "";
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
  },
  watch: {
    TukaType: {
      handler(val) {
        if (val) {
          console.log(val, '办卡吐卡');
          this.inputInfo.Tuka = val || false;
        }
      }
    },
    highboard: {
      handler(val) {
        if (val) {
          console.log(this.inputInfo);
          console.log(val);
          this.inputInfo.highBoard = val || "";
        }
      },
      immediate: true,
    },
    base: {
      handler(val) {
        if (val) {
          this.base = this.$store.state.Setting.base;
        }
      },
      immediate: true,
    },
    superboard: {
      handler(val) {
        if (val) {
          this.inputInfo.superBoard = val || "";
        }
      },
      immediate: true,
    },
    rfidType: {
      handler(val) {
        if (val) {
          this.inputInfo.rfidType = val;
        }
      },
      immediate: true,
    },
    radioone: {
      handler(val) {
        if (val) {
          this.inputInfo.radioone = val;
        }
      }
    },
    radiotwo: {
      handler(val) {
        if (val) {
          this.inputInfo.radiotwo = val;
        }
      }
    },
    readBlockType: {
      handler(val) {
        if (val) {
          this.inputInfo.readBlockType = val;
        }
      },
      immediate: true,
    },
    http: {
      handler(val) {
        if (val) {
          let httpSplit = val.split(":");
          let https = httpSplit[1].split("//");
          this.inputInfo.selectHttp = httpSplit[0] + "://";
          if (!httpSplit[2]) {
            this.inputInfo.httpUrl = https[1];
          } else {
            this.inputInfo.httpUrl = https[1] + ":" + httpSplit[2];
          }
          this.inputInfo.platformid = this.$store.state.Setting.platform.id;
        }
      },
      immediate: true,
    },
    className(val) {
      console.log(val);
    },
  },
  created() {
    this.$store.dispatch("add_to_log", "配置服务器");
    this.applicationType = process.env.application;
  },
  mounted() {
    // ------------获取硬件的连接状态
    console.log(this.$store.state.Setting.settingConfig, '---settingConfig');
    if (this.$store.state.Setting.settingConfig) {
      this.hardwareStatus()
    }

    // ---------------------
    this.inputInfo.radioone = this.$store.state.Setting.radioone
    this.inputInfo.radiotwo = this.$store.state.Setting.radiotwo
    this.inputInfo.Tuka = this.TukaType || false
    document.body.addEventListener("click", (data) => {
      if (this.keySet.show) {
        this.className = this.className.replace(this.selectName, "");
        this.changeOpen(false);
      }
    });
  },
  methods: {
    // 获取硬件状态 2024-01-05新增
    async hardwareStatus() {
      this.hardwareData.cardReader = cardReaderFn();//刷卡器
      this.hardwareData.rfidReader = rfidReaderFn();//读写板
      // this.hardwareData.cardDeliver = cardDeliverFn();//吐卡器
      this.hardwareData.readIdCard = await readIdCardFn();//身份证阅读器
      this.hardwareData.camera = await cameraFn() //摄像头

      this.deviceStatusList.map(item => {
        switch (item.name) {
          case '刷卡器':
            item.type = this.hardwareData.cardReader;
            break;
          case '读写板':
            item.type = this.hardwareData.rfidReader;
            break;
          case '网络连接状态':
            item.type = window.navigator.onLine;
            break;
          case '摄像头':
            item.type = this.hardwareData.camera;
            break;
          case '吐卡器':
            item.type = false;
            // item.type = this.hardwareData.cardDeliver;
            break;
          case '身份证阅读器':
            item.type = true;
            break;
          case '打印机':
            item.type = true;
            break;
          case '扫码器':
            item.type = true;
            break;
        }
      })
    },
    getBase() {
      this.$store.dispatch('modifybase', this.base);
    },
    agreeChange(val) {
      let that = this
      that.inputInfo.radioone = (val === 'true') ? 'true' : 'false';
      if (that.inputInfo.radioone == 'true') {
        that.inputInfo.radiotwo = 'true'
      }
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = this.$refs[name].getBoundingClientRect();
      this.keySet.top = item.top + item.height + 10;
      this.keySet.left = item.left - 160;
      this.changeOpen(true);
    },
    /**
     * 改变键盘的状态
     */
    changeOpen(status) {
      console.log(status, '--status');
      this.keySet.show = status;
      this.keySet = Object.assign({}, this.keySet);
    },
    /**
     * 获取输入值
     */
    getResult(data) {
      if (data && data != "del") {
        this.inputInfo[this.selectName] =
          this.inputInfo[this.selectName] + data;
      } else if (data == "del") {
        this.inputInfo[this.selectName] = this.inputInfo[this.selectName]
          .toString()
          .substring(0, this.inputInfo[this.selectName].length - 1);
      } else {
        this.inputInfo[this.selectName] = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },

    /**
     * 停止使用
     */
    stopUse() {
      this.$prompt("请输入硬件密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "email",
      }).then((res1) => {
        if (res1.action == "confirm") {
          this.$axios
            .get("/hardware/interface/checkHardware", {
              password: res1.value,
              platformId: this.platform.id,
              uuid: this.uuid,
            })
            .then((r) => {
              this.$prompt("请输入停用验证密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "email",
              }).then((data) => {
                if (data.action == "confirm") {
                  localStorage.setItem("stopPassword", data.value);
                  this.$store.dispatch("add_to_log", "停用平台");
                  this.$router.replace("/stopUse");
                }
              });
            });
        }
      });
    },
    /**
     * @description:保存服务器配置
     */
    submit() {
      console.log(this.uuid, '---uuid');
      let info = Object.assign({}, this.inputInfo);
      console.log(info);
      let err = "";
      if (!info.httpUrl) {
        err = "请输入服务器地址";
      }
      if (!info.platformid) {
        err = "请输入平台ID";
      }
      if (!info.password) {
        err = "请输入管理密码";
      }
      if (!info.hardware) {
        err = "请输入硬件密码";
      }
      if (!info.rfidType) {
        err = "请选择读写板类型";
      }
      if (err) {
        this.$alert(err, "提示");
        return;
      }
      let http =
        info.httpUrl.indexOf("http" || "https") == 0
          ? info.httpUrl
          : info.selectHttp + info.httpUrl;
      this.$store.dispatch("add_to_log", "修改服务器配置");
      this.$axios
        .get(http + "/hardware/interface/login", {
          hardwarePassword: info.hardware,
          password: md5(info.password),
          uuid: this.uuid,
          platformId: info.platformid,
        })
        .then((res) => {
          this.inputInfo.settingConfig = true
          let setting = res.data;
          setting.rfidType = this.inputInfo.rfidType;
          setting.readBlockType = this.inputInfo.readBlockType;
          setting.boards =
            this.inputInfo.rfidType == "hf"
              ? this.inputInfo.highBoard
              : this.inputInfo.superBoard;
          setting.boardsType =
            this.inputInfo.rfidType == "hf" ? "rfid" : "uhfRFID";
          setting.radioone = this.inputInfo.radioone;
          setting.radiotwo = this.inputInfo.radiotwo;
          setting.Tuka = this.inputInfo.Tuka
          setting.settingConfig = this.inputInfo.settingConfig
          this.$store.dispatch("modifybase", this.base);
          localStorage.setItem("modifybase", this.base)
          ipcRenderer.sendSync("updateSetting", setting);
          this.$store.dispatch("add_to_log", "修改服务器配置成功");
          this.$store.dispatch("modifyHttpUrl", http);
          this.$store.dispatch("modifyRfidType", this.inputInfo.rfidType);
          this.$store.dispatch("modifyTukaType", this.inputInfo.Tuka);
          this.$store.dispatch(
            "modifyReadBlockType",
            this.inputInfo.readBlockType
          );
          this.$store.dispatch("modifyradioone", this.inputInfo.radioone);
          this.$store.dispatch("modifyradiotwo", this.inputInfo.radiotwo);
          this.$store.dispatch("modifyHighBoard", this.inputInfo.highBoard);
          this.$store.dispatch("modifySuperBoard", this.inputInfo.superBoard);
          console.log(this.inputInfo.settingConfig, '--this.inputInfo.settingConfig');
          this.$store.dispatch("modifySettingConfig", this.inputInfo.settingConfig);
          localStorage.setItem("httpUrl", http);
          localStorage.setItem("typetwo", this.inputInfo.radiotwo)
          localStorage.setItem("xingx", this.inputInfo.highBoard)
          this.$message.success("设置成功");
          this.$store.dispatch("modifyPlatform", res.data);
          localStorage.setItem("rfidType", this.inputInfo.rfidType); //储存uhf以及hf类型
          localStorage.setItem("platform", JSON.stringify(res.data));
          console.log(this.inputInfo, '--this.inputInfo');
          this.$router.replace("/");
        })
        .catch((err) => {
          console.log(err);
          this.$store.dispatch("add_to_log", err || "修改服务器配置失败");
          this.$func.toast({
            content: err,
            type: "WARNING",
          });
        });
    },
    /**
     * @description:添加name
     */
    addName(name) {
      if (this.className.indexOf(name) == -1) {
        this.className = this.className + name;
      }
      if (this.selectName && this.selectName != name) {
        this.className = this.className.replace(this.selectName, "");
        this.selectName = "";
      }
      this.selectName = name;
      console.log(name, 'name');
      this.setKeybord(name);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      console.log(name);
      this.selectName = name;
    },
    /**
     * @description:切换类型
     */
    changeShow() {
      this.showPassword = !this.showPassword;
    },
    /**
     * @description:去修改密码
     */
    goModify() {
      this.$router.push("/password");
    },
    goCheck() {
      this.$prompt("请输入硬件密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "email",
      }).then((res1) => {
        if (res1.action == "confirm") {
          if (!res1.value) {
            this.$func.toast({
              content: "请输入硬件密码",
              type: "WARNING",
            });
            return;
          }
          this.$axios
            .get("/hardware/interface/checkHardware", {
              password: res1.value,
              platformId: this.platform.id,
              uuid: this.uuid,
            })
            .then((r) => {
              this.$router.push("/ceshi");
            })
            .catch((err) => {
              err = err === "没有找到" ? "密码错误" : err;
              this.$func.toast({
                content: err,
                type: "WARNING",
              });
            });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.marginbox {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98%;
}

.rowbox {
  width: 35.5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting-form::v-deep {
  .form-line {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 30px;

    .form-input {
      .el-radio-group {

        .el-radio__label {
          font-size: 23px;
          font-weight: bold;
        }
      }
    }

    .marginbox {
      .rowbox {
        .form-value {}
      }
    }

    .form-label {
      width: 27%;

      text-align: right;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
      white-space: nowrap;
      padding-right: 23px;
    }

    .form-value {
      flex: 1;
    }

    .form-btn {
      margin: auto;




      button {
        margin-bottom: 0.5 rem;

      }
    }
  }
}

/deep/ .el-input__inner {
  height: 100%;
  font-size: 28px;
}

/deep/ .el-select-dropdown__item {
  font-size: 28px;
}

.el-select-dropdown__item {
  font-size: 28px;
  height: 42px;
  line-height: 42px;
}

/deep/ .el-input {
  height: 100%;
}

@media screen and (min-width: 1200px) {
  /deep/.el-input--suffix .el-input__inner {
    color: #333;
    font-size: 19px !important;

  }

  /deep/.el-dialog__title {
    font-size: 21px !important;
  }
}

@media screen and (min-width: 1920px) {
  /deep/.el-input--suffix .el-input__inner {
    color: #333;
    font-size: 25px !important;
  }

  /deep/.el-dialog__title {
    font-size: 30px !important;
  }
}
</style>
