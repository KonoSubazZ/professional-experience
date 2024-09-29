<template>
  <faceAuth :nextPath="'/borrow/book'" :failPath="'/borrow/overduc'"></faceAuth>
</template>

<script>
import faceAuth from "@/components/common/faceAuth";
export default {
  components: {
    faceAuth
  },
  data() {
    return {
      list: [
        // {
        //   name: "选择认证方式",
        //   select: true,
        //   img: require("@/assets/images/child/auth_type.png")
        // },
        // {
        //   name: "进行认证",
        //   select: true,
        //   img: require("@/assets/images/child/auth_loading.png")
        // },
        // {
        //   name: "放置图书",
        //   select: false,
        //   img: require("@/assets/images/child/auth_book.png")
        // },
        // {
        //   name: "确认信息",
        //   select: false,
        //   img: require("@/assets/images/child/auth_info.png")
        // },
        // {
        //   name: "借书成功",
        //   select: false,
        //   img: require("@/assets/images/child/auth_success.png")
        // }
      ]
    };
  },
  created() {
    this.$store.dispatch("modifyCaption", "请将脸部对准摄像头，确保光线充足");
    this.$store.dispatch("modifyProgreeList", this.list);
  }
};
</script>

<style>
</style>