<template>
  <div ref="readpage" class="readpage" style="position: absolute; height: 100vh; width: 100vw">
    <el-dialog :visible.sync="dialogVisible" width="90%" class="dialog" :before-close="handleClose"
      customClass="customid" :show-close="closeshow" style="margin: 0 2%">
      <div ref="draggableDiv" @touchstart="startDragging" @touchmove="drag" @touchend="endDragging" id="body"
        :style="{ 'background-color': color, top: bodytop }" class="body">
        <img src="../assets/closes.png" alt="" style="
            position: absolute;
            border: 5px solid white;
            border-radius: 50%;
            top: 40%;
            right: -8%;
            width: 6vw;
            z-index: 1000;
          " @click="dialogVisible = false" />
        <!-- <div class="body"> -->
        <div v-if="type == '听书'">
          <music :key="Key" ref="music" :title="title" :playlist="musiclist" @text="updateChildText"
            @musicindex="handleUpdate"></music>
        </div>
        <div v-if="type == '视听'">
          <p class="title" style="margin: 2% 0">
            {{ title }}
          </p>
          <videos :key="Key" :filetitleVideo="filetitle" :options="videoOptions" @videoindex="handleUpdate"
            ref="videopause"></videos>
        </div>
        <div v-if="type == '图书'">
          <div v-if="read == false" style="text-align: center">
            <img src="../assets/default.png" alt="" style="width: 30vw; margin: 1vh auto"
              v-if="!picturepath" />
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
              " v-else>
              <img :src="picturepath" alt="" style="height: 35vw" />
              <img style="width: 40vw" src="../assets/buttomBoard.png" alt="" />
            </div>
            <p class="title" v-if="read" style="color: #0747de !important; font-weight: bold">
              {{ title }}
            </p>
            <p class="title" v-else>
              {{ title }}
            </p>
            <p v-if="publisher" style="font-size: 3vw; margin-bottom: 1vh">
              {{ publisher || "" }}
            </p>
            <p v-if="authors" style="font-size: 2vw; margin-bottom: 1vh">
              作者:{{ authors || "" }}
            </p>
            <br />
            <el-button type="primary" :style="{
              backgroundColor:
                $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)',
            }" round style="
                width: 30vw;
                font-size: 3vw;
                height: 2vh;
                border-radius: 1vh;
                border: none !important;
              " @click="readbook">开始阅读</el-button>
            <p v-if="description" style="
                width: 60vw;
                margin: 0 auto;
                font-size: 2vw;
                margin-bottom: 1vh;
                margin-top: 1vh;
              ">
              {{ description }}
            </p>
            <div style="
                flex-direction: column;
                align-items: center;
                justify-content: center;
              " class="qrcode show" :style="{ 'background-color': color }">
              <div style="
                  padding: 0.5vh;
                  box-sizing: border-box;
                  border: 5px solid #c6d4ea;
                  border-radius: 0.5vh;
                ">
                <div class="Qrcode" ref="qrcode" v-if="type == '图书'" @click="go()"></div>
              </div>
              <p style="font-size: 4vw; color: #000">微信扫码，带走阅读</p>
            </div>
          </div>
          <epubs :key="Key" ref="epub" v-show="read" @loadErr="loadErrHandler"></epubs>
        </div>
        <div v-if="type == '图书'" style="padding: 1vh 0" class="bdy" :style="{ 'background-color': color }"></div>
        <div style="
            flex-direction: column;
            align-items: center;
            justify-content: center;
          " class="qrcode" v-show="type != '图书'">
          <div style="
              padding: 0.5vh;
              box-sizing: border-box;
              border: 5px solid #c6d4ea;
              border-radius: 0.5vh;
            ">
            <div class="Qrcode" ref="qrcode" v-if="type != '图书'"></div>
          </div>
          <p style="font-size: 4vw; color: #000">微信扫码，带走阅读</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Qrcode from "qrcodejs2-fix";
import ePub from "epubjs";
import { mapState } from "vuex";
import epubs from "./response/epubs.vue";
import music from "./response/music.vue";
import videos from "./response/video.vue";

