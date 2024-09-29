<template>
  <div class="door-show">
    <div class="door-box">
      <div class="box-left">
        <div class="header">
          <div>高频安全门配置</div>
          <div>
            <el-button @click="back" v-if="doorSetting && doorSetting.ip"
              >返回</el-button
            >
          </div>
        </div>
        <div class="body">
          <div class="setting-form">

<!--            <el-tabs v-model="activeName" type="card">-->
<!--              <el-tab-pane label="原始配置" name="first">-->


<!--            <div class="form-line" style="margin-top: 2rem">-->
<!--              <div class="form-label font-28">安全门类型</div>-->
<!--              <div class="form-value">-->
<!--                <el-select-->
<!--                    v-model="inputInfo.rfidType"-->
<!--                    class="form-input"-->
<!--                    style="padding: 0 !important; border-radius: 6px !important;display: flex !important;"-->
<!--                >-->
<!--                  <el-option label="高频" value="hf"></el-option>-->
<!--                  <el-option label="超高频" value="uhf"></el-option>-->
<!--                </el-select>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="form-line">-->
<!--              <div class="form-label font-28">安全门IP</div>-->
<!--              <div class="form-value">-->
<!--                <div-->
<!--                  class="form-input"-->
<!--                  :class="-->
<!--                    className.indexOf('doorIp') != -1 ? 'form-input-acitve' : ''-->
<!--                  "-->
<!--                  :style="skin != 'child' ? 'border-radius:5px' : ''"-->
<!--                >-->
<!--                  <input-->
<!--                    class="font-28 mr-10"-->
<!--                    id="doorIp"-->
<!--                    v-model="inputInfo.doorIp"-->
<!--                    @blur="delName('doorIp')"-->
<!--                    @focus.stop="addName('doorIp')"-->
<!--                    @click.stop=""-->
<!--                    type="text"-->
<!--                    placeholder="请输入IP，例(192.168.1.10;192.168.1.11)"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="form-line">-->
<!--              <div class="form-label font-28">服务器地址</div>-->
<!--              <div class="form-value">-->
<!--                <div-->
<!--                  class="form-input"-->
<!--                  :class="-->
<!--                    className.indexOf('httpUrl') != -1-->
<!--                      ? 'form-input-acitve'-->
<!--                      : ''-->
<!--                  "-->
<!--                  :style="skin != 'child' ? 'border-radius:5px' : ''"-->
<!--                >-->
<!--                  <input-->
<!--                    id="httpUrl"-->
<!--                    class="font-28 mr-10"-->
<!--                    v-model="inputInfo.httpUrl"-->
<!--                    @blur="delName('httpUrl')"-->
<!--                    @focus.stop="addName('httpUrl')"-->
<!--                    @click.stop=""-->
<!--                    type="text"-->
<!--                    placeholder="请输入地址，例(http://192.168.1.10:8003?plarformId=123)"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="form-line">-->
<!--              <div class="form-label font-28">管理密码</div>-->
<!--              <div class="form-value">-->
<!--                <div-->
<!--                  class="form-input"-->
<!--                  :class="-->
<!--                    className.indexOf('password') != -1-->
<!--                      ? 'form-input-acitve'-->
<!--                      : ''-->
<!--                  "-->
<!--                  :style="skin != 'child' ? 'border-radius:5px' : ''"-->
<!--                >-->
<!--                  <input-->
<!--                    id="password"-->
<!--                    class="font-28 mr-10"-->
<!--                    v-model="inputInfo.password"-->
<!--                    @blur="delName('password')"-->
<!--                    @focus.stop="addName('password')"-->
<!--                    @click.stop=""-->
<!--                    :type="showPassword ? 'text' : 'password'"-->
<!--                    placeholder="请输入"-->
<!--                  />-->
<!--                  <img-->
<!--                    :src="-->
<!--                      showPassword-->
<!--                        ? require('@/assets/images/child/eyeOpen.png')-->
<!--                        : require('@/assets/images/child/eyeClose.png')-->
<!--                    "-->
<!--                    class="w-24 pointer"-->
<!--                    alt-->
<!--                    @click="changeShow"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="form-line">-->
<!--              <div class="form-label font-28">硬件密码</div>-->
<!--              <div class="form-value">-->
<!--                <div-->
<!--                  class="form-input"-->
<!--                  :class="-->
<!--                    className.indexOf('hardwarePassword') != -1-->
<!--                      ? 'form-input-acitve'-->
<!--                      : ''-->
<!--                  "-->
<!--                  :style="skin != 'child' ? 'border-radius:5px' : ''"-->
<!--                >-->
<!--                  <input-->
<!--                    class="font-28 mr-10"-->
<!--                    id="hardwarePassword"-->
<!--                    v-model="inputInfo.hardwarePassword"-->
<!--                    @blur="delName('hardwarePassword')"-->
<!--                    @focus.stop="addName('hardwarePassword')"-->
<!--                    @click.stop=""-->
<!--                    :type="showHardwarePassword ? 'text' : 'password'"-->
<!--                    placeholder="请输入"-->
<!--                  />-->
<!--                  <img-->
<!--                    :src="-->
<!--                      showHardwarePassword-->
<!--                        ? require('@/assets/images/child/eyeOpen.png')-->
<!--                        : require('@/assets/images/child/eyeClose.png')-->
<!--                    "-->
<!--                    class="w-24 pointer"-->
<!--                    alt-->
<!--                    @click="showHardwarePassword = !showHardwarePassword"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="form-line">-->
<!--              <div class="form-label"></div>-->
<!--              <div class="form-btn">-->
<!--                <button-->
<!--                  class="form-blue-btn font-24 mr-20"-->
<!--                  :style="skin != 'child' ? 'border-radius:5px' : ''"-->
<!--                  @click="submit()"-->
<!--                >-->
<!--                  完成并返回-->
<!--                </button>-->
<!--              </div>-->
<!--            </div>-->

