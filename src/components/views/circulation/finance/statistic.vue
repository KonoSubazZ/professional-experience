 <template>
    <div class="container" :style="'height:'+height+'px'">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               财务统计
           </div>
           <div class="display_flex">
                <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="save('form')" >报表预览</el-button>
                <!-- <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                    <div class="f-s-14">报表预览</div>
                </div> -->
            </div>
       </div>
       <div class="padding_20">
            <form-data :row="1" :list="list" :model ="form" @getForm="getForm" @getFormTwo="getFormTwo"></form-data>
                <!-- <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">

                         <el-form-item label="读者证号"  class="w-100" >
                                <el-input v-model="form.number" class="w-100"></el-input>
                         </el-form-item>

                         <div class="display_flex between">
                            <el-form-item label="读者单位"  class="w-100">
                                <el-select v-model="form.readerUnitName" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in readerUnit"
                                    :key="items.id"
                                    :label="items.name"
                                    :value="items.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                           
                       </div>


                          <el-form-item label="添加日期"  class="w-100" >
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
                    
                       <div class="display_flex between">
                            <el-form-item label="操作人"  class="w-100">
                                <el-select v-model="form.managerId" class="w-100" clearable  placeholder="请选择" >
                                    <el-option
                                    v-for="items in manager"
                                    :key="items.id"
                                    :label="items.name"
                                    :value="items.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                           
                       </div>

                </el-form> -->
       </div>
    </div>
</template>

<script>
import formData from '../../../view/form';
export default {
    components:{
       formData
    },
    data() {
        return {bus: this.bus(this),
            time:'',
            height:'',
            manager:[],
            readerUnit:[],
            form:{
            },
            list:[
                {name:'读者证号',id:'number'},
                { name: '读者单位', id: 'readerUnitNameTree', type: 'selectTree', options: [] },
                  {name:'添加日期',id:'start',end:'end',type:'aroundTimes'},
                   {name:'操作人',id:'managerId',type:'select',options:[]},
            ],
            rules:{
                    // number: [{ required: true, message: '请输入', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.getSelect()
        this.getUnit()
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getForm(val){
            this.form =val
        },
        getFormTwo(val){
            console.log(val,'val');
            this.form.readerUnitName = val.name
            // this.form =val
        },
        getUnit(){
            this.ax.get('/manage/unit/report/journalReport/readerUnit',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1}})
                .then(res=>{
                    this.list[1].options  = res.content
                })
        },
        getSelect(){
            this.ax.get('/manage/unit/circulation/financeManagement/parametersForGetFinanceChecklist')
                .then(res=>{
                    // // console.log(res)
                    this.list[3].options = res.managers
                })
        },
        getTime(val){
            // // console.log(val)
             this.form.start = val[0]
            this.form.end = val[1]

        },
          // 新增保存
        save(formName) {
            console.log(this.form,'--this.form');
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              
                   
                        this.$router.push({
                            path:'/circulation/finance/statistic/statisticList',
                            query:{info:JSON.stringify(this.form)}
                        })
                    
        }
       
    }
};
</script>

<style>

</style>
