 <template>
    <div class="container" :style='height'>
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               财务统计预览
           </div>
           <div class="display_flex">
               <el-button-group>
                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                    <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                </el-button-group>
              
            </div>
       </div>
       <div class="padding_20 titleText ">
                <div class="display_flex titleName">
                    <div class="w-30">类目</div>
                    <div class="w-30">名称</div>
                    <div class="w-40">统计金额</div>
                </div>
                 <div class="display_flex  titleBody">
                    <div class="w-30 ">
                         财务统计
                    </div>
                    <div class="w-30">
                        <div>收费</div>
                        <div>退费</div>
                      
                    </div>
                    <div class="w-40">
                        <div>{{info.toll}}</div>
                        <div>{{info.refund}}</div>
                       
                    </div>
                </div>
                <div class="display_flex   titleBody">
                    <div class="w-30">
                         收费类型
                    </div>
                    <div class="w-30">
                        <div>超期罚款</div>
                        <div>污损罚款</div>
                        <div>丢失罚款</div>
                        <div>借书证押金</div>
                    </div>
                    <div class="w-40">
                        <div>{{info.overdueFine}}</div>
                        <div>{{info.damageFine}}</div>
                        <div>{{info.lostFine}}</div>
                        <div>{{info.depositBook}}</div>
                    </div>
                </div>
                <div class="display_flex  titleBody">
                    <div class="w-30">
                         收费状态
                    </div>
                    <div class="w-30">
                        <div>支付</div>
                        <div>未支付</div>
                    </div>
                    <div class="w-40">
                        <div>{{info.payed}}</div>
                        <div>{{info.unpaid}}</div>
                    </div>
                </div>

       </div>
    </div>
</template>

<script>

export default {
    components:{
       
    },
    data() {
        return {bus: this.bus(this),
            info:{},
            height:'',

        };
    },
    created() {
        // console.log()
        this.getSelect(JSON.parse(this.$route.query.info))
        this.height = this.$height()
    },
    methods: {
        getSelect(params){
            this.ax.get('/manage/unit/circulation/financeManagement/financeStatistics',{params})
                .then(res=>{
                    
                    this.info = res
                })
        },
        exportAll(){
          this.loading()
            this.ax.get('/manage/unit/circulation/financeManagement/financeExcel',{params:this.info})
                .then(res=>{
                    this.FileSaver.saveAs(res,"数据导出.xls")
                  this.sloading()
                }).catch(err=>{
              this.sloading()
            })
        },
       
    }
};
</script>

<style scoped>
    .titleName{
        width:100%;
        height:40px;
        background:rgba(241,245,249,1);
        text-align: center;
    }
    .titleText{
        height:20px;
        font-size:14px;
        font-weight:normal;
        line-height:20px;
        color:rgba(48,49,57,1);
    }
    .titleBody{
        border: 1px solid #e9e9e9;
        /* border-right: 0; */
    }
    .titleBody div:first-child{
        height: 100%;
        /* line-height: 100%; */
    }
    .titleBody div{
         /* height: 228px; */
        /* border: 1px solid #e9e9e9; */
        text-align: center;
        /* line-height: 220px; */
    }
    .titleBody div div{
        height: 55px;
        border-left: 1px solid #e9e9e9;
        text-align: center;
        line-height: 55px; 
    }
    .titleBody div div:not(:last-child){
            border-bottom: 1px solid #e9e9e9;
    }
</style>
