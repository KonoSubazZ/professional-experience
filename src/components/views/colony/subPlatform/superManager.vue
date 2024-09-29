<template>
    <div>
         <List
            :dataUrl="'/manage/united/subPlatform/platform'"
            :metaUrl="'/manage/united/subPlatform/meta'"
            @meta='metaList'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :chooseBox='true'
            @create="open_dia" >

            <template slot="addition-table-actions" slot-scope="scope">
                                      <el-button
                                        type="text"
                                        class="m-r-10"
                                        @click="init(scope.item.row)"
                                    >编辑初始管理员</el-button>
                                    <el-button
                                    v-if="isInternal"
                                        type="text"
                                        class="m-r-10"
                                        @click="getUrl(scope.item.row)"
                                    >生成平台登录地址</el-button>
                                     <el-button
                                        type="text"
                                        class="m-r-10"
                                        @click="getEndUrl(scope.item.row)"
                                    >生成硬件后台地址</el-button>
                                    <el-button
                                        type="text"
                                         class="m-r-10"
                                        @click="disa(scope.item.row)"
                                    >{{scope.item.row.status=='DISABLE'?'启用':'禁用'}}</el-button>
                                
            </template>

        </List>
        <!-- 弹框 -->
        <el-dialog title="子平台管理" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="80px" class=" m-b-30">
                    <el-form-item label="平台名称" prop='name' >
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>

                    <el-form-item label="联系电话"  prop='phone' >
                        <el-input v-model="form.phone" ></el-input>
                    </el-form-item>

                     <el-form-item label="平台标签" prop='label' >
                        <el-select v-model="form.label" placeholder="请选择" class="w-100">
                            <el-option v-for="item of labels" :key="item.key" :label="item.name" :value="item.key"></el-option>
                           
                        </el-select>
                    </el-form-item>


                    <el-form-item label="读者人数" v-if="form.id !=null && form.id !=''">
                        <el-input v-model="form.readerNumber"  disabled></el-input>
                    </el-form-item>

                    <el-form-item label="平台状态" prop='status' >
                        <el-select v-model="form.status" placeholder="请选择" class="w-100">
                            <el-option v-for="item of statues" :key="item.key" :label="item.name" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="过期时间"   v-if="isInternal">
                            <el-date-picker
                            clearable
                            class="w-50"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="timestamp"
                            v-model="form.expiredTime"
                            type="date"
                            placeholder="选择结束日期"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item label="平台logo" >
                       <upload class="upload" @getImg='getImg' :clear='false' :headImg='form.logo'></upload>
                    </el-form-item>

                     <el-form-item label="备注" >
                       <el-input v-model="form.note"  ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="save('form')">确 定</el-button>
                </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog title="初始化超级管理员" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">
                    <el-form-item label="管理员名称" prop='name' >
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>

                    <el-form-item label="登录账号"  prop='username' >
                        <el-input v-model="form.username" ></el-input>
                    </el-form-item>

                     <el-form-item label="登录密码" :prop='form.mobile == null?"password":""' >
                        <el-input v-model="form.password"  placeholder='如果修改密码请输入'></el-input>
                    </el-form-item>


                    <el-form-item label="手机号码" prop='phone'>
                        <el-input v-model="form.phone"  ></el-input>
                    </el-form-item>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 弹框 -->
        <el-dialog
            title="增值服务开通"
            :visible.sync="showServices"
            width="20%"
            :close-on-click-modal="false"
            @close="close"
        >
            <div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">短信</div>
                    <el-switch v-model="form.isSms" active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">邮件</div>
                    <el-switch v-model="form.isEmail" active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">PC端OPAC</div>
                    <el-switch v-model="form.isWebOPAC" active-text="开通"></el-switch>
                </div>
                 <div class="display_flex m-b-20">
                    <div class="w-40 text_center">手机端OPAC</div>
                    <el-switch v-model="form.isPhoneOPAC"  :disabled='form.isInternal'  active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">微信支付</div>
                    <el-switch v-model="form.isWeChat" active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">人脸认证</div>
                    <el-switch v-model="form.isFace" active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">人脸认证</div>
                    <el-switch v-model="form.isFace" active-text="开通"></el-switch>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-40 text_center">硬件</div>
                    <el-switch v-model="form.isHardwareBackground"   active-text="开通"></el-switch>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showServices = false">取 消</el-button>
                <el-button type="primary" @click="saves('form')">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog title="编辑设备登录密码" :visible.sync="showPwd" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">
                   

                     <el-form-item label="登录密码"  >
                        <el-input v-model="form.password"  ></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showPwd = false">取 消</el-button>
                    <el-button type="primary" @click="upPwd('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List'
