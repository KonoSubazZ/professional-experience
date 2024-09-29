<template>
  <div class="borrow">
    <!-- 弹框 -->
    <!-- 上架图书信息展示 -->
    <el-dialog v-model="dialogVisibleMsgAll" title="图书上架详情" width="50%">
      <el-table height="450" style="width: 100%;" :data="msgAll">
        <el-table-column sortable property="barCode" label="条码号" />
        <el-table-column sortable property="msg" label="说明">
          <template #default="scope">
            <!-- {{ scope.row.mag }} -->
            <span :class="scope.row.class">{{ scope.row.mag }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- ---------- -->
    <div class="user" style="position: relative;">
      <img src="../../../assets/image/user.png" />
      <div class="user_right">
        <span>您好，管理员 {{ userInfo.name }} </span><br />
        <p>工作编号：{{ userInfo.id }}</p>
      </div>
      <div style="position: absolute; right: 5%;display: flex;align-items: center;">
        <el-checkbox v-model="bookSumChecked" @change="bookIDListSum" style="margin-right: 10px;"
          label="全选"></el-checkbox>
        <Tools style="width: 4.5em; height: 4.5em; margin-left: 25px;color:#ff9159"
          @click.stop="dialogVisible = true" />
        <el-button v-if="disinfectshow" type="warning" @click.stop="openDisinfect"
          style="margin-left: 10px;font-size: 25px; height: 40px;">{{ !disinfect ? '开启消毒' : '关闭消毒' }}</el-button>
      </div>
    </div>
    <div class="search_book" style="margin-top: 0" v-loading="loading" element-loading-text="盘点中">
      <div class="input">
        <div class="form-input">
          <input ref="number" id="number" class="inputs" v-model="inputInfo.number" data-mode="number" type="text"
            placeholder="请输入格子编号" />
          <img @click="searchBook(inputInfo.number)" class="search-icon" src="../../../assets/image/search.png"
            alt="" />
        </div>
        <p style="font-size: 25px; color: #0984e3; margin-left: 15px" v-if="bookList.length > 0 && invText">
          共盘点图书数量：{{ bookList.length }}本
        </p>
        <p style="font-size: 25px; color: #0984e3; margin-left: 15px" v-if="bookList.length > 0 && bookText">
          {{ searchAll ? '本格' : '全部' }}在架图书数量：{{ bookList.length }}本
        </p>
      </div>

      <div class="search_book_sort" v-infinite-scroll="Load" infinite-scroll-immediate="false"
        style="display: flex; flex-wrap: wrap; padding: 0; height: 703px">
        <div class="search_book_sort_box" style="width: 47%; padding: 10px" v-for="(item, index) in bookList"
          :key="index">
          <el-checkbox style="margin-right: 10px;" label="" @change="bookIDList($event, item, index)"
            v-model="item.checked"></el-checkbox>
          <!-- <input ref="inputCheck" style="width: 50px; height: 50px; margin-right: 10px"
            @change="bookIDList($event, item, index)" type="checkbox" name="" id="" /> -->
          <img class="book_img" v-if="item.coverUrl" :src="item.coverUrl" alt="" />
          <img class="book_img" v-else src="../../../assets/image/Index/index_borrow.png" />
          <div class="search_book_someBook_right">
            <div class="less" style="width: 300px">
              {{ item.bookName ? item.bookName : item.positiveTitle }}
            </div>
            <!--              <div class="less" style="width: 300px">作者：{{item.firstResponsible}}</div>-->
            <div class="less" style="width: 300px" v-if="item.bookName">
              图书状态：{{
                item.bookStatus === "InCollection" ? "在馆" : "借出"
              }}
            </div>
            <div class="less" style="width: 300px" v-else>盘点状态：已盘点</div>
            <div class="less" style="width: 300px">
              条码号: {{ item.barCode }}
            </div>
          </div>
        </div>
        <p v-if="isLoading" class="noMore">加载中...</p>
        <p v-if="noMore" class="noMore">-没有更多了-</p>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" round @click="search('inventoryOne')" :loading="loadingOne">盘点本格</el-button>
      <!-- <el-button type="primary" round @click="search('grounding')" :loading="openLoading">上架</el-button> -->
      <el-button type="primary" round @click="relevanceBook" :loading="openLoading">上架</el-button>
      <el-button type="primary" round @click="search('openDoorOne')">打开这个柜门</el-button>

      <el-button type="primary" round @click="search('inventoryAll')" :loading="loadingAll"
        :disabled="disabled">盘点所有</el-button>
      <el-button type="primary" round @click="unbindingBook()" :loading="openLoading">下架</el-button>
      <el-button type="primary" round @click="search('openDoorAll')" :loading="openLoading">打开全部柜门</el-button>
    </div>
    <el-dialog v-model="dialogVisible" width="500px;" style="font-size:29px;height:300px;overflow: hidden;"
      @open="handleOpenDialog">
      <template #header>
        <div class="dialog-footer" style="font-size:36px;">
          锁定柜门
        </div>
      </template>
      <div class="dialog-content" style="display: flex;flex-wrap: wrap;">
        <div v-for="(item, index) in latticeList" :key="index" style="font-size:29px;" class="lattice-list">
          <el-checkbox :label="item.name" v-model="item.locked" class="lattice-item" />
        </div>
      </div>
      <template #footer>
        <div style="padding: 10px 0;">
          <el-button @click="dialogVisible = false" style="font-size:24px;">取消</el-button>
          <el-button type="primary" @click="save" style="font-size:24px;">
            锁定
          </el-button>
        </div>
      </template>

    </el-dialog>

    <Key-Board @change="keyChange" :color="'#06f'" />
  </div>
</template>
<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  onUnmounted,
  nextTick,
} from "vue";
const { proxy } = getCurrentInstance();
import { otherInterface } from "@api/request";
import filter from "@utils/filter";
import { useStore } from "vuex";
import hardware from "@api/hardwareDeviceApi";
import { ElMessage } from "element-plus";
import {checklatticeNoLocked} from "@utils/read.js"
const init = hardware.init();
const store = useStore();
store.dispatch("updateHead_text", "管理");
const bookList = ref([]);
const inputInfo = reactive({
  number: "",
});
// 消毒控制---------------
const disinfectshow = ref(JSON.parse(localStorage.getItem('openLamp')))
const disinfect = ref(false);
const openDisinfect = () => {
  if (!disinfect.value) {
    console.log('开启');
    let openZYX = init.openZYX()
    console.log(openZYX, '======openZYX');
    localStorage.setItem('openZYX', openZYX)
    if (Number(openZYX) == 0) {
      disinfect.value = !disinfect.value
    } else {
      return ElMessage.error("开启失败");
    }
  } else {
    console.log('关闭');
    let closeZYX = init.closeZYX()
    localStorage.setItem('closeZYX', closeZYX)
    console.log(closeZYX, '======closeZYX');
    if (Number(closeZYX) == 0) {
      disinfect.value = !disinfect.value
    } else {
      return ElMessage.error("关闭失败");
    }
  }
}
// ---------------
const userInfo = ref({
  name: computed(() => {
    return filter.hideName(store.getters.getUserInfo.name) || "";
  }),
  id: computed(() => {
    return store.getters.getUserInfo.id || "";
  }),
});
const disabled = ref(false);
const invText = ref(false);//盘点文字提示
const bookText = ref(false);//搜索上架图书是数量提示
const loading = ref(false);
const loadingAll = ref(false);//盘点所有的
const loadingOne = ref(false);//盘点单格
const openLoading = ref(false);
const invTime = ref(null);
const page = ref(1);
const size = ref(8);
const totalPages = ref(0);
const isLoading = ref(false);
const noMore = ref(false);
const shangjia = ref(false);
const inventoryAllTrue = ref(false);//true就不能在上架了
const unbindingList = ref([]); //要解绑的书籍id
// const inputCheck = ref(null);
const dialogVisible = ref(false);
const keyChange = () => {
  inputInfo.number = document.getElementById("number").value;
};

