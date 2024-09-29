 <template>
    <div class="container Textcolor"
       
        >
        <List
            :data="tableData"
            :disableMeta="true"
            :tableMeta="meta"
            ref="list"
           
            :disableTableAction='true'
            :isSort="true"
        >
            <template slot="addition-actions">
                <div @click="edit('TOLL')" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/payFor.png" class="btn_img" />
                    <div class="f-s-14">修改标签</div>
                </div>

                <div @click="del('REFUND')" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/payOut.png" class="btn_img" />
                    <div class="f-s-14">标签销毁</div>
                </div>
            </template>
            <template slot="func">
                <div class="display_flex">
                    <el-input placeholder="请将书放入平板读卡器" v-model="form.rfId" clearable class="m-r-10"></el-input>

                    <el-input placeholder="请扫描文献条码" v-model="form.barCode" clearable class="m-r-10"  ref="barCode"  @keyup.enter.native="search"></el-input>

                    <el-button type="primary" @click="search">转换</el-button>
                </div>
            </template>
        </List>


        <div class="models">

        </div>
    </div>
</template>

<script>
import List from '../../../view/List';
import ticketUtil from '../../../../utils/ticket';
export default {
    components: { List },
    
    data() {
        return {bus: this.bus(this),
            time:'',
            meta: '',
            loading: true,
            createModel: false,
            tableData: {
                 content:[]
            },
            form: {
                rfId:''
            },
            options: [],
            rules: {
                type: [{ required: true, message: '请选择', trigger: 'change' }],
                name: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.metaList();
           this.$blue.startReader({type:'USB',com:'COM5'},this.readBookId)  //读标签
       
    },
    beforeDestroy(){
      
        this.$blue.closeReader()
       
    },
    methods: {
        
       readBookId(e){
        //    // console.log(e)
            if(e==null){
                return
            }
            if(this.form.rfId == e ){
                clearTimeout(this.time)
                this.time = setTimeout(res=>{
                    this.loading =true
                    this.form.rfId=''
                    this.form.barCode=''
                },3000)
            }else{
                 this.loading =false
                 this.form.rfId = e
              this.$refs['barCode'].focus()
            }
        },
        search(){
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/workstation/labelReplacement/label',this.form)
                .then(res=>{
                    // console.log(res)
                    let obj =res.book
                    obj.info = res.labelStatus
                    let arr = this.tableData.content
                    arr.unshift(obj)
                    this.tableData ={
                        content:arr
                    }
                    
                    this.form.barCode=''
                })
        },
        edit() {
            if(this.loading){
                  return  this.$message.warning('请将书放入平板读卡器')
            }else{
               this.$prompt('请扫描文献条码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
        
                    }).then(res=>{
                           let params={
                                 barCode:res.value,
                                 rfId:this.form.rfId,
                                 platformId:JSON.parse(localStorage.getItem("user")).platform.id
                           }
                        
                        this.ax.post('/manage/unit/workstation/labelReplacement/updateLabel',params)
                            .then(res=>{
                                 let obj = res.book
                                    obj.info = res.labelStatus
                                    let arr = this.tableData.content
                                    arr.unshift(obj)
                                    this.tableData ={
                                        content:arr
                                    }
                                    
                                   
                            })

                    }).catch(() => {
                      
                });
            }
        },
        del() {
             if(this.loading){
                return  this.$message.warning('请将书放入平板读卡器')

            }else{
                 this.$confirm('是否确认销毁当前书本标签?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                       
                        this.ax.post(`/manage/unit/workstation/labelReplacement/deleteLabel?platformId=${JSON.parse(localStorage.getItem("user")).platform.id}&rfid=${this.form.rfId}`)
                            .then(res=>{
                                this.$message.success('销毁成功')
                            })
                    }).catch(() => {
                          
                    });
            }
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then((res) => {
                res.insertable = false;
                res.subs = this.generateMeta(res.subs, 'info', '转换情况', true, false);
                res.subs.map((it) => {
                    it.displayInList = false;
                    it.searchable = false;
                    if (
                        it.key == 'barCode' ||
                        it.key == 'price' ||
                        it.key == 'publicationDate' ||
                        it.key == 'collectionPlaceName' ||
                        it.key == 'rackName' ||
                        it.key == 'bookStatus'
                    ) {
                        it.displayInList = true;
                    }
                    if(it.key=='info'){
                        it.displayInList = true;
                        it.searchOption=[
                            {key:'1',name:'已转换',color:'#267FF9'},
                            {key:'2',name:'未转换',color:'#FF0000'},
                            {key:'3',name:'已修改',color:'#267FF9'},
                            {key:'4',name:'未修改',color:'#FF0000'},
                        ]
                    }
                });

                


                ticketUtil.sortList(res, 'barCode', 'price', 'publicationDate', 'collectionPlaceName', 'rackName', 'bookStatus', 'info');

              

                res.subs.sort((a, b) => {
                    return a.sort - b.sort;
                });

               
                this.meta = res;
            });
        }
    }
};
</script>

<style >
.Textcolor .el-loading-spinner .el-loading-text,.Textcolor .el-loading-spinner i{
    color:#fff;
}

</style>
