<template>
  <div id="home">
    <img class="home_bg" src="@/assets/images/child/home_bg.png" alt />
    <div class="home_title pointer">
      <img @click="goSetting" src="@/assets/images/child/home_title.png" alt />
    </div>
    <div class="home_btn_list">
      <div
        class="list_item"
        @click="jumpPath(item.key, item)"
        v-for="(item, index) in btnList"
        :key="index"
      >
        <img :src="item.img" alt />
      </div>
    </div>
    <copyright />
  </div>
</template>

<script>
import copyright from "@/components/common/copyright";
export default {
  components: {
    copyright,
  },
  data() {
    return {
      btnList: [
        {
          name: "borrow",
          img: require("@/assets/images/child/borrow_book.png"),
          key: "/borrow",
          selectKey: "selfServiceBorrowIsLoan",
        },
        {
          name: "return",
          img: require("@/assets/images/child/return_book.png"),
          key: "/return",
          selectKey: "selfServiceBorrowIsRestitution",
        },
        {
          name: "renew",
          img: require("@/assets/images/child/renew.png"),
          key: "/renew",
          selectKey: "selfServiceBorrowIsRenew",
        },
        {
          name: "search",
          img: require("@/assets/images/child/inquire.png"),
          key: "/search",
          selectKey: "selfServiceBorrowIsInquire",
        },
      ],
      number: 0,
      interval: "",
      list: {
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
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    httpUrl() {
      return this.$store.state.Setting.httpUrl;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
  },
  methods: {
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
    /**
     * @description:跳转路径
     */
    jumpPath(key, item) {
      if (!this.httpUrl) {
        this.$alert("请先设置服务器信息", "提示");
        return;
      }

      if (!this.manageSetting[item.selectKey]) {
        this.$alert("暂未开放此功能", "提示");
        this.getSystemSetting();
        return;
      }
      let list = this.list[item.name];

      if (!this.manageSetting.selfServiceBorrowIsPassword) {
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
      this.$store.dispatch("modifyProgreeList", list);
      this.$router.push({
        path: key,
      });
    },
    goSetting() {
      clearTimeout(this.interval);
      if (this.number >= 3) {
        this.$router.push("/service");
      } else {
        this.number = this.number + 1;
      }
      this.interval = setTimeout(() => {
        this.number = 0;
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/home.less";
</style>
