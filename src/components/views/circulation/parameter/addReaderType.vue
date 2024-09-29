 <template>
    <div class="container" :style='height'>
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               编辑读者类型
           </div>
           <div class="display_flex">
                 <el-button-group>
                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-collection' @click="save('form')" >保存</el-button>
                    <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                </el-button-group>
                <!-- <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div>
                <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
            </div>
       </div>
       <div class="padding_20">
           <view-form :row='3' :list='title' ref="form" :rule='rules'  @getForm='getForm' :model='form'></view-form>
       </div>
    </div>
</template>

<script>
import viewForm from '../../../view/form'
export default {
    components:{
        viewForm
    },
    data() {
        return {bus: this.bus(this),

           height:'',
            model:{},
           form:{
             
           },
           title:[
                 {name:'读者类型名称',id:'name',code:'name'},

                 {name:'读者证有效天数',id:'effectiveDay',code:'effectiveDay'},

                 {name:'最大借书量',id:'maxBooks',code:'maxBooks'},

                 {name:'读者证押金',id:'deposit',code:'deposit'},

                //  {name:'超期可借',id:'publisherFiled',code:'publisherCode'},

                //  {name:'最大预约册数',id:'keywordsFiled',code:'keywordsCode'},

                //  {name:'预约取书天数',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'开通预约',id:'classificationNumberFiled',code:'classificationNumberCode'},  

                // {name:'开通预借',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'服务费',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'最大预借册数',id:'classificationNumberFiled',code:'classificationNumberCode'},  

                // {name:'预借取书天数',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'工本费',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'违章停借次数',id:'classificationNumberFiled',code:'classificationNumberCode'},

                // {name:'欠款限额',id:'classificationNumberFiled',code:'classificationNumberCode'},


              
           ],
           option:[
                {code:'690',marcField:'ClassificationNumber',id:'690'},
                {code:'200',marcField:'FirstResponsible',id:'200'},
                {code:'010',marcField:'ISBN',id:'010'},
                {code:'606',marcField:'KEYWORDS',id:'606'},
                {code:'200',marcField:'PositiveTitle',id:'220'},
                {code:'210',marcField:'PUBLISHER',id:'210'}
           ],
           options:[
             
           ],

           rules:{
               deposit: [{ required: true, message: '请选择', trigger: 'blur' }],
                effectiveDay: [{ required: true, message: '请选择', trigger: 'blur' }],
                 maxBooks: [{ required: true, message: '请选择', trigger: 'blur' }],
                  name: [{ required: true, message: '请选择', trigger: 'blur' }],
                
           }
        };
    },
    created() {
      this.height = this.$height()
      if(this.$route.query.params){
          // console.log(this.$route.query.params)
          this.form = JSON.parse(this.$route.query.params)
      }
      
    },
    methods: {
        getForm(val){
            this.form = val
            // // console.log(val)
        },
         // 新增保存
        save(formName) {
          
         
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/circulation/circulationParameters/readerType', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/readerType`, res);
                                this.back()
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
        }
       
    }
};
</script>

<style>

</style>
