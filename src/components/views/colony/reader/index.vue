<template>
    <div class="container">
        <div class="searchInfo display_flex between padding_20">
            <div class="display_flex flex_center w-80">
                <view-form :list="list" @getForm="getInfo" :model="form" :labelWidth="'100px'" class="w-100"></view-form>
                <el-button type="primary" icon="el-icon-search" plain @click="search()" class="m-b-30" :loading="load_mode">搜索</el-button>
            </div>
            <div class="m-b-30">
                <el-button-group>
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-download"
                        @click="exportData('/manage/united/readerStatistics/readerStatisticsExcel')"
                        >导出</el-button
                    >
                    <el-button type="primary" plain icon="el-icon-printer" @click="print('rea')">打印</el-button>
                </el-button-group>
            </div>
        </div>

        <div :style="$height(210)" class="over">
            <div class="padding_20 m-b-20" id="rea">
                <el-table :data="tableData" stripe :summary-method="getSummaries" show-summary style="width: 100%">
                    <el-table-column type="index"> </el-table-column>
                    <el-table-column prop="platformName" label="单位名称"> </el-table-column>
                    <el-table-column prop="teacherNumber" label="老师数量"> </el-table-column>
                    <el-table-column prop="studentNumber" label="学生数量"> </el-table-column>

                    <el-table-column prop="otherNumber" label="其他数量"> </el-table-column>
                    <el-table-column prop="readerNumber" label="读者总数"> </el-table-column>
                </el-table>
            </div>

            <div class="f-s-12 color_d">
                说明：国家标准来源于教基司函〔2018〕51 号文件：教育部关于征求《中小学图书馆（室）规程》意见的通知
            </div>
            <div class="padding_20 display_flex between">
                <div></div>
                <el-button type="primary" plain @click="closeEchart" class="m-b-30">{{ show ? '隐藏图表' : '显示图表' }}</el-button>
            </div>

            <div class="">
                <div id="chart1" :style="{ width: '100%', height: '400px' }" v-show="show"></div>
            </div>
        </div>
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
            show: true,
            load_mode: false,
            tableData: [],
            list: [
                // {name:'读者类型',id:'readerTypeId',relation:'readerTypeName',type:'select',options:[]},

                { name: '单位名称', id: 'platformId', relation: 'platformName', type: 'select', options: [] },

                { name: '日期', id: 'year', type: 'year', options: [] }
            ]
        };
    },
    created() {
        this.getMeta();
        this.getList();
    },
    methods: {
      getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          console.log(column)
          if (index === 0) {
            sums[index] = '合计';
            return;
          }else if(index === 1){
            sums[index] = '';
            return;
          }else if(index === 2){
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
            return
          }else if(index === 3){
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
            return
          }else if(index === 4){
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {

              const value = Number(curr);
              //   debugger

              // value = value.replace(',','')
              if (!isNaN(value)) {

                return prev + curr;
              } else {
                //   // console.log(prev)
                return prev;
              }
            }, 0);
            sums[index]
            return
          }else if(index === 5){
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {

              const value = Number(curr);
              //   debugger

              // value = value.replace(',','')
              if (!isNaN(value)) {

                return prev + curr;
              } else {
                //   // console.log(prev)
                return prev;
              }
            }, 0);
            sums[index]
          }
          else{
            sums[index]=''
            return
          }
        });
        return sums;
      },
        // 获取单位列表
        getList() {
            this.ax.get('/manage/united/unitedGenral/platform').then((res) => {
                this.list[0].options = res.content;
            });
        },
        // 获取单位类型
        getMeta() {
            //  this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Platform' } }).then((res) => {
            //     res.subs.map((it) => {
            //         if (it.key == 'label') {
            //             this.list[0].options = it.searchOption.map(it=>{
            //                 return {name:it.name,id:it.key}
            //             })
            //             // it.searchOption.map((item) => {
            //             //     this.option[item.key] = item;
            //             // });
            //         }
            //     });
            // });
        },
        // search参数
        getInfo(val) {
            this.form = val;
            // console.log(val)
        },
        // 检索
        search() {
            this.load_mode = true;
            this.form.page = 0;
            this.form.size = 999;
            this.ax
                .get('/manage/united/readerStatistics/readerStatistics', { params: this.form })
                .then((res) => {
                    this.load_mode = false;
                    // console.log(res)
                    this.tableData = res;
                    let arr = [];
                    arr = res.map((it) => {
                        it.readerNumber = it.teacherNumber + it.studentNumber + it.otherNumber;
                        return it.platformName;
                    });
                    let series = [[], [], []];
                    res.map((it) => {
                        series[0].push(it.teacherNumber);
                        series[1].push(it.studentNumber);
                        series[2].push(it.otherNumber);
                    });
                    //  return [it.countryAverageBookCollection,it.bookNumber,it.averageBookCollection,it.supplementNumber]
                    // console.log(series)
                    this.drawLine('chart1', arr, series, ['#2699FB', '#FFAE71', '#5BD1A5']);
                })
                // {
                //     name: 'Forest',
                //     type: 'bar',
                //     barGap: 0,
                //     label: labelOption,
                //     data: [320, 332, 301, 334, 390]
                // },
                .catch((res) => {
                    this.load_mode = false;
                });
        },
        closeEchart() {
            this.show = !this.show;
        },
        exportData(url) {
            this.ax.get(url, { params: this.form }).then((res) => {
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
        },
        // 画图
        drawLine(id, data, series, color) {
            // 基于准备好的dom，初始化echarts实例
            //// console.log(this.$echarts);

            let myChart = this.$echarts.init(document.getElementById(id));
            var option = {
                color,
                title: {},
                tooltip: {},
                legend: {
                    data: ['老师', '学生', '其他']
                },
                xAxis: {
                    data
                },
                dataZoom: [
                    {
                        type: 'inside'
                    },
                    {
                        type: 'slider'
                    }
                ],
                yAxis: {},
                series: [
                    {
                        name: '老师',
                        type: 'bar',
                        data: series[0]
                    },
                    {
                        name: '学生',
                        type: 'bar',
                        data: series[1]
                    },
                    {
                        name: '其他',
                        type: 'bar',
                        data: series[2]
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            // 绘制图表
            // myChart.setOption({
            //     color,
            //     // title: {},
            //     // tooltip: {
            //     //     trigger: 'item',
            //     //     formatter: '{a} <br/>{b} : {c} ({d}%)'
            //     // },
            //      xAxis: [
            //         {
            //             // type: 'category',
            //             // axisTick: {show: false},
            //             data:['国家标准','馆藏册数','平均复本','应补数']
            //         }
            //     ],
            //     // legend: {
            //     //     orient: 'vertical',
            //     //     left: 'left',
            //     //     data
            //     // },
            //     series:{
            //        name:'国家标准',
            //        type:'bar',
            //        data:[100,1001,100,100]
            //     }
            // });
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
