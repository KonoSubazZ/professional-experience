 <template>
    <div >
         <List 
            :dataUrl="'/manage/unit/opac/auditManagement/readerRecommend'"
            :disableMeta='true'
            :tableMeta='meta'
            ref="list"
            :isHeaderHeigt='30'
            :chooseBox='true'
            @selected='selected'
             >
            <template slot="addition-actions">
                <!-- <div class="text_center cursor m-r-20" @click="passed">
                    <img src="../../../../assets/img/right.png" class="btn_img" />
                    <div class="f-s-14">通过</div>
                </div>
                 <div class="text_center cursor m-r-20"  @click="failed">
                    <img src="../../../../assets/img/false.png" class="btn_img" />
                    <div class="f-s-14">拒绝</div>
                </div> -->
                <el-button-group>
                                 <el-button type="primary" plain icon='el-icon-circle-check' @click="passed" >通过</el-button>
                                <el-button type="primary" plain icon="el-icon-circle-close"  @click="failed" >拒绝</el-button>
                    </el-button-group>
            </template>
             <template slot="addition-table-actions" slot-scope="scope">
                                      <el-button
                                        type="text"
                                        v-if="scope.item.row.approvalStatus=='PENDING_REVIEW'"
                                        class="m-r-10 color_dan"
                                          @click="fail(scope.item.row)"
                                    >拒绝</el-button>
                                      <el-button
                                        type="text"
                                        v-if="scope.item.row.approvalStatus=='PENDING_REVIEW'"
                                        class="m-r-10"
                                         @click="pass(scope.item.row)"
                                    >通过</el-button>
                            
                                
            </template>
        </List>
    </div>
</template>

<script>
import List from '../../../view/List'

export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'',
           chooseBox:[]
        };
    },
    created() {
       this.metaList()
    },
    methods: {
        selected(val){
            this.chooseBox = val
        },
        pass(val){
              this.loading()
            let params ={
                approvalStatus:'PASS',
                readerRecommendId:val.id
            }
            this.ax.post('/manage/unit/opac/auditManagement/readerRecommend',params)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/auditManagement/readerRecommend`, res);
                    this.$message.success('操作成功');
                })
        },
        passed(){
            if(this.chooseBox.length==0){
                return  this.$message.success('请选择单个荐购');
            }
            this.pass(this.chooseBox[0])
        },
        failed(){
             if(this.chooseBox.length==0){
                return  this.$message.success('请选择单个荐购');
            }
            this.fail(this.chooseBox[0])
        },
        fail(val){
            this.loading()
            let params ={
                approvalStatus:'REJECTED',
                readerRecommendId:val.id
            }
            this.ax.post('/manage/unit/opac/auditManagement/readerRecommend',params)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/auditManagement/readerRecommend`, res);
                    this.$message.success('操作成功');
                })
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.ReaderRecommend'}})
            .then(res=>{
                res.insertable=false
                res.export='NONE'
                res.edit='NONE'
                res.delete='NONE'
                res.subs.map(it=>{
                    if(  it.key == 'platformId'|| it.key == 'readerNumber'||it.key == 'isbn'||it.key == ''||it.key == 'publisher' ||it.key == 'firstResponsible' ||it.key == 'readerId'  ){
                        
                        it.searchable=false
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
