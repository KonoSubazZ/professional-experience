<!-- 当日借还数量（实时） -->
<template>
    <div id="echarts" ref="chartRef">
    </div>
</template>

<script setup lang="ts">
import {onMounted,ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
const updateChart = (broowData: (string | number)[], returnData: (string | number)[]) => {
    // 获取echarts实例
    let mycharts = echarts.init(chartRef.value, null, {
        renderer: "svg",
    });
    //   添加配置项
    let option = {
        // 调整坐标轴大小
        grid: {
            top: "10%",
            bottom: "0",
            left: "3%",
            right: "5%",
            containLabel: true, //让文字显示出来
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "line",
                z: 0,
                lineStyle: {
                    width: 66,
                    color: "#2D3443",
                },
            },
        },
        xAxis: {
            type: "category",
            data: [
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
            ],
            textStyle: {
                color: "#fff",
            },
            boundaryGap: false,
            axisLabel: {
                textStyle: {
                    color: "#fff",
                },
            },
        },
        yAxis: {
            splitLine: {
                show: false, //去掉图中后面的竖线
            },
            minInterval: 1,
            //   只改变字体颜色
            axisLabel: {
                textStyle: {
                    color: "#fff",
                },
            },
            // 刻度线
            axisLine: {
                show: true,
            },
            tyle: "value",
        },
        series: [
            {
                showAllSymbol: true,
                // 断点问题
                connectNulls: true,
                name: "借书量",
                // 渐变
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: "#153774",
                            },
                            {
                                offset: 0.8,
                                color: "#4A537A",
                            },
                        ],
                        false
                    ),
                    shadowColor: "rgba(0,0,0,0.01)",
                    shadowBlur: 10,
                },
                lineStyle: {
                    color: "#60C2ED",
                    width: 1,
                },
                showSymbol: false,
                type: "line", //去掉小圆点
                data: broowData,
                barWidth: "40%",
                smooth: true, //平滑
                itemStyle: {
                    normal: {
                        color: function (params: any) {
                            // 定义一个颜色数组colorList
                            var colorList = [
                                "#60DEF5",
                                "#65B993",
                                "#FAD968",
                                "#EB6A76",
                                "#EB6A76",
                                "#589AF3",
                            ];
                            return colorList[params.dataIndex];
                        },
                    },
                },
                label: {
                    show: true, //是否可见每个图的值
                    position: "top", //每条中文字的显示位置
                    textStyle: {
                        color: "#fff",
                    },
                },
            },
            {
                name: "还书量",
                // 断点问题
                connectNulls: true,
                // 渐变
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: "#89664E",
                            },
                            {
                                offset: 0.8,
                                color: "#4A537A",
                            },
                        ],
                        false
                    ),
                    shadowColor: "rgba(0,0,0,0.01)",
                    shadowBlur: 10,
                },
                lineStyle: {
                    color: "#89664E",
                    width: 1,
                },
                showSymbol: false,
                type: "line", //去掉小圆点
                data: returnData,
                barWidth: "40%",
                smooth: true, //平滑
                itemStyle: {
                    normal: {
                        color: function (params: any) {
                            // 定义一个颜色数组colorList
                            var colorList = [
                                "#589AF3",
                                "#EB6A76",
                                "#EB6A76",
                                "#FAD968",
                                "#65B993",
                                "#60DEF5",
                            ];
                            return colorList[params.dataIndex];
                        },
                    },
                },
                label: {
                    show: true, //是否可见每个图的值
                    position: "top", //每条中文字的显示位置
                    textStyle: {
                        color: "#fff",
                    },
                },
            },
        ],
    };
    mycharts.setOption(option);
}
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { borrowedBookNumber, returnBookNumber } = toRefs(store)
watch([borrowedBookNumber, returnBookNumber], ([newbow, newret]) => {
    updateChart(newbow, newret)
})
// 获取节点
onMounted(() => {
    updateChart([],[])
})
</script>

<style lang="less" scoped></style>