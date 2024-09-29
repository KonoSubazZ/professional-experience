<template>
    <div>
        <div class="container libraryInfo" :style="'height:' + height + 'px'">
            <div class="padding_20 m-b-20">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="书标打印" name="first">
                        <div>
                            <form-view :list="list" :row="1" :model="form" @getForm="getForm"></form-view>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="补缺打印" name="sec">
                        <div>
                            <form-view :list="lists" :row="1" @getForm="getForms" :model="forms" @keyup.enter.native="add"></form-view>

                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="index" label="添加顺序" align="center"> </el-table-column>
                                <el-table-column prop="barCode" label="文献条码" sortable align="center"> </el-table-column>
                                <el-table-column prop="callNumber" label="索书号" align="center"> </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <div class="table-action flex-row flex-wrap flex_center">
                                            <el-button size="mini" type="text" class="m-r-20" @click="changeIndex(scope.$index, -1)" v-if="scope.$index != 0">上移</el-button>
                                            <el-button size="mini" type="text" class="m-r-20" @click="changeIndex(scope.$index, 1)" v-if="scope.$index != tableData.length - 1">下移</el-button>
                                            <el-button size="mini" type="text" class="m-r-20 color_dan" @click="delRow(scope.$index)">删除</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="display_flex choose">
                    <el-button-group>
                        <el-button type="primary" plain class="add m-r-20" @click="add" v-if="activeName == 'sec'">添加到列表</el-button>
                        <el-button type="primary" plain icon="el-icon-setting" @click="lookFor">预览</el-button>
                        <el-button type="primary" plain icon="el-icon-printer" @click="setting">打印设置</el-button>
                        <!-- <el-button type="primary" plain icon="el-icon-printer"  @click="print" >打印</el-button> -->
                    </el-button-group>
                </div>
            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog title="设置" :visible.sync="showSet" width="80%" top="5vh" @close="closeMode" :close-on-click-modal="false">
            <setData :type="'BOOKMARK'"></setData>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="showSet = false">取 消</el-button> -->
                <el-button type="primary" @click="closeMode">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const qs = require('qs');
