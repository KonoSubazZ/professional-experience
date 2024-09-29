<template>
  <div class="type">
    <div class="flex-row flex-center">
      <template v-for="(item, index) in list">
        <div class="item w-250-su bor-rad-20" v-if="!item.hide && index < 2" @click="go(item, index)" :key="index">
          <div class="item-img">
            <img :src="require('@/assets/images/lightPortrait/' + item.ico + '.png')
              " alt />
          </div>
          <div :style="{ color: item.color }" class="item-name">
            {{ item.name }}
          </div>
        </div>
      </template>
    </div>
    <div class="flex-row flex-center">
      <template v-for="(item, index) in list">
        <div class="item w-250-su bor-rad-20" v-if="!item.hide && index >= 2" @click="go(item, index)" :key="index">
          <div class="item-img">
            <img :src="require('@/assets/images/lightPortrait/' + item.ico + '.png')
              " alt />
          </div>
          <div :style="{ color: item.color }" class="item-name">
            {{ item.name }}
          </div>
        </div>
      </template>
    </div>
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
          color: "#02C8DB",
          ico: "face",
          path: "/face",
          key: "selfServiceBorrowIsFaceRecognition",
          cardKey: "selfServiceCardMachineIsFaceRecognition",
          hide: false,
        },
        {
          name: "刷读者卡",
          color: "#FC9733",
          ico: "card",
          path: "/card",
          key: "selfServiceBorrowIsReaderCard",
          cardKey: "selfServiceCardMachineIsReaderCard",
          hide: false,
        },
        {
          name: "刷身份证",
          color: "#3C90FA",
          ico: "idCard",
          path: "/idCard",
          key: "selfServiceBorrowIsIdCard",
          cardKey: "selfServiceCardMachineIsIdCard",
          hide: false,
        },
        {
          name: "扫二维码",
          color: "#FB7F90",
          ico: "code",
          path: "/codeAuth",
          key: "selfServiceBorrowIsQRCode",
          cardKey: "selfServiceCardMachineIsQRCode",
          hide: false,
        },
        {
          name: "指纹识别",
          color: "#CF9AED",
          ico: "fingerprint",
          path: "/fingerprintAuth",
          key: "selfServiceBorrowIsIdCard",
          cardKey: "selfServiceCardMachineIsIdCard",
          hide: false,
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
            if (it.name === '指纹识别') return
            it.hide = this.appType == "one" ? !val[it.key] : !val[it.cardKey];
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    if (this.list.length == 1) {
      this.$router.push({
        path: "/portrait" + this.$props.prefix + this.list[0].path,
      });
    }
    if (this.appType == "two") {
      this.list.splice(this.list.length - 1, 1);
    }
  },
  methods: {
    /**
     * 跳转
     */
    go(item, index) {
      if (
        !this.manageSetting[this.appType == "one" ? item.key : item.cardKey]
      ) {
        this.$alert("暂未开放此功能", "提示");
        return;
      }
      //   let path = "/portrait" + this.$props.prefix + item.path;
      //   this.$router.push(path);
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
  top: 25%;
  width: 100%;
  flex-wrap: wrap;

  .w-250-su {
    width: 18rem !important;
    height: 18rem !important;
  }

  .item {
    box-shadow: 0px 3px 20px rgba(29, 161, 242, 0.15);
    margin: 0 3rem 3rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    cursor: pointer;
    flex-direction: column;

    .item-img {
      width: 40%;
    }

    .item-name {
      margin-top: 10%;
      font-size: 2.13rem;
    }
  }
}
</style>