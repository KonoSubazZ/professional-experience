<template>
    <div class="table-info">
        <div class="" v-if="status == 'table'">
            <div>
                <div class="table font-14">
                    <div class="tr h-40">
                        <div class="th t-27">书名</div>
                        <div class="th t-12">定价</div>
                        <div class="th t-13">索书号</div>
                        <div class="th t-12">条码号</div>
                        <div class="th t-13">架位号</div>
                        <div class="th t-13">应还日期</div>
                        <div class="th t-10">是否超期</div>
                    </div>
                    <div class="max-table">
                        <div
                            class="tr h-52"
                            v-for="(item, index) in overduceList"
                            :key="index"
                        >
                            <div
                                class="td t-27"
                            
                            >
                                {{ item.positiveTitle }}
                            </div>
                            <div class="td t-12">{{ item.price }}</div>
                            <div
                                class="td t-13"
                                
                            >
                                {{ item.callNumber }}
                            </div>
                            <div
                                class="td t-12"
                                
                            >
                                {{ item.barCode }}
                            </div>
                            <div
                                class="td t-13"
                               
                            >
                                {{ item.code }}
                            </div>
                            <div
                                class="td t-13"
                              
                            >
                                {{ item.borrowAlso }}
                            </div>
                            <div class="td t-10 color-red">是</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-row flex-center mt-40">
                <button class="form-blue-btn font-24 mr-20" @click="recertify">
                    前往人工台处理
                </button>
                <button class="form-yellow-btn font-24" @click="getCode">
                    线上支付
                </button>
            </div>
        </div>
        <div class="scan-code" v-if="status == 'code'">
            <div class="flex-row flex-center">
                <img
                    class="w-200"
                    :src="httpUrl + '/' + this.orderInfo.data.qrUrl"
                    alt
                />
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
                <img
                    class="w-24"
                    src="@/assets/images/child/error_icon.png"
                    alt
                />
                <div class="color-red font-18">支付失败</div>
            </div>
            <div class="flex-row flex-center mt-40">
                <button class="form-blue-btn font-24 mr-10" @click="onlinePay">
                    重新扫码
                </button>
                <button class="form-yellow-btn font-24" @click="recertify">
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
                <img
                    class="w-24 mr-10"
                    src="@/assets/images/light/success.png"
                    alt
                />
                <div class="color-blue font-18 text-center">
                    往日逾期罚款处理成功，权限已恢复。
                    <br />请在3日内归还逾期图书或续借，以
                    <br />免继续产生逾期费用！
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timeout: "",
            orderInfo: {}, //逾期订单信息
            status: "table", //talbe,code,fail,success
            list: [
                {
                    name: "选择认证方式",
                    select: true,
                    ico: "auth_",
                },
                {
                    name: "进行认证",
                    select: true,
                    ico: "loading_",
                },
                {
                    name: "处理逾期罚款",
                    select: true,
                    ico: "overduce_",
                    path: "/borrow/password",
                },
                {
                    name: "权限恢复",
                    select: false,
                    ico: "restore_",
                    path: "/borrow/book",
                },
            ],
        };
    },
    created() {
        this.$store.dispatch("add_to_log", "逾期罚款");

        this.$store.dispatch("modifyProgreeList", this.list);
        this.$store.dispatch(
            "modifyCaption",
            "当前权限被锁定,请先处理逾期罚款，处理后自动恢复"
        );
    },
    computed: {
        skin() {
            return this.$store.state.Setting.skin;
        },
        platform() {
            return this.$store.state.Setting.platform;
        },
        user() {
            return this.$store.state.User;
        },
        backStatus() {
            return this.$store.state.Setting.back;
        },
        httpUrl() {
            return this.$store.getters.http;
        },
        overduceList() {
            return this.$store.state.User.overduceList;
        },
    },
    watch: {
        backStatus(val) {
            if (!val) {
                if (this.status == "table") {
                    this.$router.replace("/");
                } else {
                    this.payFail();
                }
            }
        },
    },
    destroyed() {
        this.$store.commit("set_label_name", "");
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    },
    methods: {
        showMoreInfo(value) {
            this.$func.toast({
                content: value,
                type: "INFO",
            });
        },
        /**
         * 前往人工台处理 返回首页
         */
        recertify() {
            this.$store.dispatch("add_to_log", "人工处理");
            this.$router.replace("/");
            // location.reload();
        },
        /**
         * @description:线上支付
         */
        onlinePay() {
            this.status = "code";
            this.$store.dispatch("add_to_log", "线上支付");
            this.$store.commit("set_label_name", "overduce");

            this.$store.dispatch("modifyCaption", "请使用微信扫码支付");
            this.timeout = setInterval(() => {
                this.searchPaystatus();
            }, 1000);
        },
        /**
         * 查询支付状态
         */
        searchPaystatus() {
            this.$axios
                .get("/hardware/interface/orderStatus", {
                    orderNumber: this.orderInfo.data.orderNumber,
                })
                .then((res) => {
                    let data = res.data;
                    if (data == "PAY") {
                        clearInterval(this.timeout);
                        this.paySuccess();
                    }
                });
        },
        /**
         * 调用获取二维码接口
         */
        getCode() {
            this.$axios
                .post("/hardware/interface/payFine", {
                    platformId: this.platform.id,
                    readerNumber: this.user.readCard || this.user.codeInfo,
                })
                .then((res) => {
                    this.$store.dispatch("add_to_log", "调用二维码");
                    this.orderInfo = res;
                    this.onlinePay();
                })
                .catch((err) => {
                    this.$store.dispatch("add_to_error_log", "调用二维码失败");
                    this.$func.toast({
                        content: "系统错误，请联系管理员",
                        type: "ERROR",
                    });
                });
        },

        /**
         * @description:支付失败
         */
        payFail() {
            this.status = "fail";
            console.log("这里");
            this.$store.dispatch("add_to_error_log", "支付失败");

            this.$store.dispatch("modifyCaption", "支付失败");
        },
        /**
         * @description:支付成功
         */
        paySuccess() {
            this.status = "success";
            this.$store.commit("set_label_name", "overduceSuccess");
            this.$store.dispatch("add_to_log", "支付成功");
            this.$store.dispatch("modifyCaption", "支付成功");
        },
        /**
         * @description:打印凭条
         */
        print() {
            this.reback();
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
    top: 25%;
    width:100%;
    left: 0;
    right: 0;
    margin: 0 auto;
      .font-14 {
    font-size: 1.1rem !important;
  }
  .font-18 {
    font-size: 1.7rem !important ;
  }
  .font-24 {
    font-size: 1.7rem !important;
  }
  .h-40 {
    height: 2.2rem !important;
  }
  .h-52 {
    height: 2.7rem;
  }
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
        height: 13rem;
    max-height: 30rem !important;
    }
    .tr {
        display: flex;
    }
    .th {
        background-color: #f0f8fd;
        // border: 1px solid #f0f8fd;
        text-align: center;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .td {
        text-align: center;
        word-break: break-all;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>