import upload from '../../upLoad'
// import addAdmin from './addAdmin'
export default {
     components:{List,upload},
    data() {
        return {bus: this.bus(this),
           dialogFormVisible:false,
            createModel:false,
            showServices:false,
            isInternal:true,
           loadings:false,
           showPwd:false,
           form:{

           },
            rules: {
                 name: [{ required: true, message: '请输入', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入', trigger: 'blur' }],

                label: [{ required: true, message: '请选择', trigger: 'change' }],
               
                status: [{ required: true, message: '请选择', trigger: 'change' }],
               
                
     
                username: [{ required: true, message: '请输入', trigger: 'blur' }],
                password: [{ required: true, message: '请输入', trigger: 'blur' }],
                phone:[{ required: true, message: '请输入', trigger: 'blur' }],
                
            },
           
        //    label options
        labels:[],
        // status options
        statues:[]
        };
    },
    created() {
       this.getInfo()
    },
    methods: {
        getInfo(){
            this.ax.get('/login/user')
                .then(res=>{
                    // console.log(res.isInternal)
                    this.isInternal = res.isInternal
                })
        },
        getUrl(val){
            this.ax.get('/manage/united/subPlatform/platformLoginUrl',{params:{platformId:val.id}})
                .then(res=>{
                    this.$alert(res, '', {
                    confirmButtonText: '确定',
                    });
                })
        },
        getEndUrl(val){
             this.ax.get('/manage/united/subPlatform/hardwareBackgroundUrl',{params:{platformId:val.id}})
                .then(res=>{
                    this.$alert(res, '', {
                    confirmButtonText: '确定',
                    });
                })
        },
        // save（）
         // 新增保存
        save(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.ax
                        .post('/manage/united/subPlatform/platform', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/united/subPlatform/platform`, res);
                            this.dialogFormVisible = false
                            this.close()
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
        upPwd(formName){
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.ax
                        .post('/manage/united/subPlatform/platform', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/united/subPlatform/platform`, res);
                            this.showPwd = false
                            this.close()
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
        saves(){
            //  this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
             this.ax.post('/manage/united/subPlatform/platform', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/united/subPlatform/platform`, res);
                             this.showServices=false
                            this.close()
                        })
                        .catch(res => {
                            this.sloading();
                        });
        },
        // 关闭
        close(){
             this.form={
                 logo:''
             }
        },
        // 修改
        editUpdate(e){
            // console.log(e.key=='pwd')
            if(e.key=='pwd'){
                this.form = e.value[0]
                this.showPwd=true
            }else if(e.key=='serve'){
                this.form = e.value[0]
                this.showServices=true
            }
            else{
                 this.form = e[0]
                 this.dialogFormVisible=true
            }
            // this.loadings = true
            // this.form = e[0]
            // this.dialogFormVisible=true
            // setTimeout(res=>{
            //      this.loadings = false
            // },500)
        },
        // 获取图片
        getImg(e){
            // console.log(e)
            this.form.logo=e
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            this.ax.delete('/manage/united/subPlatform/platform?ids='+e[0].id)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/united/subPlatform/platform`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
       open_dia(){
           this.dialogFormVisible=true
       },
    //    初始化管理
       init(e){
           
           this.loading()
           this.ax.get('/manage/united/subPlatform/superManager',{params:{platformId:e.id}})
            .then(res=>{
                 
                 res.username = res.mobile
                 this.form = res
                 this.createModel = true
                 this.sloading()
            })
           .catch(res=>{
                     this.sloading()
                })
       },
    //    保存
        save_mar(){
             this.loading()
             this.ax.post('/manage/united/subPlatform/superManager',this.form)
                .then(res=>{
                    this.sloading()
                    this.createModel = false
                  
                })
                 .catch(res => {
                            this.sloading();
                        });

        },
       disa(e){
         
        this.$confirm('是否确认禁用或者启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // // console.log(e)
               this.loading();
            this.form = e
            if( this.form.status == 'DISABLE'){
                   this.form.status = 'ENABLE'
            }else{
                    this.form.status ='DISABLE'
            }
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.ax
                        .post('/manage/united/subPlatform/platform', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/united/subPlatform/platform`, res);
                            this.dialogFormVisible = false
                            this.close()
                        })
                        .catch(res => {
                            this.sloading();
                        });

        }).catch((res) => {
            // console.log(res)
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
       },
        metaList(val){
            // // console.log(val)
            setTimeout(() => {
                val.subs.map(it=>{
                // if(it.key=='createTime'){
                //     it.searchable = false
                //     it.displayInList=false
                // }
                if(it.key=='label'){
                      this.labels = it.searchOption
                }
                if(it.key=='status'){
                    this.statues =  it.searchOption
                }
               
            })
            
            //    // console.log(this.isInternal)
           if(this.isInternal){
            
                    val.subs = val.subs.concat([
                         {name:'过期时间',key:'expiredTime',displayInList:true,type: "TIMESTAMP"},
                        {name:'增值服务',key:'serve',displayInList:true,btn:true},
                       
                    ])
            }
               val.subs = val.subs.concat([
                        {name:'设备登录密码',key:'pwd',displayInList:true,btn:true}
            ])
            }, 200);
          
        },
    }
};
</script>

<style>

</style>
