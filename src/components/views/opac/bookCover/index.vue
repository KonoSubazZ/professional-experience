 <template>
    <div class="container">
        <List
            :dataUrl="'/manage/unit/opac/bookCoverManagement/bookCover'" :disableMeta="true" :tableMeta="meta" :isSort="true"
            @selected="getSelect"
            :chooseBox="true"
            ref="list"
        >
            <template slot="addition-table-actions" slot-scope="scope">
                <el-button type="primary" size="text" class="m-r-5" @click="edit(scope.item.row)">编辑封面</el-button>
            </template>
            <template slot="addition-actions" class="display_flex start">
                <el-button type="primary" @click="getAll" plain>批量抓取</el-button>
            </template>
        </List>
        <!-- 弹框 （批量抓取按钮）-->
        <el-dialog title="选择抓取来源" :visible.sync="createModel" width="30%" :close-on-click-modal="false" @close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="m-b-30">
                <el-form-item label="来源 :" prop="type">
                    <el-radio-group @change="groupChange" v-model="form.type">
                        <el-radio :label="'DANG_DANG'">当当</el-radio>
                        <el-radio :label="'DOU_BAN'">豆瓣</el-radio>
                        <el-radio :label="'CLOUD'">云端</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="searchImg" v-if="createModel">确 定</el-button>

                <el-button type="primary" @click="searchImg" v-if="editModel">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹框 (编辑封面按钮)-->
        <el-dialog title="请选择" :visible.sync="editModel" width="30%" :close-on-click-modal="false" @close="close">
            <el-form :model="forms" :rules="rules" ref="forms" label-width="140px" class="m-b-30">
                <el-form-item label="可选上传图片 :">
                    <up-load @getImg="getImg" :headImg="forms.coverUrl"></up-load>
                </el-form-item>

                <el-form-item label="抓取来源:" prop="type">
                    <el-radio-group v-model="forms.type">
                        <el-radio :label="'DANG_DANG'">当当</el-radio>
                        <el-radio :label="'DOU_BAN'">豆瓣</el-radio>
                        <el-radio :label="'CLOUD'">云端</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="开始抓取" prop="type">
                    <el-button type="primary" @click="searchImgs">抓取</el-button>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editModel = false">取 消</el-button>
                <el-button type="primary" @click="saveBook">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <div v-html="msg"></div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';
import upLoad from '../../upLoad';
export default {
    components: { List, upLoad },
    data() {
        return {
            bus: this.bus(this),
            meta: '',//
            createModel: false,//“选择抓取来源”弹框的开关
            dialogVisible: false,
            editModel: false,//批量抓取 弹框的开关
            chooseBox: [],
            msg: '',
            form: {},
            forms: {},
            rules: {}
        };
    },
    created() {
        this.metaList();
    },
    methods: {
        metaList() {//
            this.meta = {
                insertable: false,
                edit: 'NONE',
                delete: 'NONE',
                subs: [
                    { name: 'ISBN', key: 'isbn', displayInList: false, searchable: true },
                    { name: '封面图', key: 'coverUrl', type: 'IMAGE', displayInList: true, searchable: false },
                    { name: '题名', key: 'positiveTitle', displayInList: true, searchable: true }
                ]
            };
        },
        // 打开
        getSelect(val) {
            // // console.log(val)
            this.chooseBox = val;
        },
        // 批量抓取
        searchImg() {
            if (!this.form.type) {
                return this.$message.warning('请选择要抓取的来源');
            }
            let ids = this.chooseBox
                .map((it) => {
                    return it.id;
                })
                .join(',');
            let params = {
                type: this.form.type,
                ids
            };
            this.ax.get('/manage/unit/opac/bookCoverManagement/grabBookCoverBatch', { params }).then((res) => {
                // console.log(res)
                // this.$message.success(res);
                this.msg = res.replace(/↵/g, '\n');
                this.dialogVisible = true;
                this.createModel = false;
                this.bus.$emit(`flash_/manage/unit/opac/bookCoverManagement/bookCover`, res);
            });
        },
        getAll() { //“批量抓取”的回调
            if (this.chooseBox.length == 0) {
                return this.$message.warning('请选择要抓取的图书');
            } else {
                this.createModel = true;
            }
        },
        close() {//弹框的关闭
            this.form = {};
        },
        getImg(val) {
            this.forms.coverUrl = val;
        },
        edit(row) {
            // console.log(row)
            this.forms = row;
            this.editModel = true;
        },
        groupChange(e){
            console.log(e,'--e');
        },
        // 单独抓取
        searchImgs() {
            if (this.form.type == ''||!this.forms.type) {
                return this.$message.warning('请选择要抓取的来源');
            }
            let params = {
                content: this.forms.positiveTitle,
                type: this.forms.type
            };
            console.log(params,'1111111111111111111111111111111');
            this.ax.get('/manage/unit/opac/bookCoverManagement/grabBookCover', { params }).then((res) => {
                this.$message.success('抓取成功');
                // console.log(res)
                this.forms.coverUrl = res;
            });
        },
        // 保存
        saveBook() {
          if (!this.forms.type) {
            return this.$message.warning('请选择要抓取的来源');
          }
            this.forms.bookBaseId = this.forms.id;
            this.ax.post('/manage/unit/opac/bookCoverManagement/bookCover', this.forms).then((res) => {
                this.$message.success('保存成功');
                this.editModel = false;
                this.bus.$emit(`flash_/manage/unit/opac/bookCoverManagement/bookCover`, res);
            });
        },
        
    }
};
</script>

<style>
</style>
