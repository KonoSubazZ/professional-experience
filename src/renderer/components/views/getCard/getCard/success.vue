<template>
  <div class="pay-code">
    <div class>
      <img class="margin-center" :class="skin == 'child'
          ? 'w-status-img'
          : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        " :src="require('@/assets/images/' + skin + '/pay_success.png')" alt />
      <div class="flex-row flex-center">
        <div class="color-blue font-18" v-if="status == 'start'">
          办卡成功,可打印凭条
        </div>
      </div>
      <div class="flex-row flex-center mt-40" v-if="status == 'start'">
        <button ref="btn" class="form-blue-btn font-24 mr-10" @click="print(dayin)">
          打印凭条并返回
        </button>
        <!-- <button class="form-yellow-btn font-24" @click="searchPay">支付查询</button> -->
        <button v-if="manageSetting.selfServiceCardMachineIsPrint" class="form-yellow-btn font-24" @click="back">
          返回
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer.js";

export default {
  data() {
    return {
      status: "start",
      dayin: 1,
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
    orderCard() {
      return this.$store.state.User.orderCard;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.back();
      }
    },
  },
  created() {
    console.log(this.manageSetting.selfServiceCardMachineIsPrint);
    this.testReader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "cardSuccess");
    });
    this.$store.dispatch(
      "modifyCaption",
      this.manageSetting.selfServiceCardMachineIsPrint
        ? "办卡成功,可打印凭条"
        : "办卡成功"
    );
    this.start();
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  methods: {
    start() {
      if (this.$store.state.Setting.Tuka) {
        let status = this.testReader.frontCardDeliver();
        if (status == 612) {
          this.$message.error("出卡失败，请联系管理员");
          this.$store.dispatch("add_to_error_log", "出卡失败");
        } else {
          this.$store.dispatch("add_to_log", "出卡成功");
        }
      }

    },
    /**
     * @description:打印凭条
     */
    print() {
      this.dayin += 1;
      if (this.dayin > 2) {
        this.$refs.btn.disabled = true;
      } else {
        let dateTime =
          this.$func.changeDate() + " " + this.$func.changeTime("", ["h", "m"]);
        let str =
          `
        蓝鲸图书馆办卡机\n
        -------------------\n
        操作：办卡\n` +
          (this.orderCard && this.orderCard.orderNumber
            ? `
        订单号：${this.orderCard.orderNumber}\n`
            : ``) +
          `
        支付押金: ￥${this.orderCard.price}\n
        日期：${dateTime}\n
        -------------------\n
        办卡人姓名：${this.orderCard.name}\n
        办卡类型：${this.orderCard.readerTypeName}\n
        卡号：${this.orderCard.number}\n
        -------------------\n
        ` +
          (this.orderCard && this.orderCard.telephone
            ? `联系方式：${this.orderCard.telephone}`
            : ``);
        this.$store.dispatch("add_to_log", str);
        let status = this.testReader.startPrint(str);
        if (status == 606) {
          this.$store.dispatch("add_to_error_log", "打印失败");
          this.$message.error("打印失败,请联系管理员");
        } else {
          this.$store.dispatch("add_to_log", "打印成功");
          this.back();
        }
      }
    },
    /**
     * @description:返回
     */
    back() {
      this.$router.replace("/");
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