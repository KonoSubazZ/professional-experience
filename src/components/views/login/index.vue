<template>
  <div class="borrow">
    <div class="search_book" style="height: 800px">
      <phoneLogin v-if="types == 'phoneType'"></phoneLogin>
      <wxLogin v-if="types == 'wxType'"></wxLogin>
      <faceLogin v-if="types == 'faceType'"></faceLogin>
      <idCardLogin v-if="types == 'idCardType'"></idCardLogin>
      <icCardLogin v-if="types == 'icCardType'"></icCardLogin>
      <adminLogin v-if="types == 'adminType'"></adminLogin>
    </div>
    <div class="search_btn login_other">
<!--      <p>-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            link-->
<!--            @click="goRegister"-->
<!--        >点击注册</el-button-->
<!--        >-->
<!--      </p>-->
      <p>- 请选择其他登录方式 -</p>
      <div class="other_box">
        <div class="other" v-for="(item,index) in typeList.filter(it=>it.show)" :key="index" @click="typeTabClick(item.text,item.type)">
          <div class="type_box">
            <img :src="item.img">
          </div>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
    import phoneLogin from "./phoneLogin.vue";
    import wxLogin from "./wxLogin.vue";
    import faceLogin from "./faceLogin.vue";
    import idCardLogin from "./idCardLogin.vue";
    import icCardLogin from "./icCardLogin.vue";
    import adminLogin from './adminLogin.vue';
    import pic from '@utils/image';
    import { useRouter } from 'vue-router';
    import {ref,reactive, onMounted } from 'vue';
    import { useStore } from 'vuex';
    const router = useRouter();
    const store = useStore();
    const types = ref('');
    const typeList = reactive([
      // {text:'手机号登录',img:pic.phoneImg,type:'phoneType'},
      // {text:'微信登录',img:pic.wxImg,type:'wxType'},
      {text:'管理员登录',img:pic.idcardImg,type:'adminType',show:store.getters.getCabinetInfo.openAdminLogin},
      {text:'人脸识别',img:pic.faceImg,type:'faceType',show:store.getters.getCabinetInfo.openFaceLogin},
      // {text:'身份证登录',img:pic.idcardImg,type:'idCardType'},
      {text:'IC卡登录',img:pic.iccardImg,type:'icCardType',
        show:store.getters.getCabinetInfo.openCardLogin?store.getters.getCabinetInfo.openCardLogin:store.getters.getCabinetInfo.openCodeLogin?store.getters.getCabinetInfo.openCodeLogin:false },
    ]);
    typeList.filter(it=>{
      if(it.show){
        types.value = it.type;
        store.dispatch('updateHead_text',it.text);
      }
    })
    const typeTabClick = (name,type) =>{
      types.value = type;
      store.dispatch('updateHead_text',name);
    };
</script>
<style lang="less" scoped>
/deep/.el-button--warning.is-link{
  font-size: 30px;
}
.login_other{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p{
    Letter-spacing: 2px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #808080;
  }
  .other_box{
    display: flex;
  }
  .other{
    width: 150px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span{
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 145, 89, 1);
    }
    .type_box{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      background: rgba(255, 145, 89, 1);
      border-radius: 50%;
      img{
        margin-top: 5px;
        width: 50px;
        height: 50px;
      }

    }
  }
}

.search_btn{
  margin-top: 10px;
  padding: 15px;
  display: flex;
  justify-content: center;
  /deep/.el-button--primary{
    width: 100%;
    height: 50px;
    background: linear-gradient(-28deg, #6DD89B 0%, #98F1C7 100%);
    border: none;
    border-radius: 15px;
  }
  /deep/.el-button--primary span{
    Letter-spacing: 2px;
    font-size: 25px;
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

/deep/.el-input--prefix .el-input__inner{
  padding-left: 5px !important;
}
</style>