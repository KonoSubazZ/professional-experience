<template>
    <div class="container">       
            <List
                :dataUrl="'/manage/unit/circulation/circulationParameters/documentCirculationType'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                @create="open"
                :chooseBox='true'
            ></List>
        <!-- 弹框 -->
        <el-dialog title="文献类型编辑" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="流通代码" prop='code' >
                            <el-input v-model="form.code" ></el-input>
                        </el-form-item>

                        <el-form-item label="类型名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>

                        <el-form-item label="备注"  >
                            <el-input v-model="form.note" ></el-input>
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
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            createModel:false,
            form:{},
             rules:{
               code: [{ required: true, message: '请输入', trigger: 'blur' }],
                note: [{ required: true, message: '请输入', trigger: 'blur' }],
                  name: [{ required: true, message: '请输入', trigger: 'blur' }],
                
           }
        };
    },
    created() {
        this.metaList();
    },
    methods: {
         // 新增保存
        save_mar(formName) {
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/circulation/circulationParameters/documentCirculationType', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/documentCirculationType`, res);
                                 this.createModel=false
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
        // 修改
        editUpdate(e) {
            this.loading();
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.sloading();
            }, 500);
        },
        // 删除
        deleteUpdate(e) {
            // // console.log(e)
            this.loading();
            let ids=e.map(it=>{
                return it.id
            }).join(',')
            this.ax
                .delete('/manage/unit/circulation/circulationParameters/documentCirculationType?ids=' +ids )
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/documentCirculationType`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        close(){
            this.form={}
        },
        open(){
            this.createModel = true
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.DocumentCirculationType' } }).then(res => {
                res.delete='DELETE_BOTH'
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
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
