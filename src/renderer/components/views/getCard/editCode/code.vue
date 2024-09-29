<template>
  <div class="confirm">
    <div v-if="status == 'edit'">
      <div class="flex-row">
        <div class="form-label code-name font-28 mr-20 font-bold">
          请输入原密码
        </div>
        <div
          class="form-input code-input"
          :class="
            className.indexOf('sourcePassword') != -1 ? 'form-input-acitve' : ''
          "
          :style="skin != 'child' ? 'border-radius:5px' : ''"
        >
          <input
            class="font-28 mr-10"
            ref="sourcePassword"
            id="sourcePassword"
            @blur="delName('sourcePassword')"
            @focus.stop="addName('sourcePassword')"
            @click.stop=""
            v-model="sourcePassword"
            :type="show.sourcePassword ? 'text' : 'password'"
            placeholder="请输入"
          />
          <!-- <img
            :src="
              show.sourcePassword
                ? require('@/assets/images/child/eyeOpen.png')
                : require('@/assets/images/child/eyeClose.png')
            "
            class="w-24 pointer"
            alt
            @click="changeShow('sourcePassword    ')"
          /> -->
        </div>
      </div>
      <div class="flex-row mt-20">
        <div class="form-label code-name font-28 mr-20 font-bold">
          输入新密码
        </div>
        <div
          class="form-input code-input"
          :class="
            className.indexOf('password') != -1 ? 'form-input-acitve' : ''
          "
          :style="skin != 'child' ? 'border-radius:5px' : ''"
        >
          <input
            class="font-28 mr-10"
            ref="password"
            id="password"
            @blur="delName('password')"
            @focus.stop="addName('password')"
            @click.stop=""
            v-model="password"
            :type="show.password ? 'text' : 'password'"
            placeholder="请输入"
          />
          <img
            :src="
              show.password
                ? require('@/assets/images/child/eyeOpen.png')
                : require('@/assets/images/child/eyeClose.png')
            "
            class="w-24 pointer"
            alt
            @click="changeShow('password')"
          />
        </div>
      </div>
      <div class="flex-row mt-20">
        <div class="form-label code-name font-28 mr-20 font-bold">
          确认新密码
        </div>
        <div
          class="form-input code-input"
          :class="
            className.indexOf('confirmPassword') != -1
              ? 'form-input-acitve'
              : ''
          "
          :style="skin != 'child' ? 'border-radius:5px' : ''"
        >
          <input
            class="font-28 mr-10"
            ref="confirmPassword"
            id="confirmPassword"
            @blur="delName('confirmPassword')"
            @focus.stop="addName('confirmPassword')"
            @click.stop=""
            v-model="confirmPassword"
            :type="show.confirmPassword ? 'text' : 'password'"
            placeholder="请输入"
          />
          <img
            :src="
              show.confirmPassword
                ? require('@/assets/images/child/eyeOpen.png')
                : require('@/assets/images/child/eyeClose.png')
            "
            class="w-24 pointer"
            alt
            @click="changeShow('confirmPassword')"
          />
        </div>
      </div>
      <div class="flex-row mt-40">
        <div class="code-name mr-20"></div>
        <div class="code-input">
          <button
            class="form-blue-btn font-24 mr-20"
            :style="skin != 'child' ? 'border-radius:5px' : ''"
            @click="confirm"
          >
            确认
          </button>
        </div>
      </div>
    </div>
    <div v-if="status == 'success'">
      <img
        class="margin-center"
        :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
        :src="require('@/assets/images/' + skin + '/pay_success.png')"
        alt
      />
      <div class="flex-row flex-center align-top">
        <!-- <img class="w-24 mr-10" src="@/assets/images/light/success.png" alt /> -->
        <div class="color-blue font-18 text-center">修改成功</div>
      </div>
        <div class="flex-row flex-center mt-40">
          <button class="form-yellow-btn font-24" @click="reback">返回</button>
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
export default {
  props: ["nextPath"],
  components: {
    keybord: () => import("@/components/common/keyboard2.vue"),
  },
  data() {
    return {
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      selectName: "",

      status: "edit", //edit,success
      className: "",
      show: {
        password: false,
        sourcePassword: false,
        confirmPassword: false,
      },
      sourcePassword: "", //原密码
      password: "", //密码
      confirmPassword: "", //确认密码
    };
  },
  created() {
    this.$store.dispatch("add_to_log", "读者修改密码");
    return;
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$store.dispatch("modifyCaption", "修改密码");
  },
  mounted() {
    document.body.addEventListener("click", (data) => {
      if (this.keySet.show) {
        this.className = this.className.replace(this.selectName, "");
        this.changeOpen(false);
      }
    });
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    user() {
      return this.$store.state.User;
    },
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
        this[this.selectName] = this[this.selectName] + data;
      } else if (data == "del") {
        this[this.selectName] = this[this.selectName].substring(
          0,
          this[this.selectName].length - 1
        );
      } else {
        this[this.selectName] = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = this.$refs[name].getBoundingClientRect();
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
      this.show[name] = !this.show[name];
      this.show = Object.assign({}, this.show);
    },
    /**
     * @description:返回
     */
    reback() {
      this.$router.replace("/");
    },
    /**
     * 修改读者密码
     */
    confirm() {
      if (!this.sourcePassword) {
        this.$func.toast({
          content: "请输入原密码",
          type: "INFO",
        });
        return;
      }
      if (!this.password) {
        this.$func.toast({
          content: "请输入新密码",
          type: "INFO",
        });
        return;
      }
      if (!this.confirmPassword) {
        this.$func.toast({
          content: "请确认新密码",
          type: "INFO",
        });
        return;
      }
      if (this.password != this.confirmPassword) {
        this.$func.toast({
          content: "两次密码输入不一致",
          type: "INFO",
        });
        return;
      }
      let query = {
        newPassword: this.password,
        oldPassword: this.sourcePassword,
        platformId: this.platform.id,
        readerNumber: this.user.readCard || this.user.codeInfo,
      };
      this.$axios
        .post("/hardware/interface/modifyReaderPassword", query)
        .then((res) => {
          this.confirmSuccess();
        })
        .catch((err) => {
          this.$store.dispatch("add_to_log", "读者修改密码失败");
          this.$func.toast({
            content: "修改密码失败",
            type: "WARNING",
          });
        });
    },
    /**
     * @description:修改密码成功
     */
    confirmSuccess() {
      this.$store.dispatch("add_to_log", "读者修改密码成功");
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
      );
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "edit");
      });
      this.$store.dispatch("modifyCaption", "修改成功");
      this.status = "success";
    },
  },
};
</script>

<style lang="less" scoped>
.confirm {
  position: absolute;
  top: 42%;
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
.form-input {
}
</style>