import formView from '../../view/form';
import setData from './console/add';
export default {
    components: {
        formView,
        setData
    },
    data() {
        return {
            bus: this.bus(this),
            height: '', //高度
            activeName: 'first',//切换“书标打印”“补缺打印”
            form: {},  //收集书标打印的用户输入内容；
            forms: {},  //收集补缺打印的用户输入内容；
            list: [  //书标打印
                // {name:'条码前缀',id:'prefix'},
                { name: '文献条码范围', id: 'barCodeStart', type: 'around', end: 'barCodeEnd' },
                { name: '分类号范围', id: 'classificationNumberStart', type: 'around', end: 'classificationNumberEnd' },
                { name: '索书号范围', id: 'callNumberStart', type: 'around', end: 'callNumberEnd' },
                { name: '架位号', id: 'rackName' },
                { name: '入库时间', id: 'warehousingTimeStart', type: 'aroundTimes', end: 'warehousingTimeEnd' },
                {
                    name: '排序字段',
                    id: 'sortStr',
                    type: 'select',
                    options: [
                        { name: '文献条码', id: 'bar_code' },
                        { name: '架位号', id: 'rack_name' },
                        { name: '入库时间', id: 'warehousing_time' },
                        { name: '分类号', id: 'classification_number' },
                        { name: '索书号', id: 'call_number' }
                    ]
                },
                {
                    name: '排序方式',
                    id: 'isPositive',
                    type: 'select',
                    options: [
                        { name: '正序', id: true },
                        { name: '倒叙', id: false }
                    ]
                },
                { name: '选择模板', id: 'temp', type: 'select', options: [] }
            ],
            lists: [  //补缺打印
                // { name: '条码前缀', id: 'prefix' },
                { name: '文献条码', id: 'barCodeStart', chooseId: 'number' },
                { name: '编目时间', id: 'bookBaseCreateTimeStart', end: 'bookBaseCreateTimeEnd', type: 'aroundTimes' },
                //  { name: '指定分类段', id: 'classificationSegment',type:'select',options:[
                //      {name:'A',id:'A'},
                //      {name:'B',id:'B'},
                //      {name:'C',id:'C'},
                //      {name:'D',id:'D'},
                //      {name:'E',id:'E'},

                //      {name:'F',id:'F'},
                //      {name:'G',id:'G'},
                //      {name:'H',id:'H'},
                //      {name:'I',id:'I'},
                //      {name:'J',id:'J'},

                //      {name:'K',id:'K'},
                //      {name:'L',id:'L'},

                //      {name:'N',id:'N'},
                //      {name:'O',id:'O'},

                //      {name:'P',id:'P'},
                //      {name:'Q',id:'Q'},
                //      {name:'R',id:'R'},
                //      {name:'S',id:'S'},
                //      {name:'T',id:'T'},

                //      {name:'U',id:'U'},
                //      {name:'V',id:'V'},

                //      {name:'X',id:'X'},

                //      {name:'Z',id:'Z'},
                //  ] },
                { name: '选择模板', id: 'temp', type: 'select', options: [] }
            ],
            // rules: {},
            // checked: '',
            options: [],
            showSet: false,
            tableData: [] //接收后端返回，表格区域要显示的数据；
        };
    },
    created() {
        this.calcTableHeight();
        window.addEventListener('resize', () => {//只要窗口大小发生像素变化就会触发
            // console.log(window.innerWidth);// 当前窗口宽度
            this.calcTableHeight();
        });
        this.getList();
        document.onkeydown = (e) => { //没起到作用
            let key = window.event.keyCode;
            // console.log(e)
            // f
            if (e.keyCode == 70 && e.path.length == 4) {
                // this.search()
            }
            // t
            if (e.keyCode == 84 && e.path.length == 4) {
                // this.add()
            }
            // c
            if (e.keyCode == 67 && e.path.length == 4) {
                // this.add()
            }
        };
    },
    // mounted(){
    //     this.bus.$on('flash_/parint',res=>{
    //          this.getList()
    //      })
    // },
    methods: {
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 170;
            }, 100);
        },
        handleClick(val) {//无作用
            // this.activeName =val
            // console.log(this.activeName)
        },
        closeMode() {//关闭“设置”的弹出框
            this.showSet = false;//关闭弹框
            this.getList();//获取打印设置的列表
        },
        getList() {
            this.ax
                .get('/manage/unit/catalog/bibliography/printSetting', {
                    params: { type: 'BOOKMARK', platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 999, page: 0 }
                })
                .then((res) => {
                    this.list[7].options = res.content;
                    this.lists[2].options = res.content;
                });
        },
        changeIndex(index, add) {//上移、下移
            let arr = this.tableData;
            if (add == 1) {//下移
                arr[index].classOrder = arr[index].classOrder + 1;
                arr[index + 1].classOrder = arr[index + 1].classOrder - 1;
                arr[index] = arr.splice(index + 1, 1, arr[index])[0];
                this.tableData = arr;
            } else {//上移
                arr[index].classOrder = arr[index].classOrder - 1;
                arr[index - 1].classOrder = arr[index - 1].classOrder + 1;
                arr[index] = arr.splice(index - 1, 1, arr[index])[0];
                this.tableData = arr;
            }
        },
        delRow(index) {//删除
            // // console.log(val)
            this.tableData.splice(index, 1);
        },
        getForm(val) {//获取“书标打印”的数据列表
            // // console.log()
            this.form = val;
        },
        getForms(val) {//获取“补缺打印”的数据列表
            this.forms = val;
        },
        lookFor() {//预览
            let table;
            if (this.activeName == 'first') {//书标打印
                let params;
                this.list[7].options.map((it) => {
                    if (it.id == this.form.temp) {
                        table = it;
                        console.log(table,'---table');
                    }
                });
                params = this.form;``
                if (!params.temp) {
                    return this.$message.error('请选择模板');
                    // return
                }
                console.log(Object.keys(params),'--Object.keys(params)');
                if(Object.keys(params).length===1&&Object.keys(params)[0]=='temp'){
                    return this.$message.error('请输入其中一个条件');
                }
                params.size = '1000';
                this.loading();
                params.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
                this.ax.get('/manage/unit/catalog/bibliography/searchCallNumber', { params }).then((res) => {
                    this.sloading();
                    if(!res.content.length) return this.$message.error('未查询到可以打印的书标')
                    // // console.log(res)
                    this.$router.push({
                        path: 'bookLabel/bookLabelFor',
                        query: { info: JSON.stringify(res.content), params: JSON.stringify(table) }
                    });
                });
            } else {//补缺打印
                this.lists[2].options.map((it) => {
                    if (it.id == this.forms.temp) {
                        table = it;
                    }
                });
                // // console.log(this.forms)
                // // console.log(table)
                if (!this.forms.temp) {
                    return this.$message.error('请选择模板');
                }
                this.$router.push({
                    path: 'bookLabel/bookLabelFor',
                    query: { info: JSON.stringify(this.tableData), params: JSON.stringify(table) }
                });
            }
        },
        // print() {},
        add() {//"补缺打印"中的“添加到列表”和键盘回车的事件回调
            let params = this.forms;
            params.barCodeEnd = params.barCodeStart;
            params.size = '3000';
            params.platformId = JSON.parse(localStorage.getItem('user')).platform.id;

            this.ax.get('/manage/unit/catalog/bibliography/searchCallNumber', { params }).then((res) => {
                let input = document.getElementById('number');
                input.focus();
                input.select();
                this.tableData = this.tableData.concat(res.content);
                if (res.content.length == 0) {
                    return this.$message.error('当前条码没有书标');
                }

                this.tableData.map((it, i) => {
                    it.index = i + 1;
                });
            });
        },
        setting() {//“打印设置”按钮的回调
            this.showSet = true;
        }
    }
};
</script>

<style scoped>
.libraryInfo .el-tabs__item {
    line-height: 60px;
    height: 60px;
}
.libraryInfo {
    position: relative;
}
.libraryInfo .choose {
    position: absolute;
    top: 10px;
    right: 20px;
}
.libraryInfo .info {
    height: 1.38rem;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.38rem;
    color: #000000;
    width: 100%;
}
.b-b-1 {
    border-bottom: 1px solid #ddd;
}
</style>
