 <template>
    <div class="container" :style="'height:'+height+'px'">
        <div class=" between m-b-10">
          <div class="">
            <el-tabs v-model="activeName">
              <el-tab-pane :label="open === '1' ? '恢复' : '格式化'" name="1"></el-tab-pane>
              <el-tab-pane  v-if="open === '1'" label="备份配置" name="2"></el-tab-pane>
              <el-tab-pane  v-if="open === '1'" label="备份详情" name="3"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="display_flex">
            <!--  -->
          </div>
        </div>
        <div class="padding_20">
          <recover :isOpen="open" v-if="activeName === '1'"></recover>
          <configuration v-if="activeName === '2'"></configuration>
          <backupDetail v-if="activeName === '3'"></backupDetail>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import recover from "@/components/views/system/init/recover";
import configuration from "@/components/views/system/init/configuration";
import backupDetail from "@/components/views/system/init/backupDetail";
export default {
  components:{recover,configuration,backupDetail},
    data() {
        return {bus: this.bus(this),
            height:'',
          activeName:'1',
          open:''
        };
    },
    created() {
    this.$nextTick(()=>{
      this.getOpen();
    })
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
      getOpen(){
        this.ax.get('/manage/unit/system/dbbackup/getOpen').then(res=>{
          this.open = res;
        })
      }

       
    }
};
</script>

<style scoped>

/deep/.el-tabs__item{
  height: 2.91rem !important;
}
/deep/.el-tabs__nav{
  margin-left: 20px;
}
</style>
 