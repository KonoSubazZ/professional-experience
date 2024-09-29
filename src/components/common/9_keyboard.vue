<template>
<!--  首页9键键盘-->
  <div class="keyboard">
      <div class="keynum" @click="setnum('1')">1</div>
      <div class="keynum b-l-1" @click="setnum('2')">2</div>
      <div class="keynum b-l-1" @click="setnum('3')">3</div>
      <div class="keynum b-t-1" @click="setnum('4')">4</div>
      <div class="keynum b-l-1 b-t-1" @click="setnum('5')">5</div>
      <div class="keynum b-l-1 b-t-1" @click="setnum('6')">6</div>
      <div class="keynum b-t-1" @click="setnum('7')">7</div>
      <div class="keynum b-l-1 b-t-1" @click="setnum('8')">8</div>
      <div class="keynum b-l-1 b-t-1" @click="setnum('9')">9</div>
      <div class="keynum b-t-1" @click="del">
        <img src="../../assets/image/del.svg">
      </div>
      <div class="keynum b-l-1 b-t-1" @click="setnum('0')">0</div>
      <div class="keynum b-l-1 b-t-1" @click="goBorrow('确认')" style="font-size: 45px;color: rgba(255, 145, 89, 1)">确定</div>

  </div>
</template>
<script setup>
import {ref,defineEmits,defineExpose} from "vue";

const num = ref('')
const emit = defineEmits(['ongetnum_'])
const setnum = (e)=>{
  let nums = String(num.value);
  nums = nums + e;
  if(nums.length<=10){
    num.value = nums;
    emit('ongetnum_', nums);
  }
}
const goBorrow = (e)=>{
  emit('goBorrow',e)
}
const del = ()=>{
  let nums = String(num.value);
  nums = nums.substr(0, nums.length - 1);
  num.value = nums;
  emit('ongetnum_', nums);
}
const clear = ()=>{
  num.value = '';
  emit('ongetnum_', num.value);
}
defineExpose({clear})
</script>
<style lang="less" scoped>
.keyboard {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(255, 236, 224, 1);
  .keynum {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 66px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333;
    width: 147px;
    height: 168px;
    img{
      width: 80px;
      height: 58px;
    }
  }

}
.b-l-1{
  border-left: 1px solid rgba(199, 199, 199, 1);
}
.b-t-1{
  border-top: 1px solid rgba(199, 199, 199, 1);
}

</style>