export default {
  name: "WaterRead",
  data() {
    return {
      bodytop: 0,
      clickY: "",
      address: "", //本地存储路径
      types: "",
      closeshow: false,
      read: false,
      qrcode: "",
      setTime: null,
      dialogVisible: false, //判断弹窗的显示
      title: "", //当前图书标题
      picturepath: "", //当前图书的封面
      etype: "",
      epushTpye: "",
      fileptah: "", //当前图书的地址
      fileptahs: "",
      booktype: "", //当前图书类型
      type: "",
      musiclist: [],
      picture: "",
      videoOptions: {
        controls: true, //开启交互，即是用户可控。
        muted: false, //开启视频时是否静音
        fluid: true, //根据外层css样式大小，自动填充宽高！比较实用，可搭配响应式
        reload: "auto", //重载
        //其余设置根据需求添加！
        autoplay: true,
        poster: "", //视频封面
        sources: [
          //视频播放源，建议本地
          {
            src: "",
            type: "video/mp4",
          },
        ],
      },
      Key: "", //给子组件添加key
      description: "", //简介
      publisher: "", //出版色
      authors: "", //作者
      data_id: "", //当前点击的资源id
      data_fileformat: "", //当前点击资源类型
      filetitle: "", //主要获取视频和音频多集
      // ---------拖动
      isDragging: false,
      startX: 0,
      startY: 0,
      initialTop: 0,
      initialLeft: 0,
      minY: 0, // 最小允许的top坐标
      maxY: 200, // 最大允许的top坐标
      valueIndex: "", //当前集数
      loadErrTimer: null
    };
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      if (newValue) {
        this.bodytop = "40vh"; // 临时更改高度
        // this.bodytop = "30vh";
        this.$nextTick(function () {
          this.makeQrcode();
        });
        this.resetTimeout(); //这里先清空了一些timeout事件,然后下面开始注册这些事件
        // 监听用户的操作事件，例如点击、键盘输入等
        document.addEventListener("click", this.resetTimeout);
        document.addEventListener("keydown", this.resetTimeout);
      } else {
        document.removeEventListener("click", this.resetTimeout);
        document.removeEventListener("keydown", this.resetTimeout);
        // 移除其他事件监听
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        if (this.type == "视听") {
          this.$refs.videopause.stop();
        } else if (this.type == "听书") {
          this.$refs.music.stop(); //这里
        } else {
          this.$refs.epub.stop();
        }
      }
    },
  },
  computed: mapState({
    ...mapState(["setting", "user"]),
    readHeight() {
      return this.$store.state.setting.readHeight;
    },
    time() {
      return this.$store.state.setting.time;
    },
    color() {
      return this.$store.state.setting.color;
    },
    videoStatus() {
      return this.$store.state.setting.videoStatus;
    },
    musicStatus() {
      return this.$store.state.setting.musicStatus;
    },
  }),
  created() {
    this.$bis = localStorage.getItem("confirmVersion");
  },
  mounted() {
    this.address = this.$store.state.setting.filepath;
  },
  components: {
    epubs,
    videos,
    music,

  },
  methods: {
    loadErrHandler() {
      console.log('read.vue');
      this.loadErrTimer = setTimeout(() => {
        this.dialogVisible = false
      }, 6000);
    },
    // 获取当前集数
    handleUpdate(valueIndex) {
      this.valueIndex = valueIndex;
    },
    startDragging(event) {
      this.isDragging = true;
      this.startY = event.touches[0].clientY;
      const rect = this.$refs.draggableDiv.getBoundingClientRect();
      this.initialTop = rect.top;
    },
    drag(event) {
      if (this.isDragging) {
        // 计算新的位置
        const readpage = this.$refs.readpage.getBoundingClientRect();
        const rect = this.$refs.draggableDiv.getBoundingClientRect();
        const deltaY = event.touches[0].clientY - this.startY;
        this.bodytop = this.initialTop + deltaY + "px";
        if (rect.bottom > readpage.bottom - 100) {
          this.isDragging = false;
        }
      }
    },
    endDragging() {
      this.isDragging = false;
    },
    // ----------------
    updateChildText(text) {
      this.fileptahs = text.hpfilepath;
      this.makeQrcode();
    },
    resetTimeout() {
      if (this.setTime) {
        clearTimeout(this.setTime);
      }
      // 设置一个新的定时器，30秒后执行返回首页的操作
      this.setTime = setTimeout(() => {
        // 这里可以调用返回首页的函数，例如使用Vue Router进行导航到首页
        if (this.type == "图书") {
          this.dialogVisible = false;
        } else if (this.type == "视听") {
          if (this.videoStatus == false) {
            this.dialogVisible = false;
          }
        } else {
          if (this.musicStatus == false) {
            this.dialogVisible = false;
          }
        }
      }, this.time); // 30秒 this.time
      // }, 300000); // 30秒 this.time
    },
    makeQrcode() {
      if(!this.$refs.qrcode) {
        this.$message.error('生成二维码失败，请稍后再试')
      }
      this.$refs.qrcode.innerHTML = "";
      if (this.type == "听书") {
        this.types = "audio";
      } else if (this.type == "视听") {
        this.types = "video";
      } else if (this.type == "图书") {
        // this.types = "epub";
        this.types = "book";
      }

      this.qrcode = new Qrcode(this.$refs.qrcode, {
        // text 需要转二维码的内容 可以是文本也可以是一个链接 是链接会直接跳走
        text: `${this.$store.state.setting.downloadAddress
          }/ebookH5/index.html#/${this.types}?id=${this.data_id}&index=${this.valueIndex || 0
          }&type=${this.data_fileformat}`,
        width: 250,
        height: 250,
        colorDark: "#333", //二维码颜色
        colorLight: "#fff", //二维码背景颜色
        correctLevel: Qrcode.CorrectLevel.L, //容错率,L/M/H
      });
    },
    readbook() {
      this.loadErrTimer && clearTimeout(this.loadErrTimer)
      this.read = !this.read;
      this.$refs.epub.loadEpub(
        this.fileptah,
        this.booktype,
        `${this.$store.state.setting.downloadAddress}/ebookH5/index.html#/${this.types}?id=${this.data_id}&type=${this.data_fileformat}`
      );
    },
    async handopen(e, address) {
      // e: e.datasat  address: mouseEvent
      let changeVersion = this.$store.state.setting.changeVersion;
      // 临时加的,用完删掉
      if (changeVersion == "outline") {
        e.pushType = "分类板块";
      }
      this.data_fileformat = e.fileformat;
      this.Key += 1;
      this.data_id = e.id;

      // 打开图书固定高度
      if (this.readHeight == true) {
        this.clickY = "35vh";
      } else {
        if (address.clientY > 4500) {
          this.clickY = "4500px";
        } else {
          this.clickY = address.clientY + "px";
        }
      }
      this.read = false;
      this.type = e.type;
      this.title = e.title;
      if (e.type != "听书") {
        this.fileptahs = `http://192.168.11.7:8080/${e.fileptah}`;
      }

      this.booktype = e.fileformat;
      if (e.type == "图书") {
        if (changeVersion == "online") {
          this.picturepath = e?.picturepath;
          this.fileptah = e.fileptah;
        } else if (changeVersion == "outline") {
          this.picturepath = `${this.address}${e.picturepath}`;
          this.fileptah = `${this.address}${e.fileptah}`;
        }
        if (e.fileformat == ".epub") {
          const folderPath = this.fileptah.replace(/\\/g, "/");
          // const folderPath = 'D:/2023/PuBuLiu/wangkuo_20231023_develop/waterfall-flow/src/assets/“微商创业女王”丁小航手把手教你做微商.epub';
          // 创建一个新的Book实例
          try {
            var book = ePub(folderPath);
          } catch(err) {
            console.error(err)
            this.$message.error('打开失败')
            return;
          }
          book.ready.then(async () => {
            var metadata = book.package.metadata;
            // 提取标题和简介
            this.description = (await metadata.description) || "";
            this.publisher = (await metadata.publisher) || "";
            // 检查是否存在作者信息，可以有多个作者
            this.authors = (await metadata.creator) || metadata.author || [];
          });
        }
      } else if (e.type == "视听") {
        if (changeVersion == "online") {
          // 修改在线资源
          if (e.filetitle?.includes(";")) {
            let addressOne = e.filetitle.split(";")[0];
            // let address;
            // if (addressOne.includes("=http")) {
            //   address = addressOne.slice(5, addressOne.length);

            // } else {
            //   address = addressOne.slice(0, addressOne.length);

            // }
            let address = addressOne.includes("http") ? addressOne.slice(5) : addressOne;

            this.videoOptions.sources[0].src = address;
          } else {
            // let address = e.filetitle.slice(5, e.filetitle.length);
            let address = e.filetitle.includes("http") ? e.filetitle.slice(5) : e.filetitle;

            this.videoOptions.sources[0].src = address;
          }
          this.filetitle = e;
          // this.filetitle.address = this.address
        } else if (changeVersion == "outline") {
          console.log(e.fileptah, '------e.fileptah------');
          const pathArray = e.fileptah.split("/");
          console.log(pathArray, '------e.pathArray------');

          const path = pathArray.slice(0, pathArray.length - 1).join("/");
          if (e.filetitle?.includes(";")) {
            // this.videoOptions.sources[0].src = `${this.address}/${e.pushType}/${e.type}/${e.filetitle.split(";")[0]}`;
            console.log(`${this.address}/${path}${e.filetitle.split(";")[0]
              }`, 'sssssssssss');
            this.videoOptions.sources[0].src = `${this.address}/${path}/${e.filetitle.split(";")[0]
              }`;
          } else {
            this.videoOptions.sources[0].src = `${this.address}/${path}/${e.filetitle}`;
          }

          this.filetitle = e;
          this.filetitle.address = this.address;
          console.log(this.filetitle, '-----this.filetitle-----');
          console.log(this.filetitle.address, '-----this.filetitle.address-----');
        }
      } else {
        // 这里是听书逻辑
        if (changeVersion == "online") {
          var musiclistTwo = [];
          // 更新在线逻辑
          e.fileptah.split(";").forEach((item) => {

            // 新加兼容 0004= 逻辑
            musiclistTwo.push(item.includes("=http") ? item.slice(5) : item);
          });
          var musiclist = musiclistTwo.filter((it) => {
            let num = it.slice(0, e.fileptah.lastIndexOf("/"));
            return it != `${num}desktop.ini`;
          });
          var musiclists = [];
          musiclist.forEach((it, index) => {
            let titleOne = it.split("?")[0].split("/");
            let titleTwo = titleOne[titleOne.length - 1];
            musiclists.push({
              url: it, //音频路径
              id: index + 1,
              title: titleTwo,
              picture: e.picturepath, //图片路径
              hpfilepath: ``,
              bookName: e.title,
            });
          });
          this.musiclist = musiclists.sort(function (a, b) {
            function extractNumber(obj) {
              let numPart = obj.title.match(/\d+/);
              return numPart ? parseInt(numPart[0]) : 0;
            }
            return extractNumber(a) - extractNumber(b);
          });
          console.log(this.musiclist);
          // debugger
          this.picture = `${this.address}/${e.pushType}/${e.type}/${e.picturetitle}`;
        } else if (changeVersion == "outline") {
          const pathArray = e.fileptah.split("/");
          const path = pathArray.slice(0, pathArray.length - 1).join("/");
          console.log(path, 'pat-------');
          var musiclist = e.filetitle
            .split(";")
            .filter((it) => it != "desktop.ini");
          var musiclists = [];
          var num = e.fileptah
            .split(";")[0]
            .slice(0, e.fileptah.lastIndexOf("/"));
          var musicpath = e.fileptah
            .split(";")
            .filter((it) => it != `${num}desktop.ini`);
          musiclist.forEach((it, index) => {
            musiclists.push({
              url: `${this.address}/${path}/${it}`,
              id: index + 1,
              title: it,
              picture: `${this.address}/${path}/${e.picturetitle}`, //图片路径
              hpfilepath: `http://192.168.11.7:8080/${musicpath[index]}`,
              bookName: e.title,
            });
          });
          this.musiclist = musiclists.sort(function (a, b) {
            function extractNumber(obj) {
              let numPart = obj.title.match(/\d+/);
              return numPart ? parseInt(numPart[0]) : 0;
            }
            return extractNumber(a) - extractNumber(b);
          });
          console.log(this.musiclist, musiclist);
          this.picture = `${this.address}/${path}/${e.picturetitle}`;
          //  setTimeout(()=>{
          //   console.log(this.$refs.music,'-=--s');
          //   // this.$refs.music.playSong(this.musiclist[0])
          //  },1000)
        }
      }
      this.dialogVisible = true;
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
        reader.onload = function (event) {
          var content = event.target.result;
          console.log(event);
          resolve(content);
          // 处理文件内容
        };
      });
    },
    handleClose(done) {
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.qrcode {
  display: flex;
  margin: 1vh auto;
  justify-content: center;
  align-content: center;
}

.body {
  // border-radius: 3% !important;
  // overflow: hidden;
  // background: red;
  padding-top: 2vh;
  box-sizing: border-box;
  height: auto;
  position: absolute;
  width: 90vw;
}

.readpage::v-deep {
  margin: 0;
  padding: 0;

  .title {
    text-align: center;
    font-size: 3vw;
    color: #000000;
    font-weight: 800;
    margin-bottom: 1vh;
  }

  .el-dialog__wrapper {
    .el-dialog {
      position: fixed;
      margin-top: 0 !important;
      border-radius: 75px;
    }
  }
}
</style>
