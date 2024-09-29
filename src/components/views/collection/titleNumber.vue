<template>
    <div class="container">
         <List 
            :dataUrl="'/manage/unit/catalog/collectionHandling/speciesNumberStore'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            @selected='selected'
            ref="list"
            @delete="deleteUpdate"
            @create="open" >
            <template slot="addition-actions" >
                            <div  @click="import_text"  class="text_center cursor m-r-20" >
                                <img src="../../../assets/img/import.png" class="btn_img" >
                                <div class="f-s-14">导入种次号库</div>
                            </div>
            
                            <div  @click="export_text" class="text_center cursor  m-r-20">
                                <img src="../../../assets/img/export.png" class="btn_img" >
                                <div class="f-s-14">导出种次号库</div>
                            </div>

                            <div  @click="reconstruction" class="text_center cursor  m-r-20">
                                <img src="../../../assets/img/reconstruction.png" class="btn_img" >
                                <div class="f-s-14">批量重建号库</div>
                            </div>

                             <div  @click="check" class="text_center cursor  m-r-20">
                                <img src="../../../assets/img/check.png" class="btn_img" >
                                <div class="f-s-14">种次号查缺</div>
                            </div>
                                
            </template>

        </List>
        <!-- 弹框 -->
        <el-dialog title="种次号设置管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="分类号" prop='classificationNumber' >
                            <el-input v-model="form.classificationNumber" ></el-input>
                        </el-form-item>

                        <el-form-item label="最大种次号" prop='maxSpeciesNumber' >
                            <el-input v-model="form.maxSpeciesNumber" ></el-input>
                        </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>

         <!-- 弹框 -->
        <el-dialog title="导入种次号" :visible.sync="show" width="30%" :close-on-click-modal='false'  >
               <div class="margin_center w-70">
                   <el-upload
                    class="m-b-20"
                    ref="upload"
                    drag
                    action="/manage/unit/catalog/collectionHandling/importSpeciesNumberStore"
                    :auto-upload='false'
                    :data='data'
                    :file-list="fileList"
                    :before-upload='isText'
                    :on-success="handleAvatarSuccess"
                    :headers='headers'
                   >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>,仅支持TXT文件</div>
                </el-upload>
                <div class="display_flex end">
                    <div class="upTitle w-20">重复覆盖：</div>
                    <el-radio-group v-model="data.cover" class="w-60">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <div class="cursor color_par" @click="upload">开始导入</div>
                </div>
               </div>
                
        </el-dialog>
        
        <!-- 弹框 -->
        <el-dialog title="种次号设置管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="分类号" prop='classificationNumber' >
                            <el-input v-model="form.classificationNumber" ></el-input>
                        </el-form-item>

                        <el-form-item label="最大种次号" prop='maxSpeciesNumber' >
                            <el-input v-model="form.maxSpeciesNumber" ></el-input>
                        </el-form-item>

                </el-form>
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
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
            // 上传 
            data:{
                platformId : JSON.parse(localStorage.getItem("user")).platform.id,
                cover:false
            },
            headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            fileList:[],
            upName:'',
           
            chooseVal:[],
           meta:'',
           show:false,
          
           createModel:false,
           form:{},
           options:[],

           rules:{
               serviceName: [{ required: true, message: '请输入', trigger: 'blur' }],
               country: [{ required: true, message: '请输入', trigger: 'blur' }],
               hort: [{ required: true, message: '请输入', trigger: 'blur' }],

               growthMode: [{ required: true, message: '请选择', trigger: 'change' }],
           }
        };
    },
    created() {
       this.metaList()
    },
    methods: {
        // 修改
        editUpdate(e){
            // this.loadings = true
            this.loading()
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                 this.sloading()
                //  this.loadings = false
            },500)
            
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            this.ax.delete('/manage/unit/catalog/collectionHandling/speciesNumberStore?ids='+e[0].id)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/speciesNumberStore`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // 新增打开
        open(){
            this.createModel = true
        },
        // 
        close(){
            this.form={}
        },
         // 新增保存
        save_mar(formName) {
            this.loading()
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                     this.sloading();

                    this.ax.post('/manage/unit/catalog/collectionHandling/speciesNumberStore', this.form)
                        .then(res => {
                            this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/speciesNumberStore`, res);
                            this.sloading();
                            this.$message.success('保存成功');
                            
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
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.SpeciesNumberStore'}})
            .then(res=>{
               
                res.subs.map(it=>{
                    if(it.key=='createTime'|| it.key == 'platformId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='growthMode'){
                        this.options = it.searchOption
                    }
                })
                 // console.log(res)
                this.meta = res
            })
        },
        // import_text  导入
        import_text(){
            this.show=true
        },
        // export_text  导出
        export_text(){
            this.ax.get('/manage/unit/system/systemSettings/exportSpeciesNumberStore',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    var aEle = document.createElement("a");// 创建a标签
                    // blob = new Blob([content]); 
                    aEle.download = '种次号库';// 设置下载文件的文件名
                    //aEle.href = URL.createObjectUrl(blob);
                    aEle.href = res;// content为后台返回的下载地址
                    aEle.click();// 设置点击事件
                })
        },
        // 重建
        reconstruction(){
            this.$confirm('是否批量重建种次号?本操作将清空所有种次号,然后插入所有馆藏的最大种次号!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.loading()
                    this.ax.get('/manage/unit/catalog/collectionHandling/rebuildingSpeciesNumberStore',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                        .then(res=>{
                            this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/speciesNumberStore`, res);
                             this.sloading()
                             
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                        })
                
                }).catch(() => {
                     
            });
        },
        check(){
            // debugger
            // console.log(this.chooseVal)
            if(this.chooseVal.length==0  ||  this.chooseVal.length!=1 ){
                return this.$message({
                                type: 'error',
                                message: '请选择一个分类!'
                            });
            }
            let speciesNumberStoreId = this.chooseVal.map(it=>{
                return it.id
            }).join(',')
            this.ax.get('/manage/unit/catalog/collectionHandling/speciesNumberStoreCheck',{params:{speciesNumberStoreId}})
                .then(res=>{
                     this.$alert(res, {
                        confirmButtonText: '确定',
                        callback: action => {
                            
                        }
                        });
                })
        },
        selected(val){
            // console.log(val)
            this.chooseVal = val
        },
        // 开始上传
        upload(){
            this.$refs.upload.submit();
        },
        handleAvatarSuccess(res){
           this.loading=false
            
            if(res.code==200){
                 this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/speciesNumberStore`, res);
                 this.show=false
                 this.fileList=[]
                             this.$message({
                                type: 'success',
                                message: '导入成功!'
                            }); 
            }else{
                 this.fileList=[]
                this.$message.error(res.msg)
            }
        },
        isText(file){
             this.loading=true
             //// console.log(file)
            let name=file.name       
            if(this.upName == file.name ){
                 this.loading=false
                 this.$message.warning('重复上传')
                return false
            }
            this.upName = file.name             
            let pass = name.indexOf('.txt')!==-1 
            if(!pass){
            this.$message.warning('上传文件类型错误')
             this.loading=false
            return false
            }
        },

    }
};
</script>

<style scoped>
.margin_center{
    margin: 0 auto;
}
.upTitle{
height:1.25rem;
font-size:0.88rem;
font-weight:normal;
line-height:1.25rem;
color:#999999;
}
</style>
