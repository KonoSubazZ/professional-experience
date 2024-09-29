<template>
    <div class="container">
        <div>
            <List
                :dataUrl="'/manage/unit/catalog/collectionHandling/bookForCollectionAllocation'"
                :isSort="true"
                :chooseBox="true"
                :data='data'
                :disableTableAction="true"
                @selected="selected"
                @search='search'
                :disableMeta="true"
                :isHeaderHeigt='30'
                :tableMeta="meta"
            >
                <template slot="addition-actions" class="display_flex start" >
                    <el-button-group>
                                    <el-button type="primary" plain @click="del" icon="el-icon-minus">删除导入</el-button>
                                    <el-button type="primary" @click="showUp=true" plain icon="el-icon-upload2">导入文件</el-button>
                                     <el-button type="primary" @click="doBatch" plain icon="el-icon-sort">馆藏地调拨</el-button>
                    </el-button-group>   
                </template>
            </List>
        </div>

        <!-- 弹框 -->
        <el-dialog title="馆藏地调拨" :visible.sync="openDefa" width="25%" :close-on-click-modal="false">
            <el-form :model="defa" :rules="rules" ref="defa" label-width="124px" class="m-b-30">
                <el-form-item label="默认藏址" prop="collectionPlaceId" class="m-r-10">
                    <el-select
                        v-model="defa.collectionPlaceId"
                        clearable
                        placeholder="请选择"
                        class="w-100"
                    >
                        <el-option
                            v-for="item in collectionPlace"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openDefa = false">取 消</el-button>
                <el-button type="primary" @click="save_params('defa')">确 定</el-button>
            </div>
        </el-dialog>

                 <!-- 弹框 -->
         <el-dialog title="导入条码" :visible.sync="showUp" width="30%" :close-on-click-modal='false'  >
                <up-load @getInfo='getText' :show="showUp"></up-load>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List';
import upLoad from '../textUp';

export default {
    components: { List,upLoad },
    data() {
        return {bus: this.bus(this),
            collectionPlace: [],
            defa: {},
            showUp:false,
            rules: {
                collectionPlaceId: [{ required: true, message: '请选择', trigger: 'change' }],
            },
            data:{},
            url: '',
            searchInfo:{},
            meta: '',
            bookIds:[],
            openDefa:false
        };
    },
    created() {
        this.getPlace().then(res => {
            this.collectionPlace = res.content.map(it => {
                let arr = {
                    key: it.id,
                    name: it.name,
                    color: null
                };
                return arr;
            });
            this.getMeta();
        });
    },
    methods: {
        // doBatchs(){
        //     let params={
        //        collectionBatchResList: this.searchInfo,
        //        collectionBatchUpdateReq
        //     }
        //     this.ax.post('/manage/unit/catalog/bibliography/collectionBatch')
        // },
         getText(val) {
            // console.log(val);
            val.data = val.data.split(/[\r\n]/g)
            val.data = val.data.filter(it=>{
                     return it!=''
            })
            this.codesUp =  val.data.join(',')
            if(val.cover){
                 this.getError(val.data)
            }else{
                 this.getList()
            }
        },
        getError(barCodes){
            let params={
                barCodes,
                platformId :JSON.parse(localStorage.getItem("user")).platform.id
            }
            this.ax.post('/manage/unit/catalog/collectionHandling/bookIs',params)
                .then(res=>{
                    if(res.length>0){
                        let code = res.join('\n')
                        this.errorCode += code
                        const h = this.$createElement;
                        this.$msgbox({
                        title: '提示',
                        message: h('p', null, [
                            h('span', null, '条码 '),
                            h('i', { style: 'color: red' }, code),
                            h('span', null, '错误，是否继续'),
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        }).then(() => {
                            // // console.log(code)
                            this.getList()
                            }).catch(() => {
                                
                            });
                    }else{
                        this.getList()
                    }
                    
                })
        },
        getList(){
            let params=this.searchInfo
           if(this.codesUp){
                params.barCodes= this.codesUp
           }
            this.ax.get('/manage/unit/catalog/collectionHandling/bookForCollectionAllocation',{params})
                .then(res=>{
                    this.data =res
                    this.showUp=false
                })
        },
        search(val){
            // console.log(val)
            this.searchInfo =val
            this.getList()
        },
        del(){
            this.codesUp=''
             this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/bookForCollectionAllocation`)
        },




        selected(val) {
            // console.log(val);
            this.bookIds = val.map(it=>{
                // console.log(it)
                return it.id
            })
        },
        doBatch() {
            // if(this.bookIds.length==0){
            //     return this.$message.error('请选择书本');
            // }
            this.openDefa=true
        },
        // 获取馆藏地
        getPlace() {
            let platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            return this.ax.get('/manage/unit/general/collectionPlace', {
                params: { size: 9999, platformId ,type:'LITERATURE'}
            })
        },
        save_params(formName){
            // this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {
                        bookIds:this.bookIds,
                        collectionPlaceId:this.defa.collectionPlaceId,
                        getBookForCollectionAllocationReq:this.searchInfo
                    }
                  this.ax.post('/manage/unit/catalog/collectionHandling/bookForCollectionAllocation',params)
                    .then(res=>{
                        this.openDefa = false
                        this.$message.success('调拨成功');
                        this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/bookForCollectionAllocation`)
                    })
                } else {
                     this.sloading()
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });    
        },
        // 获取meta
        getMeta() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
                // console.log(res);
                res.insertable = false;
                res.edit = 'NONE';
                res.delete = 'NONE';
                res.subs = [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'collectionPlaceName',
                        name: '馆藏地址'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'collectionPlaceId',
                        name: '馆藏地址',
                        searchOption: this.collectionPlace
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'barCode',
                        name: '条形码'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'isbn',
                        name: 'ISBN'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'callNumber',
                        name: '索书号'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        name: '题名'
                    },

                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        name: '出版社'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publicationDate',
                        name: '出版日期'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'bookStatus',
                        name: '状态',
                        searchOption: [
                            { key: 'InCollection', name: '在馆', color: '' },
                            { key: 'LEND', name: '借出', color: '' },
                            { key: 'CULLING', name: '注销', color: '' },
                            { key: 'LOST', name: '丢失', color: '' },
                            { key: 'DAMAGE', name: '损坏', color: '' }
                        ]
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'price',
                        name: '价格'
                    },
                   
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'startBarCode',
                        name: '文献条码开始',
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'endBarCode',
                        name: '文献条码结束',
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'startCallNumber',
                        name: '索书号开始',
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'endCallNumber',
                        name: '索书号结束',
                        searchable: true
                    }
                ];

                this.meta = res;
            });
        }
    }
};
</script>

<style scoped>

</style>
