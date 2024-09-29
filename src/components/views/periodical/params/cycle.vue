 <template>
    <div class="container">
         <List 
            :dataUrl="'/manage/unit/journal/journalParameters/cycle'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            @create="open" >
        </List>
        <!-- 弹框 -->
        <el-dialog title="周期管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">

                        <el-form-item label="周期名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>
                        
                         <el-form-item label="册数"  >
                            <el-input v-model.number="form.number" maxlength='10' ></el-input>
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
import List from '../../../view/List'

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
               number: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字值'}],
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
            this.ax.delete('/manage/unit/journal/journalParameters/cycle?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/journal/journalParameters/cycle`, res);
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
            //  this.form.managerId = JSON.parse(localStorage.getItem("user")).info.id

             this.ax.post('/manage/unit/journal/journalParameters/cycle',this.form)
                .then(res=>{
                    this.sloading()
                    this.createModel = false
                    this.bus.$emit(`flash_/manage/unit/journal/journalParameters/cycle`, res);
                })
                 .catch(res => {
                            this.sloading();
                        });

        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.Cycle'}})
            .then(res=>{
               
                res.subs.map(it=>{
                    if(it.key=='createTime' || it.key == 'platformId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='type'){
                        this.options = it.searchOption
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
