<!-- 五大部类借阅占比 -->
<template>
    <div id="echarts" ref="chartRef">
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
const updateChart = (data: any) => {
    // 获取echarts实例
    let mycharts = echarts.init(chartRef.value, null, {
        renderer: "svg",
    });
    // 创建配置项
    let option = {
        // 整体坐标大小
        tooltip: {
            formatter: "{b}<br/>{d}%",
        },
        legend: {
            //显示图例
            orient: "vertical", //显示位置
            right: "top",
            top: "15%",
            itemWidth: 15, //图例宽度
            itemHeight: 10, //图例高度
            itemGap: 30,
            textStyle: {
                color: "#5DCAEC ",
                fontSize: 14,
            },
        },
        color: ["#5192F3", "#81F6B4", "#FADB6F", "#E76B74", "#5DCAEC"],
        series: [
            {
                type: "pie",
                center: ["38%", "50%"],
                label: {
                    show: true,
                    formatter: "{d}%",
                    textStyle: {
                        color: "#fff",
                        fontSize: 16,
                    },
                },
                roseType: "radius",
                radius: [30, 90],
                itemStyle: {
                    borderRadius: 5,
                },
                data
            },
        ],
    };
    mycharts.setOption(option)
}
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { borrowingRatio } = toRefs(store)
watch(borrowingRatio, (newV: any) => {
    let data = [
        { value: newV.a, name: "马、列、毛、邓(A)" },
        { value: newV.b, name: "哲学(B)" },
        { value: newV.c, name: "社会科学(C-K)" },
        { value: newV.o, name: "自然科学(N-X)" },
        { value: newV.z, name: "综合性图书(Z)" },
    ]
    updateChart(data)
})

</script>

<style lang="less" scoped></style>