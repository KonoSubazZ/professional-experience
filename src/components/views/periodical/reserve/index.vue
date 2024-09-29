 <template>
    <div class="container" :style="'height:'+height+'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="直接预订" name="BOOK"></el-tab-pane>
                <el-tab-pane label="批续订" name="JOURNAL"></el-tab-pane>
                <el-tab-pane label="所有订单" name="ALL"></el-tab-pane>
            </el-tabs>
        </div>
         <List 
            :style="$height(250)"
            :dataUrl="dataUrl"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            :isSort='true'
            ref="list"
            @selected="choose"
            :disableTableAction='disableTableAction'
            :chooseBox='true'
            @delete="deleteUpdate" >
            
            <template slot="addition-actions" >
                                 <el-button type="primary"  v-if="activeName == 'BOOK'" plain class="add " icon='el-icon-circle-check' @click="rem" >预定</el-button>
                                 <el-button type="primary"   v-if="activeName == 'BOOK'" plain icon="el-icon-circle-plus-outline"  @click="addBooking" >新增</el-button>
                                 <el-button type="primary" v-if="activeName == 'JOURNAL'" plain icon="el-icon-document-add"  @click="open" >批续订</el-button>
            </template>
            <template slot="addition-table-actions" slot-scope="scope">
                 <el-button
                    size="mini"
                    type="text"
                    class="m-r-20"
                    v-if="activeName == 'BOOK'"
                    @click="upState(scope.item.row)"
                >设置核心期刊</el-button>
              
                <el-button
                    size="mini"
                    type="text"
                    class="m-r-20"
                    v-if="activeName == 'BOOK'"
                    @click="rember(scope.item.row)"
                >预定</el-button>
            </template>
                
     
        </List>

         <!-- 弹框 -->
        <el-dialog title="预定新增" :visible.sync="createdModes" width="60%"   :close-on-click-modal='false'  @close='close'>
                <view-form :row='3' :list='addList' :rule='rules'  :getForm='getForm' :model='addForm' ref="addForm" ></view-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createdModes = false">取 消</el-button>
                    <el-button type="primary" @click="addBook('addForm','form')">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 弹框 -->
        <el-dialog title="批续订" :visible.sync="createModel" width="40%"   :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="m-b-30 padding_20">

                    <div class="display_flex m-b-20">
                         <el-form-item label="预订批次" prop='batchId'  class="w-50">
                            <el-select v-model="form.batchId" clearable placeholder="请选择" class="w-100" @change="getName(form.batchId,bacth)" >
                                <el-option
                                v-for="items in bacth"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id">
                                </el-option>
                            </el-select>

                        </el-form-item>
                         <el-form-item label="供货单位" prop='deliveryUnit'  class="w-50">
                            <el-select v-model="form.deliveryUnit" clearable placeholder="请选择" class="w-100"  >
                                <el-option
                                v-for="items in unit"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="display_flex m-b-20">
                         <el-form-item label="订购年份" prop='year'  class="w-50">
                            <el-input v-model="form.year"  placeholder="请输入"></el-input>
                        

                        </el-form-item>
                          <el-form-item label="周期名称" prop="cycleName" class="w-50">
                    
                       <el-select v-model="form.cycleName" placeholder="请选择" @change="getIds(form.cycleName,cycle)" class="w-100">
                            <el-option
                            v-for="item in cycle"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    </div>
                    
                      <div class="display_flex m-b-20">
                         <el-form-item label="订购期数" prop='orderPeriod'  class="w-50">
                            <el-input v-model="form.orderPeriod"  placeholder="请输入"></el-input>
                         

                        </el-form-item>
                         <el-form-item label="卷册信息" prop='volume'  class="w-50">
                              <el-input v-model="form.volume"  placeholder="请输入"></el-input>
                      
                        </el-form-item>
                    </div>

                      <div class="display_flex m-b-20">
                         <el-form-item label="复本量" prop='copy'  class="w-50">
                            <el-input v-model="form.copy"  placeholder="请输入"></el-input>
                           

                        </el-form-item>
                        <el-form-item label="分发数量" prop="distributionNumber" class="w-50">
                       <el-input v-model="form.distributionNumber"></el-input>
                    </el-form-item>
                    </div>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog
            title="预订"
            :visible.sync="model"
            width="40%"
            top='6vh'
            :close-on-click-modal="false"
            @close="close">

            <el-form
                :model="fromData"
                :rules="rule"
                ref="fromData"
                label-width="100px"
            
            >
               

                <div class="display_flex around m-b-20">
                    <el-form-item label="预订批次" prop="batchId" class="w-50">
                        <el-select v-model="fromData.batchId" class="w-100" placeholder="请选择" @change="getIdName(fromData.batchId,bacth)">
                            <el-option
                            v-for="item in bacth"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="供货单位" prop="deliveryUnit" class="w-50">
                        <el-select v-model="fromData.deliveryUnit" class="w-100" placeholder="请选择" >
                            <el-option
                            v-for="item in unit"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="预订年份" prop="year" class="w-50">
                        <el-input v-model="fromData.year" ></el-input>
                    </el-form-item>

                    <el-form-item label="期刊类型" prop="medium" class="w-50">
                        <el-select v-model="fromData.medium" class="w-100" placeholder="请选择" >
                            <el-option
                            v-for="item in mediumList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="fromData.medium" disabled></el-input> -->
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="文献来源" prop="literatureSource" class="w-50">
                        <el-input v-model="fromData.literatureSource" ></el-input>
                    </el-form-item>

                    <el-form-item label="装帧方式" prop="bindingMethod" class="w-50">
                       <el-input v-model="fromData.bindingMethod" ></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="货币类型" prop="currency" class="w-50">
                        <!-- <el-input v-model="fromData.currency" ></el-input> -->
                        <el-select v-model="fromData.currency" class="w-100" placeholder="请选择" >
                            <el-option
                            v-for="item in moneyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="总价格" prop="totalPrice" class="w-50">
                       <el-input v-model="fromData.totalPrice" disabled></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="单价" prop="price" class="w-50">
                        <el-input v-model="fromData.price" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="周期名称" prop="cycleName" class="w-50">
                       <!-- <el-input v-model="fromData.cycleName"></el-input> -->
                       <el-select v-model="fromData.cycleName" placeholder="请选择" class="w-100"  @change="getId(fromData.cycleName,cycle)" >
                            <el-option
                            v-for="item in cycle"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="订购期数" prop="orderPeriod" class="w-50">
                        <el-input v-model="fromData.orderPeriod " disabled></el-input>
                    </el-form-item>
                      <el-form-item label="复本" prop="copy" class="w-50">
                        <el-input v-model="fromData.copy" @blur="countTotalPrice"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="分发数量" prop="distributionNumber" class="w-50">
                       <el-input v-model="fromData.distributionNumber"  ></el-input>
                    </el-form-item> -->
                </div>

                <div class="display_flex around m-b-20">
                  
                     <el-form-item label="卷" prop="volume" class="w-50">
                        <el-input v-model="fromData.volume"></el-input>
                    </el-form-item>
                     <el-form-item label="备注" prop="note" class="w-50">
                       <el-input v-model="fromData.note"></el-input>
                    </el-form-item>
                </div>

                <!-- <div class="display_flex around m-b-20">
                   
                   <div class="w-50"></div>
                </div> -->
            

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="model = false">取 消</el-button>
                <el-button type="primary" @click="save('fromData')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List'
