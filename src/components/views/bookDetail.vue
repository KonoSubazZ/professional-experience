<template>
  <div class="borrow">
    <div class="search_book" style="height: 800px;margin-top: 0;">
      1111
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted} from 'vue';
import { otherInterface } from "@api/request";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
store.dispatch('updateHead_text','图书详情');
const barCode = ref(router.currentRoute.value.query.barCode);    //路由传过来的barCode
const books = ref({});
//获取图书详情
const getBookDetail = ()=>{
  let params = {
    barCode: barCode.value ,
    platformId: store.getters.platform.platformId
  }
  otherInterface.getBookDetail(params).then(res=>{
    if(res.code==0){
      books.value = res.data;
    }
  })
}
onMounted(()=>{
  getBookDetail();
})

</script>
<style lang="less" scoped>

</style>