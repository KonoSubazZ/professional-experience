 <template>
    <keep-alive>
        <el-container class="bg-white cope_text lists" ref="container">
            <el-header height="auto" ref="tableHeader" v-if="!disableAction || !disableFilter">
               
                <div class="display_flex start between header_choose w-100">
                    <div class="display_flex start m-r-30 selectBOX" >
                         <div >
                            <slot name="func" >
                            </slot>
                             <slot name="filters" >
                                <template v-if="searchFiled && searchFiled.length && !disableFilter">
                                    <div class="display_flex wrap">
                                            <slot name="filter-prefix" ></slot>
                                            
                                                 <template v-for="(item,i) in searchFiled"  >
                                                     <div  class="m-r-20 m-b-10" :key='i'>
                                                        <el-select
                                                            clearable
                                                            filterable
                                                            v-model="filter[item.key]"
                                                            :key="item.key"
                                                            v-if="Array.isArray(item.options)"
                                                            :placeholder="item.name"
                                                        >
                                                            <el-option :label="'全部'+item.name" :value="null">全部{{item.name}}</el-option>
                                                            <el-option
                                                                v-for="option in item.options"
                                                                :key="option.key"
                                                                :value="option.key"
                                                                :label="option.name"
                                                            ></el-option>
                                                        </el-select>
                                                        <el-date-picker
                                                            v-else-if="item.type ==='TIMESTAMP'"
                                                            :key="item.key"
                                                            v-model="filter[item.key]"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptions"
                                                            type="datetimerange"
                                                            range-separator="至"
                                                            :start-placeholder="item.name+'开始'"
                                                            :end-placeholder="item.name+'结束'"
                                                        ></el-date-picker>
                                                        <el-input
                                                            
                                                            :placeholder="item.name"
                                                            v-model="filter[item.key]"
                                                            clearable
                                                            :key="item.key"
                                                            v-else
                                                        ></el-input>
                                                         </div>
                                                </template>
                                           
                                            <slot name="filter" ></slot>
                                    </div>
                                </template>
                            </slot>
                         </div> 
                         <div >
                             <el-button type="primary btn_click w-100" @click="search()" :loading="load_mode" v-if="searchFiled && searchFiled.length && !disableFilter">查询</el-button>
                         </div>
                    </div>
                    <div class="display_flex end setChooseBox" v-if="!disableAction">
                        <slot name="actions">

                            <slot name="addition-actions"></slot>

                            <el-button type="primary" class="m-r-10" v-if="printable" size="123" @click="$emit('print')">打印</el-button>

                             <div  @click="exportData"  class="text_center cursor m-r-20"  v-if="exportable">
                                <img src="../../assets/img/export.png" class="btn_img" >
                                <div class="f-s-14">导出</div>
                            </div>
        
                            <div  @click="doBatch('delete')"  class="text_center cursor m-r-20" v-if="deletetable">
                                <img src="../../assets/img/del.png" class="btn_img" >
                                <div class="f-s-14">删除</div>
                            </div>
            
                            <div v-if="insertable" @click="$emit('create',selected)" class="text_center cursor">
                                <img src="../../assets/img/add.png" class="btn_img" >
                                <div class="f-s-14">{{actionName?actionName:'添加'}}</div>
                            </div>
                        </slot>
                    </div>
                </div>
                <!-- 新增选择框 -->
                <div v-if="chooseBox" class="w-100">
                    <slot name="chooseBox"></slot>
                </div>

            </el-header>

            <el-main :style="tableStyle">
                <div class="bg-white" style="height:100%">
                    <template v-if="tableData">
                        <el-table
                             show-summary
                            :data="tableData.content"
                            
                            label="更新"
                            border
                            height="100%"
                            ref="templateList"
                            @cell-click="onCellClick"
                            @current-change="handleCurrentChoose"
                            @selection-change="handleSelectionChange"
                            
                        >
                           

                            <el-table-column label type="selection"    v-if="batchAction"></el-table-column>

                             <el-table-column
                                 v-if="isSort"
                                 key='fff'
                                 type="index"
                                align="center"
                               >
                            </el-table-column>

                            <template v-for="item in tableHeader">
                                <el-table-column
                                    align="center"
                                    :label="item.name"
                                    :prop="item.key"
                                    :key="item.key"
                                    v-if="item.type==='IMAGE'"
                                >
                                    <template slot-scope="scope" align="center">
                                        <el-image
                                            v-if="scope.row[item.key]"
                                            :src="scope.row[item.key]"
                                            :fit="'cover'"
                                            :preview-src-list="[scope.row[item.key]]"
                                            style="width:4rem;height:4rem;"
                                        ></el-image>
                                        <div v-else>没有图片</div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    align="center"
                                    :label="item.name"
                                    :prop="item.key"
                                    :key="item.key"
                                    v-else-if="item.type ==='TIMESTAMP'"
                                >
                                    <template slot-scope="scope">{{getTimestamp(scope.row[item.key])}}</template>
                                </el-table-column>

                                <el-table-column
                                    align="center"
                                    :label="item.name"
                                    :prop="item.key"
                                    :key="item.key"
                                    :sortable="item.sortable"
                                    v-else-if="Array.isArray(item.searchOption)"
                                >
                                    <template slot-scope="scope">
                                        <div class="123"  :style='"color:"+getOptionsColor(item.searchOption,[scope.row[item.key]])'>
                                             {{getOptionsValue(item.searchOption,[scope.row[item.key]])}}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    align="center"
                                    :label="item.name"
                                    :prop="item.key"
                                    :key="item.key"
                                    :sortable="item.sortable"
                                    v-else
                                >
                                    <template slot-scope="scope">
                                        <div
                                            :style="getStyle(scope.row,item)"
                                             v-html="getValueFromItem(scope.row,item.key)"
                                            class="less3"
                                            :class="getValueFromItem(scope.row,item.key) && getValueFromItem(scope.row,item.key).length>240?'m-b-10':''"
                                        ></div>
                                        
                                        <div class="display_flex end">
                                            <el-button type="text" v-if="getValueFromItem(scope.row,item.key) && getValueFromItem(scope.row,item.key).length>240" @click="lookMore(getValueFromItem(scope.row,item.key))">查看全部</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                            <el-table-column
                                width="240"
                                align="center"
                                label="操作"
                                v-if="!disableTableAction && tableData && tableData.content"
                            >
                                <template slot-scope="scope">
                                    <div class="table-action flex-row flex-wrap flex_center">
                                        <slot name="addition-table-actions" :item="scope"></slot>
                                        <el-button
                                            size="mini"
                                            type="text"
                                            class="m-r-20"
                                            v-if="editable"
                                            @click="$emit('edit',[scope.row])"
                                        >编辑</el-button>
                                        <delete-button
                                            :tip="'是否删除?'"
                                             :delNames='delName'
                                             v-if="deletetable"
                                            :loading="scope.row.loading"
                                            @delete="$emit('delete',[scope.row])"
                                        ></delete-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </el-main>
            <el-footer ref="tableFooter" class="flex-row between flex-center">
                <!-- <div style="height:100%;" class="flex-row flex-center">
                    <template v-if="selected && selected.length">
                        <el-button type="primary" @click="doBatch('edit')" v-if="batchEditable">编辑</el-button>
                        <el-button type="primary" @click="doBatch('export')" v-if="batchExportable">导出</el-button>
                        <el-button type="primary" @click="doBatch('print')" v-if="batchPrintable">打印</el-button>
                        
                    </template>
                </div> -->
                <div class="pagination" v-if="tableData">
                    <el-pagination
                        background
                        layout="sizes,total, prev, pager, next"
                        :current-page="tableData.number+1"
                        :page-sizes="[20, 50, 80, 100]"
                        :page-size="tableData.size"
                        :total="tableData.totalElements"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                    ></el-pagination>
                </div>
            </el-footer>
        </el-container>
    </keep-alive>
