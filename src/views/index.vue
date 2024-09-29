<template>
  <div
    class="page"
    :style="{
      backgroundColor:
        $bis == '0' ? 'rgba(41, 84, 240, 1)' : 'rgba(168, 0, 16, 1)',
    }"
  >
    <div>
      <img
        src="../assets/modal.png"
        alt=""
        class="fixed pictures"
        @click="Setting()"
        v-if="buttonHeight"
      />
      <iconBack v-else></iconBack>
    </div>

    <choose
      v-if="set"
      @chooseTwo="chooseChange"
      class="shehzi"
      ref="choose"
    ></choose>
    <settings v-if="settings" ref="settings"></settings>
    <read ref="child"></read>
    <img
      :src="$bis == '0' ? $TY.top : $DJ.top"
      style="width: 100%; height: 12vh"
    />
    <img
      :src="$bis == '0' ? $TY.top : $DJ.top"
      style="
        width: 100%;
        height: 13vh;
        position: absolute;
        left: 0;
        z-index: 10;
      "
      ref="xxx"
    />
    <div @click="handclick($event)" ref="scrollContainer">
      <vue-j-scroll
        v-if="scrollTrue"
        :steep="this.pull"
        singleHeight="0"
        singleWidth="0"
        :loop="true"
        scrollDirection="bottom"
        :data="jsonData"
        ref="scroll"
        class="eval_ul"
      >
        <div style="display: flex; flex-wrap: wrap" class="scroll-container">
          <div
            :class="
              name == '视听'
                ? low == 3
                  ? 'eval_lis'
                  : 'eval_lisa'
                : row == 3
                ? 'eval_lia'
                : 'eval_liaa'
            "
            v-for="(i, index) in jsonData"
            :key="index"
          >
            <div class="eval_li_left" style="position: relative">
              <div :class="name == '视听' ? 'imgs' : 'imga'">
                <img
                  src="../assets/bottom.png"
                  alt=""
                  :class="
                    name == '视听'
                      ? low == 3
                        ? 'trby'
                        : 'trbya'
                      : row == 3
                      ? 'tray'
                      : 'traya'
                  "
                />
                <div>
                  <img
                    src="../assets/video.png"
                    alt=""
                    class="videoplay"
                    v-if="name == '视听'"
                    :data-id="i.id"
                    :data-categoryTitle="i.categoryTitle"
                    :data-fileFormat="i.fileFormat"
                    :data-filePtah="
                      changeVersion == 'outline'
                        ? `/分类板块/${i.typename}/${i.fileTitle}`
                        : i.filePreviewUrl
                    "
                    :data-fileTitle="
                      changeVersion == 'outline'
                        ? i.fileTitle
                        : i.filePreviewUrl
                    "
                    :data-picturePath="
                      changeVersion == 'outline'
                        ? `/分类板块/${i.typename}/${i.pictureTitle}`
                        : i.picturePreviewUrl
                    "
                    :data-pushType="
                      changeVersion == 'outline' ? i.pushType : ''
                    "
                    :data-type="
                      changeVersion == 'outline'
                        ? i.typename
                        : i.type == 0
                        ? '图书'
                        : i.type == 3
                        ? '听书'
                        : '视听'
                    "
                    :data-title="i.title"
                    :data-pictureTitle="i.pictureTitle || ''"
                  />
                  <img
                    style="z-index: 1000"
                    src="../assets/music.png"
                    alt=""
                    :class="row == 3 ? 'musicplay' : 'musicplays'"
                    v-if="name == '听书'"
                    :data-id="i.id"
                    :data-categoryTitle="i.categoryTitle"
                    :data-fileFormat="i.fileFormat"
                    :data-filePtah="
                      changeVersion == 'outline'
                        ? `/分类板块/${i.typename}/${i.fileTitle}`
                        : i.filePreviewUrl
                    "
                    :data-fileTitle="
                      changeVersion == 'outline'
                        ? i.fileTitle
                        : i.filePreviewUrl
                    "
                    :data-picturePath="
                      changeVersion == 'outline'
                        ? `/分类板块/${i.typename}/${i.pictureTitle}`
                        : i.picturePreviewUrl
                    "
                    :data-pushType="
                      changeVersion == 'outline' ? i.pushType : ''
                    "
                    :data-type="
                      changeVersion == 'outline'
                        ? i.typename
                        : i.type == 0
                        ? '图书'
                        : i.type == 3
                        ? '听书'
                        : '视听'
                    "
                    :data-title="i.title"
                    :data-pictureTitle="i.pictureTitle || ''"
                  />
                  <div v-if="i && i.pictureTitle !== ''">
                    <p
                      v-if="!i.picturePreviewUrl"
                      style="
                        font-size: 1.5vw;
                        color: white;
                        position: absolute;
                        top: 105%;
                        left: 20%;
                      "
                    >
                      {{ i.title.slice(0, 13) + "..." }}
                    </p>

                    <img
                      loading="lazy"
                      ref="fadeElement"
                      :class="[
                        name == '视听'
                          ? low == 3
                            ? 'avatara'
                            : 'avataraa'
                          : row == 3
                          ? 'avatar'
                          : 'avatars',
                        radioeffect == false ? '' : 'animate',
                        'waterfall',
                      ]"
                      @error="imgerr($event, i)"
                      :src="
                        changeVersion == 'outline'
                          ? `${filePtah}/分类板块/${i.typename}/${i.pictureTitle}`
                          : i.picturePreviewUrl
                          ? i.picturePreviewUrl
                          : name == '视听'
                          ? morenvideo
                          : name == '听书'
                          ? musicpng
                          : book
                      "
                      :data-id="i.id"
                      :data-categoryTitle="i.categoryTitle"
                      :data-fileFormat="i.fileFormat"
                      :data-filePtah="
                        changeVersion == 'outline'
                          ? `/分类板块/${i.typename}/${i.fileTitle}`
                          : i.filePreviewUrl
                      "
                      :data-fileTitle="
                        changeVersion == 'outline'
                          ? i.fileTitle
                          : i.filePreviewUrl
                      "
                      :data-picturePath="
                        changeVersion == 'outline'
                          ? `/分类板块/${i.typename}/${i.pictureTitle}`
                          : i.picturePreviewUrl
                      "
                      :data-pushType="
                        changeVersion == 'outline' ? i.pushType : ''
                      "
                      :data-type="
                        changeVersion == 'outline'
                          ? i.typename
                          : i.type == 0
                          ? '图书'
                          : i.type == 3
                          ? '听书'
                          : '视听'
                      "
                      :data-title="i.title"
                      :data-pictureTitle="i.pictureTitle || ''"
                    />
                  </div>

                  <div v-else-if="i && i.title">
                    <p :class="row == 3 ? 'categoryTitle' : 'categoryTitles'">
                      {{ i.title }}
                    </p>
                    <img
                      loading="lazy"
                      :class="
                        name == '视听'
                          ? row == 3
                            ? 'avatara'
                            : 'avataraa'
                          : row == 3
                          ? 'avatar'
                          : 'avatars'
                      "
                      :src="
                        i.typename == '视听'
                          ? morenvideo
                          : i.typename == '听书'
                          ? musicpng
                          : book
                      "
                      :data-id="i.id"
                      :data-categoryTitle="i.categoryTitle"
                      :data-fileFormat="i.fileFormat"
                      :data-filePtah="
                        changeVersion == 'outline'
                          ? `/分类板块/${i.typename}/${i.fileTitle}`
                          : i.filePreviewUrl
                      "
                      :data-fileTitle="
                        changeVersion == 'outline'
                          ? i.fileTitle
                          : i.filePreviewUrl
                      "
                      :data-picturePath="
                        changeVersion == 'outline'
                          ? `/分类板块/${i.typename}/${i.pictureTitle}`
                          : i.picturePreviewUrl
                      "
                      :data-pushType="
                        changeVersion == 'outline' ? i.pushType : ''
                      "
                      :data-type="
                        changeVersion == 'outline'
                          ? i.typename
                          : i.type == 0
                          ? '图书'
                          : i.type == 3
                          ? '听书'
                          : '视听'
                      "
                      :data-title="i.title"
                    />
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </vue-j-scroll>
    </div>
    <!-- <img src="../assets/image.png" alt="" style="width: 100%; height: 18vh;" /> -->
    <img
      :src="$bis == '0' ? $TY.image : $DJ.image"
      style="height: 18vh"
      alt=""
      class="imgPicture"
    />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import choose from "../components/choose/choose.vue";
