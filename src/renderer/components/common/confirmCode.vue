<template>
  <div class="confirm">
    <div class="flex-row">
      <div class="form-label code-name font-28 mr-20 font-bold">请输入密码</div>

      <div
        class="form-input code-input"
        :class="className.indexOf('password')!=-1?'form-input-acitve':''"
      >
        <input
          class="font-28 mr-10"
          @blur="delName('password')"
          @focus="addName('password')"
          v-model="password"
          :type="showPassword?'text':'password'"
          placeholder="请输入"
        />
        <img
          :src="showPassword?require('@/assets/images/child/eyeOpen.png'):require('@/assets/images/child/eyeClose.png')"
          class="w-24 pointer"
          alt
          @click="changeShow('password')"
        />
      </div>
    </div>
    <div class="flex-row mt-40">
      <div class="code-name mr-20"></div>
      <div class="code-input">
        <button class="form-blue-btn font-24 mr-20" @click="confirm">确认</button>
        <button class="form-yellow-btn font-24" @click="reback">重新认证</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nextPath"],
  data() {
    return {
      className: "",
      showPassword: "",
      password: ""
    };
  },
  created() {
    this.$store.dispatch("modifyCaption", "请输入密码");
  },
  methods: {
    /**
     * @description:添加name
     */
    addName(name) {
      if (this.className.indexOf(name) == -1) {
        this.className = this.className + name;
      }
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.className = this.className.replace(name, "");
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
      this.$router.push({
        path: this.$props.nextPath
      });
    },
    /**
     * @description:重新认证
     */
    reback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.code-name {
  width: 30%;
  text-align: right;
}
.code-input {
  width: 60%;
}
</style>