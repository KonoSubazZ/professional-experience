<template>
    <div class="container" >       
            <List
                :dataUrl="'/manage/unit/system/sms/smsDetail'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                @create="open"
            ></List>
     
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
            // isInternal:false,
            form:{},
             rules:{
               code: [{ required: true, message: '请输入', trigger: 'blur' }],
                note: [{ required: true, message: '请输入', trigger: 'blur' }],
                  name: [{ required: true, message: '请输入', trigger: 'blur' }],
                
           }
        };
    },
    created() {
        // this.getInfo()
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
                            .post('/manage/unit/system/sms/smsDetail', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/system/sms/smsDetail`, res);
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
                .delete('/manage/unit/system/sms/smsDetail?ids=' +ids )
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/sms/smsDetail`, res);
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
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.SmsDetail' } }).then(res => {
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

<style scoped>

</style>
