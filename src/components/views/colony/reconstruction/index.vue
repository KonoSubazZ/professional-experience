<template>
    <div>
         <List 
            :dataUrl="'/manage/united/database/backupLog'"
            :metaUrl="'/manage/meta?path=com.cq1080.library.cluster.bean.entity.BackupLog'"
            @meta='getMeta'
            ref="list"
            :actionName='"备份"'
            :disableTableAction='true'
            :chooseBox='true'
            @create='getSave'
             >
        </List>
      
    </div>
</template>

<script>
import List from '../../../view/List'
import upload from '../../upLoad'
// import addAdmin from './addAdmin'
export default {
     components:{List,upload},
    data() {
        return {bus: this.bus(this),
           dialogFormVisible:false,
            createModel:false,
            showServices:false,
            isInternal:true,
           loadings:false,
           showPwd:false,
           form:{

           },
            rules: {
                 name: [{ required: true, message: '请输入', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入', trigger: 'blur' }],

                label: [{ required: true, message: '请选择', trigger: 'change' }],
               
                status: [{ required: true, message: '请选择', trigger: 'change' }],
               
                
     
                username: [{ required: true, message: '请输入', trigger: 'blur' }],
                password: [{ required: true, message: '请输入', trigger: 'blur' }],
                phone:[{ required: true, message: '请输入', trigger: 'blur' }],
                
            },
           
        //    label options
        labels:[],
        // status options
        statues:[]
        };
    },
    created() {
       this.getInfo()
    },
    methods: {
        getMeta(val){
            // console.log(val)
            val.delete='NONE'
            val.edit='NONE'
        },
        getSave(){
            this.$confirm('是否开始备份?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.loading()
                    this.ax.post('/manage/united/database/backupLog')
                        .then(res=>{
                            this.sloading()
                            this.$message({
                            type: 'success',
                                message: '备份成功!'
                            });
                             this.bus.$emit(`flash_/manage/united/database/backupLog`, res);
                        })
                        .catch(it=>{
                            this.sloading()
                        })
                }).catch(() => {
                      
                });
        },
    }
};
</script>

<style>

</style>
