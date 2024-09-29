<template>
   

  
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">初始化超级管理员</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">

                 <el-form-item >
                    <el-input v-model="ruleForm.name" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="电话(账号)">
                        <el-button slot="prepend" icon="el-icon-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="新登录密码"
                        v-model="ruleForm.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input
                        type="password"
                        placeholder="新确认密码"
                        v-model="ruleForm.checkPass"
                      
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="save('ruleForm')">保存</el-button>
                </div>
            </el-form>
        </div>

    </div>

</template>

<script>
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
        } else if (value !== this.ruleForm.password) {
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
           ruleForm:{
             mobile:'',
           },
           
           rules:{
               mobile: [
             { validator: checkPhone, trigger: 'blur' }
            ],
            password: [
             { validator: validatePass, trigger: 'blur' }
           ],
            checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
           },
        };
    },
    created() {
       
    },
    methods: {
 // 返回
        back(){
             this.$router.go(-1);
              this.bus.$emit('close',this.$route.path);
        },
        // 新增保存
        save(formName){
            // console.log(123)
           this.$refs[formName].validate((valid) => {
          if (valid) {
               this.ax.post('manager/init',this.ruleForm)
            .then(res=>{
                   //// console.log(res)
                    this.$message.success('保存成功');
                    localStorage.removeItem('user');
                    this.$router.push('/login');
                })
                .catch(res=>{
                  // console.log(res)
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
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: #ffffff4d;
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
</style>
