<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                  <i class="el-icon-arrow-down el-icon-s-tools"></i>
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu> 
            </el-dropdown>
         </div>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="tags-li">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

            <el-breadcrumb-item  v-for="(item,index) in tagsList"  :key="index" class="breadcrumb" >{{item.title}}</el-breadcrumb-item>
             
        </el-breadcrumb> -->

    </div>
</template>

<script>
    import bus from './bus';
    // import {log} from "util";
    export default {
        data() {
            return {
                tagsList: [],
                type:''
            }
        },
        methods: {
            jump(val){
                // // console.log(val)
            },
            close(val){
                // //// console.log(val)
                // const delItem = this.tagsList.splice(index, 1)[0];
            },
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
              if(this.tagsList.length==1){
                return
              }
              const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                  delItem.path === this.$route.fullPath && this.$router.push(item.path);
                }else{
                  if(this.type=='2'){
                                 this.$router.push('/subIndex');
                            }else{
                                this.$router.push('/index');
                            }
                }
                // bus.$emit('closeTags', index)
            },
            // 关闭全部标签
            closeAll(){
                this.tagsList = [];
                 if(this.type=='2'){
                                 this.$router.push('/subIndex');
                            }else{
                                this.$router.push('/index');
                            }
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsList = curItem;
            },
            pops(arr){
                //获取数组最后一个元素
                let item=arr[arr.length-1];
                // 将数组长度减一，相当于删除最后一个元素
                arr.length--;
                //将删除的元素返回
                return item;
            },
            // 设置标签
            setTags(route){
                // // console.log(route)
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                if(!isExist){
                    if(this.tagsList.length >= 8){
                        this.tagsList.shift();
                    }

                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[1].components.default.name
                    })
                    //  this.tagsList=route.matched.map(it=>{
                    //     it.title = it.meta.title,
                    //     it.path = it.path,
                    //     it.name = it.meta.title
                    //     return it
                    // })

                  // 1.
                  const ids = this.tagsList.map(value=> value.title);
                  const idsSet = ids.some((item,idx)=>{
                    return ids.indexOf(item) != idx
                  })
                  if(idsSet == true){
                    let objs =this.pops(this.tagsList);
                    const indexs = this.tagsList.findIndex((els)=>els.title==='编辑图书')
                    this.tagsList[indexs] = objs
                    this.$router.push(objs.path)

                  }
                }


                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
           
            showTags() {
                // // console.log(this.tagsList)
                if(this.tagsList.length==2 && this.tagsList[1].name=='系统首页'){
                    return false
                }
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            },
            tagsList(){
               // console.log('eeeeeeeeeee',this.tagsList)
            }
        },
        mounted(){
           bus.$on('close',(e)=>{
            this.tagsList.forEach((item,index) => {
                if(item.path.indexOf(e)!=-1){
                     this.tagsList.splice(index, 1)[0];
                }
            });
           })
        },
        created(){
            this.type = JSON.parse(localStorage.getItem('user')).type;
            this.setTags(this.$route);
            // 监听关闭当前页面的标签页
            bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if(item.path === this.$route.fullPath){
                        if(i < len - 1){
                            this.$router.push(this.tagsList[i+1].path);
                        }else if(i > 0){
                            this.$router.push(this.tagsList[i-1].path);
                        }else{
                            if(this.type=='2'){
                                 this.$router.push('/subIndex');
                            }else{
                                this.$router.push('/index');
                            }
                        }
                        this.tagsList.splice(i, 1);
                        break;
                    }
                }
            })
        }
    }

</script>
<style>
    .tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        background: #fff;
        padding: 2px;
        padding-right: 120px;
        border-top: 1px solid #ddd;
        /* box-shadow: 0 5px 10px #ddd; */
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 0 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 25px;
        box-sizing: border-box;
        line-height: 25px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;

        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    /* .tags-li:not(.active):hover {
        background: #f8f8f8;
    } */

    .tags-li.active {
        color: #fff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
    .breadcrumb,.el-breadcrumb__inner{
        color: #BBBBBB ;
    }
    .el-breadcrumb__item:last-child  .el-breadcrumb__inner:first-child{
        color: #267FF9 !important;
    }
</style>