let latticeList = ref([]); //柜门格子号状态 list 

const handleOpenDialog = () => {
  const savedLatticeList = JSON.parse(window.localStorage.getItem('latticeList'))
  latticeList.value = savedLatticeList
}

/**
 * 保存锁定柜门信息
 */
const save = () => {
  dialogVisible.value = false;
  window.localStorage.setItem('latticeList', JSON.stringify(latticeList.value));
  ElMessage.success('设置成功!');
}
const search = (type) => {

  const latticeNumber = Number(localStorage.getItem('latticeNumber')); // 本书柜柜门数量 
  const inputNumber = Number(inputInfo.number); // 输入的柜门号

  //校验输入的参数是否合法及柜门是否被锁定   
  if (type === "inventoryOne" || type === "openDoorOne") {
    if (!inputInfo.number) {
      return ElMessage.error("请输入格子编号");
    }
    if (inputNumber > latticeNumber || inputNumber === 0) {
      return ElMessage.error("格子输入错误，非本书柜格子");
    }
    if (checklatticeNoLocked(inputNumber)) {
      return ElMessage.warning("当前格子已经被管理员锁定，暂时无法操作");
    }
  }
  if (type === "inventoryOne") {
    inventoryAllTrue.value = false;
    loadingOne.value = true;
    loading.value = true;
    disabled.value = true;
    bookText.value = false;
    let OneTime = null
    clearTimeout(OneTime)
    setTimeout(() => {

      let inv1 = init.inventoryOne(inputInfo.number);
      if (!inv1.length) {
        init.stopInventory();
        ElMessage.error("当前格子没有图书")
        loadingOne.value = false;
        loading.value = false;
        disabled.value = false;
        return;
      };
      if (inv1.length > 0) {
        getBookDetail(inv1.map((it) => it.PII));
        init.stopInventory();
        shangjia.value = true;
        loadingOne.value = false;
        loading.value = false;
        disabled.value = false;
      }
      // 如果10秒后没有盘道数据那么就提示
      OneTime = setTimeout(() => {
        if (!inv1.length) {
          return ElMessage.error("盘点失败,请重新盘点")
        }
      }, 10000)
    }, 1000)
  } else if (type === "inventoryAll") {
    inventoryAllTrue.value = true;
    // 增加退出登录的时间,防止盘点图书中就出现了退出登录的情况
    store.dispatch('setOutLoginTime', (30 * 1000) * 10)
    loadingAll.value = true;
    loading.value = true
    disabled.value = true;
    bookText.value = false;
    setTimeout(() => {
      // let inv = init.inventory();
      let inv = []

      // 高频获取盘点数据
      if (store.getters.platform.info.typeL == 'hf') {
        for (let i = 0; i < Number(localStorage.getItem('latticeNumber')); i++) {
          inv.push(...init.inventory(i + 1))
        }
      } else {
        // 超高频获取盘点数据
        for (let i = 0; i < Number(localStorage.getItem('latticeNumber')); i++) {
          inv.push(...init.inventory(i + 1))
        }
      }

      if (inv.length > 0) {
        console.log('走了');
        let all = unique(inv);
        // invTime.value = setTimeout(() => {
        clearTimeout(invTime.value);
        getBookDetail(all.map((it) => it.PII), all);
        init.stopInventory();
        shangjia.value = true;
        loading.value = false
        loadingAll.value = false;
        store.dispatch('setOutLoginTime', 1000 * 30)
        // }, 10000);
      } else {
        init.stopInventory();
        loadingAll.value = false;
        loading.value = false
        ElMessage.warning("当前格子没有图书");
      }
    }, 1000);
  } else if (type === "openDoorOne") {

    init.openLock(inputInfo.number);
  } else if (type === "openDoorAll") {
    store.dispatch('setOutLoginTime', (30 * 1000) * 10)//点击的时候先加大时间
    openLoading.value = true;
    setTimeout(() => {
      let latticeNumber = Number(localStorage.getItem('latticeNumber'))
      if (latticeNumber <= 8) {
        init.openAllLock({ boradNum: 1, lockNum: 8 })
      } else if (latticeNumber > 8 && latticeNumber <= 16) {
        init.openAllLock({ boradNum: 2, lockNum: 8 })
      } else if (latticeNumber > 16) {
        console.log('走的这里');
        init.openAllLock({ boradNum: 3, lockNum: 8 })
      }
      openLoading.value = false;
      store.dispatch('setOutLoginTime', (30 * 1000))//完事后在改成正常时间
    }, 1000);
  }
};

