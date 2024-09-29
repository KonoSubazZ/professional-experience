<template>
    <div class="container">
        <div class="searchInfo display_flex between padding_20">
            <div class="display_flex flex_center">
                <view-form :list="list" @getForm="getInfo" :model="form" :labelWidth="'100px'"></view-form>
                <el-button type="primary" icon="el-icon-search" plain @click="search()" class="m-b-30" :loading="load_mode">搜索</el-button>
            </div>
            <div class="m-b-30">
                <el-button-group>
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-download"
                        @click="exportData('/manage/united/clusterIndex/platformOnlineResExcel')"
                        >导出</el-button
                    >
                    <el-button type="primary" plain icon="el-icon-printer" @click="print('user')">打印</el-button>
                </el-button-group>
            </div>
        </div>

        <div class="over">
            <div class="padding_20 m-b-20" :style="$height(270)" id="user">
                <el-table :data="tableData" stripe border height="100%" show-summary style="width: 100%">
                    <el-table-column type="index"> </el-table-column>
                    <el-table-column prop="platformName" label="平台名称"> </el-table-column>
                    <el-table-column prop="managerNumber" label="管理员数量"> </el-table-column>
                    <el-table-column prop="managerOnlineNumber" label="在线管理员数量"> </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="jump(scope.row)" type="text" size="small"> 查看管理员 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 馆藏 -->
        <el-dialog title="馆藏明细" :visible.sync="showTable" width="65%" top="5vh" :close-on-click-modal="false" @close="close">
            <!-- <view-form  :list ='listCol'  :model='form' ></view-form> -->
            <div class="display_flex between padding_20">
                <div class="display_flex flex_center w-70">
                    <view-form :list="listCol" :model="searchInfo" class=""></view-form>
                    <el-button type="primary" icon="el-icon-search" plain @click="dosearch()" class="m-b-30" :loading="load_mode">搜索</el-button>
                </div>
                <div class="m-b-30">
                    <el-button-group>
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-download"
                            @click="exportData('/manage/united/clusterIndex/platformOnlineUserResExcel')"
                            >导出</el-button
                        >
                        <el-button type="primary" plain icon="el-icon-printer" @click="print('users')">打印</el-button>
                    </el-button-group>
                </div>
            </div>
            <div class="padding_20 m-b-20" id="users">
                <el-table :data="data.content" stripe border style="width: 100%">
                    <el-table-column type="index" width="50"> </el-table-column>

                    <el-table-column prop="managerName" label="用户名称"> </el-table-column>

                    <el-table-column prop="lastUpTime" label="最后登到时间"> </el-table-column>

                    <el-table-column prop="lastDay" label="离线天数"> </el-table-column>

                    <el-table-column prop="isOnline" label="是否在线"> </el-table-column>
                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showTable = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import viewForm from '../../../view/form';

export default {
    components: {
        viewForm
    },
    data() {
        return {
            bus: this.bus(this),
            form: {},
            searchInfo: {},
            data: [],
            show: true,
            load_mode: false,
            showTable: false,
            tableData: [],
            listCol: [
                {
                    name: '状态',
                    id: 'status',
                    type: 'select',
                    options: [
                        { name: '在线', id: true },
                        { name: '未在线', id: false }
                    ]
                },
                { name: '日期', id: 'start', end: 'end', type: 'aroundTimes', options: [] }
            ],
            list: [
                { name: '单位名称', id: 'platformId', relation: 'platformName', type: 'select', options: [] },
                { name: '日期', id: 'start', end: 'end', type: 'aroundTimes', options: [] }
            ]
        };
    },
    created() {
        // this.getMeta()
        this.getList();
        this.search();
    },
    methods: {
        close() {},
        jump(row) {
            this.url =
                '/manage/united/clusterIndex/platformOnlineUserRes?platformId=' + row.platformId + '&platformName=' + row.platformName;
            this.showTable = true;
            this.dosearch();
        },
        // 获取单位列表
        getList() {
            this.ax.get('/manage/united/unitedGenral/platform').then((res) => {
                this.list[0].options = res.content;
            });
        },
        // search参数
        getInfo(val) {
            this.form = val;
            // console.log(val)
        },
        dosearch() {
            this.searchInfo.size = 999;
            this.searchInfo.page = 0;
            this.ax.get(this.url, { params: this.searchInfo }).then((res) => {
                this.data = res;
                // this.total  = res.page.total
            });
        },
        // 检索
        search() {
            this.load_mode = true;
            this.form.page = 0;
            this.form.size = 999;
            this.ax
                .get('/manage/united/clusterIndex/platformOnlineRes', { params: this.form })
                .then((res) => {
                    this.load_mode = false;
                    // console.log(res)
                    this.tableData = res.content;
                })
                .catch((res) => {
                    this.load_mode = false;
                });
        },

        exportData(url) {
            this.ax.get(url, { params: this.searchInfo }).then((res) => {
                console.log(res);
                let name = res.split('/')[1];
                this.FileSaver.saveAs(res, name);
            });
        },
        print(id) {
            let printPage = document.getElementById(id);
            var f = document.getElementById('printf');
            f.contentDocument.write(printPage.innerHTML);
            f.contentDocument.write(`<style type="text/css">
                .el-table td, .el-table th.is-leaf {
                    border-bottom: 1px solid #EBEEF5;
                }.el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
                padding-left: 10px;
            }
            .el-table td, .el-table th.is-leaf {
                    border-bottom: 1px solid #EBEEF5;
                }
            .el-table thead {
                color: #909399;
                font-weight: 500;
            }
            .el-table td, .el-table th {
                padding: 12px 0;
                min-width: 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: left;
            }
            .el-table__body-wrapper, .el-table__footer-wrapper, .el-table__header-wrapper {
                width: 100%;
            }
            .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
                    border-right: 1px solid #EBEEF5;
                }
            .el-table__body-wrapper {
                overflow: hidden;
                position: relative;
            }
            .el-table th>.cell {
                display: inline-block;
                box-sizing: border-box;
                position: relative;
                vertical-align: middle;
                padding-left: 10px;
                padding-right: 10px;
                width: 100%;
            }
            .el-table--mini, .el-table--small, .el-table__expand-icon {
                font-size: 12px;
            }
            .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
                padding-left: 10px;
            }
            .el-table .cell {
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                word-break: break-all;
                line-height: 23px;
                padding-right: 10px;
            }
            .A4{
                background: #fff;
                margin:0 auto;
                
            border:1px solid #ddd;

            }
                    </style>`);
            f.contentDocument.close();
            f.contentWindow.print();
        }
    }
};
</script>

<style scoped>
.searchInfo {
    padding-top: 20px;
}
.color_d {
    text-align: center;
    color: #dddddd;
}
.over {
    overflow: auto;
}
</style>
