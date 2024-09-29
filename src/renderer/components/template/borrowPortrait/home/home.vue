<template>
  <div id="home">
    <!-- 配置页密码弹框 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" title="管理员密码"
      :visible.sync="dialogFormVisible">
      <el-form :model="adminForm">
        <el-form-item label="密码" label-width="50px">
          <el-input ref="adminForm" id="adminForm" @focus="adminInputFocus()" show-password
            style="border: 1px solid #ccc;" v-model="adminForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false, adminForm = {}, keySet.show = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
      <keybord :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show">
      </keybord>
    </el-dialog>
    <!-- ------------- -->
    <img class="home_bg" src="@/assets/images/lightPortrait/home_bg.png" alt />
    <div style="z-index:999999999;position:absolute;top:15px;right:16px;display:flex;width:34%">
      <span style="margin:0 13px;font-size:27px">{{ newDate }}</span>
      <img src="./Wifi.png" alt="" v-if="onLine == false" style="width:27px;height:27px" />
      <img src="./ic_Wi-Fi3.png" alt="" style="width:27px;height:27px" v-else />
    </div>
    <div class="home_title pointer home_title_light font-56 font-bold font-hei text-center" @click="goSetting">
      <div v-if="platform && platform.name">
        {{ platform && platform.name }}
      </div>
      自助办证借还一体机
    </div>
    <div class="light_list flex-row">
      <div class="borrow bor-rad-20 posi-rela pointer" @click="goChild('borrow')">
        <img src="@/assets/images/light/borrow_bg.png" alt />
        <div class="posi-center">
          <div class="w-light-tag margin-center">
            <img src="@/assets/images/lightPortrait/borrow_tag.png" alt />
          </div>
          <div class="font-24 color-white text-center mt-20 font-bold">
            借书
          </div>
        </div>
      </div>
      <div class="light_right flex-one">
        <!-- <div
          class="back bor-rad-20 posi-rela pointer"
          @click="goChild('return')"
        >
          <img
            class="back_bg"
            src="@/assets/images/lightPortrait/borrow_bg_other.png"
            alt
          />
          <div class="posi-center">
            <div class="w-light-tag margin-center">
              <img src="@/assets/images/lightPortrait/back_tag.png" alt />
            </div>
            <div class="font-24 color-white text-center mt-20 font-bold">还书</div>
          </div>
        </div> -->

        <div class="right_bottom flex-row" style="margin-top:0px">
          <div class="continue bor-rad-20 posi-rela pointer"
            style="background: linear-gradient(180deg, #F9A711 0%, #FB9A31 100%);" @click="goChild('return')">
            <img src="@/assets/images/lightPortrait/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/lightPortrait/back_tag.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20 font-bold">
                还书
              </div>
            </div>
          </div>
          <div class="search bor-rad-20 posi-rela pointer"
            style="background: linear-gradient(180deg, #6FBEF5 0%, #5167C7 100%);" @click="goChild('getCard')">
            <img src="@/assets/images/lightPortrait/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/card/card.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20 font-bold">
                办卡
              </div>
            </div>
          </div>
        </div>
        <div class="right_bottom flex-row">
          <div class="continue bor-rad-20 posi-rela pointer" @click="goChild('renew')">
            <img src="@/assets/images/lightPortrait/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/lightPortrait/continue_tag.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20 font-bold">
                续借
              </div>
            </div>
          </div>
          <div class="search bor-rad-20 posi-rela pointer" @click="goChild('search')">
            <img src="@/assets/images/lightPortrait/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/lightPortrait/search_tag.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20 font-bold">
                查询
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <copyright :color="'black'" :platform="platform.name" />

  </div>
</template>

