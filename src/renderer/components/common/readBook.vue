<template>
  <div class="read-book">
    <div v-if="status=='start'">
      <img src="@/assets/images/child/read_book.png" class="w-status-img margin-center" alt />
      <div class="mt-20 color-blue font-18 text-center">请将图书放置指定区域</div>
    </div>
    <div v-if="status=='fail'">
      <img class="w-status-img margin-center" src="@/assets/images/child/auth_error.png" alt />
      <div class="flex-row flex-center">
        <img class="w-24" src="@/assets/images/child/error_icon.png" alt />
        <div class="color-red font-18">读取图书失败，常见原因</div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button class="form-blue-btn font-24 mr-10" @click="retry">重试</button>
        <button class="form-yellow-btn font-24" @click="goHome">放弃</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nextPath", "failPath"],
  data() {
    return {
      status: "start",
    };
  },
  created() {
    this.$store.dispatch("modifyCaption", "请将图书放置指定区域");
    this.start();
  },
  methods: {
    /**
     * @description:重试
     */
    retry() {
      this.status = "start";
      this.start();
    },
    /**
     * @descripition:调用
     */
    start() {
      setTimeout(() => {
        // this.status = "fail";
        this.readSuccess();
      }, 3000);
    },
    /**
     * @description:读取成功
     */
    readSuccess() {
      this.$router.push({
        // path: this.$props.nextPath
        path: this.$props.failPath,
      });
    },
    /**
     * @description:放弃
     */
    goHome() {
      this.$store.dispatch("modifyUserInfo", {});
      this.$router.replace("/home");
    },
  },
};
</script>

<style lang="less" scoped>
.read-book {
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>