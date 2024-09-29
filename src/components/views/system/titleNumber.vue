<template>
    <div>
         <List 
            :dataUrl="'/manage/unit/system/systemSettings/speciesNumberStore'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
            :chooseBox='true'
             @selected="selected"
            :searchName='{medium:"中文图书"}'
            @delete="deleteUpdate"
            @create="open" >
            <template slot="addition-actions" >
                    <el-button-group class="m-r-10">
                                <el-button type="primary" plain  @click="import_text" >导入种次号库</el-button>
                                <el-button type="primary" plain   @click="export_text" >导出种次号库</el-button>
                                 <el-button type="primary" plain   @click="reconstruction" >批量重建号库</el-button>
                                  <el-button type="primary" plain   @click="check" >种次号查缺</el-button>
                    </el-button-group>
             
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
        <el-dialog title="导入种次号" :visible.sync="show" width="30%" :close-on-click-modal='false' v-loading="loadinges" >
               <div class="margin_center w-70">
                   <el-upload
                    class="m-b-20"
                    ref="upload"
                    drag
                    action="/manage/unit/system/systemSettings/importSpeciesNumberStore"
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
                <el-select v-model="data.medium" placeholder="请选择" class="w-100 m-b-50"> 
                                <el-option
                                v-for="item in option"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                </el-select>
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

                        <el-form-item label="文献类型" prop='medium' >
                           <el-select v-model="form.medium" placeholder="请选择" class="w-100"> 
                                <el-option
                                v-for="item in option"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                            </el-select>
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
        <el-dialog title="种次号查缺" :visible.sync="showNumber" width="30%" :close-on-click-modal='false'  @close='close'>
                <div class="display_flex m-b-10" v-for="item of showNumberList" :key='item.id' >
                    <div class="w-40">分类号：{{item.classificationNumber}}</div>
                    <div class="w-60">{{item.str}}</div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showNumber = false">取 消</el-button>
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
              medium:'中文图书',
                platformId : JSON.parse(localStorage.getItem("user")).platform.id,
                cover:false
            },
            headers:{
                accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            fileList:[],
            options:[],
            option:[],
            upName:'',
            loadinges:false,
            showNumber:false,
            showNumberList:[],
            chooseVal:[],
           meta:'',
           show:false,
           loadings:false,
           createModel:false,
           form:{},
        
           rules:{
               serviceName: [{ required: true, message: '请输入', trigger: 'blur' }],
               country: [{ required: true, message: '请输入', trigger: 'blur' }],
               hort: [{ required: true, message: '请输入', trigger: 'blur' }],

               growthMode: [{ required: true, message: '请选择', trigger: 'change' }],
           }
        };
    },
    created() {
       
       this.getOption()
        .then(res=>{
           this.metaList(res)
        })
    },
    methods: {
       
         // 获取筛选
        getOption() {
           return new Promise(resolve=>{
                let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                size: 999
            };
            this.ax
                .get('/manage/unit/system/systemSettings/bookCatalogParameterTypeDetailForInsertMarcTypeDetail', { params })
                .then(res => {
                    this.option = res.content
                    resolve(res)
                });
           })
        },
        // 修改
        editUpdate(e){
            this.loadings = true
            this.form = e[0]
            this.createModel=true
            setTimeout(res=>{
                 this.loadings = false
            },500)
            
        },
         // 删除
        deleteUpdate(e){
            // console.log(e)
            this.loading()
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/system/systemSettings/speciesNumberStore?ids='+ids)
                .then(res=>{
                     this.sloading()
                     this.bus.$emit(`flash_/manage/unit/system/systemSettings/speciesNumberStore`, res);
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
            
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    

                    this.ax.post('/manage/unit/system/systemSettings/speciesNumberStore', this.form)
                        .then(res => {
                            this.bus.$emit(`flash_/manage/unit/system/systemSettings/speciesNumberStore`, res);
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
        metaList(ress){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.SpeciesNumberStore'}})
            .then(res=>{
                res.delete='DELETE'
                res.subs.map(it=>{
                    if(it.key=='createTime'|| it.key == 'platformId'){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='medium'){
                        it.searchOption = ress.content.map(its=>{
                            its.key = its.name
                            return its
                        })
                        it.displayInList =false
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
          this.loading()
            this.ax.get('/manage/unit/system/systemSettings/exportSpeciesNumberStore',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    var aEle = document.createElement("a");// 创建a标签
                    // blob = new Blob([content]); 
                    aEle.download = '种次号库';// 设置下载文件的文件名
                    //aEle.href = URL.createObjectUrl(blob);
                    aEle.href = res;// content为后台返回的下载地址
                    aEle.click();// 设置点击事件
                  this.sloading()
                }).catch(err=>{
              this.sloading()
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
                    this.ax.get('/manage/unit/system/systemSettings/rebuildingSpeciesNumberStore',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                        .then(res=>{
                            this.bus.$emit(`flash_/manage/unit/system/systemSettings/speciesNumberStore`, res);
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
            if(this.chooseVal.length==0 &&  this.chooseVal.length!=1 ){
                return this.$message({
                                type: 'error',
                                message: '请选择一个分类!'
                            });
            }
            let speciesNumberStoreId = this.chooseVal.map(it=>{
                return it.id
            }).join(',')
            this.ax.get('/manage/unit/system/systemSettings/speciesNumberStoreCheck',{params:{speciesNumberStoreId,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.showNumber =true
                    this.showNumberList = res.content
                    //  this.$alert(res.content, {
                    //     confirmButtonText: '确定',
                    //     callback: action => {
                            
                    //     }
                    //     });
                })
        },
        selected(val){
            this.chooseVal = val
        },
        // 开始上传
        upload(){
            if(!this.data.medium){
                return this.$message({
                                type: 'error',
                                message: '请选择文献类型!'
                            }); 
            }
            this.$refs.upload.submit();
        },
        handleAvatarSuccess(res){
           this.loadinges=false
            
            if(res.code==200){
                 this.bus.$emit(`flash_/manage/unit/system/systemSettings/speciesNumberStore`, res);
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
             this.loadinges=true
             //// console.log(file)
            let name=file.name       
            // if(this.upName == file.name ){
            //      this.loading=false
            //      this.$message.warning('重复上传')
            //     return false
            // }
            this.upName = file.name             
            let pass = name.indexOf('.txt')!==-1 
            if(!pass){
            this.$message.warning('上传文件类型错误')
             this.loadinges=false
            return false
            }
        },

    }
};
</script>

<style>
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
