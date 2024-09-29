<!-- 读者借阅排行榜 -->
<template>
    <div id="echarts" ref="chartRef">

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { readerBorrowingRanking } = toRefs(store)
const transformedData: any = ref({})
watch(readerBorrowingRanking, (newVal: any) => {
    // 在这里处理 readerBorrowingRanking 的变化
    transformedData.value = newVal.sort((a: any, b: any) => b.number - a.number).slice(0, 5).reduce((acc: any, item: any) => {
        for (const key in item) {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item[key])
        }
        return acc

    }, [])
    updateChart(transformedData.value.readerName, transformedData.value.number)

});
const updateChart = (readerName: string[], number: number[]) => {
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
            left: "0",
            right: "0",
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
            data: readerName,
            textStyle: {
                color: "#fff",
                fontSize: 16,
            },
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
                type: "bar",
                data: number,
                barWidth: "40%",
                itemStyle: {
                    normal: {
                        color: function (params: any) {
                            // 定义一个颜色数组colorList
                            var colorList = [
                                "#60DEF5",
                                "#65B993",
                                "#FAD968",
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
        ],
    };
    mycharts.setOption(option);
}
// 获取节点
onMounted(() => {
    updateChart([],[])
})
</script>

<style lang="less" scoped></style>