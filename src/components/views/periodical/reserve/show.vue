<template>
    <div>
        <div class="container" :style="height">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>期刊预定数据导入</div>
                <div class="display_flex">
                     <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-left' @click="lookMarc(-1)" >上一条</el-button>
                                <el-button type="primary" plain icon="el-icon-caret-right"  @click="lookMarc(1)" >下一条</el-button>
                                 <el-button type="primary" plain icon="el-icon-folder-add"  @click="add" >加载文件</el-button>
                                  <el-button type="primary" plain icon="el-icon-delete"  @click="back" >删除此文件</el-button>
                    </el-button-group>
                  
                </div>
            </div>
            <div class="padding_20 display_flex start between">
                    <div class="w-40">
                         <div class="p-t-30">
                            <span class="infoName m-r-20">文件名</span>
                            <span class="infoText">{{info.name}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">编码</span>
                            <span class="infoText">{{info.enCoding}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">上传时间</span>
                            <span class="infoText">{{getTime(now)}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">Marc类型</span>
                            <span class="infoText">{{info.marcTypeDetailName}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">总记录数</span>
                            <span class="infoText">{{totalNumber}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">预览记录总数</span>
                            <span class="infoText">{{marc.length}}</span>
                        </div>
                        <div class="p-t-30">
                            <span class="infoName m-r-20">当前预览记录</span>
                            <span class="infoText">{{index}}</span>
                        </div>
                    </div>

                    <div class="border-1 w-60">
                        <div class="display_flex start" v-for="(item,i) of MarcList" :key="i">
                                <div class="m-r-20">{{item.code}}</div>
                                <div>{{item.content}}</div>
                        </div>
                    </div>
            </div> 
            <el-dialog
            title="导入进度"
            :visible.sync="showModel"
            width="30%"
            :show-close='false'
            :close-on-click-modal="false"
           >
           <div>请勿关闭当前页，否则数据导入无法回退</div>
           <div class="m-b-20">总数：{{countNumber.totalNumber}}</div>
           <el-progress :text-inside="true" :stroke-width="26" :percentage="countNumber.percentage"></el-progress>
              <span slot="footer" class="dialog-footer" v-if="showClose">
                <el-button type="primary" @click="showModel = false">关 闭</el-button>
            </span>

        </el-dialog>

        </div>
    </div>
</template>

<script>


export default {
    components: {
        
    },
    data() {
        return {bus: this.bus(this),
           info:{},
            countNumber:{
               nowNumber:0,
               totalNumber:0,
               percentage:0
           },
           totalNumber:'',
           marc:[],
           now:'',
           fileParent:'',
           MarcList:[],
           index:1,
           showModel:false,
           showClose:false
        };
    },
    created() {
        this.height = this.$height();
        this.now = new Date();
        if(this.$route.query.info){
            this.info = JSON.parse(this.$route.query.info)
        }
         if(this.$route.query.marc){
              this.totalNumber = JSON.parse(this.$route.query.marc).totalNumber
            this.marc = JSON.parse(this.$route.query.marc).list
            this.fileParent = JSON.parse(this.$route.query.marc).fileParent
            this.getMarc(this.index)
        }

    },  
    methods: {
        getMarc(index){
            if(this.marc.length==0){
                return this.MarcList=[]
            }
            this.loading()
            this.ax.post('/manage/unit/journal/journalBooking/jxMarc',{marc:this.marc[index-1],enCoding:this.info.enCoding})
                .then(res=>{
                    // console.log(res)
                      this.sloading()
                     res.map(it=>{
                        
                        let arr = it.content.split('\u001F')

                        // console.log(arr)
                         it.content = arr.join('▼')
                    })
                     this.MarcList= res
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        lookMarc(num){
            if(num<0){
                if(this.index==1 || this.marc.length==0){
                    return this.$message.error('没有上一条了');
                }
                // this.index+=num
                this.getMarc(this.index+=num)
            }else{
                if(this.index==this.marc.length || this.marc.length==0 ){
                    return this.$message.error('没有下一条了');
                }
                // this.index+=num
                this.getMarc(this.index+=num)

            }
        },
        add(){
            // if(this.marc.length==0){
            //     return this.$message.error('当前marc已添加');
            // }
            this.loading()
            this.key=(Math.ceil((new Date).getTime()+ Math.random()*100000000))
            let params={
                 key:this.key,
                enCoding:this.info.enCoding,
                fileParent:this.fileParent,
                marcTypeDetailId:this.info.marcTypeDetailId,
                batchId:this.info.batchId,
                batchName:this.info.batchName,
                deliveryUnit:this.info.deliveryUnit
            }
            this.ax.post('/manage/unit/journal/journalBooking/journalBase',params)
                .then(res=>{
                     this.sloading()
                    // this.$message.success('添加成功'+res.successNumber+'条');
                    this.showClose = true
                    if(res.isoPath){
                         this.FileSaver.saveAs(res.isoPath,"错误数据.txt")
                    }
                })
            setTimeout(() => {
                this.getNumber()
                this.showModel = true
            });
        },
                
        getNumber(){
            this.ax.get('/manage/unit/system/dataReceive/plannedSpeed',{params:{key:this.key}})
                .then(res=>{
                    try {
                        this.countNumber = res
                        if(res.totalNumber!=res.nowNumber && this.showModel){

                            setTimeout(() => {
                                this.getNumber()
                            }, 1000);
                        }else{
                            

                            //    this.$message.success('导入成功');
                        }
                        if(res.nowNumber==undefined){
                            res.nowNumber=0
                            res.totalNumber=0
                        }
                        this.countNumber.percentage = Math.floor(res.nowNumber/res.totalNumber*100)
                    } catch (error) {
                          setTimeout(() => {
                                this.getNumber()
                            }, 1000);
                    }
                })
        },
    }
};
</script>

<style scoped >
.infoText{
    height:20px;
    font-size:14px;
    font-weight:400;
    line-height:20px;
    color:rgba(102,102,102,1);
    text-align: left;
    display:inline-block;
}
.infoName{
    text-align: right;
    display:inline-block;
    width: 100px;
    height:20px;
    font-size:14px;
    font-weight:400;
    line-height:20px;
    color:rgba(102,102,102,1);
}
.border-1{
    border: 1px solid #ddd;
    border-right: 10px;
    height: 600px;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    font-size:14px;
    line-height:30px;
    color:rgba(0,0,0,1);
}
</style>
