<template>
  <div class="read-book">
    <div v-if="status == 'start'">
      <img
        :src="require('@/assets/images/' + skin + '/read_book.png')"
        class="margin-center"
        :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
            ? 'w-status-dark'
            : 'w-status-light'
        "
        alt
      />
      <div class="mt-20 color-blue font-18 text-center">
        请将图书放置指定区s域
      </div>
    </div>
    <div v-if="status == 'fail'">
      <img
        class="w-status-img margin-center"
        :src="require('@/assets/images/' + skin + '/read_error.png')"
        alt
      />
      <div class="flex-row flex-center">
        <img class="w-24" src="@/assets/images/child/error_icon.png" alt />
        <div class="color-red font-18">{{ errorText }}</div>
      </div>
      <div class="flex-row flex-center mt-40">
        <button class="form-blue-btn font-24 mr-10" @click="retry">重试</button>
        <button class="form-yellow-btn font-24" @click="goHome">放弃</button>
      </div>
    </div>
    <div
      class="table-info mt-110-table"
      v-if="status == 'success' || status == 'confirm'"
    >
      <div>
        <div class="table font-14">
          <div class="tr h-40">
            <div class="th flex-one">书名</div>
            <div class="th t-10">定价</div>
            <div class="th t-10">索书号</div>
            <div class="th t-11">条码号</div>
            <div class="th t-11">架位号</div>
            <!-- <div class="th t-12" v-if="type == 'borrow' && status == 'success'">
              应还日期
            </div> -->
            <div class="th t-12">图书状态</div>
            <!-- <div class="th t-10" v-if="type == 'borrow' && status == 'success'">
              是否超期
            </div> -->
          </div>
          <div class="max-table">
            <div class="tr h-52" v-for="(item, index) in bookList" :key="index">
              <div class="td flex-one">
                {{ item.positiveTitle }}
              </div>
              <div class="td t-10">{{ item.price }}</div>
              <div class="td t-10">{{ item.callNumber }}</div>
              <div class="td t-11">{{ item.barCode }}</div>
              <div class="td t-11">{{ item.rackName }}</div>
              <!-- <div
                class="td t-12"
                v-if="type == 'borrow' && status == 'success'"
              >
                {{ item.borrowAlso | dateTime([]) }}
              </div> -->
              <div class="td t-12">{{ statusList[item.bookStatus] }}</div>

              <!-- <div
                class="td t-10"
                v-if="type == 'return' && status != 'success'"
              >
                {{ item.overDue ? "是" : "否" }}
              </div> -->
            </div>

            <div
              style="
                text-align: center;
                line-height: 30px;
                color: gray;
                height: 30px;
              "
              v-if="bookList && !bookList.length"
            >
              {{
                cacheBookLength && searchStatus
                  ? "正在查询图书书籍"
                  : cacheBookLength && !searchStatus
                  ? "未查询到图书数据,请确认放入正确的书籍或联系管理员"
                  : "请放入图书"
              }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-row flex-center mt-40"
        v-if="status == 'confirm' && bookList && bookList.length"
      >
        <button
          class="form-blue-btn font-24"
          @click="confirmBorrow"
          v-loading="confirmLoading"
        >
          {{ type == "borrow" ? "确认借书" : "确认还书" }}
        </button>
      </div>
      <div
        class="flex-row flex-center mt-40"
        v-if="status == 'success' && type == 'borrow'"
      >
        <button class="form-blue-btn font-24 mr-10" @click="reback">
          返回
        </button>
        <button
          class="form-yellow-btn font-24"
          v-if="manageSetting.selfServiceBorrowIsPrint"
          @click="print"
        >
          打印凭条并返回
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer";
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      status: "start",
      bookList: [],
      errorText: "读取图书失败，常见原因",
      cacheDepot: [], //缓存仓库
      cacheBook: [], //获取信息的仓库
      readStatus: false,
      printStr: "",
      searchStatus: false,
      statusList: {
        InCollection: "在馆",
        LEND: "借出",
        CULLING: "注销",
        LOST: "丢失",
        DAMAGE: "损坏",
      },
      confirmLoading: false,

      opreatList: [] /** 正在还书或者借书的列表 */,
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
    type() {
      return this.$route.meta.type;
    },
    apiType() {
      return this.$store.state.Setting.readerApiType;
    },
    apiTypeDetail() {
      return this.$store.state.Setting.readerApiTypeDetail;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    user() {
      return this.$store.state.User;
    },
    cacheBookLength() {
      return this.cacheBook.length;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.type == "borrow" ? this.readFail() : this.goHome();
      }
    },
    cacheBookLength: {
      handler(val) {
        this.getBook(this.cacheBook);
      },
    },
  },
  created() {
    this.testReader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
  },
  mounted() {
    this.start();
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
    if (this.readStatus) {
      this.cloaseReader();
    }
    if (this.setTimeout) {
      clearTimeout(this.setTimeout);
    }
  },
  methods: {
    /**
     * @description:重试
     */
    retry() {
      this.status = "start";
      if (this.setTimeout) {
        clearTimeout(this.setTimeout);
      }

      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setPrevFalse(JSON.parse(JSON.stringify(this.list)))
      );
      this.start();
    },
    /**
     * @descripition:调用开始
     */
    start() {
      this.$store.dispatch("modifyCaption", "请将图书放置指定区域");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "book");
      });
      this.$store.dispatch("modifyBack", true);
      this.cacheBook = [];
      this.getBookInfo(); //获取书籍数据
      if (!this.readStatus) {
        ipcRenderer.removeAllListeners("onTag");
        this.readStatus = this.testReader.inventoryRFIDReader((data) => {
          data.forEach((it) => {
            this.readBook(it.tag);
          });
        });
        if (this.readStatus == 614) {
          this.$store.dispatch("add_to_error_log", "阅读器盘点失败");

          this.readFail();
        }
      }
    },
    readFail() {
      this.status = "fail";
      this.errorText = "读取图书失败";
      this.$store.dispatch("modifyCaption", "读取图书失败");
      this.$store.dispatch("modifyBack", false);
      this.cloaseReader();
    },
    borrowFail(msg) {
      this.status = "fail";
      this.errorText = msg;
      this.$store.dispatch("modifyCaption", msg);
    },
    /**
     * @description:获取缓存信息库数据
     */
    getBookInfo() {
      if (!this.cacheBook || !this.cacheBook.length) {
        this.cacheBook = this.cacheDepot;
        this.cacheDepot = [];
        console.error("步骤一");
      } else {
        if (
          this.cacheBook
            .sort((a, b) => {
              return a - b;
            })
            .join(",") ==
          this.cacheDepot
            .sort((a, b) => {
              return a - b;
            })
            .join(",")
        ) {
          //两个数组相同不更新
          // return false;
          this.cacheDepot = [];
          console.error("步骤二");
        } else {
          console.error("步骤三", this.cacheDepot, this.cacheBook);
          this.cacheBook = this.cacheDepot;
          this.cacheDepot = [];
        }
      }
      console.error("cacheBook", this.cacheBook);
      clearTimeout(this.setTimeout);
      this.setTimeout = setTimeout(() => {
        this.getBookInfo();
      }, 700);
    },
    /**
     * @description:根据条码获取书籍信息
     */
    async getBook(list) {
      if (list && list.length) {
        this.searchStatus = true; //开始查询
        await Promise.all(
          list.map(async (item) => {
            const lists = await new Promise((rej, rek) => {
              return rej(item);
            });
            this.$axios
              .post("/hardware/interface/bookDetail", {
                platformId: this.platform.id,
                barCode: lists,
              })
              .then((res) => {
                this.searchStatus = false;
                if (res.data.content && res.data.content.length) {
                  res.data.content.forEach((it) => {
                    it.overDue =
                      new Date(it.borrowAlso).getTime() <= new Date().getTime();
                  });
                  this.bookList = res.data.content;
                } else {
                  // this.readFail();
                }
              })
              .catch((err) => {
                this.searchStatus = false;
                this.$func.toast({
                  content: "获取图书信息失败",
                  type: "WARNING",
                });
              });
          })
        );
      } else {
        console.error("为获取到数据");
        this.bookList = [];
      }
    },
    /**
     * @description:读取书籍条码，然后存入信息库
     */
    readBook(data) {
      let filter = this.cacheDepot.filter((it) => {
        return data == it;
      });
      //如果有相似的返回
      if (filter && filter.length) {
        return;
      }

      this.cacheDepot.push(data);
      this.readSuccess();
    },
    /**
     * @description:读取成功
     */
    readSuccess() {
      if (
        this.status == "confirm" ||
        this.status == "success" ||
        this.start == "fail" ||
        this.confirmLoading
      ) {
        return;
      }
      this.status = "confirm";
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
      );
      this.$store.dispatch(
        "modifyCaption",
        this.type == "borrow" ? "确定借书信息" : "确认还书信息"
      );
    },
    /**
     * @description:放弃
     */
    goHome() {
      this.$store.dispatch("modifyUserInfo", {});
      this.$router.replace("/");
    },
    /**
     * @description:确定借书or确定还书
     */
    confirmBorrow() {
      console.log("借书借书借书借书借书借书借书");
      this.cloaseReader();
      if (this.setTimeout) {
        clearTimeout(this.setTimeout);
      }
      this.opreatList = [...this.bookList];
      let query = {
        ids: this.bookList.map((it) => {
          return it.id;
        }),
        platformId: this.platform.id,
        readerNumber: this.user.readCard || this.user.codeInfo,
        type:
          this.type == "borrow"
            ? "LOAN"
            : this.type == "return"
            ? "RESTITUTION"
            : "RENEW", //借书
      };
      this.confirmLoading = true;
      this.$axios
        .post("/hardware/interface/operatingBook", query)
        .then((res) => {
          this.confirmLoading = false;

          try {
            let writeStatus = "";

            this.type == "borrow"
              ? (writeStatus = this.writeOut(this.cacheBook))
              : (writeStatus = this.writeIn(this.cacheBook));
            console.log(this.cacheBook);
          } catch (error) {
            // this.$message.error("写入标签失败" + writeStatus);
            this.$store.dispatch("add_to_error_log", "写入标签失败");

            this.$func.toast({
              content: "系统错误，请联系管理员",
              type: "ERROR",
            });
          }
          try {
            this.setPrintStr();
          } catch (error) {
            this.$store.dispatch("add_to_error_log", "设置打印失败");

            // this.$message.error("设置打印错误" + writeStatus);
          }
          this.status = "success";
          this.$store.dispatch(
            "modifyProgreeList",
            this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
          );
          if (this.type == "borrow") {
            this.$nextTick(() => {
              this.$store.commit("set_label_name", "borrrowSuccess");
            });
          } else {
            this.$nextTick(() => {
              this.$store.commit("set_label_name", "backSuccess");
            });
          }
          this.bookList.forEach((it) => {
            it.bookStatus = this.type == "borrow" ? "LEND" : "InCollection";
          });
          this.bookList = [...this.bookList];
          this.$store.dispatch(
            "modifyCaption",
            this.type == "borrow"
              ? this.manageSetting.selfServiceBorrowIsPrint
                ? "借书成功，可打印凭条"
                : "借书成功"
              : "还书成功"
          );
        })
        .catch((err) => {
          this.status = "fail";
          this.confirmLoading = false;
          if (this.setTimeout) {
            clearTimeout(this.setTimeout);
          }
          this.borrowFail(
            this.type == "borrow" ? err || "借书失败" : err || "还书错误"
          );
        });
    },
    /**
     * 设置打印信息
     */
    setPrintStr() {
      let bookStr = "图书书名|条码号\n";
      let dateTime =
        this.$func.changeDate() + " " + this.$func.changeTime("", ["h", "m"]);
      this.bookList.forEach((it) => {
        bookStr = bookStr + `${it.positiveTitle}|${it.barCode}\n`;
      });
      let line = "-------------------\n";
      let str = `蓝鲸图书馆借还机\n${line}操作：借书 \n${bookStr}${line}日期：${dateTime}\n${line}读者姓名：${this.user.userInfo.name}\n读者卡号：${this.user.userInfo.number}\n读者类型：${this.user.userInfo.readerTypeName}\n`;
      this.printStr = str;
    },
    /**
     * 关闭阅读器
     */
    cloaseReader() {
      let status = this.testReader.stopInventoryRFIDReader();
      if (status == 607) {
        this.$store.dispatch("add_to_error_log", "停止盘点失败");
      } else {
        this.readStatus = false;
      }
    },
    /**
     * 写入标签借出
     */
    writeOut(list) {
      console.log(list);
      list.forEach((it) => {
        let write = this.testReader.writeRFIDReaderOut(it);
        console.log(it, "借书顺寻4");
        if (write == 609) {
          console.log(it, "借书顺3");
          //写入错误
          // this.$message.error("图书状态改变失败，请联系管理员");
          this.$store.dispatch(
            "add_to_error_log",
            "写入标签失败" + `【${it}】`
          );

          // this.$func.toast({
          //   content: "系统错误，请联系管理员",
          //   type: "WARNING",
          // });
          return;
        }
      });
    },
    /**
     * 写入标签还入
     */
    writeIn(list) {
      list.forEach((it) => {
        console.log(it, "借书顺寻2");
        let write = this.testReader.writeRFIDReaderIn(it);
        if (write == 609) {
          console.log(it, "借书顺寻1");
          //写入错误
          // this.$message.error("图书状态改变失败，请联系管理员");
          this.$store.dispatch("add_to_error_log", "写入标签失败");
          this.$func.toast({
            content: "系统错误，请联系管理员",
            type: "ERROR",
          });
          return;
        }
      });
    },
    /**
     * @description:打印凭条
     */
    print() {
      let status = this.testReader.startPrint(this.printStr);
      if (status == 606) {
        this.$store.dispatch("add_to_error_log", "打印api调用失败");

        this.$func.toast({
          content: "打印失败，请联系管理员",
          type: "ERROR",
        });
        return;
      } else {
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
.read-book {
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  margin: 0 auto;
}

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
  width: 100%;
  left: 0;
  right: 0;
  margin: 0 auto;

  .font-14 {
    font-size: 1.1rem !important;
  }

  .font-18 {
    font-size: 1.3rem !important;
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
