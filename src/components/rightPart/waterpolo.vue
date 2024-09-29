<!-- 水球图模块 -->
<template>
    <div id="echarts" ref="chartRef">
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, watch } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
const chartRef = ref()
const props = defineProps({
    numberDifference: {
        type: Number,
        required: true
    }
})

watch(() => props.numberDifference, (newV) => {
    updateChart(newV)
})
const updateChart = (numberValue?: any) => {
    // 获取echarts实例
    let mycharts = echarts.init(chartRef.value, null, {
        renderer: "svg",
    });
    // 设置实例的配置项
    mycharts.setOption({
        series: [{
            type: 'liquidFill',//系列
            data: [{
                value: numberValue / 300,
                // 下面是设置波浪为渐变
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,//0%时的颜色 从上往下看 最上面是0%
                            color: 'rgb(100, 226, 254)'
                        }, {
                            offset: 1,//100%时的颜色 从上往下看 最上面是0%
                            color: 'rgb(16, 42, 93)'
                        }],),
                    }
                }
            }],//数据
            radius: '95%', //半径大小
            outline: {
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'none',
                    borderColor: 'rgb(100, 226, 254)',
                    borderWidth: 5,
                    shadowBlur: 200,
                    shadowColor: 'red',

                },

            },
            backgroundStyle: {
                color: 'transparent'  // 设置背景颜色为透明
            },
            label: {
                normal: {
                    // formatter: '{c}',
                    formatter: function (param: any) {
                        return Math.floor(param.value * 300);
                    },
                    textStyle: {
                        color: 'rgb(100, 226, 254)',
                        fontSize: 35   // 修改字体大小
                    },
                    position: ['50%', '30%']   // 修改水球数字的位置
                }
            }
        }],
        grid: {
            left: 30,
            right: 20,
            top: 20,
            bottom: 20,
        },
        // 其他配置项
        // ...
    });
}
// 获取节点
onMounted(() => {
    updateChart(props.numberDifference)
})
</script>

<style scoped lang="less">
#echarts {}
</style>