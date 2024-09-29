<!-- 班级借阅排行榜 -->
<template>
    <div id="echarts">
        <div class="top">
            <h4>排名</h4>
            <h4>单位</h4>
            <h4>借阅次数</h4>
        </div>
        <div class="footer">
            <div v-for="(item, index) in lists.splice(0, 5)">
                <p>
                    <img v-if="index == 0" src="../../assets/images/176.png" alt="">
                    <img v-if="index == 1" src="../../assets/images/175.png" alt="">
                    <img v-if="index == 2" src="../../assets/images/174.png" alt="">
                    <span v-if="index != 0 && index != 1 && index != 2">{{ index + 1 }}</span>
                </p>
                <p>{{ item.unitName }}</p>
                <p>{{ item.number }}</p>
                <!-- <p></p> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import useWebscoketStore from '../../store/modules/webScoket'
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { classBorrowingRanking } = toRefs(store)
const lists: any = ref([])
watch(classBorrowingRanking, (newV) => {
    lists.value = newV.sort((a: any, b: any) => b.number - a.number)
})

</script>

<style lang="less" scoped>
#echarts {
    display: flex;
    flex-direction: column;

    .top {
        height: 40px;
        display: flex;
        align-content: center;
        justify-content: center;
        justify-content: space-around;

        h4 {
            width: 85px;
            font-size: 16px;
            color: #5dcaec;
            text-align: center;
            font-weight: 400;
        }
    }

    .footer {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        div {
            display: flex;
            align-content: center;
            justify-content: center;
            justify-content: space-around;

            p {
                width: 85px !important;
                color: #fff;
                font-size: 14px;
                text-align: center;
            }

            img {
                width: 20px;
            }

            span {
                color: #fff;
                font-size: 14px;
            }
        }
    }
}
</style>