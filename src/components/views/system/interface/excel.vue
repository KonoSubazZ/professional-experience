<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>转换Excel表格选择</div>
                <div class="display_flex">
                     <el-button type="primary"  @click="save">开始转换</el-button>
                </div>
            </div>
            <div class="padding_20 m-b-10 display_flex start infos">
                <form-data :row="1" ref="form" :rule = rules :list="list" :labelWidth='"80px"' :model='form' class="w-25" ></form-data>
                <div class="display_flex padding_20 w-60">
                    <div class="el-form-item__label " style="width:150px">MARC</div>
                    <el-input v-model="input" class="w-30 m-r-20" disabled ></el-input>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/manage/unit/system/dataReceive/excelToMarcDisplay"
                        :on-change='uploadBefore'
                        :show-file-list='false'
                        :data='form'
                        :headers='headers'
                        :on-success="handleAvatarSuccess"
                        :file-list="fileList"
                        :before-upload="beforeAvatarUpload"
                        >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>
                <el-pagination
                            class="pages"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="20"
                            layout=" prev, pager, next, jumper,total"
                            :total="loadInfo.mapList.length">
                </el-pagination>
            </div>

            <div class="padding_20 display_flex between start" >
                <div class="w-20 m-r-20 b-1"  >
                    <div class="display_flex satrt between w-100"  >
                            <div class="Excel_key_list w-50 ">Excel字段</div>
                            <div class="Excel_key_list w-50 ">Marc字段</div>
                    </div>
                    <div  style="height:300px;overflow:auto;border-bottom:1px solid #ddd" class="w-100 " >
                        <div v-for="(item,i) of loadInfo.keyList" :key="i" class="display_flex between satrt " >
                            <div  class="Excel_key_info w-50"  >{{item}}</div>
                            <el-select
                                    v-model="marcList[i]"
                                    filterable
                                    @change="getInfo(marcList[i],i,item)"
                                    class="w-50"
                                >
                                    <el-option
                                         v-for="(its,k) in selectList"
                                        :key="k"
                                        :label="its.content"
                                        :value="k"
                                    ></el-option>
                            </el-select>
                        </div>
                            
                     
                    </div>


                    <div>
                         <div class="Excel_key_list padding_20 m-b-10">转换模板</div>

                         <div class="padding_20 models_conten" :style="$height(720)" >
                             <div v-for="item of model" :key="item " class="display_flex start between">
                                 <div class="w-10 f-s-12">{{item.code}}</div>

                                 <div class="w-80 f-s-12">{{item.content}}</div>
                             </div>
                         </div>
                    </div>
                </div>

                <div class="w-80 cel_content" :style="'height:'+height2+'px'">
                    <!-- <div class="cel_name">表格内容</div> -->
                    <el-table
                    :data="listMap"
                    stripe
                    :height="height9"
                    class="tableList"
                    >

                        <div v-for="(item,i) of loadInfo.keyList" :key="i" >
                            <el-table-column
                                :fixed='i==0'
                                :prop="item"
                                :label="item"
                                >
                            </el-table-column>
                        </div>
                   
                   
                    </el-table>
                       
                 
                    <!-- <div class="w-100" >
                        <div class="display_flex">
                            <div  v-for="(item,i) of loadInfo.keyList" :key="i" class="title_cel">{{item}}</div>
                        </div>
                  
                     <div class="excel w-100" :style="$height(440)" >
                        
                         <div  class="display_flex" v-for="(item,i) of loadInfo.mapList" :key="i">
                            <div  v-for="(it,j) of loadInfo.keyList" :key="j" class="center_cel">{{item[it]}}</div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>

     
    </div>
</template>

<script>
import formData from '../../../view/form';

