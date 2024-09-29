 <template>
    <div class="container" :style="height">
        <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               MARC索引重建
           </div>

         </div>
         <div class="padding_20">
             <el-tabs v-model="marcType">
                <el-tab-pane label="图书类" name="BOOK"></el-tab-pane>
                <el-tab-pane label="期刊类" name="JOURNAL"></el-tab-pane>
            </el-tabs>
             <el-button type="primary" @click="reconstruction" class="m-b-45">索引重建</el-button>
             <div class="f-s-14 text_dan">
                 <div>数目库和套录库的元数据，根据题名、标准编号、分类号等从MARC信息中提取设置的相关字段建立索引供搜索</div>
                 <div>索引重建即将原索引清空，然后根据元数据重新生成索引</div>
                 <div>索引重建过程中，管理系统内部的查询将失效，OPAC不受影响，如果元数据变动较大，则索引重建后要将OPAC的索引重建</div>
                 <div>索引重建需要较长时间，需要谨慎！</div>
             </div>
         </div>
    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
            height:'',
            marcType:'BOOK'
        };
    },
    created() {
       this.height= this.$height()
    },
    methods: {
      reconstruction(){
          this.$confirm('是否确认进行索引重建?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loading()
            this.ax.get('/manage/unit/system/systemSettings/marcIndexRestore',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType:this.marcType}})
                .then(res=>{
                     this.sloading()
                    this.$message({
                        type: 'success',
                        message: '索引重建成功!'
                    });
                })
          
        }).catch(() => {
                  this.sloading()
        });
      },
    }
};
</script>

<style>
.text_dan div{
    line-height: 1.25rem;
    height: 1.25rem;
    color: #FF0000;
}
</style>
