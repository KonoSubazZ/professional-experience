<template>
  <div id="background">
    <div class="back-header bg-light">
      <div class="header-body posi-abso flex-row flex-between align-center">
        <div class="font-38 color-white font-hei">自助办证借还一体机</div>
        <div class="header-operating color-white text-center">
          <div
            class="operating-img pointer"
            style="font;width: 10%;"
            @click="goHome"
          >
            <img src="@/assets/images/dark/home.png" alt />
            <div style="font-size: 1rem" class="font-16 nowarp mt-10">首页</div>
          </div>
          <div
            class="operating-img pointer"
            @click="goBack"
            v-if="setting.back"
          >
            <img src="@/assets/images/dark/back.png" alt />
            <div class="font-16 nowarp mt-10">返回</div>
          </div>
          <div>
            <slot name="header"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="caption-user flex-row">
      <div
        class="user-info flex-row color-333"
        v-if="userInfo && userInfo.name"
      >
        <el-image
          class="w-40 mr-10 bg-light bor-rad-round"
          style="overflow: hidden; width: 6rem; height: 6rem"
          :src="
            userInfo.photo != '' && userInfo.photo != null
              ? http + '/' + userInfo.photo
              : require('@/assets/images/dark/user_tag.png')
          "
          :fit="'cover'"
        ></el-image>
        <span class="font-24">{{ userInfo ? userInfo.name : "" }}</span>
      </div>
      <captionTime :color="'#1DA1F2'" v-if="setting.showTime"></captionTime>
    </div>
    <div class="back-body bor-rad-20">
      <slot name="body"></slot>
    </div>

    <copyright :color="'#333'" />
  </div>
</template>

<script>
import copyright from "@/components/common/copyright";
import captionTime from "@/components/common/captionTime";
export default {
  components: {
    copyright,
    captionTime,
  },
  props: {
    setting: {
      type: Object,
      value: {
        showTime: true,
        titleType: "title",
        back: true,
      },
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    http() {
      return this.$store.state.Setting.httpUrl
        ? this.$store.state.Setting.httpUrl
        : "";
    },
  },
  methods: {
    goHome() {
      this.$confirm("确定放弃当前操作回到首页吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then((res) => {
        this.$router.replace("/");
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
#background {
  width: 100vw;
  height: 100vh;
  background-color: white;
  background-image: url("~@/assets/images/light/back_bottom.png");
  background-size: 100%;
  background-position: bottom left;
  background-repeat: no-repeat;

  .back-header {
    height: 11%;
    width: 100%;
    position: relative;

    .header-body {
      top: 10%;
      left: 0;
      width: 100%;
      padding: 0 8.333%;
      box-sizing: border-box;

      .header-operating {
        width: 50%;
        float: right;

        .operating-img {
          width: 5%;
          height: auto;
          float: right;
          margin: 2%;
        }
      }
    }
  }

  .caption-user {
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 83.33%;
  }

  .back-body {
    position: absolute;
    top: 19%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 83.33%;
    height: 70%;
    // background-color: red;
  }
}
</style>