<script>
import copyright from "@/components/common/copyright";
import { ipcRenderer } from 'electron'
export default {
  components: {
    copyright,
    keybord: () => import("@/components/common/keyboardHome.vue"),
  },
  data() {
    return {
      numberconfig: 0,
      onLine: navigator.onLine,
      newDate: new Date(),
      number: 0,
      interval: "",
      settingKey: {
        borrow: {
          one: "selfServiceBorrowIsLoan",
          two: "",
        },
        return: {
          one: "selfServiceBorrowIsRestitution",
          two: "",
        },
        renew: {
          one: "selfServiceBorrowIsRenew",
          two: "",
        },
        search: {
          one: "selfServiceBorrowIsInquire",
          two: "",
        },
        getCard: {
          one: "selfServiceCardMachineIsCard",
          two: "",
        },
      },
      list: {
        getCard: [
          {
            name: "菜单名称",
            select: false,
            ico: "auth_",
            path: "/getCard/",
          },
          {
            name: "采集人脸信息",
            select: false,
            ico: "scan_",
            path: "/getCard/face",
          },
          {
            name: "补全信息",
            select: false,
            ico: "info_",
            path: "/getCard/info",
          },
          {
            name: "支付押金",
            select: false,
            ico: "pay_",
            path: "/getCard/pay",
          },
          {
            name: "办卡成功",
            select: false,
            ico: "success_",
            path: "/getCard/success",
          },
        ],
        borrow: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
          },
          {
            name: "进行认证",
            select: false,
            ico: "loading_",
          },
          {
            name: "确认密码",
            select: false,
            ico: "password_",
            path: "/borrow/password",
          },
          {
            name: "放置图书",
            select: false,
            ico: "book_",
            path: "/borrow/book",
          },
          {
            name: "确认信息",
            select: false,
            ico: "info_",
            path: "/borrow/info",
          },
          {
            name: "借书成功",
            select: false,
            ico: "success_",
          },
        ],
        return: [
          {
            name: "放置图书",
            select: false,
            ico: "book_",
            path: "/return/book",
          },
          {
            name: "确认信息",
            select: false,
            ico: "info_",
            path: "/return/info",
          },
          {
            name: "还书成功",
            select: false,
            ico: "success_",
          },
        ],
        renew: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
          },
          {
            name: "进行认证",
            select: false,
            ico: "loading_",
          },
          {
            name: "确认密码",
            select: false,
            ico: "password_",
            path: "/renew/password",
          },
          {
            name: "选择图书",
            select: false,
            ico: "select_",
            path: "/renew/select",
          },
          {
            name: "续借成功",
            select: false,
            ico: "success_",
          },
        ],
        search: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
          },
          {
            name: "进行认证",
            select: false,
            ico: "loading_",
          },
          {
            name: "确认密码",
            select: false,
            ico: "password_",
            path: "/search/password",
          },
          {
            name: "选择查询项目",
            select: false,
            ico: "projects_",
            path: "/search/projects",
          },
        ],
      },
      dialogFormVisible: false,
      adminForm: {
        password: ''
      },//管理员
      keySet: {
        show: false,
        top: 430,
        left: 168,
      },
      adminInputFocusData:false,
    };
  },
  computed: {
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    httpUrl() {
      return this.$store.state.Setting.httpUrl;
    },
    appType() {
      return this.$store.state.Setting.appType;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    let that = this;
    this.timer = setInterval(function () {
      that.newDate = new Date().toLocaleString();
    });
  },
  created() { },
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 管理员密码框聚焦
    adminInputFocus() {
      this.adminInputFocusData = true;
      this.keySet.show = true
    },
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
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
      console.log(data, '--data');
      if (data && data != "del"&&data!='out') {
        this.adminForm.password =
          this.adminForm.password + data;
      } else if (data == "del") {
        this.adminForm.password = this.adminForm.password
          .toString()
          .substring(0, this.adminForm.password.length - 1);
      }else if(data == "out") {
        this.changeOpen(false)
      }else {
        this.adminForm.password = "";
      }
      // let input = document.getElementById('adminForm');
      // input.focus();
      // this.changeOpen(true);
    },
    /**
     * @description:获取系统设置
     */
    getSystemSetting() {
      this.$axios
        .get("/hardware/manage/hardwareManageSetting", {
          platformId: this.platform.id,
        })
        .then((res) => {
          this.$store.dispatch("modifyManageSetting", res.data);
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "获取系统设置失败");
        });
    },
    goChild(name) {
      if (!this.httpUrl) {
        this.$alert("请先设置服务器修信息", "提示");
        return;
      }
      let key = this.settingKey[name][this.appType];
      if (!this.manageSetting[key]) {
        this.$alert("暂未开放此功能", "提示");
        this.getSystemSetting();
        return;
      }
      let list = this.list[name];
      if (
        (this.appType == "one" &&
          !this.manageSetting.selfServiceBorrowIsPassword) ||
        (this.appType == "two" &&
          !this.manageSetting.selfServiceCardMachineIsPassword)
      ) {
        /** 借还机,未开密码验证，去掉这一步 */
        let spliceIndex = "";
        list.forEach((it, ix) => {
          if (it.ico == "password_") {
            spliceIndex = ix;
          }
        });
        if (spliceIndex || spliceIndex === 0) {
          list.splice(spliceIndex, 1);
        }
      }
      console.log(list);
      this.$store.dispatch("modifyProgreeList", list);
      let path = "/portrait/" + name;
      console.log(path);
      if (name == "getCard") {
        path = name;
      }
      this.$router.push(path);
    },
    goSetting() {
      clearTimeout(this.interval);
      this.numberconfig = this.numberconfig += 1
      if (this.numberconfig == 1) {
        ipcRenderer.sendSync('updateConfig')
        ipcRenderer.on('message-main-config', (event, message) => {
          console.log(message, '--message');
          this.$store.dispatch("modifySettingConfig", message);
        })
      }
      if (this.number >= 3) {
        this.dialogFormVisible = true
        // this.$router.push("/service");
      } else {
        this.number = this.number + 1;
      }
      this.interval = setTimeout(() => {
        this.number = 0;
      }, 2000);
    },
    // 2024-01-06新增弹框密码,修改了这里
    save() {
      if (!this.adminForm.password) return this.$message.error('请先输入管理员密码')
      const password = "LJZT" + this.getCurrentDate();
      if (this.adminForm.password == password) {
        this.$router.push("/service");
        this.adminForm.password = ''
        this.keySet.show = false
      } else {
        return this.$message.error('管理员密码错误')
      }
    },
    // 获取当前年月日的函数
    getCurrentDate() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = this.addLeadingZero(currentDate.getMonth() + 1);
      const day = this.addLeadingZero(currentDate.getDate());

      return `${year}${month}${day}`;
    },

    // 将个位数的月份或日期前面补零的函数
    addLeadingZero(number) {
      return number < 10 ? "0" + number : number;
    }
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/home.less";
@import "~@/assets/less/common.less";
@import "~@/assets/less/su.less";
</style>
