<template>



    <div class="login-wrap">
        <div class="ms-login login_active">
            <div class="ms-title   "  v-if="next_go==1">
                <div class="btn_choose cursor" :class="type_btn==1?'active_btn':''" @click="type_btn=1" v-if='type_btn==1'>账号激活</div>
<!--              <div class="btn_choose cursor" :class="type_btn==2?'active_btn':''"  @click="type_btn=2" v-if='type_btn==2'>激活码激活</div>-->
              <div class="btn_choose cursor" :class="type_btn==3?'active_btn':''"  @click="type_btn=3" v-if='type_btn==3'>注册码激活</div>
            </div>

            <div class="ms-title"  v-else>
                <div >初始化超级管理员</div>
            </div>

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content" v-if="type_btn==1">

                 <div v-if="next_go==1">
                     <el-form-item prop="username">
                        <el-input v-model="ruleForm.username" placeholder="激活登录账号">
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="ruleForm.password" type="password" placeholder="激活登录密码">
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="jump('ruleForm')">下一步</el-button>
                    </div>
                 </div>

                  <div v-else>
                       <el-form-item prop="managerUsername">
                        <el-input v-model="ruleForm.managerUsername" placeholder="超级管理员账号">
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                     <el-form-item prop="managerPassword">
                    <el-input
                        type="password"
                        placeholder="超级管理员密码"
                        v-model="ruleForm.managerPassword">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input
                        type="password"
                        placeholder="确认密码"
                        v-model="ruleForm.checkPass">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="save('ruleForm')" v-if="type_btn==1">保存</el-button>

                         <el-button type="primary" @click="saveCode('ruleForm')" v-else>保存</el-button>
                    </div>
                 </div>

            </el-form>

               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content" v-if="type_btn==3">

                 <div v-if="next_go==1">
                     <el-form-item prop="code">

                        <el-input v-model="ruleForm.code" type='textarea' :rows='5' placeholder="注册码"></el-input>

                    </el-form-item>

<!--                   <el-button type="text" class="color_dan" @click="getCode">获取本机公钥</el-button>-->
                   <el-button type="text" class="color_dan" @click="getregCode">获取本机注册码公钥</el-button>

                    <div class="login-btn">
                        <el-button type="primary" @click="jump('ruleForm')">下一步</el-button>
                    </div>
                 </div>

                  <div v-if="next_go==2">
                       <el-form-item prop="managerUsername">
                        <el-input v-model="ruleForm.managerUsername" placeholder="超级管理员账号">
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                     <el-form-item prop="managerPassword">
                    <el-input
                        type="password"
                        placeholder="超级管理员密码"
                        v-model="ruleForm.managerPassword">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input
                        type="password"
                        placeholder="确认密码"
                        v-model="ruleForm.checkPass">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="save('ruleForm')" v-if="type_btn==1">保存</el-button>

                         <el-button type="primary" @click="saveCode('ruleForm')" v-else>保存</el-button>
                    </div>
                 </div>

            </el-form>

        </div>

         <el-dialog
                width="30%"
                :title="title"
                :visible.sync="innerVisibles"
                :close-on-click-modal="false"
                append-to-body
            >

                            <div class="cope_text">{{codeNumber}}</div>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisibles = false">关闭</el-button>
                    <el-button  class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="codeNumber" @click="copy" :disabled="disabled">复制</el-button>
                </span>
            </el-dialog>

    </div>

</template>

