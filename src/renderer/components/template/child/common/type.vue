<template>
  <div class="type-list flex-row flex-center">
    <template v-for="(item, index) in arr">
      <div
        class="type-item w-type flex-row flex-center"
        style="margin:0 1rem"
        @click="selectType(item)"
        v-if="!item.hide"
        :key="index"
      >
        <div class="item-box flex-row">
          <img class="w-50 mr-10" :src="item.img" alt />
          <div class="font-24 font-bold">{{ item.name }}</div>
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
      arr: [
        {
          name: "人脸识别",
          key: "/face",
          img: require("@/assets/images/child/type_face.png"),
          keyTwo: "selfServiceBorrowIsFaceRecognition",
          hide: false,
        },
        {
          name: "刷读者卡",
          key: "/card",
          img: require("@/assets/images/child/type_read.png"),
          keyTwo: "selfServiceBorrowIsReaderCard",
          hide: false,
        },
        {
          name: "刷身份证",
          key: "/idCard",
          img: require("@/assets/images/child/type_card.png"),
          keyTwo: "selfServiceBorrowIsIdCard",
          hide: false,
        },
        {
          name: "刷二维码",
          key: "/codeAuth",
          img: require("@/assets/images/child/type_code.png"),
          keyTwo: "selfServiceBorrowIsQRCode",
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
          this.arr.forEach((it) => {
            it.hide = !val[it.keyTwo];
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created(){
    if(this.arr.length==1){
      this.$router.push({
        path: this.$props.prefix + this.arr[0].key,
      })
    }
  },
  methods: {
    /**
     * @description:选择认证方式
     */
    selectType(item) {
      if (!this.manageSetting[item.keyTwo]) {
        this.$alert("暂未开放此功能", "提示");
        return;
      }
      // if (
      //   item.keyTwo != "selfServiceBorrowIsFaceRecognition" &&
      //   !this.manageSetting.selfServiceBorrowIsPassword
      // ) {
      //   this.$alert("请先开启密码验证", "提示");
      //   return;
      // }
      this.$router.push({
        path: this.$props.prefix + item.key,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.type-list {
  .type-item {
    cursor: pointer;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 20px 3px rgba(255, 238, 232, 1);
  }
}
</style>