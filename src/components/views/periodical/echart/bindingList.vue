<template>
    <div class="container padding_20">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>装订单列表</div> 
            <div class="display_flex">
                 <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="print" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
                <!-- <div @click="exportAll" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/export.png" class="btn_img" />
                    <div class="f-s-14">导出</div>
                </div>
                <div @click="print" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/export.png" class="btn_img" />
                    <div class="f-s-14">打印</div>
                </div>
                <div @click="back" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
            </div>
        </div>
        <!-- :dataUrl="'/manage/unit/circulation/circulationExcel/circulationDocumentRes'" -->
        <List
             
            :data='data'
            :disableMeta="true"
            :tableMeta="meta"
            :disableTableAction="true"
            :isHeaderHeigt='80'
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
            form: {},
            data:{},
            arr:[],
            lists:[],
            format:'',
            list:[]
        };
    },
    created() {
        this.metaList();
        this.getForMat()
        this.getFied()
        // console.log(this.$route.query);
        this.form = JSON.parse(this.$route.query.info);
        this.list =  JSON.parse(this.$route.query.list);
         this.format =  JSON.parse(this.$route.query.format);
    },
    methods: {
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
            this.ax.post('/manage/unit/journal/journalExcel/journalBookingBindingForCreateExcel',{journalBookingAllReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/journal/journalExcel/journalBookingBindingRes', { params: this.form }).then(res => {    //获取内容   需要修改
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
            this.ax.get('/manage/unit/journal/journalExcel/journalBookingBindingResForExcelField')   //需要修改
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
                    { name: 'ISBN', key: 'issn', displayInList: true },
                    { name: '刊名', key: 'title', displayInList: true },
                    { name: '分类号', key: 'classificationNumber', displayInList: true },
                     { name: '责任者', key: 'responsible', displayInList: true },
                      { name: '订购周期', key: 'cycleName', displayInList: true },
                    { name: '价格', key: 'price', displayInList: true },
                    { name: '复本', key: 'copy', displayInList: true },
                    { name: '期', key: 'cycleNumber', displayInList: true }, 
                    { name: '总价', key: 'totalPrice', displayInList: true },
                    { name: '是否装订', key: 'bindingStatus', displayInList: true },
                    { name: '装订份数', key: 'bindingNumber', displayInList: true },
                ]
            };
        },
        print(){
             let meta = [
                         { name: 'ISSN', key: 'issn', displayInList: true },
                        { name: '刊名', key: 'title', displayInList: true },
                        { name: '分类号', key: 'classificationNumber', displayInList: true },
                       
                        { name: '订购周期', key: 'cycleName', displayInList: true },
                        { name: '价格', key: 'price', displayInList: true },
                        { name: '复本', key: 'copy', displayInList: true },
                         { name: '期', key: 'cycleNumber', displayInList: true }, 
                       
                      
            ]

            window.open(`/#/print?data=${JSON.stringify(this.data)}&meta=${JSON.stringify(meta)}`);
        },
    }
};
</script>

<style>
</style>
