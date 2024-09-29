<template>
  <div class="confirm">
    <div class="flex-row">
      <div class="form-label code-name font-28 mr-20 font-bold">请输入密码</div>
      <div
        class="form-input code-input"
        :class="className.indexOf('password') != -1 ? 'form-input-acitve' : ''"
        :style="Setting.skin != 'child' ? 'border-radius:5px' : ''"
      >
        <input
          class="font-28 mr-10"
          ref="password"
          id="password"
          @blur="delName('password')"
          @focus.stop="addName('password')"
          @click.stop=""
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入"
        />
        <img
          :src="
            showPassword
              ? require('@/assets/images/child/eyeOpen.png')
              : require('@/assets/images/child/eyeClose.png')
          "
          class="w-24 pointer"
          alt
          @click="changeShow('password')"
        />
      </div>
    </div>
    <div class="flex-row mt-40">
      <div class="code-name mr-20"></div>
      <div class="code-input">
        <button
          class="form-blue-btn font-24 mr-20"
          :style="Setting.skin != 'child' ? 'border-radius:5px' : ''"
          @click="confirm"
        >
          确认
        </button>
        <button
          class="form-yellow-btn font-24"
          :style="Setting.skin != 'child' ? 'border-radius:5px' : ''"
          @click="reback"
        >
          重新认证
        </button>
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
import { mapState } from "vuex";

import md5 from "md5";
export default {
  components: {
    keybord: () => import("@/components/common/keyboard.vue"),
  },
  props: ["nextPath"],
  data() {
    return {
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      className: "",
      showPassword: "",
      password: "",

      selectName: "",
    };
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  created() {
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$store.dispatch("add_to_log", "确定读者密码");
    this.$store.dispatch("modifyCaption", "请输入密码");
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "password");
    });
    this.$store.dispatch("modifyBack", true);
  },
  computed: {
    ...mapState(["Setting", "User"]),
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
        this.$router.replace("/");
      }
    },
  },
  mounted() {
    document.body.addEventListener("click", (data) => {
      if (this.keySet.show) {
        this.className = this.className.replace(this.selectName, "");
        this.changeOpen(false);
      }
    });
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
     * 获取输入值
     */
    getResult(data) {
      if (data && data != "del") {
        this.password = this.password + data;
      } else if (data == "del") {
        this.password = this.password.substring(0, this.password.length - 1);
      } else {
        this.password = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = this.$refs.password.getBoundingClientRect();
      this.keySet.top = item.top + item.height + 10;
      this.keySet.left = item.left;
      this.changeOpen(true);
    },
    /**
     * 改变键盘的状态
     */
    changeOpen(status) {
      this.keySet.show = status;
      this.keySet = Object.assign({}, this.keySet);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.selectName = name;
    },
    /**
     * @description:切换输入框内容
     */
    changeShow(name) {
      this.showPassword = !this.showPassword;
    },
    /**
     * @description:认证密码
     */
    confirm() {
      if (!this.password) {
        this.$func.toast({
          content: "请输入密码",
          type: "WARNING",
        });
        return;
      }
      let query = {
        idNumber: this.User.idNumberInfo.number,
        password: md5(this.password),
        platformId: this.Setting.platform.id,
        readerNumber: this.User.readCard || this.User.codeInfo, //读者证号或者二维码读取的读者证号
        type: this.User.authType,
        hardwareType:this.Setting.appType=='one'?1:2
      };
      this.$axios
        .post("/hardware/interface/readerLogin", query)
        .then((res) => {
          let data = res.data;
          this.$store.dispatch("add_to_log", "读者密码认证成功");

          this.$store.dispatch("modifyUserInfo", data);
          //查看是否逾期。
          if (this.User.authType == 3) {
            this.$store.dispatch("modifyReadCard", data.number);
          }
          this.$axios
            .get("/hardware/interface/borrowingInformationOverdue", {
              readerNumber: this.User.readCard || this.User.codeInfo,
              platformId: this.Setting.platform.id,
            })
            .then((over) => {
              console.log(over);
              let list = over.data.content;
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
              this.$func.toast({
                content: "系统错误，请联系管理员",
                type: "ERROR",
              });
            });
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "读者密码认证失败");
          this.$func.toast({
            content:err|| "密码认证错误",
            type: "WARNING",
          });
        });
    },
    /**
     * @description:重新认证
     */
    reback() {
      let list = this.$func.setPrevFalse(JSON.parse(JSON.stringify(this.list)));
      this.$store.dispatch("modifyProgreeList", this.$func.setPrevFalse(list));
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.confirm {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80%;
}
.code-name {
  width: 30%;
  text-align: right;
}
.code-input {
  width: 60%;
}
</style>