<template>
    <div class="footer">
      <div class="right" v-if="content">
        <span style="width: 80px">通知:</span>
        <marquee id="affiche" align="left" behavior="scroll" bgcolor="#F5FFF5" direction="left"  hspace="200" vspace="100" loop="-1" scrollamount="10" scrolldelay="0">
          {{ content }}
        </marquee>
      </div>

    </div>
</template>
<script setup>
import {otherInterface} from "@api/request";
import { useStore } from "vuex";
import {ref,onMounted} from "vue";
const store = useStore();
const content = ref('');
const noticeIdList = ref(store.getters.getCabinetInfo.noticeIdList?store.getters.getCabinetInfo.noticeIdList:[]);
const getNotice = ()=>{
  for(let i = 0;i<noticeIdList.value.length;i++){
    otherInterface.getNotice({id:noticeIdList.value[i]}).then(res=>{
      content.value = content.value.concat(res.data.content+'；').split(',').sort((a,b)=> a-b).join();
    })
  }
}

onMounted(()=>{
  getNotice();
})
</script>
<style lang="less" scoped>
.footer{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .right{
    margin-left: 20px;
    display: flex;
  }
}
#affiche{
  width: 960px;
  color: #333;
  font-size: 23px;
  background: transparent;
}
.footer .right span:nth-child(1){
  font-size: 23px;
  color: #333;
}
</style>