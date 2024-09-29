<template>
    <div class="login-wrap">
        <div class="ms-login login_active">
            
            <div class="ms-title m-b-40" >
                <div class="f-s-18">激活方式</div>
            </div>
             <div class="display_flex between active_select ">

                    <div class="m-b-20  cursor" @click="$router.push('/activationOL')" style="text-align: center;">
                        <img src="../../../assets/img/OL.png" style="width:60px; height: 60px;" alt="">
                        <div style="font-size: 16px;color: #fff;line-height:40px">联网激活</div>
                    </div>
                    <div class="m-b-20 cursor" @click="$router.push('/activation')" style="text-align: center;">
                        <img src="../../../assets/img/Al.png" style="width: 60px; height: 60px;" alt="">
                        <div style="font-size: 16px;color: #fff;line-height:40px">单机激活</div>
                    </div>
                    <!-- <el-button type="primary" class="m-b-20" @click="$router.push('/activationOL')"  plain>联网版激活</el-button>
                    <el-button type="primary"  class="m-b-20" @click="$router.push('/activation')" plain>单机版激活</el-button> -->
                </div>
        </div>
    </div>

</template>

<script>
import Clipboard from 'clipboard';
export default {
    data() {
        return {
        };
    },
    created() {
       
    },
    methods: {

    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/login-bg.jpg); */
    background: #324157;
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    height: 50px;
    text-align: center;
    padding:0 50px;
    box-sizing: border-box;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid rgba(221, 221, 221,0.5);
}
.btn_choose{
    color: #324157;
    transition: 0.4s;
    font-size: 16px;
}
.active_btn{
     color: #fff;
     line-height: 40px;
     /* border-bottom: 1px solid #fff; */
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.el-link.el-link--default{
 color: #1784ff;
}
.bottom{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
   
}
.login_active{
    animation: show 2s;
}


.active_select{
    padding: 0 70px;
}
</style>
