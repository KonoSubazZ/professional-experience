<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>装订单</div>
                <div class="display_flex">
                    <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="lookFor" >报表预览</el-button>
                                <el-button type="primary" plain icon="el-icon-setting"  @click="jump" >报表导出格式设置</el-button>
                    </el-button-group>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form'  @getForm="getForm"></form-data>
                <div class="set">
                    <!-- <el-button type="primary" @click="jump" class>报表导出格式设置</el-button> -->
                </div>
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog
            title="报表导出格式设置"
            :visible.sync="createModel"
            width="90%"
            top="1vh"
            :close-on-click-modal="false"
        >
            <div>
                <set-view
                    :url="'/manage/unit/journal/journalExcel/journalBookingBindingResForExcelField'"
                    @chooseName="chooseName"
                    @showList="showList"
                ></set-view>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="createModel = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import formData from '../../../view/form';
import setView from './page/set';
export default {
    components: {
        formData,
        setView
    },
    data() {
        return {bus: this.bus(this),
            list: [
                { name: '文献类型', id: 'medium', type: 'select', options: [] },
                {
                    name: '预订日期',
                    id: 'startTime',
                    type: 'aroundTimes',
                    end: 'endTime'
                },

                { name: '预订批次', id: 'batchId', type: 'select', relation: 'batchName', options: [] },

                { name: '供货单位', id: 'deliveryUnit', type: 'select', options: []  },

             

                { name: '是否核心期刊', id: 'core', type: 'select',  options: [
                    {name:'是',id:true},
                    {name:'否',id:false},
                ] },

                 { name: '文献语种', id: 'languageId',relation: 'language', type: 'select',  options: [] },

            

                { name: '出版周期', id: 'publishingCycle', relation: 'publishingCycleName',type: 'select',  options: [] },

                { name: '操作员', id: 'managerId',relation:'managerName',type: 'select',  options: []}
            ],
            form: {},
            height: '',
            arr: [],
            createModel: false,
            format: {},
            listData: [],
            lists: {}
        };
    },
    created() {
        this.getType();
        this.getCycle()
        this.getBitch()
        this.getUnit()
        this.getManger()
        this.getLang()
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
         // 获取操作员
        getManger(){
            this.ax.get('/manage/unit/general/manager',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[7].options = res.content;
            });
        },
        getLang(){
            let params={
                platformId:JSON.parse(localStorage.getItem("user")).platform.id,
                bookCatalogParameterType:'LANGUAGE',
                size:99
            }
            this.ax.get('/manage/unit/journal/journalParameters/bookCatalogParameterTypeDetail',{params})
                .then(res=>{
                     this.list[5].options = res.content;
                })
        },
        jump() {
            this.createModel = true;
            // this.$router.push('set')
        },
        chooseName(val) {
            this.format = val;
        },
        showList(val) {
            this.listData = val;
        },
        // 生成报表
        lookFor() {
            this.$router.push({
                path: '/periodical/echart/bindingList',
                query: { info: JSON.stringify(this.form), format: JSON.stringify(this.format), list: JSON.stringify(this.listData) }
            });
        },

        getForm(val) {
            this.form = val;
        },
        // 获取文献类型
        getType() {
            this.ax.get('/manage/unit/report/journalReport/journalMarcTypeDetail',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[0].options = res.content;
            });
        },
        // 获取批次
        getBitch(){
            this.ax.get('/manage/unit/report/journalReport/journalBookingBatch',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.list[2].options = res.content;
                })
        },
        // 获取单位
        getUnit(){
            this.ax.get('/manage/unit/report/journalReport/journalDeliveryUnit',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // // console.log(res)
                     this.list[3].options = res.content;
                })
        },
        // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/report/journalReport/journalCycle',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
            .then(res => {
                this.list[6].options = res.content;
            });

        },
    }
};
</script>

<style scoped >
.set {
    display: flex;
    justify-content: flex-end;
}
</style>
