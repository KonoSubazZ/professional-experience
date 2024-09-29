 <template>
    <div class="container">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               书目详情
           </div>
           <div @click="back" class="text_center cursor m-r-20">
                    <img src="../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
            </div> 
       </div>

       <div class="padding_20 m-b-80">
            <div class="display_flex ">
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">正题名：</span>
                    <span class='info' :title="info.bookBase.positiveTitle">{{info.bookBase.positiveTitle}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">第一责任者：</span>
                    <span class='info' :title="info.bookBase.firstResponsible">{{info.bookBase.firstResponsible}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">副题名：</span>
                    <span class='info' :title="info.bookBase.subTitle">{{info.bookBase.subTitle}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">并列题名：</span>
                    <span class='info' :title="info.bookBase.tiedTitle">{{info.bookBase.tiedTitle}}</span>
                </div>
                 <!-- <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">架位号 </span>
                    <span class='info'>{{info.bookBase.rackName}}</span>
                </div> -->
                
            </div>

             <div class="display_flex between">
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">ISBN：</span>
                    <span class='info' :title="info.bookBase.isbn" >{{info.bookBase.isbn}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">分类号：</span>
                    <span class='info' :title="info.bookBase.classificationNumber">{{info.bookBase.classificationNumber}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">出版社：</span>
                    <span class='info' :title="info.bookBase.publisher">{{info.bookBase.publisher}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">出版时间：</span>
                    <span class='info' :title="info.bookBase.publicationDate">{{info.bookBase.publicationDate}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">出版地：</span>
                    <span class='info' :title="info.bookBase.publisherPlace">{{info.bookBase.publisherPlace}}</span>
                </div>
            </div>

             <div class="display_flex between">
                <!-- <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">批次号：</span>
                    <span class='info' :title="info.bookBase.batchName">{{info.bookBase.batchName}}</span>
                </div> -->
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">入库时间：</span>
                    <span class='info' :title="getTime(info.bookBase.createTime)">{{getTime(info.bookBase.createTime)}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">文献语种：</span>
                    <span class='info' :title="info.bookBase.language">{{info.bookBase.language}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">单价：</span>
                    <span class='info' :title="info.bookBase.price">{{info.bookBase.price}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">版次：</span>
                    <span class='info' :title="info.bookBase.edition">{{info.bookBase.edition}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">页码：</span>
                    <span class='info' :title="info.bookBase.pageNumber">{{info.bookBase.pageNumber}}</span>
                </div>
            </div>

             <div class="display_flex between">
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">其他责任者：</span>
                    <span class='info' :title="info.bookBase.otherResponsible">{{info.bookBase.otherResponsible}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">分辑名：</span>
                     <span class='info' :title="info.bookBase.sectionTitle">{{info.bookBase.sectionTitle}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">分辑号：</span>
                    <span class='info' :title="info.bookBase.sectionNumber">{{info.bookBase.sectionNumber}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">文献介质：</span>
                    <span class='info' :title="info.bookBase.medium">{{info.bookBase.medium}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">丛书名：</span>
                    <span class='info' :title="info.bookBase.seriesTitle">{{info.bookBase.seriesTitle}}</span>
                </div>
            </div>

             <div class="display_flex ">
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">主题词：</span>
                    <span class='info' :title="info.bookBase.keywords">{{info.bookBase.keywords}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">种次号：</span>
                    <span class='info' :title="info.bookBase.speciesNumber">{{info.bookBase.speciesNumber}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">装帧方式：</span>
                    <span class='info' :title="info.bookBase.bindingMethod">{{info.bookBase.bindingMethod}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">附件：</span>
                    <span class='info' :title="info.bookBase.annex">{{info.bookBase.annex}}</span>
                </div>
                
            </div>
       </div>

       <div class="padding_20 header_title  m-b-10">
           书本馆藏信息
       </div>
        <div class="padding_20 m-b-80" >
                        <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="info.books"
                            tooltip-effect="dark"
                            style="width: 100%"
                           
                           >
                           <el-table-column
                            prop="barCode"
                            label="文献条码">
                            </el-table-column>


                            
                            <el-table-column
                            prop="callNumber"
                            label="索书号">
                             </el-table-column>

                             <el-table-column
                            prop="batchName"
                            label="批次号">
                             </el-table-column>

                             <el-table-column
                            prop="rackName"
                            label="架位号">
                             </el-table-column>
                           
                            <el-table-column
                            prop="collectionPlaceName"
                            label="馆藏地址">
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
                            prop="lendNumber"
                            label="借阅次数">
                             </el-table-column>
                            
                           
                        </el-table>
 
        </div>

        <div class="padding_20 header_title  m-b-20">
           超期罚款未支付信息
       </div>
        <div class="padding_20 m-b-80" >
                        <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="info.fines"
                            tooltip-effect="dark"
                            style="width: 100%"
                           
                           >
                           <el-table-column
                            prop="positiveTitle"
                            label="财务类型">
                            </el-table-column>
                            
                            <el-table-column
                            prop="oldBarCode"
                            label="费用金额">
                             </el-table-column>

                             <el-table-column
                            prop="collectionPlaceName"
                            label="财务方式">
                             </el-table-column>
                           
                            <el-table-column
                            prop="publicationDate"
                            label="收费状态">
                             </el-table-column>

                             <el-table-column
                            prop="positiveTitle"
                            label="收费方式">
                            </el-table-column>

                            <el-table-column
                            prop="callNumber"
                            label="读者证号 ">
                             </el-table-column>
                            
                             <el-table-column
                            prop="price"
                            label="读者姓名">
                             </el-table-column>

                              <el-table-column
                            prop="inventoryStatus"
                            label="文献条码">
                             </el-table-column>

                              <el-table-column
                            prop="pageNumber"
                            label="操作人">
                             </el-table-column>

                             <el-table-column
                            prop="pageNumber"
                            label="添加日期">
                             </el-table-column>
                        </el-table>
 
        </div>
    </div>
</template>

<script>
import list from '../../view/List'
export default {
    components:{
        list
    },
    data() {
        
        return {
            info:{}
        };
    },
    created() {
       if(this.$route.query.id){
           this.getInfo(this.$route.query.id)
       }
    },
    methods: {
        getInfo(bookBaseId){
            this.ax.get('/manage/unit/catalog/bookSearch/bookBaseDetail',{params:{bookBaseId}})
                .then(res=>{
                    // console.log(res)
                    this.info = res
                })
        },

    }
};
</script>

<style scoped>
  .label{
    width:120px;
    text-align: right;
    height:1.25rem;
    font-size:0.88rem;
    font-weight:normal;
    line-height:1.25rem;
    display: inline-block;
    color:rgba(153,153,153,1);
   
  }
  .info{
    height:1.25rem;
    font-size:0.88rem;
    width: 160px;
    display: inline-block;
    overflow: hidden;
	text-overflow: ellipsis;
    font-weight:normal;
    line-height:1.25rem;
    color:rgba(51,51,51,1);
    white-space: nowrap;
  }
</style>
