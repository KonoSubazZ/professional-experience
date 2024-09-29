 <template>
    <div class="container">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>特殊流通规则</div>
            <div class="display_flex">
                 <el-button type="success"  class="add m-r-20" icon='el-icon-circle-plus-outline' @click="open" >添加</el-button>
            </div>
        </div>
        <div class="padding_20" >
            <List
                :dataUrl="'/manage/unit/circulation/circulationParameters/specialCirculationRules'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                :isHeaderHeigt='100'
                ref="list"
                @delete="deleteUpdate"
                :chooseBox='true'
            >
                <template slot="addition-table-actions" slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        class="m-r-20"
                        @click="deal(scope.item.row)"
                    >{{scope.item.row.status == 'ENABLE'? '禁用':'启用'}}</el-button>
                </template>
            </List>
        </div>
        <!-- 弹框 -->
        <el-dialog
            title="文献类型编辑"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="120px"
                class=" m-b-30"
            >
                <el-form-item label="读者类型">
                    <el-select
                        v-model="form.readerTypeId"
                        clearable
                        placeholder="请选择"
                        class="w-100"
                        @change="getName('readerTypeName',options.readerTypes,form.readerTypeId)"
                    >
                        <el-option
                            v-for="items in options.readerTypes"
                            :key="items.id"
                            :label="items.name"
                            :value="items.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="文献流通类型">
                    <el-select
                        v-model="form.documentCirculationTypeId"
                        clearable
                        placeholder="请选择"
                        class="w-100"
                        @change="getName('documentCirculationTypeName',options.documentCirculationTypes,form.documentCirculationTypeId)"
                    >
                        <el-option
                            v-for="items in options.documentCirculationTypes"
                            :key="items.id"
                            :label="items.name"
                            :value="items.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="馆藏地点">
                    <el-select
                        v-model="form.collectionPlaceId"
                        clearable
                        placeholder="请选择"
                        class="w-100"
                        @change="getName('collectionPlaceName',options.collectionPlaces,form.collectionPlaceId)"
                    >
                        <el-option
                            v-for="items in options.collectionPlaces"
                            :key="items.id"
                            :label="items.name"
                            :value="items.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="form.status" clearable placeholder="请选择" class="w-100">
                        <el-option
                            v-for="items in status"
                            :key="items.key"
                            :label="items.name"
                            :value="items.key"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item  prop='maxBorrow'  label="最大借阅册数">
                    <el-input v-model.number="form.maxBorrow"></el-input>
                </el-form-item>

                <el-form-item prop='maxBorrowingDays'   label="最大借书天数">
                    <el-input v-model.number="form.maxBorrowingDays"></el-input>
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
import List from '../../../view/List';
export default {
    components: {
        List
    },
    data() {
        return {bus: this.bus(this),
            meta: '',
            height: '',
            form: {},
            status: [], //状态

            createModel: false,
            options: {},
            rules: {
                //    status: [{ required: true, message: '请选择', trigger: 'change' }],

                //     overdueFine: [{ required: true, message: '请输入', trigger: 'blur' }],

                maxBorrowingDays: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                maxBorrow: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                // renewalsDay: [{ required: true, message: '请输入', trigger: 'blur' }],

                // lostFineRate: [{ required: true, message: '请输入', trigger: 'blur' }],

                // damageFineRate: [{ required: true, message: '请输入', trigger: 'blur' }],

                // maxOverdueFine: [{ required: true, message: '请输入', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.height = this.$height();
        this.metaList();
        this.getOption();
    },
    methods: {
        // 获取选择
        getOption() {
            this.ax.get('/manage/unit/circulation/circulationParameters/basicParametersForInsertSpecialCirculationRules').then(res => {
                this.options = res
            });
        },
        getName(name, arr, id) {
            arr.find(res => {
                if (res.id == id) {
                    this.form[name] = res.name;
                }
            });
        },
        // 新增保存
        save_mar(formName) {
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading();
                    this.ax
                        .post('/manage/unit/circulation/circulationParameters/specialCirculationRules', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/specialCirculationRules`, res);
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
        deal(row) {
             this.loading();
            if(row.status=='ENABLE'){
                row.status = 'DISABLE'
            }else{
                 row.status = 'ENABLE'
            }
            
            this.ax.post('/manage/unit/circulation/circulationParameters/specialCirculationRules', row)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/specialCirculationRules`, res);
                        })
                        .catch(res => {
                            this.sloading();
                        });
        },
        close() {
            this.form = [];
        },
        open() {
            this.createModel = true;
        },
        editUpdate(e) {
            this.loading();
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.sloading();
            }, 500);
        },
        deleteUpdate(e) {
            this.loading();
            let ids = e
                .map(it => {
                    return it.id;
                })
                .join(',');
            this.loading();
            this.ax
                .delete('/manage/unit/circulation/circulationParameters/specialCirculationRules?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/specialCirculationRules`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        metaList() {
            this.ax
                .get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.SpecialCirculationRules' } })
                .then(res => {
                    res.delete='DELETE'
                    res.insertable = false;
                    res.subs.map(it => {
                        if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                            it.displayInList = false;
                            it.searchable = false;
                        }
                        if (it.key == 'status') {
                            this.status = it.searchOption;
                        }
                    });
                    // // console.log(res);
                    this.meta = res;
                });
        }
    }
};
</script>

<style>
</style>
