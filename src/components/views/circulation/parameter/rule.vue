 <template>
    <div class="container" :style="'height:'+height+'px'">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               本馆读者基础流通规则 
           </div>
           <div class="display_flex">
                <el-button-group>
                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-collection' @click="save('form')" >保存参数</el-button>
                    <el-button type="primary" plain icon="el-icon-collection"  @click="jump" >特殊流通规则</el-button>
                </el-button-group>
                <!-- <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存参数</div>
                </div>
                <div @click="jump" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/rule.png" class="btn_img" />
                    <div class="f-s-14">特殊流通规则</div>
                </div> -->
            </div>
       </div>
       <div class="padding_20">
           <view-form :row='3' :list='title' ref="form" :rule='rules'  @getForm='getForm' :model='model'></view-form>
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
                //  {name:'状态',id:'status',type:'select',options:[{name:'启用',id:'ENABLE'},{name:'禁用',id:'DISABLE'}]},

                 {name:'超期每天罚金',id:'overdueFine',isNumber:true},

                 {name:'最大借书天数',id:'maxBorrowingDays',isNumber:true},

                 {name:'最大续借次数',id:'maxRenewals',isNumber:true},

                 {name:'续借天数',id:'renewalsDay',isNumber:true},

                 {name:'丢书罚款倍率',id:'lostFineRate',isNumber:true},

                 {name:'污损罚款倍率',id:'damageFineRate',isNumber:true},

                {name:'超期最大罚款金额',id:'maxOverdueFine',isNumber:true},

                {name:'超期是否罚款',id:'fineOrNo',options:[{name:'是',id:true},{name:'否',id:false}],type:'radio'},
             {name:'图书超期不可归还',id:'restitutionOrNo',options:[{name:'是',id:true},{name:'否',id:false}],type:'radio'},

           ],

           rules:{
            //    status: [{ required: true, message: '请选择', trigger: 'change' }],

                overdueFine: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                maxBorrowingDays: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                maxRenewals: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                renewalsDay: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                lostFineRate: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                damageFineRate: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                maxOverdueFine: [{ required: true, message: '请输入', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],

                
           }
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });

      this.getRule()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getForm(val){
            this.form = val
            // console.log(val)
        },
        getRule(){
            this.ax.get('/manage/unit/circulation/circulationParameters/circulationRules')
                .then(res=>{
                    // console.log(res)
                    this.model = res
                })
        },
        // 特殊
        jump(){
            this.$router.push('/circulation/parameter/rule/addRule')
        },
         // 新增保存
        save(formName) {
            if(!this.form.id){
               this.form = this.model
            }
            if(this.form.maxBorrowingDays==0){
              return this.$message.error('最大借书天数不能为0')
            }
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/circulation/circulationParameters/circulationRules', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
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
