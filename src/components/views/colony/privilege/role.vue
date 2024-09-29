<template>
    <div>
         <List 
            :dataUrl="'/manage/auth/role'"
            @meta='metaList'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :chooseBox='true'
            @create="dialogFormVisible=true" >
        </List>
        <!-- 弹框 -->
        <el-dialog title="角色设置" :visible.sync="dialogFormVisible" width="70%" :close-on-click-modal='false' @close='close'>
            <el-form :model="form"   :rules="rules" ref="form">
                <el-form-item  >
                    <div>角色名称</div>
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item>
                     <div>角色权限</div>
                    <permissions-list :tableData='permissionsLists' @change='edit'></permissions-list>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';
import permissionsList from '../../../view/permissionsList';
// import bus from '../../common/bus';
export default {
     components:{List,permissionsList},
    data() {
        return {bus: this.bus(this),
            // 表单
          
           form:{
               permissions:[]
           },
        //    状态是否确定
           isIndeterminate:true,
        //    弹框
           dialogFormVisible:false,
        //    权限表
           permissionsLists:[],
        //    保存清空状态的
           blockList:[],
        //   选择的权限
        checkAll:[],
        rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        };
    },
    created() {
         // 集群   cluster-united
                if(JSON.parse(localStorage.getItem("user")).type==1){
                    this.getPermission('cluster-united') 
                    .then(res=>{
                      this.getPermission('default')
                    })
                }else{
                     this.getPermission('cluster-unit')   //子平台
                     .then(res=>{
                            this.getPermission('default')
                        })
                }
       
            
    },
    methods: {
        // 获取权限
        getPermission(tag){
            return new Promise(resolve=>{
                    this.ax.get('/manage/auth/permission',{params:{tag}})
                        .then(res=>{
                            if(JSON.parse(localStorage.getItem("user")).type==2){
                                this.isCon(res)
                            }else{
                                 this.permissionsLists = this.permissionsLists.concat(res)
                            }
                            resolve()
                        })
            })
            
        },
        // 遍历是否拼接
        isCon(val){
            if(this.permissionsLists.length==0){
                this.permissionsLists = val
            }else{
                this.permissionsLists.map(it=>{
                    it.sub.map(res=>{
                        val.map(ite=>{
                            if(res.name == ite.name){
                                res.sub = res.sub.concat(ite.sub)
                            }
                        })
                    })
                })
            }
            // // console.log( this.permissionsLists)
        },
        // 选择权限
        edit(e){
            // console.log(e)
            this.checkAll = e
        },
        // close
        close(){
            
            this.form = {
               permissions:[],
               name:null
           }
          this.allCheck(this.permissionsLists)
           this.dialogFormVisible=false
        },
        // 新增保存
        save(formName) {

            this.loading()
            this.form.permissions=[]
            this.pushSelect(this.checkAll)
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.ax.post('/manage/auth/role', this.form)
                        .then(res => {
                             this.sloading()
                           
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/auth/role`, res);
                            this.close()
                        })
                        .catch(res => {});
                } else {
                     this.sloading()
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        // 权限遍历
        pushSelect(val){

            val.map(item=>{
                if(item.permissions.length>0){
                    item.permissions.map(it=>{
                        if(it.check){
                            this.form.permissions.push(it)
                            it.check = false
                        }
                    })
                }else{
                   this.pushSelect(item.sub)
                }
            })
        
        },
        // 修改
        editUpdate(e){
            // console.log(e)
            this.form = e[0]
            this.choosePermissionsList(this.permissionsLists)
            this.dialogFormVisible = true
        },
        // 设置权限
        choosePermissionsList(val){
            // 已有的选择遍历   
         
            val.map(it=>{
                let count=0
                if(it.permissions.length>0){

                            this.form.permissions.map(res=>{
                                  
                                 it.permissions.map(item=>{
                                  
                                     if(res.id == item.id){
                                         count++
                                        item.check = true
                                     }
                                 })
                                  if(count==it.permissions.length){
                                        it.checkedAll = true
                                        
                                    }
                               
                            })
                             
                       
                           
                            
                             
                             
                        
                }else{
                    this.choosePermissionsList(it.sub)
                }
               
            })
            
        },
        // 全部设置未选择
        allCheck(val){
            // // console.log(val)
            val.map(it=>{
            //    // console.log(it)
                if(it.permissions.length>0){
                                 it.checkedAll = false
                                 it.permissions.map(item=>{
                                  
                                     
                                        
                                        item.check = false
                                     
                                 })
                            

                }else{
                    this.allCheck(it.sub)
                }
               
            })
        },
        // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            this.ax.delete('/manage/auth/role?ids='+e[0].id)
                .then(res=>{
                     this.sloading()
                     this.bus.$emit(`flash_/manage/auth/role`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        // meta
        metaList(val){
            // // console.log(val)
            val.subs.map(it=>{
                if(it.key=='createTime'){
                    it.searchable = false
                }
            })
        },
    }
};
</script>

<style>

</style>
