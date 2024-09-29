<template>
    <div class="changePwd">
         <div class="container m-b-25">
                <div class="top_title display_flex m-b-35">
                    <div class="title_info">修改密码</div>
                </div>         
                <div>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  >
                        <div class="display_flex  padding_20 m-b-20">
                           
                            <el-form-item  prop="password" class="w-30 m-r-30">
                                <div class="label">新登录密码</div>
                                <el-input v-model="ruleForm.password" show-password placeholder="请输入密码"></el-input>
                            </el-form-item>
                             <el-form-item  prop="checkPass" class="w-30">
                                <div class="label">新确认密码</div>
                                <el-input v-model="ruleForm.checkPass" show-password placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </div>
                        
                    </el-form>
                </div>    
         </div>
        <div class="display_flex padding_20">
         <div class="back f-s-14 cursor m-r-25" @click="back">返回</div>
         <div v-if="ruleForm.password !==ruleForm.checkPass" class="back f-s-14 cursor">保存</div>
         <div v-else class="save f-s-14 cursor" @click="save('ruleForm')">保存</div>
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
        return {
           ruleForm:{

           },
           
           rules:{
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
        // 新增保存
        save(formName){
           this.$refs[formName].validate((valid) => {
          if (valid) {
               this.ax.post('manager/pass',{password:this.ruleForm.password})
            .then(res=>{
                   //// console.log(res)
                    this.$message.success('保存成功');
                    localStorage.removeItem('user');
                     this.$router.push('/login');
                })
                .catch(res=>{
                  
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
/* .changePwd  */
/* .changePwd  */
</style>
