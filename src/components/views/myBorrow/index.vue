<template>
  <div class="borrow">
    <user></user>
    <div class="myborrow_data">
      <div class="history_borrow" @click="borrowClick('2')">
        <img src="../../../assets/image/history.png">
        <span>历史借阅</span>
      </div>
      <div class="now_borrow" @click="borrowClick('1')">
        <img src="../../../assets/image/now.png">
        <span>正在借阅</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import user from '../../common/user.vue';
import {reactive, computed} from 'vue';
import filter from '@utils/filter';
import {useStore} from 'vuex';
import {useRouter} from "vue-router";

const router = useRouter();
const store = useStore();
store.dispatch('updateHead_text', '我的借阅');

const borrowClick = (key) => {
  router.push({path: '/myBorrowDetail', query: {type: key}})
}


</script>
<style lang="less" scoped>
.myborrow_data {
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    Letter-spacing: 2.5px;
    font-size: 40px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }

  img {
    width: 120px;
    height: 120px;
  }

  .history_borrow {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: linear-gradient(139deg, rgba(251, 144, 103, 1) 0%, rgba(251, 103, 102, 1) 100%);
    border-radius: 40px;
    width: 700px;
    margin-top: 160px;
    height: 250px;
  }

  .now_borrow {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: linear-gradient(139deg, rgba(247, 170, 38, 1) 0%, rgba(249, 150, 64, 1) 100%);
    border-radius: 40px;
    width: 700px;
    margin-top: 50px;
    height: 250px;
  }
}
</style>