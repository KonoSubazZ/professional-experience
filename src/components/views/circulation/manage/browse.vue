 <template>
    <div class="container" :style="'height:'+height+'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName">

                <el-tab-pane label="阅览登到" name="AND">
                    <div class=" m-b-40">
                        <div class="display_flex start between w-100">
                          
                            <form-view :list='list' :model='form'  @getForm='getForm' @keyup.enter.native="reader"  class="w-80"></form-view>

                           <div class="w-10">
                                <el-button
                                type="primary"
                                
                                class="m-r-20 "
                                @click="reader"
                            >确认</el-button>
                           </div>
                        </div>
                    </div>
                </el-tab-pane>
                
                <el-tab-pane label="阅览详情" name="BORROW">
                         <List
                            :dataUrl="'/manage/unit/circulation/circulationManagement/readingHistory'"
                            @data='data'
                            :disableMeta="true"
                            :tableMeta="meta"
                            :style="'height:'+height2+'px'"
                            @search='search'
                            :disableTableAction='true'
                            :chooseBox='false'
                            ref="list"
                        ></List>
                </el-tab-pane>

                <el-tab-pane label="现刊流通" name="RETURN">
                    <div class="display_flex between m-b-30">
                        <div class="w-30">
                            <el-input
                                v-model="borrows.readerNumber"
                                placeholder="读者证号"
                                 @keyup.enter.native="searchRead"
                                class="m-r-20 w-70"
                            ></el-input>
                            <el-button
                                type="primary"
                              
                                class="m-r-20"
                                @click="searchRead()"
                            >搜索</el-button>
                        </div>
                        <div>
                            <el-button
                                type="primary"
                               
                                class="m-r-20"
                                v-if="info.reader"
                                @click="Call()"
                            >选择期刊</el-button>
                           
                        </div>
                    </div>

                   <div class="padding_20 m-b-40" v-if="showRead">
            <div class="title_reader m-b-25">读者信息</div>
            <div class="display_flex start">
                <img
                    :src="info.reader.photo"
                    class="readerHeader m-r-25 img"
                />
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
                        <div class="m-b-20 cursor color_b" @click="lookReader=true">查看读者信息</div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">读者姓名</span>
                            <span>{{info.reader.name}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">状态</span>

                            <span v-if="info.reader.status &&  status[info.reader.status].name">{{ status[info.reader.status].name }}</span>
                     
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
                            <span class="m-r-20 info color_6">总计借阅</span>
                            <span>{{info.reader.borrowNumber}}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3"></div>
                </div>
            </div>
        </div>

                    <div class="padding_20 m-b-40" v-if="info.borrowingInformationList.length>0">
                        <div class="title_reader m-b-25" >借阅信息</div>
                            <el-table
                                :data="info.borrowingInformationList"
                                style="width: 100%">
                                    <el-table-column
                                        prop="readerNumber"
                                        label="读者证号"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="readerName"
                                        label="读者姓名">
                                    </el-table-column>

                                    <el-table-column
                                        prop="title"
                                        label="期刊名称">
                                    </el-table-column>

                                    <el-table-column
                                        prop="year"
                                        label="订购年份">
                                    </el-table-column>
                                    <el-table-column
                                        prop="cycleNumber"
                                        label="现刊期数">
                                    </el-table-column>
                                    <el-table-column
                                        prop="issn"
                                        label="ISSN">
                                    </el-table-column>
                                   
                                    <el-table-column
                                        label="借书日期">
                                    <template slot-scope="scope">
                                            <div>{{getTime(scope.row.createTime)}}</div>                      
                                    </template>

                                    </el-table-column>
                                    <!-- <el-table-column
                                        
                                        label="操作">

                                        <template slot-scope="scope">
                                                        <div class="table-action flex-row flex-wrap flex_center">
                                                            <el-button
                                                                v-if="!scope.row.borrow"
                                                                size="mini"
                                                                type="text"
                                                                class="m-r-20"
                                                                @click="borrowBook('RENEW')"
                                                            >归还</el-button>
                                                        </div>
                                                    </template>
                                    </el-table-column>  -->
                                </el-table>
                        
                    </div>

                </el-tab-pane>

            </el-tabs>
        </div>


       <el-dialog
            title="读者信息"
            :visible.sync="lookReader"
            width="40%"
            :close-on-click-modal="false" >
       
            <div class="display_flex readerInfo">
                <div class="w-50" v-if="info.reader">
                    <div class="display_flex start m-b-15">
                        <div class="m-r-20 readerTitle color_6">读者照片</div>
                        <img
                            :src="info.reader.photo"
                            v-if="info.reader"
                            class="readerHeader m-r-25 img"
                        />
                    </div>
                    <div v-for="(item,i) of readerList1" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span class="readerText" v-if="!item.isArry">{{info.reader[item.id]}}</span>
                        <span class="readerText" v-else>{{item.type[info.reader[item.id]].name}}</span>
                    </div>
                </div>
                <div class="w-50" v-if="info.reader">
                    <div v-for="(item,i) of readerList2" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span
                            class="readerText"
                            v-if="item.isData"
                        >{{getTime(info.reader[item.id])}}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{info.reader[item.id]}}</span>
                        <span class="readerText" v-else>
                             <span v-if="item.type && info.reader[item.id] && item.type[info.reader[item.id]] && item.type[info.reader[item.id]].name ">{{item.type[info.reader[item.id]].name}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </el-dialog>

      <!-- 弹框 -->


        <el-dialog
            title="现刊借阅"
            :visible.sync="model"
            top='5vh'
            width="90%"
            :close-on-click-modal="false"
            @close="close" >
       
           <List
                            :dataUrl="'/manage/unit/circulation/circulationManagement/journalBookingDetail'"
                            @data='data'
                            :disableMeta="true"
                            :tableMeta="metas"
                           
                            ref="list"
                        >
                         <template slot="addition-table-actions" slot-scope="scope">
                            <el-button
                                type="primary"
                                size="text"
                                @click="borrowJournal(scope.item.row)"
                            >借阅</el-button>
                          
                        </template>
                        </List>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';
import formView from '../../../view/form'
export default {
    components: { List,formView },
    data() {
        return {bus: this.bus(this),
            list:[
                {name:'读者证号',id:'readerNumber'},
                 {name:'签到馆藏地',id:'collectionPlaceId',type:'select', relation:'collectionPlaceName',options:[]},
                //   {name:'登到',id:'type',type:'select',options:[ {name:'签到',id:'0'},{name:'签退',id:'1'}]},
            
            ],
          height:'',
            cardId:'',
            form:{
                readerNumber:''
            },
            id:'',
            borrows:{},
            model:false,
           showRead:false,
            status:[],
            // 读者信息字段
            readerList1: [
                { name: '证件类型', id: 'certificateType', type: [], isArry: true },
                { name: '邮箱', id: 'mailbox', type: [] },
                { name: '手机', id: 'telephone', type: [] },
                // {name:'电话',id:'phone',type:[]},
                { name: '借阅次数', id: 'borrowNumber', type: [] },
                { name: '欠款', id: '', type: [] },
                { name: '续借次数', id: '', type: [] },
                { name: '历史违章次数', id: '', type: [] },
                { name: '读者证号', id: '', type: [] },
                { name: '读者类型', id: 'readerTypeName', type: [] },
                { name: '状态', id: 'status', type: [], isArry: true }
            ],
            readerList2: [
                { name: '读者所属馆', id: 'libraryName' },
                { name: '读者姓名', id: 'name' },
                { name: '启用日期', id: 'start', isData: true },
                { name: '截止日期', id: 'end', isData: true },
                { name: '单位名称', id: 'readerUnitName' },
                { name: '证件号码', id: 'certificateNumber' },
                { name: '性别', id: 'gender', type: [], isArry: true },
                { name: '联系地址', id: 'address' },
                { name: '出生日期', id: 'birthday', isData: true },
                { name: '电话', id: 'phone' },
                { name: '预约次数', id: '' },
                { name: '押金', id: 'deposit' },
                { name: '最大借阅数', id: 'maxRenewals' },
                { name: '当前违章次数', id: '' },
                { name: '备注', id: 'note' }
            ],

            lookReader:false,
            activeName:'AND',

             info:{
            //    reader:{},
               borrowingInformationList:[],
            //    bookBase:{},
            //    book:{}
           },
            meta:''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.id = JSON.parse(localStorage.getItem('user')).platform.id
         this.getPlace()
            .then(res=>{
                  this.metaList(res)
            })
      
        this.metaLists()
        this.metaListes()
    },
     mounted(){
        this.getReadId()
         document.onkeydown = (e) => {
            // console.log(e)
            let key = window.event.keyCode;
            if (key == 17) {
                
            }
         }
    },
     beforeDestroy(){
        window.BlueWhale.close();
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;
          this.height2 = document.documentElement.clientHeight -250;

        },100)
      },
        search(e){
            e.platformId=this.id
        },
        borrowBook(){

        },
        // 获取读者
        searchRead() {
            this.loading();
            let params = {
                readerNumber: this.borrows.readerNumber,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax
                .get('/manage/unit/circulation/circulationManagement/reader', { params })
                .then((res) => {
                     this.showRead = true;
                     this.info.reader = res.reader
                    
                     this.getBorrowList()
                    this.sloading();
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        getBorrowList(){
            this.ax.post('/manage/unit/circulation/circulationManagement/journalBorrowingInformation',{ readerNumber: this.borrows.readerNumber})
                .then(res=>{
                    this.info.borrowingInformationList = res.content
                })
        },


        data(val){
            // console.log(val)
            val.content.map(it=>{
                it.duration = (it.duration/60).toFixed(2)
            })
        },
        getPlace(){
           return new Promise(resolve=>{
            this.ax.get('/manage/unit/general/collectionPlace',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id,type:'LITERATURE'}})
                .then(res=>{
                     this.list[1].options = res.content
                    resolve(res.content)
                })
           })
        },
        close(){},
        Call(e){
            this.model =true
        },
        borrowJournal(e){
            // console.log(e)
           
            let params={}
            params.journalBookingDetailId = e.id
            params.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            params.readerNumber = this.borrows.readerNumber
             this.loading()
            this.ax.post("/manage/unit/circulation/circulationManagement/journalBookingDetail",params)
                .then(res=>{
                      this.sloading()
                      this.model =false
                      this.$message.success('借阅成功');
                      this.getBorrowList()
                })
                .catch(res=>{
                    this.sloading()
                })
        },
        // 初始化监听机器
        getReadId(e){
            
            window.BlueWhale.readPatron((cardId)=>{
                
                    if(cardId==null){
                        return
                    }
                    if(this.cardId == cardId ){
                        clearTimeout(this.times)
                        this.times = setTimeout(res=>{
                            this.form.readerNumber=''
                            this.cardId=''
                        },3000)
                    }else{
                       
                        this.cardId = cardId
                       this.getReaderNumber(cardId)
                  
                    }
                   
                   
            });
        },
                // 获取读者卡id 
        getReaderNumber(rfId){
            // console.log()
            this.ax.get('/manage/unit/circulation/readerManagement/readerNumber',{params:{rfId,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.form.readerNumber = res
                })
        },  
       
        getForm(val){
            this.form = val
        },
        // 签到
        reader(){
            this.loading()
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/circulation/circulationManagement/readingHistory',this.form)
                .then(res=>{
                     this.sloading()
                     this.$message.success(res);
                })
                .catch(res=>{
                     this.sloading()
                })

        },
        metaLists(){
            this.metas ={
                subs:[
                    {name:'期刊名称',key:'title',displayInList:true,searchable:true},
                     {name:'期数',key:'cycleId',displayInList:true},
                      {name:'ISSN',key:'issn',displayInList:true,searchable:true},
                       {name:'出版社',key:'publisher',displayInList:true},
                        {name:'预定年份',key:'year',displayInList:true,searchable:true},

                ]
            }
        },
        metaListes() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'status') {
                        it.searchOption.map((item) => {
                            this.readerList1[9].type[item.key] = item;
                            this.status[item.key] = item;
                          
                        });
                    }
                    // // console.log()
                    if (it.key == 'certificateType') {
                        it.searchOption.map((item) => {
                            this.readerList1[0].type[item.key] = item;
                           
                        });
                    }
                    if (it.key == 'gender') {
                        it.searchOption.map((item) => {
                            this.readerList2[6].type[item.key] = item;
                            //  this.certificateType[item.key] = item
                        });
                    }
                });
                // // console.log(this.readerList1[9].type)
            });
        },
         metaList(arr) {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.ReadingHistory' } }).then(res => {       
                res.insertable = false
                res.delete='NONE'
                res.subs.map(it=>{
                    if(it.key=='createTime'){
                        it.displayInList=false
                        it.searchable = false
                    }
                    if(it.key=='collectionPlaceName'){
                         it.searchable = false
                      
                    }
                     if(it.key=='collectionPlaceId'){
                         it.name = '馆藏地'
                        it.searchOption = arr.map(it=>{
                            return {name:it.name,key:it.id}
                        })
                    }
                    if(it.key=='duration'){
                        it.name='流通时长(分)'
                    }
                })
                this.meta = res
            });
        },
    }
};
</script>

<style scoped>
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
