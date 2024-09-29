<template>
  <div class="borrow">
    <user ref="userRef"></user>
    <audio id="audioBorrow" :src="audioSrc"></audio>
    <div class="dialog" v-if="dialogStatus || lockException"></div>
    <div v-show="status == 'start' && !lockException">
      <div class="input">
        <div class="form-input">
          <input id="number" class="inputs" v-model="inputInfo.number" data-mode type="text" placeholder="请输入题名" />
          <img @click="searchBook" class="search-icon" src="../../../assets/image/search.png" alt="" />
        </div>
        <div class="fx center_y hot" v-if="hotList.length > 0">
          <img src="../../../assets/image/hot.png" />
          <div class="fx less" style="margin-left: 10px; width: 900px">
            热门书籍：
            <div v-for="(item, index) in hotList.slice(0, 3)" :key="index" @click="searchBook(item)">
              <span style="color: #333"> {{ index != 0 ? "|" : "" }}</span>
              {{ "《" + item.bookName + "》" }}
            </div>
          </div>
        </div>
      </div>
      <div class="search_book" style="position: relative; height: 800px; margin-top: 20px">
        <p class="left_title" v-if="showList">
          <img src="../../../assets/image/sort_book.png" alt="" />
          <span>{{ `在柜图书(${bookTotal})` }}</span>
        </p>
        <div class="search_btn" v-if="!showList && bookList.length !== 0 && showNumber">
          <el-button type="primary" round @click="borrow">打开此书柜</el-button>
        </div>
        <!--      当点击进来多本图书时-->
        <div v-if="!showList" class="search_book_sort" style="padding: 0"
          :style="{ height: showNumber ? '768px' : '850px' }">
          <div v-for="(item, index) in bookList" :key="index" class="search_book_sort_box" style="
              padding: 10px;
              justify-content: center;
              flex-direction: column;
              height: 269px;
              float: left;
            " :style="{ width: bookList.length === 1 ? '100%' : '48%' }">
            <div class="fx">
              <img class="book_img" v-if="item.coverUrl" :src="item.coverUrl" alt="" />
              <img class="book_img" v-else src="../../../assets/image/Index/index_borrow.png" />
              <div class="search_book_someBook_right" style="width: auto">
                <div class="less">{{ item.positiveTitle }}</div>
                <div class="less">作者：{{ item.firstResponsible }}</div>
                <div class="less">所在格子：{{ item.latticeNo }}</div>
                <div>条码号: {{ item.barCode }}</div>
              </div>
            </div>
            <el-button type="primary" round @click="borrow(item)">借阅本书</el-button>
          </div>
        </div>

        <!--      默认所有图书-->
        <div class="search_book_sort" v-infinite-scroll="Load" infinite-scroll-immediate="false" v-if="showList"
          style="height: 765px">
          <el-backtop target=".search_book_sort" :visibility-height="300 * totalPages"></el-backtop>
          <div class="search_book_sort_box" v-for="(item, index) in bookList" :key="index">
            <div class="sortImg" style="font-size: 35px">
              {{ index + 1 + "." }}
            </div>
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
                所在格子：{{ item.latticeNo }}
              </div>
              <div>条码号: {{ item.barCode }}</div>
            </div>
            <div class="search_book_sort_btn">
              <el-button type="primary" round size="small" @click="borrow(item)">借阅本书</el-button>
            </div>
          </div>
          <p v-if="loading" class="noMore">加载中...</p>
          <p v-if="noMore" class="noMore">-没有更多了-</p>
        </div>
        <div class="noSize" v-if="bookList.length == 0">
          <img src="../../../assets/image/null.png" />
          暂无图书
        </div>
      </div>
    </div>
    <div class="success fx-center column" v-show="status == 'openDoorSuccess'">
      <img src="../../../assets/image/success.png" />
      <p>柜门已打开</p>
      <p>取出图书后请您及时关闭柜门</p>
    </div>
    <div class="success fx-center column" v-if="lockException">
      <img src="../../../assets/image/success.png" />
      <p>柜门开启异常</p>
      <p>即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门</p>
    </div>
    <div class="success fx-center column w-100" v-show="status == 'success'">
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

  <div class="backgrounds" v-show="status == 'borrowLoading'">
    <img src="../../../assets/image/gif/book.gif" />
    <span>正在处理中，请稍后...</span>
  </div>
  <div class="backgrounds" v-show="status == 'doorLoading'">
    <img src="../../../assets/image/gif/book.gif" />
    <span>正在处理中，请稍后...</span>
  </div>

  <Key-Board ref="keyBoardRef" @change="keyChange" :color="'#06f'" />