<!--              </el-tab-pane>-->
<!--              <el-tab-pane label="SIP2配置" name="second">-->
                <div class="form-line" style="margin-top: 2rem">
                  <div class="form-label font-28">安全门类型</div>
                  <div class="form-value">
                    <el-select
                            v-model="inputInfo.rfidType"
                            class="form-input"
                            style="padding: 0 !important; border-radius: 6px !important;display: flex !important;"
                    >
                      <el-option label="高频" value="hf"></el-option>
                      <el-option label="超高频" value="uhf"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="form-line">
                  <div class="form-label font-28">安全门IP</div>
                  <div class="form-value">
                    <div
                            class="form-input"
                            :class="
                    className.indexOf('doorIp') != -1 ? 'form-input-acitve' : ''
                  "
                            :style="skin != 'child' ? 'border-radius:5px' : ''"
                    >
                      <input
                              class="font-28 mr-10"
                              id="doorIp"
                              v-model="inputInfo.doorIp"
                              @blur="delName('doorIp')"
                              @focus.stop="addName('doorIp')"
                              @click.stop=""
                              type="text"
                              placeholder="请输入IP，例(192.168.1.10;192.168.1.11)"
                      />
                    </div>
                  </div>
                </div>
            <div class="form-line">
              <div class="form-label font-28">查询读者信息服务器地址</div>
              <div class="form-value">
                <div
                        class="form-input"
                        :class="
                    className.indexOf('tempURL') != -1
                      ? 'form-input-acitve'
                      : ''
                  "
                        :style="skin != 'child' ? 'border-radius:5px' : ''"
                >
                  <input
                          id="tempURL"
                          class="font-28 mr-10"
                          v-model="inputInfo.tempURL"
                          @blur="delName('tempURL')"
                          @focus.stop="addName('tempURL')"
                          @click.stop=""
                          type="text"
                          placeholder="请输入地址，例(http://192.168.1.10:8003)"
                  />
                </div>
              </div>
            </div>
                <div class="form-line">
                  <div class="form-label font-28">门禁数据写入服务器地址</div>
                  <div class="form-value">
                    <div
                            class="form-input"
                            :class="
                    className.indexOf('sip2URL') != -1
                      ? 'form-input-acitve'
                      : ''
                  "
                            :style="skin != 'child' ? 'border-radius:5px' : ''"
                    >
                      <input
                              id="sip2URL"
                              class="font-28 mr-10"
                              v-model="inputInfo.sip2URL"
                              @blur="delName('sip2URL')"
                              @focus.stop="addName('sip2URL')"
                              @click.stop=""
                              type="text"
                              placeholder="请输入地址，例(http://192.168.1.10:8003)"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-line">
                  <div class="form-label font-28">设备名称</div>
                  <div class="form-value">
                    <div
                            class="form-input"
                            :class="
                    className.indexOf('snName') != -1
                      ? 'form-input-acitve'
                      : ''
                  "
                            :style="skin != 'child' ? 'border-radius:5px' : ''"
                    >
                      <input
                              id="snName"
                              class="font-28 mr-10"
                              v-model="inputInfo.snName"
                              @blur="delName('snName')"
                              @focus.stop="addName('snName')"
                              @click.stop=""
                              type="text"
                              placeholder="可填写单位名称；非必填"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-line">
                  <div class="form-label font-28">设备序列号</div>
                  <div class="form-value">
                    <div
                            class="form-input"
                            :class="
                    className.indexOf('snCode') != -1
                      ? 'form-input-acitve'
                      : ''
                  "
                            :style="skin != 'child' ? 'border-radius:5px' : ''"
                    >
                      <input
                              id="snCode"
                              class="font-28 mr-10"
                              v-model="inputInfo.snCode"
                              @blur="delName('snCode')"
                              @focus.stop="addName('snCode')"
                              @click.stop=""
                              type="text"
                              placeholder="设备的唯一标识；必填·"
                      />
                    </div>
                  </div>
                </div>


                <div class="form-line">
                  <div class="form-label"></div>
                  <div class="form-btn">
                    <button
                            class="form-blue-btn font-24 mr-20"
                            :style="skin != 'child' ? 'border-radius:5px' : ''"
                            @click="submit('sip2')"
                    >
                      完成并返回
                    </button>
                  </div>
                </div>
