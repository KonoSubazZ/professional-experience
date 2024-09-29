<template>
    <div>
        <div class="container" :style="'height:'+height+'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>编目综合统计</div>
                <div class="display_flex">
                    <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="lookFor" >报表预览</el-button>
                </div>
            </div>
            <div class="padding_20">
                <form-data :row="1" :list="list" :model='form'  @getForm="getForm"></form-data>
                
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
                 { name: '统计项目类型', id: 'type', type: 'select', options: [
                    {name:'按馆藏地',id:'1'},
                     {name:'按编目批次',id:'2'},
                      {name:'按文献状态',id:'3'},
                       {name:'按文献语种',id:'4'},
                        {name:'文献类型',id:'5'},
                         {name:'按中图法分类',id:'6'},
                          {name:'按入库人员',id:'7'},
                ] },
                 {
                    name: '入库时间范围',
                    id: 'startPutTime',
                    type: 'aroundTimes',
                    end: 'endPutTime'
                },
                { name: '条形码范围', id: 'startBarCode', type: 'around', end: 'endBarCode' },

                { name: '分类号范围', id: 'startClassificationNumber', type: 'around', end: 'endClassificationNumber' },

                { name: '批次号', id: 'batchId', type: 'select', relation:'batchName', options: []  },

                { name: '馆藏地', id: 'collectionPlaceId', type: 'select',relation:'collectionPlaceName',  options: []  },


                 { name: '文献类型', id: 'mediumId',type: 'select',relation:'medium',options: [] },

                { name: '文献语种', id: 'languageId',type: 'select',relation:'language', options: [] },

                 { name: '文献状态', id: 'bookStatus', type: 'select',  options: [] },

                { name: '架位号', id: 'rackName'  },
            
                 { name: '操作员', id: 'managerId',relation:'managerName',type:'select',options:[]}
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
        this.metaList()
        this.getBitch()
        this.getPlace()
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getCHI()
        this.getManger()
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
                this.list[10].options = res.content;
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
            this.$router.push({
                path: '/catalogue/echart/comprehensiveList',
                query: { info: JSON.stringify(this.form), format: JSON.stringify(this.format), list: JSON.stringify(this.listData) }
            });
        },

        getForm(val) {
            this.form = val;
        },
       // 获取文献类型
        getType() {
            this.ax.get('/manage/unit/report/journalReport/medium',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[6].options = res.content
            });
        },
          // 获取文献语种
        getCHI() {
            this.ax.get('/manage/unit/report/journalReport/language',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[7].options = res.content;
            });
        },
        // 获取馆藏地
        getPlace() {
            this.ax.get('/manage/unit/report/journalReport/bookCollection',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[5].options = res.content;
            });
        },
        // 获取批次
        getBitch(){
            this.ax.get('manage/unit/general/batch',{params:{type:'CATALOG',platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.list[4].options = res.content;
                })
        },
        // 获取单位
        getUnit(){
            this.ax.get('/manage/unit/report/journalReport/journalDeliveryUnit',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // // console.log(res)
                     this.list[4].options = res.content;
                })
        },
        // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/report/journalReport/journalCycle',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
            .then(res => {
                this.list[8].options = res.content;
            });

        },
         metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
               
                res.subs.map(it => {
                    if (it.key == 'bookStatus') {
                        this.list[8].options = it.searchOption.map(item => {
                            return { name: item.name, id: item.key };
                        });
                        // console.log(this.list[9].options)
                    }
                    // if (it.key == 'documentAppointmentStatus') {
                    //     this.list[4].options = it.searchOption.map(item => {
                    //         return { name: item.name, id: item.key };
                    //     });
                       
                    // }
                });
           
            });
        }
    }
};
</script>

<style scoped >
.set {
    display: flex;
    justify-content: flex-end;
}
</style>