</template>
<script setup>
import pic from "@utils/image";
import user from "../../common/user.vue";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  nextTick,
  computed,
  watch,
} from "vue";
import filter from "@utils/filter";
import resetSetItem from "@utils/session";
import { otherInterface } from "@api/request";
import date from "@utils/dateTime";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import hardware from "@api/hardwareDeviceApi";
import { openLock, inventory, setLatticeItemLocked, checklatticeNoLocked, sendExceptionSMSMAIL } from "@utils/read.js"
const init = hardware.init();
const userRef = ref(null);
const keyBoardRef = ref(null);
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const audioSrc = ref("");
const page = ref(1);
const size = ref(5);
const bookTotal = ref(0);
const totalPages = ref(0);
const successBookList = ref([]);
const successReturnList = ref([]);
const successData = ref([]);
const bookList = ref([]);
const hotList = ref([]);
const showNumber = ref(false);
const loading = ref(false);
const noMore = ref(false);
const dialogStatus = ref(false);
const time = ref("");
const showList = ref(true);
const successMsg = ref("");
const status = ref("start");
const doorTime = ref(null);
const sendEmilTime = ref(0);
const lockException = ref(false);
store.dispatch("updateHead_text", "我要借书");
window.resetSetItem = resetSetItem;
const inputInfo = reactive({
  number: "",
});
const keyChange = () => {
  inputInfo.number = document.getElementById("number").value;
};

watch(
  () => status,
  (newValue, oldValue) => {
    store.dispatch("setStatus", newValue);
  },
  { immediate: true }
);
//当开始调用
const start = () => {
  getBookList(); //查询格子当前的图书
  getHotBook();
  init.connectLock();
};
// 新加的去重操作
const uniqueArr = (list) => {
  return [...new Set(list)];
};
const searchBook = (item) => {
  if (!store.getters.getCabinetInfo.openBook) {
    return ElMessage.error("暂未开放图书查询功能");
  }
  if (item.bookName) {
    inputInfo.number = item.bookName;
  }
  if (!inputInfo.number) {
    page.value = 1;
    showList.value = true;
    bookList.value = [];
    return getBookList();
  }
  //如果搜索框是数字的话展示打开书柜按钮
  if (Number(inputInfo.number)) {
    showNumber.value = true;
  } else {
    showNumber.value = false;
  }
  getSearchBook();
};

