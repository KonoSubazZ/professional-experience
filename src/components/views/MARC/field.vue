 <template>
    <div class="container">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="MARC字段设置" name="BOOK"></el-tab-pane>
            </el-tabs>
        </div>
         <List 
            :data='data'
            :disableFilter='true'
            :isHeaderHeigt='80'
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            @create="open" >

                <!-- <template slot="addition-table-actions" slot-scope="scope">
                    <el-button type="text" size="mini" @click="updata(scope.item.row)">编辑子字段</el-button>
                </template> -->

        </List>
        <!-- 弹框 -->
        <el-dialog title="MARC字段管理" :visible.sync="createModel" width="30%"  :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">
                        <el-form-item label="字段帮助信息"  >
                            <el-input v-model="form.note" type="note" :rows="2"></el-input>
                        </el-form-item>
                        <el-form-item label="字段标识符" prop='code' >
                            <el-input v-model="form.code" ></el-input>
                        </el-form-item>

                        <el-form-item label="子字段" prop='district' >
                            <el-input v-model="form.district"  maxlength='10'></el-input>
                        </el-form-item>

                         <el-form-item label="指示符1" prop='indicatorOne' >
                            <el-input v-model="form.indicatorOne" ></el-input>
                        </el-form-item>

                         <el-form-item label="指示符2" prop='indicatorTwo' >
                            <el-input v-model="form.indicatorTwo" ></el-input>
                        </el-form-item>

                      

                        <el-form-item label="是否为定长字段" prop='fixedLength' >
                            <el-select v-model="form.fixedLength" clearable placeholder="请选择" class="w-100">
                                <el-option
                                v-for="item in option"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        
                         <el-form-item label="长度" prop='totalLength' v-if='form.fixedLength' >
                            <el-input v-model="form.totalLength" ></el-input>
                        </el-form-item>

                         <el-form-item label="是否为必备字段" prop='essential' >
                            <el-select v-model="form.essential" clearable placeholder="请选择" class="w-100">
                                <el-option
                                v-for="item in option"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                         <el-form-item label="是否可重复" prop='duplicate' >
                            <el-select v-model="form.duplicate" clearable placeholder="请选择" class="w-100">
                                <el-option
                                v-for="item in option"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mark('form')">确 定</el-button>
                </span>
        </el-dialog>

    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'', 
           metas:'',
           loadings:false,
           createModel:false,
         
           activeName:'BOOK',
           form:{
              totalLength:0
           },
           data:{},
           height:'',
           dataUrl:'/manage/unit/system/systemSettings/marcFieldDetail', //默认url
           options:[],
           option:[
               {name:'是',key:true},
                {name:'否',key:false},
           ],
           rules:{
               totalLength: [{ required: true, message: '请输入长度', trigger: 'blur' }],
               duplicate: [{ required: true, message: '请选择', trigger: 'change' }],
               marcType: [{ required: true, message: '请选择', trigger: 'change' }],
               code: [{ required: true, message: '请输入', trigger: 'blur' }],
               essential: [{ required: true, message: '请选择', trigger: 'change' }],
               fixedLength: [{ required: true, message: '请选择', trigger: 'change' }],
                marcTypeDetailId: [{ required: true, message: '请选择', trigger: 'change' }],

           }
        };
    },
    created() {
       this.metaList()
    //    this.getMarcTypeDetailId('BOOK')

        if(this.$route.query){
            // this.dataUrl = '/manage/unit/system/systemSettings/marcFieldDetail?marcTypeDetailId='+this.$route.query.id
            this.getList()
        }
        this.height = this.$height()
    },
    methods: {
        // getList
        getList(){
            let params={
                marcTypeDetailId :this.$route.query.id,
                platformId:JSON.parse(localStorage.getItem("user")).platform.id
            }
            this.ax.get('/manage/unit/system/systemSettings/marcFieldDetail',{params})
                .then(res=>{
                    // console.log(res)
                    this.data={
                        content:res
                    }
                })
        },
        // 获取marc类型
        getMarcTypeDetailId(marcType){
            this.ax.get('/manage/unit/system/systemSettings/marcTypeDetailInsertMarcFieldDetailFather',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id,marcType}})
                .then(res=>{
                    this.options = res.content
                })
        },
        updata(val){
            // console.log(val)
            this.$router.push({
                path:'field/son',
                query:{id:val.id,type:val.code,marc:this.activeName}
            })
        },
       
        // 切换
         handelClick(e){
            // // console.log(this.activeName)
             this.loading();
            if(this.activeName=='BOOK'){
                //  this.getMarcTypeDetailId('BOOK')
                this.dataUrl='/manage/unit/system/systemSettings/marcFieldDetailFather?marcType=BOOK'
                setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcFieldDetailFather?marcType=BOOK`, e);
                    // this.metaList()
                })
            }else{
                 this.dataUrl='/manage/unit/system/systemSettings/marcFieldDetailFather?marcType=JOURNAL'
                //   this.getMarcTypeDetailId('BOOK')
                 setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcFieldDetailFather?marcType=BOOK`, e);
                    // this.metaList()
                })
            }
             setTimeout(res=>{
                   this.sloading()
                },500)
           
            //  // console.log(e)
        },
        // 修改
        editUpdate(e){
            this.loading()
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                 this.sloading()
            },500)
            
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/system/systemSettings/marcFieldDetailFather?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcFieldDetailFather?marcType=BOOK`, e);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(){
            this.createModel = true
            //  this.getMarcTypeDetailId(this.activeName)
             this.form={
                   totalLength:0
             }
        },
        // 
        close(){
            this.form={
                totalLength:0
           }
        },
        // 保存
         save_mark(formName){
              this.$refs[formName].validate(valid => {
                if (valid) {

                    this.loading()
                    this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
                    this.form.marcTypeDetailId = this.$route.query.id
                    this.ax.post('/manage/unit/system/systemSettings/marcFieldDetail',this.form)
                        .then(res=>{
                            this.sloading()
                             this.$message.success('保存成功');
                            this.createModel = false
                            this.getList()
                        })
                        .catch(res => { 
                                    this.sloading();
                                });

                }else{
                     this.$message.error('请根据提示输入');
                    return false;

                }
           

              })

        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.MarcFieldDetail'}})
            .then(res=>{
               
                res.subs.map(it=>{
                    if(it.key=='createTime' || it.key == 'platformId' || it.key == 'marcTypeDetailId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='marcBookField'){
                        this.options = it.searchOption
                    }
                    if(it.key=='marcTypeDetailName'){
                        it.displayInList=true
                    }
                    if(this.activeName=='BOOK' && it.key=='marcJournalField'){
                        it.displayInList = false
                    }else if(this.activeName=='JOURNAL' && it.key=='marcBookField'){
                        it.displayInList = false
                    }
                })
                 // console.log(res)
                this.meta = res
              
            })
        },
    }
};
</script>

<style>

</style>
