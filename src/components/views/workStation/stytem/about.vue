 <template>
    <div class="container" :style="height">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               关于我们
           </div>
           <div class="display_flex">
                <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div>
            </div>
         </div>
         <div>
             <vue-editer :parentMsg='form' @func='getInfos'></vue-editer>
         </div>
    </div>
</template>

<script>
import vueEditer from '../../../page/VueEditor'
export default {
    components:{
        vueEditer
    },
    data() {
        return {bus: this.bus(this),
            height:'',
            form:'',
        };
    },
    created() {
        this.getInfo( JSON.parse(localStorage.getItem("user")).platform.id)
        this.height = this.$height(150)
    },
    methods: {

       //获取
       getInfo(platformId){
           this.ax.get('/manage/unit/workstation/workStationSystemSetting/workStationAboutUs',{params:{platformId}})
            .then(res=>{
                // // console.log(res)
                this.form = res.content
            })
       },
       getInfos(res){
           this.form =res
       },
         // 新增保存
        save(formName) {
            this.loading();
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
            //   this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
          
                    let params={
                        platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                        content:this.form
                    }
                    this.ax.post('/manage/unit/workstation/workStationSystemSetting/workStationAboutUs', params)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                        })
                        .catch(res => {
                            this.sloading();
                        });
               
            
        }
       
    }
};
</script>

<style>

</style>
 