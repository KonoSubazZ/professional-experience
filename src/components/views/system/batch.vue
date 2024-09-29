 <template>
    <div class="container">
         <List 
            :dataUrl="'/manage/unit/system/systemSettings/batch'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :chooseBox='true'
            @create="open" >
        </List>
        <!-- 弹框 -->
        <el-dialog title="批次管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">

                        <el-form-item label="批次名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                            <el-checkbox v-model="form.defaultSetting">是否默认批次</el-checkbox>
                        </el-form-item>
                        
                        <el-form-item label="批次类型" prop='type' >
                            <el-select v-model="form.type" placeholder="请选择" class="w-100"> 
                                <el-option
                                v-for="item in options"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        

                        <el-form-item label="备注"  >
                            <el-input v-model="form.note" maxlength='200' type="textarea" :rows="2"></el-input>
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
           form:{
               defaultSetting:false
           },
           options:[],
           rules:{
               type: [{ required: true, message: '请选择', trigger: 'change' }],
               name: [{ required: true, message: '请输入', trigger: 'blur' }],

           }
        };
    },
    created() {
       this.metaList()
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
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/system/systemSettings/batch?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/batch`, res);
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
        //  save_mar(){
        //      this.loading()
        //      this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
        //     //  this.form.managerId = JSON.parse(localStorage.getItem("user")).info.id

        //      this.ax.post('/manage/unit/system/systemSettings/batch',this.form)
        //         .then(res=>{
        //             this.sloading()
        //             this.createModel = false
        //             this.bus.$emit(`flash_/manage/unit/system/systemSettings/batch`, res);
        //         })
        //          .catch(res => {
        //                     this.sloading();
        //                 });

        // },
         // 保存
         save_mar(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading()
                    this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                     this.ax.post('/manage/unit/system/systemSettings/batch',this.form)
                    .then(res=>{
                        this.sloading()
                        this.createModel = false
                        this.bus.$emit(`flash_/manage/unit/system/systemSettings/batch`, res);
                    })
                    .catch(res => {
                                this.sloading();
                            });
                }
             })
             

        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.Batch'}})
            .then(res=>{
                res.delete='DELETE'
                res.subs.map(it=>{
                    if(it.key=='createTime' || it.key == 'platformId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='type'){
                        it.name='批次类型'
                        this.options = it.searchOption
                        
                    }
                    if(it.key=='note'){
                        it.sort='10'
                    }
                })
                res.subs = res.subs.sort((a,b)=>{
                    return a.sort-b.sort
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