<script>
import Clipboard from 'clipboard';
export default {
    data() {
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.managerPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话不能为空'));
        }
        setTimeout(() => {
              if (!(/^1[3456789]\d{9}$/.test(value))) {
                 callback(new Error('请输入正确的手机号'));
                } else {
                callback();
                }

        }, 500);
      };
        return {
          title:'请妥善保管本机公钥',
            innerVisibles:false,
            codeNumber:'',
           ruleForm:{

           },

           disabled:false,
        //   激活方式
           type_btn:1,
        //    next
           next_go:1,
           rules:{


            username:[{required: true, message: '请输入账号', trigger: 'blur'}],

             code:[{required: true, message: '请输入注册码', trigger: 'blur'}],
             // code:[{required: true, message: '请输入激活码', trigger: 'blur'}],

            password:[{required: true, message: '请输入密码', trigger: 'blur'}],

            managerUsername :[{required: true, message: '请输入账号', trigger: 'blur'}],

            managerPassword : [
                { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
                { validator: validatePass2, trigger: 'blur' }
            ],
           },
        };
    },
    created() {
        // console.log(this.$route.path)
        if(this.$route.path=='/activation'){
          // this.type_btn=2
          this.type_btn=3
        }else {
          this.type_btn=1

        }
    },
    methods: {

        jump(formName){

           this.$refs[formName].validate((valid) => {
          if (valid) {
              this.next_go=2
            //   this.type_btn=1
          } else {
             this.$message.error('请根据提示输入');
            return false;
          }
          });

        },
        copy(val) {
            const _this = this;
            var clipboard = new Clipboard('.cobyOrderSn');
            clipboard.on('success', function (val) {
                _this.disabled = true;
                setTimeout(() => {
                    _this.disabled = false;
                    // 销毁实例防止多次触发
                    clipboard.destroy();
                }, 3000);
                _this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            });
            clipboard.on('error', function () {
                _this.$message.error('复制失败，请手动复制');
            });
        },
        getCode(){
            this.loading()
            this.ax.get('/login/keypairExclusive')
                .then(res=>{
                    this.sloading()

                      this.$message.success('获取成功，请妥善保管本机公钥');
                    this.codeNumber = res.publicKeyStr
                  this.title='请妥善保管本机公钥'
                    this.innerVisibles=true
                })
        },
      getregCode(){
            this.loading()
          this.ax.get('/login/getDeviceFingerprint')
              .then(res=>{
                this.sloading()

                this.$message.success('获取成功，请妥善保管本机公钥');
                this.codeNumber = res.publicKeyStr
                this.title='请妥善保管本机注册码公钥'
                this.innerVisibles=true
              })


        },
      // 激活码 激活
      // saveCode(){
      //   this.ruleForm.type = this.type_btn
      //   this.ax.post('login/activation',this.ruleForm)
      //       .then(res=>{
      //
      //         this.$message.success('激活成功');
      //
      //         this.$router.push('/login');
      //       })
      //       .catch(res=>{
      //
      //         this.next_go = 1
      //       })
      // },
        // 注册码 激活
        saveCode(){
            let result = "";
            for(let i = 0; i < this.ruleForm.code.length; i++) {
              if (i % 4 == 0 && i != 0) {
                result += '-' + this.ruleForm.code[i];
              }
              else {
                result += this.ruleForm.code[i];
              }
            }
            let params = {
              managerUsername:this.ruleForm.managerUsername,
              managerPassword:this.ruleForm.managerPassword,
              checkPass:this.ruleForm.checkPass,
              type:this.type_btn,
              code:result,
            }
            this.ax.post('/login/activation',params)
                .then(res=>{

                  this.$message.success(this.type_btn==2? '激活成功':'注册成功');

                  this.$router.push('/login');
                })
                .catch(res=>{

                  this.next_go = 1
                })



        },
        // 新增保存
        save(formName){

           this.$refs[formName].validate((valid) => {
          if (valid) {
              this.ruleForm.type = this.type_btn

              this.ruleForm.password = this.md5( this.ruleForm.password)+'cq1080'

                // console.log(this.ruleForm.password)
               this.ax.post('login/activation',this.ruleForm)
            .then(res=>{
                   // console.log(res)
                    this.$message.success('激活成功');
                    // localStorage.removeItem('user');
                    this.$router.push('/login');
                })
                .catch(res=>{
                  // console.log(res)
                  this.next_go = 1

                })
          } else {
             this.$message.error('请根据提示输入');
            return false;
          }
          });

        },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/login-bg.jpg); */
    background: #324157;
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 40px;
    height: 50px;
    text-align: center;
    padding:0 50px;
    box-sizing: border-box;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.btn_choose{
    color: #324157;
    transition: 0.4s;
    font-size: 16px;
}
.active_btn{
     color: #fff;
     line-height: 40px;
     /* border-bottom: 1px solid #fff; */
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.el-link.el-link--default{
 color: #1784ff;
}
.bottom{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;

}
.login_active{
    animation: show 2s;
}
</style>
