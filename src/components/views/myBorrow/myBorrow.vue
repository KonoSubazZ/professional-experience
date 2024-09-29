<template>
  <div class="borrow">
    <user></user>
    <audio id="audioRenew" :src="audioSrc"></audio>
    <div class="search_book">
      <p class="left_title">
        <img src="../../../assets/image/sort_book.png" alt="" />
        <span>{{
          type == "1"
            ? `正在借阅(${bookList.length})`
            : `历史借阅(${bookList.length})`
        }}</span>
      </p>
      <div
        class="search_book_sort"
        style="height: 880px; position: relative"
        v-if="bookList.length > 0"
      >
        <div
          class="search_book_sort_box"
          v-for="(item, index) in bookList"
          :key="index"
        >
          <img class="book_img" v-if="item.coverUrl" :src="item.coverUrl" />
          <img
            class="book_img"
            v-else
            src="../../../assets/image/Index/index_borrow.png"
          />
          <div class="search_book_someBook_right">
            <div class="less" style="width: 500px">
              {{ item.positiveTitle }}
            </div>
            <div>条码号: {{ item.barCode }}</div>
            <div class="less" style="width: 500px">
              类型：{{ item.carrierType === 0 ? "馆内" : "书柜" }}
            </div>
            <div v-if="type == '1'" class="less" style="width: 500px">
              应还日期：{{ date.dateFormatALL(item.borrowAlso) }}
            </div>
            <div v-else class="less" style="width: 500px">
              归还日期：{{ date.dateFormatALL(item.borrowBookTime) }}
            </div>
          </div>
          <div
            class="search_book_sort_btn"
            style="display: flex; flex-direction: column"
            v-if="type == '1'"
          >
            <el-button
              v-if="renewIndex != index"
              type="success"
              :disabled="renewDis"
              round
              size="mini"
              @click="renewBook(item, index)"
              >我要续借
            </el-button>
            <span class="successText" style="font-size: 28px" v-else>{{
              renewMsg
            }}</span>
          </div>
        </div>
      </div>
      <div class="noSize" v-else>
        <img src="../../../assets/image/null.png" />
        暂无借阅
      </div>
    </div>
  </div>
</template>
<script setup>
import user from "../../common/user.vue";
import pic from "@utils/image";
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import filter from "@utils/filter";
import { otherInterface } from "@api/request";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import date from "@utils/dateTime";
const bookList = ref([]);
const renewIndex = ref(99);
const renewMsg = ref("");
const theme = ref({
  color: "red",
});
const audioSrc = ref("");
const renewDis = ref(false);
const router = useRouter();
const store = useStore();
store.dispatch("updateHead_text", "我的借阅");
const type = ref(router.currentRoute.value.query.type);

const renewBook = async (item, index) => {
  if (!store.getters.getCabinetInfo.openRenew) {
    return ElMessage.error("暂未开放续借功能");
  }
  const check = await checkOperatingBook(item.barCode);
  if (!check.data) {
    return ElMessage.error(check.message);
  }
  let params = {
    barCodes: [item.barCode],
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: "RENEW",
    readerNumber: store.getters.getUserInfo.number,
  };
  otherInterface.operatingBook(params).then((res) => {
    if (res.code == 0) {
      renewIndex.value = index; //如果索引相同
      renewDis.value = true;
      setTimeout(() => {
        renewIndex.value = -99; //再返回按钮状态
        renewDis.value = false;
        removeListener();
      }, 2000);
      nextTick(() => {
        playAudio("renewSuccess");
      });
      renewMsg.value = "续借成功";
      theme.value.color = "#1e90ff";
      getBorrow();
    } else {
      renewMsg.value = res.message;
      theme.value.color = "red";
      setTimeout(() => {
        renewIndex.value = -99; //再返回按钮状态
      }, 2000);
    }
  });
};

//续借预检查
const checkOperatingBook = async (barCode) => {
  let params = {
    barCodes: [barCode],
    platformId: store.getters.platform.platformId,
    uuid: store.getters.getUUID,
    type: "RENEW",
    readerNumber: store.getters.getUserInfo.number,
  };
  return await otherInterface.checkOperatingBook(params);
};

const getBorrow = () => {
  let params = {
    borrowType: type.value,
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
     audio = document.getElementById("audioRenew");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioRenewDOM---try catch提前返回!!!"
    );
    return;
  }
  // let audio = document.getElementById("audioRenew");
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
  // let audio = document.getElementById("audioRenew");
  let audio
  try {
     audio = document.getElementById("audioRenew");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioRenewDOM---try catch提前返回!!!"
    );
    return;
  }
  audio.removeEventListener("canplay", audio.play());
};
onMounted(() => {
  getBorrow();
});
</script>
<style lang="less" scoped>
.successText {
  color: v-bind("theme.color");
}

.search_book_sort_btn {
  padding-left: 100px;

  /deep/ .el-button--primary {
    height: 60px;
    background: rgba(255, 145, 89, 1);
    border: none;
    border-radius: 15px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 2px;
    font-size: 27px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }

  /deep/ .el-button--success {
    height: 60px;
    background: rgba(255, 145, 89, 1) !important;
    border: none;
    border-radius: 30px;
  }

  /deep/ .el-button--success span {
    letter-spacing: 2px;
    font-size: 27px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

/deep/ .el-button + .el-button {
  margin-left: 0 !important;
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