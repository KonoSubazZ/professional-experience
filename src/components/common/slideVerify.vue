<template>
  <div class="silde_box">
    <slide-verify
        class="silde_box"
        ref="block"
        :w="500"
        :h="350"
        :slider-text="text"
        :accuracy="accuracy"
        @again="onAgain"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
    ></slide-verify>
    <div class="msg" :style="{color:msgcol}">{{ msg }}</div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";

export default defineComponent({
  components: { SlideVerify },
  props:{
    dialogVisible: {
      type: Boolean,
      default:false
    }
  },
  setup(props,{emit}) {
    const msg = ref("");
    const block = ref<SlideVerifyInstance>();
    const msgcol = ref('')
    const success = ref(0)
    const onAgain = () => {
      msg.value = "检测到非人为操作的哦！ 请重新验证";
      // 刷新
      block.value?.refresh();
    };

    const onSuccess = (times: number) => {
      msg.value = `验证成功, 耗时${(times / 1000).toFixed(1)}s`;
      msgcol.value = '#2ecc71'
      success.value = 1;
      emit('onsuccess',success.value)
      setTimeout(()=>{
        block.value?.refresh();
        msg.value = ''
        success.value = 0;
        emit("update:dialogVisible", false);
      },1000)
    };

    const onFail = () => {
      msg.value = "验证不通过";
      msgcol.value = '#e74c3c'
      setTimeout(()=>{
        msg.value = ''
      },1000)
    };

    const onRefresh = () => {
      msg.value = "刷新成功";
      msgcol.value = '#2ecc71'
      setTimeout(()=>{
        msg.value = ''
      },1000)
    };
    const handleClick = () => {
      // 刷新
      block.value?.refresh();
      msg.value = "";
    };

    return {
      block,
      msg,
      msgcol,
      success,
      text: "拖动滑块验证",
      accuracy: 1,
      onAgain,
      onSuccess,
      onFail,
      onRefresh,
      handleClick,
    };
  },
});
</script>
<style lang="less" scoped>
.silde_box{
  margin:0 auto;
}
.msg{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  font-size: 36px;
}
</style>