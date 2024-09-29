<template>
  <div>
    <p>
      开启自动备份：
      <el-switch
          @change="switchChange"
          v-model="switchValue"
          active-color="#13ce66">
      </el-switch>
    </p>
    <div class="w-100 m-t-20 display_flex" style="align-items: end;">
      <view-form :row='1' :list='title' ref="form" @getForm='getForm' :model='form'></view-form>
      <el-checkbox class="m-l-30 m-b-40 display_flex" :disabled="!switchValue" v-model="checkedMail">发送至邮箱</el-checkbox>
    </div>
    <div class="m-l-100">
      <el-button type="primary" :loading="saveLoading" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import ViewForm from '../../../view/form';

export default {
  components: {ViewForm},
  data() {
    return {
      switchValue: true,
      checkedMail: true,
      saveLoading: false,
      form: {
        backupCycle: 1
      },
      title: [
        {
          name: '备份周期',
          id: 'backupCycle',
          type: 'radio',
          options: [{id: 1, name: '一天'}, {id: 2, name: '一周'}, {id: 3, name: '一月'}],
          disable: false
        },
        {name: '保留周期(单位:月)', id: 'retainCycle', type: 'number', disable: false},
        {name: '邮箱地址', id: 'email', disable: false},
      ],
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig(){
      this.loading();
      this.ax.get('/manage/unit/system/dbbackup/getBackupConfigs').then(res=>{
        if(res !== null){
          if(!res.openAutoBackup){
            this.title.map(it => {
              it.disable = true;
            })
          }
          this.switchValue = res.openAutoBackup;
          this.checkedMail = res.sendEmail;
          this.form = res;
        }
        this.sloading();
      }).catch(err=>{
        this.sloading();
      })
    },
    save() {
      if(!this.form.retainCycle && this.switchValue){
        return this.$message.error('请输入保留周期(单位:月)')
      }
      if(this.switchValue && this.checkedMail && !this.form.email){
        return this.$message.error('请输入邮箱地址')
      }
      if (!this.$filters.checkEmail(this.form.email) && this.switchValue && this.checkedMail) {
        return this.$message.error('输入的邮箱格式不正确')
      }

      let params = {
        openAutoBackup: this.switchValue ? 1 : 0,
        backupCycle: this.form.backupCycle,
        retainCycle: Number(this.form.retainCycle),
        sendEmail: this.checkedMail ? 1 : 0,
        email: this.form.email
      }
      if(this.form.id){
        params.id = this.form.id
      }
      this.saveLoading = true;
      this.ax.post('/manage/unit/system/dbbackup/savaBackupConfig', params).then(res => {
        this.$message.success(res)
        this.saveLoading = false
      }).catch(err => {
        this.saveLoading = false
      })

    },
    switchChange(e) {
      this.title.map(it => {
        if (e) {
          it.disable = false;
        } else {
          it.disable = true;
        }
      })
    },
    getForm(val) {
      this.form = val;
    }
  }
}
</script>
<style scoped>
/deep/ .el-form-item__content {
  width: 70% !important;
}

</style>