<!--              </el-tab-pane>-->
<!--            </el-tabs>-->
          </div>
        </div>
      </div>
    </div>

    <keybord
      :type="keySet.type"
      :top="keySet.top"
      @result="getResult"
      :left="keySet.left"
      v-if="keySet.show"
    ></keybord>
  </div>
</template>

<script>
import md5 from "md5";
import test from "@/api/hardWare_renderer.js";
import Sip2Mixin from './sip2'
export default {
  mixins:[Sip2Mixin],
  components: {
    keybord: () => import("@/components/common/keyboard.vue"),
  },
  data() {
    return {
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      backSetting: {
        showTime: false,
        titleType: "setting",
        back: false,
      },
      inputInfo: {
        rfidType:'hf',
        password: "",
        httpUrl: "",
        hardwarePassword: "",
        sip2URL:"",
        snCode:"",
        snName:"",
        tempURL:"",
      },
      className: "", //选中的输入框
      showPassword: false,
      showHardwarePassword: false,
      testReader: "",
      sip2URL:"",
      selectName: "", //当前框的className
    };
  },
  created() {
    this.testReader = test.init();
  },
  mounted() {
    document.body.addEventListener("click", (data) => {
      console.log(data, "data");
      if (this.keySet.show) {
        this.className = this.className.replace(this.selectName, "");
        this.changeOpen(false);
      }
    });
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    http() {
      return this.$store.state.Setting.httpUrl
        ? this.$store.state.Setting.httpUrl +
            "?platformId=" +
            this.$store.state.Setting.platform.id
        : "";
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
    doorSetting() {
      return this.$store.state.Setting.doorSetting;
    },
    useSip2:() => !!JSON.parse(localStorage.getItem("useSip2")),
  },
  watch: {
    http: {
      handler(val) {
        if (val) {
          this.inputInfo.httpUrl = val;
        }
      },
      immediate: true,
    },
    doorSetting: {
      handler(val) {
        this.inputInfo.doorIp = val.ip;
        this.inputInfo.rfidType = val.rfidType||"hf";
      },
      immediate: true,
      deep: true,
    },
    useSip2:{
      handler(val) {
        this.inputInfo.sip2URL = localStorage.getItem("sip2URL")||"";
        this.inputInfo.snCode = localStorage.getItem("snCode")||"";
        this.inputInfo.snName = localStorage.getItem("snName")||"";
        this.inputInfo.tempURL = localStorage.getItem("tempURL")||"";
      },
      immediate: true,
    }
  },
  methods: {
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
      this.setKeybord(name);
    },
    /**
     * 改变键盘的状态
     */
    changeOpen(status) {
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
        this.inputInfo[this.selectName] = this.inputInfo[
          this.selectName
        ].substring(0, this.inputInfo[this.selectName].length - 1);
      } else {
        this.inputInfo[this.selectName] = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = document.getElementById(name);
      this.keySet.top = item.offsetTop + item.offsetHeight + 10;
      this.keySet.left = item.offsetLeft;
      this.changeOpen(true);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.selectName = name;
    },
    /**
     * @description:切换类型
     */
    changeShow() {
      this.showPassword = !this.showPassword;
    },
    back() {
      if (this.platform && this.platform.id) {
        this.$router.go(-1);
      } else {
        this.$router.replace("/");
      }
    },
    /**
     * @description:提交
     */
    submit(type) {
      if(type){
        if(!this.inputInfo.sip2URL||!this.inputInfo.tempURL){
          this.$alert("请输入服务器地址", "提示");
          return;
        }
        localStorage.setItem("sip2URL",this.inputInfo.sip2URL)
        if(!this.inputInfo.snCode){
          this.$alert("请输入设备的唯一标识", "提示");
          return;
        }
        localStorage.setItem("snCode",this.inputInfo.snCode)
        localStorage.setItem("snName",this.inputInfo.snName||"")
        localStorage.setItem("useSip2","true")
        localStorage.setItem("tempURL",this.inputInfo.tempURL)
        localStorage.setItem("doorIp",this.inputInfo.doorIp)
        //this.$router.replace("/");
        this.testReader.setHighDoorIp({
                  doorIp: this.inputInfo.doorIp,
                  rfidType: this.inputInfo.rfidType,
                  callback: (status) => {
                    if (status == 611) {
                      this.$message.error("安全门IP设置错误");
                      return;
                    }
                    console.log(status);
                    this.$message.success("设置成功");
                    this.$store.dispatch("modifyDoorSetting", {
                      ip: this.inputInfo.doorIp,
                    });
                    this.$router.replace("/");
                  },
                });
        return;
      }
      let info = Object.assign({}, this.inputInfo);
      let err = "";
      if (!info.doorIp) {
        err = "请输入安全门Ip";
      }
      if (!info.httpUrl) {
        err = "请输入服务器地址";
      }
      if (!info.password) {
        err = "请输入管理密码";
      }
      if (!info.hardwarePassword) {
        err = "请输入硬件密码";
      }
      if (err) {
        this.$alert(err, "提示");
        return;
      }
      localStorage.setItem("useSip2",null)
      let urlList = info.httpUrl.split("?");
      let http = urlList[0];
      if(http.indexOf('http')<0){
          this.$alert("请输入正确的服务器地址","提示")
          return;
      }
      let plat = urlList[1].split("=");
      let id = plat[1];
      this.$axios
        .get(http + "/hardware/interface/login", {
          hardwarePassword: info.hardwarePassword,
          password: md5(info.password),
          uuid: this.uuid,
          platformId: id,
        })
        .then((res) => {
                this.testReader.setHighDoorIp({
                  doorIp: info.doorIp,
                  rfidType: info.rfidType,
                  callback: (status) => {
                    if (status == 611) {
                      this.$message.error("安全门IP设置错误");
                      return;
                    }
                    console.log(status);
                    this.$store.dispatch("modifyHttpUrl", http);
                    localStorage.setItem("httpUrl", http);
                    this.$message.success("设置成功");
                    this.$store.dispatch("modifyPlatform", res.data);
                    localStorage.setItem("platform", JSON.stringify(res.data));
                    this.$store.dispatch("modifyDoorSetting", {
                      ip: info.doorIp,
                    });
                    this.$router.replace("/");
                  },
                });
        }).catch(err=>{
        this.$alert(err,"提示")
      })
    },
  },
};
</script>

<style lang="less" scoped>
.setting-form {
  width: 100%;
  .form-line {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 30px;
    .form-label {
      width: 35%;
      text-align: right;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
      padding-right: 20px;
    }
    .form-value {
      flex: 1;
    }
    .form-btn {
      margin-top: 2;
    }
  }
}
.door-show {
  background-color: #f0f2f5;
  width: 100%;
  height: 100vh;
  padding: 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .door-box {
    display: flex;
    flex: 1;
  }
  .box-left {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header {
      background-color: rgb(40, 120, 255);
      height: 80px;
      font-size: 20px;
      color: white;
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      align-items: center;
      box-sizing: border-box;
    }
    .body {
      background-color: white;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .name {
        font-size: 18px;
        font-weight: bold;
        margin-top: 1rem;
      }
      .number {
        font-size: 92px;
        letter-spacing: 6px;
      }
    }
  }
}
</style>
