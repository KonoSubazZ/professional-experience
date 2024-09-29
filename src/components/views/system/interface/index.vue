<template>
    <div class="container">
         <List 
            :dataUrl="'/manage/unit/system/dataReceive/jxBookBaseLibraryRes'"
            :disableMeta='true'
            :tableMeta='meta'
            ref="list"
            @delete="deleteUpdate"
            >
             <template slot="addition-table-actions" slot-scope="scope">
                    <el-button class="m-r-20" type="text" size="mini" @click="updata(scope.item.row)" icon="el-icon-view">查看</el-button>
            </template>
             <template slot="addition-actions" >
             
                
            </template>
        </List>
        <el-dialog
            title="套录库维护查看"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="50%"
            >
           <div>
                    <div class="border-1 w-100">
                        <div class="display_flex start" v-for="(item,i) of MarcList" :key="i">
                                <div class=" w-10 m-r-20">{{item.code}}</div>
                                <div class="w-90" v-html="item.content"></div>
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
import List from '../../../view/List'
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           meta:'',
           dialogVisible:false,
           MarcList:[]
        };
    },
    created() {
       this.metaList()
      
    },
    methods: {
        updata(val){
            // console.log(val)
            this.getMarc(val.originalMarc,val.encoding)
        },
       
        getMarc(marc,enCoding){
            this.loading()
            this.ax.post('/manage/unit/system/dataReceive/jxMarc',{marc,enCoding})
                .then(res=>{
                    // console.log(res)
                      this.sloading()
                      res.map(it=>{
                        it.content =   it.content.split('\u001F')
                        .map((its) => {
                            return its;
                        })
                        .join('▼')
                          // console.log(it.content)
                      })
                    this.MarcList=res
                    this.dialogVisible =true
                }).catch(res=>{
                      this.sloading()
                })
        },
         deleteUpdate(val){
             this.loading();
            let ids = val.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/system/dataReceive/deleteBookBaseLibraryById?ids='+ids)
                .then(res=>{
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/dataReceive/jxBookBaseLibraryRes`, res);
                    this.$message.success('删除成功');
                })
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.BookBase'}})
            .then(res=>{
                res.delete='DELETE_BOTH'
                res.insertable=false
                res.edit='NONE'
                res.subs.map(it=>{
                    if( it.key == 'platformId' || it.key=='publicationDate' || it.key=='price' || it.key=='copyNumber'|| it.key=='displayIsbn' ){
                        it.displayInList=false
                        it.searchable=false
                    }
                    if(it.key=='firstResponsible' ||it.key=='isbn'  ||it.key=='classificationNumber' ||it.key=='publisher' ||it.key=='seriesTitle' ){
                        it.displayInList=true
                        it.searchable=false
                        it.sort=4
                    }
                    if(it.key=='priceStr'){
                        it.name = '价格'
                    }
                    if(it.key=='isbn'){
                        it.sort=1
                    }
                    if(it.key=='firstResponsible'){
                        it.sort=5
                    }
                })
                res.subs =res.subs.sort((a,b)=>{
                    return a.sort-b.sort
                })
                 console.log(77,res)
                this.meta = res
            })
        },
    }
};
</script>

<style scoped>
.border-1{
    border: 1px solid #ddd;
    border-right: 10px;
    height: 550px;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    font-size:14px;
    line-height:30px;
    color:rgba(0,0,0,1);
}
</style>
