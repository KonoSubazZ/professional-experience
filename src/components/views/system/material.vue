<template>
    <div class="container">
        <div class="padding_20">
            <List
                :dataUrl="'/manage/unit/system/systemSettings/deliveryUnit'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                :chooseBox="true"
                @create="open"
            ></List>
        </div>
        <!-- 弹框 -->
        <el-dialog title="供货单位添加" :visible.sync="createModel" width="40%" :close-on-click-modal="false" @close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="m-b-30">
                <el-form-item label="供货单位名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="联系人" prop="contactPerson">
                    <el-input v-model="form.contactPerson"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="mailbox">
                    <el-input v-model="form.mailbox"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="note">
                    <el-input v-model="form.note"></el-input>
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
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
    components: { List },
    data() {
        return {
            bus: this.bus(this),

            meta: '',
            form: {}, //表单
            loadings: false,
            createModel: false, //弹框s

            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.height = this.$height();
        this.metaList();
    },

    methods: {
        // 编辑按钮
        editUpdate(e) {
            this.loadings = true;
            this.form = e[0];
            this.createModel = true;
            setTimeout((res) => {
                this.loadings = false;
            }, 500);
        },
        // 删除按钮
        deleteUpdate(e) {
            // // console.log(e)
            let ids = e
                .map((it) => {
                    return it.id;
                })
                .join(',');
            this.loading();
            this.ax
                .delete('/manage/unit/system/systemSettings/deliveryUnit?ids=' + ids)
                .then((res) => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/deliveryUnit`, res);
                    this.$message.success('删除成功');
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 新增打开
        open() {
            this.createModel = true;
        },
        //
        close() {
            this.form = {};
        },
        // 保存
        save_mar() {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax
                .post('/manage/unit/system/systemSettings/deliveryUnit', this.form)
                .then((res) => {
                    this.sloading();
                    this.createModel = false;
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/deliveryUnit`, res);
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.DeliveryUnit' } }).then((res) => {
                res.delete = 'DELETE';
                res.subs.map((it) => {
                    if (it.key == 'createTime' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if (it.key == 'bookCatalogParameterType') {
                        this.options = it.searchOption;
                    }
                    // it.searchable = false
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
