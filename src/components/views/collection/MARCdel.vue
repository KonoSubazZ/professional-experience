<template>
    <div>
        <div class="container" >
                            <List
                                :dataUrl="'/manage/unit/catalog/collectionHandling/bookBase'"
                                :disableMeta="true"
                                :tableMeta="meta"
                                :chooseBox='true'
                                @selected='selected'
                                :disableTableAction='true'
                                ref="list"
                            >   
                                    <template slot="chooseBox" >
                                    <div class='display_flex'>
                                        <el-select
                                            filterable
                                            v-model="form.marc"
                                            clearable
                                            placeholder="请选择MARC脚本"
                                            class="w-15 m-r-20"
                                            >
                                                <el-option 
                                                    v-for="items in MARClist"
                                                    :key="items.id"
                                                    :label="items.name"
                                                    :value="items.id"
                                                ></el-option>
                                            </el-select>
                                        <el-button-group>
                                                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-setting' @click="edit" >编辑脚本</el-button>
                                                    <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click='showModel=true' >新增脚本</el-button>
                                        </el-button-group>
                                    </div>
                                    </template>
                                 
                                    <template slot="addition-actions" >
                                        <el-button-group>
                                                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-finished' @click="batMarc" >批处理本次选择数据</el-button>
                                                    <!-- <el-button type="primary" plain icon="el-icon-collection" @click="batMarcAll" >批处理全部数据</el-button> -->
                                        </el-button-group>
                                            
                                    </template>
                            </List>
                  

         </div>
          <!-- 确认弹框 -->
         <el-dialog
            title="MARC脚本编辑"
            :visible.sync="showModel"
            width="50%"
            :close-on-click-modal="false"
            @close="close"
        >
                <el-dialog
                        width="40%"
                        title="新增"
                         :close-on-click-modal="false"
                        :visible.sync="innerVisible"
                        append-to-body>
                        <div >
                             <el-form :model="forms" status-icon :rules="rules" ref="ruleForm"  class='padding_20' >
                                 <el-form-item  prop="marcBatchType" label="操作类型" class=" w-100">
                                    <el-select
                                            filterable
                                            v-model="forms.marcBatchType"
                                            clearable
                                            placeholder="请选择"
                                            class="w-100"
                                            >
                                                <el-option 
                                                    v-for="items in MARCtype"
                                                    :key="items.id"
                                                    :label="items.name"
                                                    :value="items.id"
                                                ></el-option>
                                            </el-select>
                                </el-form-item>

                               

                                 <el-form-item  prop="codeDistrict" label="字符标识符1" class=" w-100 " >
                                    <el-input v-model="forms.codeDistrict"  :placeholder="forms.marcBatchType=='CREATE_FIELD'?'新增字段该值为创建字段名,例如010':
                                      forms.marcBatchType=='CREATE_CHILD_FIELD'?'新增子字段该值为字段名加分区，例如010a':
                                      forms.marcBatchType=='DELETE_FIELD'?'删除操作该值为删除字符，例如010':
                                      forms.marcBatchType=='COPY'?'复制操作该值为复制字段,例如复制010到100，这里输入010':'替换操作不输入为全局替换,例如010'" class='w-100'></el-input>
                                </el-form-item>

                                 <el-form-item  prop="indicator" label="指示符" class=" w-100 " v-if='forms.marcBatchType=="CREATE_FIELD"'>
                                    <el-input v-model="forms.indicator" maxlength='2' placeholder="请输入指示符，值为数字最大2位" class='w-100'></el-input>
                                </el-form-item>
                              
                                 <el-form-item  prop="codeDistrictNew" label="字符标识符2" class=" w-100 " v-if='forms.marcBatchType!=="DELETE_FIELD" &&  forms.marcBatchType!=="REPLACE"
                                  && forms.marcBatchType!=="CREATE_FIELD" && forms.marcBatchType!=="CREATE_CHILD_FIELD" '>
                                    <el-input v-model="forms.codeDistrictNew"  
                                      :placeholder="forms.marcBatchType=='CREATE_FIELD'?'新增字段该值为创建字段名':
                                      forms.marcBatchType=='DELETE_FIELD'?'删除操作该值为删除字符':
                                      forms.marcBatchType=='COPY'?'只有复制需要,被复制的字段，这里输入100':'替换操作不输入为全局替换'"
                                     class='w-100'></el-input>
                                </el-form-item>

                                 <el-form-item  prop="content" label="内容1" class=" w-100 " v-if='forms.marcBatchType!=="DELETE_FIELD" && forms.marcBatchType!=="COPY"'>
                                    <el-input v-model="forms.content" @input="checkMarc(forms.content,'content')"   
                                      :placeholder="forms.marcBatchType=='CREATE_FIELD'?'新增字段该值为创建内容':
                                      forms.marcBatchType=='CREATE_CHILD_FIELD'?'新增子字段该值为创建内容':
                                      forms.marcBatchType=='REPLACE'?'替换该值为被替换内容,例如替换2020为1000，这里输入2020':''" class='w-100'></el-input>
                                </el-form-item>

                                 <el-form-item  prop="contentNew" label="内容2" class=" w-100 " v-if='forms.marcBatchType!=="DELETE_FIELD" && forms.marcBatchType!=="COPY"
                                  && forms.marcBatchType!=="CREATE_FIELD" && forms.marcBatchType!=="CREATE_CHILD_FIELD"'>
                                    <el-input v-model="forms.contentNew" @input="checkMarc(forms.contentNew,'contentNew')" placeholder="只有替换需要，这里输入1000" class='w-100'></el-input>
                                </el-form-item>
                           
                             </el-form>
                             </div> 
                             <span slot="footer" class="dialog-footer">
                                <el-button @click="innerVisible = false">取 消</el-button>
                                <el-button type="primary" @click="addMarcList">确 定</el-button>
                            </span>
                </el-dialog>
            <el-form :model="form" status-icon :rules="rules" ref="ruleForm"  class='padding_20' >
                     
                            <el-form-item  prop="name" label="MARC脚本名称" class=" w-100 ">
                                <el-input v-model="form.name"  placeholder="请输入" class='w-100'></el-input>
                            </el-form-item>
                            
                            <el-button type="primary" @click="addMarcType" class='m-b-20'>新增MARC操作</el-button>
                            
                     <!-- <div class="display_flex">
                            <div class="w-200">
                                
                            </div>
                            <div class="w-200">
                                新增字段需要
                            </div>
                            <div class="w-240">
                                        <div> 新增字段该值为创建字段名</div>
                                        <div> 新增子字段该值为字段名加分区</div>
                                        <div> 删除操作该值为删除字符</div>
                                        <div> 复制操作该值为复制字段</div>
                                        <div> 替换操作不输入为全局替换</div>
                            </div>
                                <div class="w-200">
                                        <div> 新增字段该值为创建内容</div>
                                        <div> 新增子字段该值为创建内容</div>
                                        <div> 替换该值为被替换内容</div>
                                </div>
                            <div class="w-200">
                                        <div>只有复制需要</div>
                            </div>
                            
                                <div class="w-200">
                                        <div>只有替换需要</div>
                                </div>
                                <div class="w-200">
                           </div>
                      </div> -->
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="marcBatchType"
                        width='150'
                        label="操作类型"
                        align="center">
                        <template slot-scope="scope">
                                <div>{{
                                      scope.row.marcBatchType=='CREATE_FIELD'?'新增字段':
                                      scope.row.marcBatchType=='CREATE_CHILD_FIELD'?'新增子字段':
                                      scope.row.marcBatchType=='DELETE_FIELD'?'删除':
                                      scope.row.marcBatchType=='COPY'?'复制':'替换'
                                    }}
                                    
                                </div>             
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="indicator"
                        label="指示符"
                        align="center"
                        >
                          <template slot-scope="scope">
                                <div v-if="scope.row.isSet">{{  scope.row.indicator?scope.row.indicator:'无需输入'   }} </div>
                                <div v-if="!scope.row.isSet && scope.row.indicator"><el-input v-model="scope.row.indicator"></el-input></div>
                          </template>
                    </el-table-column>
                    <el-table-column
                        prop="codeDistrict"
                        label="字符标识符1"
                        align="center"
                        >
                         <template slot-scope="scope">
                                <div v-if="scope.row.isSet">{{  scope.row.codeDistrict?scope.row.codeDistrict:'无需输入'   }} </div>
                                <div v-if="!scope.row.isSet && scope.row.codeDistrict"><el-input v-model="scope.row.codeDistrict"></el-input></div>
                          </template>
                    </el-table-column>
                    <el-table-column
                        
                        prop="content"
                        label="内容1"
                        align="center">
                         <template slot-scope="scope">
                                <div v-if="scope.row.isSet">{{  scope.row.content?scope.row.content:'无需输入'   }} </div>
                                <div v-if="!scope.row.isSet && scope.row.content"><el-input v-model="scope.row.content"></el-input></div>
                          </template>
                    </el-table-column>
                     <el-table-column
                         
                        prop="codeDistrictNew"
                        label=" 字符标识符2"
                        align="center">
                         <template slot-scope="scope">
                                <div v-if="scope.row.isSet">{{  scope.row.codeDistrictNew?scope.row.codeDistrictNew:'无需输入' }} </div>
                                <div v-if="!scope.row.isSet && scope.row.codeDistrictNew"><el-input v-model="scope.row.codeDistrictNew"></el-input></div>
                          </template>
                    </el-table-column>
                     <el-table-column
                        
                        prop="contentNew"
                        label="内容2"
                        align="center">
                         <template slot-scope="scope">
                                <div v-if="scope.row.isSet">{{  scope.row.contentNew?scope.row.contentNew:'无需输入'   }} </div>
                                <div v-if="!scope.row.isSet && scope.row.contentNew"><el-input v-model="scope.row.contentNew"></el-input></div>
                          </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                          <div style="display: flex;align-items: center;justify-content: center">
                            <el-button
                                type="text"
                                icon="el-icon-edit"
                                v-if="scope.row.isSet"
                                @click="editRow(scope.row,scope.$index)"
                            >编辑</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                v-else
                                @click="saveRow(scope.row,scope.$index)"
                            >保存</el-button>

                            <el-button
                                type="text"
                                class="color_dan"
                                icon="el-icon-delete"
                                @click="delRow(scope.$index)"
                            >删除</el-button>
                          </div>

                        </template>
                    </el-table-column>
                </el-table>        
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="addMarc">确 定</el-button>
            </span>
        </el-dialog>

     

    </div>
