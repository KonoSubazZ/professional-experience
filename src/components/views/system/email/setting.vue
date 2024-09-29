<template>
    <div class="container" :style="'height:'+height+'px'">
        <div   v-if="isEmail">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>邮件配置</div>
                <div class="display_flex">
                    <!-- <div class="cursor text_center m-r-20" @click="save">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">保存</div>
                    </div> -->
                     <el-button type="primary" @click="save" >保存</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form' @getForm="getForm"></form-data>
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
            list: [
                { name: '账号', id: 'username' ,max:'100'},

                { name: 'SMTP服务域名', id: 'smtpServer' ,max:'100'},

                { name: '密码', id: 'password',max:'100' },

                { name: '是否自动发送', id: 'autoSend',type:'select',options:[
                    {name:'是',id:true},
                    {name:'否',id:false}
                ] },
               
                // { name: '短信签名', id: 'signName' }
            ],
            form: {},
             isEmail:false,
            createModel:false,
            height: ''
        };
    },
    created() {
         this.isEmail  = JSON.parse(localStorage.getItem("user")).platform.isEmail
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getUnit()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getForm(val) {
            this.form = val;
        },

        // 获取配置
        getUnit() {
              this.loading()
            this.ax
                .get('/manage/unit/system/email/emailConfig', {
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
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id 
            this.ax
                .post('/manage/unit/system/email/emailConfig', this.form)
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
