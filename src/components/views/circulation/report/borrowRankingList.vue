<template>
    <div class="container padding_20">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>文献借阅排行列表</div> 
            <div class="display_flex">
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="printing" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
            </div>
        </div>
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
            meta: '',
            load:false,
            form: {},
            data:{},
            arr:[],
            lists:[],
            format:'',
            load:false,
            list:[]
        };
    },
    created() {
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
        printing(){
              let meta = [
                     { name: '书名', key: 'bookName', displayInList: true },
                    { name: '索书号', key: 'callNumber', displayInList: true },
                    { name: '借阅次数', key: 'lendNumber', displayInList: true },
                    { name: '续借次数', key: 'renewals', displayInList: true },
                     { name: '馆藏地名称', key:'collectionPlaceName', displayInList: true }
            ]
                let data =JSON.stringify(this.data)
                meta=JSON.stringify(meta)
                let newsUrl = this.$router.resolve({path:'/print',query:{data,meta}})
                 window.open(newsUrl.href,'_blank')
        },
        exportAll(){
            // let newTab
            // newTab = window.open();
          this.loading()
            let format={}
            let list
            console.log(this.list,'this.list');
            console.log(this.lists,'this.lists');
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
            this.ax.post('/manage/unit/circulation/circulationExcel/circulationRankingResForCreateExcel',{circulationRankingReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationRankingRes', { params: this.form }).then(res => {    //获取内容   需要修改
            // console.log(res)
             this.load=false
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationRankingResForExcelField')   //需要修改
                .then(res=>{
                    this.lists = res
                })
        },
        metaList() {
            this.meta = {
                edit: 'NONE',
                export: 'NONE',
                delete: 'NONE',
                insertable: false,
                subs: [

                    { name: '书名', key: 'bookName', displayInList: true },
                    { name: '索书号', key: 'callNumber', displayInList: true },
                    { name: '借阅次数', key: 'lendNumber', displayInList: true },
                    { name: '续借次数', key: 'renewals', displayInList: true },
                    { name: '图书单价', key: 'price', displayInList: true },
                    { name: '条码号', key: 'barCode', displayInList: true },
                     { name: '馆藏地名称', key:'collectionPlaceName', displayInList: true }
                ]
            };
        }
    }
};
</script>

<style>
</style>
