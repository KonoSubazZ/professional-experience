<!--五大部类馆藏占比  -->
<template>
  <div id="echarts" ref="chartRef">

  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import * as echarts from 'echarts';
import useWebscoketStore from '../../store/modules/webScoket'
const chartRef = ref()
const updateChart = (data:any) => {
  // 获取echarts实例
  let mycharts = echarts.init(chartRef.value, null, {
    renderer: "svg",
  });
  //  // 创建配置项
  let option = {
    tooltip: {
      formatter: "{b}<br/>{d}%",
    },
    // 显示图例
    legend: {
      orient: "vertical", //显示位置
      top: "15%",
      left: "0%",
      itemWidth: 15, //图例宽度
      itemHeight: 10, //图例高度
      itemGap: 25,
      textStyle: {
        color: "#5DCAEC ",
        fontSize: 14,
      },
    },
    color: ["#CC66FF", "#3A45F7", "#FF8C5A", "#CC66FF", "#9FFFDC"],
    series: [
      //图表类型
      {
        type: "pie",
        center: ["60%", "50%"],
        label: {
          show: true,
          formatter: "{d}%",
          textStyle: {
            color: "#fff",
            fontSize: 16,
          },
        },
        emphasis: {
          label: {
            show: true,
            // fontWeight: "bold",
            color: "#5DCAEC",
            textStyle: {
              color: "#fff",
            },
          },
        },
        data
      },
    ],
  };
  // // 设置实例的配置项
  mycharts.setOption(option)
}
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { collectionProportion } = toRefs(store)
watch(collectionProportion, (newV: any) => {
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