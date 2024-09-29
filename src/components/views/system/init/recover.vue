<template>
  <div>
    <div class="display_flex tabsBox m-b-10" >
      <div class="title_box " v-for="(item,i) in isOpen === '0'? listTitle.filter(it=>it.type === '2') : listTitle" :key="i" @click="getList(item)" :class="boxName==item.type?'active':''">
        {{item.name}}
      </div>
    </div>
<!--    手动备份-->
    <div>
<!--      <p>请根据需求选取您需要备份的内容</p>-->
<!--      <div class="contents m-t-20 w-60 display_flex wrap">-->
<!--        <div class="m-l-20" style="width: 200px;margin-top: 5px" v-for="(item,index) in checkBoxData" :key="index">-->
<!--            <el-checkbox :title="item.name" v-model="item.check" @change="select(item)">{{item.name}}</el-checkbox>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="display_flex w-50 m-t-50"  v-if="boxName === '1'">-->
<!--        <span style="width: 80px;font-size: 14px">备份类型：</span>-->
<!--        <el-radio-group v-model="dataType">-->
<!--          <el-radio v-for="(item, index) in [-->
<!--              // {id:0,name:'只备份表结构'},-->
<!--              {id:1,name:'只备份表数据'},-->
<!--              {id:2,name:'备份表结构+数据'},-->
<!--          ]" :key="index" :label="item.id">{{ item.name }}</el-radio>-->
<!--        </el-radio-group>-->
<!--      </div>-->
      <div v-if="boxName === '1' || boxName === '3'">
        <div class="display_flex w-40 m-t-50">
          <span class="less" style="width: 150px;font-size: 14px">邮箱地址：</span>
          <el-input type="email" placeholder="请输入邮箱地址"  v-model="email"></el-input>
          <el-checkbox class="m-l-20" v-model="checkedMail">发送至邮箱</el-checkbox>
        </div>
        <p style="margin-top: 50px;color: #CB0000;font-family: Source Han Sans CN-Regular, Source Han Sans CN;">
          {{boxName === '1' ? "*即将备份系统数据库中的全部数据，涉及到馆藏信息及用户信息，备份成功后，请妥善保管" : boxName === '3'?'*压缩文件不支持备份恢复，恢复时请确认备份文件为解压缩状态':'' }}</p>
        <div class="display_flex m-t-20">
          <!--        <el-checkbox style="width: 60px" v-model="checkedAll" @change="changeAll">全选</el-checkbox>-->
          <el-button size="medium" type="primary" @click="backUp" :loading="backUpLoading">{{ boxName === '1' ? '备份' :'恢复' }}</el-button>
        </div>
      </div>
    </div>

