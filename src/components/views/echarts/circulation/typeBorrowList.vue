<template>
    <div class="container padding_20">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>类别借阅统计列表</div>
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
            this.ax.post('/manage/unit/circulation/circulationExcel/circulationBorrowClassificationResForCreateExcel',{circulationBorrowClassificationReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationBorrowClassificationRes', { params: this.form }).then(res => {    //获取内容   需要修改
                this.data = {
                    content:res
                }
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationBorrowClassificationResForExcelField')   //需要修改
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
                    { name: '统计项目', key: 'name', displayInList: true },
                    { name: '读者人次', key: 'readerFrequencyNumber', displayInList: true },
                    { name: '读者人数', key: 'readerNumber', displayInList: true },
                    { name: '书目种类', key: 'classificationNumber', displayInList: true },
                    { name: '书目册数', key: 'bookNumber', displayInList: true },
                    { name: '所占比例', key: 'percentageNumber', displayInList: true },
                    // { name: '读者单位名称', key: 'readerUnitName', displayInList: true },
                    //  { name: '馆藏地名称', key: 'collectionPlaceName', displayInList: true },
                    // { name: '题名', key: 'bookName', displayInList: true },
                    // { name: '分类号', key: 'classificationNumber', displayInList: true },
                    // { name: '预约日期', key: 'appointmentTime', displayInList: true },
                    // { name: '到书文献条码', key: 'barCode', displayInList: true },
                    // {
                    //     name: '阅览状态状态',
                    //     key: 'documentAppointmentStatus',
                    //     displayInList: true,
                    //     searchOption: [
                    //         { key: '0', name: '未完成', color: '' },
                    //         { key: '1', name: '完成', color: '' }
                    //     ]
                    // },
                    //  { name: '签到时间', key: 'signInTime', displayInList: true },
                    //   { name: '签退时间', key: 'checkOutTime', displayInList: true },
                    //    { name: '阅读时长', key: 'duration', displayInList: true },
                        // { name: '操作人', key: 'bookName', displayInList: true },
                    // {
                    //     name: '预约方式',
                    //     key: 'documentAppointmentMethod',
                    //     displayInList: true,
                    //     searchOption: [
                    //         { key: 'OFFLINE', name: '线下预约', color: '' },
                    //         { key: 'WECHAT', name: '微信预约', color: '' }
                    //     ]
                    // }
                ]
            };
        }
    }
};
</script>

<style>
</style>
