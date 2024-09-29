 <template>
    <div>
        <List
            :dataUrl="'/manage/unit/opac/externalLinkSettings/externalLink'"
            :disableMeta="true"
            :tableMeta="meta"
            ref="list"
            @edit='edit'
            @delete='deleteUpdate'
            :chooseBox='true'
            @create='open'
        >
            <!-- <template slot="addition-actions">
                <div class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/addReader.png" class="btn_img" />
                    <div class="f-s-14">批量抓取</div>
                </div>
            </template>-->
        </List>

         <!-- 弹框 -->
        <el-dialog title="链接管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">

                        <el-form-item label="图片"  >
                            <up-load @getImg='getImg' :fileFormat="'.png, .jpg, .jpeg'" :headImg='form.photo'></up-load>
                        </el-form-item>

                        <el-form-item label="标题" prop='title' >
                            <el-input v-model="form.title" ></el-input>
                        </el-form-item>

                        <el-form-item label="链接"  prop='linkUrl'>
                            <el-input v-model="form.linkUrl" maxlength='200' ></el-input>
                        </el-form-item>

                        <el-form-item label="排序"  prop='sort'>
                            <el-input v-model="form.sort" maxlength='200' ></el-input>
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
import List from '../../../view/List';
import upLoad from '../../upLoad'
export default {
    components: { List,upLoad },
    data() {
        return {bus: this.bus(this),
            meta: '',
            
            createModel: false,
            form: {
                photo:'',
                linkUrl:'',
                title:''
            },
           
            rules: {
                type: [{ required: true, message: '请选择', trigger: 'change' }],
                title: [{ required: true, message: '请输入', trigger: 'blur' }],
                 sort: [{ required: true, message: '请输入', trigger: 'blur' }],
                linkUrl: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.metaList();
    },
    methods: {
        edit(val){
            // this.loading()
            // console.log(val)
            this.createModel=true
            this.form = val[0]
        },
        // open
        open(){
            this.createModel = true
        },
        close(){
            this.form={}
        },
        getImg(val){
            // console
            this.form.photo = val
        },
                 // 删除
        deleteUpdate(e){
            console.log(e)
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/opac/externalLinkSettings/externalLink?ids='+ids)
                .then(res=>{
                    this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/externalLinkSettings/externalLink`, res);
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
              this.loading()
                     this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                   this.ax.post('/manage/unit/opac/externalLinkSettings/externalLink',this.form)
                .then(res=>{
                    this.$message.success('保存成功');
                    this.form={}
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/externalLinkSettings/externalLink`, res);
                    // this.back()
                    this.createModel = false
                }).catch(res=>{
                     this.sloading()
                })
          } else {
             this.$message.error('请根据提示输入');
            return false;
          }
          });
       
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.ExternalLink' } }).then(res => {
                res.delete = 'DELETE'
                res.subs.map(it => {
                    if (it.key == 'createTime'|| it.key=='platformId' ) {
                        it.searchable = false;
                        it.displayInList = false;
                    }
                     if (it.key == 'sort') {
                        it.displayInList = true;
                    }
                    if (it.key == 'updateTime') {
                        it.displayInList = true;
                        it.searchable = true;
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
