<template>
    <div >
        <div class="container" :style="height">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>读者统计</div>
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
                    <!-- <el-button type="primary" @click="jump" class="" >报表导出格式设置</el-button> -->
               </div>
            </div>
        </div>


              <!-- 弹框 -->
        <el-dialog title="报表导出格式设置" :visible.sync="createModel" width="90%" top='1vh' :close-on-click-modal='false' >
                <div >
                    <set-view :url="'/manage/unit/circulation/circulationExcel/circulationReaderStaticsResForExcelField'" @chooseName='chooseName' @showList='showList'></set-view>
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
                {
                    name: '办证日期',
                    id: 'startBzTime',
                    type: 'aroundTimes',
                    end: 'endSBzTime'
                },
                {
                    name: '截止日期',
                    id: 'startJzTime',
                    type: 'aroundTimes',
                    end: 'endJzTime'
                },
                
              
                { name: '读者类型', id: 'readerTypeNameId', type: 'select', relation: 'readerTypeName', options: [] },

                 { name: '读者状态', id: 'status', type: 'select', options: [] },

                { name: '读者单位', id: 'readerUnitNameId', type: 'select', relation: 'readerUnitName', options: [] },
               
                
                { name: '办证人', id: 'managerName' }
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
        this.metaList();
        this.getType();
        this.getRead();
        // this.getForMat();

        this.height = this.$height();
    },
    methods: {
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
            this.$router.push({
                path: '/circulation/report/readerList',
                query: { info: JSON.stringify(this.form), format:JSON.stringify(this.format),list:JSON.stringify(this.listData) }
            });
        },

        getForm(val) {
            this.form = val;
        },
      
        // 读者类型
        getType() {
            this.ax.get('/manage/unit/report/journalReport/readerType',{params:{ platformId :JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                // console.log(res.content);

                // res.content = res.content.push({name:'全部类型',id:''})
                let arr = res.content;
                
                //  // console.log(arr)
                this.list[2].options = arr;

                // // console.log( this.list[2].options)
            });
        },
        //   读者单位
        getRead() {
            this.ax.get('/manage/unit/report/journalReport/readerUnit',{params:{presenceStatus:1, platformId :JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                this.list[4].options = res.content;
            });
        },
        // 获取meta
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then(res => {
                res.insertable = false
                res.subs.map(it => {
                   
                    if(it.key=='status'){
                        this.list[3].options = it.searchOption.map(it=>{
                            return {id:it.key,name:it.name}
                        })
                    }
                  
                });
                // console.log(res);
                // this.meta = res;
            });
        }
        
    }
};
</script>

<style scoped >
.set{
    display: flex;
    justify-content: flex-end;
}
</style>
