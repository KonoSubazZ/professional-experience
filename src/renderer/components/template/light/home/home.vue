<template>
  <div id="home">
    <img class="home_bg" src="@/assets/images/light/home_bg.png" alt />
    <div
      class="home_title pointer home_title_light font-56 font-bold font-hei text-center"
      @click="goSetting"
    >
      <div v-if="platform && platform.name">{{platform && platform.name}}</div>
      自助办证借还一体机
    </div>
    <div class="light_list flex-row">
      <div
        class="borrow bor-rad-20 posi-rela pointer"
        @click="goChild('borrow')"
      >
        <img src="@/assets/images/light/borrow_bg.png" alt />
        <div class="posi-center">
          <div class="w-light-tag margin-center">
            <img src="@/assets/images/light/borrow_tag.png" alt />
          </div>
          <div class="font-24 color-white text-center mt-20">借书</div>
        </div>
      </div>
      <div class="light_right flex-one">
        <div
          class="back bor-rad-20 posi-rela pointer"
          @click="goChild('return')"
        >
          <img
            class="back_bg"
            src="@/assets/images/light/borrow_bg_other.png"
            alt
          />
          <div class="posi-center">
            <div class="w-light-tag margin-center">
              <img src="@/assets/images/light/back_tag.png" alt />
            </div>
            <div class="font-24 color-white text-center mt-20">还书</div>
          </div>
        </div>
        <div class="right_bottom flex-row">
          <div
            class="continue bor-rad-20 posi-rela pointer"
            @click="goChild('renew')"
          >
            <img src="@/assets/images/light/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/light/continue_tag.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20">续借</div>
            </div>
          </div>
          <div
            class="search bor-rad-20 posi-rela pointer"
            @click="goChild('search')"
          >
            <img src="@/assets/images/light/borrow_bg_other.png" alt />
            <div class="posi-center">
              <div class="w-light-tag margin-center">
                <img src="@/assets/images/light/search_tag.png" alt />
              </div>
              <div class="font-24 color-white text-center mt-20">查询</div>
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
      settingKey: {
        borrow: {
          one: "selfServiceBorrowIsLoan",
          two: "",
        },
        return: {
          one: "selfServiceBorrowIsRestitution",
          two: "",
        },
        renew: {
          one: "selfServiceBorrowIsRenew",
          two: "",
        },
        search: {
          one: "selfServiceBorrowIsInquire",
          two: "",
        },
      },
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
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    httpUrl() {
      return this.$store.state.Setting.httpUrl;
    },
    appType() {
      return this.$store.state.Setting.appType;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
  },
  created() {},
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
    goChild(name) {
      if (!this.httpUrl) {
        this.$alert("请先设置服务器信息", "提示");
        return;
      }
      let key = this.settingKey[name][this.appType];
      if (!this.manageSetting[key]) {
        this.$alert("暂未开放此功能", "提示");
        this.getSystemSetting();
        return;
      }
      let list = this.list[name];
      // console.log(list)
      if(this.appType=='one' && !this.manageSetting.selfServiceBorrowIsPassword || this.appType=='two'&&!this.manageSetting.selfServiceCardMachineIsPassword){
        /** 借还机,未开密码验证，去掉这一步 */
        let spliceIndex = ""
        list.forEach((it,ix)=>{
          if(it.ico == "password_"){
            spliceIndex = ix;
          }
        })
        if(spliceIndex||spliceIndex===0){
         list.splice(spliceIndex,1)
        }
      }
      // console.log(list)
      this.$store.dispatch("modifyProgreeList",list);

      this.$router.push({
        path: "/" + name,
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
@import "~@/assets/less/common.less";
</style>
