<template>
    <div>
         <List 
            :dataUrl="'/manage/manager'"
            @meta='metaList'
            @edit="editUpdate"
            ref="list"
            :chooseBox='true'
            @delete="deleteUpdate"
            @create="jump" >
        </List>
        <!-- 弹框 -->
        <el-dialog :visible.sync="dialogFormVisible" width="70%" :close-on-click-modal='false' >
            <add-admin :from='info' @close='dialogFormVisible=false'></add-admin>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List'
import addAdmin from './addAdmin'
export default {
     components:{List,addAdmin},
    data() {
        return {bus: this.bus(this),
           dialogFormVisible:false,
           info:{},
           loadings:false
        };
    },
    created() {
       
    },
    methods: {
        editUpdate(e){
            // // console.log(21)
            this.loadings = true
            this.info = e[0]
            this.dialogFormVisible=true
            setTimeout(res=>{
                 this.loadings = false
            },500)
        },
         // 删除
        deleteUpdate(e){
            // // console.log(e)
            this.loading()
            this.ax.delete('/manage/manager?ids='+e[0].id)
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
            // // console.log(val)
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
