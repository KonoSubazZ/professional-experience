<!-- 分项指标 -->
<template>
    <div class='box'>
        <p>
            分项指标
        </p>
        <div id="echarts" ref="chartRef">

        </div>
        <div class="footer">
            <span v-for="name in fottitle">{{ name }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
const fottitle = ref([
    '平均复本',
    '人均复本',
    '读者借阅',
    '图书利用率',
])
const updateChart = (data: any) => {
    // 获取echarts实例
    let mycharts = echarts.init(chartRef.value, null, {
        renderer: "svg",
    });
    var option = {
        legend: {
            show: false,
        },
        grid: {
            containLabel: true,
            left: 0,
            right: 0,
            bottom: 0,
            top: 20,
            height: 'auto'
        },
        xAxis: {
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
        },
        yAxis: {
            show: false
        },
        series: [
            {
                name: "平均复本",
                type: 'pie',
                radius: ['65%', '80%'],
                center: ['15%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{c}',
                    fontWeight: 'bold',
                    textStyle: {
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false,
                },
                data: [
                    data.averageNumber
                ]
            },
            {
                name: "人均复本",
                type: 'pie',
                radius: ['65%', '80%'],
                center: ['38.2%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{c}',
                    fontWeight: 'bold',
                    textStyle: {
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false,
                },
                data: [
                    data.percapitaNumber
                ]
            },
            {
                name: "读者借阅",
                type: 'pie',
                radius: ['65%', '80%'],
                center: ['61.4%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{c}%',
                    fontWeight: 'bold',
                    textStyle: {
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false,
                },
                data: [
                    data.readersBorrowingNumber
                ]
            },
            {
                name: "图书利用率",
                type: 'pie',
                radius: ['65%', '80%'],
                center: ['85%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{c}%',
                    fontWeight: 'bold',
                    textStyle: {
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false,
                },
                data: [
                    data.bookRateNumber
                ]
            }
        ],
    };
    mycharts.setOption(option);
}
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { totalNumberTtems } = toRefs(store)
watch(totalNumberTtems, (newV: any) => {
    updateChart(newV)
})

</script>

<style lang="less" scoped>
.box {
    width: 100%;

    height: 100%;
    display: flex;
    flex-direction: column;

    p {
        width: 100%;
        height: 20px;
        font-size: 12px;
        color: #fff;
        line-height: 20px;
        text-align: center;
    }
}

.footer {
    width: 100%;
    height: 20px;
    font-size: 12px;
    color: #fff;
    position: relative;

    span {
        position: absolute;
    }

    span:nth-child(1) {
        left: 44px;
    }

    span:nth-child(2) {
        left: 161px;
    }

    span:nth-child(3) {
        left: 275px;
    }

    span:nth-child(4) {
        left: 384px;
    }
}
</style>