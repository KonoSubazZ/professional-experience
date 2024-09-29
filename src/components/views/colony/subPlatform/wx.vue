<template>
    <div>
        <div class="container" :style="height" v-if="isWeChat">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>微信配置</div>
                <div class="display_flex">
                    <!-- <div class="cursor text_center m-r-20" @click="save">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">保存</div>
                    </div> -->
                       <el-button type="primary"   @click="save" >保存</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form' :labelWidth='"160"' @getForm="getForm"></form-data>
                <!-- <div class="set">
                    <el-button type="primary" @click="jump" class>报表导出格式设置</el-button>
                </div> -->
            </div>
        </div>
        <div v-else>
            <div class="noServe">当前平台未开通本项增值服务，如需开通请联系管理</div>
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
import formData from '../../../view/form';

export default {
    components: {
        formData
    },
    data() {
        return {bus: this.bus(this),
            isWeChat:true,
            list: [
                { name: '公众号账号appId', id: 'appId' ,max:'100'},

                { name: '商户号mchId', id: 'mchId' ,max:'100'},

                { name: '支付回调地址', id: 'notifyUrl',max:'100' },

                { name: '商户秘钥', id: 'mchKey',max:'100' }
            ],
            form: {},
            createModel:false,
            height: ''
        };
    },
    created() {
        this.getInfo()
        this.height = this.$height();
        this.getUnit()
    },
    methods: {

         getInfo(){
            this.ax.get('/login/user')
                .then(res=>{
                    // console.log(res)
                    this.isWeChat = res.isWeChat
                })
        },
        getForm(val) {
            this.form = val;
        },

        // 获取配置
        getUnit() {
              this.loading()
            this.ax
                .get('/manage/united/subPlatform/wechatPayConfig', {
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
                .post('/manage/united/subPlatform/wechatPayConfig', this.form)
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
.noServe{
    text-align: center;
    padding-top: 100px;
    font-size: 30px;
}
</style>
