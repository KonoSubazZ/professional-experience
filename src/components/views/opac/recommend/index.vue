 <template>
    <div class="container">
        <div class="padding_20 ">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="新书推荐" name="NEW"></el-tab-pane>
                <el-tab-pane label="读者推荐" name="READER"></el-tab-pane>
            </el-tabs>
        </div>
         <List 
            :dataUrl="url"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            :isHeaderHeigt='80'
            ref="list"
            :delName='"取消推荐"'
            @delete='deleteUpdate'
            @create="jump" >
              
               
        </List>
    </div>
</template>

<script>
import List from '../../../view/List'

export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
            activeName:'NEW',
            meta:'',
            url:'/manage/unit/opac/recommendation/bookRecommendation?type=NEW&recommend=true'
        };
    },
    created() {
       this.metaList()
    },
    methods: {
                // 切换
         handelClick(e){
            // console.log(this.activeName)
             this.loading();
            if(this.activeName=='NEW'){
                this.url='/manage/unit/opac/recommendation/bookRecommendation?type=NEW&recommend=true'
                setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/opac/recommendation/bookRecommendation?type=NEW&recommend=true`, e);
                    // this.metaList()
                })
            }else{
                 this.url='/manage/unit/opac/recommendation/bookRecommendation?type=READER&recommend=true'
                 setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/opac/recommendation/bookRecommendation?type=NEW&recommend=true`, e);
                    // this.metaList()
                })
            }
             setTimeout(res=>{
                   this.sloading()
                },500)
           
            //  // console.log(e)
        },
        // 修改
        editUpdate(e){
            
        },
        jump(){
            this.$router.push({
                 path:'index/add',
                 query:{url:this.activeName}
            })
        },
         // 删除
        deleteUpdate(e){
            // console.log(e)
            let ids = e.map(it=>{
                return it.bookRecommendationId
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/opac/recommendation/bookRecommendation?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/recommendation/bookRecommendation?type=NEW&recommend=true`, e);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        metaList(){
         this.meta = {
             delete: "DELETE_BOTH",
             edit: "NONE",
             insertable:true,
             subs:[
                 {
                     key:'sort',
                     name:'排序',
                     displayInList:true,
                     searchable: false
                 },
                 {
                     key:'positiveTitle',
                     name:'题名',
                     displayInList:true,
                     searchable: true
                 },
                 {
                     key:'isbn',
                     name:'ISBN',
                     displayInList:true,
                     searchable: true
                 },
                  {
                     key:'createTime',
                     name:'推荐日期',
                     displayInList:true,
                     searchable: true,
                     type:'TIMESTAMP'
                 },
             ]

         }
        },
    }
};
</script>

<style>

</style>
