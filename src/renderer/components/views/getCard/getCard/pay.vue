<template>
  <div class="pay-code">
    <div class="scan-code" v-if="status == 'code' && order && order.payQR">
      <div class="flex-row flex-center">
        <img class="w-200" :src="httpUrl + '/' + order.payQR" alt />
      </div>
      <div class="text-center mt-10">微信支付</div>
    </div>
    <div class="scan-code" v-if="status == 'code' && order && !order.payQR">
      <div class="flex-row flex-center">
        <img class="w-24" style="margin-right:1rem" src="@/assets/images/light/success.png" alt />
        <div class="color-blue font-18">无需支付押金，请点击下一步</div>
      </div>
      <div class="flex-row flex-center">
        <button class="form-blue-btn font-24 mt-40" @click="goNext">
          下一步
        </button>
      </div>
    </div>
    <div class v-if="status == 'fail'">
      <img
        class="margin-center"
        :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
        :src="require('@/assets/images/' + skin + '/pay_error.png')"
        alt
      />
      <div class="flex-row flex-center">
        <img class="w-24" src="@/assets/images/child/error_icon.png" alt />
        <div class="color-red font-18">支付失败</div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button class="form-blue-btn font-24 mr-10" @click="onlinePay">
          重新扫码
        </button>
        <!-- <button class="form-yellow-btn font-24" @click="searchPay">支付查询</button> -->
        <button class="form-yellow-btn font-24" @click="goHome">
          前往人工台办理
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "code",
      setTimeOut: "",
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    httpUrl() {
      return this.$store.getters.http;
    },
    order() {
      return this.$store.state.User.orderCard;
    },
  },
  created() {
    this.$store.dispatch("add_to_log", "支付押金");

    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    if(this.order&&this.order.payQR){
      this.onlinePay();
    }
  },
  mounted() {
    console.log('我是地址',this.httpUrl,this.order.payQR,this.order);
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "payMoney");
    });
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.payFail();
      }
    },
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
    if (this.setTimeOut) {
      clearInterval(this.setTimeOut);
    }
  },
  methods: {
    /**
     * @description:支付失败
     */
    payFail() {
      this.status = "fail";
      this.$store.dispatch("add_to_log", "支付失败");
      this.$store.dispatch("modifyCaption", "支付失败，请重新试或再次查询");
    },
    /**
     * go
     */
    goHome() {
      this.$router.push("/");
    },
    /**
     * 未支付押金办卡成功
     */
    goNext() {
      this.$store.dispatch("add_to_log", "未支付押金办卡成功");
      this.$router.push({
        path: this.$func.getNextPath(this.list),
      });
    },
    /**
     * @description:支付成功
     */
    paySuccess() {
      this.$store.dispatch("add_to_log", "支付成功");
      this.$router.push({
        path: this.$func.getNextPath(this.list),
      });
    },
    /**
     * @description:重新支付
     */
    onlinePay() {
      this.status = "code";

      this.$store.dispatch("modifyCaption", "请使用微信扫码支付押金");
      this.setTimeOut = setInterval(() => {
        this.searchPay();
      }, 1000);
    },
    /**
     * @description:查询支付
     */
    searchPay() {
      this.$axios
        .get("/hardware/interface/orderStatus", {
          orderNumber: this.order.orderNumber,
        })
        .then((res) => {
          if (res.code == 500) {
            clearInterval(this.setTimeOut);
          }
          if (res.data == "PAY") {
            clearInterval(this.setTimeOut);
            this.paySuccess();
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.pay-code {
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>