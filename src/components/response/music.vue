<template>
  <div class="audioBox">
    <audio id="myAudio" ref="myAudio" @loadedmetadata="initializeAudio" @timeupdate="updateProgressBar">
      <source :src="changeVersion? audioUrl : audioUrl + '?t=' + Date.now()" type="audio/mpeg">
    </audio>
    <div class="audioBox_top">
      <div style="position: relative;height: 12vh;">
        <img @error="errImg" :src="imgSrc" alt="" style="width: 27vw;z-index:12;" class="center">
        <img src="../../assets/music/changpian.png" alt="" style="width:35vw;height:35vw;left:15vw;z-index:10;"
          :class="!isAudioPaused ? 'center circle' : 'center'">
      </div>
      <p style="width: 100%;text-align: center;font-size: 2vh;color: #000;margin: 1vh 0;"> {{ title }}<span
          style="font-size: 1.5vh">第{{ musicindex + 1 }}集</span></p>
    </div>
    <div class="audioBox_center">
      <input type="range" min="0" :max="audioDuration" step="0.01" v-model="currentTime" @input="seekToTime" style="width:100%;
              margin-top: 1vw;height: 1vh;background-color: #17A9FB;" />
      <div style="display: flex;justify-content: space-between">
        <div style="width:10vw;fontSize:3vw; white-space:nowrap;">{{ current }}</div>
        <div :style="{color:$bis=='0'?'#409EFF':'rgba(222, 47, 47, 1)'}" style="width:10vw;fontSize:3vw; white-space:nowrap;">{{ audioDurationTime }}
        </div>
      </div>
    </div>
    <div class="audioBox_buttom">
      <!-- 底部功能栏左侧  -->
      <div class="audioBox_buttom_left">
        <div class="Icon">
          <p>
            <el-popover placement="right" trigger="click" ref="myProper">
              <div style="max-height:7vh;overflow:scroll">
                <div v-for="(item, index) in playlist" :key="index" @click="handchange(item, index)"
                  style="margin:2.3% auto;" :class="musicindex == index ? 'blue' : 'none'">{{
                    item.bookName }} 第{{ index + 1 }}集</div>
              </div>
              <div slot="reference" style="display: flex; flex-direction: column; align-items: center;">
                <img src="../../assets/music/new/directory.png" alt="">
                <span>目录</span>
              </div>
            </el-popover>
          </p>
          <p @click="skipBackward">
            <img src="../../assets/music/new/retreat.png" alt="">
            <span>后退15s</span>
          </p>
          <p @click="lastAudio">
            <img src="../../assets/music/new/upper.png" alt="">
            <span>上一节</span>
          </p>
        </div>
      </div>
      <!-- 中间暂停按钮 -->
      <div class="audioBox_buttom_center">
        <div
        :style="{ border: $bis == '0' ? '1px solid #409EFF' : '1px solid rgba(222, 47, 47, 1)' }"
          style="width: 11vw;height: 3vh;border-radius: 50%;display: flex;align-items: center;justify-content: center;">
          <div :style="{ backgroundColor: $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)' }"
            style="width: 9vw;height: 2.5vh;border-radius: 50%;display: flex;align-items: center;justify-content: center;">
            <img src="../../assets/music/new/start.png" alt="" style="height: 8vw;" v-if="!isAudioPaused"
              @click="pauseAudio">
            <img src="../../assets/music/new/suspend.png" alt="" style="height: 8vw;" v-else @click="playAudio">
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="audioBox_buttom_right">
        <div class="Icon">
          <p @click="nextAudio">
            <img src="../../assets/music/new/below.png" alt="">
            <span>下一节</span>
          </p>
          <p @click="skipForward">
            <img src="../../assets/music/new/forward.png" alt="">
            <span>前进15s</span>
          </p>
          <p>
            <el-popover placement="bottom" trigger="click" ref="myProper">
              <div style="overflow:auto;width:50vw;">
                <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume"
                  style="width: 49vw;" />
              </div>
              <div slot="reference" style="display: flex; flex-direction: column; align-items: center;"><img
                  src="../../assets/music/new/sound.png" alt="">
                <span>音量</span>
              </div>
            </el-popover>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: this.playlist[0].picture,//图片地址
      audioImg: require('../../assets/musiclogo.png'),//默认图
      musicindex: 1,//当前播放的集数
      play: true,
      audioUrl: this.playlist[0].url,//音频地址
      // 进度条
      currentTime: 0,
      audioDuration: 0,
      isAudioPaused: null,
      volume: 1,//初始音量
      musicindex: 0,
    };
  },
  props: {
    title: {
      type: String,
    },
    playlist: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  computed: {
    changeVersion(){
      return this.$store.state.setting.changeVersion
    },
    // 计算的总时长
    audioDurationTime() {
      return (Math.floor(this.audioDuration / 60) >= 10 ? Math.floor(this.audioDuration / 60) : "0" + Math.floor(this.audioDuration / 60)) + ":" + (Math.round(this.audioDuration % 60) >= 10 ? Math.round(this.audioDuration % 60) : '0' + Math.round(this.audioDuration % 60))
    },
    // 计算的当前时间
    current() {
      return (Math.floor(this.currentTime / 60) >= 10 ? Math.floor(this.currentTime / 60) : "0" + Math.floor(this.currentTime / 60)) + ":" + (Math.round(this.currentTime % 60) >= 10 ? Math.round(this.currentTime % 60) : '0' + Math.round(this.currentTime % 60))
    },

  },
  created() {
    this.$bis = localStorage.getItem('confirmVersion')
  },
  mounted() {
    this.$refs.myAudio.play();
    // 音频是否暂停
    this.isAudioPaused = this.$refs.myAudio.paused
  },
  methods: {
    // 没有图片的加载默认图
    errImg(e) {
      this.imgSrc = this.audioImg
    },
    // 音频成功加载
    initializeAudio() {
      console.log('音频加载完成');
      this.audioDuration = this.$refs.myAudio.duration;
    },
    // 音频播放位置改变自动触发
    updateProgressBar() {
      this.currentTime = this.$refs.myAudio.currentTime;
    },
    // 滑动进度条
    seekToTime() {
      this.$refs.myAudio.currentTime = this.currentTime;
    },
    // 前进15s
    skipForward() {
      const newAudioTime = this.currentTime + 15;
      if (newAudioTime <= this.audioDuration) {
        this.$refs.myAudio.currentTime = newAudioTime;
      } else {
        // 防止超过音频的总时间
        this.$refs.myAudio.currentTime = this.audioDuration
      }
    },
    // 后退15s
    skipBackward() {
      const newAudioTime = this.currentTime - 15;
      if (newAudioTime >= 0) {
        this.$refs.myAudio.currentTime = newAudioTime;
      } else {
        // 防止回退到负时间
        this.$refs.myAudio.currentTime = 0
      }
    },
    // 点击暂停
    pauseAudio() {
      this.$refs.myAudio.pause()
      this.isAudioPaused = this.$refs.myAudio.paused
    },
    // 点击播放
    playAudio() {
      this.$refs.myAudio.play();
      this.isAudioPaused = this.$refs.myAudio.paused

    },
    // 音量改变
    adjustVolume() {
      this.$refs.myAudio.volume = this.volume
    },
    // 点击切换集数
    handchange(item, index) {
      this.musicindex = index
      this.audioUrl = item.url
      this.$refs.myAudio.load()
      this.$refs.myAudio.play()
    },
    // 上一节
    lastAudio() {
      let index = 0;
      index = this.musicindex
      if (this.musicindex <= 0) return
      this.musicindex = index - 1
      this.audioUrl = this.playlist[this.musicindex].url
      this.$refs.myAudio.load()
      this.$refs.myAudio.play()
    },
    // 下一节
    nextAudio() {
      let index = 0;
      index = this.musicindex
      if (this.musicindex >= this.playlist.length - 1) return
      this.musicindex = index + 1
      this.audioUrl = this.playlist[this.musicindex].url
      this.$refs.myAudio.load()
      this.$refs.myAudio.play()
    },
    stop() {
      this.$refs.myAudio.pause()
    },
  },

  beforeDestroy() {
    this.stop()
  }

};
</script>
<style scoped lang="scss">
.audioBox {
  height: 22vh;
  margin-bottom: 2vh;

  .audioBox_top {
    width: 100%;
    height: 17vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  // 进度条部分
  .audioBox_center {
    padding: 0 5vw;
    box-sizing: border-box;

  }

  .audioBox_buttom {
    height: 3vh;
    display: flex;
    align-items: center;
    margin-bottom: 1vh;

    img {
      width: 5vw;
      height: 5vw;
    }

    span {
      font-size: 3vw;
    }

    .Icon {
      display: flex;

      p {
        display: flex;
        flex-direction: column;
        margin: 0 2vw;
        align-items: center;
        justify-content: center;
      }
    }

    // 每块
    .audioBox_buttom_left {
      width: 40vw;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .audioBox_buttom_center {
      width: 10vw;
      height: 100%;
      background: blue($color: #000000);

    }

    .audioBox_buttom_right {
      width: 40vw;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

  }
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }

}

.circle {
  animation: rotate 5s linear infinite;
}

.blue {
  background-color: #2954f0;
  color: white;
}

.none {
  color: black;
}
</style>
