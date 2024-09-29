<template>
  <div class="readCard">
    <div v-if="status == 'start'">
      <img
          :src="require('@/assets/images/' + skin + '/read_card.png')"
          class="margin-center"
          :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
          alt
      />
      <div class="mt-20 color-blue font-18 text-center">
        请将读者卡放到指定位置
      </div>
    </div>
    <div class="book-error" v-if="status == 'fail'">
      <img
          class="margin-center"
          :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
          :src="
          require('@/assets/images/' +
            skin +
            '/' +
            (skin == 'child'
              ? 'read_error.png'
              : skin == 'dark'
              ? 'auth_error.png'
              : 'read_card_error.png'))
        "
          alt
      />
      <div class="flex-row flex-center">
        <img class="w-24" src="@/assets/images/child/error_icon.png" alt/>
        <div class="color-red font-18">刷卡失败{{ readCardError ? '，' + readCardError : '' }}</div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button class="form-blue-btn font-24 mr-10" @click="start">
          继续尝试
        </button>
        <button class="form-yellow-btn font-24" @click="recertify">
          更换认证方式
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer";
import {mapState} from "vuex";

export default {
  data() {
    return {
      readCardError: '',
      status: "start",
    };
  },
  created() {
    this.testReader = test.init();
    this.$store.dispatch("add_to_log", "读者卡认证");

    this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.start();
  },
  mounted() {
  },
  computed: {
    ...mapState(["Setting", "User"]),
    skin() {
      return this.$store.state.Setting.skin;
    },
    readerCardType() {
      return this.$store.state.Setting.readerCardType;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    appType() {
      return this.$store.state.Setting.appType
    }
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.readFail();
      }
    },
  },
  destroyed() {
    this.$store.commit("set_label_name", "");
    clearTimeout(this.interval);
    if (this.status != "success") {
      this.testReader.stopReaderCard();
    }
  },
  methods: {
    /**
     * @description:重新选择认证方式。
     */
    recertify() {
      this.$store.dispatch(
          "modifyProgreeList",
          this.$func.setPrevFalse(JSON.parse(JSON.stringify(this.list)))
      );
      this.$router.go(-1);
    },
    /**
     * @description:读取读者卡信息
     */
    start() {
      this.$store.dispatch("modifyCaption", "请将读者卡放置到指定位置");
      this.$store.dispatch("modifyBack", true);
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "card");
      });
      this.status = "start";
      let jumpStatus = false;
      let status = this.testReader.readReaderCard(
          this.readerCardType,
          (data) => {
            if (data && !jumpStatus) {
              this.status = "succes";
              this.testReader.stopReaderCard();
              jumpStatus = true;
              this.readSuccess(data);
            }
          }
      );
      if (status == 601) {
        this.$store.dispatch("add_to_error_log", "调用读者卡api失败");
      }
    },
    /**
     * @description:读取失败
     */
    readFail(msg) {
      this.$store.dispatch("add_to_log", msg || "读者卡读卡失败");
      this.$store.dispatch("modifyCaption", "刷卡失败");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "fail");
      });
      this.$store.dispatch("modifyBack", false);
      this.status = "fail";
    },
    /**
     * @description:读取成功
     */
    readSuccess(data) {
      this.readCardError = ""
      this.$store.dispatch("add_to_log", "读者卡读卡成功");
      this.$axios
          .get("/hardware/interface/readerNumber", {
            certificateNumber: data,
            platformId: this.platform.id,
            type: 1,
          })
          .then((res) => {
            this.$store.dispatch("modifyReadCard", res.data);
            if (
                (this.appType == "one" &&
                    !this.manageSetting.selfServiceBorrowIsPassword) ||
                (this.appType == "two" &&
                    !this.manageSetting.selfServiceCardMachineIsPassword)
            ) {
              this.peopleLogin();
              return;
            }
            //获取读者卡信息存入vuex然后跳转
            this.$router.push({
              path: this.$func.getNextPath(this.list),
            });
          })
          .catch((err) => {
            this.readCardError = err
            this.readFail();
          });
    },
    /**
     * 不使用密码登录
     */
    peopleLogin() {
      let query = {
        idNumber: this.User.idNumberInfo.number,
        platformId: this.Setting.platform.id,
        readerNumber: this.User.readCard || this.User.codeInfo, //读者证号或者二维码读取的读者证号
        type: this.User.authType,
        hardwareType: this.Setting.appType == 'one' ? 1 : 2
      };
      this.$axios
          .post("/hardware/interface/readerLogin", query)
          .then((result) => {
            let data = result.data;
            this.$store.dispatch("add_to_log", "未使用密码登录成功");
            this.$store.dispatch("modifyUserInfo", data);
            if (this.User.authType == 3) {
              this.$store.dispatch("modifyReadCard", data.number);
            }
            this.lookAfter();
          })
          .catch((err) => {
            this.$store.dispatch("add_to_error_log", "未使用密码登录失败");
            this.$func.toast({
              content: err || "认证错误",
              type: "WARNING",
            });
          });
    },
    /**
     * 查看逾期数据
     */
    lookAfter() {
      this.$axios
          .get("/hardware/interface/borrowingInformationOverdue", {
            readerNumber: this.User.readCard || this.User.codeInfo,
            platformId: this.Setting.platform.id,
          })
          .then((over) => {
            console.log(over);
            let list = over.data.content || [];
            list.forEach((it) => {
              it.borrowAlso = this.$func.changeDate(it.borrowAlso);
            });
            if (!list || !list.length) {
              this.$router.push({
                path: this.$func.getNextPath(this.list),
              });
            } else {
              this.$store.dispatch("add_to_log", "读者有逾期数据");
              this.$store.dispatch("modifyOverduce", list);
              this.$router.push({
                path: "/overduce",
              });
            }
          })
          .catch((err) => {
            this.$store.dispatch("add_to_error_log", "读者逾期数据获取失败");
            // this.$func.toast({
            //   content: "系统错误，请联系管理员",
            //   type: "ERROR",
            // });
          });
    },
  },
};
</script>

<style lang="less" scoped>
.readCard {
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
