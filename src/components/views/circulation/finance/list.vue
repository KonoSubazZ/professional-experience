 <template>
    <div class="container" :style='height'>
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               财务清单
           </div>
           <div class="display_flex">
                <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                    <div class="f-s-14">报表预览</div>
                </div>
            </div>
       </div>
       <div class="padding_20">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">

                         <el-form-item label="读者证号" prop='number' class="w-100" >
                                <el-input v-model="form.number" class="w-100"></el-input>
                         </el-form-item>

                          <el-form-item label="添加日期" prop='time' class="w-100" >
                               <el-date-picker
                                    v-model="time"
                                    type="datetimerange"
                                    class="w-100"
                                    @change="getTime"
                                     value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                    </el-date-picker>
                         </el-form-item>
                    
                      
                            <!-- <el-form-item label="读者单位" prop='managerId' class="w-100">
                                <el-select v-model="form.managerId" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in readerUnits"
                                    :key="items.id" 
                                    :label="items.name"
                                    :value="items.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->

                             <el-form-item label="财务类型" prop='financeType' class="w-100">
                                <el-select v-model="form.financeType" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in financeType"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                             <el-form-item label="收费方式" prop='chargeMethod' class="w-100">
                                <el-select v-model="form.chargeMethod" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in chargeMethod"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                             <el-form-item label="收费状态" prop='chargeStatus' class="w-100">
                                <el-select v-model="form.chargeStatus" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in chargeStatus"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                               <!-- <el-form-item label="操作人" prop='managerId' class="w-100">
                                <el-select v-model="form.managerId" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in managers"
                                    :key="items.id"
                                    :label="items.name"
                                    :value="items.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->
                </el-form>
       </div>
    </div>
</template>

<script>

export default {
    components:{
       
    },
    data() {
        return {bus: this.bus(this),
            time:'',
            height:'',
            readerUnits:[],
            financeType:[],
            chargeType:[],
            chargeStatus:[],
            chargeMethod:[],
            form:{
            },
           rules:{
                // number: [{ required: true, message: '请输入', trigger: 'blur' }],
           }
        };
    },
    created() {
        this.getSelect()
        this.height = this.$height()
        this.metaList()
    },
    methods: {
        getSelect(){
            this.ax.get('/manage/unit/circulation/financeManagement/parametersForGetFinanceChecklist')
                .then(res=>{
                    // // console.log(res)
                    this.managers = res.managers
                    // this.readerUnits = res.managers
                })
        },
        getTime(val){
            // // console.log(val)
             this.form.start = val[0]
            this.form.end = val[1]

        },
          // 新增保存
        save(formName) {
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$router.push({
                            path:'/circulation/finance/list/listInfo',
                            query:{info:JSON.stringify(this.form)}
                        })
                    } else {
                        this.sloading();
                        this.$message.error('请根据提示输入');
                        return false;
                    }
            });
        },
         metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Finance' } }).then(res => {
                res.insertable = false
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if(it.key == 'financeType'){
                        this.financeType = it.searchOption
                    }
                    if(it.key == 'chargeType'){
                        this.chargeType = it.searchOption
                    }
                    if(it.key == 'chargeStatus'){
                        this.chargeStatus = it.searchOption
                    }
                    if(it.key == 'chargeMethod'){
                        this.chargeMethod = it.searchOption
                    }
                });
                // console.log(res);
                this.meta = res;
            });
        }
       
    }
};
</script>

<style>

</style>
