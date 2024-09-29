<template>
    <div class="container padding_20" :style="'height:'+height+'px'">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>工作量统计列表</div>
            <div class="display_flex">
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="printing" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
            </div>
        </div>
       
        <div class="overaoto" :style="$height(300)">
            <el-table
                :data="data"
                show-summary
                height="100%"
                v-loading='load'
                :summary-method="getSummaries"
                stripe
                style="width: 100%"
                >
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                prop="name"
                label="分类名称"
                sortable
                >
                </el-table-column>

                <el-table-column
                prop="number"
                label="分类号"
                sortable
                >
                </el-table-column>

                <el-table-column
                prop="countNumber"
                label="书目条数"
                sortable
            >
                </el-table-column>

                <el-table-column
                prop="bookNumber"
                label="册数"
                sortable
            >
                </el-table-column>

                <el-table-column
                prop="totalPrice"
                label="金额"
                sortable
                >
                </el-table-column>

                <el-table-column
                prop="percentage"
                label="百分比(≈)"
                sortable
                    >
                </el-table-column>


            </el-table>
        </div>
    </div>
</template>

<script>
import List from '../../../view/Lists';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            form: {},
            data:[],
            load:false,
            arr:[],
            lists:[],
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
        this.form = JSON.parse(this.$route.query.info);
        this.list =  JSON.parse(this.$route.query.list);
         this.format =  JSON.parse(this.$route.query.format);
          this.search();
        this.getForMat()
        this.getFied()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        jump(){
            let info = JSON.stringify(this.form)
            window.open(`/#/print/news?info=${info}`);
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                
            if (index === 0) {
                sums[index] = '总价';
                return;
            }else if(index === 1){
                sums[index] = '';
                return;
            }else if(index === 2){
                    sums[index] = '';
                return;
            }else if(index === 3){
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
            }else if(index === 4){
                const values = data.map(item => Number(item[column.property]));
                    sums[index] = values.reduce((prev, curr) => {
                           
                    const value = Number(curr);
                    //   debugger
                    
                    // value = value.replace(',','')
                    if (!isNaN(value)) {
                     
                        return prev + curr;
                    } else {
                        //   // console.log(prev)
                        return prev;
                    }
                    }, 0);
                    sums[index]
                    return
            }else if(index === 5){
                const values = data.map(item =>{
                   
                    item.totalPrice = item.totalPrice.replace(',','')
                  return  Number(item[column.property])
                });
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] = sums[index].toFixed(2)
                    return
            }
            else{
                    sums[index]='≈ 100%'
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
            if(!this.format.id){
                this.arr.map(it=>{
        
                    if(it.id == '1'){
                        format = it
                    }
               
            })
            }else{
                format = this.format
            }  
            this.ax.post('/manage/unit/catalog/catalogExcel/classificationWorkLoadResForCreateExcel',{classificationWorkLoadReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/catalog/catalogExcel/classificationWorkLoadRes', { params: this.form }).then(res => {    //获取内容   需要修改
             this.load=false
                this.data =res
            });
        },
        getForMat(){
            this.ax.get('/manage/unit/report/journalReport/excelFormat')    // 获取格式
                .then(res=>{
                      this.arr = res.content
                })
        },
        // 查询
        search() {
            let val ={}
            val.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.form = Object.assign(this.form,val)
            this.getList()
        },
        // 获取字段
        getFied(){
            this.ax.get('/manage/unit/catalog/catalogExcel/classificationWorkLoadResForExcelField')   //需要修改
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
                     { name: '分类名称', key: 'name', displayInList: true },
                    { name: '分类号', key: 'number', displayInList: true },
                    { name: '书目条数', key: 'countNumber', displayInList: true },
                     { name: '册数', key: 'bookNumber', displayInList: true }, 
                     { name: '金额', key: 'totalPrice', displayInList: true },
                    { name: '百分比', key: 'percentage', displayInList: true },
                ]
            };
        },
         printing(){
              let meta = [
                        { name: '分类名称', key: 'name', displayInList: true },
                        { name: '分类号', key: 'classificationNumber', displayInList: true },
                        { name: '册数', key: 'number', displayInList: true },
                      
                        { name: '金额', key: 'totalPrice', displayInList: true },
                      
                        { name: '百分比', key: 'percentage', displayInList: true },
                      
                      
            ]
                this.data = {
                    content:this.data
                }
               let data =JSON.stringify(this.data)
                meta=JSON.stringify(meta)
                let newsUrl = this.$router.resolve({path:'/print',query:{data,meta}})
                 window.open(newsUrl.href,'_blank')
            // window.open(`/#/print?data=${JSON.stringify({content:this.data})}&meta=${JSON.stringify(meta)}`);
        },
      
    }
};
</script>

<style>
</style>
