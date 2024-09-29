<template>
  <div class="table-info mt-110-table">
    <div>
      <!-- style="height:25rem" -->
      <div class="table font-14">
        <div class="tr h-40">
          <div class="th flex-one">书名</div>
          <div class="th t-10">定价</div>
          <div class="th flex-one">索书号</div>
          <div class="th t-11">条码号</div>
          <div class="th t-12">应还日期</div>
          <div class="th t-10">选择</div>
        </div>
        <div class="max-table">
          <div
            class="tr line h-52"
            v-for="(item, index) in bookList"
            :key="index"
            @click="selectThis(index)"
          >
            <div class="td flex-one" >
              {{ item.positiveTitle }}
            </div>
            <div class="td t-10">{{ item.price }}</div>
            <div class="td flex-one" >
              {{ item.callNumber }}
            </div>
            <div class="td t-11">
              {{ item.barCode }}
            </div>
            <div class="td t-11">
              {{ item.borrowAlso }}
            </div>
            <div class="td t-10 check-father">
              <el-checkbox
                size="small"
                class="checkbox"
                :disabled="status == 'success'"
                v-model="item.select"
              ></el-checkbox>
              <div class="check-modal"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-row flex-center mt-40" v-if="status == 'confirm'">
      <button class="form-blue-btn font-24" @click="confirmRenew">
        确定续借
      </button>
    </div>
    <div class="flex-row flex-center mt-40" v-if="status == 'success'">
      <button class="form-blue-btn font-24 mr-10" @click="reback">返回</button>
      <button
        v-if="manageSetting.selfServiceBorrowIsPrint"
        class="form-yellow-btn font-24"
        @click="print"
      >
        打印凭条并返回
      </button>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer";

export default {
  data() {
    return {
      bookList: [],
      status: "confirm",
      renewList: [] /** 续借的数组 */,
      disabled: false /** 续借后禁止再次续借 */,
      // 判断是否点击续借了
      xujie:false
    };
  },
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
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
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
  },
  created() {
    this.testReader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$store.dispatch("modifyCaption", "选择续借图书");
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "renew");
    });
    this.getCurrentBorrow();
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.goHome();
      }
    },
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  methods: {
    showMoreInfo(value) {
      if(this.xujie){
        this.$func.toast({
        content: '只能续借一次，请回首页重新认证身份',
        type: "INFO",
      });
      }else{
        this.$func.toast({
        content: '请点击续借按钮',
        type: "INFO",
      })
    }
    },
    /**
     * @description:放弃
     */
    goHome() {
      this.$store.dispatch("modifyUserInfo", {});
      this.$router.replace("/home");
    },
    /**
     * @description:续借
     */
    selectThis(index) {
      if (this.status == "success") {
        return;
      }
      let list = JSON.parse(JSON.stringify(this.bookList));
      list[index].select = !list[index].select;
      this.bookList = list;
    },
    /**
     * @description:确定续借
     */
    confirmRenew() {
      let list = this.bookList.filter((it) => {
        return it.select;
      });
      if (!list || !list.length) {
        this.$func.toast({
          content: "请选择续借图书",
          type: "WARNING",
        });
        return;
      }
      this.renewList = [...list];
      let query = {
        ids: list.map((it) => {
          return it.literatureId;
        }),
        uuid: this.uuid,
        platformId: this.platform.id,
        readerNumber: this.user.readCard || this.user.codeInfo,
        type: "RENEW",
      };
      this.$axios
  
        .post("/hardware/interface/operatingBook", query)
        .then((res) => {
          this.$store.dispatch(
            "add_to_log",
            this.manageSetting.selfServiceBorrowIsPrint
              ? "续借成功,可打印凭条"
              : "续借成功"
          );
          this.renewSuccess(res);
          this.setPrintStr();
          this.xujie=true
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "续借接口调用失败");
          this.$func.toast({
            content: err || "系统错误，请联系管理员",
            type: "ERROR",
          });
          return;
        });
    },
    /**
     * 续借成功
     */
    renewSuccess(res) {
      this.status = "success";
      this.disabled = true;
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "renewSuccess");
      });
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
      );
      this.$store.dispatch(
        "modifyCaption",
        this.manageSetting.selfServiceBorrowIsPrint
          ? "续借成功,可打印凭条" 
          : "续借成功"
      );
      this.getCurrentBorrow();
    },
    /**
     * 获取当前借阅
     */
    getCurrentBorrow() {
      let query = {
        borrowType: 1, //当前借阅
        page: 0,
        size: 999,
        platformId: this.platform.id,
        readerNumber: this.user.readCard || this.user.codeInfo,
      };
      this.$axios
        .get("/hardware/interface/borrowingInformationBorrowFalse", query)
        .then((res) => {
          console.log('我是借阅日期的',res);
          this.$store.dispatch("add_to_log", "获取当前借阅");
          let list = res.data.content || [];
          list.forEach((it) => {
            it.borrowAlso = this.$func.changeDate(it.borrowAlso);
          });
          this.bookList = list;
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "获取当前借阅接口调用失败");
          // this.$func.toast({
          //     content: "系统错误，请联系管理员",
          //     type: "ERROR",
          // });
          return;
        });
    },
    /**
     * 设置打印信息
     */
    setPrintStr() {
      let bookStr = "图书书名|条码号\n";
      let dateTime =
        this.$func.changeDate() + " " + this.$func.changeTime("", ["h", "m"]);
      this.renewList.forEach((it) => {
        bookStr = bookStr + `${it.positiveTitle}|${it.barCode}\n`;
      });
      let line = "-------------------\n";
      let str = `蓝鲸图书馆借还机\n${line}操作：续借 \n${bookStr}${line}日期：${dateTime}\n${line}读者姓名：${this.user.userInfo.name}\n读者卡号：${this.user.userInfo.number}\n读者类型：${this.user.userInfo.readerTypeName}\n`;
      this.printStr = str;
    },
    /**
     * @description:打印凭条
     */
    print() {
      console.log(this.printStr);
      let status = this.testReader.startPrint(this.printStr);
      if (status == 606) {
        this.$store.dispatch("add_to_error_log", "打印api调用失败");
        this.$func.toast({
          content: "打印失败，请联系管理员",
          type: "ERROR",
        });
        return;
      } else {
        this.$store.dispatch("add_to_log", "打印续借成功");
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
.check-father {
  position: relative;
}
.check-modal {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  top: 0;
}
.checkbox {
  cursor: not-allowed;
}
.flex-one {
  flex: 1;
}
.table-info {
  position: absolute;
  top: 25%;
  width: 100%;
  left: 0;
  right: 0;
  margin: 0 auto;
  .mt-40 {
    margin-top: 15px;
    .font-14 {
      font-size: 1.1rem !important;
    }
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
  height: 60rem;
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
    height: 58rem;
    max-height: 58rem !important;
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