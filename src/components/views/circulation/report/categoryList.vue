<template>
    <div class="container padding_20" :style="'height:'+height+'px'">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>预约类别统计列表</div> 
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
             :style="$height(260)"
            :data='data'
            :disableMeta="true"
            :tableMeta="meta"
            :disableTableAction="true"
            @search="search"
            v-loading='load'
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
            meta: '',
            form: {},
            data:{},
            arr:[],
            lists:[],
            load:false,
            format:'',
            list:[],
          height:''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
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

           
            this.ax.post('/manage/unit/circulation/circulationExcel/circulationDocumentTypeResForCreateExcel',{circulationDocumentTypeReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationDocumentTypeRes', { params: this.form }).then(res => {    //获取内容
                this.data = res
                this.load=false
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationDocumentTypeResForExcelField')   //需要修改
                .then(res=>{
                    this.lists = res
                })
        },
        printing(){
              let meta = [
                   { name: '统计项目', key: 'name', displayInList: true },
                    { name: '人次', key: 'frequencyNumber', displayInList: true },
                    { name: '人数', key: 'peopleNumber', displayInList: true },
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
                    { name: '统计项目', key: 'name', displayInList: true },
                    { name: '人次', key: 'frequencyNumber', displayInList: true },
                    { name: '人数', key: 'peopleNumber', displayInList: true },
                ]
            };
        }
    }
};
</script>

<style>
</style>
