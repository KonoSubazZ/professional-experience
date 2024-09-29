<template>
    <div class="container">       
            <List
                :dataUrl="'/manage/unit/circulation/circulationParameters/holiday'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                :chooseBox='true'
                @create="open"
            ></List>

             <!-- 弹框 -->
        <el-dialog title="文献类型编辑" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="假期名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>

                        <el-form-item label="开始日期" prop='name' >
                            <el-date-picker
                                v-model="form.start"
                                type="datetime"
                                class="w-100"
                                :picker-options="pickerOptionStart"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="结束日期"  >
                             <el-date-picker
                                v-model="form.end"
                                type="datetime"
                                class="w-100"
                                :picker-options="pickerOptionEnd"
                                default-time="23:59:59"
                                placeholder="选择日期时间">
                            </el-date-picker>
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
                 name: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
          pickerOptionStart:{
            disabledDate: time => {
              let endDateVal = this.form.end
              if (endDateVal) {
                return time.getTime() > new Date(endDateVal).getTime()
              }
            }
          },
          pickerOptionEnd:{
            disabledDate: time => {
              let beginDateVal = this.form.start
              if (beginDateVal) {
                return (
                    time.getTime() <
                    new Date(beginDateVal).getTime() - 860000
                )
              }
            }
          }
        };
    },
    created() {
        this.metaList();
    },
    methods: {
       
        // 修改
        editUpdate(e) {
            this.loadings = true;
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.loadings = false;
            }, 500);
        },
        // 删除
        deleteUpdate(e) {
            this.loading();
            let ids=e.map(it=>{
                return it.id
            }).join(',')
            this.loading();
            this.ax
                .delete('/manage/unit/circulation/circulationParameters/holiday?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/holiday`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        open(){
           this.createModel=true
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Holiday' } }).then(res => {
                res.subs.map(it => {
                    res.delete='DELETE'
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                });
                // console.log(res);
                this.meta = res;
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
                        .post('/manage/unit/circulation/circulationParameters/holiday', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/holiday`, res);
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
    }
};
</script>

<style>
</style>
