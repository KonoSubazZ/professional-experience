<template>
  <div class="Index">
    <div id="handleClickOne"></div>
    <div class="list">
      <div class="list_box" v-for="(item, index) in List" :key="index" @click="go(item.path)">
        <img :src="item.img" alt="" />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="bottom">
      <audio id="audioBorrow" :src="audioSrc"></audio>
      <!-- 出异常展示 -->
      <div class="dialog" v-if="dialogStatus || lockException"></div>

      <div v-if="status == 'start' && !lockException" class="fx between" style="width: 100%">
        <div class="bottom_left">
          <p class="left_title">
            <img src="../../../assets/image/sort_book.png" alt="" />
            <span>{{ `在柜图书(${bookTotal})` }}</span>
          </p>
          <div class="left_center" v-infinite-scroll="Load" infinite-scroll-immediate="false"
            v-if="bookList.length > 0">
            <el-backtop target=".left_center" :visibility-height="300 * totalPages"></el-backtop>
            <div class="left_book" v-for="(item, index) in bookList" :key="index" v-show="item.latticeNo">
              <div class="left_book_left" style="align-items: center">
                <!-- <div class="sortImg">{{ index + 1 + '.' }}</div> -->
                <img class="bookImg" v-if="item.coverUrl" :src="item.coverUrl" alt="" />
                <img class="bookImg" v-else src="../../../assets/image/Index/index_borrow.png" />
                <div class="left_text">
                  <div class="left_text_top">
                    <p class="less" style="width: 180px">
                      {{ item.positiveTitle }}
                    </p>
                    <p class="less" style="width: 180px">
                      作者：{{ item.firstResponsible }}
                    </p>
                    <p class="less" style="width: 180px; color: #333">
                      所在格子：{{ item.latticeNo }}
                    </p>
                    <p class="less" style="width: 180px">
                      条码号：{{ item.barCode }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="btn">
                <el-button type="primary" round size="small" @click="borrowBook(item)">借阅本书</el-button>
              </div>
            </div>
            <p v-if="loading" class="noMore">加载中...</p>
            <p v-if="noMore" class="noMore">-没有更多了-</p>
          </div>
          <div class="left_center" style="position: relative" v-else>
            <span class="noSize">
              <img src="../../../assets/image/null.png" />
              暂无图书</span>
          </div>
        </div>
        <div class="bottom_right">
          <p class="right_top">
            <el-input disabled maxlength="10" placeholder="请输入格子编号" v-model="number">
            </el-input>
          </p>
          <div class="right_bottom">
            <keyboard ref="refKeyBoard" @ongetnum_="getNums" @goBorrow="getBorrow"></keyboard>
          </div>
        </div>
      </div>

      <div class="success fx-center column" v-if="status == 'openDoorSuccess'">
        <img src="../../../assets/image/success.png" />
        <p>柜门已打开</p>
        <p>取出图书后请您及时关闭柜门</p>
      </div>


      <div class="success fx-center column" v-if="lockException">
        <img src="../../../assets/image/success.png" />
        <p>柜门开启异常</p>
        <p>即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门</p>
      </div>
      <div class="success fx-center column w-100" v-if="status == 'success'">
        <img src="../../../assets/image/success.png" />
        <p v-html="successMsg" style="text-align: center"></p>
        <div class="successBookBox">
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

    <div class="backgrounds" style="background-color: transparent"
      v-if="['borrowLoading', 'doorLoading'].includes(status)">
      <img src="../../../assets/image/gif/book.gif" />
      <span>正在处理中，请稍后...</span>
    </div>
  </div>
</template>

<script setup>
import keyboard from "../../common/9_keyboard.vue";
import pic from "@utils/image";
import { useStore } from "vuex";
import {
  onMounted,
  reactive,
  ref,
  nextTick,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { otherInterface } from "@api/request";
import { ElMessage } from "element-plus";
import hardware from "@api/hardwareDeviceApi";
// import videoPlay from "vue3-video-play";
import "vue3-video-play/dist/style.css";
import resetSetItem from "@utils/session";
import date from "@utils/dateTime";
import { openLock, inventory, setLatticeItemLocked, checklatticeNoLocked, sendExceptionSMSMAIL } from "@utils/read.js"
const init = hardware.init();
const store = useStore();
const router = useRouter();
const number = ref("");
const List = reactive([
  { name: "我要借书", img: pic.borrowImg, path: "/borrow" },
  { name: "我要还书", img: pic.returnImg, path: "/return" },
  { name: "我的借阅", img: pic.myImg, path: "/myBorrow" },
]);
const refKeyBoard = ref();
const successBookList = ref([]);
const successReturnList = ref([]);
const successData = ref([]);
const loading = ref(false);
const noMore = ref(false);
const bookTotal = ref(0);
const totalPages = ref(0);
const page = ref(1);
const size = ref(5);
const audioSrc = ref("");
const bookList = ref([]);
const status = ref("start");
const successMsg = ref("");
const dialogStatus = ref(false);
const doorTime = ref(null);
const time = ref(null);
const sendEmilTime = ref(0);
const lockException = ref(false);
const start = () => {
  init.connectLock();
};
// 获取配置信息
const infoData = computed(() => {
  return store.getters.platform.info;
});
window.resetSetItem = resetSetItem;
// 共享盘点状态
watch(
  status,
  (value, oldValue) => {
    console.log(value, '----watch home---');
    store.dispatch("setStatus", value);

  },
  { immediate: true }
);

store.dispatch("updateHead_text", "首页");
/**
 * status : 状态
 * start - 初始状态 无动画
 * doorLoading - 开门等待中,有动画
 * openDoorSuccess - 开门成功,无动画
 * borrowLoading - 盘点等待 有动画
 * 
 * 
 */
//借书预检查
const checkOperatingBook = async (barCode) => {
  let params = {
    barCodes: [barCode],
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: "LOAN",
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.checkOperatingBook(params);
};
const borrowBook = (item) => {
  if (
    !sessionStorage.getItem("user") ||
    sessionStorage.getItem("user") === "{}"
  ) {
    if (
      !store.getters.getCabinetInfo.openAdminLogin &&
      !store.getters.getCabinetInfo.openCardLogin &&
      !store.getters.getCabinetInfo.openCodeLogin &&
      !store.getters.getCabinetInfo.openFaceLogin
    ) {
      return ElMessage.error("暂未开放登录功能");
    }
    ElMessage.error("请先登录");
    sessionStorage.setItem("openDoorNumber", JSON.stringify(item));
    router.push("/login");
    return;
  }
  openDoorLoading(item);
};
const openDoorLoading = async (item) => {
  if (!store.getters.getCabinetInfo.openCase) {
    return ElMessage.error("暂未开放打开柜门功能");
  }
  if (!store.getters.getCabinetInfo.openBorrow) {
    return ElMessage.error("暂未开放借书功能");
  }

  //如果预检查成功，根据格子编号打开柜门
  if (item.positiveTitle) {
    const check = await checkOperatingBook(item.barCode);
    if (!check.data) {
      return ElMessage.error(check.message);
    }
  } else {
    const res = await checkReaderAndCase();
    if (!res.data) {
      return ElMessage.error(res.message);
    }
  }

  dialogStatus.value = true;
  status.value = "doorLoading";
  setTimeout(() => {
    /*
     init.openLock(item.latticeNo);
     let getLockState = init.getLockState(item.latticeNo);
    */
    // 检验格子是否被锁定
    if (checklatticeNoLocked(item.latticeNo)) {
      ElMessage.warning("当前格子已经被管理员锁定,暂时无法进行借还书操作")
      dialogStatus.value = false;
      status.value = "start";
      return
    }
    // 开锁最大尝试次数
    const maxAttempts = 3
    const isOpened = openLock(() => init.openLock(item.latticeNo), () => init.getLockState(item.latticeNo), maxAttempts)


    //开锁成功
    if (isOpened) {
      nextTick(() => {
        playAudio("borrowBookAudio");
      });
      openDoorSuccess(item);
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
                latticeNo: item.latticeNo,
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
      setLatticeItemLocked(item.latticeNo);
      // 开锁成功 但是获取不到锁状态值0 进行异常 盘点
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
};

const inventoryOneTime = ref(null); //延时盘点
const openDoorSuccess = (item) => {
  clearTimeout(inventoryOneTime.value);
  status.value = "openDoorSuccess";
  let openStatus = false;
  if (!openStatus) {
    //开启定时循环查询锁状态
    // let maxAttempts = 1
    time.value = setInterval(() => {
      let lockStatus = init.getLockState(item.latticeNo);
      console.log(lockStatus, '===lockStatus===', new Date());
      // 这段我暂时理解更新 store 和 sessionStroage
      store.dispatch("setDoorStatus", lockStatus);
      resetSetItem("lockStatus", lockStatus);

      // 关门 准备盘点
      if (lockStatus?.indexOf("关") !== -1) {
        removeListener(); // 停止播放关门提示
        clearInterval(doorTime.value); // 清除一分钟不关门的业务计时器
        clearInterval(time.value); // 清除循环检测门状态 - 已经关门
        openStatus = true;
        store.dispatch("setDoorStatus", lockStatus);
        resetSetItem("lockStatus", lockStatus);
        if (openStatus) {
          status.value = "borrowLoading";
          inventoryOneTime.value = setTimeout(() => {
            const maxAttempts = 3 // 盘点三次
            const inventoryBookList = inventory(() => init.inventoryOne(item.latticeNo ? item.latticeNo : inputInfo.number), maxAttempts)

            // 盘点器连接正常并返回盘点结果
            if (Array.isArray(inventoryBookList)) {

              getLackBookInfo(unique(inventoryBookList), item)
              console.log(unique(inventoryBookList), "===盘点图书结果===", new Date());
            } else {
              // 结束动画 --盘点异常
              status.value = "start";
              ElMessage.error('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');
            }
          }, 200)

        }
      }
    }, 1500);
  }
};
//去重
const unique = (arr) => {
  const res = new Map();
  return arr.filter((item) => !res.has(item.PII) && res.set(item.PII, 1));
};

//根据当前盘点的图书对比获取格子里少的或多的图书条码号
const getLackBookInfo = async (data, item) => {
  let params = {
    bookBarCodes: data.length > 0 ? data.map((it) => it.PII) : data,
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    latticeNo: item.latticeNo, //书柜格子编号
  };
  init.stopInventory(); //停止盘点
  try {
    const res = await otherInterface.getLackBookInfo(params)
    if (res.code == 0) {
      if (res.data.LOAN.length > 0 && res.data.RESTITUTION.length === 0) {
        operateBook(res.data.LOAN, item, "LOAN");
      } else if (
        res.data.RESTITUTION.length > 0 &&
        res.data.LOAN.length === 0
      ) {
        operateBook(res.data.RESTITUTION, item, "RESTITUTION");
      } else if (
        res.data.LOAN.length > 0 &&
        res.data.RESTITUTION.length > 0
      ) {
        operateBookAll(res.data, item, "LOAN", "RESTITUTION");
      } else if (
        res.data.LOAN.length === 0 &&
        res.data.RESTITUTION.length === 0
      ) {
        status.value = "start";
        dialogStatus.value = false;
      }
    } else {
      status.value = "start";
      dialogStatus.value = false;
      ElMessage.error(res.message);
      ElMessage.warning('设备服务器异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');

    }

  } catch (error) {
    // 接口异常
    status.value = "start";
    dialogStatus.value = false;
    ElMessage.error(err);
    ElMessage.warning('设备服务器异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');

  }
  /*
  otherInterface
    .getLackBookInfo(params)
    .then((res) => {
      if (res.code == 0) {
        if (res.data.LOAN.length > 0 && res.data.RESTITUTION.length === 0) {
          operateBook(res.data.LOAN, item, "LOAN");
        } else if (
          res.data.RESTITUTION.length > 0 &&
          res.data.LOAN.length === 0
        ) {
          operateBook(res.data.RESTITUTION, item, "RESTITUTION");
        } else if (
          res.data.LOAN.length > 0 &&
          res.data.RESTITUTION.length > 0
        ) {
          operateBookAll(res.data, item, "LOAN", "RESTITUTION");
        } else if (
          res.data.LOAN.length === 0 &&
          res.data.RESTITUTION.length === 0
        ) {
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
      ElMessage.warning('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');

    });
    */
};
// 新加的去重操作
const uniqueArr = (list) => {
  return [...new Set(list)];
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

const operateBookAll = (list, item, LOAN, RESTITUTION) => {
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
      latticeNo: item.latticeNo,
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
      latticeNo: item.latticeNo,
    };
    otherInterface.operatingBook(params).then((res) => {
      resolve({ code: res.code, res });
    });
  });

  Promise.all([LOANS, RESTITUTIONS]).then(async (res) => {
    if (refKeyBoard.value !== null) {
      refKeyBoard.value.clear();
    }
    const [data, data1] = res;
    let LoanAll = data.res.data;
    let ReturnAll = data1.res.data;
    let LoanTrueNumber = 0; //借书成功的
    let ReturnTrueNumber = 0; //还书成功的
    if (data.code == 0 && data1.code == 0) {
      const myBorrow = await getMyBorrow();

      nextTick(() => {
        playAudio("borrowSuccess");
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
            if (ReturnList[i] === ik.barCode) {
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
      status.value = "success";
      setTimeout(() => {
        nextTick(() => {
          number.value = "";
          bookList.value = [];
          page.value = 1;
          getBookList();
          status.value = "start";
          dialogStatus.value = false;
        });
      }, 5000);
    } else {
      dialogStatus.value = false;
      ElMessage.error("操作失败，请重新尝试");
      status.value = "start";
    }
  });
};

//进行借书操作
const operateBook = (list, item, type) => {
  successBookList.value = [];
  successData.value = [];
  let params = {
    barCodes: uniqueArr(list),
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: type,
    readerNumber: store.getters.getUserInfo.number,
    latticeNo: item.latticeNo,
  };
  otherInterface.operatingBook(params).then(async (res) => {
    if (refKeyBoard.value !== null) {
      refKeyBoard.value.clear();
    }
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
      console.log("到这里了吗???");
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
      status.value = "success";
      setTimeout(() => {
        nextTick(() => {
          number.value = "";
          bookList.value = [];
          page.value = 1;
          getBookList();
          status.value = "start";
          dialogStatus.value = false;
        });
      }, 5000);
    } else {
      status.value = "start";
      dialogStatus.value = false;
      ElMessage.error(res.message);
    }
  });
};

const playAudio = (label) => {
  let audio;
  try {
    audio = document.getElementById("audioBorrow");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioBorrowDOM---try catch提前返回!!!"
    );
    return;
  }
  // let audio = document.getElementById("audioBorrow");
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
  // let audio = document.getElementById("audioBorrow");
  let audio;
  try {
    audio = document.getElementById("audioBorrow");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioBorrowDOM---try catch提前返回!!!"
    );
    return;
  }
  audio.removeEventListener("canplay", playAudio());
};
//无限加载
const Load = () => {
  if (page.value >= totalPages.value) return;
  page.value++;
  loading.value = true;
  getBookList();
};
//获取图书列表
const getBookList = () => {
  let params = {
    caseId: store.getters.platform.id,
    platformId: store.getters.platform.platformId,
    pageNumber: page.value,
    limit: size.value,
  };
  otherInterface
    .getBookList(params)
    .then((res) => {
      if (res.code == 0) {
        res.data.content.map((it) => {
          if (it.coverUrl) {
            it.coverUrl = store.getters.platform.info.http + "/" + it.coverUrl;
          }
        });
        bookList.value = bookList.value.concat(res.data.content);
        bookTotal.value = res.data.totalElements;
        totalPages.value = res.data.totalPages;
        loading.value = false;

        if (page.value >= res.data.totalPages) {
          noMore.value = true;
        } else {
          noMore.value = false;
        }
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};
//获取书柜信息
const getBookCaseInfo = () => {
  let params = {
    uuid: store.getters.getUUID,
    platformId: store.getters.platform.platformId,
  };
  otherInterface.getBookCaseInfo(params).then((res) => {
    if (res.code == 0) {
      store.dispatch("setCabinetInfo", res.data);
    }
  });
};

onUnmounted(() => {
  if (time.value) {
    clearInterval(time.value); //清空定时器
  }
  clearTimeout();
  init.closeLock();
});

onMounted(() => {
  document.getElementById("handleClickOne").click(); //主要是为了人脸识别返回来之后没有出发这个Container组件中对应的click事件去打开退出登录的定时器
  start();
  getBookCaseInfo();
  getBookList();

  if (
    sessionStorage.getItem("user") &&
    sessionStorage.getItem("user") !== "{}" &&
    sessionStorage.getItem("openDoorNumber")
  ) {
    openDoorLoading(JSON.parse(sessionStorage.getItem("openDoorNumber")));
    sessionStorage.removeItem("openDoorNumber");
  }
});
const go = (path) => {
  if (path === "/borrow" && !store.getters.getCabinetInfo.openBorrow) {
    return ElMessage.error("暂未开放借书功能");
  }
  if (path === "/return" && !store.getters.getCabinetInfo.openReturn) {
    return ElMessage.error("暂未开放还书功能");
  }
  if (path === "/myBorrow" && !store.getters.getCabinetInfo.openBorrowing) {
    return ElMessage.error("暂未开放借阅查询功能");
  }

  if (
    !sessionStorage.getItem("user") ||
    sessionStorage.getItem("user") === "{}"
  ) {
    ElMessage.error("请先登录");
    if (
      !store.getters.getCabinetInfo.openAdminLogin &&
      !store.getters.getCabinetInfo.openCardLogin &&
      !store.getters.getCabinetInfo.openCodeLogin &&
      !store.getters.getCabinetInfo.openFaceLogin
    ) {
      return ElMessage.error("暂未开放登录功能");
    }
    sessionStorage.setItem("path", path);
    sessionStorage.setItem("isLogin", JSON.stringify(1));

    router.push("/login");
    return;
  }
  router.push(path);
};
// 打开格子预检查
const checkReaderAndCase = async () => {
  let params = {
    caseId: store.getters.platform.id,
    platformId: store.getters.platform.platformId,
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.checkReaderAndCase(params);
};
const goBorrow = () => {
  console.log(bookList.value, "bookList.value");
  if (!bookList.value.length) {
    return ElMessage.error("请先上架图书");
  }
  if (!number.value) {
    return ElMessage.error("请输入格子编号");
  }
  if (
    number.value > Number(localStorage.getItem("latticeNumber")) ||
    number.value == 0
  ) {
    refKeyBoard.value.clear();
    return ElMessage.error("格子输入错误，非本书柜格子");
  }
  // if(bookList.value)
  if (
    !sessionStorage.getItem("user") ||
    sessionStorage.getItem("user") === "{}"
  ) {
    if (
      !store.getters.getCabinetInfo.openAdminLogin &&
      !store.getters.getCabinetInfo.openCardLogin &&
      !store.getters.getCabinetInfo.openCodeLogin &&
      !store.getters.getCabinetInfo.openFaceLogin
    ) {
      return ElMessage.error("暂未开放登录功能");
    }
    ElMessage.error("请先登录");
    sessionStorage.setItem(
      "openDoorNumber",
      JSON.stringify({ latticeNo: number.value })
    );
    router.push("/login");
    return;
  }

  let item = {
    latticeNo: number.value,
  };
  openDoorLoading(item);
};
const getNums = (e) => {
  number.value = e;
};
const getBorrow = (e) => {
  goBorrow();
};
</script>
<style lang="less" scoped>
.Index {
  height: 1130px;
  padding: 0 15px 20px;

  .list {
    padding: 15px 50px 15px 50px;
    height: 245px;
    background: rgba(255, 236, 224, 1);
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .list_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 250px;
      height: 250px;
      border-radius: 55px;
    }

    .list_box img {
      width: 145px;
      height: 150px;
    }

    .list_box span {
      letter-spacing: 3px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
    }

    .list_box:nth-child(1) {
      background: linear-gradient(139deg,
          rgba(247, 170, 38, 1) 0%,
          rgba(249, 150, 64, 1) 100%);
    }

    .list_box:nth-child(2) {
      background: linear-gradient(139deg,
          rgba(251, 144, 103, 1) 0%,
          rgba(251, 103, 102, 1) 100%);
    }

    .list_box:nth-child(3) {
      background: linear-gradient(139deg,
          rgba(249, 146, 131, 1) 0%,
          rgba(243, 124, 156, 1) 100%);
    }
  }

  .bottom {
    margin-top: 15px;
    width: 100%;
    height: 850px;
    display: flex;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;

    .bottom_left {
      border-radius: 15px;
      background: rgba(255, 236, 224, 1);
      width: 550px;
      padding: 15px;

      .left_center {
        height: 771px;
        overflow-y: scroll;

        .left_book {
          margin-top: 15px;
          height: 180px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid rgba(255, 145, 89, 1);

          img {
            width: 112px;
            height: 142px;
          }

          .left_book_left {
            display: flex;

            .left_text {
              margin-left: 7px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;

              p {
                font-size: 17px;
                font-family: PingFang SC;
                font-weight: bold;
                color: #333;
              }

              .left_text_top {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 143px;

                p:nth-child(1) {
                  padding: 0;
                  font-size: 25px;
                  font-family: PingFang SC;
                  font-weight: bold;
                  color: #333333;
                }

                p:nth-child(2) {
                  font-size: 17px;
                  font-family: PingFang SC;
                  font-weight: bold;
                  color: #333333;
                }
              }
            }
          }
        }
      }

      .left_title {
        display: flex;
        align-items: center;

        img {
          width: 50px;
          height: 50px;
        }

        span {
          letter-spacing: 2px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(255, 145, 89, 1);
          font-size: 28px;
          margin-left: 15px;
        }
      }
    }

    .bottom_right {
      border-radius: 15px;
      background: rgba(255, 236, 224, 1);
      width: 450px;

      .right_bottom {
        border: 1px solid #f5f5f5;
        border-radius: 15px;
        margin-top: 45px;
        height: 674px;
        box-shadow: 0px -6px 18px rgba(255, 145, 89, 1);
      }
    }
  }

  /deep/.el-input__wrapper {
    border-radius: 20px !important;
  }

  /deep/ .el-button--primary {
    font-family: PingFang SC;
    font-weight: bold;
    font-size: 25px;
    border-radius: 30px;
    width: 150px;
    height: 55px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
  }

  /deep/ .el-button--primary span {
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

:deep(.el-input__inner) {
  text-align: center !important;
}

.noSize {
  color: #969696;
  font-size: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  img {
    width: 400px;
    height: 266px;
  }
}

.dialog {
  width: 100% !important;
  height: 150vh !important;
  top: -450px !important;
  left: 0 !important;
  // background: #FF9159;
}

.backgrounds {
  height: 849px !important;
}

.noMore {
  text-align: center;
  font-size: 22px;
  color: #a4b0be;
}

.right_top {
  padding: 15px 15px 0 15px;
  margin-top: 30px;
}
</style>
