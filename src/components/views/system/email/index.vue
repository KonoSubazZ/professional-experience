<template>
    <div class="container" >       
        <div v-if="isEmail">
            <List
                :dataUrl="'/manage/unit/system/email/sendEmailDetail'"
                :disableMeta="true"
                :isHeaderHeigt='30'
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                @create="open"
            ></List>
        </div>
        <div v-else >
            <div :style="$height(270)" class="noServe">当前平台未开通本项增值服务，如需开通请联系管理</div>
        </div>
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
            isEmail:false,
            form:{},
             rules:{
               code: [{ required: true, message: '请输入', trigger: 'blur' }],
                note: [{ required: true, message: '请输入', trigger: 'blur' }],
                  name: [{ required: true, message: '请输入', trigger: 'blur' }],
                
           }
        };
    },
    created() {
         this.isEmail  = JSON.parse(localStorage.getItem("user")).platform.isEmail
       
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
                            .post('/manage/unit/system/email/sendEmailDetail', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/system/email/sendEmailDetail`, res);
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
                .delete('/manage/unit/system/email/sendEmailDetail?ids=' +ids )
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/email/sendEmailDetail`, res);
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
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.AlibabaEmailDetail' } }).then(res => {
                res.insertable=false
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
