<template>
  <transition name="fade" @click="goBack" id="tran">
    <div class="standbyBox">
      <div class="standbyAuto">
        <el-carousel indicator-position="none" :interval="3000" :autoplay="autoplay" @change="getIndex">
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <videoPlay v-if="!item.img" :src="item.video" :ref="'videoPlayer' + index" id="myVideo" width='100%'
              height='478px' aspectRatio="16:9" preload="auto" :loop="false" :fluid="true" :muted="true"
              :webFullScreen="false" :autoPlay="true" :control="false" :playsinline="true" @play="onPlay"
              @ended="onEnded" />
            <img v-else class="el_img" :src="item.img">

          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="status" v-if="status === 2">
        <img src="../../../assets/image/setting.png">
        <span>停机维护中，请等待~</span>
      </div>
      <div class="day">
        <p class="time">{{ dateHours }}</p>
        <p class="time2">{{ dateDay }}，{{ week }}</p>
        <p class="time3">{{thermal.text?thermal.text :'晴'}}   <span  style="margin-left: 20px">{{`${thermal.temp?thermal.temp:'-7'}℃`}}</span></p>
      </div>
      <div class="bottom">
        <p class="time3">{{ standbyText }}</p>
      </div>
    </div>

  </transition>
</template>
<script setup>
import axios from 'axios';
import pic from '@utils/image';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { otherInterface } from "@api/request";
import videoPlay from 'vue3-video-play';
import 'vue3-video-play/dist/style.css';
import { ref, reactive, getCurrentInstance, onUnmounted } from "vue";
const { proxy } = getCurrentInstance();
const { appContext: { config: { globalProperties } } } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const state = reactive({
  timer: null
});
const standbyText = ref('');
const status = ref(store.getters.getCabinetInfo.status);
const dateHours = ref('');
const week = ref('');
week.value = '星期' + '日一二三四五六'.charAt(new Date().getDay());
const dateDay = ref('');
const thermal = ref({});
const imgList = ref([]);
const videoUrl = ref(store.getters.getCabinetInfo.caseWaitingInfo && store.getters.getCabinetInfo.caseWaitingInfo.videoUrl ? store.getters.getCabinetInfo.caseWaitingInfo.videoUrl.split(',') : []);
const picUrl = ref(store.getters.getCabinetInfo.caseWaitingInfo && store.getters.getCabinetInfo.caseWaitingInfo.pictureUrl ? store.getters.getCabinetInfo.caseWaitingInfo.pictureUrl.split(',') : []);
videoUrl.value.concat(picUrl.value).forEach(it => {
  if (it.indexOf('mp4') !== -1) {
    imgList.value.push({ video: store.getters.platform.info.http + '/' + it })
  } else {
    imgList.value.push({ img: store.getters.platform.info.http + '/' + it })
  }
});

//时间定时
state.timer = setInterval(() => {
  dateHours.value = globalProperties.dataTime.dateFormatHours(new Date());
  dateDay.value = globalProperties.dataTime.dateFormatDay(new Date()).split('年')[1];
}, 1000);


const goBack = () => {
  router.go(-1);
}
const autoplay = ref(true);
const index = ref(0);
const getIndex = (nowIndex, oldIndex) => {
  let myVideo = proxy.$refs['videoPlayer' + nowIndex];
  if (myVideo) {
    myVideo[0].pause();
    myVideo[0].currentTime = 0;
    index.value = nowIndex;
    listenVideo();
  }
};
const listenVideo = () => {
  let myVideo = proxy.$refs['videoPlayer' + index.value];
  if (myVideo) {
    myVideo[0].play(() => {
      autoplay.value = false;
    });
  }
};
const onPlay = () => {
  autoplay.value = false;
};
const onEnded = () => {
  autoplay.value = true;
};

//天气接口
const getWeather = () => {
  // 获取当前位置
  axios.get('https://restapi.amap.com/v3/ip?key=400ecb0c08d1d12cf962afee160ef551').then(resIp => {
    if (resIp.data) {
      let location = resIp.data.rectangle.split(';')[0]
      // 获取当前城市天气
      axios.get(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=0996725bde674cc2897eca74494a9d5b`).then(res => {
        thermal.value.temp = res.data.now.temp;
        thermal.value.text = res.data.now.text;
        // console.log(thermal.value, '----thermal.value');
        //     weatherImg.value = pic[res.data.wea_img];
      })
    }
  })
};
getWeather();
setInterval(() => {
  getWeather();
}, 3600000);

otherInterface.randomLove().then(res => {
  // standbyText.value = res;//随机语接口
  standbyText.value = '点击屏幕继续';//随机语接口
})

onUnmounted(() => {
  clearInterval(state.timer);
  state.timer = null;
})

</script>
<style lang="less" scoped>
.standbyBox {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #79f1a4, #0e5cad);

}

.standbyAuto {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.d-player-wrap {
  height: 100% !important;
}

:deep(.el-carousel--horizontal) {
  height: 100% !important;
}

:deep(.el-carousel__container) {
  pointer-events: none !important;
  height: 100% !important;
}

:deep(.el-carousel__arrow) {
  display: none !important;
}

:deep(.d-player-video-main) {
  object-fit: cover !important;
}

.el_img {
  width: inherit;
  height: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: .3s;
  transform: translateY(0%);
  z-index: 22;

}

/* 离开页面动画 */
.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  transition: .3s;
  transform: translateY(-100%);
  z-index: 22;
}

.status {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #000DFF;
  font-size: 0.4rem;
  font-weight: bold;
  display: flex;
  align-items: center;

  span {
    margin-left: 0.2rem;
  }
}

.day {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -30%);
  color: #000DFF;

  .time {
    font-size: 100px;
    font-weight: bold;
    text-align: center;
  }

  .time2 {
    text-align: center;
    font-size: 30px;
  }

  .time3 {
    font-size: 45px;
    text-align: center;
    line-height: 2rem;
  }
}

.bottom {
  position: absolute;
  bottom: 29%;
  left: 50%;
  transform: translate(-50%, -30%);
  font-weight: 550;
  color: #000DFF;

  .time3 {
    font-size: 50px;
    text-align: center;
  }
}</style>