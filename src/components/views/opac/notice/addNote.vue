<template>
    <div class="container">
        <div class="top_title m-b-30 display_flex between">
            <div class="title">馆内公告</div>
            <div class="display_flex" v-if="from==null">
                 <!-- <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div>
                 <div @click="save('ruleForm')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/saves.png" class="btn_img" />
                    <div class="f-s-14">保存(F8)</div>
                </div> -->
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-back' @click="back" >返回</el-button>
                                <el-button type="primary" plain icon="el-icon-collection"  @click="save('ruleForm')" >保存</el-button>
                    </el-button-group>
            </div>
        </div>
        <div class="padding_20">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="m-b-30">


                                    <el-form-item  prop="title"  class='w-100' >
                                        <div class="label">标题 </div>
                                        <el-input v-model="ruleForm.title" placeholder="请输入标题"  >
                                          
                                        </el-input>
                                    </el-form-item>

                                     <el-form-item    class='w-100' >
                                        <div class="label">内容</div>
                                        <view-editor  @func="getMsgFormSon" :parentMsg='ruleForm.content'></view-editor>
                                    </el-form-item>

                                     
                               
                </el-form>
        </div>
    </div>
</template>

<script>
import viewEditor from '../../../page/VueEditor'
export default {
    components:{
        viewEditor
    },
      props:{
        info:{}
    },
    data() {
        return {bus: this.bus(this),
            // 高度
            height:'',
            updata:false, //是否修改
            // 参数
            ruleForm:{
                communityId:'',
                content:'',
                title:''
            },
         
         options:[],
        //  规则
         rules:{
                        communityId: [
                          { required: true, message: '请选择名称', trigger: 'blur' },
                        ],
                         sort: [
                          { required: true, message: '请输入排序', trigger: 'blur' },
                         { type: 'number', message: '排序必须为数字值'}
                        ],
                         title: [
                          { required: true, message: '请输入描述', trigger: 'blur' },
                        ],
                                            
                },   
           // timer
            timer:false,
            screenWidth:''
        };
    },

    mounted () {
    const that = this
    window.onresize = () => {
        return (() => {
            window.screenWidth = document.body.clientHeight
            that.screenWidth = window.screenWidth
        })()
    }
    },
    watch: {
        screenWidth(val){
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if(!this.timer){
            // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
            this.screenWidth = val
            this.timer = true

            setTimeout(()=>{
                // 打印screenWidth变化的值
                 this.height = this.$height();
                //  // console.log(123)
                 this.timer = false
            },400)
        }
    }
    },
    created() {
        this.height=this.$height()
        // this.getAll()
        //// console.log(this.$route.query.id)
        if(this.$route.query.info){
            // this.getListData(this.$route.query.id)
           
            this.ruleForm = JSON.parse(this.$route.query.info)
             // console.log(this.ruleForm )
        }
    },
    methods: {
        // 获取content
        getMsgFormSon(data){
            this.ruleForm.content=data
        },
        // 新增保存
        save(formName){
           this.$refs[formName].validate((valid) => {
          if (valid) {
                     this.ruleForm.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                   this.ax.post('/manage/unit/opac/announcement/announcement',this.ruleForm)
                .then(res=>{
                    this.$message.success('保存成功');
                    this.ruleForm={
                            content:'',
                            title:''
                    }
                    this.bus.$emit(`flash_/manage/unit/opac/announcement/announcement`,res)
                    this.back()
                })
          } else {
             this.$message.error('请根据提示输入');
            return false;
          }
          });
       
        },
    }
    };
</script>

<style scoped>

</style>

