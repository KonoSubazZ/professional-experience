 <template>
    <div class="container" :style="'height:'+height+'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="文献预约" name="RESERVATION"></el-tab-pane>
                <!-- <el-tab-pane label="取消预约" name="CANCEL"></el-tab-pane> -->
            </el-tabs>
        </div>

        <div class="padding_20 m-b-40">
            <div class="display_flex">
                <el-input v-model="form.readerNumber" placeholder="读者证号" class="m-r-20 w-20"  @keyup.enter.native="searchRead"></el-input>

                <el-input v-model="form.isbn" placeholder="ISBN" class="m-r-20 w-20"  id="isbn" @keyup.enter.native="searchInfo"></el-input>

                <el-button type="primary" class="m-r-20"  @click="searchInfo">搜索</el-button>


                 <!-- <el-button type="primary"  class="m-r-20"  v-if="activeName=='RESERVATION'"  @click="borrowBook('RESERVATION')">预约</el-button> -->
                 
            </div>
        </div>
       
        <div class="padding_20 m-b-40" v-if="showRead">
           <div class="title_reader m-b-25" >读者信息</div>
           <div class="display_flex start">
               <img :src="info.reader.photo" class="readerHeader m-r-25">
               <div class="w-90 display_flex start">
                   <div class="w-20 f-s-14 color_3">
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">读者证号</span>
                        <span>{{info.reader.number}}</span>
                    </div>
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">截止日期</span>
                        <span>{{getTime(info.reader.end)}}</span>
                    </div>
                    <div class="m-b-20 cursor color_b" @click="lookReader=true">
                        查看读者信息
                    </div>
                </div>

                    <div class="w-20 f-s-14 color_3">
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">读者姓名</span>
                        <span>{{info.reader.name}}</span>
                    </div>
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">状态</span>
                        <span>{{ status[info.reader.status].name   }}</span>
                    </div>
                </div>

                <div class="w-20 f-s-14 color_3">
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">单位名称</span>
                        <span>{{info.reader.readerUnitName}}</span>
                    </div>
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">读者所属馆</span>
                        <span>{{info.reader.libraryName}}</span>
                    </div>
                </div>

                <div class="w-20 f-s-14 color_3">
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">读者类型</span>
                        <span>{{info.reader.readerTypeName}}</span>
                    </div>
                    <div class="m-b-20">
                        <span class="m-r-20 info color_6">证件号码</span> 
                        <span>{{info.reader.certificateNumber}}</span>
                    </div>
                </div>

                <div class="w-20 f-s-14 color_3">
                    
                    
                </div> 
               </div>

           </div>
        </div> 

       <div class="padding_20 m-b-40" v-if="showBook">
           <div class="title_reader m-b-25" >书目信息</div>
           <div class="display_flex start">
               <div class="readerHeader m-r-25"></div>
               <div class="w-90 display_flex start">
                    <div class="w-20 f-s-14 color_3">
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">题名</span>
                                        <span>{{info.bookBases[0].positiveTitle}}</span>
                                    </div>
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">ISBN号</span>
                                        <span>{{info.bookBases[0].isbn}}</span>
                                    </div>
                                    <div class="m-b-20 cursor color_b" @click="lookBook=true">
                                        查看书目信息
                                    </div>
                                </div>

                                    <div class="w-20 f-s-14 color_3">
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">索书号</span>
                                        <span>{{info.books.callNumber}}</span>
                                    </div>
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">出版社</span>
                                        <span>{{info.bookBases[0].publisher}}</span>
                                    </div>
                                </div>

                                <div class="w-20 f-s-14 color_3">
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">馆藏地</span>
                                        <span>{{info.books.collectionPlaceName}}</span>
                                    </div>
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">出版时间</span>
                                        <span>{{info.bookBases[0].publicationDate}}</span>
                                    </div>
                                </div>

                                <div class="w-20 f-s-14 color_3">
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">架位号</span>
                                        <span>{{info.bookBases[0].rackName}}</span>
                                    </div>
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">出版地</span> 
                                        <span>{{info.bookBases[0].publisherPlace}}</span>
                                    </div>
                                </div>

                                <div class="w-20 f-s-14 color_3">
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">单价</span>
                                        <span>{{info.bookBases[0].price}}</span>
                                    </div>
                                    <div class="m-b-20">
                                        <span class="m-r-20 info color_6">文献语种</span>  
                                        <span>{{info.bookBases[0].language}}</span>
                                    </div>
                                </div> 
               </div>

           </div>
       </div>

       <div class="padding_20 m-b-40" v-if="info.bookBases.length>0">
           <div class="title_reader m-b-25">文献查找列表</div>
           <div  style="height:500px; overflow:auto" >
                 <el-table

                :data="info.bookBases"
                style="width: 100%">
                    <el-table-column
                        prop="isbn"
                        label="ISBN"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="classificationNumber"
                        label="分类号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="positiveTitle"
                        label="题名">
                    </el-table-column>
                    <el-table-column
                        prop="publisher"
                        label="出版社">
                    </el-table-column>
                    <el-table-column
                        prop="publicationDate"
                        label="出版日期">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="价格">
                    </el-table-column>
                     <el-table-column
                        
                        label="操作">

                        <template slot-scope="scope">
                                        <div class="table-action flex-row flex-wrap flex_center">
                                            <el-button
                                                size="mini"
                                                type="text"
                                                class="m-r-20"
                                                @click="borrowBook('RESERVATION',scope.row.id)"
                                            >预约</el-button>
                                        </div>
                                    </template>
                    </el-table-column> 
                </el-table>
           </div>
          
           
       </div>

       <div class="padding_20 m-b-40" v-if="info.documentAppointments.length>0">
           <div class="title_reader m-b-25" >当前预约信息</div>
            <el-table
                :data="info.documentAppointments"
                style="width: 100%">
                    <el-table-column
                        prop="readerNumber"
                        label="读者证号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="readerName"
                        label="读者姓名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="bookName"
                        label="题名">
                    </el-table-column>
                    <el-table-column
                        prop="readerUnitName"
                        label="单位名称">
                    </el-table-column>
                    <el-table-column
                        prop="classificationNumber"
                        label="分类号">
                    </el-table-column>
                    <el-table-column
                        prop="documentAppointmentStatus"
                        label="预约状态">
                         <template>
                            <div>预约中</div>                      
                        </template>
                    </el-table-column>
                   
                    <el-table-column
                        label="预约日期">
                    <template slot-scope="scope">
                            <div>{{getTime(scope.row.createTime)}}</div>                      
                    </template>

                    </el-table-column>
                    <el-table-column
                        
                        label="操作">

                        <template slot-scope="scope">
                                        <div class="table-action flex-row flex-wrap flex_center">
                                            <el-button
                                                size="mini"
                                                v-if="scope.row.documentAppointmentStatus=='IN_PROGRESS' || scope.row.documentAppointmentStatus=='ARRIVED'"
                                                type="text"
                                                class="m-r-20"
                                                @click="borrowBook('CANCEL',scope.row.id)"
                                            >取消预约</el-button>
                                        </div>
                                    </template>
                    </el-table-column> 
                </el-table>
           
       </div>

       <!-- model -->
        <el-dialog
            title="读者信息"
            :visible.sync="lookReader"
            width="40%"
            :close-on-click-modal="false">
           <div class="display_flex readerInfo">
                 <div class="w-50" v-if="info.reader">
                      <div class="display_flex start m-b-15">
                        <div class="m-r-20  readerTitle  color_6">读者照片</div> 
                        <img :src="info.reader.photo" v-if="info.reader" class="readerHeader m-r-25">
                    </div>
                     <div v-for="(item,i) of readerList1" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>  
                        <span class="readerText" v-if="!item.isArry">{{info.reader[item.id]}}</span>
                        <span class="readerText" v-else >{{item.type[info.reader[item.id]].name}}</span>
                    </div>
                     
                </div>
                <div class="w-50" v-if="info.reader">
                     <div v-for="(item,i) of readerList2" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span> 
                         <span class="readerText" v-if="item.isData">{{getTime(info.reader[item.id])}}</span>
                         <span class="readerText" v-else-if="!item.isArry">{{info.reader[item.id]}}</span>
                         <span class="readerText" v-else >
                              <span v-if="item.type && info.reader[item.id] && item.type[info.reader[item.id]] && item.type[info.reader[item.id]].name ">{{item.type[info.reader[item.id]].name}}</span>
                         </span>
                    </div>
                     
                </div>
           </div>
        </el-dialog>

        <!-- model -->
        <el-dialog
            title="书目信息"
            :visible.sync="lookBook"
            width="60%"
            :close-on-click-modal="false">
           <div class="display_flex between start readerInfo">
                 <div class="w-30" v-if="info.all">
                     <div v-for="(item,i) of bookList1" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>  
                         <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                         <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                         <span class="readerText" v-else >{{item.type[info.all[item.id]].name}}</span> 
                    </div>
                     
                </div>
                <div class="w-30" v-if="info.all">
                     <div v-for="(item,i) of bookList2" :key="i" class="m-b-15 display_flex start" >
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span> 
                         <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                         <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                         <span class="readerText" v-else >{{item.type[info.all[item.id]].name}}</span>
                    </div>
                     
                </div>
                <div class="w-30" v-if="info.all">
                     <div v-for="(item,i) of bookList3" :key="i" class="m-b-15 display_flex start">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span> 
                         <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                         <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                         <span class="readerText" v-else >{{item.type[info.all[item.id]].name}}</span>
                    </div>
                     
                </div>
           </div>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List'

