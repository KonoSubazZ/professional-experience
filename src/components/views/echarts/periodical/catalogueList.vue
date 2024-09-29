<template>
    <div class="container padding_20">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>编目清单列表</div>
            <div class="display_flex">
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="print" >打印</el-button>
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
         this.form = JSON.parse(this.$route.query.info);
        this.metaList();
        this.getForMat()
        this.getFied()
        // console.log(this.$route.query);
       
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
            let url
            if(this.form.fun==1){
                url='/manage/unit/journal/journalExcel/journalBaseResForCreateExcel'
            }else{
                url='/manage/unit/journal/journalExcel/journalResForCreateExcel'
            }
            this.ax.post(url,{journalBookingAllReq:this.form,format,list})   //需要修改地方 导出
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
            let url;
            if (this.form.fun == 1) {
                url = '/manage/unit/journal/journalExcel/journalBaseRes';
            } else {
                url = '/manage/unit/journal/journalExcel/journalRes';
            }
            this.ax.get(url, { params: this.form }).then(res => {    //获取内容   需要修改
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
              let url
              if (this.form.fun == 1) {
                url = '/manage/unit/journal/journalExcel/journalBaseResForExcelField';
            } else {
                url = '/manage/unit/journal/journalExcel/journalResForExcelField';
            }
            this.ax.get(url)  //需要修改
                .then(res=>{
                    this.lists = res
                })
        },
          metaList() {
             // console.log(this.form.fun)
            if (this.form.fun == 2) {
                // 册
                this.meta = {
                    edit: 'NONE',
                    export: 'NONE',
                    delete: 'NONE',
                    insertable: false,
                    subs: [
                        { name: '刊名', key: 'title', displayInList: true },

                        { name: 'ISSN', key: 'issn', displayInList: true },

                        { name: '条形码', key: 'barCode', displayInList: true },

                        { name: '第一责任者', key: 'responsible', displayInList: true },
                        { name: '出版社', key: 'publisher', displayInList: true },
                        
                        { name: '索书号', key: 'callNumber', displayInList: true },

                        { name: '分类号', key: 'classificationNumber', displayInList: true },
                        { name: '种次号', key: 'speciesNumber', displayInList: true },
                        { name: '辅助区分号', key: 'auxiliaryNumber', displayInList: true },

                        { name: '馆藏地址', key: 'collectionPlaceName', displayInList: true },
                         { name: '订购周期', key: 'cycleName', displayInList: true },

                        { name: '入库时间', key: 'warehousingTime', displayInList: true },
                        { name: '入库人员', key: 'managerName', displayInList: true },
                        { name: '编目时间', key: 'createTime', displayInList: true },

                        { name: '编目人员', key: 'managerNameBase', displayInList: true },
                        // { name: '状态', key: 'bookStatus', displayInList: true },
                        { name: '单价', key: 'price', displayInList: true }
                    ]
                };
            } else {
                // 种
                this.meta = {
                    edit: 'NONE',
                    export: 'NONE',
                    delete: 'NONE',
                    insertable: false,
                    subs: [
                        { name: '刊名', key: 'title', displayInList: true },
                        { name: 'ISSN', key: 'issn', displayInList: true },
                        { name: '条形码', key: 'barCode', displayInList: true },

                        { name: '第一责任者', key: 'responsible', displayInList: true },
                        { name: '出版社', key: 'publisher', displayInList: true },
                       

                        { name: '分类号', key: 'classificationNumber', displayInList: true },

                        { name: '种次号', key: 'speciesNumber', displayInList: true },

                        { name: '辅助区分号', key: 'auxiliaryNumber', displayInList: true },

                        { name: '馆藏地址', key: 'collectionPlaceName', displayInList: true },

                        { name: '编目人员', key: 'managerName', displayInList: true },

                        { name: '编目时间', key: 'createTime', displayInList: true },
                        
                      
                        
                        { name: '出版周期', key: 'publishingCycle', displayInList: true },
                         { name: '复本', key: 'number', displayInList: true },
                        { name: '单价', key: 'price', displayInList: true },
                        { name: '总价', key: 'totalPrice', displayInList: true },
                        
                    ]
                };
            }
        },
        print(){
            let meta
             if (this.form.fun == 2) {
            meta = [
                        { name: '刊名', key: 'title', displayInList: true },

                        { name: 'ISSN', key: 'issn', displayInList: true },

                        { name: '条形码', key: 'barCode', displayInList: true },

                        
                        { name: '索书号', key: 'callNumber', displayInList: true },
                      
                         { name: '出版周期', key: 'publishingCycle', displayInList: true },
                     
                        // { name: '状态', key: 'bookStatus', displayInList: true },

                        { name: '单价', key: 'price', displayInList: true }
                       
                      
            ]
             }else{
            meta = [
                        { name: '刊名', key: 'title', displayInList: true },
                        { name: 'ISSN', key: 'issn', displayInList: true },
                        { name: '条形码', key: 'barCode', displayInList: true },

                    
                        { name: '索书号', key: 'callNumber', displayInList: true },

                      

                  
                        
                        { name: '册数', key: 'number', displayInList: true },

                        
                        { name: '出版周期', key: 'publishingCycle', displayInList: true },

                        { name: '单价', key: 'price', displayInList: true },
                       
                      
            ]
             }
          

            window.open(`/#/print?data=${JSON.stringify(this.data)}&meta=${JSON.stringify(meta)}`);
        },
    }
};
</script>

<style>
</style>
