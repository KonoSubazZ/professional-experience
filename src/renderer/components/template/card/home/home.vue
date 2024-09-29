<template>
  <div id="home">
    <img class="home_bg" src="@/assets/images/card/home_bg.png" alt />
    <div
      class="home_title pointer home_title_light font-56 font-bold font-hei text-center"
      @click="goSetting"
    >
      自助办卡机
    </div>
    <div class="light_list card flex-row">
      <div
        class="borrow bor-rad-20 posi-rela pointer"
        @click="goChild('getCard', 'selfServiceCardMachineIsCard')"
      >
        <img src="@/assets/images/light/borrow_bg.png" alt />

        <div class="posi-center">
          <div class="w-light-tag margin-center">
            <img src="@/assets/images/card/card.png" alt />
          </div>
          <div class="font-24 color-white text-center mt-20">办卡</div>
        </div>
      </div>
      <div class="light_right flex-one">
        <div
          class="back bor-rad-20 posi-rela pointer"
          @click="goChild('search', 'selfServiceCardMachineIsInquire')"
        >
          <img
            class="back_bg"
            src="@/assets/images/light/borrow_bg_other.png"
            alt
          />
          <div class="posi-center">
            <div class="w-light-tag margin-center">
              <img src="@/assets/images/card/search.png" alt />
            </div>
            <div class="font-24 color-white text-center mt-20">查询</div>
          </div>
        </div>
        <div class="right_bottom flex-row">
          <div
            class="continue bor-rad-20 posi-rela pointer"
            @click="goChild('payment', 'selfServiceCardMachineIsPay')"
          >
            <img src="@/assets/images/light/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/card/payment.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20">充值</div>
            </div>
          </div>
          <div
            class="search bor-rad-20 posi-rela pointer"
            @click="goChild('code', 'selfServiceCardMachineIsModifyPassword')"
          >
            <img src="@/assets/images/light/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/card/code.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20">修改密码</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <copyright :color="'black'" />
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
      number: 0,
      interval: "",
      list: {
        getCard: [
          {
            name: "采集身份信息",
            select: false,
            ico: "auth_",
            path: "/getCard/",
          },
          {
            name: "采集人脸信息",
            select: false,
            ico: "scan_",
            path: "/getCard/face",
          },
          {
            name: "补全信息",
            select: false,
            ico: "info_",
            path: "/getCard/info",
          },
          {
            name: "支付押金",
            select: false,
            ico: "pay_",
            path: "/getCard/pay",
          },
          {
            name: "办卡成功",
            select: false,
            ico: "success_",
            path: "/getCard/success",
          },
        ],
        search: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
            path: "/getCardSearch/",
          },
          {
            name: "进行认证",
            select: false,
            ico: "loading_",
            path: "/getCardSearch/",
          },
          {
            name: "确认密码",
            select: false,
            ico: "password_",
            path: "/getCardSearch/password",
          },
          {
            name: "查询个人信息",
            select: false,
            ico: "info_",
            path: "/getCardSearch/peopleInfo",
          },
        ],
        payment: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
            path: "/payment/",
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
            path: "/payment/password",
          },
          {
            name: "充值面额选择",
            select: false,
            ico: "deno_",
            path: "/payment/deno",
          },
          {
            name: "进行支付",
            select: false,
            ico: "pay_",
            path: "/payment/payment",
          },
          {
            name: "充值成功",
            select: false,
            ico: "success_",
          },
        ],
        code: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
            path: "/editCode/",
          },
          {
            name: "进行认证",
            select: false,
            ico: "loading_",
          },
          {
            name: "修改密码",
            select: false,
            ico: "password_",
            path: "/editCode/code",
          },
          {
            name: "修改成功",
            select: false,
            ico: "success_",
          },
        ],
      },
    };
  },
  created() {
    this.$store.dispatch("add_to_log", "进入首页");
  },
  computed: {
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    httpUrl() {
      return this.$store.state.Setting.httpUrl;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
  },
  methods: {
    goChild(name, key) {
      if (!this.httpUrl || !this.platform) {
        this.$store.dispatch("add_to_log", "未配置服务器");
        this.$alert("请前往配置页面配置服务器信息", "提示");
        return;
      }
      if (!this.manageSetting[key]) {
        this.$store.dispatch("add_to_log", "未开放点击功能");
        this.$alert("暂未开放此功能", "提示");
        this.getSystemSetting();
        return;
      }
      let list = this.list[name];
      // console.log(this.manageSetting)
      if (!this.manageSetting.selfServiceCardMachineIsPassword&&name!='code') {
        let spliceIndex = "";
        list.forEach((it, ix) => {
          if (it.ico == "password_") {
            spliceIndex = ix;
            // console.log(ix);  
          }
        });
        if (spliceIndex || spliceIndex === 0) {
          list.splice(spliceIndex, 1);
        }
      }
      if(name=='getCard'&&!this.manageSetting.selfServiceCardMachineIsIdCard){
        list.splice(0,1)
      }
      this.$store.dispatch("modifyProgreeList", list);
      this.$router.push({
        path: this.list[name][0].path,
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
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/home.less";
@import "~@/assets/less/common.less";
</style>