export default {
    components: {
        formData
    },
    data() {
        return {
            bus: this.bus(this),
             headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
          height:'',
          height2:'',
          height9:'',
            forms:[
                {excelKey:'',code:'',content:'',district:'',note:''}
            ],//
            list: [
                { name: '文件编码', id: 'enCoding',type:'select',labelWidth:'100px',options:[
                    {name:'GB2312',id:'GB2312'},
                    {name:'GBK',id:'GBK'},
                    {name:'GB18030',id:'GB18030'},
                    {name:'UTF-8',id:'UTF-8'}
                ] },
                // { name: 'MARC', id: 'accessKeyId' },
            ],
            rules:{

            },
            currentPage:1,
            model:[],
            selectLists:'',
            marcList:[],
            selectList:[],
            fileList:[],
            form:{
              enCoding: 'GB18030'
            },
            loadInfo:{
                mapList:[]
            },
            listMap:[],
            input:''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;
          this.height2 = document.documentElement.clientHeight -350;
          this.height9 = document.documentElement.clientHeight -360;

        },100)
      },
        // 获取数组
        getMapList(){
            this.ax.get('/manage/unit/system/dataReceive/excelToMarcArea')
                .then(res=>{
                    // // console.log(res)
                    this.selectList =  res
                })
        },
        getInfo(val,index,item){
            // // console.log(this.marcList)
            // // console.log(val)

            // // console.log(index)
            let info = {excelKey:'',code:'',content:'',district:'',note:''}
            // // console.log(item)
             info.code = this.selectList[val].code
              info.content = this.selectList[val].content
               info.district = this.selectList[val].district
                info.note = this.selectList[val].note
                 info.excelKey =item
                 this.forms[index] = info
             this.getModel()
        },
        getModel(){
            let params={
                aresList:this.forms,
                map:this.loadInfo.mapList[0]
            }
            this.ax.post('/manage/unit/system/dataReceive/excelToMarcTemplate',params)
                .then(res=>{
                    // console.log(res)
                    this.model = res
                })
        },
        uploadBefore(val){
       },
        beforeAvatarUpload(val){
             if(val.name.indexOf('.xls')==-1 && val.name.indexOf('.xlsx')==-1){
                 this.sloading()
                 this.$message.error('文件类型错误');
                return false
            }
            this.input =val.name
            this.loading()
        },
        changePage(){
           this.listMap =  this.loadInfo.mapList.slice( (this.currentPage-1) * 20, this.currentPage * 20 )
        },
        handleCurrentChange(val){
            this.currentPage = val
            this.changePage()
        },
        handleAvatarSuccess(val){
            this.sloading()
            if(val.code==200){
                this.loadInfo = val.data
                this.changePage()
               
                this.getMapList()
            }else{
                return this.$message.error(val.msg);
            }
            // // console.log(val.code==200)
               
            // this.form.name=this.input
            // this.$router.push({
            //     path:'uploadBook/copyImport',
            //     query:{info:JSON.stringify(this.form),marc:JSON.stringify(val.data)}
            // })
        },
        save(){
            if(!this.form.enCoding){
                return this.$message.error('请选择文件编码');
            }
            let params={
                aresList:this.forms,
                enCoding:this.form.enCoding,
                fileParent:this.loadInfo.fileParent,
                map:this.loadInfo.mapList[0]
            }
            this.ax.post('/manage/unit/system/dataReceive/excelToMarc',params)
                .then(res=>{
                     this.FileSaver.saveAs(res,"excel转marc.iso")
                      this.$confirm('是否继续馆藏书目导入?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$router.push('/manage/interface/uploadBook')
                        }).catch(() => {
                               
                    });
                })
        },
    }
};
</script>

<style scoped >
.b-1{
    border: 1px solid #ddd;
}
.Excel_key_list{
    /* width:150px; */
    height: 30px;
    line-height: 30px;
    background:#f5f7fa;
    padding:0 10px;
    box-sizing: border-box;
    /* border-right: 1px solid #ddd; */
}
.Excel_key_info{
     height: 30px;
    line-height: 30px;
    /* background:rgb(23, 245, 90); */
    box-sizing: border-box;
    text-align: right;
    padding: 0 10px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

/* 表格内容展示 */
.cel_content{
    /* overflow: auto; */
    border: 1px solid #ddd;
    padding: 10px;
    box-sizing: border-box;
}
.cel_name{
    line-height: 30px;
}
.excel{
    overflow: auto;
    border: 1px solid #ddd;
}
.title_cel{
    width: 120px;
    height: 30px;
    line-height: 30px;
    background:rgb(23, 245, 90);
    box-sizing: border-box;
    text-align: right;
    padding: 0 10px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}
.center_cel{
    width: 120px;
    height: 30px;
    line-height: 30px;
    /* background:rgb(23, 245, 90); */
    box-sizing: border-box;
    text-align: right;
    padding: 0 10px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}
.models_conten{
    overflow: auto;
}
.tableList{
     width: 100%;
     /* overflow-y:scroll; */
    /* overflow: scroll; */
}
.infos{
    position: relative;
}
.pages{
    position: absolute;
    top: 40px;
    right: 20px;
}
</style>
