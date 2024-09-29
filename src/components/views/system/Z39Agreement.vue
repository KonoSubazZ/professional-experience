<template>
    <div>
         <List 
            :dataUrl="'/manage/unit/system/systemSettings/marcDatabase'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :delAll='true'
            :chooseBox='true'
            @create="open" >
        </List>
        <!-- 弹框 -->
        <el-dialog title="Z39.50管理" :visible.sync="createModel" width="50%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="130px" class=" m-b-30">
                    <div class="display_flex between">
                        <el-form-item label="服务器名字" prop='serviceName' class="w-50">
                            <el-input v-model="form.serviceName" ></el-input>
                        </el-form-item>
                        <el-form-item label="国家" prop='country' class="w-50">
                            <el-input v-model="form.country" ></el-input>
                        </el-form-item>
                    </div>

                    <div class="display_flex between">
                        <el-form-item label="服务器地址" prop='hort' class="w-50">
                            <el-input v-model="form.hort" ></el-input>
                        </el-form-item>
                        <el-form-item label="端口号" prop='portNumber' class="w-50">
                            <el-input v-model="form.portNumber" ></el-input>
                        </el-form-item>
                    </div>

                    <div class="display_flex between">
                        <el-form-item label="验证类型" prop class="w-50">
                            <el-input v-model="form.syntax" ></el-input>
                        </el-form-item>
                        <el-form-item label="字符集" prop class="w-50">
                            <el-input v-model="form.charset" ></el-input>
                        </el-form-item>
                    </div>

                    <div class="display_flex between">
                        <el-form-item label="用户名" prop='username' class="w-50">
                            <el-input v-model="form.username" ></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop='password'  class="w-50">
                            <el-input v-model="form.password" type='password' ></el-input>
                        </el-form-item>
                    </div>

                    <div class="display_flex between">
                        <el-form-item label="数据库" prop='databaseName' class="w-50">
                            <el-input v-model="form.databaseName" ></el-input>
                        </el-form-item>
                        <el-form-item label="图书MARC类型" prop='marcTypeDetailBookId' class="w-50">
                            <el-select v-model="form.marcTypeDetailBookId" filterable placeholder="请选择" class="w-100">
                                <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="display_flex between">
                        
                        <el-form-item label="期刊MARC类型" prop='marcTypeDetailJournalId' class="w-50">
                            <el-select v-model="form.marcTypeDetailJournalId" filterable placeholder="请选择" class="w-100">
                                <el-option
                                v-for="item in option"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'',
           loadings:false,
           createModel:false,
           form:{},
           rules:{
               serviceName: [{ required: true, message: '请输入', trigger: 'blur' }],
               country: [{ required: true, message: '请输入', trigger: 'blur' }],
               hort: [{ required: true, message: '请输入', trigger: 'blur' }],
               portNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
               syntax: [{ required: true, message: '请输入', trigger: 'blur' }],
               charset: [{ required: true, message: '请输入', trigger: 'blur' }],
               username: [{ required: true, message: '请输入', trigger: 'blur' }],
               password: [{ required: true, message: '请输入', trigger: 'blur' }],
               databaseName: [{ required: true, message: '请输入', trigger: 'blur' }],
                marcTypeDetailBookId:[{ required: true, message: '请选择', trigger: 'change' }],
               marcTypeDetailJournalId:[{ required: true, message: '请选择', trigger: 'change' }],
           },
           options:[],
            option:[]
        };
    },
    created() {
       this.metaList()
       this.getOPtions()
       this.getOPtion()
    },
    methods: {
        // 修改
        editUpdate(e){
            this.loadings = true
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                 this.loadings = false
            },500)
            
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            this.ax.delete('/manage/unit/system/systemSettings/marcDatabase?ids='+e[0].id)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcDatabase`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(){
            this.createModel = true
            
        },
        // 
        close(){
            this.form={}
        },
        // 保存
         save_mar(){
             this.loading()
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
             this.ax.post('/manage/unit/system/systemSettings/marcDatabase',this.form)
                .then(res=>{
                    this.sloading()
                    this.createModel = false
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcDatabase`, res);
                })
                 .catch(res => {
                            this.sloading();
                        });

        },
        getOPtions(){
            this.ax.get('/manage/unit/system/systemSettings/marcTypeDetailForInsertMarcDatabase',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType:'BOOK'}})
                .then(res=>{
                    // console.log(res)
                    this.options = res.content
                })
        },
         getOPtion(){
            this.ax.get('/manage/unit/system/systemSettings/marcTypeDetailForInsertMarcDatabase',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType:'JOURNAL'}})
                .then(res=>{
                    // console.log(res)
                    this.option = res.content
                })
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.MarcDatabase'}})
            .then(res=>{
                res.delete='DELETE'
                res.subs.map(it=>{
                    if(it.key=='createTime'|| it.key == 'platformId' || it.key=='password'){
                        it.displayInList=false
                        it.searchable=false
                    }
                })
                 // console.log(res)
                this.meta = res
            })
        },
    }
};
</script>

<style>

</style>
