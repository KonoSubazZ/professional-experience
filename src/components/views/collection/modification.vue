 <template>
    <div class="container"  :style="'height:'+height+'px'" >
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
                馆藏批处理
           </div>
           <div class="display_flex">
                <!-- <div @click="search('form')" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/search.png" class="btn_img" />
                    <div class="f-s-14">搜索</div>
                </div> -->
                <el-button type="primary"  @click="search('form')">搜索</el-button>
            </div>
       </div>
       <div class="padding_20">
           <form-view :list="list" :labelWidth='"80px"' :row="3" :model='form' @getForm="getForm" @getFormTwo="getFormTwo"></form-view>          
       </div>
        <!-- 确认弹框 -->
         <el-dialog
            title="馆藏批处理"
            :visible.sync="showModel"
            width="80%"
            :close-on-click-modal="false"
            >

            <form-view :list="lists" :row="3" :model='forms' @getForm="getForms"></form-view>
          <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               书目信息
           </div>
           <div class="display_flex">
              
        </div>
       </div>
        <div class="padding_20 m-b-80" >
               
                        <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="searchInfo.content"
                            tooltip-effect="dark"
                            style="width: 100%"
                           
                           >
                           <el-table-column
                            prop="barCode"
                            label="文献条码">
                            </el-table-column>

                             <el-table-column
                            prop="positiveTitle"
                            label="题名">
                             </el-table-column>

                              <el-table-column
                            prop="isbn"
                            label="ISBN">
                             </el-table-column>
                            
                            <el-table-column
                            prop="callNumber"
                            label="索书号">
                             </el-table-column>

                              <el-table-column
                            prop="bookStatus"
                            label="状态">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.bookStatus=='LEND'?'借出':scope.row.bookStatus=='InCollection'?'在馆':scope.row.bookStatus=='CULLING'?'注销':scope.row.bookStatus=='LOST'?'遗失':'损坏'}}
                                </div>
                            </template>
                            </el-table-column>

                             <el-table-column
                            prop="price"
                            label="单价">
                             </el-table-column>
                            

                             <el-table-column
                            prop="batchName"
                            label="编目批次">
                             </el-table-column>
                           
                            <el-table-column
                            prop="collectionPlaceName"
                            label="馆藏地址">
                             </el-table-column>
                          <el-table-column
                              prop="collectionPlaceName"
                              label="文献流通类型">
                            <template slot-scope="scope">
                              {{lists[3].options.filter(e=>e.id===scope.row.documentCirculationTypeId)[0].name}}
                            </template>
                          </el-table-column>
                            

                          
                            
                           
                        </el-table>
                        <el-pagination
                            
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 100, 200, 500]"
                            :page-size="pageSize"
                            layout=" prev, pager, next, jumper,total,sizes"
                            :total="total">
                        </el-pagination>
 
        </div>
            
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="nowDo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import formView from '../../view/form';
export default {
    components:{
       formView
    },
    data() {
        return {
            showModel:false,
            pageSize:5,
            total:0,
            currentPage:1,
            searchInfo:{},
            form:{},
            forms:{},
         list:[
             {name:'编目批次',id:'batchId',relation:'batchName',type:'select',options:[]},
             {name:'ISBN',id:'isbn'},
             {name:'馆藏地',id:'collectionPlaceId',relation:'collectionPlaceName',type:'select',options:[]},

             {name:'索书号',id:'callNumberStart',end:'callNumberEnd',type:'around'},
             {name:'图书状态',id:'bookStatus',type:'select',options:[]},
             {name:'入库时间',id:'warehousingTimeStart',end:'warehousingTimeEnd',type:'aroundTimes',},

             {name:'文献条码',id:'barCodeStart',end:'barCodeEnd',type:'around'},
             {name:'文献类型',id:'medium',type:'select',options:[]},
         ],
         lists:[
             {name:'编目批次',id:'batchId',relation:'batchName',type:'select',options:[]},
             {name:'馆藏地',id:'collectionPlaceId',relation:'collectionPlaceName',type:'select',options:[]},
             // {name:'图书状态',id:'bookStatus',type:'select',options:[]},
             {name:'入库时间',id:'warehousingTime',type:'times'},
           {name:'文献流通类型',id:'documentCirculationTypeId',type:'select'},
         ],
          height:''
          
        };
    },
    created() {
       this.getPlace()
      this.getCirculation()
       this.getBitch()
       this.metaLists()
       this.ax.get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting', {
                        params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                    })
                    .then((res) => {
                        //  ////  //  // // console.log(res)
                        this.list[7].options = res.mediums
                    });
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
        handleCurrentChange(val){
            this.currentPage = val
            this.search()
        },
        handleSizeChange(val){
            this.pageSize=val
            this.search()
        },
        getForm(val){
        console.log(val,'---val');
            this.form = val
            delete this.form.batchName
        },
        // 20231118新增的---修改了这里
        getFormTwo(val){
          // 文献类型需要名字不需要id
          this.form.medium = val.name
        },
        getForms(val){
          console.log(val)
            this.forms =val
        },
         // 获取馆藏地
        getPlace() {
            this.ax.get('/manage/unit/report/journalReport/bookCollection',{params:{ platformId :JSON.parse(localStorage.getItem("user")).platform.id }}).then(res => {
                this.list[2].options = res.content;
                 this.lists[1].options = res.content;
            });
        },
      getCirculation(){
        let params = {
          platformId:JSON.parse(localStorage.getItem('user')).platform.id
        }
        this.ax.get('/manage/unit/circulation/circulationParameters/getDocumentCirculationTypeAll', {params})
            .then(res => {
              this.lists[3].options = res
            })
      },
        nowDo(){
            this.loading()
            
            let params ={
                collectionBatchUpdateReq:this.forms,
                collectionBatchResList:this.searchInfo.content,
                query:this.form
            }
            this.ax.post('/manage/unit/catalog/collectionHandling/collectionBatch',params)
                .then(res=>{
                     this.sloading()
                     this.$message.success('修改成功');
                     this.showModel=false
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 获取批次
        getBitch(){
            this.ax.get('/manage/unit/report/journalReport/journalBaseBatch',{params:{ platformId :JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.list[0].options = res.content;
                    this.lists[0].options = res.content;
                })
        },
         metaLists() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'bookStatus') {
                       this.lists[2].options = this.list[4].options = it.searchOption.map(it=>{
                            it.id = it.key
                            return it
                        })
                      
                    }
                });
            });
        },
        search(){
            this.loading();
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            this.form.size = this.pageSize
            this.form.page = this.currentPage 
            this.ax.get('/manage/unit/catalog/collectionHandling/collectionBatch',{params:this.form})
                .then(res=>{
                    // console.log(res)
                  this.sloading();
                  if(res.content.length>0){
                            this.showModel = true
                            this.searchInfo = res
                            this.total =res.totalElements
                            
                    }else{
                        return this.$message.warning('当前没有检索到数据');
                    }
                }).catch(err=>{
              this.sloading();
            })
        },
       
    }
};
</script>

<style>

</style>
