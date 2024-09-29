<template>
    <div class="container">
        <div class="searchInfo display_flex between padding_20">
            <div class="display_flex flex_center w-80">
                <view-form :list="list" @getForm="getInfo" :labelWidth="'100px'" class="w-100"></view-form>
                <el-button type="primary" icon="el-icon-search" plain @click="search()" class="m-b-30" :loading="load_mode">搜索</el-button>
            </div>
            <div class="m-b-30">
                <el-button-group>
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-download"
                        @click="exportData('/manage/united/collectionStatistics/classificationStatisticsExcel')"
                        >导出</el-button
                    >
                    <el-button type="primary" plain icon="el-icon-printer" @click="print('cla')">打印</el-button>
                </el-button-group>
            </div>
        </div>

        <div :style="$height(210)" class="over">
            <div class="padding_20 m-b-20" id="cla">
                <div class="display_flex title b-b-1">
                    <div class="w-30">五大类</div>

                    <div class="w-30">22个基本类</div>

                    <div class="w-10">国家标准</div>
                    <div class="w-10">本馆情况</div>
                    <div class="w-10">缺口</div>
                    <div class="w-10">测算结果</div>
                </div>
                <div class="b-l-1 b-r-1">
                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItem">
                            <div class="w-50 b-r-1">第一大类</div>
                            <div class="w-50">马列主义、毛泽东思想</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1 b-l-1">A</div>
                            <div class="w-90 b-r-1">马列主义、毛泽东思想、邓小平理论</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{ tableData[0].countryProp }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[0].prop }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[0].gapProp }}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[0].status == '达标' ? 'color_suc' : 'color_dan'">
                            {{ tableData[0].status }}
                        </div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex">
                            <div class="w-50 b-r-1 containerItem">第二大类</div>
                            <div class="w-50  containerItem">哲学</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1 b-l-1">B</div>
                            <div class="w-90 b-r-1">哲学、宗教</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{ tableData[1].countryProp }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[1].prop }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[1].gapProp }}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[1].status == '达标' ? 'color_suc' : 'color_dan'">
                            {{ tableData[1].status }}
                        </div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItems">
                            <div class="w-50 b-r-1" style="height: 459px; line-height: 459px">第三大类</div>
                            <div class="w-50">社会科学</div>
                        </div>

                        <div class="w-30 b-l-1 b-r-1">
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">C</div>
                                <div class="w-90">社会科学总论</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">D</div>
                                <div class="w-90">政治、法律</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">E</div>
                                <div class="w-90">军事</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">F</div>
                                <div class="w-90">经济</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">G</div>
                                <div class="w-90">文化、科学、教育、体育</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">H</div>
                                <div class="w-90">语言、文字</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">I</div>
                                <div class="w-90">文字</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">J</div>
                                <div class="w-90">艺术</div>
                            </div>
                            <div class="display_flex w-100 containerItem">
                                <div class="w-10 b-r-1">K</div>
                                <div class="w-90">历史、地理</div>
                            </div>
                        </div>

                        <div class="w-10 b-r-1 containerItems" style="height: 459px; line-height: 459px">
                            {{ tableData[2].countryProp }}
                        </div>
                        <div class="w-10 b-r-1 containerItems" style="height: 459px; line-height: 459px">{{ tableData[2].prop }}</div>
                        <div class="w-10 b-r-1 containerItems" style="height: 459px; line-height: 459px">{{ tableData[2].gapProp }}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height: 459px; line-height: 459px"
                            :class="tableData[2].status == '达标' ? 'color_suc' : 'color_dan'"
                        >
                            {{ tableData[2].status }}
                        </div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItems">
                            <div class="w-50 b-r-1" style="height: 510px; line-height: 510px">第四大类</div>
                            <div class="w-50">自然科学</div>
                        </div>
                        <div class="w-30 b-l-1 b-r-1">
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">N</div>
                                <div class="w-90">自科科学总论</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">O</div>
                                <div class="w-90">数理科学与化学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">P</div>
                                <div class="w-90">天文、地球科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">Q</div>
                                <div class="w-90">生物科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">R</div>
                                <div class="w-90">医药、卫生</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">S</div>
                                <div class="w-90">农业科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">T</div>
                                <div class="w-90">工业技术</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">U</div>
                                <div class="w-90">交通运输</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">V</div>
                                <div class="w-90">航空、航天</div>
                            </div>
                            <div class="display_flex w-100 containerItem">
                                <div class="w-10 b-r-1">X</div>
                                <div class="w-90">环境科学、安全科学</div>
                            </div>
                        </div>

                        <div class="w-10 b-r-1 containerItems" style="height: 510px; line-height: 510px">
                            {{ tableData[3].countryProp }}
                        </div>
                        <div class="w-10 b-r-1 containerItems" style="height: 510px; line-height: 510px">{{ tableData[3].prop }}</div>
                        <div class="w-10 b-r-1 containerItems" style="height: 510px; line-height: 510px">{{ tableData[3].gapProp }}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height: 510px; line-height: 510px"
                            :class="tableData[3].status == '达标' ? 'color_suc' : 'color_dan'"
                        >
                            {{ tableData[3].status }}
                        </div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItem">
                            <div class="w-50 b-r-1">第五大类</div>
                            <div class="w-50">综合性图书</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1 b-l-1">Z</div>
                            <div class="w-90 b-r-1">综合性图书</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{ tableData[4].countryProp }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[4].prop }}</div>
                        <div class="w-10 b-r-1 containerItem">{{ tableData[4].gapProp }}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[4].status == '达标' ? 'color_suc' : 'color_dan'">
                            {{ tableData[4].status }}
                        </div>
                    </div>
                </div>

                <!-- <el-table
                    :data="tableData"
                    stripe
                    show-summary
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="单位名称"
                >
                    </el-table-column>
                    <el-table-column
                    prop="countryAverageBookCollection"
                    label="国家标准"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="bookNumber"
                    label="馆藏册数">
                    </el-table-column>
                    <el-table-column
                    prop="averageBookCollection"
                    label="平均复本">
                    </el-table-column>
                    <el-table-column
                    prop="supplementNumber"
                    label="应补数">
                    </el-table-column>
                    <el-table-column
                    prop="status"
                    label="达标情况">
                    <template slot-scope="scope">
                            <div :class="scope.row.status=='达标'?'color_suc':'color_dan'">{{scope.row.status}}</div>
                        </template>
                    </el-table-column>
                
                </el-table>-->
            </div>

            <div class="f-s-12 color_d">
                说明：国家标准来源于教基司函〔2018〕51 号文件：教育部关于征求《中小学图书馆（室）规程》意见的通知
            </div>
            <div class="padding_20 display_flex between">
                <div></div>
                <el-button type="primary" plain @click="closeEchart" class="m-b-30">{{ show ? '隐藏图表' : '显示图表' }}</el-button>
            </div>

            <div class="m-b-20">
                <div id="chart2" :style="{ width: '100%', height: '400px' }" v-show="show"></div>
            </div>

            <div class v-show="show">
                <div id="chart3" :style="{ width: '100%', height: '400px' }"></div>
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
            showTable: false,
            tableData: [
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }]
            ],
            list: [
                { name: '单位名称', id: 'platformId', relation: 'platformName', type: 'select', options: [] },

                { name: '日期', id: 'year', type: 'year', options: [] }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 获取单位列表
        getList() {
            this.ax.get('/manage/united/unitedGenral/platform').then((res) => {
                this.list[0].options = res.content;
            });
        },

        // search参数
        getInfo(val) {
            this.form = val;
        },
        // 检索
        search() {
            this.load_mode = true;
            this.form.page = 0;
            this.form.size = 999;
            this.ax
                .get('/manage/united/collectionStatistics/classificationStatistics', { params: this.form })
                .then((res) => {
                    this.load_mode = false;
                    // // console.log(res)countryProp: 0, prop: 0, gapProp: 0, status: 0
                    let arrS = JSON.stringify(res);
                    this.tableData = JSON.parse(arrS);
                    this.tableData.map((it) => {
                        it.countryProp = (it.countryProp * 100).toFixed(2) + '%';
                        it.prop = (it.prop * 100).toFixed(2) + '%';
                        it.gapProp = (it.gapProp * 100).toFixed(2) + '%';
                    });
                    this.showTable = true;
                    let arr = ['第一大类', '第二大类', '第三大类', '第四大类', '第五大类'];

                    let series = [[], [], [], []];
                    let datas = [[], [], [], [], []];
                    datas = res.map((it) => {
                        series[0].push((it.countryProp * 100).toFixed(2));
                        series[1].push((it.prop * 100).toFixed(2));
                        series[2].push((it.gapProp * 100).toFixed(2));
                        return [
                            { name: '本馆情况', value: (it.prop * 100).toFixed(2) },
                            { name: '缺口', value: (it.gapProp * 100).toFixed(2) }
                        ];
                    });
                    this.drawLines('chart3', datas, ['#ddd', '#2699FB']);
                    this.drawLine('chart2', arr, series, ['#2699FB', '#FFAE71', '#5BD1A5']);
                })

                .catch((res) => {
                    this.load_mode = false;
                });
        },
        closeEchart() {
            this.show = !this.show;
        },
        exportData(url) {
            this.ax.get(url, { params: this.form }).then((res) => {
                let name = res.split('/')[1]
                this.FileSaver.saveAs(res, name);
            });
        },
        print(id) {
            let info = JSON.stringify(this.tableData);

            let newsUrl = this.$router.resolve({ path: '/printClass', query: { info } });
            window.open(newsUrl.href, '_blank');
        },
        // 画图
        drawLine(id, data, series, color) {
            let myChart = this.$echarts.init(document.getElementById(id));
            var option = {
                color,
                title: {},
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}%'
                },
                legend: {
                    data: ['国家标准', '本馆情况', '缺口']
                },

                xAxis: {
                    data
                },

                yAxis: {},
                series: [
                    {
                        name: '国家标准',
                        type: 'bar',
                        data: series[0]
                    },
                    {
                        name: '本馆情况',
                        type: 'bar',
                        data: series[1]
                    },
                    {
                        name: '缺口',
                        type: 'bar',
                        data: series[2]
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        drawLines(id, data, color) {
            let myCharts = this.$echarts.init(document.getElementById(id));
            var option = {
                color,
                legend: {
                    data: ['本馆情况', '缺口']
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}%'
                },
                series: [
                    {
                        name: '第一大类',
                        type: 'pie',
                        data: data[0],
                        center: ['10%', '50%']
                    },
                    {
                        name: '第二大类',
                        type: 'pie',
                        data: data[1],
                        center: ['30%', '50%']
                    },
                    {
                        name: '第三大类',
                        type: 'pie',
                        data: data[2],
                        center: ['50%', '50%']
                    },
                    {
                        name: '第四大类',
                        type: 'pie',
                        data: data[3],
                        center: ['70%', '50%']
                    },
                    {
                        name: '第五大类',
                        type: 'pie',
                        data: data[4],
                        center: ['90%', '50%']
                    }
                ]
                //    series: [
                //         {
                //             name: '访问来源',
                //             type: 'pie',

                //             data: [
                //                 {value: 335, name: '直接访问'},
                //                 {value: 310, name: '邮件营销'},
                //                 {value: 234, name: '联盟广告'},
                //                 {value: 135, name: '视频广告'},
                //                 {value: 1548, name: '搜索引擎'}
                //             ]
                //         }
                //     ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myCharts.setOption(option);
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
.title {
    font-size: 14px;
    height: 40px;
    overflow: hidden;
    background: #f1f5f9;
}
.title > div {
    text-align: center;
    line-height: 40px;
    height: 40px;
}
.containers {
    font-size: 14px;
    box-sizing: border-box;
}
.containerItem {
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.b-b-1 {
    border-bottom: 1px solid #e9e9e9;
}
.b-r-1 {
    border-right: 1px solid #e9e9e9;
}
.b-l-1 {
    border-left: 1px solid #e9e9e9;
}
.b-t-1 {
    border-top: 1px solid #e9e9e9;
}
.containerItems {
    height: 100%;
    text-align: center;
}
</style>
