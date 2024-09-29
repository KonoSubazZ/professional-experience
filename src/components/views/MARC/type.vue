 <template>
    <div class="container">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="MARC类型" name="BOOK"></el-tab-pane>
            </el-tabs>
        </div>
        <List
            :dataUrl="dataUrl"
            :disableMeta="true"
            :tableMeta="meta"
            :isHeaderHeigt='80'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            @create="open"
        >
                 <template slot="addition-table-actions" slot-scope="scope">
                    <el-button type="text" size="mini" @click="updata(scope.item.row)">编辑字段</el-button>

                     <el-button type="text" size="mini" @click="jump(scope.item.row)">统一字段</el-button>

                </template>
        </List>
        <!-- 弹框 -->
        <el-dialog
            title="MARC类型管理"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <fromData ref="form" :row="1" :list="list" :rule="rules" :model="form"></fromData>

            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar('form')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import Vue from 'vue';
import fromData from '../../view/form';
export default {
    components: { List, fromData },
    data() {
        return {bus: this.bus(this),
            list: [
                { name: '类型名称', id: 'name' },
                {
                    name: '文献类型',
                    id: 'bookCatalogParameterTypeDetailId',
                    relation: 'bookCatalogParameterTypeDetailName',
                    options: [],
                    type: 'select'
                },
                {
                    name: '编目类型',
                    id: 'marcType',
                    disable:false,
                    options: [
                        {name:'图书',id:'BOOK'},
                        {name:'期刊',id:'JOURNAL'}
                    ],
                    type: 'select'
                },

                { name: '备注', id: 'note', type: 'textarea' }
            ],
             option:[
               {name:'是',key:true},
                {name:'否',key:false},
           ],
            height: '',
            activeName: 'BOOK',
            meta: '',

            createModel: false,
            createModels:false,
            form: {},

            dataUrl: '/manage/unit/system/systemSettings/marcTypeDetail',

            rules: {
                marcType: [{ required: true, message: '请输入', trigger: 'blur' }],
                bookCatalogParameterTypeDetailId: [{ required: true, message: '请输入', trigger: 'change' }],
                name: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.metaList();
        this.height = this.$height(300);
        this.getOption();
    },
    methods: {
        jump(val){
             this.$router.push({
                path:'type/field/son',
                query:{id:val.id,url:val.marcType}
            })
        },
        // 修改
        editUpdate(e) {
            this.loadings = true;
            this.list[2].disable=true
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.loadings = false;
            }, 500);
        },
        // 跳转字段
        updata(val){
            this.$router.push({
                path:'type/field',
                query:{id:val.id}
            })
        },
        // 删除
        handleDelete(index, row) {
            Vue.set(row, 'selected', !row.selected);
            this.chooseData.map((it, index) => {
                if (it.id == row.id) {
                    this.chooseData.splice(index, 1);
                }
            });
        },
        // 获取筛选
        getOption() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                size: 999
            };
            this.ax
                .get('/manage/unit/system/systemSettings/bookCatalogParameterTypeDetailForInsertMarcTypeDetail', { params })
                .then(res => {
                    this.list[1].options = res.content;
                });
        },
        // 新增保存
        save_type(formName) {
            this.loading();
            let params = {
                marcFieldDetails: this.chooseData,
                marcTypeDetailId: this.upId
            };
            this.ax
                .post('/manage/unit/system/systemSettings/marcTypeFieldDetail', params)
                .then(res => {
                    this.sloading();
                    this.$message.success('保存成功');
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTypeDetail`, res);
                    this.createModels = false;
                })
                .catch(res => {
                    this.sloading();
                });
        },
        // 切换
        handelClick(e) {
            // // console.log(this.activeName)
            this.loading();
            if (this.activeName == 'BOOK') {
                this.dataUrl = '/manage/unit/system/systemSettings/marcTypeDetail?marcType=BOOK';
                setTimeout(res => {
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTypeDetail`, e);
                });
            } else {
                this.dataUrl = '/manage/unit/system/systemSettings/marcTypeDetail?marcType=JOURNAL';
                setTimeout(res => {
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTypeDetail`, e);
                });
            }
            setTimeout(res => {
                this.sloading();
            }, 1000);

            //  // console.log(e)
        },

        // 删除
        deleteUpdate(e) {
            // // console.log(e)
            this.loading();
            let ids = e
                .map(it => {
                    return it.id;
                })
                .join(',');
            this.ax
                .delete('/manage/unit/system/systemSettings/marcTypeDetail?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTypeDetail`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        // 新增打开
        open() {
            this.list[2].disable=false
            this.createModel = true;
        },
        //
        close() {
            this.form = {};
        },
        // 保存
        save_mar(formName) {
            this.$refs[formName].$refs[formName].validate(valid => {
                if (valid) {
                    this.loading();

                    this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
                    // this.form.marcType = this.activeName;
                    this.ax
                        .post('/manage/unit/system/systemSettings/marcTypeDetail', this.form)
                        .then(res => {
                            this.sloading();
                            this.createModel = false;
                            this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTypeDetail`, res);
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.MarcTypeDetail' } }).then(res => {
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'platformId' || it.key=='bookCatalogParameterTypeDetailId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if(it.key=='bookCatalogParameterTypeDetailName' || it.key=='marcType'){
                        it.displayInList = true
                        
                    }
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style scoped>
.mould {
    overflow: auto;
    box-sizing: border-box;
}
</style>
