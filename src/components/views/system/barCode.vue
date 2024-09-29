<template>
    <div>
         <List 
            :dataUrl="'/manage/unit/system/systemSettings/barCode'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :chooseBox='true'
            @create="open" >
        </List>
        <!-- 弹框 -->
        <el-dialog title="条码设置管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
           
                        <form-data :row='1'  ref="form" :model='form' :list='list'  :rule ='rules' @getForm='getForm'></form-data>
                        
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List'
import formData from '../../view/form'
export default {
     components:{List,formData},
    data() {
        return {bus: this.bus(this),
           meta:'',
           loadings:false,
           createModel:false,
           form:{
               
           },
           list:[
               {name:'文献类型',id:'bookCatalogParameterTypeDetailId',type:'select',options:[],relation:'bookCatalogParameterTypeDetailName'},
               {name:'条码长度',id:'length'},
               {name:'增涨方式',id:'growthMode',type:'select',options:[]}
           ],
           rules:{
               length: [{ required: true, message: '请输入', trigger: 'blur' }],
            //    country: [{ required: true, message: '请输入', trigger: 'blur' }],
            //    hort: [{ required: true, message: '请输入', trigger: 'blur' }],
                bookCatalogParameterTypeDetailId:[{ required: true, message: '请选择', trigger: 'change' }],
               growthMode: [{ required: true, message: '请选择', trigger: 'change' }]
           }
        };
    },
    created() {
       this.metaList()
       this.getBarCode()
    },
    methods: {
        // 修改
        editUpdate(e){
            // console.log(123)
            // this.loadings = true
            this.loading()
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                //  this.loadings = false
                 this.sloading()
            },500)
            
        },
        getForm(val){
            this.form =val
        },
        getBarCode(){
            let params={
                bookCatalogParameterType:'MEDIUM',
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                size:999
            }
            this.ax.get('/manage/unit/system/systemSettings/bookCatalogParameterTypeDetailForInsertBarCode',{params})
                .then(res=>{
                    // console.log(res)
                    this.list[0].options = res.content
                })
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/system/systemSettings/barCode?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/barCode`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(){
            this.createModel = true
              this.form={}
        },
        // 
        close(){
            this.form={}
        },
         // 新增保存
        save_mar(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].$refs[formName].validate(valid => {
                if (valid) {
                     this.sloading();

                    this.ax.post('/manage/unit/system/systemSettings/barCode', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/system/systemSettings/barCode`, res);
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
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.BarCode'}})
            .then(res=>{
                res.delete='DELETE'
                res.subs.map(it=>{
                    if(it.key=='createTime'|| it.key == 'platformId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='growthMode'){
                        this.list[2].options = it.searchOption.map(it=>{
                            return {name:it.name,id:it.key}
                        })
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
