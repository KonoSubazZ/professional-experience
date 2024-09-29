 <template>
    <div >

         <List 
            :dataUrl="'/manage/unit/opac/announcement/announcement'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            ref="list"
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
           meta:'',
        };
    },
    created() {
       this.metaList()
    },
    methods: {
        // 修改
        editUpdate(e){
                // console.log(e)
                this.$router.push({
                    path:'index/addNote',
                    query:{info:JSON.stringify(e[0])}
                })
        },
        jump(){
            this.$router.push('index/addNote')
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/unit/opac/announcement/announcement?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/announcement/announcement`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.Announcement'}})
            .then(res=>{
                res.delete='DELETE_BOTH'
                res.subs.map(it=>{
                    if(  it.key == 'platformId'){
                        it.displayInList=false
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
