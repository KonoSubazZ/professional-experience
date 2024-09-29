<template>
  <div>
    <div @click="toggleVideo" style="width: 100%;height: 14vh; opacity: 0;z-index: 11000; position: absolute;top: 2vh;left: 0;"></div>
    <div id="content">
      <video  class="video-js" ref="VideoPlayer" id="myvideo" controls preload="auto" />
    </div>
    <div class="video-list" v-if="fileTrue" style="position: relative;">
      <el-popover placement="top-start" width="auto" trigger="click" ref="musiclist">
        <div style="max-height:7vh;overflow:scroll;top: 100%; width: auto !important;">
          <div style="font-size: 2vw;" v-for="(item, index) in filetitleList" :key="index"
            @click="handchange(item, index)" :class="videoIndex == index ? 'blue' : 'none'">
            {{ filetitleVideo.title }} 第{{ index + 1 }}集</div>
        </div>
        <div class="mar" style="align-items: flex-start;margin-top: 1%;" slot="reference">
          <img src="../../assets/music/new/directory.png" alt="" class="prev" style="padding-top:-1vw">
          <p class="text">目录</p>
        </div>
      </el-popover>
      <!-- 列出所有视频集数，点击时切换视频源 -->
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import videojs from "video.js";
import "video.js/dist/video-js.css";
export default {
  name: "VideoJs",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    filetitleVideo: {
      type: DOMStringMap,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      videohtml: null,
      player: null,
      num: 0,
      video: this.$refs.videoPlayer,
      videoFilePath: null,
      filetitleList: [],//视频多级列表
      fileTrue: null,
      videoIndex: 0,

    };
  },
  computed:{
    changeVersion(){
      return this.$store.state.setting.changeVersion
    }
  },
  mounted() {
    // debugger 
    if (this.filetitleVideo && this.filetitleVideo.filetitle.includes(";")) {
      if(this.changeVersion =='online'){
        let arr=this.filetitleVideo.filetitle.split(';')
        let acceptArr=[]
        arr.forEach(item=>{
          acceptArr.push(item.slice(5,item.length))
        })
        this.filetitleList=acceptArr
        this.fileTrue = true
      }else if(this.changeVersion =='outline'){
        this.filetitleList = this.filetitleVideo.filetitle.split(';')
        this.fileTrue = true
      }
    }
    this.play()
  },
  methods: {
    toggleVideo(){
      console.log('点击了',this.player.paused());
      if (this.player.paused()) {
        this.player.play(); // 如果视频暂停，播放视频
      } else {
        this.player.pause(); // 如果视频正在播放，暂停视频
      }
    },
    // 选集
    handchange(item, index) {
      this.$emit('videoindex', index); //这个方法主要是重新渲染对应的二维码数据,好像和在线不在线没什么关系
      this.videoIndex = index
      if(this.changeVersion=='online'){
        this.options.sources[0].src = this.filetitleList[index]
      }else if(this.changeVersion=='outline'){
        this.options.sources[0].src = `${this.filetitleVideo.address}/${this.filetitleVideo.pushType}/${this.filetitleVideo.type}/${item}`
      }
      this.stop()
      this.$nextTick(() => {
        this.play()
        console.log(this.options, '-- this.options');
      })
    },
    play() {
      var that = this
      if (this.num > 0) {
        $("#content").html('<video  class="video-js" style="position: absolute;" ref="VideoPlayer" id="myvideo" controls preload="auto"></video> <div @click="toggleVideo" style="width: 100%;height: 90%; opacity: 0;position: absolute;top: 0;left: 0;"></div>')
        // this.player.reset();
      }
      this.num++
      setTimeout(() => {
        this.player = videojs(
          "myvideo",
          this.options,
          function () { }
        );
        this.player.play();
      }, 1000)
    },
    stop() {
      if (this.player) {
        this.player.pause() //关闭
        this.player.dispose();//销毁
        this.$store.dispatch('handVideo', false)
      }
    },
  },
  beforeDestroy() {
    // this.stop();
  },
};
</script>

<style scoped lang="scss">
#content {
  background-color: transparent;
  /* 设置容器的背景为透明 */
  height: auto;
  /* 根据视频比例设置容器的高度 */
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  /* 16:9 宽高比 */
}

.video-js {
  position: absolute;
  // top: -1vh;
  // left: 0;
  width: 100%;
  height: 100%;
}
</style>


