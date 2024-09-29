 <template>
    <div class="container ">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="盘点操作" name="DOING">
                    <!-- 盘点 -->
                    <div class="w-100 display_flex w-100 start m-b-10">

                     

                         <div class="display_flex start w-90">
                             <div class="display_flex start w-30">
                                 <div class="m-r-10 poRa">
                                      <el-radio v-model="able" :label="2" class="p-t-20">多个条码</el-radio>
                                      <br>
                                       <div class="numberes">{{number}}行</div>
                                 </div>
                                 <div class="w-80 ">
                                    
                                    <el-input type="textarea" class="textarea w-80" placeholder="请输入内容并以回车分割" :disabled='able==1?true:false' @input="getCount" :rows="5"  v-model="codes"></el-input>
                                 </div>
                             </div>
                              <div class="display_flex start w-30 m-r-20">
                                 <div class="m-r-10">
                                       <el-radio v-model="able" :label="1" class=" m-b-40" >单个条码</el-radio>
                                       <div class="label m-l-10">是否盘点确认</div>
                                 </div>
                                
                                 <div class="w-80">
                                     <div class="display_flex between m-b-25">
                                            <el-input
                                            id="getFocus"
                                             placeholder="请输入内容"
                                             :disabled="able==2 && able !=''"
                                              v-model="code"
                                                 @keyup.enter.native="inventory"
                                             ></el-input>
                                     </div>
                                     <div class="display_flex between">
                                        
                                       <el-select v-model="isTrue" placeholder="请选择" class="w-100">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                     </div>
                                 </div>
                             </div>
                              <div class="display_flex w-30">
                            <div class="label w-20">盘点批次</div>
                            <el-select
                                v-model="form.batchId"
                                placeholder="请选择"
                                clearable
                                class="w-40 m-r-20"
                                @change="batchList"
                            >
                                <el-option
                                    v-for="item in batches"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                         
                             <div class="w-20">
                                    <el-button type="primary"  @click="inventory">盘点</el-button>
                                </div>
                        </div>
                             
                         </div>

                       

                        <div class="display_flex end w-30">
                          
                            <el-button-group>
                                <el-button type="primary" plain @click="open" icon="el-icon-upload2">导入文件</el-button>
                                <el-button type="primary" @click="add" plain icon="el-icon-circle-plus-outline">新增批次</el-button>
                                <el-button type="danger" @click="del" plain icon="el-icon-delete">删除批次</el-button>
                                <el-button type="warning" @click="showError" plain icon="el-icon-warning-outline">错误条码</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <!-- 列表 -->
                    <div>
                        <List
                            :dataUrl="url"
                            :isSort="true"
                            :style="'height:'+height+'px'"
                            :disableTableAction="true"
                            :disableMeta="true"
                            :tableMeta="meta"
                        ></List>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="盘点列表" name="LIST">
                     <div >
                            <List
                                :dataUrl="'/manage/unit/catalog/collectionHandling/bookInventoryList'"
                                :isSort="true"
                                :disableTableAction="true"
                                :disableMeta="true"
                                :tableMeta="metas"
                                :style="'height:'+height2+'px'"
                                :chooseBox='true'
                                @selected='selected'
                                @search='search'
                            >
                            <template slot="addition-actions" class="display_flex">
                                 <el-button-group>
                                    <el-button type="primary" plain @click="show=true" icon="el-icon-tickets">批量盘点</el-button>
                                    <el-button type="primary" @click="chooseLost('CULLING')" plain icon="el-icon-folder-remove">批量注销</el-button>
                                    <el-button type="primary" @click="chooseLost('LOST')" plain icon="el-icon-folder-remove">批量丢失</el-button>
                                   <el-button type="primary" plain icon="el-icon-download" @click="uploadListing">导出清单</el-button>
                                </el-button-group>
    
                             
                            
                            </template>
                            </List>
                        </div>
                </el-tab-pane>
                       
            </el-tabs>


        </div>
        <!-- 确认弹框 -->
         <el-dialog
            title="图书盘点"
            :visible.sync="showModel"
            width="80%"
            :close-on-click-modal="false"
            @close="close">

            <table-list :tableList='tableDataList'></table-list>
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="nowDo">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 弹框 -->
        <el-dialog
            title="批量盘点"
            :visible.sync="show"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form :model="form" :rules="rules" ref="batch" label-width="80px" class="m-b-30">
                <el-form-item label="批次名称" prop="batchId">
                      <el-select
                                v-model="form.batchId"
                                placeholder="请选择"
                                clearable
                                class="w-40 m-r-20"
                            >
                                <el-option
                                    v-for="item in batches"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                </el-form-item>
               
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="save_batch('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 弹框 -->
        <el-dialog
            title="批次管理"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form :model="batch" :rules="rules" ref="batch" label-width="80px" class="m-b-30">
                <el-form-item label="批次名称" prop="name">
                    <el-input v-model="batch.name"></el-input>
                     <el-checkbox v-model="batch.defaultSetting">是否默认批次</el-checkbox>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar('batch')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹框 -->
        <el-dialog
            title="删除批次"
            :visible.sync="createModels"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form :model="batch" :rules="rules" ref="batch" label-width="80px" class="m-b-30">
                <el-form-item label="选择批次">
                    <el-select
                        v-model="batch.batchId"
                        placeholder="请选择"
                        clearable
                        class="w-40 m-r-20"
                    >
                        <el-option
                            v-for="item in batches"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-button type="primary" size="123" @click="delBatch(batch.batchId)">删除</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModels = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="导入条码"
            :visible.sync="model"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <up-load @getInfo="getText" :show="model"></up-load>
        </el-dialog>



         <!-- 弹框 -->
        <el-dialog
            title="批量管理"
            :visible.sync="shows"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form :model="forms" :rules="rules" ref="batch" label-width="80px" class="m-b-30">
                <el-form-item label="操作" prop="bookStatus">
                      <el-select
                                v-model="forms.bookStatus"
                                placeholder="请选择"
                                clearable
                                class="w-40 m-r-20"
                            >
                                <el-option
                                    v-for="item in choose"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                </el-form-item>
               
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shows = false">取 消</el-button>
                <el-button type="primary" @click="save_batchs('forms')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import upLoad from '../textUp';
