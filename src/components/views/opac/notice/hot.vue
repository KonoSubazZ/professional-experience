 <template>
    <div >

         <List 
            :dataUrl="'/manage/unit/opac/announcement/hotSearch'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            :chooseBox='true'
            @delete='deleteUpdate'
            @create="jump" >
        </List>
        <!-- 弹框 -->
        <el-dialog
            title="热门设置"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close"
        >
            <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="m-b-30">
                 <el-form-item label="热门内容" prop="content">
                    <el-input v-model="form.content" maxlength="200"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model.number="form.sort" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
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
           form:{},
           rules:{
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                        ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                    { type: 'number', message: '排序必须为数字值'}
                ],
           },
           createModel:false
        };
    },
    created() {
       this.metaList()
    },
    methods: {
        // 修改
        editUpdate(e){
                // // console.log(e)
                // this.$router.push({
                //     path:'index/addNote',
                //     query:{info:JSON.stringify(e[0])}
                // })
        },
        jump(){
            // this.$router.push('index/addNote')
            this.createModel =true
        },
        close(){
            this.form = {}
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/opac/announcement/hotSearch?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/announcement/hotSearch`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
         // 新增保存
        save(formName){
           this.$refs[formName].validate((valid) => {
          if (valid) {
                     this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                   this.ax.post('/manage/unit/opac/announcement/hotSearch',this.form)
                .then(res=>{
                    this.$message.success('保存成功');
                    this.form={
                            content:'',
                            sort:''
                    }
                    this.bus.$emit(`flash_/manage/unit/opac/announcement/hotSearch`,res)
                    this.createModel=false
                })
          } else {
             this.$message.error('请根据提示输入');
             return false;
          }
          });
       
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.HotSearch'}})
            .then(res=>{
               
                res.subs.map(it=>{
                    if(  it.key == 'platformId' || it.key == 'createTime'){
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
