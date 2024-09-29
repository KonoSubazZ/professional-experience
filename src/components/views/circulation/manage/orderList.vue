<template>
    <div class="container">
        <List
            :dataUrl="'/manage/unit/circulation/circulationManagement/documentAppointment'"
            :disableMeta="true"
            :tableMeta="meta"
             @selected='getChoose'
             :isHeaderHeigt='30'
            :chooseBox='true'
            ref="list"
        >
            <template slot="addition-actions" class="display_flex">
                  <el-button type="primary" plain icon="el-icon-download"  @click="allCall" >批量通知</el-button>
            </template>
            <template slot="addition-table-actions" slot-scope="scope">
                <el-button
                    type="primary"
                    size="text"
                    v-if="scope.item.row.documentAppointmentStatus == 'IN_PROGRESS'"
                    @click="Call(scope.item.row)"
                >设置条码</el-button>
                 <el-button
                    type="primary"
                    size="text"
                    v-if="scope.item.row.documentAppointmentStatus != 'CANCEL'"
                    @click="Calls(scope.item.row)"
                >通知</el-button>
                <el-button
                    type="primary"
                    size="text"
                    v-if="scope.item.row.documentAppointmentStatus == 'IN_PROGRESS'"
                    @click="del(scope.item.row.id)"
                >取消</el-button>
            </template>
        </List>
        <!-- 弹框 -->
        <el-dialog
            title="通知到书"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close" >
       
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="m-b-30">
                <el-form-item label="到书条码" prop="barCode">
                 
                    <el-select
                        filterable
                            v-model="form.barCode"
                            clearable
                            placeholder="请选择"
                            class="w-100"
                        >
                            <el-option 
                                v-for="items in codeList"
                                :key="items.id"
                                :label="items.barCode"
                                :value="items.barCode"
                            ></el-option>
                        </el-select>
                </el-form-item>

                <el-form-item label="到书时间" prop="arrivalTime">
                    <el-date-picker v-model="form.arrivalTime" :picker-options="pickerOptionStart" type="date"  value-format="timestamp" placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="应取书时间" prop="fetchTime">
                    <el-date-picker v-model="form.fetchTime" :picker-options="pickerOptionEnd" type="date"  value-format="timestamp" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar('form')">确 定</el-button>
            </span>
        </el-dialog>


          <!-- 弹框 -->
        <el-dialog title="通知到书条码" :visible.sync="allModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                        <div class="display_flex m-b-20">
                            <div class="label text_right">通知类型</div>
                            <div>文献到书通知</div>
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
                :data="chooseTable"
                style="width: 100%">
                <el-table-column
                    prop="readerNumber"
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
        <!-- 弹框 -->
        <el-dialog title="发送通知" :visible.sync="models" width="30%" :close-on-click-modal='false'  @close='close'>
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
                    <el-button @click="models = false">取 消</el-button>
                    <el-button type="primary" @click="save_mares('form')">发送通知</el-button>
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

            codeList:[],
            chooseTable:[],
            choose:{},
            allModel:false,
            createModel: false,
          
            models:false,
            form: {
                sendType:''
            },
            rules: {
                barCode: [{ required: true, message: '请选择', trigger: 'change' }],
                arrivalTime: [{ required: true, message: '请选择', trigger: 'change' }],
                fetchTime: [{ required: true, message: '请选择', trigger: 'change' }]
            },
          pickerOptionStart:{
            disabledDate: time => {
              let endDateVal = this.form.fetchTime
              if (endDateVal) {
                return time.getTime() > new Date(endDateVal).getTime()
              }
            }
          },
          pickerOptionEnd:{
            disabledDate: time => {
              let beginDateVal = this.form.arrivalTime
              if (beginDateVal) {
                return (
                    time.getTime() <
                    new Date(beginDateVal).getTime() - 860000
                )
              }
            }
          }
        };
    },
    created() {
        this.metaList();
    },
    methods: {
         getChoose(val){
            this.chooseTable = val
        },
        allCall(){
             if(this.chooseTable.length==0){
                return   this.$message.warning('请选择读者');
            }
            let pass = false
            this.chooseTable.map(it=>{
                if(it.documentAppointmentStatus=='CANCEL'){
                    pass=true
                }
            })
             if(pass){
                return   this.$message.warning('请不要选中已取消读者');
            }
            this.form.sendType = 1
            this.allModel =true
        },
        Calls(val){
            
            this.choose = val
            this.form.sendType = 1
            this.getInfo()
        },
        getInfo(){             
             this.ax.post('/manage/unit/circulation/circulationManagement/documentAppointmentForeseeSendContent', {documentAppointment:this.choose,sendType:this.form.sendType,platformId:JSON.parse(localStorage.getItem("user")).platform.id})
                .then(res=>{
                    // console.log(res)
                    this.form = res
                    this.models=true
                })
                
        },
        save_mars(){
             this.loading();
             let params ={
                documentAppointmentList:this.chooseTable,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                sendType:this.form.sendType
              }
               this.ax.post('/manage/unit/circulation/circulationManagement/documentAppointmentSendBatchContent', params)
                    .then(res => {
                        this.sloading();
                        this.$message.success('操作成功');
                        this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/documentAppointment`, res);
                        this.allModel=false
                    })
                    .catch(res=>{
                        this.sloading();
                    })
        },
         // 新增保存
        save_mares(formName) {
              if(this.form.sendType === 1 && !this.form.addresseeDetail){
                return this.$message.error('请先进行收件人配置')
              }
              if(this.form.sendType === 2 && !this.form.addresseeDetail){
                return this.$message.error('请先进行收信人配置')
              }
              let params ={
                documentAppointment:this.choose,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                sendType:this.form.sendType
              }
              this.$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/circulation/circulationManagement/documentAppointmentSendContent', params)
                            .then(res => {
                                this.sloading();
                                this.$message.success('操作成功');
                               this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/documentAppointment`, res);
                                 this.models=false
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
        // 新增保存
        save_mar(formName) {
          
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.form.type = 'NOTIFICATION'
            this.form.documentAppointmentId = this.form.id
           
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading();
                    this.ax
                        .post('/manage/unit/circulation/circulationManagement/documentAppointment', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/documentAppointment`, res);
                            this.createModel = false;
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
        // 修改
        editUpdate(e) {
            this.loading();
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.sloading();
            }, 500);
        },
        // 删除
        del(id) {
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.form.type = 'CANCEL'
            this.form.documentAppointmentId = id
                    this.loading();
                    this.ax
                        .post('/manage/unit/circulation/circulationManagement/documentAppointment', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('取消成功');
                            this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/documentAppointment`, res);
                            this.createModel = false;
                        })
                        .catch(res => {
                            this.sloading();
                        });
              
            
        },
        close() {
            this.form= {
                sendType:''
            }
             this.bus.$emit(`flash_/manage/unit/circulation/circulationManagement/documentAppointment`);
        },
        //获取通知的codeList
        getCodeList(bookBaseId){
            this.ax.get('/manage/unit/circulation/circulationManagement/documentAppointmentBarCode',
            {params:{bookBaseId,platformId:JSON.parse(localStorage.getItem('user')).platform.id}})
                .then(res=>{
                    this.codeList = res
                })
        },
        Call(val) {
            this.createModel = true;
            this.getCodeList(val.bookBaseId)
            this.form = val
            this.form.arrivalTime = new Date()
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.DocumentAppointment' } }).then(res => {
                res.insertable = false;
                res.edit = 'NONE';
                res.delete = 'NONE';
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId' || it.key == 'readerId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                });
                this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
