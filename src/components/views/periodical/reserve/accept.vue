<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>预定数据上传</div>
                <div class="display_flex">
                   <el-button type="primary" @click="submitUpload('form')">确定</el-button>
                    <!-- <div class="cursor text_center m-r-20" @click="submitUpload">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">确定</div>
                    </div> -->
                </div>
            </div>
            <div class="padding_20">
                <div class="display_flex w-100 start">
                     <form-data :row="1" :list="list" ref="form" :model='form' @getForm="getForm" :rule = rules class="w-90"></form-data>

                     <div class="w-10">
                        <div class="add_btn cursor m-b-100" @click="openBatch">+</div>

                        <div class="add_btn cursor" @click="openUnit">+</div>
                     </div>
                </div>
                <div class="display_flex padding_20">
                    <div class="el-form-item__label " style="width:150px">MARC</div>
                    <el-input v-model="input" class="w-30 m-r-20" disabled ></el-input>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/manage/unit/journal/journalBooking/journalBaseFile"
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

             <el-dialog
                 width="30%"
                :title="'新增批次'"
                :visible.sync="innerVisible"
                :close-on-click-modal='false'
                >    
                <el-form :model="forms"  ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="批次名称" prop='name' >
                            <el-input v-model="forms.name" ></el-input>
                            <el-checkbox v-model="forms.defaultSetting">是否默认</el-checkbox>
                        </el-form-item>

                        <el-form-item label="备注"  >
                            <el-input v-model="forms.note" maxlength='200' type="textarea" :rows="2"></el-input>
                        </el-form-item>
                       
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBatch('form')" >确 定</el-button>
                   
                </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog title="供货单位添加" :visible.sync="createModel" width="40%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">
                    
                        <el-form-item label="供货单位名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>

                         <el-form-item label="联系人" prop='contactPerson' >
                            <el-input v-model="form.contactPerson" ></el-input>
                        </el-form-item>

                         <el-form-item label="电话" prop='phone' >
                            <el-input v-model="form.phone" ></el-input>
                        </el-form-item>

                         <el-form-item label="邮箱" prop='mailbox' >
                            <el-input v-model="form.mailbox" ></el-input>
                        </el-form-item>

                         <el-form-item label="备注" prop='note' >
                            <el-input v-model="form.note" ></el-input>
                        </el-form-item>
                       
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
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

                  { name: '批次号', id: 'batchId',relation:'batchName' ,type:'select',options:[]},

                 { name: 'MARC类型', id: 'marcTypeDetailId',relation:'marcTypeDetailName' ,type:'select',options:[]},

                 { name: '供货单位', id: 'deliveryUnitId',relation:'deliveryUnit' ,type:'select',options:[]},

                

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
            form: {},
             headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            input:'',
            forms:{},
            innerVisible:false,
            createModel:false,
           
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
        this.getUnit()
        this.getBatch()
    },  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        openBatch(){
            this.innerVisible =true
        },
        openUnit(){
             this.createModel =true
        },
        close(){},
         // 保存
        save_mar() {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax
                .post('/manage/unit/general/deliveryUnit', this.form)
                .then(res => {
                    this.sloading();
                    this.createModel = false;
                    this.getUnit()
                })
                .catch(res => {
                    this.sloading();
                });
        },
        addBatch(){
            this.forms.type='BOOKING'
            this.ax.post('/manage/unit/general/batch',this.forms)
                .then(res=>{
                    if(this.forms.defaultSetting){
                        this.form.batchId = res.id
                        this.form.batchName = res.name
                    }
                    this.innerVisible =false
                    this.getBatch()
                })
        },
        getForm(val){
            this.form =val
        },
        getBatch(){
            this.ax.get('/manage/unit/report/journalReport/journalBookingBatch',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    this.list[0].options = res.content
                })
        },
        getUnit(){
            this.ax.get('/manage/unit/report/journalReport/journalDeliveryUnit',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    this.list[2].options = res.content
                })
        },
        getType(){
            this.ax.get('/manage/unit/journal/journalBooking/marcTypeDetail',{params:{size:999,marcType:'JOURNAL',platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{    
                    // console.log(res)
                     this.list[1].options = res.content.map(it=>{
                        let arr = {
                            id:it.id,
                            name:it.name
                        }
                        return arr
                    })
                })
        },
        uploadBefore(val){
             if(val.name.indexOf('.iso')==-1 && val.name.indexOf('.ISO')==-1){
                return this.$message.error('文件类型错误');
            }
            this.input =val.name
          
        },
        submitUpload(formName) {
        //   if(){}
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
                // console.log(val)
            this.sloading()
            this.form.name=this.input
            this.$router.push({
                path:'show/copyImport',
                query:{info:JSON.stringify(this.form),marc:JSON.stringify(val.data)}
            })
        },
    }
};
</script>

<style scoped >
 .add_btn{
    width:1rem;
    height:1rem;
    background:rgba(38,127,249,1);
    border-radius:3px;
    color: #fff;
    text-align: center;
    line-height: 0.9rem;
    /* margin-bottom: 18px; */
    margin-top: 15px;
}
</style>
