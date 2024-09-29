 <template>
    <div class="container" :style="'height:'+height+'px'">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               索书号生成方式
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
                    <el-radio v-for="item of options" :key='item.key' :label="item.key">{{item.name}}</el-radio>
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
            rules:{},
            options:[]
        };
    },
    created() {
        this.getInfo( JSON.parse(localStorage.getItem("user")).platform.id)
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getMeat()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
       //获取
       getInfo(platformId){
           this.ax.get('/manage/unit/system/systemSettings/callNumberSetting',{params:{platformId}})
            .then(res=>{
               console.log(888,res)
                this.form = res
            })
       },
    //    获取meta（）{}，
        getMeat(){
            this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.CallNumberSetting'}})
                .then(res=>{
                    // console.log(888,res)
                    res.subs.map(it=>{
                        if(it.key=='type'){
                            this.options = it.searchOption.map(r=>({
                              ...r,
                              name:r.key=='TWO'?'分类号+著者号+辅助号':r.name
                            }))
                        }
                    })
                })
        },
         // 新增保存
        save(formName) {
            this.loading();
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
            //   this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
          
                     this.sloading();
                    this.ax.post('/manage/unit/system/systemSettings/callNumberSetting', this.form)
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
 