import viewForm from '../../../view/form'
export default {
     components:{List,viewForm},
    data() {
        return {bus: this.bus(this),
           meta:'', 
           unit:[],  //供应商
           bacth:[], //批次
           mediumList:[], //文献类型
           cycle:[],
           loadings:false,
           disableTableAction:false,
           createModel:false,
           model:false,
           createdModes:false,
           addForm:{},
           addList:[
               {name:'刊名',id:'title'},
               {name:'邮发刊号',id:'postNumber'},
               {name:'当年原名',id:'oldTitle'},

               {name:'国外发行刊号',id:'issuedAbroad'},
               {name:'ISSN号',id:'issn'},
               {name:'责任者',id:'unifiedIssue'},

               {name:'出版社',id:'publisher'},
               {name:'国别',id:'country'},
               {name:'文献语种',id:'language',type:'select',options:[]},

               {name:'出版时间',id:'publicationDate'},
               {name:'出版周期',id:'publishingCycle',type:'select',options:[]},
    

               {name:'分类号',id:'classificationNumber'},

               {name:'其他号',id:'otherNumber'},
                {name:'备注',id:'note'},
               {name:'单价',id:'price'},

                {name:'卷册信息',id:'volumeInformation'},
               {name:'总价',id:'totalPrice'}
              
           ],
           activeName:'BOOK',
           form:{
              
           },
           models:{

           },
           fromData:{},
           chooseData:[],
           dataUrl:'/manage/unit/journal/journalBooking/journalBase', //默认url
           options:[],
           option:[
               {name:'是',key:true},
                {name:'否',key:false},
           ],
           rules:{
               marcType: [{ required: true, message: '请输入', trigger: 'change' }],
               publishingCycle: [{ required: true, message: '请输入', trigger: 'change' }],
               

               name: [{ required: true, message: '请输入', trigger: 'blur' }],

                title: [{ required: true, message: '请输入', trigger: 'blur' }],

                 issn: [{ required: true, message: '请输入', trigger: 'blur' }],

                  classificationNumber: [{ required: true, message: '请输入', trigger: 'blur' }],

                   price: [{ required: true, message: '请输入', trigger: 'blur' }],

                    name: [{ required: true, message: '请输入', trigger: 'blur' }],
                     name: [{ required: true, message: '请输入', trigger: 'blur' }],
              
           },
           rule:{
                copy: [{ required: true, message: '请输入', trigger: 'blur' }],
                batchId: [{ required: true, message: '请输入', trigger: 'change' }],
             deliveryUnit: [{ required: true, message: '请输入', trigger: 'change' }],
                year: [{ required: true, message: '请输入', trigger: 'blur' }],
                medium: [{ required: true, message: '请输入', trigger: 'change' }],
                currency: [{ required: true, message: '请输入', trigger: 'change' }],
                cycleName: [{ required: true, message: '请输入', trigger: 'change' }],
           },
           moneyList:[],//货币类型
          height:''
        };
    },
    created() {
       this.metaList()
       this.getUnit()
       this.getBatch()
       this.getCycle()
       this.getMoney()
       this.getCHI()
       this.getType()
        .then(it=>{
            this.mediumList = it.content
        })
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
         // 获取文献类型
        getType() {
         return   this.ax.get('/manage/unit/report/journalReport/medium',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
        },
        getMoney(){
            this.ax.get('manage/unit/journal/journalParameters/bookCatalogParameterTypeDetail',{params:{size:999,bookCatalogParameterType:'CURRENCY',platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.moneyList = res.content
                })
        },
        getForm(val){
            this.addForm = val
        },
        countTotalPrice(){
            // console.log(this.fromData.orderPeriod!=undefined)
               // console.log(this.fromData.price!=undefined)
                  // console.log(this.fromData.copy!=undefined)
           if(this.fromData.orderPeriod!=undefined && this.fromData.price!=undefined  && this.fromData.copy!=undefined  ){
                this.fromData.totalPrice = this.fromData.orderPeriod * this.fromData.price * this.fromData.copy
                // console.log( this.fromData.totalPrice)
           }
        },
        // upState
        upState(e){
            // console.log(e)
            this.ax.post('/manage/unit/journal/journalBooking/changeJournalCore?id='+e.id)
                .then(res=>{
                    e.core = !e.core
                    this.$message.success('变更成功');
                })
        },
        // 打开预定
        rember(e){
            // console.log(e)
            this.getInfo(e.id)
                .then(res=>{
                    this.fromData= res
                     this.model = true
                })
           
        },
        addBooking(){   
            this.createdModes = true
        },  
        addBook(formName,formNames){
              this.$refs[formName].$refs[formNames].validate(valid => {
                if (valid) {
            this.loading()
            this.addForm.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/journal/journalBooking/journalBaseBooking',this.addForm)
                .then(res=>{
                     this.createdModes = false
                     this.addForm={}
                       this.sloading()
                     this.$message.success('新增成功');
                })
                .catch(res=>{
                    this.sloading()
                })
                }else{
                     return 
                }
              })
        },
        // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/general/cycle',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.cycle = res.content.map(it=>{
                        return {name:it.name,id:it.name,key:it.id,number:it.number}
                    })
                    this.addList[10].options =res.content.map(it=>{
                        return {name:it.name,id:it.name}
                    })
                })
        },
          // 获取文献语种
        getCHI() {
            this.ax.get('/manage/unit/report/journalReport/language',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                 this.addList[8].options =res.content
            });
        },
        rem(){
            if(this.chooseData.length !=1){
                 return this.$message.error('请选择单个');
            }
             this.getInfo( this.chooseData[0].id)
                .then(res=>{
                    this.fromData= res
                     this.model = true
                })
        },
        // 获取信息
        getInfo(id){
          return  this.ax.get('/manage/unit/journal/journalBooking/journalBaseDetail',{params:{id}})
        },
        choose(e){
            this.chooseData = e
        },
        // 获取供应商
        getUnit(){
            this.ax.get('/manage/unit/journal/journalBooking/deliveryUnit',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    this.unit = res.content
                })
        },
        getBatch(){
            this.ax.get('/manage/unit/general/batch',{params:{type:'BOOKING',size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.bacth = res.content
                })
        },
        // 切换
         handelClick(e){
            // // console.log(this.activeName)
             this.loading();
            if(this.activeName=='BOOK'){
                this.disableTableAction  =false
                this.dataUrl='/manage/unit/journal/journalBooking/journalBase'
                this.metaList()
                setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`, e);
                })
            }else if(this.activeName=='JOURNAL'){
                 this.disableTableAction  =false
                 this.dataUrl='/manage/unit/journal/journalBooking/journalBooking?type=2'
                  this.metaList()
                 setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`, e);
                })
            }
            else{
                 this.disableTableAction  =true
                 this.dataUrl='/manage/unit/journal/journalBooking/journalBooking?type=1'
                  this.metaList()
                 setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`, e);
                })
            }
             setTimeout(res=>{
                   this.sloading()
                },500)
           
            //  // console.log(e)
        },
        getName(id,row){
            row.map(it=>{
                if(it.id == id){
                      this.form.batchName = it.name
                }
              
            })
        },
        getIdName(id,row){
             row.map(it=>{
                if(it.id == id){
                      this.fromData.batchName = it.name
                }
              
            })
        },
        getId(name,row){
           
            row.map(it=>{
                if(it.name == name){
                    // console.log(it)
                      this.fromData.cycleId = it.key
                      this.fromData.orderPeriod = it.number
                }
              
            })
            
        },
        getIds(name,row){
            row.map(it=>{
                if(it.name == name){
                    // console.log(it)
                      this.form.cycleId = it.id
                      this.form.orderPeriod = it.number
                }
              
            })
            
        },
        // 修改
        editUpdate(e){
            // console.log(e)
            this.loadings = true
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                 this.loadings = false
            },500)
            
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            let url
            if(this.activeName=='BOOK'){
                url='/manage/unit/journal/journalBooking/journalBase'
            }else{
                url='/manage/unit/journal/journalBooking/journalBooking'
            }
            this.ax.delete(url+'?ids='+ids)
                .then(res=>{
                     this.sloading()
                   this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`, e);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(e){
            if(e){
                // console.log(e)
                if(this.chooseData.length < 1){
                    return this.$message.error('请选择最少1条数据');
                }
                
                 this.createModel = true
            }
           
        },
        // 
        close(){
            this.form={}
        },
        // 保存  批续订
         save_mar(){
             this.loading()
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            // this.form.marcType = this.activeName
             this.ax.post('/manage/unit/journal/journalBooking/journalBookingAgain',{journalBookingAgainRes:this.form,jbRe:this.chooseData})
                .then(res=>{
                    this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`);
                    this.sloading()
                    this.createModel = false
                     
                    this.chooseData=[]
                     this.$message.success('保存成功');
                })
                 .catch(res => { 
                            this.sloading();
                        });

        },
         // 保存
         save(formName){
              this.$refs[formName].validate(valid => {
                if (valid) {
                       this.loading()
                        this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                        // this.form.marcType = this.activeName
                        this.ax.post('/manage/unit/journal/journalBooking/jounalBooking',{journalBookingList:[this.fromData]})
                            .then(res=>{
                                this.sloading()
                                this.model = false
                                this.bus.$emit(`flash_/manage/unit/journal/journalBooking/journalBase`, e);
                                this.$message.success('保存成功');
                            })
                            .catch(res => { 
                                        this.sloading();
                                    });
                }
          
              })
        },
       
        metaList(){
             if(this.activeName =='BOOK' ){
             this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.JournalBaseBooking'}})
                .then(res=>{
                       
                                res.edit='NONE'
                                res.delete='DELETE'
                                res.insertable=false
                                res.subs.map(it=>{
                                    if(it.key=='createTime' || it.key == 'platformId' || it.key == 'issnNumber' || it.key == 'marcType' || it.key == 'totalPriceStr'   || it.key == 'callNumber' || it.key=='managerName'|| it.key=='priceStr'){
                                            it.displayInList=false
                                            it.searchable=false
                                    }
                                    if(it.key=='medium'){
                                        this.getType()
                                            .then(res=>{
                                                it.searchOption=res.content.map(it=>{
                                                    return {name:it.name,key:it.name}
                                                })
                                            })
                                    }           
                                    if(it.key=='publishingCycle'){
                                        this.ax.get('/manage/unit/general/cycle',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                                         .then(res=>{
                                                it.searchOption=res.content.map(it=>{
                                                    return {name:it.name,key:it.name}
                                                })
                                            })
                                    }                             
                                    })
                                    
                               
                                
                                this.meta = res
                               
                        
                   })
                    return 
                }            
                
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.JournalBase'}})
            .then(res=>{
                 res.insertable = false
                 if( this.activeName =='ALL'){
                   
                    res.edit='NONE'
                     res.subs.map(it=>{
                          if(it.key=='publishingCycle'){
                                        it.key='cycleName'
                                    }
                          if(it.key=='createTime' || it.key == 'platformId'|| it.key == 'issnNumber' || it.key == 'marcType' || it.key == 'totalPriceStr'   || it.key == 'callNumber' || it.key=='managerName'|| it.key=='priceStr'){
                                it.displayInList=false
                                it.searchable=false
                            }
                            if(it.key=='medium'){
                                        this.getType()
                                            .then(res=>{
                                                it.searchOption=res.content.map(it=>{
                                                    return {name:it.name,key:it.name}
                                                })
                                            })
                                    }           
                                    if(it.key=='cycleName'){
                                        this.ax.get('/manage/unit/general/cycle',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                                         .then(res=>{
                                                it.searchOption=res.content.map(it=>{
                                                    return {name:it.name,key:it.name}
                                                })
                                            })
                                    }
                        })
                    res.subs.unshift(
                        {
                            key:'year',
                            name:'预定年份',
                            displayInList: false,
                            searchable: true
                        },
                        {
                            key:'deliveryUnit',
                            name:'供货单位',
                            displayInList: false,
                            searchable: true,
                            searchOption:this.unit.map(it => {
                                let arr ={
                                    key:it.name,
                                    name:it.name
                                }
                                return arr
                            })
                        },
                        {
                            key:'title',
                            name:'刊名',
                            displayInList: false,
                            searchable: true
                        }
                    )

                    
                    this.meta = res
                }
                else{
                res.subs.map(it=>{
                        if(it.key !='core' ){
                            it.searchable=false
                        }
                         if(it.key=='publishingCycle'){
                                        it.key='cycleName'
                                    }
                         if(it.key=='createTime' || it.key == 'platformId' || it.key == 'issnNumber' || it.key == 'marcType' || it.key == 'totalPriceStr'   || it.key == 'callNumber' || it.key=='managerName'|| it.key=='priceStr'){
                                it.displayInList=false
                                it.searchable=false
                            }
                          
                })

                res.subs.unshift(
                    {
                        key:'year',
                        name:'预定年份',
                        displayInList: false,
                        searchable: true
                    },
                    {
                        key:'deliveryUnit',
                        name:'供货单位',
                        displayInList: false,
                        searchable: true,
                        searchOption:this.unit.map(it => {
                            let arr ={
                                key:it.name,
                                name:it.name
                            }
                            return arr
                        })
                    },
                    {
                        key:'title',
                        name:'刊名',
                        displayInList: false,
                        searchable: true
                    }
                )

                this.meta = res
                }


            })

        },
    }
};
</script>

<style>

</style>
