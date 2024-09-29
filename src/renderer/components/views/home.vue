<template>
  <component :is="getApp"></component>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  components: {
    childHome: () => import("@/components/template/child/home/home.vue"),
    borrowPortrait: () => import("@/components/template/borrowPortrait/home/home.vue"),
    darkHome: () => import("@/components/template/dark/home/home.vue"),
    lightHome: () => import("@/components/template/light/home/home.vue"),
    cardHome: () => import("@/components/template/card/home/home.vue"),
    door: () => import("@/components/views/door/number.vue"),
    workDeck: () => import("@/components/views/WorkDeck/ConfigPage.vue"),
  },
  beforeCreate() {
    this.$store.dispatch("modifyReaderCardType", "IC");
    this.$store.dispatch("modifyReaderApi", {
      type: "USB",
      typeDetail: "COM5",
    });
  },
  computed: {
    platform() {
      return this.$store.state.Setting.platform;
    },
    getApp() {
      let application = process.env.application
      switch (application) {
        case "security_gate":
          return "door"
        case "work_deck":
        case "work_deck_main":
        case "work_deck_opac":
          return "workDeck"
        case "borrow_landscape":
          return this.getBorrowMachineHome()
        case "borrow_portrait":
          return "borrowPortrait"
        case "borrow_dark":
          return "darkHome"
        case "borrow_child":
          return "childHome"
        case "card_machine":
          return "cardHome"
      }
    },
    useSip2: () => !!JSON.parse(localStorage.getItem("useSip2")),
  },
  created() {
    this.$store.commit("set_uuid", process.env.uuid);

    this.init()
  },
  data() {
    return {
      type: {
        DARK: "dark",
        LIGHT: "light",
        CHILD: "child",
      },
    };
  },
  methods: {
    getBorrowMachineHome() {
      return this.$store.state.Setting.skin + "Home";
    },
    /**
     * 清除平台信息和请求地址
     */
    clearInfo() {
      localStorage.removeItem("httpUrl");
      localStorage.removeItem("platform");
    },
    /**
     * 初始化硬件配置
     */
    init() {
      let httpUrl = localStorage.getItem("httpUrl");
      let platform = localStorage.getItem("platform");
      let type = process.env.application === 'card_machine' ? 'two' : 'one';
      if (httpUrl && platform) {
        //如果地址和平台信息存在，那么则已经配置服务器
        this.$store.dispatch("modifyHttpUrl", httpUrl);
        this.$store.dispatch("modifyPlatform", JSON.parse(platform));
        if (this.useSip2 && process.env.application === "security_gate") return
        this.getSystemSetting(type);
      } else {
        this.$message.success("请前往配置页面配置服务器信息");
        this.$store.dispatch("modifyHttpUrl", "");
        this.$store.dispatch("modifyPlatform", {});
        this.$store.dispatch("modifyManageSetting", "");
      }
      //设置机器类型
      this.$store.dispatch("modifyAppType", type);
      //清空caption
      this.$store.dispatch("modifyCaption", "");
      //清空读者登录信息
      this.$store.dispatch("modifyUserInfo", {});
      //清空读者录入信息
      this.$store.dispatch("initUser");
      /**请空逾期信息 */
      this.$store.dispatch("modifyOverduce", []);
      /**清空办卡订单信息 */
      this.$store.dispatch("modifyOrderCard", {});
    },
    /**
     * @description:获取系统设置
     */
    getSystemSetting(type) {
      if (!this.platform) {
        return
      }
      this.$axios
        .get("/hardware/manage/hardwareManageSetting", {
          platformId: this.platform.id,
        })
        .then((res) => {
          //配置皮肤，
          if (process.env.application && process.env.application === 'borrow_landscape') {
            this.$store.dispatch(
              "modifySkin",
              this.type[res.data.selfServiceBorrowHardwareStyle]
            );
          } else {
            this.$store.dispatch("modifySkin", "light");
          }
          this.$store.dispatch("modifyManageSetting", res.data);
          if (process.env.application === 'borrow_portrait') {
            this.$store.dispatch("modifySkin", "lightPortrait");
          }
        })
        .catch((err) => { });
    },
    /**
     * @description:跳转路径
     */
    jumpPath(key) {
      this.$router.push({
        path: key,
      });
    },
  },
};
</script>
