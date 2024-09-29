<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>工作量统计</div>
                <div class="display_flex">
                     <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="lookFor" >报表预览</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form' ></form-data>
            </div>
        </div>

     
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
                  {
                    name: '编目日期',
                    id: 'startTime',
                    type: 'aroundTimes',
                    end: 'endTime'
                },
                 { name: '操作员', id: 'managerId',relation:'managerName',type:'select',options:[]}
            ],
            form: {
                startTime:'',
                endTime:'',
                managerId:''
            },
            height: '',
            arr: [],
            createModel: false,
            format: {},
            listData: [],
            lists: {}
        };
    },
    created() {
        
        this.getManger();
        // this.getCycle()
        // this.getBitch()
        // this.getUnit()
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
                this.list[1].options = res.content;
            });
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
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            
            this.$router.push({
                path: '/catalogue/echart/workloadList',
                query: { info: JSON.stringify(this.form), format: JSON.stringify(this.format), list: JSON.stringify(this.listData) }
            });
        },
        // 获取文献类型
        getType() {
            this.ax.get('/manage/unit/report/journalReport/journalMarcTypeDetail').then(res => {
                this.list[0].options = res.content;
            });
        },
        // 获取批次
        getBitch(){
            this.ax.get('/manage/unit/report/journalReport/journalBookingBatch')
                .then(res=>{
                    this.list[2].options = res.content;
                })
        },
        // 获取单位
        getUnit(){
            this.ax.get('/manage/unit/report/journalReport/journalDeliveryUnit')
                .then(res=>{
                    // // console.log(res)
                     this.list[3].options = res.content;
                })
        },
        // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/report/journalReport/journalCycle')
            .then(res => {
                this.list[7].options = res.content;
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
