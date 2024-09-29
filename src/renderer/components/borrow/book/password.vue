<template>
  <confrimCode :nextPath="'/borrow/read'"></confrimCode>
</template>

<script>
import confrimCode from "@/components/common/confirmCode";
export default {
  components: {
    confrimCode
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
        //   name: "确认密码",
        //   select: true,
        //   img: require("@/assets/images/child/auth_code.png")
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
    this.$store.dispatch("modifyProgreeList", this.list);
  }
};
</script>

<style lang="less" scoped>
</style>