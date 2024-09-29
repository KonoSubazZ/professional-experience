<template>
    <div class="container padding_20" :style="'height:'+height+'px'">
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
        <div class="overaoto" :style="$height(270)">
        <el-table
            :data="data"
             v-loading='load'
             show-summary
             :summary-method="getSummaries"
             height="100%"
             stripe
             style="width: 100%;"
            >
           
            <el-table-column
            prop="name"
            label="统计项目"
            sortable
            >
            </el-table-column>

            <el-table-column
            prop="readerFrequencyNumber"
            label="读者人次"
            sortable
            >
            </el-table-column>

             <el-table-column
            prop="readerNumber"
            label="读者人数"
            sortable
            >
            </el-table-column>

               <el-table-column
            prop="classificationNumber"
            label="书目种类"
             sortable
           >
            </el-table-column>

            <el-table-column
            prop="bookNumber"
            label="书目册数"
             sortable
           >
            </el-table-column>

              <el-table-column
            prop="percentageNumber"
            label="所占比例(≈)"
             sortable
            >
            </el-table-column>


        </el-table>
        </div>
        <!-- :dataUrl="'/manage/unit/circulation/circulationExcel/circulationDocumentRes'" -->
        <!-- <List
             :style="$height(260)"
            :data='data'
            :disableMeta="true"
            :tableMeta="meta"
            v-loading='load'
            :disableTableAction="true"
            @search="search"
            ref="list"
        ></List> -->
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
            data:[],
            arr:[],
            lists:[],
            format:'',
            list:[],
            load:false,
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
        this.form = JSON.parse(this.$route.query.info);
      this.list =  JSON.parse(this.$route.query.list);
         this.format =  JSON.parse(this.$route.query.format);
      this.search({platformId :JSON.parse(localStorage.getItem("user")).platform.id})

    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            else if(index === 5){
                    sums[index]='≈ 100%'
                    return  
            }else{
                const values = data.map(item => Number(item[column.property]));
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index];
                    return
            }
            });
            return sums;
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
            this.load=true
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationBorrowClassificationRes', { params: this.form }).then(res => {    //获取内容   需要修改
              this.data = res
                console.log(res)
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
            this.ax.get('/manage/unit/circulation/circulationExcel/circulationBorrowClassificationResForExcelField')   //需要修改
                .then(res=>{
                    this.lists = res
                })
        },
        printing(){
              let meta = [
                  { name: '统计项目', key: 'name', displayInList: true },
                    { name: '读者人次', key: 'readerFrequencyNumber', displayInList: true },
                    { name: '读者人数', key: 'readerNumber', displayInList: true },
                    { name: '书目种类', key: 'classificationNumber', displayInList: true },
                    { name: '书目册数', key: 'bookNumber', displayInList: true },
                    { name: '所占比例', key: 'percentageNumber', displayInList: true },
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
                    { name: '读者人次', key: 'readerFrequencyNumber', displayInList: true },
                    { name: '读者人数', key: 'readerNumber', displayInList: true },
                    { name: '书目种类', key: 'classificationNumber', displayInList: true },
                    { name: '书目册数', key: 'bookNumber', displayInList: true },
                    { name: '所占比例', key: 'percentageNumber', displayInList: true },
                  
                ]
            };
        }
    }
};
</script>

<style>
</style>
