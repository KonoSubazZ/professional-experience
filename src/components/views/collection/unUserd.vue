<template>
    <div>
        <div class="container " >
            
                       
                            <List
                                :dataUrl="'/manage/unit/catalog/collectionHandling/unusedBookBase'"
                                :disableMeta="true"
                                :tableMeta="meta"
                                @edit="editBook"
                                ref="list"
                                :editName='"查看"'
                                @delete="deleteBook"
                            >
                               <template slot="addition-actions" class="display_flex">
                                   <el-button type="primary" plain @click="delAll" icon="el-icon-remove-outline">剔除全部未利用书目</el-button>
                                     <!-- <div @click="delAll" class="text_center cursor  ">
                                        <img src="../../../assets/img/delBlock.png" class="btn_img" />
                                        <div class="f-s-14 noWrap">剔除全部未利用数目</div>
                                    </div> -->
                                </template> 
                            </List>
                  

         </div>
        <el-dialog
            title="MARC信息"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="40%"
            >
           <div>
                    <div class="border-1 w-100">
                        <div class="display_flex start" v-for="(item,i) of MarcList" :key="i">
                                <div class=" w-10 m-r-20">{{item.code}}</div>
                                <div class=" w-10 m-r-20">{{item.indicatorOne}}{{item.indicatorTwo}}</div>
                                <div class="w-80">{{item.content}}</div>
                        </div>
                    </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List';
import fromData from '../../view/form'

const qs = require('qs');
export default {
    components: {
        List,
        fromData
    },
    data() {
        return {bus: this.bus(this),
            meta:'',
            tableData:[],
            MarcList:'',
            dialogVisible:false
        };
    },
    created() {
       
       
        this.metasList()
        document.onkeydown = e => {
            let key = window.event.keyCode;
            // console.log(e);
        };
    },
    methods: {
        
        // 获取meta
        metasList() {
            this.meta = {
                insertable: false,
                edit: 'EDIT',
                delete: 'DELETE_BOTH',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        searchable: true,
                        name: '正题名'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'isbn',
                        searchable: false,
                        name: 'ISBN'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: false,
                        key: 'firstResponsible',
                        name: '第一责任者'
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
                        key: 'classificationNumber',
                        name: '分类号'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'managerName',
                        name: '操作员'
                    },
                     {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'createTime',
                        type: "TIMESTAMP",
                        name: '编目时间'
                    }
                ]
            };
        },
        del(){},
        delAll(){
            this.$confirm('此操作将永久删除该MARC, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                     this.loading()
                    this.ax.delete('/manage/unit/catalog/collectionHandling/unusedBookBaseAll?platformId='+JSON.parse(localStorage.getItem("user")).platform.id)
                        .then(res=>{
                             this.bus.$emit('flash_/manage/unit/catalog/collectionHandling/unusedBookBase')
                             this.$message.success('删除成功');
                              this.sloading()
                        })
                }).catch(() => {
                  
                });
        },
        deleteBook(val){
             this.loading()
            let ids = val.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/catalog/collectionHandling/unusedBookBase?ids='+ids)
                .then(res=>{
                    this.bus.$emit('flash_/manage/unit/catalog/collectionHandling/unusedBookBase')
                       this.$message.success('删除成功');
                        this.sloading()
                })
        },
        editBook(val){
            
             this.getMarc(val[0].originalMarc,val[0].encoding)
        },
        getMarc(marc,enCoding){
            this.loading()
            this.ax.post('/manage/unit/system/dataReceive/jxMarc',{marc,enCoding})
                .then(res=>{
                    // console.log(res)
                      this.sloading()
                    this.MarcList=res
                    this.MarcList.map(it=>{
                        it.content= it.content.split('\u001F').join('▼')
                    })
                    this.dialogVisible =true
                })
        },
    }
};
</script>

<style scoped>

</style>
