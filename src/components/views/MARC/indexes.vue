 <template>
    <div class="container">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               MARC索引设置
           </div>
           <div class="display_flex">
                <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div>
            </div>
       </div>
       <div class="padding_20">
            <el-tabs v-model="form.marcType" @tab-click="handleClick">
                <el-tab-pane label="图书类" name="BOOK"></el-tab-pane>
                <el-tab-pane label="期刊类" name="JOURNAL"></el-tab-pane>
            </el-tabs>

             <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">
                      
                    <div v-for="(item) of title" :key="item.id">
                        <el-form-item :label="item.name"  :prop='item.id'>   
                            <!--  -->
                            <el-select v-model="form[item.id]" clearable placeholder="请选择" class="w-100" @change="getCode(item)">
                                <el-option
                                v-for="item in option"
                                :key="item.id"
                                :label="item.code"
                                :value="item.marcField">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>



            </el-form>
       </div>
    </div>
</template>

<script>
export default {

    data() {
        return {bus: this.bus(this),

           loadings:false,

           form:{
               marcType:'BOOK'
           },
           title:[
                 {name:'ISBN/ISSN',id:'isbnFiled',code:'isbnCode'},
                 {name:'统一书刊号',id:'bookNumberFiled',code:'bookNumberCode'},
                 {name:'题名',id:'positiveTitleFiled',code:'positiveTitleCode'},
                 {name:'第一责任者',id:'firstResponsibleFiled',code:'firstResponsibleCode'},
                 {name:'出版者',id:'publisherFiled',code:'publisherCode'},
                 {name:'主题词',id:'keywordsFiled',code:'keywordsCode'},
                 {name:'分类号',id:'classificationNumberFiled',code:'classificationNumberCode'},
              
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
               isbnFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                classificationNumberFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                 keywordsFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                  publisherFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                    firstResponsibleFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                    positiveTitleFiled: [{ required: true, message: '请选择', trigger: 'change' }],
                    bookNumberFiled: [{ required: true, message: '请选择', trigger: 'change' }],          
            //    name: [{ required: true, message: '请选择', trigger: 'blur' }],

           }
        };
    },
    created() {
        // this.getOptions()
        this.getFrom()
    },
    methods: {
        // 切换
        handleClick(){
            // this.getOptions()
            this.getFrom()
        },
        // // 获取select
        // getOptions(){
        //     this.ax.get("/manage/unit/system/systemSettings/marcFieldDetailForMarcIndexInsert",{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType:this.form.marcType}})
        //         .then(res=>{
        //             // console.log(res)
        //             // res.content.map(it=>{
        //             //     it.marcField = it.
        //             // })
        //             this.options = this.option.concat(res.content)
        //             // this.options = res.content
        //         })
        // },
        // 获取索引
        getFrom(){
            this.ax.get('/manage/unit/system/systemSettings/marcIndex',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType:this.form.marcType}})
                .then(res=>{
                    // console.log(res)
                    this.form =res
                })
        },
        // 获取code
        getCode(value){
            // // console.log(this.options)
            // // console.log(value)
            this.options.map(it=>{
                if(it.marcField == this.form[value.id]){
                    this.form[value.code] = it.code
                }
            })
        },
         // 新增保存
        save(formName) {
            this.loading();
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.sloading();
                        this.ax
                            .post('/manage/unit/system/systemSettings/marcIndex', this.form)
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
