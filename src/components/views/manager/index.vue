<template>
  <div class="borrow">
    <div class="user">
      <img src="../../../assets/image/user.png">
      <div class="user_right">
        <span>您好，管理员 {{userInfo.name}}  </span><br>
        <p>工作编号：{{ userInfo.id }}</p>
      </div>
    </div>
    <div class="search_book" style="height: 800px;margin-top: 0;">
      <div class="input">
        <div class="form-input">
          <input ref="doorNumber" id="doorNumber" class="inputs" v-model="inputInfo.doorNumber"
                 @blur="delName('doorNumber')" @focus="addName('doorNumber')" @click.stop type="text"
                 placeholder="请输入您的柜门编号"/>
          <img
              class="search-icon"
              src="../../../assets/image/num.png"
              alt="" />
        </div>
      </div>
      <div class="input">
        <div class="form-input">
          <input ref="barCode" id="barCode" class="inputs" v-model="inputInfo.barCode"
                 @blur="delName('barCode')" @focus="addName('barCode')" @click.stop type="text"
                 placeholder="扫描图书条码"/>
          <img
              class="search-icon"
              src="../../../assets/image/richScan_book.png"
              alt="" />
        </div>
      </div>
    </div>
    <div class="search_btn">
      <el-button type="primary" round @click="down">上架</el-button>
    </div>
    <keyboard :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show">
    </keyboard>
  </div>
</template>
<script setup>
    import keyboard from "../../common/keyboard_px.vue";
    import { reactive, ref, onMounted, getCurrentInstance,computed} from 'vue';
    import { useStore } from 'vuex';
    import {useRouter} from "vue-router";
    import filter from '@utils/filter';
    const {proxy} = getCurrentInstance();
    const store = useStore();
    store.dispatch('updateHead_text','管理');
    const router = useRouter();
    const inputInfo = reactive({
      doorNumber:'',
      barCode:''
    });
    const userInfo = ref({
      name: computed(()=>{
        return filter.hideName(store.getters.getUserInfo.nickName) || '';
      }),
      id: computed(()=>{
        return store.getters.getUserInfo.id || '';
      }),
    });
    const down = ()=>{
      router.push('/managerBook')
    }


    const className = ref('');
    const selectName = ref('');
    const keySet = ref({
      show: false,
      top: 0,
      left: 0
    });
    onMounted(() => {
      document.body.addEventListener("click", (data) => {
        if (keySet.value.show) {
          className.value = className.value.replace(selectName.value, "");
          changeOpen(false);
        }
      });
    })

    /**
     * 设置键盘位置并打开
     */
    const setKeybord = (name) => {
      let item = proxy.$refs[name].getBoundingClientRect();
      // keySet.top = item.top + item.height + 10;
      // keySet.left = item.left - 150;
      changeOpen(true);
    };
    /**
     * 改变键盘的状态
     */
    const changeOpen = (status) => {
      keySet.value.show = status;
      keySet.value = Object.assign({}, keySet.value);
    };
    /**
     * 获取输入值
     */
    const getResult = (data) => {
      if (data && data != "del") {
        inputInfo[selectName.value] = inputInfo[selectName.value] + data;
      } else if (data == "del") {
        inputInfo[selectName.value] = inputInfo[selectName.value].substring(
            0,
            inputInfo[selectName.value].length - 1
        );
      } else {
        inputInfo[selectName.value] = "";
      }
      let input = document.getElementById(selectName.value);
      input.focus();
      changeOpen(true);
    };
    /**
     * 添加name
     */
    const addName = (name) => {

      if (className.value.indexOf(name) == -1) {
        className.value = className.value + name;
      }
      if (selectName.value && selectName.value != name) {
        className.value = className.value.replace(selectName.value, "");
        selectName.value = "";
      }
      selectName.value = name;
      setKeybord(name);
    };
    /**
     * 删除name
     */
    const delName = (name) => {
      selectName.value = name;
    };
</script>
<style lang="less" scoped>
.search_btn{
  padding: 15px;
  display: flex;
  justify-content: center;
  /deep/.el-button--primary{
    width: 80%;
    height: 80px;
    background: linear-gradient(-28deg, #6AAFF9 0%, #98D7FF 100%) !important;
    border: none;
    border-radius: 15px;
  }
  /deep/.el-button--primary span{
    Letter-spacing: 2px;
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 0px 5px 8px rgba(14,89,170,0.2900);
  }
}
.search_book{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  width: 800px;
  margin-top: 150px !important;
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
.input img{
  position: absolute;
  right: 0;
  top: 20px;
}
</style>