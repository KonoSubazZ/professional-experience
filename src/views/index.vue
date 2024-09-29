<template>
    <div class="container">
        <div class="screen" ref="screen">
            <!-- 左侧 -->
            <div class="left flex_column">
                <div class="left_top bor flex_column box_heig_334">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/260.png" alt="">
                            <h2>当日借还数量（实时）</h2>
                        </div>
                        <div>
                            <p>
                                <img src="../assets/images/257.png" alt="">
                                <span>借书</span>
                            </p>
                            <p>
                                <img src="../assets/images/256.png" alt="">
                                <span>还书</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex_1">
                        <timeBorrowingAndReturning></timeBorrowingAndReturning>
                    </div>
                </div>
                <div class="left_center bor box_heig_334 flex_column">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/bookshelf.png" alt="">
                            <h2>读者借阅排行</h2>
                        </div>
                    </div>
                    <div class="flex_1">
                        <readerBorrowing></readerBorrowing>
                    </div>
                </div>
                <div class="left_footer flex_column box_heig_334">
                    <div class="bor" style="height:150px;margin-bottom: 6px;display: flex;flex-direction: column;">
                        <div class="top_title">
                            <div class="flex_1">
                                <img class="title_img" src="../assets/images/282.png" alt="">
                                <h2>公告</h2>
                            </div>
                            <div>
                                <p style="width: auto;font-size: 14px; color: rgb(93, 202, 236);">
                                    {{ leftFooterTime }}
                                </p>
                            </div>
                        </div>
                        <div class="flex_1 lunbofu">

                            <marquee direction="up" v-html="systemConfiguration.content" scrollamount="2"
                                style="height: 100px; width: 400px; margin-left: 30px;color: aliceblue;">
                            </marquee>
                        </div>
                    </div>
                    <div class="bor" style="flex: 3;">
                        <itemize></itemize>
                    </div>
                </div>
            </div>
            <!-- 中间 -->
            <div class="center flex_column">
                <div class="center_top " style="padding: 10px;box-sizing: border-box;">
                    <!-- 头部title -->
                    <div class="center_top_title">
                        <div></div>
                        <h2 @click="toSetting">{{ systemConfiguration.title || '蓝鲸智慧图书馆' }}</h2>
                        <div></div>
                        <div>
                            <p class="center_top_title_topCity" v-if="systemConfiguration.isShowCity">
                                <img src="../assets/images/Navigation.png" alt="">
                                <span>{{ city || '蓝鲸知图' }}</span>
                            </p>
                            <p v-if="systemConfiguration.isShowTime" class="center_top_title_topTime">{{ centerTopTime
                                }}
                            </p>
                            <p class="center_top_title_topWeather" v-if="systemConfiguration.isShowWeather">
                                今日天气:<span>{{ weather || '晴' }}<i v-show="icoWeather"
                                        style="font-size: 18px;color:#3fa9f5 ;margin-left: 5px;"
                                        :class="`qi-${icoWeather}`"></i></span>
                            </p>
                        </div>
                    </div>
                    <!-- 头部数值 -->
                    <div class="center_top_number">
                        <div class="today_left">
                            <div>
                                <h2 class="c_b">{{ collectionSpeciesNum }}</h2>
                                <p>馆藏种数</p>
                            </div>
                            <div>
                                <h2 class="c_g">{{ collectionCopiesNum }}</h2>
                                <p>馆藏册数</p>
                            </div>
                        </div>
                        <div class="today_right">
                            <div>
                                <h2 class="c_b">{{ todayBorrow }}</h2>
                                <p>今日借书</p>
                            </div>
                            <div>
                                <h2 class="c_g">{{ todayReturn }}</h2>
                                <p>今日还书</p>
                            </div>
                        </div>
                    </div>
                    <!-- 头部累计 -->
                    <div class="center_top_accumulate">
                        <div class="center_top_accumulate_left">
                            <span>今年新增馆藏册数</span>
                            <div class="count">
                                <p v-for="num in thisYearCollectionCopiesNum">{{ num }}</p>
                            </div>
                        </div>
                        <div class="center_top_accumulate_right">
                            <span>本月借书总册次</span>
                            <div class="count">
                                <p v-for="num in thisMonthBrowBookNum">{{ num }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="center_center bor flex_column">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/xinshu.png" alt="">
                            <h2>{{ booksTitle }}</h2>
                        </div>
                    </div>
                    <div class="flex_1" style="display: flex;align-items: center;justify-content: center;">
                        <div style="width: 798px;height: 250px; overflow: hidden;">
                            <vue3-seamless-scroll :list="bookList" direction="left">
                                <div style="width: auto;height: 100%;display: flex;">
                                    <div class="scroll" v-for="item in bookList">
                                        <img @error="imgErr" :src="`${systemConfiguration.libraryUrl}/${item.coverUrl}`"
                                            alt="">
                                        <p v-if="!item.coverUrl">{{ item.positiveTitle }}</p>
                                    </div>
                                </div>
                            </vue3-seamless-scroll>
                        </div>
                    </div>
                </div>
                <div class="center_footer">
                    <div class="bor flex_1 flex_column" style="margin-right: 10px;">
                        <div class="top_title">
                            <div class="flex_1">
                                <img class="title_img" src="../assets/images/183.png" alt="">
                                <h2>单位借阅 排行榜</h2>
                            </div>
                        </div>
                        <div class="flex_1">
                            <borrowingRanking></borrowingRanking>
                        </div>
                    </div>
                    <div class="bor flex_1 flex_column" style="margin-left: 10px;">
                        <div class="top_title">
                            <div class="flex_1">
                                <img class="title_img" src="../assets/images/frame.png" alt="">
                                <h2>馆藏变化</h2>
                            </div>
                        </div>
                        <div class="flex_1">
                            <change></change>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right flex_column">
                <div class="right_top bor box_heig_334 flex_column">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/72.png" alt="">
                            <h2>在馆人数</h2>
                        </div>
                    </div>
                    <div class="flex_1 enter">
                        <div class="enter_top">
                            <p>累计入馆人数:{{ traffic.entranceTolal || 0 }}</p>
                        </div>
                        <div class="enter_center">
                            <div class="waterpolo">
                                <waterpolo :numberDifference="numberDifference"></waterpolo>
                            </div>
                            <div class="prompt">
                                <div>
                                    <h1>温馨提示：</h1>
                                    <p v-if="numberDifference < 30">您好，现在馆内人数不多，可以为您带来良好的阅读氛围，欢迎到馆阅读~</p>
                                    <p v-else>您好，目前馆内人数较多， 为了保证您的阅读质量，建议您调整入馆时间~</p>
                                </div>
                            </div>
                        </div>
                        <div class="enter_footer">
                            <div>
                                <h3 class="c_b">{{ traffic.entranceToday || 0 }}</h3>
                                <p>今日入馆</p>
                            </div>
                            <div>
                                <h3 class="c_g">{{ traffic.exportToday || 0 }}</h3>
                                <p>今日出馆</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right_center bor box_heig_334 flex_column">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/frame.png" alt="">
                            <h2>五大部类馆藏占比</h2>
                        </div>
                    </div>
                    <div class="flex_1">
                        <collectionCom></collectionCom>
                    </div>
                </div>
                <div class="right_footer bor  box_heig_334 flex_column">
                    <div class="top_title">
                        <div class="flex_1">
                            <img class="title_img" src="../assets/images/book.png" alt="">
                            <h2>五大部类借阅占比</h2>
                        </div>
                    </div>
                    <div class="flex_1">
                        <borrowingCom></borrowingCom>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// 水球图
import waterpolo from '../components/rightPart/waterpolo.vue'
// 五大部类馆藏占比
import collectionCom from '../components/rightPart/collectionCompare.vue'
// 五大部类借阅占比
import borrowingCom from '../components/rightPart/borrowingCompare.vue'
// 馆藏变化
import change from '../components/centerPart/change.vue'
// 班级借阅排行
import borrowingRanking from '../components/centerPart/borrowingRanking.vue'
// 读者借阅排行榜
import readerBorrowing from '../components/leftPart/readerBorrowing.vue'
// 当日借还数量（实时）
import timeBorrowingAndReturning from '../components/leftPart/timeBorrowingAndReturning.vue'
// 分项指标
import itemize from '../components/leftPart/itemize.vue'
// --------------------------------------- 引入
import { ref, onMounted, Ref, computed, toRefs, watch } from "vue";

import { useRouter } from 'vue-router'
import axios from '../utils/request.ts'
import Axios from 'axios'
import createWebSocket from './ws'
import useWebscoketStore from '../store/modules/webScoket'
import defaultImg from '../assets/images/322.png'
import { parseURL } from "../utils/index.js"
import schedule from 'node-schedule'
// ----功能
const settingData = computed(() => JSON.parse(window.localStorage.getItem('setting')!))
const $router = useRouter()
// 获取数据大屏展示内容盒子的DOM元素
let screen = ref();
// 定义大屏缩放比例
const getScale: (w?: number, h?: number) => number = (w = 1920, h = 1080) => {
    const ww = window.innerWidth / w;//window.innerWidth屏幕宽度
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh
}
// -------------
const settingTime: any = ref(null);
const pushNum: Ref<number> = ref(0);
// 跳转配置
const toSetting = () => {
    clearTimeout(settingTime.value)
    pushNum.value = pushNum.value + 1
    if (pushNum.value == 5) {
        $router.push('/setting')
    }
    settingTime.value = setTimeout(() => {
        pushNum.value = 0
    }, 3000);
}
const traffic: any = ref({})
// 获取人流量
const accessFn = async () => {
    const res = await axios.get(settingData.value.httpUrl + '/api/safetyDoorstatistics?platformId=' + settingData.value.platformId)
    traffic.value = res.data
    /**
     *  exportTotal:总出馆人数
        exportToday：今日出馆人数
        entranceTolal：总进馆人数
        entranceToday：今日进馆人数
     */

}
// 人数差
const numberDifference = computed(() => traffic.value.entranceToday - traffic.value.exportToday > 0 ? traffic.value.entranceToday - traffic.value.exportToday : 0)

// 获取时间
const centerTopTime = ref('');//中间顶部时间
const leftFooterTime = ref('');//左边底部时间
const updateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const dayOfWeek = getDayOfWeek(now.getDay());

    centerTopTime.value = `${year}年${month}月${day}日 ${dayOfWeek}   ${hour}:${minute}:${second}`;
    leftFooterTime.value = `${year}年${month}月${day}日`;
}
const getDayOfWeek = (day: number) => {
    const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return daysOfWeek[day];
}
// 获取位置&天气
const city = ref('');//城市
const weather = ref('');//天气
const icoWeather = ref('');//天气图标
const getWeather = async () => {
    // 获取当前位置
    const resIp = await Axios.get('https://restapi.amap.com/v3/ip?key=400ecb0c08d1d12cf962afee160ef551')
    if (resIp.data) {
        city.value = resIp.data.city
        let location = resIp.data.rectangle.split(';')[0]
        // 获取当前城市天气
        Axios.get(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=0996725bde674cc2897eca74494a9d5b`).then(res => {
            weather.value = res.data.now.text;
            icoWeather.value = res.data.now.icon;
        })
    }
}
const bookList: any = ref([])
// 错误图片显示
const imgErr = (e: any) => {
    e.target.src = defaultImg
}
// 新书推荐$热门图书
const booksTitle = ref('新书推荐')
// -----------------监听webscoket数据
// toRefs 函数用于将响应式对象转换为普通的引用对象（Refs）,就是把对象里的每个属性都变成响应式了
const store = useWebscoketStore()
const { todayBorrow, todayReturn, collectionSpeciesNum, collectionCopiesNum,thisYearCollectionCopiesNum, thisMonthBrowBookNum, systemConfiguration, popularBooks, newBooks } = toRefs(store)
// 监听新书推荐和热门图书
watch([popularBooks, newBooks], ([popularNewV, newBookNewV]) => {
    bookList.value = popularNewV.concat(newBookNewV)
})
// 生命周期
onMounted(() => {
    createWebSocket.localSocket()
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
    setInterval(() => {
        accessFn()// 获取人流量
        updateTime();//获取时间
    }, 1000)
    // 新书推荐和热门图书切换
    setInterval(() => {
        if (booksTitle.value == "新书推荐") {
            booksTitle.value = '热门图书'
        } else {
            booksTitle.value = '新书推荐'
        }
    }, 10000)
    // 获取天气
    getWeather()
    setInterval(() => {
        getWeather()
    }, (1000 * 60) * 60)

    
    
    if (!window.localStorage.getItem('setting')) {
        const setting = parseURL(window.location.href)
        console.log(setting, 'setting-index');
        window.localStorage.setItem('setting', JSON.stringify(setting)) 
    }
    // window.localStorage.setItem('setting', JSON.stringify(setting))
})
// 监听视口
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

schedule.scheduleJob('30 1 0 * * *', () => {
    location.reload() 
});

</script>

<style lang="less" scoped>
// 最外层盒子
.container {
    width: 100%;
    height: 100%;

    .screen {
        width: 1920px;
        height: 1080px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform-origin: left top;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
    }
}

// 左侧
.left {
    width: 510px;
    height: 100%;

    .left_top {}

    .left_center {
        margin: 30px 0;
    }

    .left_footer {

        // 轮播公告文字
        .lunbofu {
            overflow: hidden;
            height: 100px;
            word-wrap: break-word;
            /* 当单词长度超出容器宽度时自动换行 */
            word-break: break-all;

            /* 任意字符超出容器宽度时强制换行 */
            .lunbo {
                animation: 7s wordsLoop linear infinite normal;
            }
        }

        @keyframes wordsLoop {
            0% {
                transform: translateY(30%);
                -webkit-transform: translateY(30%);
            }

            100% {
                transform: translateY(-30%);
                -webkit-transform: translateY(-30%);
            }
        }
    }
}

// 中间
.center {
    flex: 1;
    height: 100%;
    margin: 0 30px;

    .center_top {
        height: 345px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .center_top_title {
            height: 70px;

            // background-color: pink;
            div:nth-child(1) {
                width: 100%;
                height: 7px;
                background: url(../assets/images/slices.png) no-repeat;
                background-size: 100% 100%;
            }

            h2 {
                width: 100%;
                color: #5dcaec;
                text-align: center;
                margin: 0;
                background: url(../assets/images/285.png) no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
                font-weight: 400;
            }

            div:nth-child(3) {
                width: 770px;
                height: 2px;
                margin-top: 2px;
                margin-left: 15px;
                background: url(../assets/images/284.png) no-repeat;
                background-size: 100% 100%;
            }

            div:nth-child(4) {
                display: flex;
                height: 25px;
                // background-color: #5dcaec;
                width: 770px;
                margin-left: 15px;
                align-items: center;
                color: #3fa9f5;
                font-size: 14px;
                position: relative;

                p {
                    margin: 0;
                }

                .center_top_title_topCity {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    left: 0;

                    img {
                        width: 13px;
                        margin-right: 10px;
                    }
                }

                .center_top_title_topTime {
                    font-size: 18px;
                    color: #fff;
                    font-weight: 800;
                    position: absolute;
                    left: 30%;
                }

                .center_top_title_topWeather {
                    position: absolute;
                    right: 0;
                }
            }
        }

        .center_top_number {
            height: 110px;
            display: flex;

            h2 {
                font-size: 35px;
                font-weight: 400;
            }

            p {
                font-size: 18px;
                color: #3fa9f5;
            }

            .today_left {
                flex: 1;
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: space-evenly;

                div {
                    text-align: center;
                }
            }

            .today_right {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-evenly;

                div {
                    text-align: center;
                }
            }
        }

        .center_top_accumulate {
            height: 100px;
            display: flex;
            font-size: 18px;
            color: #3fa9f5;

            .center_top_accumulate_left {
                flex: 1;
                margin-right: 10px;
                display: flex;
                align-items: center;
            }

            .center_top_accumulate_right {
                flex: 1;
                display: flex;
                align-items: center;
            }

            .count {
                margin-left: 5px;
                display: flex;

                p {
                    width: 25px;
                    height: 40px;
                    background: url(../assets/images/2.png) no-repeat;
                    background-size: 100% 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 35px;
                    color: #fff;
                    margin: 0 5px;
                }
            }

        }
    }

    .center_center {
        height: 371px;
        margin-top: 5px;
        margin-bottom: 14px;

        .scroll {
            width: 200px;
            height: 250px;
            margin: 0 10px;
            position: relative;

            img {
                width: 100%;
                height: 100%;
            }

            p {
                color: #fff;
                font-size: 30px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                writing-mode: vertical-rl;
                height: 80%;
                text-align: center;
            }
        }
    }

    .center_footer {
        height: 336px;
        display: flex;
    }
}

// 右侧
.right {
    width: 510px;
    height: 100%;

    .right_top {
        .enter {
            display: flex;
            flex-direction: column;

            h3 {
                font-weight: 400;
                font-size: 25px;
                text-align: center;
            }

            .enter_top {
                height: 20px;
                font-size: 14px;
                color: rgb(93, 202, 236);

                p {
                    float: right;
                }
            }

            .enter_center {
                flex: 1;
                margin: 10px 0;
                display: flex;

                .waterpolo {
                    flex: 1;
                }

                .prompt {
                    flex: 1;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    div {
                        width: 80%;

                        h1 {
                            color: #5dcaec;
                            font-size: 25px;
                        }

                        p {
                            font-size: 16px;
                            color: #fff;
                            margin-top: 10px;
                        }
                    }

                }
            }

            .enter_footer {
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-around;

                p {
                    font-size: 16px;
                    color: rgb(63, 169, 245);
                }
            }
        }

    }

    .right_center {
        margin: 30px 0;
    }
}
</style>