<template>
    <div class="container" > 
        <div class="searchInfo display_flex between padding_20">
            <div class="display_flex flex_center w-80">
                 <view-form :list ='list' @getForm='getInfo' :model='form' class="w-100" ></view-form>
                 <el-button type="primary" icon="el-icon-search" plain  @click="search()" class="m-b-30" :loading="load_mode" >搜索</el-button>
            </div>
            <div  class="m-b-30">
                <el-button-group>
                    <el-button type="primary" plain icon="el-icon-download"  @click="exportDatas('/manage/united/reportSearch/collectionStatisticsExcel')" >导出</el-button>
                    <el-button type="primary" plain icon="el-icon-printer"  @click="print('ech')" >打印</el-button>
                </el-button-group>
            </div>
        </div>

        <div :style="$height(210) " class='over'>
            <div class="padding_20 m-b-20" :style="$height(420)" id="ech">
                <el-table
                    :data="tableData"
                    stripe
                    height='100%'
                    show-summary
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                     width='240'
                    label="单位名称" >
                    </el-table-column>
                    <el-table-column
                    prop="bookNumber"
                     width='100'
                    label="馆藏册数" >
                    </el-table-column>
                    <el-table-column
                    prop="readerNumber"
                    width='100'
                    label="在校人数">
                    </el-table-column>
                    <el-table-column
                    prop="averageBookCollection"
                     width='100'
                    label="人均册数">
                    </el-table-column>
                    <el-table-column
                    prop="supplementNumber"
                     width='100'
                    label="应补数">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                            @click="jump('/collection/index',scope.row)"
                            type="text"
                            size="small">
                                馆藏统计
                            </el-button>

                             <el-button
                            @click="jump('/classification/index',scope.row)"
                            type="text"
                            size="small">
                                分类统计
                            </el-button>

                             <el-button
                            @click="jump('/circulation/index',scope.row)"
                            type="text"
                            size="small">
                                流通统计
                            </el-button>

                             <el-button
                            @click="jump('/reader/index',scope.row)"
                            type="text"
                            size="small">
                                读者统计
                            </el-button>

                             <el-button
                            @click="collection(scope.row)"
                            type="text"
                            size="small">
                                馆藏明细
                            </el-button>

                             <el-button
                            @click="circulation(scope.row)"
                            type="text"
                            size="small">
                                流通明细
                            </el-button>

                             <el-button
                            @click="reader(scope.row)"
                            type="text"
                            size="small">
                                读者明细
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="f-s-12 color_d">
                说明：国家标准来源于教基司函〔2018〕51 号文件：教育部关于征求《中小学图书馆（室）规程》意见的通知
            </div>
            <div class="padding_20 display_flex between">
                <div></div>
                 <el-button type="primary" plain  @click="closeEchart" class="m-b-30"  >{{show?'隐藏图表':'显示图表'}}</el-button>
            </div>

            <div class="">
                <div id="charts" :style="{width: '100%', height: '400px'}" v-show="show"></div>
            </div>
        </div>



          <!-- 馆藏 -->
        <el-dialog title="馆藏明细" :visible.sync="showTable" width="65%" top='5vh' :close-on-click-modal='false'  @close='close'>
                <!-- <view-form  :list ='listCol'  :model='form' ></view-form> -->
                <div class="display_flex between padding_20">
                    <div class="display_flex flex_center w-70">
                        <view-form  :list ='listCol'  :model='searchInfo' class="" ></view-form>
                        <el-button type="primary" icon="el-icon-search" plain  @click="dosearch()" class="m-b-30" :loading="load_mode" >搜索</el-button>
                    </div>
                    <div  class="m-b-30">
                        <el-button-group>
                            <el-button type="primary" plain icon="el-icon-download"  @click="exportData('/manage/united/reportSearch/bookBasePlatformResExcel')" >导出</el-button>
                            <el-button type="primary" plain icon="el-icon-printer"  @click="print('clos')" >打印</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="padding_20 m-b-20" :style="$height(420)" id="clos">
                    <el-table
                        :data="data.content"
                        stripe
                        height='100%'
                        show-summary
                        v-loading='load'
                        style="width: 100%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="positiveTitle"
                        width="240"
                        label="题名" >
                        </el-table-column>
                        <el-table-column
                        prop="isbn"
                        width="200"
                        label="ISBN" >
                        </el-table-column>
                        <el-table-column
                        prop="publisher"
                        width="220"
                        label="出版社">
                        </el-table-column>
                        <el-table-column
                        prop="callNumer"
                        width="120"
                        label="索书号">
                        </el-table-column>
                        <el-table-column
                        prop="copyNumber"
                        width="100"
                        label="册数">
                        </el-table-column>

                        <el-table-column
                        prop="price"
                        width="100"
                        label="价格">
                        </el-table-column>

                        <el-table-column
                        prop="toPrice"
                        width="120"
                        label="合计">
                        </el-table-column>

                    </el-table>
               </div>
              <el-pagination
                        background
                        layout="sizes,total, prev, pager, next"
                        :current-page="page"
                        :page-sizes="[20,100,200,300,500]"
                        :page-size="size"
                        :total="total"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    ></el-pagination>
               
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showTable = false">关闭</el-button>
                </span>
        </el-dialog>

           <!-- 流通 -->
        <el-dialog title="流通明细" :visible.sync="showTables" width="65%" top='5vh' :close-on-click-modal='false'  @close='close'>
                <!-- <view-form  :list ='listCol'  :model='form' ></view-form> -->
                <div class="display_flex between padding_20">
                    <div class="display_flex flex_center w-70">
                        <view-form  :list ='listCir'  :model='searchInfo' class="" ></view-form>
                        <el-button type="primary" icon="el-icon-search" plain  @click="dosearch()" class="m-b-30" :loading="load_mode" >搜索</el-button>
                    </div>
                    <div  class="m-b-30">
                        <el-button-group>
                            <el-button type="primary" plain icon="el-icon-download"  @click="exportData('/manage/united/reportSearch/borrowingInformationPlatformResExcel')" >导出</el-button>
                            <el-button type="primary" plain icon="el-icon-printer"  @click="print('cirl')" >打印</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="padding_20 m-b-20" :style="$height(800)" id="cirl" >
                    <el-table
                        :data="data.content"
                        stripe
                        v-loading='load'
                        height='100%'
                        style="width: 100%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="readerNumber"
                    
                        label="读者证号" >
                        </el-table-column>
                        <el-table-column
                        prop="readerName"
                    
                        label="读者姓名" >
                        </el-table-column>
                        <el-table-column
                        prop="readerUnitName"
                        
                        label="读者单位">
                        </el-table-column>
                        <el-table-column
                        prop="barCode"
                    
                        label="文献条码">
                        </el-table-column>
                    

                        <el-table-column
                        prop="borrowDate"
                        
                        label="借出日期">
                        </el-table-column>

                        <el-table-column
                        prop="borrowAlso"
                    
                        label="归还日期">
                        </el-table-column>
                        <el-table-column
                        prop="borrow"
                        label="借阅状态">
                            <template slot-scope="scope">
                                    <div>{{scope.row.borrow==1?'归还':'未归还'}}</div>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
              <el-pagination
                        background
                        layout="sizes,total, prev, pager, next"
                        :current-page="page"
                        :page-sizes="[20,100,200,300,500]"
                        :page-size="size"
                        :total="total"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    ></el-pagination>
               
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showTables = false">关闭</el-button>
                </span>
        </el-dialog>

           <!-- 读者 -->
        <el-dialog title="读者明细" :visible.sync="showTablees" width="65%" top='5vh' :close-on-click-modal='false'  @close='close'>
                <!-- <view-form  :list ='listCol'  :model='form' ></view-form> -->
                <div class="display_flex between padding_20">
                    <div class="display_flex flex_center w-70">
                        <view-form  :list ='listRea'  :model='searchInfo' class="" ></view-form>
                        <el-button type="primary" icon="el-icon-search" plain  @click="dosearch" class="m-b-30" :loading="load_mode" >搜索</el-button>
                    </div>
                    <div  class="m-b-30">
                        <el-button-group>
                            <el-button type="primary" plain icon="el-icon-download"  @click="exportData('/manage/united/reportSearch/readerPlatformResExcel')" >导出</el-button>
                            <el-button type="primary" plain icon="el-icon-printer"  @click="print('read')" >打印</el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="padding_20 m-b-20" :style="$height(420)" id="read">
                <el-table
                    v-loading='load'
                    :data="data.content"
                    stripe
                    height='100%'
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>
                  

                    <el-table-column
                    prop="readerUnitName"
                   
                    label="读者单位">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    prop="number"
                  
                    label="读者号">
                    </el-table-column>

                     <el-table-column
                    prop="start"
                   
                    label="登记日期">
                    </el-table-column>

                  

                </el-table>
               
            </div>
              <el-pagination
                        background
                        layout="sizes,total, prev, pager, next"
                        :current-page="page"
                        :page-sizes="[20,100,200,300,500]"
                        :page-size="size"
                        :total="total"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    ></el-pagination>
               
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showTablees = false">关闭</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import viewForm from '../../../view/form'
import list from '../../../view/List'
export default {
    components:{
        viewForm,
        list
    },
    data() {
        return {
            bus: this.bus(this),
            form:{},
            show:true,
            load:false,
            load_mode:false,
            tableData:[],
            showTable:false,
            showTables:false,
            showTablees:false,
            searchInfo:{},
            listCol:[
                {name:'批次号',id:'batchId',relation:'batchName',type:'select',options:[]},
                {name:'馆藏地',id:'collectionPlaceId',relation:'collectionPlaceName',type:'select',options:[]},
                {name:'时间',id:'startTime',end:'endTime',type:'aroundTimes'}

            ],
            listCir:[
                {name:'读者类型',id:'readerTypeId',relation:'readerTypeName',type:'select',options:[]},
                {name:'流通状态',id:'borrow',type:'select',options:[
                    {name:'借出',id:false},
                    {name:'归还',id:true}
                ]},
                {name:'时间',id:'startTime',end:'endTime',type:'aroundTimes'}
            ],
            listRea:[
                    {name:'读者单位',id:'readerUnitId',relation:'readerUnitName',type:'select',options:[]},
                    {name:'姓名',id:'readerName'},
                    {name:'读者证号',id:'readerNumber'},
                    {name:'登记日期',id:'start',type:'times'}
            ],
            total:0,
            data:{
                content:[],
                page:{
                    total:0
                }
            },
            size:20,
            page:1,
            url:'',
            list:[
                //    {name:'单位类型',id:'platformLabel',type:'select',options:[]},

                    {name:'单位名称',id:'platformId',relation:'platformName',type:'select',options:[]},

                    // {name:'达标情况',id:'standard',type:'select',options:[
                    //      {name:'是',id:true},
                    //      {name:'否',id:false}
                    // ]},

                    {name:'日期',id:'year',type:'year',options:[]},
            ],
        };
    },
    created() {
        
        this.getList()
    },
    methods: {
        jump(name,obj){
            this.$router.push({
                path:name,
                query:{params:JSON.stringify(obj)}
            })
        },
        close(){
            this.data={}
            this.page=1
            this.size=20
            this.total=0
        },
        // 馆藏明细
        collection(row){
            this.url = '/manage/united/reportSearch/bookBasePlatformRes?platformId='+row.platformId+'&platformName='+row.name
            this.showTable=true
            this.dosearch()
            this.getBitch(row.platformId)
            this.getPlace(row.platformId)
        },
        // 流通
        circulation(row){
            // console.log(row)
             this.url = '/manage/united/reportSearch/borrowingInformationPlatformRes?platformId='+row.platformId+'&platformName='+row.name
            this.showTables=true
            this.dosearch()
            this.getType(row.platformId)
        },
        // 读者
        reader(row){
                this.url = '/manage/united/reportSearch/readerPlatformRes?platformId='+row.platformId+'&platformName='+row.name
                this.showTablees=true
                this.dosearch()
        },
        dosearch(){
            this.searchInfo.size = this.size
            this.searchInfo.page = this.page-1
            this.load=true
            this.ax.get(this.url,{params:this.searchInfo})
                .then(res=>{
                     this.load=false
                    res.content.map(it=>{
                         if(it.classificationNumber){
                            it.callNumber = it.classificationNumber
                        }
                        if(it.speciesNumber){
                            it.callNumber+='/'+it.speciesNumber
                        }
                        if(it.auxiliaryNumber){
                            it.callNumber+='/'+it.auxiliaryNumber
                        }
                          if(it.copyNumber && it.price){
                            it.toPrice = (it.copyNumber*it.price).toFixed(2)
                        }
                    })
                  
                    // console.log(res.content)
                    this.data = res
                    this.total  = res.page.total
                })
                .catch(it=>{
                     this.load=false
                })
        },
        onPageSizeChange(e){
              this.size= e
             this.dosearch()
        },
        onPageChange(e){
            this.page= e
             this.dosearch()
        },
        // 读者类型
        getType(platformId){
            this.ax.get('/manage/united/unitedGenral/readerType',{params:{platformId}})
                .then(res=>{
                     this.listCir[0].options = res.content
                })
        },
        // 获取单位列表
        getList(){
            this.ax.get('/manage/united/unitedGenral/platform')
                .then(res=>{
                    this.list[0].options = res.content
                    this.listRea[0].options = res.content
                })
        },
        // 获取批次
        getBitch(platformId){
            this.ax.get('/manage/united/unitedGenral/batch',{params:{type:'CATALOG',platformId}})
                .then(res=>{
                    this.listCol[0].options = res.content
                })
        },
        // 获取馆藏地
        getPlace(platformId){
            this.ax.get('/manage/united/unitedGenral/collectionPlace',{params:{platformId}})
             .then(res=>{
                    this.listCol[1].options = res.content
                })
        },
        // search参数
        getInfo(val){
            this.form = val
        },
        // 检索
        search(){
            this.load_mode=true
            this.form.page=0
            this.form.size=999
            this.ax.get('/manage/united/reportSearch/collectionStatistics',{params:this.form})
                .then(res=>{
                    this.load_mode=false
                    // console.log(res) 
                    
                    this.tableData = res.content.map(it=>{
                        //   // console.log(it)
                        //   if(it.totalBorrowingNumber>0 && it.totalBookNumber>0){
                        //         it.avage = (it.totalBorrowingNumber/it.totalBookNumber*100).toFixed(2) + '%'
                        //   }else{
                        //        it.avage =0
                        //   }
                      
                       
                        return it
                    })
                    
                    let arr=[]
                    arr =  res.content.map(it=>{
                        return it.name
                    })
                    let series=[
                        [],[],[],[]
                    ]
                    res.content.map(it=>{
                        series[0].push(it.bookNumber)
                        series[1].push(it.readerNumber)
                        series[2].push(it.averageBookCollection)
                        series[3].push(it.supplementNumber)
                    })
                    //  return [it.countryAverageBookCollection,it.bookNumber,it.averageBookCollection,it.supplementNumber]
                    // console.log(series)
                    this.drawLine('charts',arr,series,['#2699FB','#FFAE71','#5BD1A5','#FB8180']);
                })
                // {
        //     name: 'Forest',
        //     type: 'bar',
        //     barGap: 0,
        //     label: labelOption,
        //     data: [320, 332, 301, 334, 390]
        // },
                .catch(res=>{
                     this.load_mode=false
                })
        },
        closeEchart(){
            this.show = !this.show
        },
        exportDatas(url){
            this.ax.get(url,{params:this.form})
                .then(res=>{
                    let name = res.split('/')[1]
                    this. FileSaver.saveAs(res,name)
                })
        },
        exportData(url){
            this.ax.get(url,{params:this.searchInfo})
                .then(res=>{
                    let name = res.split('/')[1]
                    this. FileSaver.saveAs(res,name)
                })
        },
         print(id){
             if(id=='ech'){
                 let meta = [
                            { name: '单位名称', key: 'name', displayInList: true },
                            { name: '馆藏册数', key: 'bookNumber', displayInList: true },
                            { name: '在校人数', key: 'readerNumber', displayInList: true },
                            { name: '人均册数', key: 'averageBookCollection', displayInList: true },
                            { name: '应补数', key: 'supplementNumber', displayInList: true },
                        
                ]
                let data =JSON.stringify({content:this.tableData})
                meta=JSON.stringify(meta)
                let newsUrl = this.$router.resolve({path:'/print',query:{data,meta}})
                window.open(newsUrl.href,'_blank')
                return
             }
                let printPage = document.getElementById(id);
                var f = document.getElementById('printf');
                f.contentDocument.write(printPage.innerHTML);
                f.contentDocument.write(`<style type="text/css">
                    .el-table td, .el-table th.is-leaf {
                        border-bottom: 1px solid #EBEEF5;
                    }.el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
                    padding-left: 10px;
                }
                .el-table td, .el-table th.is-leaf {
                        border-bottom: 1px solid #EBEEF5;
                    }
                .el-table thead {
                    color: #909399;
                    font-weight: 500;
                }
                .el-table td, .el-table th {
                    padding: 12px 0;
                    min-width: 0;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    position: relative;
                    text-align: left;
                }
                .el-table__body-wrapper, .el-table__footer-wrapper, .el-table__header-wrapper {
                    width: 100%;
                }
                .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
                        border-right: 1px solid #EBEEF5;
                    }
                .el-table__body-wrapper {
                    overflow: hidden;
                    position: relative;
                }
                .el-table th>.cell {
                    display: inline-block;
                    box-sizing: border-box;
                    position: relative;
                    vertical-align: middle;
                    padding-left: 10px;
                    padding-right: 10px;
                    width: 100%;
                }
                .el-table--mini, .el-table--small, .el-table__expand-icon {
                    font-size: 12px;
                }
                .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
                    padding-left: 10px;
                }
                .el-table .cell {
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    word-break: break-all;
                    line-height: 23px;
                    padding-right: 10px;
                }
                .A4{
                    background: #fff;
                    margin:0 auto;
                    
                border:1px solid #ddd;

                }
                        </style>`); 
                f.contentDocument.close();
                f.contentWindow.print();
        },
         // 画图
        drawLine(id, data ,series, color) {
            // 基于准备好的dom，初始化echarts实例
            //// console.log(this.$echarts);

            let myChart = this.$echarts.init(document.getElementById(id));
             var option = {
            color,
            title: {
               
            },
            tooltip: {},
            legend: {
                data:['馆藏册数','在校人数','人均册数','应补数']
            },
            xAxis: {
                data
            },
             dataZoom: [ {
                type: 'inside'
            }, {
                type: 'slider'
            }],
            yAxis: {},
            series: [
                {
                    name: '馆藏册数',
                    type: 'bar',
                    data: series[0]
                },
                {
                    name: '在校人数',
                    type: 'bar',
                    data: series[1]
                },
                 {
                    name: '人均册数',
                    type: 'bar',
                    data: series[2]
                },
                 {
                    name: '应补数',
                    type: 'bar',
                    data: series[3]
                }
            ]
        };
 
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
            // 绘制图表
            // myChart.setOption({
            //     color,
            //     // title: {},
            //     // tooltip: {
            //     //     trigger: 'item',
            //     //     formatter: '{a} <br/>{b} : {c} ({d}%)'
            //     // },
            //      xAxis: [
            //         {
            //             // type: 'category',
            //             // axisTick: {show: false},
            //             data:['国家标准','馆藏册数','平均复本','应补数']
            //         }
            //     ],
            //     // legend: {
            //     //     orient: 'vertical',
            //     //     left: 'left',
            //     //     data
            //     // },
            //     series:{
            //        name:'国家标准',
            //        type:'bar',
            //        data:[100,1001,100,100]
            //     }
            // });
        }
    }
};
</script>

<style scoped>
    .searchInfo{
        padding-top: 20px;
    }
   .color_d{
       text-align: center;
       color: #dddddd;
   }
   .over{
       overflow: auto;
   }
   
</style>
