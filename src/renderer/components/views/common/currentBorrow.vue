<template>
    <div class="table-info mt-110-table">
        <div>
            <div class="table font-14">
                <div class="tr h-40">
                    <div class="th flex-one">书名</div>
                    <div class="th t-10">定价</div>
                    <!-- <div class="th t-18">出版社</div> -->
                    <div class="th flex-one">索书号</div>
                    <div class="th t-11">条码号</div>
                    <!-- <div class="th t-12">架位号</div> -->
                    <div class="th t-12">应还日期</div>
                </div>
                <div class="max-table">
                    <div
                        class="tr h-52"
                        v-for="(item, index) in bookList"
                        :key="index"
                    >
                        <div class="td flex-one">{{ item.positiveTitle }}</div>
                        <div class="td t-10">{{ item.price }}</div>
                        <!-- <div class="td t-18">{{ item.press }}</div> -->
                        <div class="td flex-one">{{ item.callNumber }}</div>
                        <div class="td t-11">{{ item.barCode }}</div>
                        <!-- <div class="td t-12">{{ item.code }}</div> -->
                        <div class="td t-12">
                            {{ item.borrowAlso | dateTime([]) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-row flex-center mt-40" v-if="status == 'confirm'">
            <button
                class="form-blue-btn font-24 mr-20"
                :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
                @click="confirmBorrow"
            >
                重新查询
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bookList: [],
            status: "confirm",
        };
    },
    computed: {
        list() {
            return this.$store.state.Borrow.progreeList;
        },
        skin() {
            return this.$store.state.Setting.skin;
        },
        type() {
            return this.$route.meta.type;
        },
        platform() {
            //平台信息
            return this.$store.state.Setting.platform;
        },
        user() {
            //读者证号
            return this.$store.state.User;
        },
        backStatus() {
            return this.$store.state.Setting.back;
        },
    },
    watch: {
        backStatus(val) {
            if (!val) {
                this.reback();
            }
        },
    },
    created() {
        let list = JSON.parse(JSON.stringify(this.list));
        list.push({
            name: "当前借阅",
            select: true,
            ico: "current_",
            menu: true,
        });
        this.$store.dispatch("modifyProgreeList", list);

        this.$store.dispatch("modifyCaption", "当前借阅查询");
        this.confirmBorrow();
    },
    methods: {
        // /**
        //  * @description:确定借书or确定还书
        //  */
        // confirmBorrow() {
        //   this.status = "success";
        //   this.$store.dispatch(
        //     "modifyProgreeList",
        //     this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
        //   );
        //   this.$store.dispatch(
        //     "modifyCaption",
        //     this.type == "borrow" ? "借书成功，可打印凭条" : "还书成功"
        //   );
        // },
        /**
         * 获取当前借阅
         */
        confirmBorrow() {
            let query = {
                borrowType: 1, //当前借阅
                page: 0,
                size: 999,
                platformId: this.platform.id,
                readerNumber: this.user.readCard || this.user.codeInfo,
            };
            this.$axios
                .get(
                    "/hardware/interface/borrowingInformationBorrowFalse",
                    query
                )
                .then((res) => {
                    this.bookList = res.data.content;
                })
                .catch((err) => {
                    this.$store.dispatch(
                        "add_to_error_log",
                        "获取当前借阅失败"
                    );
                    this.$func.toast({
                        content: "获取当前借阅失败",
                        type: "ERROR",
                    });
                });
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
        height: 60rem;
    max-height: 60rem !important;
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