<template>
    <div class="container padding_20" :style="'height:'+height+'px'">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>阅览清单列表</div> 
            <div class="display_flex">
                 <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="printing" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
            </div>
        </div>
        <!-- :dataUrl="'/manage/unit/circulation/circulationExcel/circulationDocumentRes'" -->
        <List
            v-loading='load'
             :style="$height(260)"
            :data='data'
            :disableMeta="true"
            :tableMeta="meta"
            :disableTableAction="true"
            @search="search"
            ref="list"
        ></List>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
        load:false,
            meta: '',
            form: {},
            data:{},
            arr:[],
            lists:[],
            format:'',
            load:false,
            list:[],
          height:""
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.load=true
        this.metaList();
        this.getForMat()
        this.getFied()
        // console.log(this.$route.query);
        this.form = JSON.parse(this.$route.query.info);
        this.list =  JSON.parse(this.$route.query.list);
         this.format =  JSON.parse(this.$route.query.format);
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        exportAll(){
            // let newTab
            // newTab = window.open();
          this.loading()
            let format={}
            let list
            if(this.list.length==0){
                list = this.lists
            }else{
                 list = this.list
            }
            // // console.log(this.format.id)
            if(!this.format.id){
                this.arr.map(it=>{
        
                    if(it.id == '1'){
                        format = it
                    }
               
            })
            }else{
                format = this.format
            }  
            this.ax.post('/manage/unit/circulation/circulationExcel/circulationReadingResForCreateExcel',{circulationReadingReq:this.form,format,list})   //需要修改地方 导出
                .then(res=>{
                  //  newTab.location = res
                  window.location = res
                  this.sloading()
                }).catch(err=>{
              this.sloading()
            })
        },
        // 获取
        getList() {
            this.load=true
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationReadingRes', { params: this.form }).then(res => {  
                this.load=false  //获取内容   需要修改
                this.data = res
            });
        },
        getForMat(){
            this.ax.get('/manage/unit/report/journalReport/excelFormat')    // 获取格式
                .then(res=>{
                    // // console.log(res)
                      this.arr = res.content
                })
        },
        // 查询
        search(val) {
            // console.log(val);
            // val.platformId = 
            this.form = Object.assign(this.form,val)
               this.getList()
        },
        // 获取字段
        getFied(){
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationReadingResForExcelField')   //需要修改
                .then(res=>{
                    this.lists = res
                })
        },
        printing(){
              let meta = [
                   { name: '预约读者证号', key: 'number', displayInList: true },
                    { name: '读者姓名', key: 'name', displayInList: true },
                     { name: '馆藏地名称', key: 'collectionPlaceName' ,displayInList: true },
                    {
                        name: '阅览状态状态',
                        key: 'readingStatus',
                        displayInList: true,
                    },
                     { name: '签到时间', key: 'signInTime', displayInList: true },
                       { name: '阅读时长', key: 'duration', displayInList: true },
            ]
                let data =JSON.stringify(this.data)
                meta=JSON.stringify(meta)
                let newsUrl = this.$router.resolve({path:'/print',query:{data,meta}})
                 window.open(newsUrl.href,'_blank')
        },
        metaList() {
            this.meta = {
                edit: 'NONE',
                export: 'NONE',
                delete: 'NONE',
                insertable: false,
                subs: [
                
                    { name: '预约读者证号', key: 'number', displayInList: true },
                    { name: '读者姓名', key: 'name', displayInList: true },
                    { name: '读者类型名称', key: 'readerTypeName', displayInList: true },
                    { name: '读者单位名称', key: 'readerUnitName', displayInList: true },
                     { name: '馆藏地名称', key: 'collectionPlaceName' ,displayInList: true },
                  
                    {
                        name: '阅览状态状态',
                        key: 'readingStatus',
                        displayInList: true,
                       
                    },
                     { name: '签到时间', key: 'signInTime', displayInList: true },
                      { name: '签退时间', key: 'checkOutTime', displayInList: true },
                       { name: '阅读时长', key: 'duration', displayInList: true },
                     
                ]
            };
        }
    }
};
</script>

<style>
</style>
