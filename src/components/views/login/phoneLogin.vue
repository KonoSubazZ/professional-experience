<template>
  <div>
    <div class="input">
      <div class="form-input">
        <img
            class="search-icon"
            src="../../../assets/image/user.png"
            alt=""/>
        <input ref="phone" id="phone" class="inputs" v-model="inputInfo.phone"
               @blur="delName('phone')" @focus="addName('phone')" @click.stop type="text"
               placeholder="请输入您的手机号"/>
      </div>
    </div>
    <div class="input">
      <div class="form-input">
        <img
            class="search-icon"
            src="../../../assets/image/code.png"
            alt=""/>
        <input ref="code" id="code" class="inputs" v-model="inputInfo.code"
               @blur="delName('code')" @focus="addName('code')" @click.stop type="text"
               placeholder="请输入图片验证码"/>
        <el-image class="codeImg" :src="codeImg" @click="getCodeImg" />
      </div>
    </div>
    <div class="input">
      <div class="form-input">
        <img
            class="search-icon"
            src="../../../assets/image/phoneCode.png"
            alt=""/>
        <input ref="phoneCode" id="phoneCode" class="inputs" v-model="inputInfo.phoneCode"
               @blur="delName('phoneCode')" @focus="addName('phoneCode')" @click.stop type="text"
               placeholder="请输入手机验证码"/>
          <el-button type="primary" round :disabled="codeDisabled" @click="getPhoneCode">{{ contentText }}</el-button>
      </div>
    </div>
<!--    <div class="input">-->
<!--      <div class="form-input">-->
<!--        <img-->
<!--            class="search-icon"-->
<!--            src="../../../assets/image/password.png"-->
<!--            alt=""/>-->
<!--        <input ref="password" id="password" class="inputs" v-model="inputInfo.password"-->
<!--               @blur="delName('password')" @focus="addName('password')" @click.stop type="text"-->
<!--               placeholder="请输入您的登录密码"/>-->
<!--      </div>-->
<!--    </div>-->
    <div class="search_btn">
      <el-button type="primary" round @click="goLogin">登录</el-button>
    </div>

    <keyboard :type="keySet.type" :bottom="0" @result="getResult" :left="0" v-if="keySet.show">
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
const {proxy} = getCurrentInstance();
const inputInfo = reactive({
  phone: '',
  // password: '',
  code: '',
  phoneCode:''
});
const codeImg = ref('');
const codeId = ref('');
const contentText = ref('发送验证码');
const codeDisabled = ref(false);
const codeTime = ref(60);

let timeOneTwo=setTimeout(()=>{
      console.log('准备出发');
      clearTimeout(time)
      router.push('/index')
  },10000)
//发送短信
const getPhoneCode = ()=>{
  if (!inputInfo.phone) {
    return ElMessage.error('请输入您的手机号');
  }
  if (!filter.checkPhone(inputInfo.phone)) {
    return ElMessage.error('请输入正确的手机号');
  }
  if(!inputInfo.code){
    return ElMessage.error('请输入图片验证码');
  }
  let params = {
    phone: inputInfo.phone,
    validationId: codeId.value,
    validationValue: inputInfo.code,
    smsSendType:'login',
    type: 2,
    platformId: '2'
  }
  UserService.sendValidationSMS(params).then(res=>{
    if(res.data.data==0){
      ElMessage.success(res.data.message);
      codeDisabled.value = true;
      let time = '';
      clearTimeout(timeOneTwo)
      timeOneTwo=setTimeout(()=>{
        console.log('准备出发');
        clearTimeout(time)
        router.push('/index')
      },10000)
      time = setInterval(()=>{
        codeTime.value--;
        contentText.value = codeTime.value + 's后重新发送'
        if (codeTime.value < 0) {
          codeDisabled.value = false;
          clearInterval(time);   //清空定时器
          contentText.value = '重新发送验证码';
          codeTime.value = 60;
          getCodeImg();
        }
      },1000);
    }else{
      clearTimeout(timeOneTwo)
      timeOneTwo=setTimeout(()=>{
        console.log('准备出发');
        clearTimeout(time)
        router.push('/index')
      },10000)
      ElMessage.error(res.message);
    }
  }).catch(err=>{
    clearTimeout(timeOneTwo)
    timeOneTwo=setTimeout(()=>{
      console.log('准备出发');
      clearTimeout(time)
      router.push('/index')
    },10000)
    ElMessage.error(err);
  })
}
const goLogin = () => {
  if (!inputInfo.phone) {
    return ElMessage.error('请输入您的手机号');
  }
  if (!filter.checkPhone(inputInfo.phone)) {
    return ElMessage.error('请输入正确的手机号');
  }
  if (!inputInfo.code) {
    return ElMessage.error('请输入图片验证码');
  }
  if (!inputInfo.phoneCode) {
    return ElMessage.error('请输入短信验证码');
  }
  let params = {
    phone: inputInfo.phone,
    smsValue: inputInfo.phoneCode,
    platformId: String(store.getters.platform.platformId)
  }
  UserService.phoneLogin(params).then(res=>{
    if(res.code == 0 ){
      store.dispatch('setUserInfo', res.data);
      sessionStorage.setItem('user', JSON.stringify(res.data));
      ElMessage.success(`登录成功，欢迎您 ${filter.hideName(res.data.name)}`);
      clearTimeout(timeOneTwo)
      router.push('/');
    }else {
      clearTimeout(timeOneTwo)
      timeOneTwo=setTimeout(()=>{
        console.log('准备出发');
        clearTimeout(time)
        router.push('/index')
      },10000)
      ElMessage.error(res.message);
    }
  })

}

//获取验证码图片
const getCodeImg = ()=>{
  UserService.getValidationCode().then(res=>{
    codeImg.value = res.data.data.validationImg;
    codeId.value = res.data.data.validationId;
  })
};

onMounted(()=>{
  getCodeImg();
});


//设置键盘
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
  clearTimeout(timeOneTwo)
  timeOneTwo=setTimeout(()=>{
    console.log('准备出发');
    clearTimeout(time)
    router.push('/index')
  },10000)
  let item = proxy.$refs[name].getBoundingClientRect();
  // keySet.top = item.top + item.height + 10;
  // keySet.left = item.left - 150;
  changeOpen(true);
};
/**
 * 改变键盘的状态
 */
const changeOpen = (status) => {
  clearTimeout(timeOneTwo)
  timeOneTwo=setTimeout(()=>{
    console.log('准备出发');
    clearTimeout(time)
    router.push('/index')
  },10000)
  keySet.value.show = status;
  keySet.value = Object.assign({}, keySet.value);
};
/**
 * 获取输入值
 */
const getResult = (data) => {
  clearTimeout(timeOneTwo)
  timeOneTwo=setTimeout(()=>{
    console.log('准备出发');
    clearTimeout(time)
    router.push('/index')
  },10000)
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
  clearTimeout(timeOneTwo)
  timeOneTwo=setTimeout(()=>{
    console.log('准备出发');
    clearTimeout(time)
    router.push('/index')
  },10000)
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
.form-input{
  /deep/.el-button--primary{
    border-radius: 0;
    border: none;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 80px;
    color: #fff;
    font-size: 30px;
    box-shadow: none;
    background: linear-gradient(-28deg, #6DD89B 0%, #98F1C7 100%) !important;
  }
}
.codeImg{
  position: absolute !important;
  right: 0 !important;
  width: 180px;
  height: 80px;
}
</style>