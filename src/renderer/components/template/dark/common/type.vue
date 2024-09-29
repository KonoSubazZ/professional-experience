<template>
  <div class="type flex-row flex-center">
    <template v-for="(item, index) in list">
      <div
        class="item-father"
        :style="{ backgroundColor: item.bk }"
        @click="go(item)"
        v-if="!item.hide"
        :key="index"
      >
        <div class="item w-dark-type" :style="{ backgroundColor: item.color }">
          <div class="item-img">
            <img
              :src="require('@/assets/images/dark/' + item.ico + '.png')"
              alt
            />
          </div>
          <div class="item-name color-white font-20">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["prefix"],
  data() {
    return {
      list: [
        {
          name: "人脸识别",
          color: "#1DA1F2",
          bk: "rgba(29,161,242,0.2)",
          ico: "face",
          path: "/face",
          key: "selfServiceBorrowIsFaceRecognition",
        },
        {
          name: "刷读者卡",
          color: "#02D8F0",
          bk: "rgba(2,216,240,0.2)",
          ico: "card",
          path: "/card",
          key: "selfServiceBorrowIsReaderCard",
        },
        {
          name: "刷身份证",
          color: "#0F316D",
          bk: "rgba(15,49,109,0.2)",
          ico: "idCard",
          path: "/idCard",
          key: "selfServiceBorrowIsIdCard",
        },
        {
          name: "扫二维码",
          color: "#071E44",
          bk: "rgba(7,30,68,0.2)",
          ico: "code",
          path: "/codeAuth",
          key: "selfServiceBorrowIsQRCode",
        },
      ],
    };
  },
  computed: {
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    appType() {
      return this.$store.state.Setting.appType;
    },
  },
  watch: {
    manageSetting: {
      handler(val) {
        if (val) {
          this.list.forEach((it) => {
            it.hide = !val[it.key];
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
     if(this.list.length==1){
      this.$router.push({
        path: this.$props.prefix + this.list[0].path,
      })
    }
  },
  methods: {
    /**
     * 跳转
     */
    go(item) {
      if (!this.manageSetting[item.key]) {
        this.$alert("暂未开放此功能", "提示");
        return;
      }
      // if (
      //   item.key != "selfServiceBorrowIsFaceRecognition" &&
      //   !this.manageSetting.selfServiceBorrowIsPassword
      // ) {
      //   this.$alert("请先开启密码验证", "提示");
      //   return;
      // }
      this.$router.push({
        path: this.$props.prefix + item.path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.type {
  position: absolute;
  top: 40%;
  width: 100%;
  .item-father {
    padding: 2px;
    box-sizing: border-box;
    margin: 0 2%;
  }
  .item {
    // box-shadow: 0px 3px 20px rgba(29, 161, 242, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    flex-direction: column;
    .item-img {
      width: 25%;
    }
    .item-name {
      margin-top: 10%;
    }
  }
}
</style>