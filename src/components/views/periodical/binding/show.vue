 <template>
    <div class="container">       
            <List
                :dataUrl="dataUrl"
                :disableMeta="true"
                :tableMeta="meta"
                @selected ='selected'
                @delete='del'
                 ref="list"
                :disableTableAction='true'
                :style="$height(170)"
                :chooseBox='true'
            >
            <template slot="addition-actions" >             
                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>

            </template>
            </List>

              <!-- 弹框 -->
        <el-dialog
            title="装订"
            :visible.sync="createModel"
            width="30%"
            :close-on-click-modal="false"
            @close="close">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="100px"
                class=" m-b-30"
            >
            
                    <el-form-item label="装订批次" prop="deliveryUnit" class="w-100">
                       <el-select v-model="form.bindingId" placeholder="请选择" class="w-100" @change="getName(form.bindingId,batch)">
                            <el-option
                            v-for="item in batch"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="装订份数" prop="year" class="w-100">
                        <el-input v-model="form.bindingNumber"  class="w-100"></el-input>
                    </el-form-item>

                    <el-form-item label="馆藏地点" prop="cycleNumber" class="w-100">
                        
                        <el-select v-model="form.collectionPlaceId" placeholder="请选择" class="w-100" @change="getPlaceName(form.collectionPlaceId,place)">
                            <el-option
                            v-for="item in place"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
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
import List from '../../../view/List';
import ticketUtil from '../../../../utils/ticket'
export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            dataUrl:'/manage/unit/journal/journalBookingBinding/journalBookingDetailById',
            chooseData:[],
            place:[],
            batch:[],
            form:{},
            rules:{},
            journalBookingId:'',
            createModel:false,
        };
    },
    created() {
        this.journalBookingId = this.$route.query.id
        this.dataUrl = '/manage/unit/journal/journalBookingBinding/journalBookingDetailById?&journalBookingId='+ this.journalBookingId
        this.getCycle();
        this.getPlace()
        this.getBatch()

      
    },
    methods: {
       
        // 获取地点
        getPlace(){
            this.ax.get('/manage/unit/general/collectionPlace',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id,type:'LITERATURE'}})
                .then(res=>{
                    // console.log(res)
                    this.place = res.content
                })
        },
        //获取批次
        getBatch(){
              this.ax.get('/manage/unit/general/batch',{params:{type:'BINDING',size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    this.batch = res.content
                })
        },
        // getName
        getName(id,row){
            row.map(it=>{
                if(it.id == id ){
                    this.form.bindingName = it.name
                }
            })
        },
        close(){
            this.form={}
        },
        // 删除
        del(e) {
            this.loading();
            let ids=e.map(it=>{
                return it.id
            }).join(',')
            this.loading();
            this.ax
                .delete('/manage/unit/journal/journalBookingBinding/journalBookingDetail?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/journal/journalBookingBinding/searchBindingJournalBookingDetail?journalBookingId=${this.journalBookingId}`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
         // getPlaceName
        getPlaceName(id,row){
            row.map(it=>{
                if(it.id == id ){
                    this.form.collectionPlaceName = it.name
                }
            })
        },
         // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/general/cycle',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                  let arr = res.content.map(it=>{
                       return {name:it.name,key:it.id}
                   })
                    this.metaList(arr);
                })
        },
        metaList(arr) {
            this.meta={
                 subs:[
                     {name:'ISSN',key:'issn',displayInList:true,searchable:true},
                     {name:'刊名',key:'title',displayInList:true,searchable:true},
                     {name:'分类号',key:'classificationNumber',displayInList:true},
                     {name:'责任者',key:'responsible',displayInList:true},
                     {name:'价格',key:'price',displayInList:true},
                      {name:'复本',key:'copy',displayInList:true},
                      {name:'期数',key:'cycleNumberDisplay',displayInList:true},
                     {name:'订购年份',key:'year',displayInList:true,searchable:true},
                     {name:'周期名称',key:'cycleName',displayInList:true},
                     {name:'周期名称',key:'cycleId',searchable:true,searchOption:arr},

                     {name:'装订份数',key:'bindingNumber',displayInList:true},

                     {name:'是否装订',key:'bindingStatus',displayInList:true,searchOption:[
                         {name:'未装订',key:0,color:''},
                         {name:'已装订',key:1,color:''},
                     ]},
                      {name:'装订日期',key:'bindingTime',displayInList:true,type:'TIMESTAMP'},
                    
                     
                 ]
            }
        },
        save(){
            if(this.chooseData.length<1 ){
                return this.$message.error('最少选择一项');
               
            }
             this.createModel =true
        },
        // 新增保存
        save_mar(formName) {
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/journal/journalBookingBinding/journalBookingDetail', {jbDetailList:this.chooseData,journalBookingDetailBindingMenuRes:this.form})
                            .then(res => {
                                this.sloading();
                                this.createModel =false
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/journal/journalBookingBinding/searchBindingJournalBookingDetail?journalBookingId=${this.journalBookingId}`, res);
                                // this.back()
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
        selected(e){
            // console.log(e)
            this.chooseData = e
        },
    }
};
</script>

<style>
</style>