import tableList from './page/table'
export default {
    components: { List, upLoad ,tableList},
    data() {
        return {bus: this.bus(this),
            show:false,
            shows:false,
            meta: '',
            metas:'',
            able: 1,
            activeName: 'DOING',
            form: {},
            forms:{},
            code: '', //单个
            codes: '', //数组
            options: [
                { value: true, label: '是' },
                { value: false, label: '否' }
            ],
            choose:[
                {name:'注销',id:'CULLING'},
                 {name:'丢失',id:'LOST'},
            ],
            batches: [],
            isTrue: false, //是否盘点
            url: '/manage/unit/catalog/collectionHandling/bookForInventoryOperation?type=1&batchId=1',
            rules: {},
            // createModel
            chooseId:[],
            batch: {
              name:'',
              defaultSetting:false
            },
            createModel: false,
            showModel:false,
            errorCode:'',
            tableDataList:{},
            createModels: false,
            number:0,
            model: false,
          height:'',
          height2:'',
          searchList:{},
          collectionPlaces:[]
        };
    },
    created() {
        this.getBatch();
        this.getMeta();
        this.getMetas();
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },
  
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight - 362;
          this.height2 = document.documentElement.clientHeight - 243;
        },100)
      },
      search(item){
        this.searchList = item
        console.log(2222,item)
      },
      uploadListing(){
        // let newTab
        // newTab = window.open();
        this.loading();
          let params = {
            platformId :JSON.parse(localStorage.getItem("user")).platform.id,
            inventoryStatus:this.searchList?this.searchList.inventoryStatus : null,
            collectionPlaceId:this.searchList?this.searchList.collectionPlaceId : null,
            times:this.searchList?this.searchList.times:null
          }
        this.ax.get('/manage/unit/catalog/collectionHandling/exportBookInventoryList', {params})
            .then(res=>{
              window.location = res;
              this.sloading();

              // newTab.location = res
            }).catch(err=>{
              this.sloading();
            })
      },
        getCount(e){
          let number =  e.split('\n')
          this.number = number.length
        },
        // 获取getText
        getText(val) {
            // console.log(val);
            this.able=2
            if(val.cover){
                 val.data = val.data.split(/[\r\n]/g);
                this.getError(val.data)
            }else{
                this.codes = val.data;
                this.inventory()
            }
           
            // this.model=false
            // this.codes = val;
        },
        showError(){
             const h = this.$createElement;
            this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '本次操作错误条码： '),
                        h('i', { style: 'color: red' }, this.errorCode),
                       
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                         
                        }).catch(() => {
                            
                        });
            
        },
        getError(barCodes){
            let params={
                barCodes,
                platformId :JSON.parse(localStorage.getItem("user")).platform.id
            }
            this.ax.post('/manage/unit/catalog/collectionHandling/bookIs',params)
                .then(res=>{
                    if(res.length>0){
                        let code = res.join('\n')
                        this.errorCode += code
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '提示',
                            message: h('p', null, [
                                h('span', null, '本次导入有错误条码，是否继续盘点？'),
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            }).then(() => {
                                // console.log(code)
                               this.codes = barCodes.filter(it=>{
                             return it!=''
                         }).join('\n')
                                this.inventory()
                                }).catch(() => {
                                
                            });
                    }else{

                        this.codes = barCodes.filter(it=>{
                             return it!=''
                         }).join('\n')
                          this.inventory()
                    }
                    
                })
        },
        // 获取批次
        getBatch() {
            this.ax.get('/manage/unit/general/batch', { params: { type:'INVENTORY',size: 999,platformId :JSON.parse(localStorage.getItem("user")).platform.id} }).then(res => {
                // console.log(res);
                this.batches = res.content;
            });
        },
        //  标题切换
        handelClick() {},
        //   batchList
        batchList(val) {
            if (val != '') {
                this.url = '/manage/unit/catalog/collectionHandling/bookForInventoryOperation?type=1&batchId=' + val;
                setTimeout(res => {
                    this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/bookForInventoryOperation?type=1&batchId=1`, val);
                });
            }
        },
        // 选择
        selected(val){
         this.chooseBarCode = val.map(it=>{
             // console.log(val)
                return it.barCode
        })
        this.chooseId = val.map(it=>{
             // console.log(val)
                return it.id
        })
        // console.log( this.chooseBarCode)
        },

        save_batchs(){
            this.forms.bookIds = this.chooseId
            this.ax.post('/manage/unit/catalog/collectionHandling/updateBookStatus',this.forms)
                .then(res=>{
                        this.sloading();
                        this.$message.success('修改成功');
                        this.shows=false
                        this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/bookInventoryList`, res);
                })
        },
        save_batch(){
            if(this.chooseBarCode){

           
            this.form.codes = this.chooseBarCode
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/catalog/collectionHandling/bookForInventoryOperation', this.form).then(res => {
                    this.sloading();
                    this.$message.success(res);
                    this.show=false
                     this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/bookInventoryList`, res);
                    
                }).catch(res=>{
                    this.sloading();
                })
                 }else{
                       return this.$message.error('请选择操作条码');
                 }
        },
        //   开始盘点
        inventory() {
            if(this.codes=='' && this.code==''){
                return this.$message.error('请输入查询信息');
            }           
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id

            if (this.able==1 && this.isTrue) {
                let params={
                    barCode:this.code,
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id
                }
                 this.ax.get('/manage/unit/catalog/collectionHandling/bookByBarCode',{params})
                    .then(res=>{
                        // console.log(res)
                        this.showModel = true
                        this.tableDataList = res
                        this.model=false
                    })
            
            }else if(this.able==1){
                this.nowDo()
            }else if(this.able==2 && this.isTrue){
                 this.$confirm('是否确认盘点?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                     if(this.codes=='' && this.code==''){
                            return this.$message.error('请输入查询信息');
                        }
                        this.loading();
                        if (this.able == 2|| this.codes) {

                            this.form.codes = this.codes.split(/[\r\n]/g);
                                this.form.codes =  this.form.codes.filter((it,i)=>{
                                    // console.log(it)
                                    return it!=''
                                })
                        
                        } else {
                            this.form.codes = [this.code];
                        }
                        this.ax.post('/manage/unit/catalog/collectionHandling/bookForInventoryOperation', this.form).then(res => {
                            this.sloading();
                            this.$message.success(res);
                            this.batchList(this.form.batchId);
                            this.model=false
                             let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                        }).catch(res=>{
                            this.sloading();
                        })
                    }).catch(() => {
                        
                    });
            }
             else {

                if(this.codes=='' && this.code==''){
                    return this.$message.error('请输入查询信息');
                }
                this.loading();
                if (this.able == 2|| this.codes) {

                     this.form.codes = this.codes.split(/[\r\n]/g);
                         this.form.codes =  this.form.codes.filter((it,i)=>{
                             // console.log(it)
                             return it!=''
                        })
                
                } else {
                    this.form.codes = [this.code];
                }
                this.ax.post('/manage/unit/catalog/collectionHandling/bookForInventoryOperation', this.form).then(res => {
                    this.sloading();
                    this.$message.success(res);
                    this.batchList(this.form.batchId);
                    this.model=false
                     let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                }).catch(res=>{
                    this.sloading();
                })
            }
        },
        nowDo(){
             this.loading();
                        if (this.able == 2) {

                            this.form.codes = this.codes.split(/[\r\n]/g);
                              this.form.codes =  this.form.codes.filter((it,i)=>{
                                   return it!=''
                                })
                            // console.log( this.form.codes)
                        } else {
                            this.form.codes = [this.code];
                        }
                        this.ax.post('/manage/unit/catalog/collectionHandling/bookForInventoryOperation', this.form).then(res => {
                            this.sloading();
                            this.$message.success(res);
                            this.batchList(this.form.batchId);
                            this.showModel = false
                             let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                        }).catch(res=>{
                    this.sloading();
                })
        },
        //   新增打开
        add() {
            this.createModel = true;
        },
        close() {
          this.batch = {
            name:'',
            defaultSetting:false
          }
        },
        del() {
            this.createModels = true;
        },
        delBatch(ids) {
          if(!this.batch.batchId){
            return this.$message.error('请选择要删除的批次')
          }
            this.loading()
            this.ax.delete('/manage/unit/catalog/collectionHandling/batch?ids='+ids)
                .then(res=>{
                    // // console.log(res)
                    this.batch.batchId=''
                  this.form.batchId=''
                     this.sloading()
                      this.getBatch();
                     this.$message.success('删除成功');
                })
        },
        open() {
            if(!this.form.batchId){
                return  this.$message.error('请先选批次');
            }
             this.radio ='more'
            this.model = true;
        },
        //   快速新增批次
        save_mar() {
            if (this.batch.name == '' || this.batch.name == null) {
                return this.$message.error('请输入名称');
            }
            this.batch.type='INVENTORY'
            this.batch.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/general/batch', this.batch).then(res => {
                // // console.log(res)
                this.$message.success('添加成功');
                this.getBatch();
                this.createModel = false;
            });
        },
        // 获取meta
        getMeta() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
                // console.log(res);
                res.insertable = false;
                res.edit = 'NONE';
                res.delete = 'NONE';
                res.subs = [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        name: '题名',
                        sort: 0
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'isbn',
                        name: 'ISBN',
                        sort: 1
                    },
                    // {
                    //     clickable: false,
                    //     displayInList: true,
                    //     key: 'classificationNumber',
                    //     name: '分类号',
                    //     sort: 2
                    // },

                    {
                        clickable: false,
                        displayInList: true,
                        key: 'barCode',
                        name: '文献条码',
                        sort: 3
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'callNumber',
                        name: '索书号',
                        sort: 4
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publicationDate',
                        name: '出版日期',
                        sort: 5
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'collectionPlaceName',
                        name: '馆藏地',
                        sort: 6
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'price',
                        name: '价格',
                        sort: 7
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'inventoryStatus',
                        name: '状态',
                        searchOption: [
                            {
                                key: 'false',
                                name: '已注销'
                            },
                            {
                                key: 'true',
                                name: '已盘点'
                            }
                        ],
                        sort: 8
                    }
                ];

                this.meta = res;
            });
        },
        chooseLost(res){
            this.forms.bookStatus = res
            this.shows= true
        },
         // 获取meta
        getMetas() {
            this.ax.get('/manage/unit/general/collectionPlace', {
                params: { size: 9999,platformId :JSON.parse(localStorage.getItem("user")).platform.id ,type:'LITERATURE'}
            })
                .then(it=>{
                     this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
                            // console.log(res);
                            res.insertable = false;
                            res.edit = 'NONE';
                            res.delete = 'NONE';
                            res.subs = [
                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'positiveTitle',
                                    name: '题名',
                                    sort: 0
                                },
                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'isbn',
                                    name: 'ISBN',
                                    sort: 1
                                },
                                // {
                                //     clickable: false,
                                //     displayInList: true,
                                //     key: 'classificationNumber',
                                //     name: '第一责任者',
                                //     sort: 2
                                // },

                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'barCode',
                                    name: '文献条码',
                                    sort: 3
                                },
                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'callNumber',
                                    name: '索书号',
                                    sort: 4
                                },
                                  {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'price',
                                    name: '价格',
                                    sort: 7
                                },
                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'inventoryTime',
                                    type:'TIMESTAMP',
                                    name: '盘点日期',
                                    searchable:true,
                                    sort: 7
                                },
                                {
                                    clickable: false,
                                    displayInList: false,
                                    key: 'collectionPlaceId',
                                    searchable:true,
                                    searchOption:it.content.map(it=>{
                                        return {name:it.name,key:it.id}
                                    }),
                                    name: '馆藏地',
                                    sort: 5
                                },
                                 {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'collectionPlaceName',
                                    searchable:false,
                                    name: '馆藏地',
                                    sort: 6
                                },
                                 {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'bookStatus',
                                    name: '状态',
                                    
                                    searchOption: [
                                        {
                                            key: 'InCollection',
                                            name: '在馆'
                                        }, 
                                        {
                                            key: 'LOST',
                                            name: '丢失'
                                        }, 
                                        {
                                            key: 'LEND',
                                            name: '借出'
                                        }, 
                                        {
                                            key: 'CULLING',
                                            name: '注销'
                                        }, 
                                        {
                                            key: 'DAMAGE',
                                            name: '损坏'
                                        }
                                    ],
                                    sort: 9
                                },
                              
                                {
                                    clickable: false,
                                    displayInList: true,
                                    key: 'inventoryStatus',
                                    name: '盘点状态',
                                      searchable:true,
                                    searchOption: [
                                        {
                                            key: 'false',
                                            name: '未盘点',
                                            color:'#f00'
                                        }, 
                                        {
                                            key: 'true',
                                            name: '已盘点',
                                            color:'#67C23A'
                                        }
                                    ],
                                    sort: 8
                                }
                            ];

                            this.metas = res;
                        });
                })
           
        }
    }
};
</script>

<style >
.label {
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: normal;
    line-height: 1.25rem;
    color: #333333;
}
.el-message-box__content{
    overflow: auto;
    max-height: 500px;
}
</style>
