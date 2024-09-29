<template>
    <keep-alive>
        <el-container class="bg-white cope_text lists" ref="container">
            <el-header height="auto" ref="tableHeader" v-if="!disableAction || !disableFilter">
                <div class="display_flex start between header_choose w-100">
                    <div class="selectBOX">
                        <div class="display_flex around start" style="transition: 0.5s"
                            :class="open ? 'hiddle' : 'openhiddle'">
                            <div ref="headerTop" class="w-100">
                                <slot name="func"> </slot>
                                <slot name="filters">
                                    <template v-if="searchFiled && searchFiled.length && !disableFilter">
                                        <div class="display_flex w-100" :class="searchFiled.length > 3 ? 'wrap' : ''">
                                            <slot name="filter-prefix"></slot>

                                            <template v-for="(item, i) in searchFiled">
                                                <div class="m-r-20 m-b-10" :key="i">
                                                    <el-select clearable filterable v-model="filter[item.key]"
                                                        :key="item.key"
                                                        v-if="Array.isArray(item.options) && $route.meta.title != '读者单位管理' && $route.meta.title !== '架位号设定'"
                                                        :placeholder="item.name">
                                                        <el-option :label="'全部' + item.name" :value="null">全部{{
                                                            item.name
                                                        }}</el-option>
                                                        <el-option v-for="option in item.options" :key="option.key"
                                                            :value="option.key" :label="option.name"></el-option>
                                                    </el-select>
                                                    <el-select filterable v-model="presenceStatus" :key="item.key"
                                                        v-else-if="Array.isArray(item.options) && $route.meta.title == '读者单位管理'"
                                                        :placeholder="item.name">
                                                        <el-option v-for="option in item.options" :key="option.key"
                                                            :value="option.key" :label="option.name"></el-option>
                                                    </el-select>
                                                    <el-select :clearable="true" filterable v-model="filter[item.key]"
                                                        :key="item.key" v-else-if="item.select"
                                                        :placeholder="item.name">
                                                        <el-option v-for="option in item.options" :key="option.key"
                                                            :value="option.key" :label="option.name"></el-option>
                                                    </el-select>
                                                    <el-date-picker v-else-if="item.type === 'TIMESTAMP'"
                                                        :key="item.key" v-model="filter[item.key]"
                                                        value-format="timestamp" :picker-options="pickerOptions"
                                                        type="datetimerange" range-separator="至"
                                                        :start-placeholder="item.name + '开始'"
                                                        :end-placeholder="item.name + '结束'"
                                                        :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                                                    <el-input @keyup.enter.native="doSearch" :placeholder="item.name"
                                                        v-model="filter[item.key]" clearable :key="item.key"
                                                        v-else></el-input>
                                                </div>
                                            </template>

                                            <slot name="filter"></slot>
                                        </div>
                                    </template>
                                </slot>
                            </div>
                            <div class="">
                                <el-button type="primary" class="" icon="el-icon-search" plain @click="search()"
                                    :loading="load_mode"
                                    v-if="searchFiled && searchFiled.length && !disableFilter">搜索</el-button>
                            </div>
                        </div>
                        <div class="open cursor" v-if="showHeader" @click="showOpen">
                            <i class="el-icon-arrow-down f-s-12" :class="open ? '' : 'openActive'"></i>
                            <span class="f-s-12">{{ open ? '展开' : '收起' }}</span>
                        </div>
                    </div>
                    <div class="display_flex end setChooseBox" v-if="!disableAction">
                        <slot name="actions">
                            <slot name="addition-actions"></slot>
                            <el-button type="danger" plain icon="el-icon-delete" @click="doBatch('delete')"
                                v-if="deletetable">删除</el-button>
                            <el-button type="primary" plain icon="el-icon-download" @click="exportData"
                                v-if="exportable">导出</el-button>
                            <el-button type="success" plain icon="el-icon-circle-plus-outline" v-if="insertable"
                                @click="$emit('create', selected)">{{ actionName ? actionName : '添加' }}</el-button>
                        </slot>
                    </div>
                </div>
                <!-- 新增选择框 -->
                <div class="w-100">
                    <slot name="chooseBox"></slot>
                </div>
            </el-header>

            <el-main :style="'height:' + tablePadding + 'px; overflow: auto;transition: 0.2s;'" v-loading="load">
                <div class="bg-white" style="height: 100%">
                    <template v-if="tableData">
                        <el-table :data="tableData.content" stripe label="更新" border height="100%" ref="templateList"
                            @cell-click="onCellClick" @current-change="handleCurrentChoose"
                            @selection-change="handleSelectionChange">
                            <el-table-column label type="selection" v-if="batchAction"></el-table-column>

                            <el-table-column v-if="isSort" key="fff" align="center">
                                <template slot-scope="scope" align="center">
                                    {{ tableData.size * tableData.number + scope.$index + 1 }}
                                </template>
                            </el-table-column>

                            <template v-for="item in tableHeader">
                                <!-- 20240126新增针对读者库照片如果又facekey:人脸通过那么显示绿色框反之显示红色 --修改了这里 -->
                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    v-if="item.type === 'IMAGE' && $route.path == '/circulation/reader/index'">
                                    <template slot-scope="scope" align="center">
                                        <div class="readerBorder readerGreen"
                                            v-if="scope.row[item.key] && scope.row.faceKey" style=" ">
                                            <el-image v-if="scope.row[item.key]" :src="scope.row[item.key]"
                                                :fit="'cover'" :preview-src-list="[scope.row[item.key]]"
                                                style="width: 100%; height: 100%"></el-image>
                                        </div>
                                        <div class="readerBorder readerRed"
                                            v-else-if="scope.row[item.key] && !scope.row.faceKey">
                                            <el-image v-if="scope.row[item.key]" :src="scope.row[item.key]"
                                                :fit="'cover'" :preview-src-list="[scope.row[item.key]]"
                                                style="width: 100%; height: 100%"></el-image>
                                        </div>
                                        <div v-else>没有图片</div>
                                    </template>
                                </el-table-column>
                                <!-- 读者评论新增的逻辑 -->
                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    v-else-if="item.key === 'reviewStatus'">
                                    <template slot-scope="scope" align="center">
                                        {{ scope.row[item.key] == 0 ? '待审核' : scope.row[item.key] == 1 ? '审核通过' :
                                        '审核未通过' }}
                                    </template>

                                </el-table-column>
                                <!-- 读者评论新增的逻辑 -->
                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    v-else-if="item.key === 'comment'">
                                    <template slot-scope="scope" align="center">
                                        {{ scope.row[item.key].length > 10 ?
                                            scope.row[item.key].slice(0,10)+'...':scope.row[item.key]}}
                                    </template>

                                </el-table-column>
                                <!-- 如果不是读者库这个路由那么继续显示之前的 -->
                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    v-else-if="item.type === 'IMAGE' && $route.path != '/circulation/reader/index'">
                                    <template slot-scope="scope" align="center">
                                        <el-image v-if="scope.row[item.key]" :src="scope.row[item.key]" :fit="'cover'"
                                            :preview-src-list="[scope.row[item.key]]"
                                            style="width: 4rem; height: 4rem"></el-image>
                                        <div v-else>没有图片</div>
                                    </template>

                                </el-table-column>

                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    sortable v-else-if="item.type === 'TIMESTAMP'">
                                    <template slot-scope="scope">
                                        <div :style="(scope.row['expiredTime'] - nowTime < 86400000 * 3 ||
                                            Math.sign(scope.row['expiredTime'] - nowTime) == -1) &&
                                            item.key == 'expiredTime'
                                            ? 'color:red'
                                            : 'color:#606266'
                                            ">
                                            {{ getTimestamp(scope.row[item.key]) }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    sortable v-else-if="Array.isArray(item.searchOption)">
                                    <template slot-scope="scope">
                                        <div class="123"
                                            :style="'color:' + getOptionsColor(item.searchOption, [scope.row[item.key]])">
                                            {{ getOptionsValue(item.searchOption, [scope.row[item.key]]) }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key"
                                    sortable v-else>
                                    <template slot-scope="scope">
                                        <div v-if="item.btn">
                                            <el-button size="mini" type="text" class="m-r-20" v-if="editable"
                                                icon="el-icon-edit"
                                                @click="$emit('edit', { key: item.key, value: [scope.row] })">编辑</el-button>
                                        </div>
                                        <div v-else>
                                            <div :style="getStyle(scope.row, item)"
                                                v-html="getValueFromItemes(scope.row, item.key)" class="less3 iconmax"
                                                :class="getValueFromItem(scope.row, item.key) &&
                                                    getValueFromItem(scope.row, item.key).length > 240
                                                    ? 'm-b-10'
                                                    : ''
                                                    "></div>

                                            <div class="display_flex end">
                                                <el-button type="text" v-if="getValueFromItem(scope.row, item.key) &&
                                                    getValueFromItem(scope.row, item.key).length > 240
                                                "
                                                    @click="lookMore(getValueFromItem(scope.row, item.key))">查看全部</el-button>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                            <el-table-column width="240" align="center" label="操作"
                                v-if="!disableTableAction && tableData && tableData.content">
                                <template slot-scope="scope">
                                    <div class="table-action flex-row flex-wrap flex_center"
                                        style="display: flex; justify-content: center; flex-wrap: wrap; align-items: center">
                                        <slot name="addition-table-actions" :item="scope"></slot>
                                        <div v-if="$route.path != '/manage/parameter/admin'">
                                            <el-button size="mini" type="text" class="m-r-20" v-if="editable"
                                                icon="el-icon-edit" @click="$emit('edit', [scope.row])">{{ editName ?
                                                    editName : '编辑' }}</el-button>
                                        </div>
                                        <div v-else>
                                            <el-button size="mini" type="text" class="m-r-20"
                                                v-if="adminEdit(scope.row)" icon="el-icon-edit"
                                                @click="$emit('edit', [scope.row])">{{ editName ?
                                                    editName : '编辑' }}</el-button>
                                        </div>
                                        <div v-if="$route.path != '/manage/parameter/admin'">
                                            <delete-button :tip="'是否删除?'" :delNames="delName"
                                                v-if="deletetable || showDeleteText" :loading="scope.row.loading"
                                                @deletes="$emit('delete', [scope.row])"></delete-button>
                                        </div>
                                        <div v-else>
                                            <delete-button :tip="'是否删除?'" :delNames="delName"
                                                v-if="adminLogin(scope.row)" :loading="scope.row.loading"
                                                @deletes="$emit('delete', [scope.row])"></delete-button>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </el-main>

            <el-footer ref="tableFooter" class="flex-row between flex-center">
                <div class="pagination" v-if="tableData">
                    <el-pagination background layout="sizes,total, prev, pager, next"
                        :current-page="tableData.number + 1" :page-sizes="[20, 100, 200, 300, 500]"
                        :page-size="tableData.size" :total="tableData.totalElements" @size-change="onPageSizeChange"
                        @current-change="onPageChange"></el-pagination>
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
import ticketUtil from '../../utils/ticket';
export default {
    name: 'list',
    props: [
        'editName',
        'showDeleteText',
        'delAll',
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
        'disableBtn',
        'isHeaderHeigt',
        'load_modes',
        'faceValue',
        'nonephoto',
        'readerUnitName',
        'childId'
    ],
    components: { DeleteButton },
    data() {
        return {
            presenceStatus: 1,
            nowTime: new Date().getTime(),
            bus: this.bus(this),
            showHeader: false,
            open: true,
            height: '',
            times: false,
            headerHeight: '',
            load: false,
            // load_mode
            load_mode: false,
            // 导出
            load_exp: false,
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
            // filter: {unitPresenceStatus:1,presenceStatus:1},
            filter: {},
            metaData: null,
            tablePadding: 0,
            tableData: {},
            selected: [],
            searchInfo: [],
            red: 'red',
            collectionPlaces: [],
            childIdData: "",
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
        $route(val1, val2) {
            if (val1.path != this.$route.path) {
                return;
            }
            this.headerHeight = this.$refs.headerTop.clientHeight;
            if (this.headerHeight && this.headerHeight > 60) {
                this.showHeader = true;
            } else {
                this.showHeader = false;
            }
        },
        load_modes(val) {
            if (!val) {
                this.load_mode = val;
            }
        },
        data(val) {
            // console.log(val)
            this.tableData = val;
        },

        tableMeta(val) {
            if (val) {
                this.calcTableHeight();
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
            handler: function (cur, pre) {
                this.$emit('filterChange', cur);
            }
        },
        childId: {
            handler: function (newVal, oldVal) {
                this.childIdData = newVal
                const item = {
                    page:0,
                    platformId:JSON.parse(localStorage.getItem('user')).platform.id ,
                    presenceStatus:1,
                    size:20
                }
                this.getListData(item)
            }
        }
    },
    created() {
        console.log(this.$route.path != '/circulation/reader/index', '----sadas');
        this.callNumberSettingFn()
        this.getMetaData();
        if (this.searchName) {
            this.filter = this.searchName;
        }
        this.doSearch();
        // // // console.log(123)
        if (this.tableMeta) {
            this.metaData = this.tableMeta;
        }
        if (this.data) {
            // // // console.log(this.data)
            this.tableData = this.data;
        }
    },
    mounted() {
        console.log(this.searchFiled, 'searchFiled');
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.bus.$on('add_' + this.dataUrl, (e) => {
            this.calcTableHeight();
            if (this.times) {
            } else {
                this.onAdd(e);
                this.times = true;
                setTimeout((res) => {
                    this.times = false;
                }, 2000);
            }
        });
        this.bus.$on('flash', (res) => {
            this.calcTableHeight();
            if (this.times) {
            } else {
                this.doSearch();
                this.times = true;
                setTimeout((res) => {
                    this.times = false;
                }, 2000);
            }
        });
        this.bus.$on('flash_' + this.dataUrl, (res) => {
            this.calcTableHeight();
            if (this.times) {
            } else {
                this.doSearch();
                this.times = true;
                setTimeout((res) => {
                    this.times = false;
                }, 500);
            }
        });
        setTimeout((res) => {
            this.headerHeight = this.$refs.headerTop.clientHeight;
            if (this.headerHeight && this.headerHeight > 50) {
                this.showHeader = true;
            } else {
                this.showHeader = false;
            }
        }, 1000);
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientHeight;
                this.screenWidth = window.screenWidth;
            })();
        };
    },

    computed: {
        tableStyle() {
            setTimeout((res) => {
                if (this.disableCalculateHeight) {
                    return 400;
                }
                return this.tablePadding;
            });
        },
        searchFiled() {
            let filters = this.filters;
            if (!filters) {
                filters =
                    this.metaData &&
                    this.metaData.subs.filter((it) => {
                        return it.searchable;
                    });
            }
            if (!filters) {
                return [];
            }
            let vm = this;
            console.log(this.metaData, '--this.metaData');
            return filters.map((it) => {
                Vue.set(vm.filter, it.key, vm.filter[it.key]);
                return {
                    name: it.name,
                    key: it.key,
                    type: it.type,
                    placeholder: it.name,
                    options: it.searchOption,
                    clickable: it.clickable,
                    select: it.select
                };
            });
        },

        tableHeader() {
            if (!this.metaData) {
                return [];
            }
            this.metaData.subs.sort(this.arraySort('sort'));
            console.log(this.metaData.subs.filter((it) => {
                return it.displayInList;
            }), '--List--');
            return this.metaData.subs.filter((it) => {
                return it.displayInList;
            });
        },
        insertable() {
            return this.metaData && this.metaData.insertable;
        },
        deletetable() {
            return this.metaData && (this.metaData.delete == 'DELETE' || this.metaData.delete == 'DELETE_BOTH');
        },
        batchDeleteable() {
            return (
                this.metaData &&
                (this.metaData.delete == 'DELETE_BATCH' ||
                    this.metaData.delete == 'DELETE_BOTH' ||
                    (this.deletetable && this.selected.length == 1))
            );
        },
        editable() {
            return this.metaData && (this.metaData.edit == 'EDIT' || this.metaData.edit == 'EDIT_BOTH');
        },
        batchEditable() {
            return this.metaData && (this.metaData.edit == 'EDIT_BATCH' || this.metaData.edit == 'EDIT_BOTH');
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
        // 新增的获取索书号显示条件
        callNumberSettingFn() {
            this.ax.get('/manage/unit/system/systemSettings/callNumberSetting', { params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id } }).then(res => {
                if (res.type == 'ONE') {
                    this.V_cableType = 'speciesNumber';
                } else if (res.type == 'TWO') {
                    this.V_cableType = 'authorNumber';
                } else if (res.type == 'THERE') {
                    this.V_cableType = 'sihms';
                } else if (res.type == 'FOUR') {
                    this.V_cableType = 'authorNumberSZM';
                }
            });
        },
        arraySort(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            };
        },
        adminLogin(row) {
            if (
                JSON.parse(localStorage.getItem('user')).info.type == row.type ||
                (row.type == 'SUPER_MANAGER' && JSON.parse(localStorage.getItem('user')).info.type == 'MANAGER')
            ) {
                return false;
            } else {
                return true;
            }
        },
        adminEdit(row) {
            if (JSON.parse(localStorage.getItem('user')).info.type == 'SUPER_MANAGER' || row.type != 'SUPER_MANAGER') {
                return true;
            } else {
                return false;
            }
        },
        // showOpen
        showOpen() {
            this.open = !this.open;
            this.calcTableHeight(true);
        },
        // 单选
        handleCurrentChoose(val) {
            // // // console.log(val)
            // // // console.log(1)
            this.$refs.templateList.clearSelection();
            this.$refs.templateList.toggleRowSelection(val);
        },
        setFilterValue(key, value) {
            Vue.set(this.filter, key, value);
        },
        findFilterChangeKey(cur, previous) {
            let changed = [];
            for (let key in cur) {
                //// // console.log(cur[key]);
                //// // console.log(previous[key]);
                if (cur[key] != previous[key]) {
                    changed.push({ key: key, cur: cur[key], pre: previous[key] });
                }
            }
            return changed;
        },
        getTimestamp(value) {
            if (!value) {
                return;
            }
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
        getOptionsValue(options, key) {
            let items = options.filter((it) => {
                return it.key == key;
            });
            return (items && items.length && items[0].name) || key[0];
        },
        getOptionsColor(options, key) {
            let items = options.filter((it) => {
                return it.key == key;
            });
            return (items && items.length && items[0].color) || '';
        },
        calcTableHeight(val) {
            setTimeout((res) => {
                let footHeight = this.$refs.tableFooter.$el.clientHeight;
                let headHeight = this.$refs.tableHeader.$el.clientHeight;
                if (this.isHeaderHeigt && !val) {
                    this.tablePadding = document.documentElement.clientHeight - footHeight - headHeight - 150 - this.isHeaderHeigt;
                } else {
                    this.tablePadding = document.documentElement.clientHeight - footHeight - headHeight - 150;
                }
            }, 100);
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
            this.ax
                .get(metaUrl)
                .then((it) => {
                    vm.metaData = it;
                    vm.$emit('meta', it);
                })
                .catch((it) => {
                    //// // console.log(it)
                });
        },
        search() {
            //    人脸识别

            this.pageInfo.page = 0;
            this.load_mode = true;
            setTimeout((res) => {
                this.load_mode = false;
            }, 3000);
            this.doSearch();
        },
        doSearch() {
            let filter = Object.assign({}, this.filter);
            let times = [];
            for (let key in filter) {
                let item = filter[key];
                // // console.log(item)
                if (Array.isArray(item)) {
                    times.push({ key: key, time: item });
                    delete filter[key];
                } else if (item === '') {
                    delete filter[key];
                }
            }
            let timeFilter = times
                .map((it) => {
                    return it.key + ',' + it.time[0] + ',' + it.time[1];
                })
                .join(';');
            if (timeFilter) {
                filter.times = timeFilter;
            }
            let platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            let search = { platformId, page: this.pageInfo.page, size: this.pageInfo.size, ...filter };
            console.log(search, '---search');
            this.searchInfo = search;
            // 20240220新增当选择了人脸认证检索的时候
            if (this.faceValue) {
                if (this.faceValue == 'facekeyTrue') {//认证通过
                    search.faceOk = 1
                } else if (this.faceValue == 'facekeyFalse') {//认证失败
                    search.faceOk = 0
                } else {
                    search.faceOk = null
                    console.log(search, '--search');
                }
            }
            if (this.nonephoto) {
                if (this.nonephoto == 'photoTrue') {
                    search.photoOk = 1
                } else if (this.nonephoto == 'photoFalse') {
                    search.photoOk = 0
                } else {
                    search.photoOk = null
                }

            }
            if(this.readerUnitName){
                search.readerUnitName = this.readerUnitName
                console.log(search)
            }
            this.sloading();
            this.$emit('search', search);

            this.getListData(search);
        },
        onPageSizeChange(e) {
            this.pageInfo.size = e;
            this.loading();
            this.doSearch();
        },
        onPageChange(e) {
            this.pageInfo.page = e - 1;
            this.loading();
            this.doSearch();
        },
        async getCollection() {
            return await this.ax.get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting', {
                params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
            });
        },
        getListData(item) {
            item.childId = this.childIdData;
            console.log(item, '/manage/unit/circulation/readerManagement/readerUnit');
            this.load = true;
            if (this.dataUrl && this.method == 'POST') {
                this.ax.post(this.dataUrl, { params: item }).then((it) => {
                    // //// // console.log(it)
                    this.tableData = it;
                    this.load_mode = false;
                    this.load = false;
                    //   //// // console.log(456)
                    this.sloading();
                    this.$emit('data', it);
                });

                return;
            } else if (this.dataUrl) {
                if (!item) {//后加的,因为在别的组件调用这个组件的这个方法,没有传参的话接口没有数据
                    item = {
                        page: 0,
                        platformId: 2,
                        size: 20,
                    }
                }
                if (this.dataUrl == '/manage/unit/circulation/readerManagement/readerUnit') {
                    item.presenceStatus = this.presenceStatus;
                }
                console.log(item, '---item');
                // item.faceOk = 0
                // item.photoOk = 0
                this.ax.get(this.dataUrl, { params: item }).then(async (it) => {
                    if (this.dataUrl == '/manage/unit/circulation/circulationManagement/borrowingInformation') {
                        it.content = it.content.map((e) => ({
                            ...e,
                            positiveTitle:
                                e.positiveTitle +
                                (!e.subTitle && !e.sectionTitle && !e.sectionNumber ? '' : ' : ') +
                                (e.subTitle && e.subTitle != 'NULL' ? e.subTitle + ' / ' : '') +
                                (e.sectionTitle && e.sectionTitle != 'NULL' ? e.sectionTitle + ' . ' : '') +
                                (e.sectionNumber && e.sectionNumber != 'NULL' ? e.sectionNumber : '')
                        }));
                    }
                    if (this.dataUrl == '/manage/unit/catalog/collectionHandling/rackBook') {
                        it.content = it.content.map(e => ({
                            ...e,
                            classificationNumber: e.callNumber,
                            rackName: e.rackName ? e.rackName + '层' : ''
                        }))
                    }
                    if (this.dataUrl == '/manage/unit/catalog/collectionHandling/unusedBookBase') {
                        it.content = it.content.map(e => ({
                            ...e,
                            classificationNumber: e[this.V_cableType] ? e.classificationNumber + '/' + e[this.V_cableType] : e.classificationNumber,//修改了这里

                        }))
                    }

                    //    if(this.dataUrl=='/manage/unit/circulation/readerManagement/reader'){
                    //      it.content = it.content.map(e=>({
                    //        ...e,
                    //        unitPresenceStatus:e.unitPresenceStatus==1?'正常':'已毕业'
                    //      }))
                    //    }
                    // const res = await this.getCollection();
                    // it.content.map(e=>{
                    //   if(e.collectionPlaceName){
                    //     e.collectionPlaceName = e.collectionPlaceId ? res.collectionPlaces.filter(t=>t.id == e.collectionPlaceId)[0].name : e.collectionPlaceName
                    //   }
                    // })
                    console.log(it, 'itt');
                    this.tableData = it;
                    this.load_mode = false;
                    this.load = false;
                    //   //// // console.log(456)
                    this.sloading();
                    this.$emit('data', it);
                });
                return;
            } else {
                this.load = false;
            }
            this.$emit('filter', item);
        },
        handleSelectionChange(e) {
            this.selected = e;
            this.sloading();
            this.$emit('selected', e);
        },
        doBatch(e, confirm) {
            if (!confirm && 'delete' === e) {
                if (this.selected.length == 0) {
                    return this.$message.error('请选择要删除的数据');
                }
                this.$confirm('', '确认删除？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    this.doBatch(e, true);
                });
                return;
            }
            if ('export' === e) {
                this.exportData(
                    this.selected
                        .map((it) => {
                            return it.id;
                        })
                        .join(','),
                    true
                );
                return;
            }

            this.$emit(e, this.selected);
        },
        onDeleted(e) {
            this.tableData.content = this.tableData.content.filter((it) => {
                return (
                    e.filter((item) => {
                        return item.id == it.id;
                    }).length == 0
                );
            });
        },
        onAdd(e) {
            let count = 0;
            this.tableData.content.map((it) => {
                if (it.id != e.id) {
                    count++;
                } else {
                    it = e;
                }
            });
            if (count == this.tableData.content.length) {
                this.tableData.content.unshift(e);
            }
        },
        onUpdate(e) {
            this.tableData.content = this.tableData.content.map((it) => {
                e.forEach((item) => {
                    if (item.id === it.id) {
                        it = item;
                    }
                });
                return it;
            });
        },
        getValueFromItemes(item, key) {
            if (key.indexOf('.') < 0) {
                if (item[key] && item[key].length > 240) {
                    return item[key].substring(0, 240);
                }
                return item[key];
            }
            let keys = key.split('.');
            keys.forEach((it) => {
                let previous = item;
                item = item[it];
                if (!item) {
                    item = previous;
                }
            });
            return item;
        },
        getValueFromItem(item, key) {
            if (key.indexOf('.') < 0) {
                return item[key];
            }
            let keys = key.split('.');

            keys.forEach((it) => {
                let previous = item;
                item = item[it];
                if (!item) {
                    item = previous;
                }
            });
            return item;
        },
        getStyle(valueItem, metaItem) {
            let style = {
                color: '#333'
            };
            if (metaItem.color) {
                style = {
                    color: metaItem.color
                };
            }

            if (metaItem.clickable) {
                style.color = '#409EFF';
                style.cursor = 'pointer';
            }
            return style;
        },
        onCellClick(row, column, cell, event) {
            let meta = this.tableHeader[cell.cellIndex - 1];
            if (!meta || !meta.clickable) {
                return;
            }
            this.$emit('cellClick', column.property, row, column.rowSpan, column.colSpan);
        },
        exportData(ids, news) {
            this.$confirm('是否确认导出数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.load_exp = true;
                    this.$emit('export');
                    let payload = this.searchInfo;

                    this.ax
                        .get(this.dataUrl + '/export', { params: payload })
                        .then((it) => {
                            console.log(it, '--it');
                            let name = '数据导出.xlsx'
                            if (it.indexOf('超期催还表') != -1) {
                                name = it
                            }
                            this.FileSaver.saveAs(it, name);
                        })
                        .catch((it) => {
                            this.load_exp = false;
                        });
                })
                .catch(() => { });
        },
        // 查看
        lookMore(e) {
            this.$alert(e, '提示', {
                dangerouslyUseHTMLString: true
            });

            // this.$alert(e,  {
            // confirmButtonText: '确定',
            // callback: action => {

            // }
            // });
        }
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
    font-size: 14px;
    box-sizing: border-box;
}

.cope_text {
    user-select: text;
}

.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
    width: auto;
}

.el-header {
    background: #fff;
    padding: 20px;
}

.selectBOX {
    max-width: 90%;
    margin-right: 10px;
}

.setChooseBox {
    max-width: 65%;
    flex-wrap: nowrap;
}

.bg-white .search {
    overflow: hidden;
    max-height: 500px;
    transition: 0.3s;
}

.bg-white .hiddle {
    max-height: 40px;
    overflow: hidden;
    transition: 0.5s;
}

.bg-white .openhiddle {
    /* max-height: 200px; */
    transition: 0.5s;
}

.bg-white .open {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
    transition: 0.5s;
}

.bg-white .openActive {
    transform: rotate(180deg);
}

.pagination {
    padding-top: 10px;
    box-sizing: border-box;
}

.iconmax img {
    width: 4rem;
    height: 4rem;
}

.readerBorder {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.readerGreen {
    border: 2px solid green;
}

.readerRed {
    border: 2px solid red;
}
</style>
