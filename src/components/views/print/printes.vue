<template>
    <div class="backBG" :style="$height(110)">
        <div class="display_flex end w-100">
            <el-button type="primary" @click="print">打印</el-button>
        </div>

        <div id="A4">
            <div class="A4">
                <el-table :data="data" show-summary :summary-method="getSummaries" stripe style="width: 100%">
                    <el-table-column type="index" width="50"> </el-table-column>
                    <el-table-column prop="name" label="分类名称" sortable width="340"> </el-table-column>

                    <el-table-column prop="number" label="分类号" sortable> </el-table-column>

                    <el-table-column prop="countNumber" label="书目条数" sortable> </el-table-column>

                    <el-table-column prop="bookNumber" label="册数" sortable> </el-table-column>

                    <el-table-column prop="totalPrice" label="金额" sortable> </el-table-column>

                    <el-table-column prop="percentage" label="百分比" sortable> </el-table-column>
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
            form: {},
            data: []
        };
    },
    created() {
        // console.log(this.$route.query)
        // if(this.$route.query.id==1){
        //     this.data =  this.$store.getters.getData
        // }
        //  // console.log( this.$store.getters.getData)
        this.form = JSON.parse(this.$route.query.info);
        this.getList();
        // this.meta = JSON.parse(this.$route.query.meta)
        //   // console.log(JSON.parse(this.$route.query.info.data))
    },
    methods: {
        // 获取
        getList() {
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax.get('/manage/unit/catalog/catalogExcel/classificationWorkLoadRes', { params: this.form }).then((res) => {
                //获取内容   需要修改
                this.data = res;
            });
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总价';
                    return;
                }
                const values = data.map((item) => Number(item[column.property]));
                if (!values.every((value) => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index];
                } else {
                    sums[index] = '100%';
                }
            });
            return sums;
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
