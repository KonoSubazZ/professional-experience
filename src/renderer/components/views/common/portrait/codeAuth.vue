<template>
  <div class="readCard">
    <div v-if="status == 'start'"
         v-loading="loadings"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         >
      <img
        :src="require('@/assets/images/' + skin + '/read_code.png')"
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
        请将读者二维码对准识别框
      </div>
<!--      style="opacity: 0"-->
      <el-input
          v-model="code"
         style="opacity: 0"
          id="code-btn"
          @blur="getFocus"
          autofocus="true"
      ></el-input>

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
              : 'read_code_error.png'))
        "
        alt
      />
      <div class="flex-row flex-center">
        <img class="w-24" src="@/assets/images/child/error_icon.png" alt />
        <div class="color-red font-18">扫二维码失败，常见原因</div>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      status: "start",
      code: "", //读取的二维码
      loading: false,
      loadings:false
    };
  },
  created() {
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.start();
  },
  computed: {
    ...mapState(["Setting", "User"]),
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.readFail();
      }
    },
    code(val) {
      if (val) {
        this.loadings=true
        this.times = setTimeout(it=>{
          this.loadings=false
          this.readSuccess(this.code);
        },1000)

      }
    },
  },
  destroyed() {
    this.$store.commit("set_label_name", "");
    clearTimeout(this.interval);
  },
  mounted() {
    this.$nextTick(() => {
      this.getFocus();
    });
  },
  methods: {
    getFocus() {
      document.getElementById("code-btn").focus();
    },
    /**
     * @description:重新选择认证方式。
     */
    recertify() {
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setPrevFalse(this.list)
      );
      this.$router.go(-1);
    },
    /**
     * @description:读取二维码信息
     */
    start() {
      this.$store.dispatch("modifyCaption", "请将读者二维码对准识别框");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "code");
      });
      this.$store.dispatch("modifyBack", true);
      this.status = "start";
      // setTimeout((data) => {
      //   this.readSuccess("202006820");
      // }, 3000);
    },
    /**
     * @description:读取失败
     */
    readFail() {
      this.$store.dispatch("modifyCaption", "读取二维码失败");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "fail");
      });
      this.$store.dispatch("modifyBack", false);
      this.status = "fail";
    },
    /**
     * @description:读取成功
     */
    readSuccess(val) {
      this.$store.dispatch("modifyCodeInfo", val);
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (!this.manageSetting.selfServiceBorrowIsPassword) {
        this.peopleLogin();
        return;
      }
      this.timeout = setTimeout(() => {
        this.$router.push({
          path: this.$func.getNextPath(this.list),
        });
      }, 300);
    },
    /**
     * 不使用密码登录
     */
    peopleLogin() {
      let query = {
        idNumber: this.User.idNumberInfo.number,
        platformId: this.Setting.platform.id,
        readerNumber: this.code, //读者证号或者二维码读取的读者证号
        type: this.User.authType,
        hardwareType: this.Setting.appType == "one" ? 1 : 2,
      };
      if (this.loading) {
        return;
      }
      // this.$func.toast({
      //   content: query.readerNumber,
      //   type: "ERROR",
      // });
      this.loading = true;
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
          let _this = this;
          this.$func.toast(
            {
              content: err || "认证错误",
              type: "WARNING",
            },
            () => {
              _this.loading = false;
            }
          );
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
            this.loading = false;
            this.$router.push({
              path: this.$func.getNextPath(this.list),
            });
          } else {
            this.$store.dispatch("add_to_log", "读者有逾期数据");
            this.$store.dispatch("modifyOverduce", list);
            this.loading = false;
            this.$router.push({
              path: "/overduce",
            });
          }
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "读者逾期数据获取失败");

          this.$func.toast({
            content: "系统错误，请联系管理员",
            type: "ERROR",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.readCard {
  position: absolute;
  top: 35%;
  left: 0;
  right: 0;
  margin: 0 auto;
  .w-status-light {
    width: 26rem;
  }
  .font-18 {
    font-size: 1.7rem !important ;
  }
  .font-24 {
    font-size: 1.7rem;
  }
}
</style>