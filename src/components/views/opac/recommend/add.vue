 <template>
    <div>
        <List
            :dataUrl="url"
            :disableMeta="true"
            :tableMeta="meta"
             :isHeaderHeigt='20'
            @edit="editUpdate"
             ref="list"
            @delete="deleteUpdate"
            @create="jump"
        >
            <template slot="addition-table-actions" slot-scope="scope">
                <el-button type="text" class="m-r-10" @click="recomm(scope.item.row)">推荐</el-button>
            </template>
            <template slot="addition-actions">
                <div class="text_center cursor m-r-20" @click="back">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div>
            </template>

        </List>

        <!-- 弹框 -->
        <el-dialog
            title="设置"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close"
        >
            <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="m-b-30">
                <el-form-item label="推荐次序" prop="sort">
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
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            url: '',
            form: {
                sort: ''
            },
            //  规则
            createModel:false,
            rules: {
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                    { type: 'number', message: '排序必须为数字值' }
                ]
            },
            // timer
            timer: false,
            screenWidth: ''
        };
    },
    created() {
        this.metaList();
        this.url = `/manage/unit/opac/recommendation/bookRecommendation?recommend=false&type=${this.$route.query.url}`;
    },
    methods: {
        // 修改
        editUpdate(e) {
            // console.log(e);
            this.$router.push({
                path: 'index/addNote',
                query: { info: JSON.stringify(e[0]) }
            });
        },
        close(){
            this.form={}
        },
        jump() {
            this.$router.push('index/addNote');
        },
        recomm(val) {
            // console.log(val);
            this.form = val
            this.createModel = true
            // val.type = this.$route.query.url
            // val.
            // this.ax.post('/manage/unit/opac/recommendation/bookRecommendation',val)
            //     .then(res=>{
            //          this.$message.success('推荐成功');
            //           this.bus.$emit(`flash_/manage/unit/opac/recommendation/bookRecommendation?recommend=false&type=${this.$route.query.url}`, res);

            //     })
        },
        // 新增保存
        save(formName){
           this.$refs[formName].validate((valid) => {
          if (valid) {
                     this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                      this.form.type =this.$route.query.url
                    this.ax.post('/manage/unit/opac/recommendation/bookRecommendation',this.form)
                    .then(res=>{
                        this.$message.success('推荐成功');
                        this.createModel=false

                        this.bus.$emit(`flash_/manage/unit/opac/recommendation/bookRecommendation?recommend=false&type=${this.$route.query.url}`, res);

                    })
          } else {
             this.$message.error('请根据提示输入');
            return false;
          }
          });
       
        },
        // 删除
        deleteUpdate(e) {
            // // console.log(e)
            let ids = e
                .map(it => {
                    return it.id;
                })
                .join(',');
            this.loading();
            this.ax
                .delete('/manage/unit/opac/announcement/announcement?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/opac/announcement/announcement`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        metaList() {
            this.meta = {
                delete: 'NONE',
                edit: 'NONE',
                insertable: false,
                subs: [
                    {
                        key: 'positiveTitle',
                        name: '题名',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key: 'isbn',
                        name: 'ISBN',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key: 'medium',
                        name: '文献类型',
                        displayInList: true,
                        searchOption:[
                            {name:'中文图书',key:'中文图书'},
                            {name:'中文期刊',key:'中文期刊'},
                        ],
                        searchable: true
                    },
                    {
                        key: 'publicationDate',
                        name: '出版时间',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key: 'createTime',
                        name: '编目时间',
                        displayInList: true,
                        searchable: true,
                        type: "TIMESTAMP"
                    },
                    
                ]
            };
        }
    }
};
</script>

<style>
</style>
