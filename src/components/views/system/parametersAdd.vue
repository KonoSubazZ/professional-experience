 <template>
    <div class="container" >
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               截取内容
           </div>
            <div class="display_flex">
                <!-- <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
                <el-button type="primary" @click="back">返回</el-button>
            </div>
       </div>
       <div class="padding_20">
             <List 
                :dataUrl="'/manage/unit/system/systemSettings/classificationInterception?ceptionType=GENERAL'"
                :disableMeta='true'
                :tableMeta='meta'
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                :chooseBox='true'
                @create="open" >
            </List>
       </div>
          <!-- 弹框 -->
        <el-dialog title="出版社管理" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class=" m-b-30">

                        <el-form-item label="分类"  >
                            <el-input v-model="form.classificationFatherNumber" ></el-input>
                            <!-- <el-checkbox :checked="form.defaultSetting">是否默认批次</el-checkbox> -->
                        </el-form-item>

                          <el-form-item label="截取长度 " >
                            <el-input v-model="form.interceptionLength" ></el-input>
                            <!-- <el-checkbox :checked="form.defaultSetting">是否默认批次</el-checkbox> -->
                        </el-form-item>
                        
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar">确 定</el-button>
                </span>
        </el-dialog>

    </div>
</template>

<script>
import List from '../../view/List'
export default {
    components:{List},
    data() {
        return {
            bus: this.bus(this),
            meta:'',
            createModel:false,
            form:{},
            rules:{}
        };
    },
    created() {
        this.metaList()
    },
    methods: {
        open(){
           this. createModel=true
           
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/system/systemSettings/classificationInterception?ids='+ids)
                .then(res=>{
                     this.sloading()
                     this.bus.$emit(`flash_/manage/unit/system/systemSettings/classificationInterception?ceptionType=GENERAL`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        close(){
            this.form={}
        },
        editUpdate(e){
               this. createModel=true
              this.form=e[0]
        },
        save_mar(){
              this.loading()
            let params=this.form
             params.platformId=JSON.parse(localStorage.getItem('user')).platform.id
              params.ceptionType='GENERAL'
            this.ax.post('/manage/unit/system/systemSettings/classificationInterception',params)
                .then(res=>{
                    // console.log(res)
                      this.sloading()
                      this. createModel=false
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/classificationInterception?ceptionType=GENERAL`, res);
                    this.$message.success('保存成功');
                })
                .catch(res=>{
                      // console.log(res)
                })
        },
        metaList(){
            this.meta={
                edit:'EDIT',
                delete:'DELETE',
                insertable:true,
                subs:[
                    {name:'分类',key:'classificationFatherNumber',displayInList:true},
                    {name:'截取长度', key:'interceptionLength',displayInList:true}
                ]
            }
        },
         
    }
};
</script>

<style>

</style>
 