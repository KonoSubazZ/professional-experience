<template>
    <div >
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>文献借阅排行</div>
                <div class="display_flex">
                     <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="lookFor" >报表预览</el-button>
                                <el-button type="primary" plain icon="el-icon-setting"  @click="jump" >报表导出格式设置</el-button>
                    </el-button-group>
                    <!-- <div class="cursor text_center m-r-20" @click="lookFor()">
                        <img src="../../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">报表预览</div>
                    </div> -->
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form'  @getForm="getForm"></form-data>
               <div class="set">
                    <!-- <el-button type="primary" @click="jump" class="" >报表导出格式设置</el-button> -->
               </div>
            </div>
        </div>


              <!-- 弹框 -->
        <el-dialog title="报表导出格式设置" :visible.sync="createModel" width="90%" top='1vh' :close-on-click-modal='false' >
                <div >
                    <set-view :url="'/manage/unit/circulation/circulationExcel/circulationRankingResForExcelField'" @chooseName='chooseName' @showList='showList'></set-view>
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
import setView from './page/set'
export default {
    components: {
        formData,
        setView
    },
    data() {
        return {bus: this.bus(this),
            list: [
                // {
                //     name: '预约方式',
                //     id: 'documentAppointmentMethod',
                //     type: 'select',
                //     relation: 'documentAppointmentMethodName',
                //     options: []
                // },
                { name: '数据条数', id: 'limitNumber' },
                { name: '读者证号', id: 'readerStartNumber', type: 'around', end: 'readerEndNumber' },
                { name: '文献条码', id: 'startBarCode', type: 'around', end: 'endBarCode' },
                {
                    name: '借出日期',
                    id: 'borrowStartDate',
                    type: 'aroundTimes',
                    end: 'borrowEndDate'
                },
                {
                    name: '应还日期',
                    id: 'borrowStartAlso',
                    type: 'aroundTimes',
                    end: 'borrowEndAlso'
                },
                {
                    name: '归还日期',
                    id: 'borrowBookStartTime',
                    type: 'aroundTimes',
                    end: 'borrowBookEndTime'
                },
                { name: '读者类型', id: 'readerTypeNameId', type: 'select', relation: 'readerTypeName', options: [] },
                { name: '读者单位', id: 'readerUnitNameId', type: 'select', relation: 'readerUnitName', options: [] },
                  {
                    name: '馆藏地址',
                    id: 'collectionPlaceId',
                    type: 'select',
                    relation: 'collectionPlaceName',
                    options: []
                },
                {
                    name: '借阅状态',
                    id: 'borrowStatus',
                    type: 'select',
                    // relation: 'documentAppointmentStatusName',
                    options: [
                         {name:'借出', id:'0'},
                        {name:'归还', id:'1'}
                    ]
                },
                // { name: '报表格式', id: 'format', type: 'select', options: [] }
            ],
            form: {},
            height: '',
            arr: [],
            createModel:false,
            format:{},
            listData:[],
            lists: {}
        };
    },
    created() {
        this.getPlace();
        this.getType();
        this.getRead();
        // this.getForMat();

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
        // // 获取地址
        getPlace() {
            this.ax.get('/manage/unit/report/journalReport/bookCollection',{params:{ platformId :JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                // console.log(res);
              
                this.list[8].options = res.content;
               
            });
        },
        jump(){
            this.createModel=true
            // this.$router.push('set')
        },
        chooseName(val){
            this.format = val
        },
        showList(val){
            this.listData = val
        },
        // 生成报表
        lookFor() {   
            this.form.limitNumber = this.form.limitNumber*1
            this.$router.push({
                path: '/circulation/report/borrowRankingList',
                query: { info: JSON.stringify(this.form), format:JSON.stringify(this.format),list:JSON.stringify(this.listData) }
            });
        },

        getForm(val) {
            this.form = val;
        },
        // // 获取报表格式
        // getForMat() {
        //     this.ax.get('/manage/unit/report/journalReport/excelFormat').then(res => {
        //         // console.log(res);
        //         this.arr = res.content;
        //         // arr.push({name:'默认格式',id:''})
        //         // // console.log(arr)
        //         this.list[5].options = res.content;
        //         // this.list[5].options=res.content.push({name:'默认格式',id:''})
        //     });
        // },
        // 读者类型
        getType() {
            this.ax.get('/manage/unit/report/journalReport/readerType',{params:{ platformId :JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                // console.log(res.content);

                // res.content = res.content.push({name:'全部类型',id:''})
                let arr = res.content;
                
                //  // console.log(arr)
                this.list[6].options = arr;

                // // console.log( this.list[2].options)
            });
        },
        //   读者单位
        getRead() {
            this.ax.get('/manage/unit/report/journalReport/readerUnit',{params:{presenceStatus:1, platformId :JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[7].options = res.content;
            });
        },
        // metaList() {
        //     this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.DocumentAppointment' } }).then(res => {
        //         res.insertable = false;
        //         res.edit = 'EDIT_BOTH';
        //         res.subs.map(it => {
        //             if (it.key == 'documentAppointmentMethod') {
        //                 this.list[0].options = it.searchOption.map(item => {
        //                     return { name: item.name, id: item.key };
        //                 });
        //             }
        //             if (it.key == 'documentAppointmentStatus') {
        //                 this.list[4].options = it.searchOption.map(item => {
        //                     return { name: item.name, id: item.key };
        //                 });
        //                 // // console.log( this.list[4].options)
        //             }
        //         });
           
        //     });
        // }
    }
};
</script>

<style scoped >
.set{
    display: flex;
    justify-content: flex-end;
}
</style>
