<template>
  <readBook :nextPath="'/borrow/info'"></readBook>
</template>

<script>
import readBook from "@/components/common/readBook";
export default {
  components: {
    readBook
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
        //   select: true,
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
    this.$store.dispatch("modifyUserClear", true);
    this.$store.dispatch("modifyCaption", "请将图书放置指定区域");
    this.$store.dispatch("modifyProgreeList", this.list);
  }
};
</script>

<style>
</style>