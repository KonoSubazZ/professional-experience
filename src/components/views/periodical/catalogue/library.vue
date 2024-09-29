<template>
   <div >
    <div class="container library " :style="'height:'+height+'px'" @keyup="monitor" >
       <div class="display_flex between header_title padding_20 m-b-20">
           <div class="title_library">
               图书编目
           </div>
           <div class="display_flex">
                <div @click="search" class="cursor text_center m-r-10">
                    <img src="../../../../assets/img/search.png" class="btn_img" />
                    <div class="f-s-14">检索（F）</div>
                </div>
                <div @click="register" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/book.png" class="btn_img" />
                    <div class="f-s-14">套录（T）</div>
                </div>
                <div @click="copy" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/copy.png" class="btn_img" />
                    <div class="f-s-14">复本（C）</div>
                </div>
                <div @click="copys(true)" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/more.png" class="btn_img" />
                    <div class="f-s-14">多卷（M）</div>
                </div>
                <div @click="edit" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/edit.png" class="btn_img" />
                    <div class="f-s-14">修改（E）</div>
                </div>
                <div @click="add" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">新增（N）</div>
                </div>
                <div @click="del" class="text_center cursor m-r-10">
                    <img src="../../../../assets/img/del.png" class="btn_img" />
                    <div class="f-s-14">删除（D）</div>
                </div>
                <div @click="setDefault" class="text_center cursor">
                    <img src="../../../../assets/img/default.png" class="btn_img" />
                    <div class="f-s-14">默认参数</div>
                </div>
            </div>
       </div>
       <div class="padding_20 m-b-30">
           <div class="display_flex w-100">
               <div class="display_flex w-25 m-r-20">
                   <div class="title_info m-r-20">查询项目</div>
                   <el-select v-model="searchType" placeholder="请选择" class="w-80" >
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :disabled="item.disabled"
                        :value="item.value">
                        </el-option>
                    </el-select>
               </div>
                <div class="display_flex w-25">
                   <div class="title_info m-r-20">查询内容</div>
                   <el-input v-model="content" placeholder="请输入内容" autofocus id="getFocus" @keyup.enter.native="search" ref='searchCotent' class="w-80"></el-input>

               </div>
           </div>
       </div>
       <div class="">
           <div class="padding_20 source m-b-30">检索源</div>
           <div class="padding_20 m-b-30">
               <el-checkbox-group v-model="checkList" @change="chooseBox">
                    <el-checkbox :label="item" :checked='item.checked'  v-for="item of searchFrom" :key='item.id'>{{item.serviceName}}</el-checkbox>
                </el-checkbox-group>
           </div>
           <!-- 查询列表 -->
           <div  v-if="tableData.length>0">
               <!-- " -->
                <div class="padding_20 source m-b-30">命中数据列表</div>
                <div class="padding_20 m-b-80" >
                        <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                               border
                            highlight-current-row
                            @current-change="handleCurrentChoose"
                            @row-dblclick="handledbClick"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                           >
                            <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>

                            <el-table-column
                            v-if="checkList[0].serviceName=='本馆数据库'"
                            prop="callNumber"
                             align='center'
                             width="180"
                            label="索书号">
                              <template slot-scope="scope">
                                    <div>{{scope.row.callNumber}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                            v-else
                            prop="classificationNumber"
                             align='center'
                             width="180"
                            label="分类号">
                               <template slot-scope="scope">
                                    <div>{{scope.row.classificationNumber}}</div>
                                </template>
                            </el-table-column>

                             <el-table-column
                            prop="title"
                            align='center'
                             width="370"
                            v-if="checkList[0].serviceName=='本馆数据库'"
                            label="刊名">
                             <template slot-scope="scope">
                                <el-popover trigger="hover" placement="right">
                                <div v-if="listCode.length>0">
                                    <p v-for="item of listCode" :key="item.id">{{ item }}</p>
                                </div>
                                <div v-else>
                                    <p >无馆藏</p>
                                </div>
                               
                                <div slot="reference" class="name-wrapper" @mouseover="getCodes(scope.row.id)"  >
                                    {{ scope.row.title }}
                                </div>
                                </el-popover>
                            </template>
                            </el-table-column>


                            <el-table-column
                              v-else
                              align='center'
                               width="360"
                            prop="title"
                            label="刊名">
                            </el-table-column>
                            <el-table-column
                                width="180"
                                align='center'
                                label="ISSN">
                                 <template slot-scope="scope">
                                    <div> {{ scope.row.issn?scope.row.issn:scope.row.isbnUnite}}</div>
                                </template>
                             </el-table-column>
                            <el-table-column
                            prop="pageNumber"
                             width="100"
                             align='center'
                            label="页码">
                             </el-table-column>
                            <el-table-column
                            prop="priceStr"
                             width="100"
                             align='center'
                            label="价格">
                            </el-table-column>
                            <el-table-column
                            prop="publicationDate"
                             width="100"
                             align='center'
                            label="出版时间">
                             </el-table-column>
                             <el-table-column
                            prop="publisher"
                             width="150"
                             align='center'
                            label="出版社">
                             </el-table-column>
                  
                             <el-table-column
                            prop="source"
                           
                             align='center'
                            label="来源（数据库）">
                             </el-table-column>
                        </el-table>
                        <el-pagination
                            
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="pageSize"
                            layout=" prev, pager, next, jumper,total, sizes"
                            :total="list.length">
                        </el-pagination>
                </div>
           </div>
       </div>
    </div>
    <div class="container library_bottom display_flex ">
         <div class="w-25"> 默认文献：{{defa.mediumName?defa.mediumName:'未设置'}}</div>
         <div class="w-25"> 默认语种：{{defa.languageName?defa.languageName:'未设置'}}</div>
         <div class="w-25"> 默认批次：{{defa.batchName?defa.batchName:'未设置'}}</div>
         <div class="w-25"> 默认藏址：{{defa.collectionPlaceName?defa.collectionPlaceName:'未设置'}} </div> 
    </div>


    <!-- 弹框 -->
    <el-dialog title="参数设置" :visible.sync="openDefa" width='45%' :close-on-click-modal='false'>
        <el-dialog
                width="30%"
                :title="newAddName"
                :visible.sync="innerVisible"
                append-to-body>    
                <el-form :model="form" :rules="rule" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item :label="newAddLab==1?'批次名称':newAddLab==2?'供货单位':'馆藏地名称'" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                            <el-checkbox v-model="form.defaultSetting">是否默认</el-checkbox>
                        </el-form-item>

                        <el-form-item label="备注"  >
                            <el-input v-model="form.note" maxlength='200' type="textarea" :rows="2"></el-input>
                        </el-form-item>
                       
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBatch('form')" v-if="newAddLab==1">确 定</el-button>
                    <el-button type="primary" @click="addUnit('form')" v-else-if="newAddLab==2">确 定</el-button>
                    <el-button type="primary" @click="addPlace('form')" v-else>确 定</el-button>
                </span>
        </el-dialog>
            <el-form :model="defa" :rules="rules" ref="defa" label-width="124px" class="m-b-30">
                      <div class="display_flex between">
                                <div class="w-50 display_flex ">
                                    <el-form-item label="供货单位"  prop='deliveryUnitId' class="m-r-10">   
                                        <el-select v-model="defa.deliveryUnitId" clearable placeholder="请选择" class="w-100" @change="getCode('deliveryUnitName','deliveryUnits',defa.deliveryUnitId)">
                                            <el-option
                                            v-for="item in params.deliveryUnits"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="add_btn cursor" @click="openUnits">+</div>
                                </div>
                               <div class="w-50 display_flex" >
                                    <el-form-item label="订购年份"   >   
                                            <el-input v-model="defa.year"  ></el-input>
                                    </el-form-item>
                               </div>
                         </div>


                    <div class="display_flex between">

                        <div class="w-50 display_flex ">
                            <el-form-item label="默认批次"  prop='batchId' class="m-r-10">   
                                <el-select v-model="defa.batchId" clearable placeholder="请选择" class="w-100" @change="getCode('batchName','batches',defa.batchId)">
                                    <el-option
                                    v-for="item in params.batches"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="add_btn cursor" @click="openBatch">+</div>
                        </div>
                         <div class="w-50 display_flex ">
                            <el-form-item label="默认语种"  prop='languageId' class="m-r-10">   
                                <el-select v-model="defa.languageId" clearable placeholder="请选择" class="w-100" @change="getCode('languageName','languages',defa.languageId)">
                                    <el-option
                                    v-for="item in params.languages"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>

                    <div class="display_flex between">

                        <div class="w-50 display_flex ">
                            <el-form-item label="默认藏址"  prop='collectionPlaceId' class="m-r-10">   
                                <el-select v-model="defa.collectionPlaceId" clearable placeholder="请选择" class="w-100" @change="getCode('collectionPlaceName','collectionPlaces',defa.collectionPlaceId)">
                                    <el-option
                                    v-for="item in params.collectionPlaces"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="add_btn cursor" @click="open">+</div>
                        </div>
                         <div class="w-50 display_flex ">
                            <el-form-item label="默认状态"  prop='bookStatus' class="m-r-10">   
                                <el-select v-model="defa.bookStatus" clearable placeholder="请选择" class="w-100">
                                    <el-option
                                    v-for="item in params.bookStatus"
                                    :key="item.key"
                                    :label="item.name"
                                    :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>

                      <div class="display_flex between">
                        <div class="w-50 display_flex ">
                            <el-form-item label="默认文献类型"  prop='mediumId' class="m-r-10">   
                                <el-select v-model="defa.mediumId" clearable placeholder="请选择" class="w-100" @change="getCode('mediumName','mediums',defa.mediumId)">
                                    <el-option
                                    v-for="item in params.mediums"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            
                        </div>
                         <div class="w-50 display_flex ">
                            <el-form-item label="默认复本"  prop='number' class="m-r-10">   
                                    <el-input v-model="defa.number" class="w-40 m-r-10" ></el-input>
                                    <el-checkbox v-model="defa.autofill">新增自动填充</el-checkbox>
                            </el-form-item>
                        </div>
                    </div>

                     <div class="display_flex between">
                        <div class="w-50 display_flex ">
                            <el-form-item label="MARC类型"  prop='marcTypeDetailId' class="m-r-10">   
                                <el-select v-model="defa.marcTypeDetailId" clearable placeholder="请选择" class="w-100" @change="getCode('marcTypeDetailName','marcTypeDetails',defa.marcTypeDetailId)">
                                    <el-option
                                    v-for="item in params.marcTypeDetails"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            
                        </div>
                        <div></div>
                    </div>



            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openDefa = false">取 消</el-button>
                <el-button type="primary" @click="save_params('defa')">确 定</el-button>
            </div>
    </el-dialog>
     <!-- 弹框 -->
    <el-dialog title="请选择需加载的MARC系统默认工作单" :visible.sync="showModel" width='60%' :close-on-click-modal='false'>


            <div class="display_flex start boxChoose" :style="$height(400)">
                <div class="w-60 m-r-20 ">
                    <div class="title_model m-b-10">文献数据库</div>
                    <div class="m-b-10 ">
                        <el-input v-model="chooseBook[0].source" disabled v-if="chooseBook && chooseBook.length>0 && chooseBook[0].source"></el-input>
                    </div>
                    <div class="box_border w-100 " >
                        <div v-if="radio">
                            <el-table
                            :data="radio.marcTemplateDetails"
                            style="width: 100%">
                            <el-table-column
                                prop="marcFieldDetailFather"
                                label="字符表示符"
                                width="180">
                                 <template slot-scope="scope">
                                   <div>{{scope.row.marcFieldDetailFather.code}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="indicatorOne"
                                label="指示符">
                                <template slot-scope="scope">
                                   <div>{{scope.row.marcFieldDetailFather.indicatorOne}}{{scope.row.marcFieldDetailFather.indicatorTwo}}</div>
                                </template>
                            </el-table-column>

                              <el-table-column
                                prop="note"
                                label="字段帮助信息"
                                >
                                 <template slot-scope="scope">
                                   <div>{{scope.row.marcFieldDetailFather.note}}</div>
                                </template>
                            </el-table-column>
                            </el-table>
                            <!-- <div class="m-b-10">字符表示符:{{radio.code}}</div>
                            <div class="m-b-10">字段名称:{{radio.name}}</div>
                            <div class="m-b-10">指示符:{{radio.indicatorOne}}{{radio.indicatorTwo}}</div>
                            <div class="m-b-10">字段帮助信息:{{radio.note}}</div> -->
                        </div>
                            
                    </div>
                </div>
                <div class="w-40 ">
                    <div class="title_model m-b-10">模板列表</div>
                    <div class="box_border m-b-20">
                        <el-radio-group v-model="radio">
                           <div v-for='(item,i) of models' :key='i' class="m-b-20">
                                <el-radio :label="item">{{item.name}}</el-radio>
                           </div>
                        </el-radio-group>

                    </div>
                    <el-pagination
                        :page-size="5"
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
          
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.enter="addModel">加载模板(Enter)</el-button>

                <el-button @click="showModel = false">关 闭</el-button>
            </div>
    </el-dialog>

   </div>
</template>

<script>

const qs = require('qs');
export default {
    components:{
        
    },
    data() {
        return {bus: this.bus(this),
           listCode:[],
           height:'', //高度
           checkList:[
           ], //选择
           content:'',  //内容
           searchType:'1',
           marcDatabases:[], //数据库
           searchFrom:[
               {type:'LOCAL',serviceName:'本馆数据库',checked:false,sort:0},
               {type:'DEFAULT',serviceName:'套录库',checked:false,sort:1},
               {type:'CLOUD',serviceName:'云端数据库',checked:false,sort:2},
               {type:'NEW',serviceName:'Z39.50服务器',sort:3,checked:false},
           ], //源
           tableData:[],  //分页数据
           currentPage:1, // 页码
           list:[], //全部数据
           pageSize:5,  //大小
           openDefa:false, //弹框
            //    内框
            innerVisible:false,
            // new_add
            newAddName:'', //快速新增
            newAddLab:'', //快速新增
            defa:{}, // 默认参数
            //    参数选择
            showModel:false, //模板弹框
            models:[],//获取的模板列表
            mysql:'', //模板库
            radio:'', //选择模板
            currentPage1:0,
            total:0,
            params:{},
            options:[],//选择
            rules:{

            },
            isAdd:'',//是否新增
           checked:false,
           chooseBook:[
               {source:''}
           ], //选择的书
            // 新增批次
            form:{
                defaultSetting:false
            },
           options:[   //选择
               {
                   label:'ISSN',
                   value:'1',
                   disabled:false
               },
                {
                   label:'题名',
                   value:'2',
                   disabled:false
               },
                {
                   label:'责任者',
                   value:'3',
                   disabled:false
               },
                {
                   label:'出版社',
                   value:'4',
                   disabled:false
               },
                {
                   label:'主题词',
                   value:'5',
                   disabled:false
               },
                {
                   label:'分类号',
                   value:'6',
                   disabled:false
                   
               }

           ],
        //    
         rules:{
               batchId: [{ required: true, message: '请选择', trigger: 'change' }],
                languageId: [{ required: true, message: '请选择', trigger: 'change' }],
                 collectionPlaceId: [{ required: true, message: '请选择', trigger: 'change' }],

                  bookStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                    number: [{ required: true, message: '请选择', trigger: 'change' }],
                    mediumId: [{ required: true, message: '请选择', trigger: 'change' }],
                    barCodeId: [{ required: true, message: '请选择', trigger: 'change' }]
           },
           rule:{
                 name: [{ required: true, message: '请选择', trigger: 'blur' }],
           },
           clickChooseIndex:0,
           defaSetChoose:{},
           click:{}
        };
    },
    created() {

        // alert(this.$blue)
        // // console.log(this.$blue)

        this.getDefault()  //获取 options
        .then(res=>{
                 this.getMeta()
            });
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getDefa()   //获取默认设置
       
       
        this.getSet()
        // // console.log(JSON.parse(sessionStorage.getItem('chooseLoca')))  
       if(JSON.parse(sessionStorage.getItem('chooseLocas'))  ){
            let arr =JSON.parse(sessionStorage.getItem('chooseLocas'))
             this.searchFrom.map(it=>{
                 arr.map(item=>{
                        if(it.type == item.type){
                            
                            it.checked =true
                        }
                })
            })
            arr.map(it=>{
                
                    this.options.map(item=>{
                        if(it.type == 'NEW'){
                            if(item.value==1 || item.value==2){
                                item.disabled = false
                            }else{
                                item.disabled = true
                            }
                         }else{
                              item.disabled = false
                         }
                    })
                   
                   // console.log(this.options)
                
               
            })
       }else{
           this.searchFrom=[
               {type:'LOCAL',serviceName:'本馆数据库',checked:true,sort:0},
               {type:'DEFAULT',serviceName:'套录库',checked:true,sort:1},
               {type:'CLOUD',serviceName:'云端数据库',checked:true,sort:2},
               {type:'NEW',serviceName:'Z39.50服务器',sort:3}
           ]
       }
       
        
        
    },
    watch:{
          "$route"(val,oldval){
                       if(val != oldval && val.path == '/catalogue/literature/library'){
                             this.clickChooseIndex=0
                             let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                       }
        },
    },
    mounted(){
       
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -209;

        },100)
      },
         // 获取条码
        getCodes(jorunalBaseId){
            this.listCode=[]
            this.ax.get('/manage/unit/journal/journalCataloging/getBarCode',{params:{jorunalBaseId,platformId:JSON.parse(localStorage.getItem('user')).platform.id}})
                .then(res =>{
                    this.listCode = res
                })
        },
        // 监听
        monitor(){
                     document.onkeydown = (e)=>{
            
						let key = window.event.keyCode;
                        // console.log(e)
                        // f
                        if(key==70 && e.path.length==4 &&  !e.ctrlKey  && !e.altKey){
                            this.search()
                        }
                        // t
                        else if(key==84 && e.path.length==4 &&  !e.ctrlKey  && !e.altKey){
                            this.register()
                        }
                        // c
                        else if(key==67 && e.path.length==4 && !e.ctrlKey  && !e.altKey){
                            this.copy()
                        }
                        else if(key==77 && e.path.length!=17 &&  !e.ctrlKey  && !e.altKey){
                            this.copys(true)
                        }
                         // e
                        else if(key==69 && e.path.length==4 &&  !e.ctrlKey  && !e.altKey){
                            this.edit()
                        }
                          // n
                        else if(key==78 && e.path.length==4 &&  !e.ctrlKey  && !e.altKey){
                            this.add()
                        }
                          // d
                        else if(key==68 && e.path.length==4 &&  !e.ctrlKey  && !e.altKey){
                            this.del()
                        }
                        else if(key==38 && e.path.length==4 ){
                            this.chooseDown(-1)
                        }
                        else if(key==39 && e.path.length==4 ){
                            
                        }
                        else if(key==40 && e.path.length==4){
                            this.chooseDown(1)
                        }else if(key==13 && e.path.length==4 && this.chooseBook.length==1){
                            if(this.chooseBook[0].source !== '本馆数据库'){
                            this.register()
                            }else{
                                // // console.log(123)
                                this.edit()
                            }
                        }
                    };
        },
        // 设置快捷操作
         getSet() {
            this.ax
                .get('/manage/unit/general/catalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, marcType: 'JOURNAL' }
                })
                .then(res => {
                    sessionStorage.setItem('setting', JSON.stringify(res));
                     this.defaSetChoose = res
                });
        },
        // 上下运动
        chooseDown(index){
             this.$refs.multipleTable.clearSelection();
             this.clickChooseIndex+=index*1
             if( this.clickChooseIndex >4){
                  this.clickChooseIndex = 4
             }else if( this.clickChooseIndex<0){
                  this.clickChooseIndex = 0
             }
             let val = this.tableData[ this.clickChooseIndex]
             
             this.$refs.multipleTable.toggleRowSelection(val);
        },

        // 打开内框
        openBatch(){
            this.newAddName='新建批次'
            this.newAddLab=1
            this.innerVisible=true
        },
        openUnits(){
             this.newAddName='新建单位'
              this.newAddLab=2
            this.innerVisible=true
        },
        open(){
              this.newAddName='新建馆藏地'
                this.newAddLab=3
                this.innerVisible=true
        },
        // 快速新增批次
         addBatch(formName){

            this.loading();
            this.defa.form = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.type = 'CATALOG'
                    this.ax.post('/manage/unit/general/batch', this.form)
                        .then(res => {
                            this.sloading();
                            this.innerVisible =false
                            this.$message.success('保存成功');
                             this.form={}
                            this.getDefault()
                            this.getDefa()
                              this.getMeta()
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        
        // 快速新增地址
        addPlace(formName){

            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                       this.form.type = 'LITERATURE'
                    this.ax.post('/manage/unit/general/batch', this.form)
                        .then(res => {
                            this.sloading();
                            this.innerVisible = false
                            this.$message.success('保存成功');
                            // this.innerVisible =false
                            this.form={}
                            this.getDefault()
                                .then(res=>{
                                     this.getMeta()
                                })
                             this.getDefa()
                              
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        // 快速新增单位
        addUnit(formName){

            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                     this.sloading();
                    this.ax.post('/manage/unit/journal/journalCataloging/deliveryUnit', this.form)
                        .then(res => {
                            this.sloading();
                            
                            this.$message.success('保存成功');
                            this.innerVisible =false
                             this.getDefault()
                                .then(res=>{
                                     this.getMeta()
                                })
                             this.getDefa()
                             
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        // 获取类型列表
        getDetail(type){
            return new Promise(resolve=>{
                this.ax.get(`/manage/unit/catalog/bibliography/bookCatalogParameterTypeDetail?bookCatalogParameterType=${type}&size=999`)
                .then(res=>{
                    this.type = res
                    resolve()    
                })
            })
        },
        //查询默认参数选择
        getDefault(){
             return new Promise(resolve=>{
            this.ax.get('/manage/unit/journal/journalCataloging/obtainEditJournalCatalogSetting')
                .then(res=>{
                   
                        // // console.log(res)
                        this.params = res
                        resolve(res)
                    })
                })
        },
        // 获取参数meta
        getMeta(){
            this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.BookCatalogSetting'}})
                .then(res=>{
                    // // console.log(res)
                    res.subs.map(it=>{
                        if(it.key=='bookStatus'){
                            this.params.bookStatus = it.searchOption
                        }
                    })
                   
                })
        },
        // 获取getcode
        getCode(val,name,id){
            // // console.log(val)
            // // console.log(name)
            // // console.log(id)
            this.params[name].map(it=>{
                if( it.id &&it.id==id){
                    this.defa[val]=it.name
                }else if(it.key ==id){
                    this.defa[val]=it.name
                }
                // // console.log(this.defa)
            })
        },
        // 设置默认参数
        setDefault(){
            this.openDefa = true
        },
        // 查询默认参数
        getDefa(){
            let platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.get('/manage/unit/journal/journalCataloging/journalCatalogSetting',{params:{platformId}})
                .then(res=>{
                    this.defa = res
                }
                    
                )
        },
        // 保存默认参数
        save_params(formName){
            this.loading();
            this.defa.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                     this.sloading();
                    this.ax
                        .post('/manage/unit/journal/journalCataloging/journalCatalogSetting', this.defa)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.openDefa =false
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        // 检索F
        search(){
            if(this.checkList.length==0){
                 return this.$message.error('请选择数据库');
            }
            this.loading()
            this.tableData =[]
            // // // console.log(this.checkList)
            // var params = new FormData()
            this.checkList.sort((a,b)=>{
                return a.sort-b.sort
            })
            // console.log( this.checkList)
            let  params={
                content:this.content,
                searchType:this.searchType,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                marcDatabases:this.checkList

            }
             this.ax.post(`/manage/unit/journal/journalCataloging/marc`,params)
                .then(res=>{
                    this.$refs.searchCotent.blur()
                    this.sloading()
                    if(res.length==0){
                       this.$message.error('您输入的检索词检索不到数据');
                        if(this.defaSetChoose.directAdd){
                                                this.$confirm('您输入的检索词检索不到,是否新增数据?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                                }).then(() => {
                                                    this.add()
                                                    this.sloading()
                                                }).catch(() => {
                                                    this.sloading()
                                                });    
                        }
   
                    }else if(res.length==1){

                        this.list= res
                        this.mapList()
                        let val = this.tableData[ this.clickChooseIndex]
                        
                        setTimeout(ress=>{
                            this.$refs.multipleTable.toggleRowSelection(val);
                            if(res[0].source !="本馆数据库"){
                            if(this.defaSetChoose.directCopy){
                                 this.register()
                            }
                        }else{
                            
                            if(this.defaSetChoose.directDuplication){
                                 this.copy()
                            }
                           
                        }
                        })

                        
                    }
                    else{
                    this.list= res
                    this.mapList()
                    let val = this.tableData[ this.clickChooseIndex]
                    setTimeout(res=>{
                        this.$refs.multipleTable.toggleRowSelection(val);
                    })

                    }
                })
                .catch(res=>{
                    this.sloading()
                })
        },
        // 新增
        add(){
            this.$router.push({
               path:'library/libraryBookInfo'
           })
        },
        // 套录
        register(){
            if(this.chooseBook.length>1){
                 return this.$message.error('请选择单一图书编目');
            }
            if(this.chooseBook.length==0 || this.chooseBook[0].source == '' || this.chooseBook[0].source == '本馆数据库'){
                 return this.$message.error('请选择单一非本馆数据库图书编目');
             }
             let info ={
                book:this.chooseBook[0]
            }
              this.$router.push({
               path:'library/libraryBookInfo',
               query:{ copys:JSON.stringify(info)}
           })

        },
        handleCurrentChange1(val){
            this.currentPage1 = val
        },
        // 选择模板
        addModel(){
            // // console.log(this.radio)
            this.showModel=false
            let params = {
                add:false,
                bookBase:this.chooseBook[0],
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
            }
             params.marcTemplateDetails = this.radio.marcTemplateDetails.map(it=>{
                 let one =''
                 if(it.marcFieldDetailFather.indicatorOne && it.marcFieldDetailFather.indicatorTwo  ){
                     one = it.marcFieldDetailFather.indicatorOne + it.marcFieldDetailFather.indicatorTwo
                 }else if(it.marcFieldDetailFather.indicatorOne){
                      one = it.marcFieldDetailFather.indicatorOne
                 }else if(it.marcFieldDetailFather.indicatorTwo){
                      one = it.marcFieldDetailFather.indicatorTwo
                 }
                  let str = [
                      it.marcFieldDetailFather.note,it.marcFieldDetailFather.code,one,null
                  ]
                  return str
             })
             params.bookBase.marcTypeDetailId = this.radio.marcTypeDetailId
            this.$router.push({
                path:'library/libraryBookInfo',
                query:{ params:JSON.stringify(params)}
            })
        },
        // 多卷
        copys(){
             if(this.isCheck()){
                 return this.$message.error('请选择单一本馆数据库图书编目');
            }
            if(this.chooseBook.length>1){
                 return this.$message.error('请选择单一图书编目');
            }
            let info ={
                book:this.chooseBook[0]
            }
            
             this.$router.push({
               path:'library/libraryBookInfo',
               query:{ copy:JSON.stringify(info)}
           })
        },
        // 副本
        copy(){
            if(this.isCheck()){
                 return this.$message.error('请选择单一本馆数据库图书编目');
            }
            if(this.chooseBook.length>1){
                 return this.$message.error('请选择单一图书编目');
            }
            let info ={
                defa:this.defa,
                book:this.chooseBook[0],
                params:this.params
            }
            
             this.$router.push({
               path:'library/libraryInfo',
               query:{ info:JSON.stringify(info)}
           })
        },
        edit(){
           
             if(this.isCheck()){
                 return this.$message.error('请选择单一本馆数据库图书编目');
            }
            if(this.chooseBook.length>1){
                 return this.$message.error('请选择单一图书编目');
            }
            let bookBase=this.chooseBook[0]
            
             this.$router.push({
               path:'library/libraryBookInfo',
               query:{ infos:JSON.stringify(bookBase)}
           })
        },
        // 删除
        del(){   

            if(this.isCheck()){

                 return this.$message.error('请选择单一本馆数据库图书编目');
            }
             this.$confirm('是否确认删除当前图书编目?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            let ids = this.chooseBook.map(it=>{
                                return it.id
                            }).join(',')
                               this.ax.delete('/manage/unit/journal/journalCataloging/journalBase?ids='+ids)
                                .then(res=>{
                                    // this.tableData.map((it,index)=>{
                                    //     this.chooseBook.map(item=>{
                                    //         if(it.id == item.id){
                                    //             this.tableData.splice(index,1)
                                    //         }
                                    //     })
                                    // })
                                     this.chooseBook.map(item=>{
                                         this.tableData.map((it,index)=>{
                                              if(it.id == item.id){
                                                this.tableData.splice(index,1)
                                            }
                                         })
                                     })
                                    this.$message.success('删除成功');
                                  
                                })

                        }).catch(() => {
                            
                        });       
        },
        // 检查是否单选
        isCheck(){
             if(this.chooseBook.length==0 || this.chooseBook[0].source != '本馆数据库'){
                //  // console.log(1)
                 return true
             }else{
                //    // console.log(this.chooseBook)
                 return false
             }
        },
        // 选择来源
        chooseBox(e){
              this.checkList.sort((a,b)=>{
                return a.sort-b.sort
            })
            sessionStorage.setItem('chooseLoca',JSON.stringify(this.checkList))

            this.checkList.map(it=>{
                
                    this.options.map(item=>{
                        if(it.type == 'NEW'){
                            if(item.value==1 || item.value==2){
                                item.disabled = false
                            }else{
                                item.disabled = true
                            }
                         }else{
                              item.disabled = false
                         }
                    })
                   
                    // // console.log(this.options)
                
               
            })

            if(this.checkList.length==1 && this.checkList[0].type=='NEW'){
                               if(this.searchType != '1' &&  this.searchType != '2' ){
                                    if( this.searchType != ''){
                                        this.searchType = ''
                                        this.$message.error('当前查询项目不能在Z39.50查询');
                                    }
                               }
                                   
            }
          
        },
        // 单选
        handleCurrentChoose(val){
            // // console.log(val)
            // // console.log(1)
           this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(val);
        },
        handledbClick(val){
             this.chooseBook.map(it=>{
                if(it.isbn==val.isbn){
                    if(val.source !== '本馆数据库'){
                            this.register()
                    }else{
                        // // console.log(123)
                        this.edit()
                    }
                }
            })
        },
        // 改变大小
        handleSizeChange(val){
                this.pageSize =val
                this.mapList()
        },
        // 页面改版
        handleCurrentChange(val){
                this.currentPage = val
                this.mapList()
        },
        // 数据分页
        mapList(){
          
            this.tableData = this.list.slice( (this.currentPage-1) * this.pageSize, this.currentPage * this.pageSize )
              this.tableData.map(it=>{
                  it.callNumber = it.classificationNumber
                  if(it.speciesNumber){
                       it.callNumber+='/'+it.speciesNumber
                  }
                  if(it.auxiliaryNumber){
                       it.callNumber+='/'+it.auxiliaryNumber
                  }
                  if(!it.allTitle){
                       it.allTitle = it.positiveTitle
                        if(it.subTitle){
                            it.allTitle+=':'+it.subTitle
                        }
                        if(it.sectionTitle){
                            it.allTitle+='.'+it.sectionTitle
                        }
                        if(it.sectionNumber){
                            it.allTitle+='.'+it.sectionNumber
                        }
                  }
            })
        },
        // 选择查询数据
        handleSelectionChange(val){
            // // console.log(val)
            this.chooseBook = val
        },
    }
};
</script>

<style scoped>
.library{
    position: relative;
}
.title_info{
    width: 4rem;
    height:1.25rem;
    font-size:0.88rem;
    font-weight:400;
    line-height:1.25rem;
    color:#999999;

}
.library .source{
    font-size:1rem;
    font-weight:normal;
    color:#000000;
    line-height: 3rem;
    border-bottom:1px solid #dcdcdc;
}
.library_bottom{
    width:100%;
    height:2.5rem;
    background:#ffffff;
    box-shadow:0px -1px 1px #94949429;
    padding: 0 20px !important;
    font-size: 0.88rem;
    color: #777777;
    box-sizing: border-box;
}
.library_bottom div{
     padding: 0 20px;
}
.library_bottom div:not(:last-child){
    border-right: 1px solid #dcdcdc;
}
 .add_btn{
    width:1rem;
    height:1rem;
    background:rgba(38,127,249,1);
    border-radius:3px;
    color: #fff;
    text-align: center;
    line-height: 0.9rem;
    margin-bottom: 18px;
}


/* 加载模板弹框 */
.title_model{
    height:1.25rem;
    font-size:0.88rem;
    font-weight:400;
    line-height:1.25rem;
    color:#999999;
}
.box_border{
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #dddddd;
    min-height: 200px;
   
}
.boxChoose{
    overflow: auto;
}
</style>
