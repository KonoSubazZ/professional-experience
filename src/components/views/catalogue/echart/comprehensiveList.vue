<template>
    <div class="container padding_20" :style="'height:'+height+'px'">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>编目综合统计列表</div>
            <div class="display_flex">
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="printing" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
            </div>
        </div>
       
            <el-table
            :data="data"
            show-summary
            v-loading='load'
            :summary-method="getSummaries"
             stripe
             class="mineAlone"
             style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                prop="name"
                label="统计项目名称"
                sortable
                >
                </el-table-column>

                <el-table-column
                prop="classificationNumber"
                label="文献种数"
                sortable
                >
                </el-table-column>

                <el-table-column
                prop="number"
                label="文献册数"
                sortable
            >
                </el-table-column>

                <el-table-column
                prop="totalPrice"
                label="金额码洋"
                sortable
                >
                </el-table-column>

                <el-table-column
                    prop="percentage"
                    label="册数占比(≈)"
                    sortable
                    >
                </el-table-column>


        </el-table>
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
            arr:[],
            dataList:[],
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
        this.getForMat()
        this.getFied()
        this.form = JSON.parse(this.$route.query.info);
        delete this.form.batchName
        this.list =  JSON.parse(this.$route.query.list);
        this.format =  JSON.parse(this.$route.query.format);
        this.search();
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
         jump(){
            
            let info = JSON.stringify(this.form)
            window.open(`/#/printCom?info=${info}`);
        },
        countNumber(column,name,data,isMoney){
                    const values = data.map(item =>{
                      if(isMoney){
                            item[column.property] = (item[column.property]+'').split(',').join('')*1
                          return Number(item[column.property])
                      }else{
                         return Number(item[column.property])
                      }
                    }
                    
                    );
                    name = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    if(isMoney){
                         return  name =name.toFixed(2)
                    }else{
                         return  name
                    }
                   
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '总计';
                return;
            }else if(index === 1){
                sums[index] = '';
                return;
            }else if(index === 2){
                sums[index] =  this.countNumber(column,sums[index],data)
            }else if(index === 3){
                sums[index] = this.countNumber(column,sums[index],data)
            }else if(index === 4){
               sums[index] =  this.countNumber(column,sums[index],data,true)
            }else if(index === 5){
              // const values = data.map(item => item[column.property]);
              // let p = ''
              // values.forEach(e=>{
              //   p+=e.split('%')[0]+','
              // })
              // if(p.length>0){
              //   p = p.substring(0, p.length - 1);
              // }
              // const arrs = p.split(',')
              // sums[index] = arrs.reduce((prev, curr) => {
              //   const value = Number(curr);
              //   if (!isNaN(value)) {
              //     return Number(prev) + Number(curr);
              //   } else {
              //     //   // console.log(prev)
              //     return Number(prev);
              //   }
              // }, 0);
              // sums[index]= Number(sums[index].toFixed(2))>100? '100%': sums[index].toFixed(2) + '%'
              sums[index] = '≈ 100%'
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
            this.ax.post('/manage/unit/catalog/catalogExcel/bookBaseTogetherResForCreateExcel',{bookBaseTogetherReq:this.form,format,list})   //需要修改地方 导出
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
            this.ax.get('/manage/unit/catalog/catalogExcel/bookBaseTogetherRes', { params: this.form }).then(res => {    //获取内容   需要修改
              console.log(666,res)
                this.load=false
                this.data =res
            }).catch(res=>{
                 this.load=false
            })
        },
        getForMat(){
            this.ax.get('/manage/unit/report/journalReport/excelFormat')    // 获取格式
                .then(res=>{
                    // // console.log(res)
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
            this.ax.get('/manage/unit/catalog/catalogExcel/bookBaseTogetherResForExcelField')   //需要修改
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
                     
                    { name: '统计项目名称', key: 'name', displayInList: true },
                    { name: '文献种数', key: 'classificationNumber', displayInList: true },
                    { name: '文献册数', key: 'number', displayInList: true },
                     { name: '金额码洋', key: 'totalPrice', displayInList: true },
                    { name: '册数占比', key: 'percentage', displayInList: true },
                    
                   
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
             let data =JSON.stringify({content:this.data})
                meta=JSON.stringify(meta)
                let newsUrl = this.$router.resolve({path:'/print',query:{data,meta}})
                window.open(newsUrl.href,'_blank')
        },
    }
};
</script>

<style>
</style>
