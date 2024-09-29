<!-- 馆藏变化 -->
<template>
    <div id="echarts" ref="chartRef">

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
const updateChart = (data: any) => {
    // 获取echarts实例
    let mycharts = echarts.init(chartRef.value, null, {
        renderer: "svg",
    });
    let option = {
        xAxis: {
            type: 'category',
            data: data.year,
            textStyle: {
                color: "#fff",
            },
            axisLabel: {
                textStyle: {
                    color: "#fff",
                },
            },
        },
        yAxis: {
            type: 'value',
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
        },
        series: [
            {
                name: "种数",
                type: "bar",
                itemStyle: {
                    color: "#FAD968",
                },
                data: data.baseNumber,
                label: {
                    show: true, //是否可见每个图的值
                    position: "top", //每条中文字的显示位置
                    textStyle: {
                        color: "#fff",
                    },
                },
            },
            {
                name: "册数",
                type: "bar",
                itemStyle: {
                    color: "#60DEF5",
                },
                data: data.bookNumber,
                label: {
                    show: true, //是否可见每个图的值
                    position: "top", //每条中文字的显示位置
                    textStyle: {
                        color: "#fff",
                    },
                },
            },
        ],

        grid: {
            top: "12%",
            bottom: "12%",
            left: "0",
            right: "0",
            containLabel: true, //让文字显示出来
        },
        legend: {
            data: ["种数", "册数"],
            textStyle: {
                color: "#fff",
                fontSize: 14,
            },
            bottom: -3,
            x: 90,
            itemWidth: 15,
            itemHeight: 5,
            itemGap: 120,
        },
    };
    mycharts.setOption(option);
}
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { collectionData } = toRefs(store)
watch(collectionData, (newV: any) => {
    updateChart(newV)
})
// 获取节点
onMounted(() => {
    updateChart({
        year: [],
        baseNumber: [],
        bookNumber: [],
    })
})
</script>

<style lang="less" scoped></style>