export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           activeName:'RESERVATION',
             showRead:false,
            showBook:false,
           info:{
            //    reader:{},
               documentAppointments:[],
               bookBases:[],
               books:[]
           },
           form:{
               readerNumber:'',
               isbn:''
           },
           height:'',
           tableData:[],
        // 读者信息字段
        readerList1:[
            {name:'证件类型',id:'certificateType',type:[],isArry:true},
            {name:'邮箱',id:'mailbox',type:[]},
            {name:'手机',id:'telephone',type:[]},
            // {name:'借阅次数',id:'borrow',type:[]},
            // {name:'欠款',id:'',type:[]},
            // {name:'续借次数',id:'',type:[]},
            // {name:'历史违章次数',id:'',type:[]},
            {name:'读者证号',id:'number',type:[]},
            {name:'读者类型',id:'readerTypeName',type:[]},
            {name:'状态',id:'status',type:[],isArry:true},
        ],
        readerList2:[
            {name:'读者所属馆',id:'libraryName'},
             {name:'读者姓名',id:'name'},
              {name:'启用日期',id:'start',isData:true},
               {name:'截止日期',id:'end',isData:true},
                {name:'单位名称',id:'readerUnitName'},
                 {name:'证件号码',id:'certificateNumber'},
                  {name:'性别',id:'gender',type:[],isArry:true},
                   {name:'联系地址',id:'address'},
                    {name:'出生日期',id:'birthday',isData:true},
                    //  {name:'电话',id:''},
                    //   {name:'预约次数',id:''}, 
                        {name:'押金',id:'deposit'},
                    //     
                    //        {name:'当前违章次数',id:''},
                            // {name:'备注',id:'note'},
        ],
        // 书目信息字段
        bookList1:[
            {name:'ISBN',id:'isbn'},
            {name:'索书号',id:'callNumber'},
            {name:'题名',id:'positiveTitle'},
            {name:'并列题名',id:'tiedTitle'},
            {name:'副题名',id:'subTitle'},
            {name:'分辑名',id:'sectionTitle'},
            {name:'分辑号',id:'sectionNumber'},
            {name:'其他责任者',id:'otherResponsible'},
            {name:'丛编第一责任者',id:'seriesOwner'},
            {name:'出版地',id:'publisherPlace'},
        ],
        bookList2:[
            {name:'页码',id:'pageNumber'},
            {name:'附件',id:'annex'},
            {name:'装帧方式',id:'bindingMethod'},
            {name:'尺寸',id:'formatSize'},
            {name:'系统记录号',id:''},
            {name:'文献类型',id:'medium'},
            {name:'校审',id:''},
            {name:'书目所以馆',id:''},
            {name:'编目人',id:''},
            {name:'第一责任者',id:'firstResponsible'},
        ],
        bookList3:[
            {name:'丛书名',id:'seriesTitle'},
            {name:'出版社',id:'publisher'},
            {name:'出版时间',id:'publicationDate'},
            {name:'版次',id:'edition'},
            {name:'图表',id:'chart'},
            {name:'文献语种',id:'language'},
            {name:'价格描述',id:'price'},
            {name:'主题词',id:'keywords'},
            {name:'内容摘要',id:'contentSummary'}
        ],
        // model
        lookReader:false,
        lookBook:false,
        // 字段对应
        status:[],
        certificateType:[],
        bookStatus:[]
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
       this.metaList()
       this.metaLists()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -220;

        },100)
      },
         searchRead(){
             this.loading()
                let params={
                    readerNumber:this.form.readerNumber,
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id
                }
                this.ax.get('/manage/unit/circulation/circulationManagement/reader',{params})
                    .then(res=>{
                      
                        this.info.reader = res.reader
                        this.info.documentAppointments = res.documentAppointmentList
                        // this.
                          this.showRead =true
                        this.sloading()
                        // // console.log( this.info.reader)
                            let input = document.getElementById('isbn')
                            
                             input.focus()
                             input.select()
                        
                    })
                    .catch(res=>{
                        this.sloading()
                    })
        },

        handleClick(){
            this.info={
               documentAppointments:[],
               books:[],
               bookBases:[]
           }
        },
        // 操作
        borrowBook(type,id){
            if(!id){
                return this.$message.warning('请输入正确的ISBN');
            }
            let params={}
            if(type=='RESERVATION'){
                params={
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                    bookBaseId:id?id:this.info.bookBases[0].id,
                    type,
                    readerNumber:this.form.readerNumber
                }
            }else{
                params={
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                    documentAppointmentId:id,
                    type,
                    readerNumber:this.form.readerNumber
                }
            }
        
            this.ax.post('/manage/unit/circulation/circulationManagement/literatureReserve',params)
                .then(res=>{
                     this.$message.success(res);
                     this.searchRead()
                })
        },
        // 搜索
        searchInfo(){
            this.loading()
             this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
             this.form.type = this.activeName
            this.ax.get('/manage/unit/circulation/circulationManagement/literatureReserve',{params:this.form})
                .then(res=>{
                    this.sloading()
                    // console.log(res)
                   
                    // this.info.bookBases = res.bookBases
                    this.info.bookBases = res.bookBases

                    this.info.all = Object.assign(res.books[0],res.bookBases[0])
                    this.showBook=true
                }).catch(res=>{
                     this.sloading()
                })
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then(res => {       
                res.subs.map(it => {
                    if(it.key=='status'){
                       it.searchOption.map(item=>{
                             this.readerList1[5].type[item.key] = item
                             this.status[item.key] = item
                        })
                    }
                    // console.log()
                    if(it.key=='certificateType'){
                         it.searchOption.map(item=>{
                             this.readerList1[0].type[item.key] = item
                             this.certificateType[item.key] = item
                        })
                    }
                    if(it.key=='gender'){
                         it.searchOption.map(item=>{
                             this.readerList2[6].type[item.key] = item
                            //  this.certificateType[item.key] = item
                        })
                    }
                });
                // // console.log(this.readerList1[9].type)
            });
        },
        metaLists() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {       
                res.subs.map(it => {
                    if(it.key=='bookStatus'){
                       it.searchOption.map(item=>{
                             this.bookStatus[item.key] = item
                        })
                    }

                });
            });
        },
    }
};
</script>

<style scoped>
    .container{
        padding-bottom: 50px;
    }
    .title_reader{
        height:40px;
        font-size:16px;
        font-weight:normal;
        line-height:22px;
        color:#000000;
        line-height: 22px;
        border-bottom:1px solid rgba(220,220,220,1)
    }
    .readerHeader{
        height:118px;
        width: 92px;
    }
    .color_b{
        color: #267FF9;
    }
    .info{
       
        width:100px;
        /* text-align: right; */
    } 
    .readerInfo{
        text-align: left;
        
    }
    .readerTitle{
         text-align: right;
         display: inline-block;
         /* padding-left: 20px; */
         width: 100px;
         padding: 3px;
         box-sizing: border-box;
          border: 1px solid transparent;
    }
    .readerText{
        display: inline-block;
        width:200px;
        padding: 3px;
         box-sizing: border-box;
          border: 1px solid transparent;
    }
    .readerTitle:hover,.readerText:hover{
       border: 1px solid #267FF9;
         border-radius: 5px;
    }
</style>