const getSearchBook = () => {
  let params = {
    caseId: store.getters.platform.id,
    platformId: store.getters.platform.platformId,
    content: inputInfo.number,
  };
  otherInterface.searchBook(params).then((res) => {
    // if(res.data.bookList.length === 0){
    //   return ElMessage.error('没有检索到书籍');
    // }
    res.data.bookList.map((it) => {
      if (it.coverUrl) {
        it.coverUrl = store.getters.platform.info.http + "/" + it.coverUrl;
      }
    });
    bookList.value = res.data.bookList;
    showList.value = false;
  });
};
//无限加载
const Load = () => {
  if (page.value >= totalPages.value) return;
  if (showList.value) {
    page.value++;
    loading.value = true;
    getBookList();
  }
};
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
//借书预检查
const checkOperatingBook = async (barCode) => {
  let params = {
    barCodes: barCode ? [barCode] : bookList.value.map((it) => it.barCode),
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: "LOAN",
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.checkOperatingBook(params);
};

// 借书业务逻辑
const borrow = async (item) => {
  if (!store.getters.getCabinetInfo.openCase) {
    return ElMessage.error("暂未开放打开柜门功能");
  }
  const check = await checkOperatingBook(item.barCode);
  if (!check.data) {
    return ElMessage.error(check.message);
  }
  //如果预检查成功，根据格子编号打开柜门
  dialogStatus.value = true; // 之前的遮罩层
  status.value = "doorLoading";
  setTimeout(() => {

    //校验格子是否被锁定
    if (checklatticeNoLocked(item.latticeNo)) {
      ElMessage.warning("当前格子已经被管理员锁定,暂时无法进行借还书操作")
      dialogStatus.value = true;
      status.value = "start";
      return
    }

    const maxAttempts = 3 // 开锁最大尝试次数
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
                latticeNo: item.latticeNo
                  ? item.latticeNo
                  : Number(inputInfo.number),
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
      keyBoardRef.value.reSignUp();
      dialogStatus.value = false;
      ElMessage.error('获取设备异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门');
      status.value = "start";
      // 发送短信邮件
      sendExceptionSMSMAIL(store.getters.platform.id, item.latticeNo ? item.latticeNo : inputInfo.number, 1)

      //异常锁定柜子
      setLatticeItemLocked(item.latticeNo);
      // 开锁成功 但是获取不到锁状态值openLock 0 15秒后进行盘点
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
  /*
  setTimeout(() => {
    let getLockState;
    for (let i = 0; i < 3; i++) {
      init.openLock(item.latticeNo ? item.latticeNo : inputInfo.number);
      getLockState = init.getLockState(
        item.latticeNo ? item.latticeNo : inputInfo.number
      );
      if (getLockState.includes('开')) {
        break;
      }
    }
    //先查询一遍当前的柜门开启状态

    // 柜门打开成功
    if (getLockState.includes('开')) {
      nextTick(() => {
        playAudio("borrowBookAudio");
      });
      openDoorSuccess(item);
      let sendEmil = false;

      // 发送邮件功能 通知门没有关
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
                latticeNo: item.latticeNo
                  ? item.latticeNo
                  : Number(inputInfo.number),
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
      keyBoardRef.value.reSignUp();
      dialogStatus.value = false;
      status.value = "start";
      ElMessage.error("获取锁状态异常即将返回首页，请勿在此格口进行借还书操作，并关闭柜子的全部柜门!");

      // 两秒后盘点
      setTimeout(() => {
        let inv1 = init.inventoryOne(item.latticeNo ? item.latticeNo : inputInfo.number);
        console.log(inv1, "----高频盘点结果第一次----");
        if (infoData.value.typeL == "hf") {
              let invTime = null;
              invTime = setTimeout(() => {
                //再进行一次盘点
                let inv2 = init.inventoryOne(item.latticeNo ? item.latticeNo : inputInfo.number);
                console.log(inv2, "----高频盘点结果第二次----");
                let PIIList = unique(inv1.concat(inv2));
                clearTimeout(invTime);
                getLackBookInfo(PIIList, item);
              }, 3000);
            } else {
              if (inv1 && inv1.length) {
                let PIIList = unique(inv1);
                getLackBookInfo(PIIList, item);
              } else {
                getLackBookInfo(inv1, item);
              }
            }

      }, 2 * 1000)

      // sendMail
    }
  }, 2000);
  */
};
// 获取配置信息
const infoData = computed(() => {
  return store.getters.platform.info;
});
const inventoryOneTime = ref(null); //延时盘点

/*
const openDoorSuccess = (item) => {
  clearTimeout(inventoryOneTime.value);
  status.value = "openDoorSuccess";
  let openStatus = false;
  if (!openStatus) {
    //开启定时循环查询锁状态
    time.value = setInterval(() => {
      let lockStatus = init.getLockState(
        item.latticeNo ? item.latticeNo : inputInfo.number
      );
      resetSetItem("lockStatus", lockStatus);
      store.dispatch("setDoorStatus", lockStatus);
      if (lockStatus.indexOf("关") !== -1) {
        clearInterval(doorTime.value);
        clearInterval(time.value);
        openStatus = true;
        resetSetItem("lockStatus", lockStatus);
        store.dispatch("setDoorStatus", lockStatus);
        if (openStatus) {
          status.value = "borrowLoading";
          console.log("开始盘点");
          inventoryOneTime.value = setTimeout(() => {
            let inv1 = init.inventoryOne(
              item.latticeNo ? item.latticeNo : inputInfo.number
            );
            console.log(inv1, "----高频盘点结果----");
            if (infoData.value.typeL == "hf") {
              let invTime = null;
              invTime = setTimeout(() => {
                //再进行一次盘点
                let inv2 = init.inventoryOne(
                  item.latticeNo ? item.latticeNo : inputInfo.number
                );
                console.log(inv2, "----超高频盘点结果----");
                let PIIList = unique(inv1.concat(inv2));
                clearTimeout(invTime);
                getLackBookInfo(PIIList, item);
              }, 3000);
            } else {
              if (inv1 && inv1.length) {
                let PIIList = unique(inv1);
                console.log(PIIList,'----PIIList----');
                getLackBookInfo(PIIList, item);
              } else {
                getLackBookInfo(inv1, item);
                console.log(inv1,'----PIIList----');
              }
            }
          }, 10);
        }
      }
    }, 1500);
  }
};
*/
// 开门之后定时查询锁状态 -- 关闭
const openDoorSuccess = (item) => {
  clearTimeout(inventoryOneTime.value);
  status.value = "openDoorSuccess";
  let openStatus = false;
  if (!openStatus) {
    //开启定时循环查询锁状态
    // let maxAttempts = 1
    time.value = setInterval(() => {
      let lockStatus = init.getLockState(
        item.latticeNo ? item.latticeNo : inputInfo.number
      );
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
const unique = (arr) => {
  // debugger
  const res = new Map();
  return arr.filter((arr) => !res.has(arr.PII) && res.set(arr.PII, 1));
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
      latticeNo: item.latticeNo ? item.latticeNo : inputInfo.number,
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
      latticeNo: item.latticeNo ? item.latticeNo : inputInfo.number,
    };
    otherInterface.operatingBook(params).then((res) => {
      resolve({ code: res.code, res });
    });
  });

  Promise.all([LOANS, RESTITUTIONS]).then(async (res) => {
    const [loanResp, restitutionResp] = res;
    let LoanAll = loanResp.data;
    let ReturnAll = restitutionResp.data;
    let LoanTrueNumber = 0; //借书成功的
    let ReturnTrueNumber = 0; //还书成功的
    if (loanResp.code == 0 && restitutionResp.code == 0) {
      const myBorrow = await getMyBorrow();
      nextTick(() => {
        playAudio("borrowSuccess");
      });
      if (LOAN) {
        for (let i = 0; i < LoanList.length; i++) {
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
        console.log(ReturnAll, "--ReturnAll");
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
        status.value = "start";
        dialogStatus.value = false;
        router.push("/");
      }, 5000);
    } else {
      keyBoardRef.value.reSignUp();
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
    latticeNo: item.latticeNo ? item.latticeNo : inputInfo.number,
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

      if (typeof TrueValue !== "number" || TrueValue == 0) {
        TrueValue = res.data.length;
      }


      successMsg.value =
        type == "LOAN"
          ? `借书成功，此次借出<span class="successColor">${TrueValue}</span>本图书`
          : `还书成功，此次归还成功<span class="successColor">${TrueValue}</span>本图书`;
      userRef.value.getReaderOtherInfo();
      status.value = "success";
      setTimeout(() => {
        status.value = "start";
        dialogStatus.value = false;
        router.push("/");
      }, 5000);
    } else {
      keyBoardRef.value.reSignUp();
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

const getHotBook = () => {
  let params = {
    caseId: store.getters.platform.id,
    platformId: store.getters.platform.platformId,
  };
  otherInterface.getBookSort(params).then((res) => {
    if (res.code == 0) {
      hotList.value = res.data;
    }
  });
};

const goDetail = (barCode) => {
  // router.push({path: '/bookDetail', query: {barCode}});
};

onUnmounted(() => {
  if (time.value) {
    clearInterval(time.value); //清空定时器
  }
  clearTimeout();
  init.closeLock();
});

onMounted(() => {
  start();
});
</script>
<style lang="less" scoped>
.search_btn {
  width: 400px;
  display: flex;
  justify-content: flex-start;

  /deep/ .el-button--primary {
    width: 80%;
    height: 80px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
    border-radius: 15px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 2px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

.search_book_sort_box {
  /deep/ .el-button--primary {
    width: 350px;
    height: 60px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
    border-radius: 30px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 1.5px;
    font-size: 25px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

.search_book_sort_btn {
  padding-left: 100px;

  /deep/ .el-button--primary {
    width: 180px;
    height: 60px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
    border-radius: 30px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 1.5px;
    font-size: 25px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

//滚动条
/deep/ .el-scrollbar__bar.is-horizontal {
  height: 100% !important;
}

/deep/ .el-scrollbar__wrap--hidden-default {
  display: flex !important;
}

/deep/ .el-scrollbar__view {
  display: flex !important;
}

/deep/ .el-scrollbar__thumb {
  background-color: transparent;
}

.input {
  width: 1000px;
  position: relative;
}

.inputs {
  padding-left: 20px;
  height: 80px;
  width: 100%;
  font-size: 29px;
  outline: none;
  border: 1px solid #eee;
  border-radius: 10px;
}

.form-input img {
  position: absolute;
  right: 0px;
  top: 20px;
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

.noMore {
  justify-content: center;
  font-size: 22px;
  color: #a4b0be;
}
</style>