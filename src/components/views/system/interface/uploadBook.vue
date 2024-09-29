<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>新数据文件上传导入</div>
                <div class="display_flex">
                    <!-- <div class="cursor text_center m-r-20" @click="submitUpload">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">确定</div>
                    </div> -->
                     <el-button type="primary" @click="submitUpload('form')" >上传</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" ref="form" :rule = rules :list="list" :model='form' @getForm="getForm"></form-data>
                <div class="display_flex padding_20">
                    <div class="el-form-item__label " style="width:150px">MARC</div>
                    <el-input v-model="input" class="w-30 m-r-20" disabled ></el-input>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/manage/unit/system/dataReceive/uploadNewFile"
                        :on-change='uploadBefore'
                        :show-file-list='false'
                        :data='form'
                        :headers='headers'
                        :on-success="handleAvatarSuccess"
                        :file-list="fileList"
                        :before-upload="beforeAvatarUpload"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </div>
                <!-- <div class="set">
                    <el-button type="primary" @click="jump" class>报表导出格式设置</el-button>
                </div> -->
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
            list: [
                { name: 'MARC类型', id: 'marcTypeDetailId',relation:'marcTypeDetailName' ,type:'select',options:[]},

                { name: '文件编码', id: 'enCoding',type:'select',options:[
                    {name:'GB2312',id:'GB2312'},
                    {name:'GBK',id:'GBK'},
                    {name:'GB18030',id:'GB18030'},
                    {name:'UTF-8',id:'UTF-8'}
                ] },
                // { name: 'MARC', id: 'accessKeyId' },
            ],
             rules:{
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                batchId: [{ required: true, message: '请选择', trigger: 'change' }],
                marcTypeDetailId: [{ required: true, message: '请选择', trigger: 'change' }],
                deliveryUnitId: [{ required: true, message: '请选择', trigger: 'change' }],
                enCoding: [{ required: true, message: '请选择', trigger: 'change' }]
            },
            form: {
              enCoding:'GB18030',
              marcTypeDetailId: null,
              marcTypeDetailName: 'CNMARC-图书'
            },
             headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
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
        this.getType()
    },  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getForm(val){
            this.form =val
        },
        getType(){
        this.loading()
            this.ax.get('/manage/unit/system/dataReceive/marcTypeDetail',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                  this.sloading()
                    this.list[0].options = res.content
                    this.form.marcTypeDetailId = res.content[0].id
                }).catch(err=>{
              this.sloading()
            })
        },
        uploadBefore(val){
            // console.log(val.name.indexOf('.ISO'))
            if(val.name.indexOf('.iso')==-1 && val.name.indexOf('.ISO')==-1){
                return this.$message.error('文件类型错误');
            }
            this.input =val.name
        },
         submitUpload(formName) {
        this.$refs[formName].$refs[formName].validate(valid => {
                    if (valid) {
                         this.$refs.upload.submit();
                    }else{

                    }
         })
       },
        beforeAvatarUpload(){
            this.loading()
        },
        handleAvatarSuccess(val){
            this.sloading()
            this.form.name=this.input
            this.$router.push({
                path:'uploadBook/copyImport',
                query:{info:JSON.stringify(this.form),marc:JSON.stringify(val.data)}
            })
        },
    }
};
</script>

<style scoped >

</style>