<!--    备份恢复-->
    <div v-if="boxName === '3'">
      <el-upload
          style="opacity: 0;margin-top: 200px"
          class="upload-demo"
          ref="upload"
          action="/other/uploadFile"
          accept=".sql"
          :file-list="fileList"
          :headers="headers"
          :data='uploadTypes'
          :before-upload='beforeUpload'
          :on-success="handleAvatarSuccess"
          :on-change="beforeAvatarUpload"
          :show-file-list="false"
          :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
    </div>


    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        top='30vh'
        width="380px">
      <span style="font-size: 20px;color: red;font-weight: bold"><i class="el-icon-s-opportunity" style="font-size: 30px;color: #E6A23C"></i>  是否确认初始化?此操作不可逆！</span>
      <p style="margin-top: 20px">
        <el-input placeholder="请输入验证码" v-model="codePassword">
          <i slot="suffix">
            <span class="suff" @click="getCode">{{code}}</span>
          </i>
        </el-input>

      </p>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:['isOpen'],
  data(){
    return{
      checkedMail:true,
      checkedAll:false,
      dialogVisible:false,
      backUpLoading:false,
      email:'',
      code:'',
      codePassword:'',
      boxName:'',
      dataType:2,
      fileList:[],
      headers:{
        accessToken:JSON.parse(localStorage.getItem("user")).token
      },
      uploadTypes:{
        type:4
      },
      listTitle:[
        {name:'手动备份',type:'1'},
        {name:'一键格式化',type:'2'},
        {name:'备份恢复',type:'3'}
      ],
      checkBoxData:[],
    }
  },
  methods:{
    backUp(){
      // if(this.mapBookList().length === 0){
      //   return this.$message.error('请选取您需要备份的内容')
      // }
      if(this.checkedMail && !this.email){
        return this.$message.error('请输入邮箱地址')
      }
      if(this.checkedMail && !this.$filters.checkEmail(this.email)){
        return this.$message.error('输入的邮箱格式不正确')
      }

      if(this.boxName === '1'){
        let params = {
          dataType: this.dataType,
          // tables: this.checkedAll ? [] : this.mapBookList(),
          sendEmail: this.checkedMail ? 1 :0,
          email: this.email
        }
        this.backUpLoading = true
        this.ax.post('/manage/unit/system/dbbackup/manualBackup',params).then(res=>{
          if(res.msg === '备份成功'){
            this.$message.success(res.msg);
            window.location = res.filePath;
          }else {
            this.$message.error(res.msg);
          }
          this.backUpLoading = false
        }).catch(err=>{
          this.backUpLoading = false
        })
      }else {
        this.$nextTick(()=>{
          this.$refs.upload.clearFiles();
          this.$refs.upload.$children[0].$refs.input.click();
        })
      }

    },

    select(item){
      let checkTrue = this.checkBoxData.filter(it=>it.check);
      if(checkTrue.length === this.checkBoxData.length){
        this.checkedAll = true;
      }else {
        this.checkedAll = false;
      }
    },
    changeAll(){
        this.checkBoxData.map(it=>{
            if(this.checkedAll){
              it.check = true;
            }else {
              it.check = false;
            }
        })
    },
    mapBookList(){
      let list = this.checkBoxData.filter(it=>it.check);
      return list.map(e=>e.table);
    },
    beforeAvatarUpload(file){
      if(file.raw){
        this.$refs.upload.submit();

      }else {
        this.$message.error('没有找到文件信息')
      }
    },
    handleAvatarSuccess(e){
      if(e.code === 200){
        this.rollBack(e.data);
      }else {
        this.$message.error('上传文件失败')
      }
    },
    beforeUpload(e){
      if(e.name.indexOf('.sql') === -1){
        this.$message.warning('上传的文件类型错误，只能上传.sql文件')
        return false
      }
    },
    //备份恢复
    rollBack(file){
      let params = {
        filePath: file,
        sendEmail: this.checkedMail ? 1 :0,
        email: this.email
      }
      this.loading();
      this.ax.post('/manage/unit/system/dbbackup/rollback',params).then(res=>{
        this.$message.success('备份恢复成功');
        this.sloading();
      }).catch(err=>{
        this.sloading();
      })
    },
    getCheckBoxData(){
      this.loading();
      this.ax.get('/manage/unit/system/dbbackup/getTables').then(res=>{
        res.map(it=>{
          it.check = false;
        })
        this.checkBoxData = res;
        this.sloading();
      }).catch(err=>{
        this.sloading();
      })
    },

    getList(e){
      this.boxName = e.type;
      this.email = '';
      this.checkedMail = true;
      // if(e.type === '1'){
      //   this.getCheckBoxData();
      // }

      if(e.type === '2'){
        this.dialogVisible = true;
        this.getCode();
      }
    },
    getCode(){
      let code = '';
      let codeLength = 4;
      let random = new Array(0,1,2,3,4,5,6,7,8,9);
      for(let i  = 0;i< codeLength;i++){
        let index = Math.floor(Math.random()*9);
        code+=random[index];
      }
      this.code = code;
    },
    save(){
      if(!this.codePassword){
        return this.$message.error('请输入验证码');
      }
      if(this.codePassword!==this.code){
        this.$message.error('输入的验证码不一致');
        this.getCode();
        return
      }
      this.loading();
      let params={
        platformId:JSON.parse(localStorage.getItem("user")).platform.id
      }
      this.ax.post('/manage/unit/system/systemSettings/platoform', params)
          .then(res => {
            this.sloading();
            this.dialogVisible = false
            this.$message.success('初始化成功,请重新登录');
            localStorage.removeItem("user");
            localStorage.removeItem('admin');
            if (localStorage.getItem('alone') == 1) {
              localStorage.removeItem('alone');
              let path = '/loginAlone?id=' + localStorage.getItem('platformId')
              this.$router.push(path);
            } else if (localStorage.getItem('alone') == 2) {
              localStorage.removeItem('alone');
              let path = '/loginAll?id=' + localStorage.getItem('platformId')
              this.$router.push(path);

            } else if (localStorage.getItem('alone') == 3) {
              localStorage.removeItem('alone');
              let path = '/singleVisionLogin?id=' + localStorage.getItem('platformId')
              this.$router.push(path);
            }
            else {
              this.$router.push({path:"/login"})
            }

          })
          .catch(res => {
            this.sloading();
            this.dialogVisible = false
          });
    }
  }
}
</script>
<style scoped>
.contents{
  height: calc(100vh - 500px);
  overflow-y: auto;
}
.tips{
  color: red;
  font-size:18px;
}
/deep/.suff{
  width: 60px;
  display: block;
  margin-top: 1px;
  margin-left: 5px !important;
  padding: 2px;
  color: #fff;
  background-color: #0c9bfa;
  font-size: 20px;
}
/deep/.el-input__suffix{
  right: 0!important;
}
/deep/.el-checkbox{
  display: flex;
  align-items: center;
}
/deep/.el-checkbox__label{
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tabsBox .title_box{
  width:5.75rem;
  height:2.38rem;
  background:#ffffff;
  border:1px solid #e6e6e6;
  border-radius:5px;
  text-align: center;
  line-height: 2.38rem;
  font-size: 0.88rem;
  color: #333;
  margin-right: 1.44rem;
  cursor: pointer;
}
.tabsBox .active,.tabsBox .title_box:hover{
  background: #267FF9;
  color: #fff;
  transition: 0.5s;
}
</style>
