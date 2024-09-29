<template>
  <div>
    <div class="input">
      <div class="form-input">
        <img
            class="search-icon"
            src="../../../assets/image/user.png"
            alt=""/>
        <input ref="idcard" id="idcard" class="inputs" v-model="inputInfo.idcard"
               @blur="delName('idcard')" @focus="addName('idcard')" @click.stop type="text"
               placeholder="请输入您的身份证号"/>
      </div>
    </div>
    <div class="input">
      <div class="form-input">
        <img
            class="search-icon"
            src="../../../assets/image/password.png"
            alt=""/>
        <input ref="password" id="password" class="inputs" v-model="inputInfo.password"
               @blur="delName('password')" @focus="addName('password')" @click.stop type="text"
               placeholder="请输入您的登录密码"/>
      </div>
    </div>
    <div class="search_btn">
      <el-button type="primary" round @click="goLogin">登录</el-button>
    </div>

    <keyboard :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show">
    </keyboard>

  </div>

</template>
<script setup>
import {UserService} from '@api/request';
import keyboard from '../../common/keyboard_px.vue';
import filter from '@utils/filter';
import {ElMessage} from 'element-plus';
import {ref, reactive, onMounted, getCurrentInstance} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';

const store = useStore();
const router = useRouter();
let currentInstance = getCurrentInstance();
const inputInfo = reactive({
  idcard: '',
  password: '',
});
const goLogin = () => {
  if (!inputInfo.idcard) {
    return ElMessage.error('请输入您的身份证号');
  }
  if (!filter.checkIdCard(inputInfo.idcard)) {
    return ElMessage.error('请输入正确的身份证号');
  }
  if (!inputInfo.password) {
    return ElMessage.error('请输入您的登录密码');
  }

  store.dispatch('setUserInfo', inputInfo);
  sessionStorage.setItem('user', JSON.stringify(inputInfo));
  ElMessage.success(`登录成功，欢迎您${inputInfo.idcard}`);
  router.push('/index');
}
// UserService.getValidationCode().then(res=>{
//
// })


const className = ref('');
const selectName = ref('');
const keySet = ref({
  show: false,
  top: 0,
  left: 0
});
onMounted(() => {
  document.body.addEventListener("click", (data) => {
    if (keySet.show) {
      className.value = className.value.replace(selectName.value, "");
      changeOpen(false);
    }
  });
})

/**
 * 设置键盘位置并打开
 */
const setKeybord = (name) => {
  let item = currentInstance.ctx.$refs[name].getBoundingClientRect();
  // keySet.top = item.top + item.height + 10;
  // keySet.left = item.left - 150;
  changeOpen(true);
};
/**
 * 改变键盘的状态
 */
const changeOpen = (status) => {
  keySet.show = status;
  keySet.value = Object.assign({}, keySet);
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
.search_btn {
  margin-top: 30px;
  padding: 15px;
  display: flex;
  justify-content: center;

  /deep/ .el-button--primary {
    width: 100%;
    height: 80px;
    background: linear-gradient(-28deg, #6DD89B 0%, #98F1C7 100%);
    border: none;
    border-radius: 15px;
  }

  /deep/ .el-button--primary span {
    Letter-spacing: 2px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.2900);
  }
}

.search_book {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 750px;
  position: relative;
}

.inputs {
  padding-left: 80px;
  height: 80px;
  width: 89%;
  font-size: 29px;
  outline: none;
  border: 1px solid #eee;
  border-radius: 10px;

}
.input img{
  position: absolute;
  left: 25px;
  top: 20px;
}
</style>