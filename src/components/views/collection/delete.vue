 <template>
    <div class="container">
        <div class="padding_20 ">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="单个条码" name="DOING">
                    <!-- 单个条码 -->
                    <div class="display_flex p-t-20">
                       <div class="display_flex">
                            <div class="f-s-14 m-r-5 w-30">单个条码：</div>
                            <el-input placeholder="文献条码" class="m-r-20 w-70" id="getFocus" v-model="code" @keyup.enter.native="deleteCode"></el-input>
                       </div>
                        <div class="display_flex">
                             <div class="f-s-14 m-r-5">是否确认删除</div>
                            <el-select
                                v-model="isTrue"
                                placeholder="是否确认删除"
                                clearable
                                class="m-r-20"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        
                        <el-button type="primary"  @click="deleteCode">删除</el-button>
                    </div>
                   
                </el-tab-pane>

                <el-tab-pane label="条码范围" name="LIST">
                    <div class="display_flex start w-100 ">

                   

                     <div class="display_flex w-80 start">
                             <div class="display_flex start w-40">
                                 <div class="m-r-10">
                                      <el-radio v-model="able" :label="2" class="p-t-20">多个条码</el-radio>
                                      <br>
                                       <div class="numberes">{{number}}行</div>
                                 </div>
                                 <div class="w-80">
                                    <el-input type="textarea" class="textarea w-80" placeholder="请输入内容并以回车分割" @input="getCount" :disabled='able==1?true:false'  :rows="5"  v-model="codes"></el-input>
                                 </div>
                             </div>
                              <div class="display_flex start w-50">
                                 <div class="m-r-10">
                                      <el-radio v-model="able" :label="1" class="p-t-20 m-b-30" >条码范围删除</el-radio>

                                      <div class="f-s-14 m-r-5">是否确认删除</div>
                                 </div>
                                
                                 <div class="w-80">
                                     <div class="display_flex between p-t-10 m-b-20">
                                          <el-input class="w-40" v-model="startCode"  :disabled='able==2?true:false' placeholder='起始文献条码范围'></el-input>
                                            <div class="through"></div>
                                            <el-input class="w-40" v-model="endCode"  :disabled='able==2?true:false' placeholder='终止文献条码范围'></el-input>
                                     </div>
                                      <div class="display_flex">
                                             <el-select
                                                v-model="isTrue"
                                                placeholder="是否确认删除"
                                                clearable
                                                class="m-r-20"
                                            >
                                                <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                           
                                        </div>
                              
                                 </div>
                             </div>
                        </div>
                         <div class="p-t-10 m-r-10">
                             <el-button type="primary"  @click="lookCode(startCode,endCode)">生成</el-button>
                        </div>

                      
                        <div class="p-t-10">
                            <el-button type="primary" class="" @click="deleteCode">删除</el-button>
                        </div>

                        <div class="display_flex end w-25 ">
                               <el-button-group>
                                    <el-button type="primary" plain @click="open" icon="el-icon-upload2">导入文件</el-button>
                                    <el-button type="warning" @click="showError" plain icon="el-icon-warning-outline">查看错误条码</el-button>
                                </el-button-group>
                           
                        </div>
                    </div>
                    
                </el-tab-pane>
            </el-tabs>
             <!-- 列表 -->
                    <div >
                        <List
                            :data="tableData"
                            :isSort="true"
                            :isHeaderHeigt='180'
                            :disableTableAction="true"
                            :disableMeta="true"
                            :tableMeta="meta"
                            @search="selected"
                        ></List>
                    </div>
        </div>
         <!-- 弹框 -->
         <el-dialog title="导入条码" :visible.sync="model" width="30%" :close-on-click-modal='false' >
                <up-load @getInfo='getText' :show="model"></up-load>
        </el-dialog>
         <!-- 确认弹框 -->
         <el-dialog
            title="图书盘点"
            :visible.sync="showModel"
            width="80%"
            :close-on-click-modal="false"
            >

            <table-list :tableList='tableDataList'></table-list>
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="nowDo">确 定</el-button>
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
            able:1,
            model:false,
            showModel:false,
            tableDataList:{},
            meta: '',
            activeName: 'DOING',
            form: {}, 
            errorCode:'',
            code: '', //单个
            codes: '', //数组
            options: [
                { value: true , name: '是' },
                { value: false , name: '否' }
            ],
            batches: [],
            isTrue: false, //是否盘点
            url: '',
            rules: {},
            tableData: {
                content: [],
                number:0,
                size:20,
                totalElements:0
            },
            backList:[],
            page:1,
            size:20,
            number:0,
            // 起始
            startCode:'',
            endCode:''
        };
    },
    created() {
        this.getMeta();
    },
    methods: {
         getCount(e){
          let number =  e.split('\n')
          this.number = number.length
        },
        selected(e){
            // console.log(this.page)
            if(e){
                  this.page=e.page
                  this.size=e.size
            }else{
               this.page=this.page+1
            }
             this.tableData = {
                 content:this.backList.slice( ( this.page-1) * this.size, this.page * this.size ),
                 number:this.page,
                 size:this.size,
                 totalElements:this.backList.length
             }
             // console.log(this.backList.slice( ( this.page-1) * this.size, this.page * this.size ))
             // console.log( this.tableData)
        },
        lookCode(startBarCode,endBarCode){
            if(!startBarCode || !endBarCode){
                return  this.$message.warning('请输入范围');
            }
            let params ={
                startBarCode,
                endBarCode
            }
            this.ax.get('/manage/unit/catalog/bibliography/barCode',{params})
                .then(res=>{
                      this.codes = res.filter(it=>{
                             return it!=''
                         }).join('\n')
                })
        },

        open(){
          this.model=true
        },
          getCode(){
            
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
                this.deleteCode()
            }
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
                        h('span', null, '条码 '),
                        h('i', { style: 'color: red' }, code),
                         h('span', null, '错误，是否继续删除'),
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                        //   // console.log(code)
                            this.codes = barCodes.filter(it=>{
                             return it!=''
                         }).join('\n')
                           this.deleteCode()
                        }).catch(() => {
                            
                        });
                    }else{
                            this.codes = barCodes.filter(it=>{
                             return it!=''
                            }).join('\n')
                           this.deleteCode()
                    }
                    
                })
        },
         nowDo(){
            
                        this.loading()
                        if (this.activeName == 'LIST') {
                             this.form.codes = this.codes.split(/[\r\n]/g);
                               this.form.codes =  this.form.codes.filter((it,i)=>{
                                   return it!=''
                                })
                        } else {
                            this.form.codes = [this.code];
                        }
                        this.ax.post('/manage/unit/catalog/collectionHandling/deleteBarCode', this.form).then(res => {
                            // console.log(res)
                            this.sloading()
                             this.showModel = false
                             this.page=0
                            let arr = this.tableData.content
                 
                            this.backList = res.concat(arr);
                            this.$message.success('删除成功');
                            this.selected()
                            let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                            
                        }).catch(res=>{
                            this.sloading()
                        })
                  
        },
        //   开始删除
        deleteCode() {
             this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
          if(this.isTrue && !this.codes){
               let params={
                    barCode:this.code,
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id
                }
                this.ax.get('/manage/unit/catalog/collectionHandling/bookByBarCode',{params})
                        .then(res=>{
                           
                             this.showModel = true
                            this.tableDataList = res
                           
                        })

          }else if(this.isTrue && this.codes){
               this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {

                    if (this.activeName == 'LIST' && this.codes) {
                     this.form.codes = this.codes.split(/[\r\n]/g);
                       this.form.codes =  this.form.codes.filter((it,i)=>{
                                   return it!=''
                                })
                } else  {
                     this.form.codes = [this.code]
                    this.form.startBarcode = this.startCode
                    this.form.endBarcode = this.endCode
                    
                }
                this.ax.post('/manage/unit/catalog/collectionHandling/deleteBarCode', this.form).then(res => {
                    this.sloading()
                     this.page=0
                    let arr = this.tableData.content
                    this.backList = res.concat(arr);
                    this.$message.success('删除成功');
                    this.selected()
                    let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                }).catch(res=>{
                    this.sloading()
                })

                }).catch(() => {
                    
                });
          }
          else{
               this.loading()
                if (this.activeName == 'LIST' && this.codes) {
                     this.form.codes = this.codes.split(/[\r\n]/g);
                       this.form.codes =  this.form.codes.filter((it,i)=>{
                                   return it!=''
                                })
                } else  {
                     this.form.codes = [this.code]
                    this.form.startBarcode = this.startCode
                    this.form.endBarcode = this.endCode
                    
                }
                this.ax.post('/manage/unit/catalog/collectionHandling/deleteBarCode', this.form).then(res => {
                     this.sloading()
                    if(!res){
                        return this.$message.error('条码不存在');
                    }
                      this.$message.success('操作成功');
                    // console.log(res)
                   
                   let arr = this.tableData.content
                   // console.log(arr)
                    this.page=0
                    this.backList = res.concat(arr);
                    // console.log( this.backList)
                    this.selected()
                    let input = document.getElementById('getFocus')
                             input.focus()
                             input.select()
                }).catch(res=>{
                    this.sloading()
                })
          }
        },
      
        PrefixZero(num, n) {
            return (Array(n).join(0) + num).slice(-n);
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
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'firstResponsible',
                        name: '第一责任者',
                        sort: 2
                    },

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
                        key: 'presenceStatus',
                        name: '状态',
                        searchOption: [
                            {
                                key: 0,
                                name: '成功',
                                color: null
                            },
                            {
                                key: 1,
                                name: '失败',
                                color: null
                            }
                           
                        ],
                        sort: 8
                    }
                ];

                this.meta = res;
            });
        }
    }
};
</script>

<style scoped>
.label {
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: normal;
    line-height: 1.25rem;
    color: #333333;
}
.through{
   border-bottom: 1px solid #dddddd;
   padding: 0 20px;
}
.block{
    height: 30px;
}

</style>
