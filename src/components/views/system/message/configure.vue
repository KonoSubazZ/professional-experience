<template>
    <div>
        <div class="container" :style="height">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>短信配置</div>
                <div class="display_flex">
                    <!-- <div class="cursor text_center m-r-20" @click="save">
                        <img src="../../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">保存</div>
                    </div> -->
                     <el-button type="primary" @click="save" >保存</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form' :labelWidth='"160"' @getForm="getForm"></form-data>
                <!-- <div class="set">
                    <el-button type="primary" @click="jump" class>报表导出格式设置</el-button>
                </div> -->
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog
            title="报表导出格式设置"
            :visible.sync="createModel"
            width="90%"
            top="1vh"
            :close-on-click-modal="false"
        >
            <div></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="createModel = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import formData from '../../../../view/form';

export default {
    components: {
        formData
    },
    data() {
        return {bus: this.bus(this),
            list: [
                { name: 'AccessKeyID公钥', id: 'accessKeyId' ,max:'100'},

                { name: 'SecretAccessKey密钥', id: 'secretAccessKy' ,max:'100'},

                { name: 'SMS服务域名', id: 'endPoint',max:'100' },

                { name: '地域ID', id: 'regionId' },

                { name: '短信签名', id: 'signName' }
            ],
            form: {},
            createModel:false,
            height: ''
        };
    },
    created() {
        this.height = this.$height();
        this.getUnit()
    },
    methods: {
        getForm(val) {
            this.form = val;
        },

        // 获取配置
        getUnit() {
              this.loading()
            this.ax
                .get('/manage/united/subPlatform/alibabaSmsConfig', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then(res => {
                      this.sloading()
                    this.form = res
                });
        },
         // 获取配置
        save() {
            this.loading()
            this.ax
                .post('/manage/united/subPlatform/alibabaSmsConfig', this.form)
                .then(res => {
                      this.sloading()
                     this.$message.success('保存成功');
                })
                .catch(res=>{
                      this.sloading()
                })
        }
    }
};
</script>

<style scoped >
.set {
    display: flex;
    justify-content: flex-end;
}
</style>
