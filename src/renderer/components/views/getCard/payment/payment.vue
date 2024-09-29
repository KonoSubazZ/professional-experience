<template>
  <div class="table-info">
    <div class="scan-code" v-if="status == 'code'">
      <div class="flex-row flex-center">
        <img class="w-200" :src="httpUrl + '/' + order.qr" alt />
      </div>
      <div class="text-center">微信支付</div>
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
        :src="require('@/assets/images/' + skin + '/auth_error.png')"
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
        <button class="form-yellow-btn font-24" @click="reback">
          前往人工台处理
        </button>
      </div>
    </div>
    <div class v-if="status == 'success'">
      <img
        class="margin-center"
        :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
        :src="require('@/assets/images/' + skin + '/pay_success.png')"
        alt
      />
      <div class="flex-row flex-center align-top">
        <img class="w-24 mr-10" src="@/assets/images/light/success.png" alt />
        <div class="color-blue font-18 text-center">{{manageSetting.selfServiceCardMachineIsPrint?"充值成功，可打印凭条":"充值成功"}}</div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button v-if="manageSetting.selfServiceCardMachineIsPrint" class="form-blue-btn font-24 mr-10" @click="print">
          打印凭条并返回
        </button>
        <button class="form-yellow-btn font-24" @click="reback">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer.js";

export default {
  data() {
    return {
      status: "code", //code,fail,success
    };
  },
  created() {
    this.$store.dispatch("add_to_log", "微信支付");

    this.testReader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.onlinePay();
  },
  mounted() {
    console.log(this.userInfo.name);
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "userWechat");
    });
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    httpUrl() {
      return this.$store.getters.http;
    },
    order() {
      return this.$store.state.User.orderPay;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    payNumber() {
      return this.$store.state.User.payNumber;
    },
        manageSetting() {
      return this.$store.state.Setting.manageSetting;
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
  watch: {
    backStatus(val) {
      if (!val) {
        this.payFail();
      }
    },
  },
  methods: {
    /**
     * @description:线上支付
     */
    onlinePay() {
      this.status = "code";
      this.$store.dispatch("modifyCaption", "请使用微信扫码支付");
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
          if (res.data == "PAY") {
            clearInterval(this.setTimeOut);
            this.paySuccess();
          }
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "查询支付失败");
        });
    },
    /**
     * @description:支付失败
     */
    payFail() {
      this.$store.dispatch("add_to_log", "支付失败");
      this.status = "fail";
      this.$store.dispatch("modifyCaption", "支付失败");
    },
    /**
     * @description:支付成功
     */
    paySuccess() {
      this.$store.dispatch("add_to_log", "支付成功");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "paySuccess");
      });
      this.status = "success";
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
      );
      this.$store.dispatch("modifyCaption", this.manageSetting.selfServiceCardMachineIsPrint?"支付成功，可打印凭条":"支付成功");
    },
    /**
     * @description:打印凭条
     */
    print() {
      let dateTime =
        this.$func.changeDate() + " " + this.$func.changeTime("", ["h", "m"]);
      let str = `
        蓝鲸图书馆办卡机\n
        -------------------
        订单号：${this.order.orderNumber}\n
        充值: ￥${this.payNumber}\n
        日期：${dateTime}\n
        -------------------
        读者姓名：${this.userInfo.name}\n
        读者卡号：${this.userInfo.number}\n
        读者类型：${this.userInfo.readerTypeName}\n
      `;
      let status = this.testReader.startPrint(str);
      if (status == 606) {
        this.$store.dispatch("add_to_error_log", "打印api调用失败");
        this.$func.toast({
          content: "打印失败,请联系管理员",
          type: "WARNING",
        });
      } else {
        this.$store.dispatch("add_to_log", "打印成功");
        this.reback();
      }
    },
    /**
     * @description:返回
     */
    reback() {
      this.$router.replace("/");
    },
  },
};
</script>

<style lang="less" scoped>
.t-18 {
  width: 18%;
}
.t-27 {
  width: 27%;
}
.t-13 {
  width: 13%;
}
.t-12 {
  width: 12%;
}
.t-11 {
  width: 11%;
}
.t-10 {
  width: 10%;
}
.flex-one {
  flex: 1;
}
.scan-code {
}
.table-info {
  position: absolute;
  top: 40%;
  width: 80%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.table {
  border: 1px solid rgba(29, 161, 242, 1);
  width: 100%;
  .max-table {
    &::-webkit-scrollbar {
      /* 这里的宽是指竖向滚动条的宽，高是指横向滚动条的高*/
      width: 4px;

      height: 0px;
      background-color: transparent;
    }
    /* 滚动条凹槽，还可以设置边框属性。此处属性也可以直接在容器中设置 */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #1da1f2;
    }
  }
  .tr {
    display: flex;
  }
  .th {
    background-color: #f0f8fd;
    border: 1px solid #f0f8fd;
    text-align: center;
    font-weight: bold;
  }
  .td {
    text-align: center;
  }
}
</style>