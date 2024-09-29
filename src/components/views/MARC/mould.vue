 <template>
    <div class="container">
        <div class="padding_20">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="MARC模板" name="BOOK"></el-tab-pane>
                <!-- <el-tab-pane label="期刊类" name="JOURNAL"></el-tab-pane> -->
            </el-tabs>
        </div>
         <List 
            :dataUrl="dataUrl"
            :disableMeta='true'
            :tableMeta='meta'
            :isHeaderHeigt='80'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            @create="open" >
             <template slot="addition-table-actions" slot-scope="scope">
                    <el-button type="text" size="mini" v-if="!scope.item.row.default" @click="updata(scope.item.row)">设置为默认</el-button>
                     <el-button type="text" size="mini" @click="jump(scope.item.row)">编辑模板</el-button>
            </template>
            
        </List>
        <!-- 弹框 -->
        <el-dialog title="MARC模板管理" :visible.sync="createModel" width="40%" :close-on-click-modal='false'  @close='close' :top='"5vh"'>

                <!-- <div class="w-100 padding_20  display_flex between start mould"  :style="height"> -->
                  
                    <!-- <div class="w-50 "> -->
                        <div class="">
                            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                                    <el-form-item label="模板名称" prop='name' >
                                        <el-input v-model="form.name" ></el-input>
                                    </el-form-item>



                                    <el-form-item label="MARC类型" prop='marcTypeDetailId' >
                                        <el-select v-model="form.marcTypeDetailId" clearable placeholder="请选择" class="w-100" @change="getName">
                                            <el-option
                                            v-for="item in options"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="编目类型" prop='marcType' >
                                        <el-select v-model="form.marcType" :disabled='edit' clearable placeholder="请选择" class="w-100" >
                                            <el-option
                                            v-for="item in option"
                                            
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>




                            </el-form>
                        </div>
                        <!-- <el-table :data="chooseData" style="width: 100%">
                            <el-table-column prop="code" label="字符表示符"></el-table-column>
                             <el-table-column prop="note" label="字符表示符"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="text"
                                        class="color_dan"
                                        @click="handleDelete(scope.$index, scope.row)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table> -->
                    <!-- </div>
                </div> -->
               
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import Vue from 'vue';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'', 
           metas:'', //新增
            height:'',
           loadings:false,
           createModel:false,
           marcId:[],
           edit:false,
           form:{},
           option:[
               {name:'图书类',id:'BOOK'},
                {name:'期刊类',id:'JOURNAL'},
           ],
           options:[],
           activeName:'BOOK',
           dataUrl:'/manage/unit/system/systemSettings/marcTemplate',
        //    dataUrls:'/manage/unit/system/systemSettings/marcFieldDetailFatherForInsertMarcTemplate?marcType=BOOK',
           rules:{
               marcType: [{ required: true, message: '请选择', trigger: 'change' }],
               marcTypeDetailId: [{ required: true, message: '请选择', trigger: 'change' }],
               name: [{ required: true, message: '请输入', trigger: 'blur' }]

           },
           optionChoose:[], //选择对应
        //    选择的data
        chooseData:[]
        };
    },
    created() {
       this.metaList()
        // this.metaLists()
        this.height=this.$height(300)
        this.getMarcId()
        
    },
    methods: {
       
        // 编辑模板
        jump(val){
            console.log(val)
            this.$router.push({
                path:'/manage/MARC/mouldEdit',
                query:{info:JSON.stringify(val)}
            })
        },
        // 
        getMarcId(){
            this.ax.get('/manage/unit/system/systemSettings/marcTypeDetail',{params:{size:999,platformId : JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.options = res.content
                })
        },
        updata(e){
            this.loading();
            this.form =  e
            this.form.default=true
            this.ax.post('/manage/unit/system/systemSettings/marcTemplate', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                             this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTemplate`, res);
                            this.createModel = false
                        })
                        .catch(res => {
                            this.sloading();
                        });
        },
        // 修改
        editUpdate(e){
            // console.log(e)
            this.loading()
            this.edit=true
            // this.getInfo(e[0].id)editUpdate
            this.form = e[0]
            this.createModel=true
            //  this.getType()
            //  this.bus.$emit(`flash`);
            setTimeout(res=>{
                 this.sloading()
            },500)
            
        },
        // 查询
        getInfo(marcTemplateId){
            this.ax.get('/manage/unit/system/systemSettings/marcTemplateDetail',{params:{marcTemplateId}})
                .then(res=>{
                    // console.log(res)
                     this.chooseData =res.map(it=>{
                        return it.marcFieldDetailFather
                    })
                    // this.chooseData = res

                })
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            let ids = e.map(it=>{
                return  it.id
            }).join(',')
            this.ax.delete('/manage/unit/system/systemSettings/marcTemplate?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTemplate`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(){
            this.loadings = true
            this.edit=false
            this.createModel = true
            //  this.getType()
             this.bus.$emit(`flash`);
             setTimeout(res=>{
                 this.loadings = false
            },500)
        },
        getOptionsValue(options, key) {
            //  // console.log(options)
            let items = options.filter(it => {
                return it.key == key;
            });
            // // console.log(key)
            return (items && items.length && items[0].name) || '';
        },
        // 获取新增的Name
        getName(){
            this.options.map(it=>{
                if(it.id == this.form.marcTypeDetailId){
                   this.form.marcTypeDetailName  =  it.name 
                }
            })
        },
        // 关闭
        close(){
            this.form={}
            this.chooseData = []
        },
         // 新增保存
        save_mar(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                     this.sloading();
                     
                    this.ax
                        .post('/manage/unit/system/systemSettings/marcTemplate', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                             this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTemplate`, res);
                            this.createModel = false
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
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.MarcTemplate'}})
            .then(res=>{
               
                res.subs.map(it=>{
                    if(it.key=='createTime' || it.key == 'platformId' || it.key == 'marcType' || it.key=='marcTypeDetailId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                     if(it.key=='marcTypeDetailName'){
                        it.displayInList =true
                    }
                    
                })
                //  // console.log(res)
                this.meta = res
              
            })
        },

        // selectItem(index,row){
        //    Vue.set(row,'selected',!row.selected)
        //     if(row.selected){
        //         let i=0
        //         this.chooseData.map(it=>{
        //             // console.log(row.id)
        //             if(it.district != row.district || it.code != row.code){
        //                 i++
        //             }
        //         })
        //         // console.log(i)
        //         if(i==this.chooseData.length){
        //              this.chooseData.push(row);
        //         }
        //     }else{
        //         this.chooseData.map((it, index) => {
        //         if (it.district == row.district && it.code == row.code) {
        //             this.chooseData.splice(index, 1);
        //         }
        //     });
        //     }
                
        // },
                // 删除
        // handleDelete(index, row) {
        //      Vue.set(row,'selected',!row.selected)
        //     this.chooseData.map((it, index) => {
        //         if (it.id == row.id) {
        //             this.chooseData.splice(index, 1);
        //         }
        //     });
        // },
        metaLists(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.MarcFieldDetail'}})
            .then(res=>{
               res.delete = 'NONE'
               res.edit = 'NONE'
               res.insertable = false
                res.subs.map(it=>{
                    if(it.key=='code' || it.key=='note'){
                        it.displayInList=true
                        it.searchable=true
                    }else{
                        it.displayInList=false
                        it.searchable=false
                    }
                   
                    // if(it.key=='marcBookField'){
                    //     //   // console.log(this.options)
                    //       this.options =  it.searchOption
                    // //    .map(item=>{
                    // //          [item.key] = item
                    // //     })
                    // }
                })
                // // console.log(this.metas)
                this.metas = res
              
            })
        },
    }
};
</script>

<style>
.mould{
    overflow: auto;
    box-sizing: border-box;
}
.p-t-80{
    padding-top: 80px;
}
</style>
