<template>
  <div class="caption-time font-28 font-bold">
    <audio id="audio" :src="audioSrc"></audio>
    <!-- <audio controls src="@/assets/audio/请选择认证类型.mp3"></audio> -->
    <span class="caption" :style="{ color: color }">{{ caption }}</span>
    <span class="time" :style="{ color: color }">{{ timeText }}s</span>
  </div>
</template>

<script>
export default {
  props: {
    //当caption变化的时候是否重置时间。
    color: {
      type: String,
      value: "",
    },
    refresh: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      timeText: 30,
      interval: "",
      audioObj: {
        type: require("@/assets/audio/请选择认证类型.mp3"),
        book: require("@/assets/audio/请放入图书.mp3"),
        code: require("@/assets/audio/二维码认证.mp3"),
        idCard: require("@/assets/audio/请放入身份证.mp3"),
        card: require("@/assets/audio/请放入读者卡.mp3"),
        camera: require("@/assets/audio/请看向摄像头.mp3"),
        password: require("@/assets/audio/请输入密码.mp3"),
        backSuccess: require("@/assets/audio/还书成功.mp3"),
        borrrowSuccess: require("@/assets/audio/借书成功.mp3"),
        search: require("@/assets/audio/请选择查询项目.mp3"),
        renew: require("@/assets/audio/请选择续借图书.mp3"),
        renewSuccess: require("@/assets/audio/续借成功.mp3"),
        fail: require("@/assets/audio/认证失败.mp3"),
        cardSuccess: require("@/assets/audio/办卡成功.mp3"),
        paySuccess: require("@/assets/audio/充值成功.mp3"),
        moreInfo: require("@/assets/audio/请补全信息.mp3"),
        peopleInfo: require("@/assets/audio/请确定采集信息.mp3"),
        faceInfo: require("@/assets/audio/请确定人脸信息.mp3"),
        selectMoney: require("@/assets/audio/请选择金额.mp3"),
        payMoney: require("@/assets/audio/请支付押金.mp3"),
        edit: require("@/assets/audio/修改成功.mp3"),
        userWechat: require("@/assets/audio/请使用微信扫码支付.mp3"),
        overduce: require("@/assets/audio/逾期提示支付信息.mp3"),
        overduceSuccess: require("@/assets/audio/支付成功.mp3"),
        fingerprint: require("@/assets/audio/请进行指纹认证.mp3"),


      },
      audioChild: {
        type: require("@/assets/child/请选择认证类型.mp3"),
        book: require("@/assets/child/请放入图书.mp3"),
        code: require("@/assets/child/二维码认证.mp3"),
        idCard: require("@/assets/child/请放入身份证.mp3"),
        card: require("@/assets/child/请放入读者卡.mp3"),
        camera: require("@/assets/child/请看向摄像头.mp3"),
        password: require("@/assets/child/请输入密码.mp3"),
        backSuccess: require("@/assets/child/还书成功.mp3"),
        borrrowSuccess: require("@/assets/child/借书成功.mp3"),
        search: require("@/assets/child/请选择查询项目.mp3"),
        renew: require("@/assets/child/请选择续借图书.mp3"),
        renewSuccess: require("@/assets/child/续借成功.mp3"),
        fail: require("@/assets/child/认证失败.mp3"),
        cardSuccess: require("@/assets/child/办卡成功.mp3"),
        paySuccess: require("@/assets/child/充值成功.mp3"),
        moreInfo: require("@/assets/child/请补全信息.mp3"),
        peopleInfo: require("@/assets/child/请确定采集信息.mp3"),
        faceInfo: require("@/assets/child/请确定人脸信息.mp3"),
        selectMoney: require("@/assets/child/请选择金额.mp3"),
        payMoney: require("@/assets/child/请支付押金.mp3"),
        edit: require("@/assets/child/修改成功.mp3"),
        userWechat: require("@/assets/child/请使用微信扫码支付.mp3"),
        overduce: require("@/assets/child/逾期提示支付信息.mp3"),
        overduceSuccess: require("@/assets/child/支付成功.mp3"),
        fingerprint: require("@/assets/audio/请进行指纹认证.mp3"),


      },
      audioSrc: "",
    };
  },
  computed: {
    caption() {
      return this.$store.state.Borrow.caption;
    },
    back() {
      return this.$store.state.Setting.back;
    },
    audioLabel() {
      return this.$store.state.Setting.audioLabel;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    appType() {
      return this.$store.state.Setting.appType;
    },
  },
  watch: {
    caption: {
      handler(val) {
        if (val) {
          this.cycleStart();
        }
      },
      immediate: true,
    },
    audioLabel: {
      handler(val) {
        this.$nextTick(() => {
          this.playAudio(val);
        });
      },
      immediate: true,
    },
  },
  destroyed() {
    clearTimeout(this.interval);
  },
  methods: {
    /**
     * 播放语音
     */
    playAudio(label) {
      let audio = document.getElementById("audio");
      // console.log(label, "内容");
      audio.addEventListener("canplay", () => {
        // console.log("加载成功");
        audio.play();
      });
      audio.addEventListener("play", () => {
        // console.log("播放成功");
      });
      if (!label) {
        audio.pause();
        this.audioSrc = "";
      } else {
        let current =
          this.appType == "one" &&
            this.manageSetting.selfServiceBorrowHardwareStyle == "CHILD"
            ? this.audioChild
            : this.audioObj;
        this.audioSrc = current[label];
      }
    },
    /**
     * @description:开始循环
     */
    cycleStart() {
      if (this.interval) {
        clearTimeout(this.interval);
      }
      // this.$props.time
      this.timeText = this.$props.time;
      this.timeCycle();
    },
    /**
     * @description:时间循环
     */
    timeCycle() {
      this.interval = setTimeout(() => {
        this.timeText = this.timeText - 1;
        if (this.timeText <= 0) {
          this.cycleEnd();
        } else {
          this.timeCycle();
        }
      }, 1000);
    },
    /**
     * @description:循环结束
     */
    cycleEnd() {
      this.timeText = this.$props.time;
      clearTimeout(this.interval);
      if (!this.back) {
        this.$router.replace("/");
        // location.reload();
      } else {
        // console.log("设置back为false");
        this.$store.dispatch("modifyBack", false);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.caption-time {
  position: absolute;
  right: 2rem;
  // top: 6%;
  font-size: 1.7rem !important;

  .time {
    color: #1da1f2;
  }
}
</style>
