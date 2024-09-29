<template>
  <div class="borrow" style="position: relative">
    <audio id="audioReturn" :src="audioSrc" ref="audioRef"></audio>
    <div class="dialog" v-if="dialogStatus || lockException"></div>
    <div class="fx between center_y">
      <user ref="userRef"></user>
      <div>
        <el-button type="primary" v-if="returnShow" round size="mini" class="qr-code-icon-default" @click="backClick">
          <el-icon class="el-icon-my-qr-code"></el-icon>
          扫一扫还书
        </el-button>
        <el-button type="primary" v-else round size="mini" class="qr-code-icon-default" @click="backClick">
          <el-icon class="el-icon-my-qr-hand"></el-icon>
          手动还书
        </el-button>
      </div>
    </div>
    <div v-if="status == 'start' && !lockException">
      <div class="search_book">
        <p class="left_title">
          <img src="../../../assets/image/sort_book.png" alt="" />
          <span>{{
            returnShow
              ? `我的待还书籍(${bookList.length})`
              : "请扫描书籍的条形码"
          }}</span>
        </p>
        <div class="search_book_sort" v-if="returnShow && bookList.length > 0" style="height: 850px">
          <div class="search_book_sort_box" v-for="(item, index) in bookList" :key="index">
            <img class="book_img" v-if="item.coverUrl" :src="item.coverUrl" />
            <img class="book_img" v-else src="../../../assets/image/Index/index_borrow.png" />
            <div class="search_book_someBook_right">
              <div class="less" style="width: 500px">
                {{ item.positiveTitle }}
              </div>
              <div class="less" style="width: 500px">
                作者：{{ item.firstResponsible }}
              </div>
              <div class="less" style="width: 500px">
                应还日期：{{ date.dateFormatALL(item.borrowAlso) }}
              </div>
              <div>条码号: {{ item.barCode }}</div>
            </div>
            <div class="search_book_sort_btn">
              <el-button type="primary" round size="mini" @click="returnBook(item)">归还本书</el-button>
            </div>
          </div>
        </div>
        <div class="noSize" v-if="returnShow && bookList.length === 0">
          <img src="../../../assets/image/null.png" />
          暂无待还书籍
        </div>
        <!--        <div class="search_btn" v-if="returnShow && bookList.length>0">-->
        <!--          <el-button type="primary" round @click="returnBook">我要还所有的书</el-button>-->
        <!--        </div>-->

        <div class="rich_book" v-if="!returnShow">
          <img class="rich_img_book" src="../../../assets/image/rich_book.png" />
          <div class="rich_book_box">
            <img class="rich_img_bar" src="../../../assets/image/rich_bar.png" />
            <p>扫一扫还书</p>
          </div>
        </div>
        <el-input v-if="!returnShow" type="password" v-model="bookCode" @blur="getFocus" id="code-book"
          style="opacity: 0"></el-input>
      </div>
    </div>

    <div class="success fx-center column" v-if="status == 'openDoorSuccess'">
      <img src="../../../assets/image/success.png" />
      <p>柜门已打开</p>
      <p>还书后请您及时关闭柜门</p>
    </div>
    <div class="success fx-center column" v-if="lockException">
      <img src="../../../assets/image/success.png" />
      <p>柜门开启异常</p>
      <p>即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门</p>
    </div>
    <div class="success fx-center column" v-if="status == 'success'">
      <img src="../../../assets/image/success.png" />
      <p v-html="successMsg" style="text-align: center"></p>
      <div class="successBookBox" style="height: 480px">
        <div v-for="(item, index) in successData" :key="item.id" class="fx-center column w-98 p-10"
          :class="index !== successData.length - 1 ? 'b-b-4' : ''">
          <div class="fx-between w-100">
            <div class="w-300x">{{ "《" + item.positiveTitle + "》" }}</div>
            <div :style="{
              color:
                item.resultMsg == '借书成功'
                  ? 'rgba(255, 0, 0, 1)'
                  : item.resultMsg == '还书成功'
                    ? 'rgba(0, 132, 255, 1)'
                    : '#F56C6C',
            }">
              {{ item.resultMsg }}
            </div>
            <div>
              {{
                item.bookStatus == "已借出"
                  ? "应还日期:" + date.dateFormatDay(item.borrowAlso)
                  : "归还日期:" + date.dateFormatDay(item.borrowBookTime)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="backgrounds" v-if="status == 'returnLoading'">
    <img src="../../../assets/image/gif/book.gif" />
    <span>正在处理中，请稍后...</span>
  </div>
  <div class="backgrounds" v-if="status == 'doorLoading'">
    <img src="../../../assets/image/gif/book.gif" />
    <span>正在处理中，请稍后...</span>
  </div>
</template>
<script setup>
import user from "../../common/user.vue";
import pic from "@utils/image";
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from "vue";
import { otherInterface } from "@api/request";
import hardware from "@api/hardwareDeviceApi";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import date from "@utils/dateTime";
import resetSetItem from "@utils/session";
import { openLock, inventory, setLatticeItemLocked, checklatticeNoLocked, sendExceptionSMSMAIL } from "@utils/read.js"
const userRef = ref(null);
const audioRef = ref(null);
const bookList = ref([]);
const successBookList = ref([]);
const successReturnList = ref([]);
const successData = ref([]);
const status = ref("start");
const audioSrc = ref("");
const store = useStore();
store.dispatch("updateHead_text", "我要还书");
const init = hardware.init();
const returnShow = ref(true);
const dialogStatus = ref(false);
const time = ref("");
const successMsg = ref("");
const bookCode = ref("");
const doorTime = ref(null);
const times = ref(null);
const sendEmilTime = ref(0);
const lockException = ref(false);
window.resetSetItem = resetSetItem;
watch(bookCode, (newValue, oldValue) => {
  clearTimeout(times.value);
  times.value = setTimeout(() => {
    bookCode.value = newValue;
    if (!store.getters.getCabinetInfo.openCase) {
      return ElMessage.error("暂未开放打开柜门功能");
    }
    returnBook();
    nextTick(() => {
      getFocus();
    });
  }, 1000);
});
watch(
  status,
  (value, oldValue) => {
    store.dispatch("setStatus", value);
  },
  { immediate: true }
);
// 新加的去重操作
const uniqueArr = (list) => {
  return [...new Set(list)];
};
//点击还书
const returnBook = async (item) => {
  if (!store.getters.getCabinetInfo.openCase) {
    return ElMessage.error("暂未开放打开柜门功能");
  }
  const check = await checkOperatingBook(item ? item.barCode : bookCode.value);
  if (!check.data) {
    bookCode.value = "";
    ElMessage.error(check.message);
    return;
  }
  let params = {
    barCodes: item
      ? [item.barCode]
      : bookCode.value
        ? [bookCode.value]
        : bookList.value.map((it) => it.barCode),
    platformId: store.getters.platform.platformId,
    caseId: store.getters.platform.id,
  };
  dialogStatus.value = true;
  status.value = "doorLoading";
  otherInterface
    .getLatticeNoOfBack(params)
    .then((res) => {
      if (res.code == 0) {
        const RFID_STATUS = init.open(store.getters.platform.info.rfidIP); //因为返回格子编号接口已经进行盘点和断开了，所以要再调一次打开
        if (RFID_STATUS != 0) {
          ElMessage.error('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');
          status.value = "start";
          return;
        }
        setTimeout(() => {
          if (!res.data.latticeNo) {
            dialogStatus.value = false;
            status.value = "start";
            ElMessage.error("没有可以归还的格子,请联系管理员");
            return;
          }

          // 校验书柜格子是否被锁定
          if (checklatticeNoLocked(String(res.data.latticeNo))) {
            ElMessage.warning("当前格子已经被管理员锁定,暂时无法进行借还书操作")
            dialogStatus.value = true;
            status.value = "start";
            return
          }

          const maxAttempts = 3 // 开锁最大尝试次数
          const isOpened = openLock(() => init.openLock(String(res.data.latticeNo)), () => init.getLockState(String(res.data.latticeNo)), maxAttempts)

          if (isOpened) {
            nextTick(() => {
              playAudio("returnBookAudio");
            });
            openDoorSuccess(res);
            let sendEmil = false;
            doorTime.value = setInterval(() => {
              setTimeout(() => {
                nextTick(() => {
                  playAudio("closeDoor");
                });

                if (!sendEmil) {
                  sendEmilTime.value++;
                  if (sendEmilTime.value == 12) {
                    let params = {
                      caseId: store.getters.platform.id,
                      latticeNo: res.data.latticeNo,
                    };
                    otherInterface.sendMail(params).then((mailRes) => {
                      if (mailRes.code == 0) {
                        sendEmil = true;
                        sendEmilTime.value = 0;
                      }
                    });
                  }
                }
              }, 5000);
              removeListener();
            }, 5000);
          } else {
            dialogStatus.value = false;
            ElMessage.error('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');
            status.value = "start";
            // 发送短信邮件
            sendExceptionSMSMAIL(store.getters.platform.id, item.latticeNo ? item.latticeNo : inputInfo.number, 1)

            // 锁定柜子
            setLatticeItemLocked(String(res.data.latticeNo));

            // 开锁成功 但是获取不到锁状态值0 进行盘点
            lockException.value = true
            store.dispatch("setLockException", lockException.value);

            setTimeout(() => {
              const maxAttempts = 3 // 盘点三次
              const inventoryBookList = inventory(() => init.inventoryOne(item.latticeNo ? item.latticeNo : inputInfo.number), maxAttempts)

              // 盘点器连接正常并返回盘点结果
              if (Array.isArray(inventoryBookList)) {
                console.log(Array.isArray(inventoryBookList), 'Array.isArray(inventoryBookList)')
                getLackBookInfo(unique(inventoryBookList), item)
              } else {
                ElMessage.error('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');
              }
              lockException.value = false;
              store.dispatch("setLockException", lockException.value);

            }, 15 * 1000);

          }
        }, 2000);
      } else {
        dialogStatus.value = false;
        status.value = "start";
        ElMessage.error("还书失败，请重试");
      }
    })
    .catch((err) => {
      dialogStatus.value = false;
      status.value = "start";
      bookCode.value = "";
    });
};
// 获取配置信息
const infoData = computed(() => {
  return store.getters.platform.info;
});
const inventoryOneTime = ref(null); //延时盘点
const openDoorSuccess = (res) => {
  clearTimeout(inventoryOneTime.value);
  status.value = "openDoorSuccess";
  let openStatus = false;
  if (!openStatus) {
    //开启定时循环查询锁状态
    time.value = setInterval(() => {
      let lockStatus = init.getLockState(String(res.data.latticeNo));
      resetSetItem("lockStatus", lockStatus);
      store.dispatch("setDoorStatus", lockStatus);
      //如果锁状态为关时，清除定时器，状态改为true
      if (lockStatus.indexOf("关") !== -1) {
        clearInterval(doorTime.value);
        clearInterval(time.value);
        openStatus = true;
        resetSetItem("lockStatus", lockStatus);
        store.dispatch("setDoorStatus", lockStatus);
        if (openStatus) {
          status.value = "returnLoading";
          inventoryOneTime.value = setTimeout(() => {
            console.log("开始盘点");
            let inv1 = init.inventoryOne(String(res.data.latticeNo));
            if (infoData.value.typeL == "hf") {
              setTimeout(() => {
                let inv2 = init.inventoryOne(String(res.data.latticeNo));
                let PIIList = unique(inv1.concat(inv2));
                getLackBookInfo(PIIList, String(res.data.latticeNo));
              }, 3000);
            } else {
              console.log("超高频的还书");
              if (inv1 && inv1.length) {
                let PIIList = unique(inv1);
                getLackBookInfo(PIIList, String(res.data.latticeNo));
              } else {
                getLackBookInfo(inv1, String(res.data.latticeNo));
              }
            }
          }, 100);
        }
      }
    }, 1500);
  }
};
const unique = (arr) => {
  const res = new Map();
  return arr.filter((arr) => !res.has(arr.PII) && res.set(arr.PII, 1));
};

const bookDetail = async (barCode) => {
  let params = {
    barCode: barCode,
    platformId: store.getters.platform.platformId,
  };
  return await otherInterface.getBookDetail(params);
};

const getMyBorrow = async () => {
  let params = {
    borrowType: "1",
    platformId: store.getters.platform.platformId,
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.getMyBorrow(params);
};

const operateBookAll = (list, lattice, LOAN, RESTITUTION) => {
  successBookList.value = [];
  successReturnList.value = [];
  successData.value = [];
  let LoanList = list[LOAN];
  let ReturnList = list[RESTITUTION];
  let LOANS = new Promise((resolve, reject) => {
    let params = {
      barCodes: uniqueArr(LoanList),
      platformId: store.getters.platform.platformId,
      uuid: store.getters.getUUID,
      type: LOAN,
      readerNumber: store.getters.getUserInfo.number,
      latticeNo: lattice,
      // caseId: store.getters.platform.id,
    };
    otherInterface.operatingBook(params).then((res) => {
      resolve({ code: res.code, res });
    });
  });

  let RESTITUTIONS = new Promise((resolve, reject) => {
    let params = {
      barCodes: uniqueArr(ReturnList),
      platformId: store.getters.platform.platformId,
      uuid: store.getters.getUUID,
      type: RESTITUTION,
      readerNumber: store.getters.getUserInfo.number,
      latticeNo: lattice,
    };
    otherInterface.operatingBook(params).then((res) => {
      resolve({ code: res.code, res });
    });
  });

  Promise.all([LOANS, RESTITUTIONS]).then(async (res) => {
    const [data, data1] = res;
    let LoanAll = data.res.data;
    let ReturnAll = data1.res.data;
    let LoanTrueNumber = 0; //借书成功的
    let ReturnTrueNumber = 0; //还书成功的
    if (data.code == 0 && data1.code == 0) {
      const myBorrow = await getMyBorrow();
      nextTick(() => {
        playAudio("returnSuccess");
      });
      if (LOAN) {
        for (let i = 0; i < LoanAll.length; i++) {
          const result = await bookDetail(LoanAll[i].barCode);
          result.data.content.map((ik) => {
            if (LoanAll[i].barCode === ik.barCode) {
              LoanAll[i].resultMsg == "借书成功" && LoanTrueNumber++;
              ik.resultMsg = LoanAll[i].resultMsg;
              successBookList.value.push(ik);
            }
          });
        }
      }
      if (RESTITUTION) {
        for (let i = 0; i < ReturnAll.length; i++) {
          const result = await bookDetail(ReturnAll[i].barCode);
          result.data.content.map((ik) => {
            if (ReturnAll[i].barCode === ik.barCode) {
              ReturnAll[i].resultMsg == "还书成功" && ReturnTrueNumber++;
              ik.resultMsg = ReturnAll[i].resultMsg;
              successReturnList.value.push(ik);
            }
          });
        }
      }
      successData.value = successReturnList.value.concat(successBookList.value);
      successData.value.map((it) => {
        for (let i = 0; i < myBorrow.data.length; i++) {
          if (list[LOAN].includes(it.barCode)) {
            it.bookStatus = "已借出";
            it.borrowAlso = myBorrow.data[i].borrowAlso;
          } else if (RESTITUTION) {
            it.bookStatus = "已归还";
            it.borrowBookTime = new Date().getTime();
          }
        }
      });
      successMsg.value = `此次成功借出<span class="successColor">${LoanTrueNumber}</span>本图书，归还<span class="successColor">${ReturnTrueNumber}</span>本图书`;
      userRef.value.getReaderOtherInfo();
      status.value = "success";
      setTimeout(() => {
        getBorrow();
        returnShow.value = true;
        status.value = "start";
        dialogStatus.value = false;
      }, 5000);
    } else {
      ElMessage.error("操作失败，请重新尝试");
      status.value = "start";
      dialogStatus.value = false;
    }
  });
};

//进行还书操作
const operateBook = (list, lattice, type) => {
  successBookList.value = [];
  successData.value = [];
  let params = {
    barCodes: uniqueArr(list),
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: type,
    readerNumber: store.getters.getUserInfo.number,
    latticeNo: lattice,
  };
  otherInterface.operatingBook(params).then(async (res) => {
    if (res.code == 0) {
      const myBorrow = await getMyBorrow();
      if (type == "LOAN") {
        nextTick(() => {
          playAudio("borrowSuccess");
        });
      } else {
        nextTick(() => {
          playAudio("returnSuccess");
        });
      }
      let TrueValue = 0; //借书或还书成功多少本
      for (let i = 0; i < res.data.length; i++) {
        const result = await bookDetail(res.data[i].barCode);
        result.data.content.map((ik) => {
          if (res.data[i].barCode === ik.barCode) {
            ik.resultMsg = res.data[i].resultMsg;
            if (type === "LOAN") {
              ik.resultMsg == "借书成功" && TrueValue++;
              successBookList.value.push(ik);
            } else {
              ik.resultMsg == "还书成功" && TrueValue++;
              successBookList.value.push(ik);
            }
          }
        });
      }
      successData.value = successData.value.concat(successBookList.value);
      successData.value.map((it) => {
        if (myBorrow.data.length === 0) {
          if (type == "RESTITUTION") {
            it.bookStatus = "已归还";
            it.borrowBookTime = new Date().getTime();
          }
        } else {
          for (let i = 0; i < myBorrow.data.length; i++) {
            if (type == "RESTITUTION") {
              it.bookStatus = "已归还";
              it.borrowBookTime = new Date().getTime();
            } else if (list.includes(it.barCode)) {
              it.bookStatus = "已借出";
              it.borrowAlso = myBorrow.data[i].borrowAlso;
            }
          }
        }
      });

      successMsg.value =
        type == "LOAN"
          ? `借书成功，此次借出<span class="successColor">${TrueValue}</span>本图书`
          : `还书成功，此次归还成功<span class="successColor">${TrueValue}</span>本图书`;
      userRef.value.getReaderOtherInfo();
      status.value = "success";
      setTimeout(() => {
        getBorrow();
        returnShow.value = true;
        status.value = "start";
        dialogStatus.value = false;
      }, 5000);
    } else {
      status.value = "start";
      ElMessage.error(res.message);
      dialogStatus.value = false;
    }
  });
};

//根据当前盘点的图书对比获取格子里少的或多的图书条码号
const getLackBookInfo = (data, lattice) => {
  let params = {
    bookBarCodes: data.length > 0 ? data.map((it) => it.PII) : data,
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    latticeNo: lattice, //书柜格子编号
  };
  init.stopInventory(); //停止盘点
  otherInterface
    .getLackBookInfo(params)
    .then((res) => {
      if (res.code == 0) {
        if (res.data.LOAN.length > 0 && res.data.RESTITUTION.length === 0) {
          operateBook(res.data.LOAN, lattice, "LOAN");
        } else if (
          res.data.RESTITUTION.length > 0 &&
          res.data.LOAN.length === 0
        ) {
          operateBook(res.data.RESTITUTION, lattice, "RESTITUTION");
        } else if (
          res.data.LOAN.length > 0 &&
          res.data.RESTITUTION.length > 0
        ) {
          operateBookAll(res.data, lattice, "LOAN", "RESTITUTION");
        } else if (
          res.data.LOAN.length === 0 &&
          res.data.RESTITUTION.length === 0
        ) {
          returnShow.value = true;
          status.value = "start";
          dialogStatus.value = false;
        }
      } else {
        status.value = "start";
        dialogStatus.value = false;
        ElMessage.error(res.message);
      }
    })
    .catch((err) => {
      status.value = "start";
      ElMessage.error(err);
    });
};

//还书预检查
const checkOperatingBook = async (barCode) => {
  let params = {
    barCodes: barCode ? [barCode] : bookList.value.map((it) => it.barCode),
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: "RESTITUTION",
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.checkOperatingBook(params);
};

const getBorrow = () => {
  let params = {
    borrowType: "1",
    platformId: store.getters.platform.platformId,
    readerNumber: store.getters.getUserInfo.number,
  };
  otherInterface
    .getMyBorrow(params)
    .then(async (res) => {
      if (res.code == 0) {
        res.data.map((it) => {
          if (it.coverUrl) {
            it.coverUrl = store.getters.platform.info.http + "/" + it.coverUrl;
          }
        });
        bookList.value = res.data;
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const playAudio = (label) => {
  let audio
  try {
    audio = document.getElementById("audioReturn");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioReturnDOM---try catch提前返回!!!"
    );
    return;
  }
  audio.addEventListener("canplay", () => {
    console.log("加载成功");
    audio.play();
  });
  audio.addEventListener("play", () => {
    console.log("播放成功");
  });
  if (!label) {
    audio.pause();
    audioSrc.value = "";
  } else {
    audioSrc.value = pic[label];
  }
};

const removeListener = () => {
  // let audio = document.getElementById("audioReturn");
  let audio
  try {
    audio = document.getElementById("audioReturn");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioReturnDOM---try catch提前返回!!!"
    );
    return;
  }

  audio.removeEventListener("canplay", playAudio());
};

const getFocus = () => {
  document.getElementById("code-book").focus();
  document.getElementById("code-book").select();
};

const start = () => {
  getBorrow();
  init.connectLock();
};

const backClick = () => {
  returnShow.value = !returnShow.value;
  if (!returnShow.value) {
    nextTick(() => {
      getFocus();
    });
  }
};

onMounted(() => {
  start();
});
onUnmounted(() => {
  if (time.value) {
    clearInterval(time.value); //清空定时器
  }
  clearTimeout();
  init.closeLock();
});
</script>
<style lang="less" scoped>
.search_btn {
  margin-top: 15px;
  padding: 15px;
  display: flex;
  justify-content: center;

  /deep/ .el-button--primary {
    width: 80%;
    height: 80px;
    background: rgba(255, 145, 89, 1);
    border: none;
    border-radius: 15px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 2px;
    font-size: 40px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

.search_book_sort_btn {
  padding-left: 100px;

  /deep/ .el-button--primary {
    height: 60px;
    background: rgba(255, 145, 89, 1);
    border: none;
    border-radius: 30px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 1.5px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

/deep/ .el-button--primary {
  background: rgba(255, 145, 89, 1) !important;
  border: none;
  border-radius: 10px;
}

.qr-code-icon-default {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  font-size: 28px;

  /deep/ .el-icon-my-qr-code {
    background: url("../../../assets/image/richScan.png") no-repeat;
    background-size: 100% 100%;
  }

  /deep/ .el-icon-my-qr-hand {
    background: url("../../../assets/image/hand.png") no-repeat;
    background-size: 100% 100%;
  }
}

/deep/ .el-icon-my-qr-hand {
  font-size: 50px;
  background-size: cover;
}

/deep/ .el-icon-my-qr-hand:before {
  content: "替";
  font-size: 50px;
  visibility: hidden;
}

/deep/ .el-icon-my-qr-code {
  font-size: 50px;
  background-size: cover;
}

/deep/ .el-icon-my-qr-code:before {
  content: "替";
  font-size: 50px;
  visibility: hidden;
}

.noSize {
  color: #969696;
  font-size: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 560px;
    height: 370px;
    margin-bottom: 15px;
  }
}
</style>