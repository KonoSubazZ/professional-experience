<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>输出设置</div>
                <div class="display_flex">
                    <!-- <div class="cursor text_center m-r-20" @click="outGo">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">开始输出</div>
                    </div>
                     <div class="cursor text_center m-r-20" @click="back">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">返回</div>
                    </div> -->
                     <el-button-group>
                                 <el-button type="primary" plain icon="el-icon-folder-add"  @click="outGo" >开始输出</el-button>
                                  <el-button type="primary" plain icon="el-icon-delete"  @click="back" >返回</el-button>
                    </el-button-group>
                </div>
            </div>
            <div class="padding_20 m-b-20">
                    <div class="display_flex padding_20">
                        <div class="display_flex w-20">
                            <div class="el-form-item__label" style="width:100px">编码格式</div>
                            <el-select v-model="form.enCoding" filterable placeholder="MARC类型" class="m-r-20 w-100">
                                <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="w-20 display_flex">
                            <div class="display_flex">
                             <div class="el-form-item__label" style="width:100px">馆藏格式</div>
                             <el-checkbox v-model="form.fiveStr">输出905字段[■b文献条码■d分类号■e种类号■v辅助区分号■f复本数]</el-checkbox>
                        </div>
                        </div>

                </div>

               
            </div>
             <div class="display_flex between header_title padding_20 m-b-20">
                <div class>自定义馆藏输出方式及配置</div>
                <div class="display_flex">
                   
                </div>
            </div>
              <div class="padding_20">
                    <div class=" padding_20">

                        <div class="display_flex m-b-20">
                             <!-- <div class="el-form-item__label" style="width:100px">输出类型</div> -->
                            <div class=" w-10">
                                  <el-checkbox  v-model="form.customize">开启自定义字段输出</el-checkbox>
                            </div>

                            <div class="display_flex w-30 ">
                                    <div class="el-form-item__label" style="width:100px">输出字段</div>
                                     <el-input v-model="form.customizeSubField" class="w-20" placeholder=""></el-input>
                            </div>

                            <div class="w-40 display_flex">
                                <div class="el-form-item__label" style="width:140px">多复本输出方式</div>
                                <el-radio-group v-model="radio" @change="chooseRepit">
                                    <el-radio :label="1">重复字段</el-radio>
                                    <el-radio :label="2">重复子字段</el-radio>
                                
                                </el-radio-group>
                            </div>
                        </div>

                        <div class="display_flex">
                             <div class="w-100" :style="$height(420)">
                                 <el-table
                                    :data="tableData"
                                    height='100%'
                                    @selection-change="handleSelectionChange"
                                    style="width: 65%">

                                    <el-table-column
                                    type="selection"
                                    width="55">
                                    </el-table-column>
                                    <el-table-column
                                        prop="cnName"
                                        align='center'
                                        label="数据库字段"
                                        >
                                  
                                    </el-table-column>
                                    <el-table-column
                                        prop="subField"
                                        align='center'
                                        label="子字段名"
                                        >
                                      <template slot-scope="scope">
                                          <el-input v-model="scope.row.subField" ></el-input>
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="customize"
                                        align='center'
                                        label="自定义"
                                        >
                                        <template slot-scope="scope">
                                            <el-checkbox v-model="scope.row.customize"></el-checkbox>
                                          
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="content"
                                        align='center'
                                        label="自定义值"
                                       
                                        >
                                        <template slot-scope="scope">
                                             <el-input v-model="scope.row.content"  :disabled='!scope.row.customize' ></el-input>
                                        </template>
                                    </el-table-column>

                                    </el-table>
                             </div>
                        </div>

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
        return {bus: this.bus(this),
            options:[
                    {name:'GB2312',id:'GB2312'},
                    {name:'GBK',id:'GBK'},
                    {name:'GB18030',id:'GB18030'},
                    {name:'UTF-8',id:'UTF-8'}
                ] ,
            tableData:[],
            chooseList:[],
            form:{
                enCoding:'GB18030',
                fiveStr:true,
                bookExportReq:{},
                customize:false,
                customizeSubField:'',
                repeatField:false,
                repeatSubField:true,
                resList:[]
            },
            radio:'',
            height: ''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        if(this.$route.query){
            // // console.log(JSON.parse(this.$route.query.parmas))
            this.form.bookExportReq = JSON.parse(this.$route.query.parmas)
            // // console.log()
        }
        this.getMarc()
    },  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        outGo(){
            this.loading()
           if(this.form.resList && this.form.resList.length>0){
                this.form.resList.map(it=>{
                it.display = true
            })
           }
            this.ax.post('/manage/unit/system/dataReceive/exportBookExportRes',this.form)
                .then(res=>{
                     this.sloading()
                     this.FileSaver.saveAs(res, res);
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        getMarc(){
            this.ax.get('/manage/unit/system/dataReceive/getMarcExportRes')
                .then(res=>{
                    // console.log(res)
                    this.tableData = res
                })
        },
        chooseRepit(val){
            if(val==1){
                  this.form.repeatField=true
                  this.form.repeatSubField=false
            }else{
                  this.form.repeatField=false
                  this.form.repeatSubField=true
            }
        },
        handleSelectionChange(val){
            this.form.resList = val
        },
    }
};
</script>

<style scoped >

</style>
