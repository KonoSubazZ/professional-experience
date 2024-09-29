<template>
    <div class="container">       
            <List
                :dataUrl="'/manage/unit/circulation/circulationManagement/borrowingInformation'"
                :disableMeta="true"
                :tableMeta="meta"
                @selected='getChoose'
                :chooseBox='true'
                ref="list"
               
            >

             <template slot="addition-table-actions" slot-scope="scope">
                <el-button
                    type="primary"
                    size="text"
                    @click="Call(scope.item.row)"
                >通知</el-button>
              
            </template>
              <template slot="addition-actions" class="display_flex">
                <el-button
                    @click="managerClick"
                    type="primary"
                    plain
                >延期归还</el-button>

              </template>
             <template slot="addition-actions" class="display_flex">
                  <el-button type="primary" plain icon="el-icon-download"  @click="allCall" >批量通知</el-button>
            </template>
            </List>

      <!-- 延期时间弹框 -->
      <el-dialog title="延期时间" :visible.sync="delayTimeModel" width="30%" :close-on-click-modal='false'  @close='close'>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">

          <el-form-item label="选择时间" prop='delaytimes' >
            <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="form.delaytimes"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="delayTimeModel = false">取 消</el-button>
                    <el-button type="primary" @click="submitDelay('form')">确定</el-button>
                </span>
      </el-dialog>

        <!-- 弹框 -->
        <el-dialog title="发送通知" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                        <div class="display_flex m-b-20">
                            <div class="label text_right">通知类型</div>
                            <div>文献归还通知</div>
                        </div>

                        <el-form-item label="选择通知方式" prop='sendType' >
                            <!-- <el-input v-model="form.sendType" ></el-input> -->
                            <el-radio-group v-model="form.sendType" @change="getInfo">
                                <el-radio :label='1'>邮件</el-radio>
                                <el-radio :label='2'>短信</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item :label="form.sendType==1?'收件人':'收信人'" prop='addressee' >
                            <el-input v-model="form.addressee" disabled ></el-input>
                        </el-form-item>

                        <el-form-item :label="form.sendType==1?'收件人邮箱':'收信人电话'" prop='addresseeDetail' >
                            <el-input v-model="form.addresseeDetail"  disabled></el-input>
                        </el-form-item>

                        <el-form-item label="邮件标题" v-if='form.sendType==1'>
                            <el-input v-model="form.title" disabled ></el-input>
                        </el-form-item>

                        <el-form-item :label="form.sendType==1?'邮件内容':'短信内容'">
                            <el-input v-model="form.content" disabled :rows="4" type="textarea"  ></el-input>
                        </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')" :disabled="sendDisabled">发送通知</el-button>
                </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog title="批量发送通知" :visible.sync="allModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                        <div class="display_flex m-b-20">
                            <div class="label text_right">通知类型</div>
                            <div>文献归还通知</div>
                        </div>

                        <el-form-item label="选择通知方式" prop='sendType' >
                            <!-- <el-input v-model="form.sendType" ></el-input> -->
                            <el-radio-group v-model="form.sendType" >
                                <el-radio :label='1'>邮件</el-radio>
                                <el-radio :label='2'>短信</el-radio>
                            </el-radio-group>
                        </el-form-item>
                </el-form>

                <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="barCode"
                    label="读者证号"
                    >
                </el-table-column>
                <el-table-column
                    prop="readerName"
                    label="姓名"
                    >
                </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="allModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mars">发送通知</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            allModel:false,
            createModel:false,
            delayTimeModel:false,
            choose:{},
            tableData:[],
            form:{
                sendType:1,
              addresseeDetail:''
            },
          sendDisabled:false,
             rules:{
               code: [{ required: true, message: '请输入', trigger: 'blur' }],
                note: [{ required: true, message: '请输入', trigger: 'blur' }],
               name: [{ required: true, message: '请输入', trigger: 'blur' }],
               delaytimes: [{ required: true, message: '请选择延期时间', trigger: 'change' }],
           },
          pickerOptions:{
            disabledDate(v){
              return v.getTime()< new Date().getTime();
            }
          }
        };
    },
  computed:{
    // delayShow(){
    //   if(JSON.parse(localStorage.getItem("user")).type==1||
    //       JSON.parse(localStorage.getItem("user")).type==2
    //   ){
    //     return true
    //   }else {
    //     return false
    //   }
    // }
  },
    created() {
        this.metaList();
    },
    methods: {
        getChoose(val){
            this.tableData = val
        },
        Call(val){
            
            this.choose = val
            this.getInfo()
        },
        close(){},
        getInfo(){            
             this.ax.post('/manage/unit/circulation/circulationManagement/borrowingInformationForeseeSendContent', {borrowingInformationOverdueRes:this.choose,sendType:this.form.sendType,platformId:JSON.parse(localStorage.getItem("user")).platform.id})
                .then(res=>{
                    // console.log(res)
                    this.form = res
                  if(this.form.addresseeDetail==null||this.form.addresseeDetail==''){
                    this.sendDisabled = true
                  }else {
                    this.sendDisabled = false
                  }
                    this.createModel=true
                })
        },
        allCall(){
            if(this.tableData.length==0){
                return   this.$message.warning('请选择读者');
            }
            this.allModel =true
        },
      managerClick(){
        if(this.tableData.length==0){
          return   this.$message.warning('请选择读者');
        }
          this.delayTimeModel = true;
      },
        // // 导出
        // save(){
        //     let params= this.searchInfo
        //     params.borrowType=1
        //     this.ax.get('/manage/unit/circulation/borrowingInformationInquire/exportBorrowingInformationBorrowFalse/excel',params)
        //         .then(res=>{
        //             this.FileSaver.saveAs(res,"数据导出.xlsx")
        //         })
        // },
      submitDelay(form){
        let params ={
          borrowingInformationOverdueResList:this.tableData,
          platformId:JSON.parse(localStorage.getItem("user")).platform.id,
          borrowAlso:this.form.delaytimes
        }
        this.$refs[form].validate(valid => {
          if (valid) {
            this.loading();
            this.ax
                .post('/manage/unit/circulation/circulationManagement/batchRenew', params)
                .then(res => {
                  console.log(111,res)
                  this.sloading();
                  this.$message.success('操作成功');
                  this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/borrowingInformation`, res);
                  this.delayTimeModel=false
                })
                .catch(res => {
                  this.sloading();
                });
          } else {
            this.sloading();
            this.$message.error('请根据提示输入');
            return false;
          }
        });

      },
        save_mars(){
             this.loading();
             let params ={
                borrowingInformationOverdueResList:this.tableData,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                sendType:this.form.sendType
              }
               this.ax.post('/manage/unit/circulation/circulationManagement/borrowingInformationSendBatchContent', params)
                    .then(res => {
                        this.sloading();
                        this.$message.success('操作成功');
                        this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/borrowingInformation`, res);
                        this.allModel=false
                    })
                    .catch(res=>{
                        this.sloading();
                    })
        },
         // 新增保存
        save_mar(formName) {

            
              let params ={
                borrowingInformationOverdueRes:this.choose,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                sendType:this.form.sendType
              }
              this.$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/circulation/circulationManagement/borrowingInformationSendContent', params)
                            .then(res => {
                                this.sloading();
                                this.$message.success('操作成功');
                                 this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/borrowingInformation`, res);
                                 this.createModel=false
                            })
                            .catch(res => {
                                this.sloading();
                            });
                    } else {
                        this.sloading();
                        this.$message.error('请根据提示输入');
                        return false;
                    }
            });
        },
        close(){
            this.form={
                sendType:1
            }
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.BorrowingInformation' } }).then(res => {
                res.insertable = false
                res.edit ='NONE'
                res.delete='NONE'
                res.export='EXPORT'
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'readerId' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if(it.key=='positiveTitle'){
                        it.name="题名"
                        it.searchable = false;
                        it.displayInList=true
                    }
                    if( it.key=='barCode' || it.key=='borrow'){
                         it.searchable = false;

                    }
                    if( it.key == 'readerName'){
                         it.searchable = true;
                    }
                    if(it.key=='borrowBookTime'){
                        it.displayInList=false
                    }
                });
                res.subs.push({
                    key:'beyondNumber',
                    name:'超期天数',
                    displayInList:true,
                   
                })
                 res.subs.push({
                    key:'overdueNumber',
                    name:'超期天数',
                  
                     searchable : true
                })
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>
<style>
.el-picker-panel__footer .el-button--text{
  display: none !important;
}
</style>
<style scoped>
.text_right{
    text-align: right;
}
.label{
    width:100px;
    padding-right: 10px;
    box-sizing: border-box;
}

</style>
