 <template>
    <div class="container" :style="'height:'+height+'px'">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               架位号设置方式
           </div>
           <div class="display_flex">
                <!-- <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div> -->
                 <el-button type="primary" @click="save('form')" >保存</el-button>
            </div>
       </div>
       <div class="padding_20">
                <el-radio-group v-model="form.type">

                    <el-radio label="ONE">索书号范围</el-radio>

                    <el-radio label="TWO">条码号方式</el-radio>
                    
                </el-radio-group>
       </div>
    </div>
</template>

<script>
export default {

    data() {
        return {bus: this.bus(this),
            height:'',
            form:'',
        };
    },
    created() {
        this.getInfo( JSON.parse(localStorage.getItem("user")).platform.id)
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
       //获取
       getInfo(platformId){
           this.ax.get('/manage/unit/system/systemSettings/rackSetting',{params:{platformId}})
            .then(res=>{
                // // console.log(res)
                this.form = res
            })
       },
         // 新增保存
        save(formName) {
            this.loading();
          
          
                    this.sloading();
                    this.ax.post('/manage/unit/system/systemSettings/rackSetting', this.form)
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
 