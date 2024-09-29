<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>文献流通导入</div>
                <div class="display_flex">
                  
                     <el-button type="primary" @click="submitUpload('form')" >确定</el-button>
                </div>
            </div>
            <div class="padding_20">
                <div class="display_flex padding_20">
                    <div class="el-form-item__label " style="width:150px">文件数据</div>
                    <el-input v-model="input" class="w-30 m-r-20" disabled ></el-input>
                    <el-upload
                        class="upload-demo m-r-30"
                        ref="upload"
                        action="/manage/unit/system/dataReceive/borrowInformationImport"
                        :on-change='uploadBefore'
                        :show-file-list='false'
                        :data='form'
                        :headers='headers'
                        :on-success="handleAvatarSuccess"
                        :file-list="fileList"
                        :before-upload="beforeAvatarUpload"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-button class="m-b-5" size="small" @click="down" type="primary">下载模板</el-button>
                </div>
                <div class="padding_20">
                    
                </div>
            </div>
        </div>

     
    </div>
</template>

<script>
import formData from '../../../view/form';

export default {
    components: {
        formData
    },
    data() {
        return {bus: this.bus(this),
           
             headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            form: {},
            input:'',
            fileList:[],
            height: ''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        down(){
            this.ax.get('/manage/unit/system/dataReceive/borrowInformationTemplate')
                .then(res=>{
                  this.FileSaver(res,res)
                })
        },
        uploadBefore(val){
            if(val.name.indexOf('.xls')==-1 && val.name.indexOf('.XLS')==-1){
                return this.$message.error('文件类型错误');
            }
            this.input =val.name
        },
        submitUpload(formName) {
            this.$refs.upload.submit();
       },
        beforeAvatarUpload(){
            this.loading()
        },
        handleAvatarSuccess(val){
            this.sloading()
            if(val.code==200){
                this.$message.success('上传成功');
               if(val.data){
                    this.FileSaver(val.data,val.data)
               }
            }else{
                this.$message.error(val.msg);
            }
        },
    }
};
</script>

<style scoped >

</style>
