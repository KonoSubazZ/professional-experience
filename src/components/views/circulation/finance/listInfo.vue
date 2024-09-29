 <template>
    <div class="container" :style='height'>
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               财务清单预览
           </div>
           <div class="display_flex">
               <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div>
                <div class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                    <div class="f-s-14">导出</div>
                </div>
                <div  class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                    <div class="f-s-14">打印</div>
                </div>
            </div>
       </div>
       <div class="padding_20">
             <List
                :data='table'
                :disableMeta="true"
                :tableMeta="meta"
                :disableTableAction='true'
                @search='searchInfo'
                ref="list"
            >
            </List>
       </div>
    </div>
</template>

<script>
import List from '../../../view/List'
export default {
    components:{
       List
    },
    data() {
        return {bus: this.bus(this),
            table:[],
            height:'',
            meta:''
            
        };
    },
    created() {
        this.getSelect(JSON.parse(this.$route.query.info))
        this.metaList()
        this.height = this.$height()
    },
    methods: {
        getSelect(params){
            this.ax.get('/manage/unit/circulation/financeManagement/financeChecklist',{params})
                .then(res=>{
                    // // console.log(res) 
                    this.table = res
                    // this.readerUnits = res.managers
                })
        
      
        },
        searchInfo(val){
            // console.log(val)
        },
          metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Finance' } }).then(res => {
                res.insertable = false
                res.edit='NONE'
                res.delete='NONE'
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                       
                    }
                   it.searchable = false;
                });
                // console.log(res);
                this.meta = res;
            });
        }
       
    },
  
};
</script>

<style>

</style>