//去重
const unique = (arr) => {
  const res = new Map();
  return arr.filter((arr) => !res.has(arr.PII) && res.set(arr.PII, 1));
};
//根据图书条码号查询图书详情
const getBookDetail = (barCodes, allArr) => {
  bookList.value = [];
  for (let i = 0; i < barCodes.length; i++) {
    let params = {
      barCode: barCodes[i],
      platformId: store.getters.platform.platformId,
    };
    otherInterface.getBookDetail(params).then((res) => {
      disabled.value = false;
      if (res.code == 0 || res.code == 200) {
        if (res.data.content[0].coverUrl) {
          res.data.content[0].coverUrl =
            store.getters.platform.info.http +
            "/" +
            res.data.content[0].coverUrl;
        }
        res.data.content[0].checked = false; // 初始化状态
        bookList.value.push(res.data.content[0])

      }
    });
  }

  if (allArr && allArr.length) {
    const transformedData = allArr.reduce((accumulator, obj) => {
      const existingItem = accumulator.find(item => item.id === obj.id);
      if (existingItem) {
        existingItem.PIIS.push(obj.PII);
      } else {
        accumulator.push({
          id: obj.id,
          PIIS: [obj.PII]
        });
      }

      return accumulator;
    }, []);
    let AllArr = [];//集合的上架
    let bookListLength = [];//一共上架图书本书
    transformedData.map(item => {
      let params = {
        id: Number(store.getters.getCabinetInfo.id),
        // id: 10,
        latticeNo: item.id,
        bookBarCodes: item.PIIS,
        platformId: store.getters.platform.platformId
      };
      bookListLength = bookListLength.concat(item.PIIS)
      console.log(params, 'params');
      AllArr.push(otherInterface.relevanceBookAPI(params))
    })
    Promise.all(AllArr).then(res => {
      console.log(res, '---res');
      let msgTrue = false;//是否有上架失败的
      let msgTrueNumber = 0;
      let msgFalseNumber = 0;
      let dataAll = []
      res.map(it => {
        if (it.data.length) {
          dataAll.push(...it.data)
        }
      })
      console.log(dataAll, '---dataAll');
      dataAll.map(item => {
        if (item.code == '1') {
          item.class = 'green'
          msgAll.value.push(item)
          msgTrue = true;
          msgTrueNumber = msgTrueNumber + 1;
        } else {
          item.class = 'red'
          msgAll.value.push(item)
          msgFalseNumber = msgFalseNumber + 1;
        }
      })
      if (msgAll.value && msgAll.value.length) {
        dialogVisibleMsgAll.value = true
        if (!msgTrue) {//没有成功上架的
          ElMessage.error({
            message: "上架图书失败",
            duration: 3000
          });
        } else {
          ElMessage.success({
            message: "成功上架" + msgTrueNumber + '本图书',
            duration: 3000
          });
        }
      } else {
        ElMessage.error({
          message: "没有需要上架的图书",
          duration: 3000
        });
      }
      // ElMessage.success({
      //   message: "成功上架" + bookListLength.length + '本图书',
      //   duration: 3000
      // });
    })
  } else {
    loading.value = false;
    invText.value = true;
  }

};