import iconBack from "../components/choose/icon.vue";
import settings from "../components/choose/setting.vue";
import read from "../components/read.vue";
import axios from "axios";
import { batchQuery } from "./batchQuery.js";
export default {
  name: "home",
  data() {
    return {
      newDate: "", //自动关机时间
      currentDayOfWeek: "", //表示当前星期几
      iconPosition: { x: 0, y: 0 },
      isDragging: false,
      receivedMessage: false,
      filePtah: "",
      jsonData: [], //请求的数据
      name: "",
      set: false,
      classification: "",
      swiperTabList: [],
      read: false,
      settings: false,
      setTime: null,
      setTimes: null,
      settingTime: 0,
      scrollPosition: 0, // 记录滚动位置
      scrollPosition: 0,
      fadeIn: false,
      fadeOut: false,
      book: require("../assets/default.png"),
      morenvideo: require("../assets/morenvideo.png"),
      musicpng: require("../assets/musiclogo.png"),
      scrollTrue: false, //是否显示滚动
      categoryId: 91,
    };
  },
  computed: mapState({
    ...mapState(["setting", "user"]),
    changeVersion() {
      return this.$store.state.setting.changeVersion;
    },
    row() {
      return this.$store.state.setting.row;
    },
    radioeffect() {
      return this.$store.state.setting.radioeffect;
    },
    time() {
      return this.$store.state.setting.time;
    },
    buttonHeight() {
      return this.$store.state.setting.buttonHeight;
    },
    low() {
      return this.$store.state.setting.low;
    },
    closeWin() {
      return this.$store.state.setting.closeWin;
    },
    pull() {
      return this.$store.state.setting.pull;
    },
    radioeffect() {
      return this.$store.state.setting.radioeffect;
    },
    time() {
      return this.$store.state.setting.time;
    },
    optionHover() {
      return {
        step: this.$store.state.setting.pull, // 数值越大速度滚动越快
        limitMoveNum: this.jsonData.length, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: false, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 900, // 单步运动停止的时间(默认值1000ms)
        loop: true, // 是否启用循环滚动
        josnTime: null, //每次点击切换类型时候的定时器
      };
    },
  }),
  components: {
    read,
    choose,
    settings,
    iconBack,
  },
  created() {
    this.$bis = localStorage.getItem("confirmVersion");
  },
  watch: {
    settings(val) {
      if (val == true) {
        window.addEventListener("click", this.resetTimeout);
        window.addEventListener("keydown", this.resetTimeout);
      } else {
        window.removeEventListener("click", this.resetTimeout);
        window.removeEventListener("keydown", this.resetTimeout);
      }
    },
    set(val) {
      if (val == true) {
        window.addEventListener("click", this.resetTimeouts);
        window.addEventListener("keydown", this.resetTimeouts);
      } else {
        window.removeEventListener("click", this.resetTimeouts);
        window.removeEventListener("keydown", this.resetTimeouts);
      }
    },
  },
  mounted() {
    ipcRenderer.send("fullscreen");
    this.filePtah = this.$store.state.setting.filepath;
    this.chose(); // todo 为什么要调用两次
    // this.observeDOM();
    //判断当前位置是否到达设置的位置
  },

  methods: {
    imgerr(event, i) {
      event.target.src =
        i.typename == "视听"
          ? this.morenvideo
          : i.typename == "听书"
          ? this.musicpng
          : this.book;
    },
    chooseChange() {
      this.chose();
    },

    resetTimeout() {
      // 每次用户有操作时，重置定时器
      if (this.setTime) {
        clearTimeout(this.setTime);
      }
      // 设置一个新的定时器，30秒后执行返回首页的操作
      this.setTime = setTimeout(() => {
        // 这里可以调用返回首页的函数，例如使用Vue Router进行导航到首页
        if (this.settings == true) {
          this.settings = false;
        }
      }, this.time); // 30秒 this.time
    },
    resetTimeouts() {
      // 每次用户有操作时，重置定时器
      if (this.setTimes) {
        clearTimeout(this.setTimes);
      }
      // 设置一个新的定时器，30秒后执行返回首页的操作
      this.setTimes = setTimeout(() => {
        // 这里可以调用返回首页的函数，例如使用Vue Router进行导航到首页
        if (this.set == true) {
          this.set = false;
        }
      }, this.time); // 30秒 this.time
    },
    disabl() {
      this.settings = false;
    },
    settingShow() {
      this.$nextTick(() => {
        this.set = false;
      });
    },
    sets() {
      this.set = false;
      this.settings = true;
      this.$nextTick(() => {
        this.$refs.settings.dialogVisibleShow();
      });
    },
    startDrag(event) {
      this.isDragging = true;
      // 计算鼠标相对图标的位置
      const offsetX = event.clientX - event.target.getBoundingClientRect().left;
      const offsetY = event.clientY - event.target.getBoundingClientRect().top;
      // 更新图标位置
      this.iconPosition = {
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      };
      // 添加鼠标移动事件监听器
      window.addEventListener("mousemove", this.drag);
    },
    stopDrag() {
      this.isDragging = false;
      // 移除鼠标移动事件监听器
      window.removeEventListener("mousemove", this.drag);
    },
    drag(event) {
      if (this.isDragging) {
        // 更新图标位置
        this.iconPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    },

    // 处理在线或者
    chose(a) {
      // 看看当前是离线还是在线
      let changeVersion = this.$store.state.setting.changeVersion;
      if (changeVersion == "online") {
        //既然是在线版,那么进来这里就需要先将这个持久化存储消灭
        this.$store.dispatch("handlists", []);
      }
      this.scrollTrue = false;
      clearTimeout(this.josnTime);
      this.jsonData = [];
      this.classification =
        this.$store.state.setting.classification.length != 0
          ? this.$store.state.setting.classification
          : "小说传记";
      this.name = a ? a : this.$store.state.setting.typesOf; //这个是大分类的名称
      var datalist = this.$store.state.setting.datalist;

      switch (changeVersion) {
        case "online":
          let type = null;
          switch (this.name) {
            case "图书":
              type = 0;
              break;
            case "视听":
              type = 4;
              break;
            case "听书":
              type = 3;
              break;
          }
          // 走到了这里就需要去拿到大分类和小分类,获取其下面的数据
          let smallClassify = this.$store.state.setting.classification;
          let rightnowCheckedClassify;
          if (
            Array.isArray(this.$store.state.setting.rightnowCheckedCityList)
          ) {
            rightnowCheckedClassify =
              this.$store.state.setting.rightnowCheckedCityList.filter(
                (item) => {
                  return item.title == smallClassify;
                }
              );
          }

          const terminalNumber = localStorage.getItem("SECRETKEY");

          let params = {
            electronBookCategoryId:
              (rightnowCheckedClassify && rightnowCheckedClassify[0]?.id) ||
              this.categoryId, //小分类的id
            type: type || 0,
            pageNumber: 1,
            limit: 500,
            terminalNumber: terminalNumber,
          };
          // if (params.electronBookCategoryId == 137) {
          //   return;
          // }
          const URL = `${this.$store.state.setting.downloadAddress}/ElectronBookToHome/getTheCorrespondingTypeResourcesUnderTheClassification`;
          // axios.post(URL, params) // 如果接口慢就用这个，就先不要批量查
          batchQuery((v) => axios.post(URL, v), params).then(
            (res) => {
              if (res.data.code != 0) {
                console.log("出错了");
                return;
              }

              // 对图书特殊处理  1.picturePreviewUrl 没有封面 但是有文件 2. ;

              this.jsonData = res.data.data.content;
              // if (type == 0 || type == 3) { // 下面一行 过滤了 图书，听书 中 无封面 的数据，这里不应该过滤 2024-09-08 16:40
              //   this.jsonData = res.data.data.content.filter(item => item.picturePreviewUrl);

              // }

              if (Array.isArray(this.jsonData) && this.jsonData.length <= 20) {
                const repeatedData = this.jsonData.slice(
                  0,
                  this.jsonData.length
                );
                let count = 0;
                while (this.jsonData.length < 40 && count < 30) {
                  this.jsonData.push(...repeatedData);
                  count += repeatedData.length;
                }

                // if (type == 0 || type == 3) { // 下面一行 过滤了 图书，听书 中 无封面 的数据，这里不应该过滤 2024-09-08 16:40
                //   this.jsonData = this.jsonData.filter(item => item.picturePreviewUrl);
                // }
                // this.jsonData = this.jsonData.filter(item => item.picturePreviewUrl)
                this.scrollTrue = true;
              } else {
                this.josnTime = setTimeout(() => {
                  this.scrollTrue = true;
                }, 10);
              }

              const len = this.jsonData.length;
              // 需要补齐的图书
              let quantityToBeFilled = 0;
              // debugger
              // 判断是否铺满
              if (this.name === "视听") {
                quantityToBeFilled = this.low - (len % this.low);
              } else {
                quantityToBeFilled = this.row - (len % this.row);
              }

              if (quantityToBeFilled > 0) {
                const randomIndex = Math.floor(Math.random() * len) - 4;
                const repeatedData = this.jsonData.slice(
                  randomIndex,
                  randomIndex + quantityToBeFilled
                );
                this.jsonData.push(...repeatedData);
              }
            },
            (err) => {}
          );
          break;
        case "outline":
          // 这里的主要内容就是调用方法去本地读取数据然存储在localstorage中,然后再将这个数据读取出来
          ipcRenderer.send("hand", this.$store.state.setting.filepath);
          ipcRenderer.removeAllListeners("datas");
          ipcRenderer.on("datas", (event, data) => {
            let finalData = JSON.parse(data);
            sessionStorage.setItem("booklist", data);
            this.$store.dispatch("handlists", finalData);
            this.jsonData = finalData.filter((it) => {
              // it.localFilePath = `/${it.id}/${it.categoryTitle}`
              if (it.typename == this.name) {
                return (
                  it.categoryTitle == this.classification && it.pictureTitle
                );
              }
            });
            const repeatedData = this.jsonData.slice(0, this.jsonData.length);
            let count = 0;
            while (this.jsonData.length < 20 && count < 30) {
              this.jsonData.push(...repeatedData);
              count += repeatedData.length;
            }
            const len = this.jsonData.length;
            // 需要补齐的图书
            let quantityToBeFilled = 0;

            // 判断是否铺满
            if (this.name === "视听") {
              quantityToBeFilled = this.low - (len % this.low);
            } else {
              quantityToBeFilled = this.row - (len % this.row);
            }

            if (quantityToBeFilled > 0) {
              const randomIndex = Math.floor(Math.random() * len) - 4;
              const repeatedData = this.jsonData.slice(
                randomIndex,
                randomIndex + quantityToBeFilled
              );
              this.jsonData.push(...repeatedData);
            }

            this.scrollTrue = true;
          });
          break;
      }
    },
    Setting() {
      this.set = true;
      // this.$nextTick(() => {
      //   this.set = true;
      // })
    },
    handclick(e) {
      if (e.target.dataset.title != undefined) {
        this.$refs.child.handopen(e.target.dataset, e);
      } else {
        this.$refs.scroll.start();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.imgPicture {
  width: 100%;
  height: 19vh;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.categoryTitle {
  position: absolute;
  top: 0.5vh;
  z-index: 10;
  font-size: 2vw;
  text-align: center;
  margin: 10.3vw 0.5vw;
  width: 20vw;
  overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  color: white;
}

.categoryTitles {
  position: absolute;
  z-index: 10;
  font-size: 2vw;
  text-align: center;
  margin: 8vw 0.5vw;
  width: 16vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: white;
}

.fixed {
  position: fixed;
  z-index: 999;
  // left: 10vw;
  // top: 2000px;
  // 临时增加
  top: 60vh;
  right: 0;
}

.pictures {
  width: 3vh;
  height: 3vh;
  z-index: 100;
}

.shehzi {
  width: 100%;
  height: 100vh;
  position: fixed;
  bottom: 2vh;
  z-index: 101;
}

.page {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.back_top {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 13vh;
}

.back_top::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  pointer-events: none;
  z-index: 1;
}

.background {
  background-color: #2954f0;
  width: 100%;
  height: 13vh;
  z-index: 102;
  top: 0;
  left: 0;
  position: absolute;
  background-blend-mode: multiply;
}

.eval_ul {
  width: 100%;
  height: 82vh;
  margin: -7vh auto;
  overflow: hidden;
}

@keyframes breathe {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1.11);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes breathea {
  0% {
    transform: scale(1.11);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1.11);
  }
}

.imgs {
  position: relative;
}

.imga {
  position: relative;
}

.tray {
  position: absolute;
  bottom: -2vh;
  left: -3vw;
  width: 28vw;
  height: var(--base-height);
}

.traya {
  position: absolute;
  bottom: -2vh;
  left: -2.5vw;
  width: 21vw;
  height: var(--base-height);
}

.trby {
  position: absolute;
  bottom: -2vh;
  left: -3vw;
  width: 33.11vw;
  height: var(--base-height);
}

.trbya {
  position: absolute;
  bottom: -2vh;
  left: -4vw;
  width: 44.11vw;
  height: var(--base-height);
}

.eval_lia {
  height: 11vh;
  margin: 0.8vw 5.4vw;
  height: 9vh; //临时调整 三屏style
  margin: 0.2vw 5.4vw; //临时调整 三屏style
}

.eval_liaa {
  height: 7vh;
  width: 12vw;
  margin: 1.8vw 5.8vw;
  z-index: 13;
}

.eval_lia:nth-child(3n + 1) {
  padding-top: 3vh;
}

.eval_lia:nth-child(3n + 3) {
  padding-top: 3vh;
}

.eval_liaa:nth-child(2n + 1) {
  padding-top: 3vh;
}

.eval_lis {
  height: 8vh;
  margin: 1vw auto;
}

.eval_lisa {
  // height: 11vh;
  height: 9vh; // 临时调整 三屏style
  width: 34vw;
  margin: 1vw auto;
}

.eval_lisa:nth-child(2n + 1) {
  padding-top: 3vh;
}

.eval_lis:nth-child(3n + 1) {
  padding-top: 3vh;
}

.eval_lis:nth-child(3n + 3) {
  padding-top: 3vh;
}

.avatar {
  width: 22vw;
  height: 8vh;
  //height: 6vh; //   临时调整 三屏style
}

.animate {
  animation: breathea 3s infinite;
}

@keyframes mymove {
  from {
    left: 0px;
  }

  to {
    left: 200px;
  }
}

@-webkit-keyframes mymove

/* Safari and Chrome */ {
  from {
    left: 0px;
  }

  to {
    left: 200px;
  }
}

.avatars {
  width: 16vw;
  height: 6vh;
}

.avataraa {
  width: 35.1164vw;
  // height: 6.87vh; // 临时调整 三屏style
  height: 5.5vh;
}

.avatara {
  width: 27.1164vw;
  height: 5.37vh;
}

.videoplay {
  position: absolute;
  z-index: 10;
  width: 10vw;
  height: 10vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.musicplay {
  position: absolute;
  z-index: 10;
  width: 10vw;
  height: 10vw;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.musicplays {
  position: absolute;
  z-index: 10;
  width: 10vw;
  height: 10vw;
  margin-left: 2vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.bac {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
}

.ripple-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ripple-image {
  position: relative;
  width: 200px;
}

.ripple-image::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 10%,
    transparent 50%
  );
  background-size: 200px 200px;
  transform: scale(1);
  opacity: 0;
  animation: ripple-animation 1s linear infinite;
}

@keyframes ripple-animation {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
<style lang="css">
.list-body {
  will-change: transform;
}
</style>
