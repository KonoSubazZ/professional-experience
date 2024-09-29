<template>
    <div class="container" :style="'height:'+height+'px'">
            <div class="searchBox display_flex start">
                <el-select v-model="search.marcTypeId" clearable filterable placeholder="MARC类型" class="m-r-20 w-20">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>

                <div class="display_flex  m-r-20 w-40" >
                    <el-input
                        placeholder="文献条码范围"
                        v-model="search.barCodeStart"
                        clearable>
                    </el-input>
                    <div class="padding_20">——</div>
                    <el-input
                        placeholder="文献条码范围"
                        v-model="search.barCodeEnd"
                        clearable>
                    </el-input>
                </div>

                <div class="display_flex m-r-20 w-40">
                    <el-date-picker v-model="search.createTimeStart" class="w-40" value-format="yyyy-MM-dd" type="date" placeholder="编目时间"></el-date-picker>
                    <div class="padding_20">——</div>
                    <el-date-picker v-model="search.createTimeEnd" class="w-40" value-format="yyyy-MM-dd" type="date" placeholder="编目时间"></el-date-picker>
                </div>
                
                <el-select v-model="search.collectionPlaceId" clearable filterable placeholder="馆藏地址" class="m-r-20 w-20">
                    <el-option
                    v-for="item in option"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="search.type" clearable filterable placeholder="是否在馆" class="m-r-20 w-20">
                    <el-option
                    label="在馆"
                    value="1">
                    </el-option>
                     <el-option
                    label="未在馆"
                    value="0">
                    </el-option>
                </el-select>

                 <el-input
                       class="w-20 m-r-20"
                        placeholder="操作员"
                        v-model="search.managerName"
                        clearable>
                </el-input>

                 <div class="m-r-20">
                    <el-button type="primary btn_click w-100" @click="searchInfo()" :loading="load_mode" >查询</el-button>
                </div>

                 <div >
                    <el-button type="primary btn_click w-100" @click="out()"  >输出</el-button>
                </div>

            </div>

            <div :style="$height(315)" class="padding_20">
                <el-table
                :data="tableData.content"
                stripe
                height='100%'
                style="width: 100%">

                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                    prop="isbn"
                    align='center'
                    label="ISBN"
                    >
                </el-table-column>
                <el-table-column
                 align='center'
                    prop="classificationNumber"
                    label="分类号"
                    >
                </el-table-column>
                 <el-table-column
                  align='center'
                    prop="positiveTitle"
                    label="正题名"
                    >
                </el-table-column>
                 <el-table-column
                  align='center'
                    prop="publisher"
                    label="出版社"
                    >
                </el-table-column>
                 <el-table-column
                    prop="publicationDate"
                     align='center'
                    label="出版日期"
                    >
                </el-table-column>
                 <el-table-column
                   align='center'
                    prop="price"
                    label="价格"
                    >
                </el-table-column>
                </el-table>
            </div>

             <div class="pagination" v-if="tableData">
                    <el-pagination
                        background
                        layout="sizes,total, prev, pager, next"
                        :current-page="tableData.number+1"
                        :page-sizes="[20,100,200,300,500]"
                        :page-size="tableData.size"
                        :total="tableData.totalElements"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    ></el-pagination>
            </div>
       
    </div>
</template>

<script>
import List from '../../../view/List'
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'',
           options:[],
           option:[
               {name:'全部地址',id:null}
           ],
           dialogVisible:false,
           search:{
               page:1,
               size:20,
               platformId:JSON.parse(localStorage.getItem('user')).platform.id
           },
           load_mode:false,
           tableData:[],
            height:''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
       this.searchInfo()    
        // this.metaList()
        this.getMarc()
        this.getPlace(0)
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        searchInfo(){
            this.loading()
            let params= this.search
            // params.type='1'
            this.ax.get('/manage/unit/system/dataReceive/getBookExportRes',{params})
                .then(res=>{
                      this.sloading()
                    this.tableData = res
                })
        },
        onPageSizeChange(val){
            this.search.size =val
              this.searchInfo()    
        },
        onPageChange(val){
              this.search.page =val
              this.searchInfo()    
        },
        out(){
             this.$router.push({
                 path:'exportOut/outSet',
                 query:{parmas:JSON.stringify(this.search)}
             })
        },
        getMarc(){
            this.ax.get('/manage/unit/system/dataReceive/marcTypeDetail',{params:{size:999, platformId:JSON.parse(localStorage.getItem('user')).platform.id}})
                .then(res=>{
               
                    this.options = res.content
     
                })
        },
        getPlace(){
            this.ax.get('/manage/unit/general/collectionPlace',{params:  { type:'LITERATURE',size: 999, platformId: JSON.parse(localStorage.getItem('user')).platform.id }})
             .then(res=>{
               
                    this.option = this.option.concat(res.content)
     
                })
        },
        // updata(val){
        //     this.getMarc(val.originalMarc)
        // },
        // deleteUpdate(val){
        //      this.loading();
        //     let ids = val.map(it=>{
        //         return it.id
        //     }).join(',')
        //     this.ax.delete('/manage/unit/system/dataReceive/deleteBookBaseById?ids='+ids)
        //         .then(res=>{
        //             this.sloading();
        //             this.bus.$emit(`flash_/manage/unit/system/dataReceive/getBookExportRes`, res);
        //             this.$message.success('删除成功');
        //         })
        // },
        // getMarc(marc){
        //     this.loading()
        //     this.ax.post('/manage/unit/system/dataReceive/jxMarc',{marc,enCoding:'GBK'})
        //         .then(res=>{
        //             // console.log(res)
        //               this.sloading()
        //             this.MarcList=res
        //             this.dialogVisible =true
        //         })
        // },
        // metaList(){
        //    this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.BookBase'}})
        //     .then(res=>{
                
        //     })
        // },
    }
};
</script>

<style scoped>
    .searchBox{
        padding:20px 16px 25px 16px 
    }
    .pagination{
        padding:15px 20px;
    }
</style>
