<template>
  <div class="intype_wx">
    <p>请使用微信扫一扫</p>
<!--    <wxlogin-->
<!--        appid="wx79409beaa5e87da3"-->
<!--        scope="snsapi_login"-->
<!--    ></wxlogin>-->
  </div>

</template>
<script>
// import wxlogin from 'vue-wxlogin'
export default {
  components:{
    // wxlogin
  },
  data(){
    return{
      form:{},
    }
  },
  mounted() {
    // this.get_wx_code()
  },
  methods:{
    // get_wx_code(){
    //
    // }
  }
}
</script>
<style lang="less" scoped>
.intype_wx{
  font-size: 35px;
  Letter-spacing: 2px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #61CA74;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>