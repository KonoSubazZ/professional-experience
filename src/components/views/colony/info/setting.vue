 <template>
    <div class="container" :style='$height()'>
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>集群基本配置</div>
                <div class="display_flex">
                    
                    <!-- <div class="cursor text_center m-r-20" @click="add">
                        <img src="../../../../assets/img/saves.png" class="btn_img" />
                        <div class="f-s-14">保存</div>
                    </div>

                    <div class="cursor text_center m-r-20" @click="back">
                        <img src="../../../../assets/img/return.png" class="btn_img" />
                        <div class="f-s-14">返回</div>
                    </div> -->
                    <el-button-group>
                        <el-button type="success" @click="save" plain icon="el-icon-edit">保存</el-button>
                        <el-button type="primary" @click="back" plain icon="el-icon-arrow-left">返回</el-button>
                     
                    </el-button-group>
                </div>
            </div>
        <div class="padding_20">
            <fromData ref="form" :row="1" :list="list"  :model="form" ></fromData>
        </div>
    </div>
</template>

<script>
import fromData from '../../../view/form';

export default {
    components: { fromData },
    data() {
        return {bus: this.bus(this),
            list:[
                {name:'访问地址',id:'address'}
            ],
            form:{

            },
        };
    },
    created() {
        this.getList()

    },
    methods: {
       
        save(){
            this.form.type='1'
             this.ax.post('/manage/united/setting/unitedSetting',this.form)
            .then(res=>{
                this.$message.success('保存成功');
            })
        },
       getList(){
           this.ax.get('/manage/united/setting/unitedSetting')
            .then(res=>{
                this.form = res
            })
       },
    }
};
</script>

<style>
</style>