</template>

<script>
import List from '../../view/List';
import fromData from '../../view/form';

const qs = require('qs');
export default {
    components: {
        List,
        fromData
    },
    data() {
        return {bus: this.bus(this),
            meta:'',
           iptshow:true,
            showModel:false,
            innerVisible:false,
            MARCtype:[
                {name:'新增字段',id:'CREATE_FIELD'},
                {name:'新增子字段',id:'CREATE_CHILD_FIELD'},
                {name:'删除',id:'DELETE_FIELD'},
                {name:'复制',id:'COPY'},
                {name:'替换',id:'REPLACE'}
            ],
            tableData:[],
            MARClist:[],//选择数组
            chooseList:[],//选择的MARC
            MARCtypeList:[],
            rules:{},
            forms:{isSet:true},
            form:{}
        };
    },
    created() {
        this.getMarcBatch()
        this.getManger()

    },
  methods: {
        checkMarc(val,index){
                 this.forms[index] = val.replace('\\', '▼');
        },
        // 执行
        batMarc(){
            if(this.form.marc==''){
                return  this.$message.warning('请选择脚本');
            }
            if(this.chooseList.length==0){
                return  this.$message.warning('请选择执行MARC');
            }
            this.loading()
            let params={
                type:2,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                bookBaseIds:this.chooseList.map(it=>{
                    return it.id
                }),
                marcBatchId:this.form.marc
            }

            this.ax.post('/manage/unit/catalog/collectionHandling/editMarc',params)
                .then(res=>{
                     this.sloading()
                     this.$message.success('执行成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        batMarcAll(){
            if(this.form.marc==''){
                return  this.$message.warning('请选择脚本');
            }
            this.loading()
            let params={
                type:1,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                marcBatchId:this.form.marc
            }

            this.ax.post('/manage/unit/catalog/collectionHandling/editMarc',params)
                .then(res=>{
                     this.sloading()
                     this.$message.success('执行成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // edit
        edit(){
            this.MARClist.map(it=>{
                if(it.id==this.form.marc){
                    // this.forms= it.marcBatchDetails
                    this.tableData = it.marcBatchDetails
                    this.form = it
                }
            })
            this.showModel=true
        },
        // addMarcType
        addMarcType(){
            this.MARCtypeList.push({})
            this.innerVisible=true
        },
        // 保存
        addMarc(){
           let arr = this.MARClist.map(({name})=>(name));
            if(arr.indexOf(this.form.name) != -1){
              return this.$message.error('MARC脚本名称已存在')
            }

           let   params = this.form
           
                params.name=this.form.name,
                params.platformId=JSON.parse(localStorage.getItem("user")).platform.id,
                params.marcBatchDetails=this.tableData
            
            this.ax.post('/manage/unit/catalog/collectionHandling/marcBatch',params)
                .then(res=>{
                    this.showModel=false
                    this.form={}
                    this.tableData=[]
                    this.forms={isSet: true}
                    this.$message.success('保存成功');
                    this.getMarcBatch()
                })
        },
        // 增加一条操作
        addMarcList(){
            if(this.check()){
                    this.tableData.push(this.forms)
                    this.innerVisible=false
                    this.forms = {isSet: true}
            }
           
        },
        // check
        check(){
             let reg =/^[a-z]$/
             let regs = /^\d$/
            if(this.forms.marcBatchType=='CREATE_FIELD'){
                   
                    // if(!regs.test(this.forms.indicator)){
                    //     this.$message.error('指示符必须为数字');
                    //     return false
                    // }
                  
                    // if(!regs.test(this.forms.codeDistrict)){
                    //     this.$message.error('标识符1必须为数字');
                    //     return false
                    // }
                    return true

            }else if(this.forms.marcBatchType=='CREATE_CHILD_FIELD'){
                return true
            }else if(this.forms.marcBatchType=='DELETE_FIELD'){
                return true
            }else if(this.forms.marcBatchType=='COPY'){
                return true
            }else if(this.forms.marcBatchType=='REPLACE'){
                return true
            }


        },
    //编辑当前行
        editRow(row,index){
          row.isSet = false;
        },
        saveRow(row,index){
          row.isSet = true;
        },
        // 删除一条操作
         delRow(index){
            // // console.log(val)
            this.tableData.splice(index,1)
        },
        close(){},
         // 获取批处理列表
         getMarcBatch(){
             this.ax.get('/manage/unit/catalog/collectionHandling/marcBatch',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.MARClist = res.content
                })
         },
         // 获取操作员
        getManger(){
            this.ax.get('/manage/unit/general/manager',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                let arr =res.content.map(it=>{
                    return {name:it.name,key:it.name}
                })
                this.metasList(arr)
            });
        },
        // 获取当前选择
        selected(val){
            // console.log(val)
            this.chooseList = val
        },
        // 获取meta
        metasList(val) {
            this.meta = {
                insertable: false,
                edit: 'NONE',
                delete: 'NONE',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        searchable: true,
                        name: '正题名'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'isbn',
                        searchable: false,
                        name: 'ISBN'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: false,
                        key: 'firstResponsible',
                        name: '第一责任者'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        name: '出版社'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'classificationNumber',
                        name: '分类号'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'managerName',
                        searchOption:val,
                        name: '操作员'
                    },
                     {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'createTime',
                        type: "TIMESTAMP",
                        name: '编目时间'
                    }
                ]
            };
        }
       
    }
};
</script>

<style scoped>
.w-200{
    width: 200px;
}
.w-240{
    width:240px;
}
</style>