const Load = () => {
  if (invText.value) return;
  if (page.value >= totalPages.value) return;
  page.value++;
  isLoading.value = true;
  getBookList();
};
// 关联图书

const dialogVisibleMsgAll = ref(false);
const msgAll = ref([]);
const relevanceBook = () => {
  if (inventoryAllTrue.value) return ElMessage.error('请勿重复上架图书')
  if (!checkBookList.length) return ElMessage.error('请选择要上架的图书')
  let params = {
    id: Number(store.getters.getCabinetInfo.id),
    // id: 10,
    latticeNo: inputInfo.number,
    bookBarCodes: checkBookList,
    platformId: store.getters.platform.platformId
  };
  otherInterface.relevanceBookAPI(params).then((res) => {
    console.log(res, '--res2');
    msgAll.value = []

    if (res.code == 0 && res.data.length) {
      let msgTrue = false;//是否有上架失败的
      let msgTrueNumber = 0;
      let msgFalseNumber = 0;
      res.data.map(item => {
        // code:1,上架成功,-1,上架失败
        if (item.code == '1') {
          item.class = 'green'
          msgAll.value.push(item)
          msgTrue = true;
          msgTrueNumber = msgTrueNumber + 1;
        } else {
          item.class = 'red'
          msgAll.value.push(item)
          msgFalseNumber = msgFalseNumber + 1;
        }
      })
      if (msgAll.value && msgAll.value.length) {
        dialogVisibleMsgAll.value = true
        if (!msgTrue) {//没有成功上架的
          ElMessage.error({
            message: "上架图书失败",
            duration: 3000
          });
        } else {
          ElMessage.success({
            message: "成功上架" + msgTrueNumber + '本图书',
            duration: 3000
          });
        }
      } else {
        ElMessage.error({
          message: "没有需要上架的图书",
          duration: 3000
        });
      }
      // ElMessage.success({
      //   message: "成功上架" + checkBookList.length + '本图书',
      //   duration: 3000
      // });
      bookList.value.map(it => {
        it.checked = false
      })
      bookSumChecked.value = false
      checkBookList = []
    }
  });
};
// 获取要解绑的图书id
// 选中的图书列表
let checkBookList = reactive([])
const bookIDList = (event, data) => {
  if (event == true) {
    if (data.bookId) {
      unbindingList.value.push({
        bookId: data.bookId,
        latticeNo: data.latticeNo
      })
      if (unbindingList.value.length == bookList.value.length) {
        bookSumChecked.value = true
      }
    }
    data.checked = true
    checkBookList.push(data.barCode)
    if (checkBookList.length == bookList.value.length) {
      bookSumChecked.value = true
    }
  } else {
    if (data.bookId) {
      let i = unbindingList.value.findIndex(ic => ic.bookId == data.bookId)
      unbindingList.value.splice(i, 1)
      if (unbindingList.length < bookList.value.length) {
        bookSumChecked.value = false
      }
    }
    data.checked = false
    let index = checkBookList.findIndex(it => it == data.barCode)
    checkBookList.splice(index, 1)
    if (checkBookList.length < bookList.value.length) {
      bookSumChecked.value = false
    }
  }
};
// 全选
let bookSumChecked = ref(false)
const bookIDListSum = (e) => {
  if (!e) {
    checkBookList = []
    unbindingList.value = []
    bookList.value.map(it => {
      it.checked = false
    })
  } else {
    checkBookList = []
    unbindingList.value = []
    bookList.value.map(it => {
      it.checked = true
      checkBookList.push(it.barCode)
      if (it.bookId) {
        unbindingList.value.push({
          bookId: it.bookId,
          latticeNo: it.latticeNo
        })
      }
    })
  }
}
// 解绑图书
const unbindingBook = () => {
  let AllArr = [];//集合的下架
  if (!unbindingList.value.length) {
    return ElMessage.error("请选择要下架的图书");
  }
  // console.log(unbindingList.value,'unbindingList');
  unbindingList.value.map((it) => {
    let params = {
      caseId: String(store.getters.getCabinetInfo.id),
      // caseId: 10,
      latticeNo: it.latticeNo,
      bookId: it.bookId,
    };
    // console.log(params,'paramsparams');
    AllArr.push(otherInterface.unbindingBookAPI(params))
  });

  Promise.all(AllArr).then((res) => {

    ElMessage.success({
      message: "成功解绑" + unbindingList.value.length + '本图书',
      duration: 3000
    });
    nextTick(() => {
      searchBook()
      bookSumChecked.value = false
      unbindingList.value = [];
    })
  });

};
// 获取搜索的图书信息
const getBookList = () => {
  let params = {
    caseId: store.getters.platform.id,
    // caseId: 10,
    platformId: store.getters.platform.platformId,
    // pageNumber: page.value,
    limit: 1000,
    latticeNo: String(inputInfo.number)
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
        bookText.value = true;
        bookList.value = bookList.value.concat(res.data.content);
        totalPages.value = res.data.totalPages;
        isLoading.value = false;

        if (page.value >= res.data.totalPages) {
          noMore.value = true;
        } else {
          noMore.value = false;
        }
      }
    })
    .catch((err) => {
      isLoading.value = false;
    });
};
const searchAll = ref(false);//检索的是否是全部格子图书
const searchBook = (number) => {
  if (number) {
    searchAll.value = true
  } else {
    searchAll.value = false
  }
  bookSumChecked.value = false
  checkBookList = []
  unbindingList.value = []
  invText.value = false;
  page.value = 1;
  bookList.value = [];
  getBookList();
};

onUnmounted(() => {
  init.closeLock();
  shangjia.value = false;
  clearTimeout();
  init.closeZYX()
  localStorage.setItem('openZYX', -1)
  localStorage.setItem('closeZYX', -1)
});

onMounted(() => {
  init.connectLock();
  shangjia.value = false;
  handleOpenDialog()
  getBookList();
});
</script>
<style lang="less" scoped>
.lattice-list {
  width: 50%;
}

.noMore {
  width: 100%;
  justify-content: center;
  text-align: center;
  font-size: 22px;
  color: #a4b0be;
}

.btn {
  margin-right: 40px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  /deep/.el-button--primary {
    margin-right: 10px;
    margin-top: 10px;
    width: 300px;
    height: 80px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
    border-radius: 15px;
  }

  /deep/.el-button--primary span {
    letter-spacing: 2px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
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

:deep(.el-icon.is-loading) {
  font-size: 35px !important;
}

:deep(.el-loading-spinner) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

:deep(.el-loading-text) {
  font-size: 35px !important;
}

:deep(.circular) {
  font-size: 35px !important;
}

:deep(.el-loading-mask) {
  height: 100% !important;
}

.red {
  color: #F56C6C;

}

.green {
  color: #67C23A;
}
</style>