</template>
<script>
import DeleteButton from './DeleteButton';
import moment from 'moment';
import Vue from 'vue';
import { log } from 'util';
// import bus from '../common/bus';
import ticketUtil from '../../utils/ticket'
export default {
    name: 'list',
    props: [
        'data',
        'disableFilter',
        'isSort',
        'disableAction',
        'disableTableAction',
        'actionName',
        'searchName',
        'metaUrl',
        'tableMeta',
        'dataUrl',
        'disableMeta',
        'delName',
        'filters',
        'chooseBox',
        'showSummary',
        'disableCalculateHeight',
        'load_modes'
    ],
    components: { DeleteButton },
    data() {
        return {bus: this.bus(this),
             times:false,
            // load_mode
            load_mode:false,
             // 导出
            load_exp:false,

            publishDialog: false,
            pageTotal: 100,
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20
            },
            updateItem: null,
            pageInfo: { page: 0, size: 20 },
            filter: {},
            metaData: null,
            tablePadding: 0,
            tableData: {},
            selected: [],
            red: 'red',
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        };
    },
    watch: {
        load_modes(val){
            if(!val){
                this.load_mode = val
            }
        },
        data(val) {
            // // console.log(val)
            this.tableData = val;
            this.calcTableHeight();
        },

        tableMeta(val) {
            if (val) {
                this.metaData = val;
            }
        },
        tableData(val) {
            if (val && val.content) {
                this.calcTableHeight();
            }
        },
        filter: {
            deep: true,
            handler: function(cur, pre) {
                this.$emit('filterChange', cur);
            }
        }
    },
    created() {
        this.getMetaData();
        if(this.searchName){
            this.filter=this.searchName
        }
        this.doSearch();
        // // console.log(123)
        if (this.tableMeta) {
            this.metaData = this.tableMeta;
        }
        if(this.data){
            // // console.log(this.data)
             this.tableData = this.data;
        }
    },
    mounted() {
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
         this.bus.$on('add_' + this.dataUrl, e => {
          
            if( this.times){
               
            }else{
                 this.onAdd(e);
                 this.times=true
                  setTimeout(res=>{
                       this.times=false
                  },2000)
            }
           
        });
         this.bus.$on('flash',res=>{
           
              if( this.times){
               
            }else{
                 this.doSearch();
                 this.times=true
                  setTimeout(res=>{
                       this.times=false
                  },2000)
            }
         })
         this.bus.$on('flash_'+ this.dataUrl,res=>{
           
           
              if( this.times){
               
            }else{
                 this.doSearch();
                 this.times=true
                  setTimeout(res=>{
                       this.times=false
                  },2000)
            }
         })
       
    },

    computed: {
        tableStyle(){
            // 'height:'+tablePadding+'px;overflow:scroll'
            if(this.disableCalculateHeight){
            return {
              overflow:'auto',
                    'height': '400px'
                }    
            }
            // // console.log(this.tablePadding)
            return {
                overflow:'auto',
                height: this.tablePadding+'px'
            }
        },
        searchFiled() {
            let filters = this.filters;
            if (!filters) {
                filters =
                    this.metaData &&
                    this.metaData.subs.filter(it => {
                        return it.searchable;
                    });
            }
            if (!filters) {
                return [];
            }

            let vm = this;
            return filters.map(it => {
                Vue.set(vm.filter, it.key, vm.filter[it.key]);
                return {
                    name: it.name,
                    key: it.key,
                    type: it.type,
                    placeholder: it.name,
                    options: it.searchOption,
                    clickable: it.clickable
                };
            });
        },
        tableHeader() {
            if (!this.metaData) {
                return [];
            }
            this.metaData.subs.slice().sort((a, b) => {
                return a.sort - b.sort;
            });
            return this.metaData.subs.filter(it => {
                return it.displayInList;
            });
        },
        insertable() {
            return this.metaData && this.metaData.insertable;
        },
        deletetable() {
            return this.metaData && (this.metaData.delete == 'DELETE' || this.metaData.delete == 'DELETE_BOTH') && this.selected.length >= 1;
        },
        batchDeleteable() {
            return (
                this.metaData && (this.metaData.delete == 'DELETE_BATCH' || this.metaData.delete == 'DELETE_BOTH' || (this.deletetable && this.selected.length == 1))
            );
        },
        editable() {
            return this.metaData && (this.metaData.edit == 'EDIT' || this.metaData.edit == 'EDIT_BOTH');
        },
        batchEditable() {
            return (
                this.metaData &&
                (this.metaData.edit == 'EDIT_BATCH' || this.metaData.edit == 'EDIT_BOTH' || (this.editable && this.selected.length == 1))
            );
        },
        printable() {
            return this.metaData && (this.metaData.print == 'PRINT' || this.metaData.print == 'PRINT_BOTH');
        },
        batchPrintable() {
            return this.metaData && (this.metaData.print == 'PRINT_BATCH' || this.metaData.print == 'PRINT_BOTH');
        },
        exportable() {
            return this.metaData && (this.metaData.export == 'EXPORT' || this.metaData.export == 'EXPORT_BOTH');
        },
        batchExportable() {
            return this.metaData && (this.metaData.export == 'EXPORT_BATCH' || this.metaData.export == 'EXPORT_BOTH');
        },
        batchAction() {
            return this.batchDeleteable || this.batchEditable || this.batchPrintable || this.batchExportable || this.chooseBox;
        }
    },
    methods: {
        // 单选
        handleCurrentChoose(val){
            // // console.log(val)
            // // console.log(1)
           this.$refs.templateList.clearSelection();
            this.$refs.templateList.toggleRowSelection(val);
        },
        setFilterValue(key, value) {
            Vue.set(this.filter, key, value);
        },
        findFilterChangeKey(cur, previous) {
            let changed = [];
            for (let key in cur) {
                //// console.log(cur[key]);
                //// console.log(previous[key]);
                if (cur[key] != previous[key]) {
                    changed.push({ key: key, cur: cur[key], pre: previous[key] });
                }
            }
            return changed;
        },
        getTimestamp(value) {
            if(!value){
                return
            }
            return moment(value).format('YYYY-MM-DD HH:mm:ss');

        },
        getOptionsValue(options, key) {
            let items = options.filter(it => {
                return it.key == key;
            });
            return (items && items.length && items[0].name) || '';
        },
        getOptionsColor(options, key) {
            let items = options.filter(it => {
                return it.key == key;
            });
            return (items && items.length && items[0].color) || '';
        },
        calcTableHeight() {
            let height = this.$refs.tableFooter.$el.clientHeight;
            height = height + this.getOffsetLeft(this.$refs.container.$el);
            if (this.$refs.tableHeader) {
                height = height + this.$refs.tableHeader.$el.clientHeight + 30;
            }
            
            this.tablePadding = document.body.clientHeight - height;
        },
        getOffsetLeft(elem) {
            var offsetLeft = 0;
            do {
                if (!isNaN(elem.offsetTop)) {
                    offsetLeft += elem.offsetTop;
                }
            } while ((elem = elem.offsetParent));
            return offsetLeft;
        },
        getMetaData() {
            let vm = this;
            let metaUrl = this.metaUrl;
            if (this.disableMeta) {
                return;
            }
            if (!metaUrl) {
                metaUrl = this.dataUrl + '/meta';
            }
            this.ax.get(metaUrl).then(it => {
                vm.metaData = it;
                vm.$emit('meta', it);
            }).catch(it =>{
                //// console.log(it)
            });
        },
        search() {
            this.pageInfo.page = 0;
            this.load_mode=true;
            setTimeout(res=>{
                this.load_mode =false
            },3000)
            this.doSearch();
        },
        doSearch() {
            let filter = Object.assign({}, this.filter);
            let times = [];
            for (let key in filter) {
                let item = filter[key];
                if (Array.isArray(item)) {
                    times.push({ key: key, time: item });
                    delete filter[key];
                }
            }
            let timeFilter = times
                .map(it => {
                    return it.key + ',' + it.time[0] + ',' + it.time[1];
                })
                .join(';');
            if (timeFilter) {
                filter.times = timeFilter;
            }
            let platformId = JSON.parse(localStorage.getItem("user")).platform.id
            let search ={ platformId,page: this.pageInfo.page, size: this.pageInfo.size, ...filter }
            this.$emit('search',search)
            this.getListData(search);
        },
        onPageSizeChange(e) {
            this.pageInfo.size = e;
            this.doSearch();
        },
        onPageChange(e) {
            this.pageInfo.page = e - 1;
            this.doSearch();
        },
        getListData(item) {
            // //// console.log(123)
            // // console.log( this.dataUrl)
            if (this.dataUrl) {
                this.ax.get(this.dataUrl, { params: item }).then(it => {
                    // //// console.log(it)
                     this.tableData = it
                     this.load_mode =false;
                    //   //// console.log(456)
                    this.$emit('data', it);
                });
                return;
            }
            this.$emit('filter', item);
        },
        handleSelectionChange(e) {
            this.selected = e;
            this.$emit('selected', e);
        },
        doBatch(e, confirm) {
            if (!confirm && 'delete' === e) {
                this.$confirm('', '确认删除？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    this.doBatch(e, true);
                });
                return;
            }
            if('export' === e){
                this.exportData(this.selected.map(it=>{return it.id}).join(","),true)
                return
            }
            this.$emit(e, this.selected);
        },
        onDeleted(e) {
            this.tableData.content = this.tableData.content.filter(it => {
                return (
                    e.filter(item => {
                        return item.id == it.id;
                    }).length == 0
                );
            });
        },
        onAdd(e) {
            let count=0
            this.tableData.content.map(it=>{
                if(it.id != e.id){
                    count++
                }else{
                    it = e
                }
            })
            if(count==this.tableData.content.length){
                this.tableData.content.unshift(e);
            }
            
        },
        onUpdate(e) {
            this.tableData.content = this.tableData.content.map(it => {
                e.forEach(item => {
                    if (item.id === it.id) {
                        it = item;
                    }
                });
                return it;
            });
        },
        getValueFromItem(item, key) {
            if (key.indexOf('.') < 0) {
                return item[key];
            }
            let keys = key.split('.');

            keys.forEach(it => {
                let previous = item
                item = item[it];
                if(!item){
                    item = previous
                }
            });
            return item;
        },
        getStyle(valueItem, metaItem) {
            let style={
                color:'#333'
            }
            if(metaItem.color){
                style = {
                color: metaItem.color
              }
            }
           
            if (metaItem.clickable) {
                style.color = '#409EFF';
                style.cursor = 'pointer';
            }
            return style;
        },
        onCellClick(row, column, cell, event) {
            
            let meta = this.tableHeader[cell.cellIndex-1]
            
            if(!meta || !meta.clickable){
                return
            }
            this.$emit('cellClick', column.property, row, column.rowSpan, column.colSpan);
        },
        exportData(ids,news){
            this.$confirm('是否确认导出数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {

                    this.load_exp = true
                       this.$emit('export')
                        let payload = this.parseFilterValues()
                        if(ids && typeof ids ==='string'){
                            payload = {ids:ids}
                        }
                        this.ax.get(this.dataUrl+"/export",{params:payload}).then(it =>{
                            this.load_exp = false
                            if(it.msg){
                                this.$message.success(it.msg)
                                return
                            }else{
                                FileSaver.saveAs(it.url,"数据导出.xlsx")
                            }
                        }).catch(it =>{
                            this.load_exp = false
                        })

                    //     let newTab
                    //     if(news){
                    //          newTab = window.open();
                    //     }
                    //    this.$emit('export')
                    //     let payload = this.filter
                    //     if(ids && typeof ids ==='string'){
                    //         payload = {ids:ids}
                    //     }
                    //     this.ax.get(this.dataUrl+"/export",{params:payload}).then(it =>{
                    //         //// console.log(it)
                    //         if(it.msg){
                    //             this.$message.success(it.msg)
                    //             return
                    //         }else{
                    //              newTab.location = it.url
                    //         }
                        
                    //     })

                }).catch(() => {
                   
                });
         
        },
        // 查看
        lookMore(e){
            
                this.$alert(e,  {
                confirmButtonText: '确定',
                callback: action => {
                  
                }
                });
            
        },
    }
};
</script>
<style>
.el-header {
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    overflow: hidden;
    height: auto;
    padding: 10px 10px 0px 10px;
    min-height: 60px;
}
.el-main {
    padding: 0;
}
.el-footer {
    padding: 0 10px;
}
.btn_click {
    width: 64px;
    height: 38px;
    font-size: 14px;
    box-sizing: border-box;
}
.cope_text {
    user-select: text;
}

.el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width: auto;
}

.el-header{
    background: #fff;
    padding: 20px;
}
.selectBOX{
    max-width: 80%;
}
.setChooseBox{
    max-width: 35%;
}
</style>

