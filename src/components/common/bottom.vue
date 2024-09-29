<template>
   <div class="bottom_box">
        <div class="display_flex between  start padding_20">
            <div class="">操作人：{{user.name}}</div>
            <div class="">登录账户：{{user.mobile}}</div>
            <div class=''>单位名称：{{user.platformName}}</div>
            <div class="">过期时间：{{getTime(user.expire)}}</div>
            <!-- <div class="">北京蓝鲸知图科技有限公司  版权所有 v1.0</div> -->
            <div class="">v1.0.6</div>
        </div>
     
   </div>
</template>

<script>

export default {
    data() {
        return {bus: this.bus(this),
            user:{}
        };
    },
    components: {

    },
    created() {
        let user = JSON.parse(localStorage.getItem('user'));
        // // console.log(user)
        let obj={}
        obj.name=user.info.name
        obj.mobile = user.info.mobile
        obj.platformName = user.platform.name
        obj.expire = user.expireTime
        this.user = obj
    },
    methods:{
      
    },
};
</script>


<style scoped>
.bottom_box{
    width:100%;
    height:2.5rem;
    background:#dedede;
    position: fixed;
    bottom: 0;
    color: #777777;
    line-height: 2.5rem;
    font-size:0.88rem;
    box-sizing: border-box;
    z-index: 1;
}
</style>
