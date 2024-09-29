<template>
    <div >
        <!-- fun getInfo  获得信息-->
        <!-- prop  url-地址  clear-是否清空  show-展示上传    types-类型 -->
                 <!-- 弹框 -->
        
               <div class="margin_center ">
                   <el-upload
                    class="m-b-20"
                    ref="upload"
                    drag
                    :action="src"
                    :auto-upload='false'
                    :data='data'
                    :file-list="fileList"
                    :before-upload='isText'
                    :on-success="handleAvatarSuccess"
                    :headers='headers'
                   >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>,仅支持TXT文件</div>
                </el-upload>
                <div class="display_flex start between ">
                    <div class="display_flex w-80">
                        <div class="upTitle w-30 m-r-10">是否提示错误条码:</div>
                        <el-radio-group v-model="data.cover" class="w-60">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="cursor color_par w-20" @click="upload">开始导入</div>
                </div>
               </div>
                
  
    </div>
</template>

<script>
import bus from '../common/bus'
export default {
     props:{
         url:'',
         clear:'',
         headImg:'',
         types:'',
         show:''
     },
    data() {
        return {bus: this.bus(this),
            loading:false,
            clearFiles:false,
            src:'/other/text',
            data:{},
            img:'',
            type:1,
            headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            fileList:[],
            upName:''
        };
    },
    created() {
        // //// console.log(this.url)
        if(this.url!==undefined){
            this.src=this.url
        }
        if(this.types!==undefined){
            this.type=this.types
        }
        if(this.headImg){
              this.img = this.headImg
        }

    },
    watch:{
        headImg(val){
             this.img = val
             //// console.log(val)
        },
        clear(){
            if(this.clear){
                this.img=''
            }
        },
    },
    mounted() {
         bus.$on('clearImg',()=>{
             //// console.log(123)
             this.fileList =[]
         })
    },
    methods: {
        // 开始上传
        upload(){
            this.$refs.upload.submit();
        },
        handleAvatarSuccess(res, file){
                // // console.log(res)
                this.fileList=[]
                let params={
                    cover:this.data.cover,
                    data:res.data
                }
                 this.loading=false
                 this.$emit('getInfo', params);

        },
        isText(file){
             this.loading=true
             //// console.log(file)
            let name=file.name       
            // if(this.upName == file.name ){
            //      this.loading=false
            //      this.$message.warning('重复上传')
            //     return false
            // }
            this.upName = file.name             
            let pass = name.indexOf('.txt')!==-1 
            if(!pass){
            this.$message.warning('上传文件类型错误')
             this.loading=false
            return false
            }
           
        },
    }
};
</script>

<style scoped>
.margin_center{
    text-align: center;
}
</style>
