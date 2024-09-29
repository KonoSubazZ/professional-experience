 <template>
    <div class="container" :style='$height()'>
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>集群激活信息</div>
                <div class="display_flex">
                        <el-button type="primary" @click="back" plain icon="el-icon-arrow-left">返回</el-button>
                </div>
            </div>
            <div class="padding_20 f-s-16 color_d">
                <!-- <div class="m-b-20">用户名：{{form.name}}</div> -->

                 <div class="m-b-20">
                      <div class="display_flex">
                             <div class="w-20">单位名称: </div>
                             <div>{{form.enterpriseName}}</div>
                      </div>
                </div>
                  <div class="m-b-20">
                       <div class="display_flex">
                             <div class="w-20">使用期限: </div>
                             <div>{{getTime(form.startTime)}} - {{getTime(form.endTime)}}</div>
                        </div>
                </div>
                   <div class="m-b-20">
                     <div class="display_flex">
                             <div class="w-20">年费用： </div>
                             <div>￥{{form.annualFee}}</div>
                         </div>
                    </div>
                    <div class="m-b-20">
                         <div class="display_flex">
                             <div class="w-20">集群地址： </div>
                             <div>{{form.province}}-{{form.city}}-{{form.district}}</div>
                         </div>
                    </div>

                     <div class="m-b-20">
                         <div class="display_flex">
                             <div class="w-20">总后台创建子平台最大数量： </div>
                             <div>{{form.subPlatformNumber}}</div>
                         </div>
                     </div>

                      <!-- <div class="m-b-20">备注: {{form.note}}</div> -->

                      
            </div>
    </div>
</template>

<script>


export default {
  
    data() {
        return {bus: this.bus(this),
            form:[]
        };
    },
    created() {
        this.getList()

    },
    methods: {
       getList(){
           this.ax.get('/manage/united/setting/user')
            .then(res=>{
                this.form = res
            })
       },
    }
};
</script>

<style scoped>
.color_d{
    color: #888;
}
</style>
