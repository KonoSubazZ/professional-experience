<template>
  <div class="select-deno">
    <div class="deno-input" v-if="type == 'input'">
      <div
        class="form-input"
        :class="inputStatus ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''"
      >
        <input
          class="font-28"
          id="inputNumber"
          ref="inputNumber"
          @blur="delName('inputNumber')"
          @focus.stop="addName('inputNumber')"
          @click.stop=""
          type="text"
          onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
          placeholder="请输入金额"
          v-model.number="inputNumber"
        />
      </div>
      <div class="mt-40">
        <button
          class="form-blue-btn font-24 mr-20"
          :style="skin != 'child' ? 'border-radius:5px' : ''"
          @click="confirm"
        >
          确定
        </button>
        <button
          class="form-yellow-btn font-24"
          :style="skin != 'child' ? 'border-radius:5px' : ''"
          @click="(type = 'select'), (inputNumber = 1)"
        >
          选择金额
        </button>
      </div>
    </div>
    <div class="deno-list" v-if="type == 'select'">
      <div
        class="deno-item"
        v-for="(item, index) in denoList"
        :key="index"
        @click="goPay(item.number)"
      >
        <span style="font-size:25px">{{ item.name }}</span>
        <span style="font-size:25px">元</span>
        <!-- <span class="font-30">{{ item.name }}</span>
        <span class="font-20">元</span> -->
      </div>
      <div class="deno-item" style="font-size:25px" @click="type = 'input'">输入金额</div>
    </div>

    <keybord
      :type="keySet.type"
      :top="keySet.top"
      @result="getResult"
      :left="keySet.left"
      v-if="keySet.show"
    ></keybord>
  </div>
</template>

<script>
export default {
  components: {
    keybord: () => import("@/components/common/keyboard2.vue"),
  },
  data() {
    return {
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      selectName: "",

      type: "select",
      inputStatus: false,
      inputNumber: "",
      denoList: [
        {
          name: "20",
          number: 20,
        },
        {
          name: "50",
          number: 20,
        },
        {
          name: "100",
          number: 100,
        },
        {
          name: "200",
          number: 200,
        },
      ],
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
  },
  created() {
    this.$store.dispatch("add_to_log", "选择充值金额");
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "selectMoney");
    });
    document.body.addEventListener("click", (data) => {
      if (this.keySet.show) {
        this.inputStatus = false;
        this.changeOpen(false);
      }
    });
  },
  methods: {
    /**
     * @description:添加name
     */
    addName(name) {
      this.inputStatus = true;
      if (this.selectName && this.selectName != name) {
        this.className = this.className.replace(this.selectName, "");
        this.selectName = "";
      }
      this.selectName = name;
      this.setKeybord(name);
    },
    /**
     * 获取输入值
     */
    getResult(data) {
      if (data && data != "del") {
        this.inputNumber = this.inputNumber + data;
      } else if (data == "del") {
        this.inputNumber = this.inputNumber.substring(
          0,
          this.inputNumber.length - 1
        );
      } else {
        this.inputNumber = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = this.$refs[name].getBoundingClientRect();
      this.keySet.top = item.top + item.height + 10;
      this.keySet.left = item.left;
      this.changeOpen(true);
    },
    /**
     * 改变键盘的状态
     */
    changeOpen(status) {
      this.keySet.show = status;
      this.keySet = Object.assign({}, this.keySet);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.selectName = name;
    },
    /**
     * @description:去支付
     */
    goPay(number) {
      this.$axios
        .post("/hardware/interface/orderHardwarePay", {
          price: number,
          readerId: this.userInfo.id,
          platformId: this.platform.id,
        })
        .then((res) => {
          this.$store.commit("set_pay_number", number);
          this.$store.dispatch("modifyOrderPay", res.data);
          this.$router.push({
            path: this.$func.getNextPath(this.list),
          });
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", err);
          this.$func.toast({
            content: "充值失败，请联系管理员",
            type: "ERROR",
          });
        });
    },
    confirm() {
      if (!this.inputNumber) {
        this.$func.toast({
          content: "请输入金额",
          type: "INFO",
        });
        return;
      }
      if (isNaN(Number(this.inputNumber))) {
        this.$func.toast({
          content: "请输入正确的金额",
          type: "INFO",
        });

        return;
      }
      if(this.inputNumber<1){
        this.$func.toast({
          content: "充值不能小于1元",
          type: "INFO",
        });
        return
      }
      this.goPay(this.inputNumber);
    },
  },
};
</script>

<style lang="less" scoped>
.select-deno {
  position: absolute;
  top: 45%;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 14%;

  .deno-input {
    width: 50%;
    margin: 0 auto;
  }
  .deno-list {
    display: flex;
    justify-content: center;
    height: 100%;
    .deno-item {
      border: 1px dashed rgba(29, 161, 242, 0.4);
      background-color: rgba(29, 161, 242, 0.1);
      width: 18%;
      padding: 3.5% 0;
      margin: 0 1%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }
  }
  .form-input {
    width: 115% !important;
    height: 65px;
  }
}
</style>