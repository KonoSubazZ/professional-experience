<template>
    <div>
        <div class="m-b-30">
            <div class="userOnLive padding_20 display_flex m-b-" >
                <img src="../../../../assets/img/circulationReader.png"  class="userImg m-r-10" >
                <div class="m-r-10">在线用户数:  {{number.managerOnlineNumber}}/{{number.managerNumber}}</div>
                <div class="cursor lookInfo " @click="$router.push('index/user')" >[查看]</div>
            </div>
        </div>
        <div class="box_background padding_20">
                <div class="display_flex  wrap">
                    <div class="box_title w-24 m-b-20 " v-for="(item,i) of title" :key="i" @click="jump(item.path)">
                        
                            
                        <img :src="item.img" class="circle">
                        
                         <div>{{item.name}}</div>
                         <img :src="item.src"  class="b_bottom" />
                    </div>
                   
                </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {bus: this.bus(this),
           number:{},
           title:[
            {
                name:'馆藏统计',
                img:require('../../../../assets/img/books_b.png'),
                src:require('../../../../assets/img/b1.png'),
                path:'/collection/index'
            },
            {
                name:'分类统计 ',
                img:require('../../../../assets/img/grounp.png'),
                 src:require('../../../../assets/img/b2.png'),
                path:'/classification/index'
            },
            {
                name:'流通统计',
                img:require('../../../../assets/img/echarts_o.png'),
                 src:require('../../../../assets/img/b3.png'),
                path:'/circulation/index'
            },
            {
                name:'读者统计',
                img:require('../../../../assets/img/reader_g.png'),
                 src:require('../../../../assets/img/b4.png'),
                path:'/reader/index'
            },
            {
                name:'报表查询',
                img:require('../../../../assets/img/search_g.png'),
                 src:require('../../../../assets/img/b5.png'),
                path:'/echarts/index'
            },
            {
                name:'系统配置',
                 img:require('../../../../assets/img/privilege.png'),
                  src:require('../../../../assets/img/b6.png'),
                path:'/privilege/role'
            },
           ],
        };
    },
    created() {
       this.getNumber()
    },
    methods: {
        jump(path){
            this.$router.push({path})
        },
        getNumber(){
            this.ax.get('/manage/united/clusterIndex/platformOnlineAllRes')
            .then(res=>{
                // console.log(res)
                this.number = res
            })
        },
    }
};
</script>

<style scoped>
.userOnLive{
    background: #fff;
    border-radius: 5px;
    width: 100%;
    height: 6.25rem;
    color: #333;
    font-size: 1.5rem;
    box-sizing: border-box;
}
.userImg{
    width: 1.5rem;
    height: 1.5rem;
}
.box_title{
    /* width:25.56rem; */
    height:15.19rem;
    background:rgba(255,255,255,1);
    border:1px solid #e4e4e4;
    position: relative;
    border-radius:5px;
    text-align: center;
    color: #333333;
    font-size: 1.13rem;
    font-weight: normal;
    margin:10px;
    cursor: pointer;
   
}
.box_background{
    margin: 0 auto;
}
.circle{
    width:4.13rem;
    height:4.13rem;
    margin: 4rem auto;
    margin-bottom: 1rem;
}
.circle_img{
    width:1.38rem;
    height: 1.38rem;
}
.w-24{
    width: 23.5%;
}
.b_bottom{
    height: 7.88rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}
.lookInfo{
    color: #267FF9;
}
</style>
