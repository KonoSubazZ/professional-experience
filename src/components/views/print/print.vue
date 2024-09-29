<template>
    <div class="backBG" :style="$height(110)">
        <div class="display_flex end w-100">
            <el-button type="primary" @click="print">打印</el-button>
        </div>

        <div id="A4">
            <div class="A4">
                <el-table :data="data.content" label="更新" border stripe ref="templateList">
                    <el-table-column type="index" width="50"> </el-table-column>
                    <template v-for="item in meta">
                        <el-table-column align="center" :label="item.name" :prop="item.key" :key="item.key" v-if="item.type === 'IMAGE'">
                            <template slot-scope="scope" align="center">
                                <el-image
                                    v-if="scope.row[item.key]"
                                    :src="scope.row[item.key]"
                                    :fit="'cover'"
                                    :preview-src-list="[scope.row[item.key]]"
                                    style="width: 4rem; height: 4rem"
                                ></el-image>
                                <div v-else>没有图片</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            align="center"
                            :label="item.name"
                            :prop="item.key"
                            :key="item.key"
                            v-else-if="item.type === 'TIMESTAMP'"
                        >
                            <template slot-scope="scope">{{ getTimestamp(scope.row[item.key]) }}</template>
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
                                <div class="123" :style="'color:' + getOptionsColor(item.searchOption, [scope.row[item.key]])">
                                    {{ getOptionsValue(item.searchOption, [scope.row[item.key]]) }}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            align="center"
                            :label="item.name"
                            :prop="item.key"
                            :key="item.key"
                            :width="item.width ? item.width : ''"
                            :sortable="item.sortable"
                            v-else
                        >
                            <template slot-scope="scope">
                                <div
                                    :style="getStyle(scope.row, item)"
                                    v-html="item.key == 'borrowDate' || item.key == 'borrowAlso' || item.key == 'borrowBookTime' ?(`${scope.row[item.key].split(' ')[0]}<br> ${scope.row[item.key].split(' ')[1]}`) : getValueFromItem(scope.row, item.key)"
                                    class="less3"
                                    :class="
                                        getValueFromItem(scope.row, item.key) && getValueFromItem(scope.row, item.key).length > 240
                                            ? 'm-b-10'
                                            : ''
                                    "
                                ></div>

                                <div class="display_flex end">
                                    <el-button
                                        type="text"
                                        v-if="getValueFromItem(scope.row, item.key) && getValueFromItem(scope.row, item.key).length > 240"
                                        @click="lookMore(getValueFromItem(scope.row, item.key))"
                                        >查看全部</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bus: this.bus(this),
            meta: [],
            data: []
        };
    },
    created() {
        this.data = JSON.parse(this.$route.query.data);
        this.data.content = this.data.content ? this.data.content : this.data;
        this.meta = JSON.parse(this.$route.query.meta);
    },
    methods: {
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
        print() {
            let printPage = document.getElementById('A4');
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
                padding: 9px 0;
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
                padding-right: 5px;
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

<style>
.backBG {
    background: #e4e3e3;
    padding-top: 50px;
    padding: 50px;
    overflow: auto;
}
.A4 {
    background: #fff;
    margin: 0 auto;
    width: 800px;
    border: 1px solid #ddd;
    overflow: auto;
}
</style>
