<template>
  <div class="user">
    <img v-if="userInfo.photo" :src="userInfo.photo">
    <img v-else src="../../assets/image/user.png">
    <div class="user_right">
      <span>您好，{{ userInfo.name }}  </span><br>
      <p>最大借书量 {{ userInfo.borrowBook }} 本     待还图书 {{ userInfo.returnBook }} 本</p>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, onMounted} from "vue";
import {otherInterface} from "@api/request";
import { useStore } from 'vuex';
import filter from '@utils/filter';
import {ElMessage} from "element-plus";
const store = useStore();
const userInfo = ref({
  name: computed(()=>{
    return filter.hideName(store.getters.getUserInfo.name);
  }),
  photo:computed(()=>{
    return store.getters.getUserInfo.photo? store.getters.platform.info.http + '/'+ store.getters.getUserInfo.photo :'';
  }),
  returnBook:0,
  borrowBook:0
});
const getReaderOtherInfo = () => {
  let params = {
    id: store.getters.getUserInfo.id,
    platformId: store.getters.platform.platformId,
    number: store.getters.getUserInfo.number
  }
  otherInterface.getReaderOtherInfo(params).then(res => {
    if (res.code == 0) {
      userInfo.value.returnBook = res.data.borrowingSize || 0;
      userInfo.value.borrowBook = res.data.maxBooks || 0;
    }
  })
}
defineExpose({ getReaderOtherInfo })
onMounted(()=>{
  getReaderOtherInfo();
})

</script>