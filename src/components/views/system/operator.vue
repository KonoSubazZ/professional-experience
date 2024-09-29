<template>
    <div>
        <div>

        </div>
         <List 
            :dataUrl="'/manage/manager'"
            @meta='metaList'
            @edit="editUpdate"
            ref="list"
            @delete="deleteUpdate"
            :chooseBox='true'
            @create="jump" >
        </List>
       
    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
         
           info:{},
           loadings:false
        };
    },
    created() {
       
    },
    methods: {
        editUpdate(e){
            // console.log(123)
             this.$router.push(
                {path:'/privilege/admin/addAdmin',
                query:{info:e[0].id}
                }
            )
            // this.loadings = true
            // this.info = e[0]
            // this.dialogFormVisible=true
            // setTimeout(res=>{
            //      this.loadings = false
            // },500)
        },
         // 删除
        deleteUpdate(e){
             let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading()
            this.ax.delete('/manage/manager?ids='+ids)
                .then(res=>{
                     this.sloading()
                    this.bus.$emit(`flash_/manage/manager`, res);
                    this.$message.success('删除成功');
                })
                .catch(res=>{
                     this.sloading()
                })
        },
        jump(){
            this.$router.push(
                {path:'/privilege/admin/addAdmin'}
            )
        },
        metaList(val){
            // console.log(val)
            val.delete='DELETE'
            val.subs.map(it=>{
                if(it.key=='createTime'){
                    it.searchable = false
                }
            })
        },
    }
};
</script>

<style>

</style>
