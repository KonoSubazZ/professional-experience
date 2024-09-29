<template>
  <div style="position: relative">
    <div class="left" @click="prev()"></div>
    <div class="right" @click="next()"></div>
    <div v-if="clickPageTrue && !isLoadErr" class="clickPage">
      <img src="../../assets/clickPage.png" alt="" />
      <p>点击翻页</p>
    </div>
    <div
      ref="contents"
      class="container"
      :style="{ backgroundColor: `${color}` }"
      v-if="type == '.txt'"
      v-loading="!isResourceLoadingComplete"
      element-loading-text="加载资源中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div v-for="(line, index) in currentPageLines" :key="index">
        <p :style="{ fontSize: `${size}px` }">{{ line }}</p>
      </div>
    </div>
    <div
      ref="pdfContainer"
      class="container"
      :style="{ backgroundColor: `${color}` }"
      v-else-if="type == '.pdf'"
      style="font-size: 4rem; position: relative"
      v-loading="!isResourceLoadingComplete"
      element-loading-text="加载资源中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <p
        style="position: absolute; top: 50%; font-size: 6rem"
        v-show="isLoadErr"
      >
        文件格式损坏,请先阅读其他资源
      </p>
      <canvas
        @click.stop
        @touchstart.stop
        style="display: block"
        id="canvas_id"
      />
    </div>
    <div
      id="container"
      class="containera"
      :style="{ backgroundColor: `${color}` }"
      style="font-size: 4rem"
      v-else
      v-loading="!isResourceLoadingComplete"
      element-loading-text="加载资源中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <p
        style="position: absolute; top: 20%; font-size: 6rem"
        v-show="isLoadErr"
      >
        文件格式损坏,请先阅读其他资源
      </p>
    </div>

    <div class="containers" style="position: relative; font-size: 14rem">
      <div v-if="tabindex == 1 && setshow" class="mululist">
        <p class="settingName">目录</p>
        <ul v-if="showml" class="list_one">
          <li
            v-for="(item, index) in titlelist"
            :key="index"
            @click="menuli(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div v-if="tabindex == 2 && setshow" class="mululist">
        <p class="settingName">字体大小：</p>
        <div style="display: flex; margin-top: 6vw">
          <div
            v-for="(item, index) in sizelist"
            :key="index"
            @click="setFontSize(item)"
            :class="
              size == item
                ? 'settingName color border colors'
                : 'settingName color border '
            "
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div v-if="tabindex == 3 && setshow" class="mululist">
        <p class="settingName">阅读背景：</p>
        <div style="display: flex; margin-top: 6vw">
          <div
            v-for="(item, index) in colorlist"
            :key="index"
            :style="{ backgroundColor: `${item}` }"
            class="color"
            @click="colorset(item)"
          ></div>
        </div>
      </div>
      <div v-if="setshow" class="setpage">
        <div>
          <div v-if="tabindex == 1">
            <img src="../../assets/setting/mulu_g.png" alt="" />
            <p class="p2">目录</p>
          </div>

          <div v-else @click="set(1)">
            <img src="../../assets/setting/mulu.png" alt="" />
            <p class="p1">目录</p>
          </div>
        </div>
        <div>
          <div v-if="tabindex == 2">
            <img src="../../assets/setting/zi_g.png" alt="" />
            <p class="p2">字体</p>
          </div>

          <div v-else @click="set(2)">
            <img src="../../assets/setting/zi.png" alt="" />
            <p class="p1">字体</p>
          </div>
        </div>
        <div>
          <div v-if="tabindex == 3">
            <img src="../../assets/setting/black_g.png" alt="" />
            <p class="p2">背景</p>
          </div>

          <div v-else @click="set(3)">
            <img src="../../assets/setting/black.png" alt="" />
            <p class="p1">背景</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btnz">
      <!-- <el-button @click="setting()" class="btn" type="primary" round>设置</el-button> -->
      <div
        style="
          margin-bottom: 1vh !important;
          display: flex;
          justify-content: space-around;
          width: 100%;
        "
      >
        <div
          style="display: flex; flex-direction: column; align-items: center"
          @click="prev"
          v-if="isResourceLoadingComplete"
        >
          <el-button
            style="border: none !important"
            :style="{
              backgroundColor: $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)',
            }"
            icon="iconfont icon-jiantou_shangyiye"
            class="btn"
            type="primary"
            round
          ></el-button>
          <p
            :style="{ color: $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)' }"
            style="font-size: 4vw; margin-top: 1vh"
          >
            上一页
          </p>
        </div>
        <div
          style="display: flex; flex-direction: column; align-items: center"
          @click="next"
          v-if="isResourceLoadingComplete"
        >
          <el-button
            style="border: none !important"
            :style="{
              backgroundColor: $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)',
            }"
            icon="iconfont icon-jiantou_xiayiye"
            class="btn"
            type="primary"
            round
          ></el-button>
          <p
            :style="{ color: $bis == '0' ? '#409EFF' : 'rgba(222, 47, 47, 1)' }"
            style="font-size: 4vw; margin-top: 1vh"
          >
            下一页
          </p>
        </div>
      </div>
      <!-- <el-popover placement="top" width="340" trigger="click" popper-class="change" ref="qrCode">
        <div class="ceshi">
          <div class="Qrcode twoCode" ref="qrcoed"></div>
        </div>
        <el-button @click="phone()" class="btn" type="primary" round slot="reference">手机阅读</el-button>
      </el-popover> -->
      <div
        style="
          padding: 0.5vh;
          box-sizing: border-box;
          border: 5px solid #c6d4ea;
          border-radius: 0.5vh;
        "
      >
        <div class="Qrcode twoCode" ref="qrcoed"></div>
      </div>
      <p style="font-size: 4vw; color: #000">微信扫码，带走阅读</p>
    </div>
  </div>
</template>

<script>
import ePub from "epubjs";
import * as PDFJS from "pdfjs-dist/legacy/build/pdf.js";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";
const cMapUrl = "../../../node_modules/pdfjs-dist/cmaps/";
PDFJS.workerSrc = workerSrc;
import fs from "fs";
import Qrcode from "qrcodejs2-fix";
import axios from "axios";
export default {
  data() {
    return {
      type: "", //图书类型
      // txt
      txtContent: "", // 存储文本内容
      linesPerPage: 50, // 每页显示的行数
      currentPage: 1, // 当前页数
      size: "12", // 字体大小

      // epub
      phoneshow: true,
      tabindex: 1,
      book: null,
      color: "",
      rendition: null,
      navigation: null,
      setshow: false,
      showml: false, //目录显示与隐藏
      setlist: [],
      colorlist: ["#E5E5E5", "#EBE4CE", "#D5E8DD", "#E6E1F2", "#2B2B2B"],
      sizelist: ["12", "14", "16", "18"],
      QrcodeTitle: "",
      clickPageTrue: true, //点击的提示图片是否显示

      // pdf
      pdfPages: 0, // pdf文件总页数
      currentPage: 1, // 当前页
      pdfDoc: null, // 保存加载的pdf文件流
      pdfScale: 4, // 设置文件显示比例
      showCatalog: false, // 关闭目录
      pdfUrl: null,
      showView: false,

      // 节流
      throttleTime: null,
      throttle: false,
      isResourceLoadingComplete: false, // 资源是否加载完成
      isLoadErr: true, // 是否加载失败
    };
  },
  created() {
    this.$bis = localStorage.getItem("confirmVersion");
  },
  mounted() {
    this.book = null;
    this.color = this.colorlist[0];
    this.clickPageTrue = true;
    // this.$nextTick(() => {
    //   this.makeQrcode()
    // })
  },

  computed: {
    totalPages() {
      const totalLines = this.txtContent.split("\n").length;
      return Math.ceil(totalLines / this.linesPerPage);
    },
    currentPageLines() {
      const startIndex = (this.currentPage - 1) * this.linesPerPage;
      const endIndex = startIndex + this.linesPerPage;
      return this.txtContent
        .split("\n")
        .slice(startIndex, endIndex)
        .filter((line) => line.trim() !== ""); // 忽略空行
    },
  },
  methods: {
    phone() {
      this.phoneshow != this.phoneshow;
      if (this.phoneshow == true) {
        this.makeQrcode();
      }
    },
    makeQrcode() {
      this.$refs.qrcoed.innerHTML = "";
      this.qrcode = new Qrcode(this.$refs.qrcoed, {
        // text 需要转二维码的内容 可以是文本也可以是一个链接 是链接会直接跳走
        text: this.QrcodeTitle,
        width: 300,
        height: 300,
        colorDark: "#333", //二维码颜色
        colorLight: "#fff", //二维码背景颜色
        correctLevel: Qrcode.CorrectLevel.L, //容错率,L/M/H
      });
    },

    // 暂时没用到 -- 设置
    sizeset(e) {
      console.log(e);
    },

    // 暂时没用到 -- 设置
    stop() {
      // this.$refs.qrCode.doClose()
    },

    // 暂时没用到 -- 设置
    colorset(e) {
      this.color = e;
    },

    // 暂时没用到 -- 设置
    set(e) {
      this.tabindex = e;
      if (e == 1) {
        this.mulu();
      }
    },

    // 暂时没用到 -- 设置
    setting() {
      this.setshow = !this.setshow;
      if (this.type == ".epub") {
        if (this.tabindex == 1) {
          this.mulu();
        }
      } else {
        this.tabindex = 2;
      }
    },

    // 暂时没用到 -- 设置
    menuli(e) {
      this.book.rendition.display(e.href);
      this.showml = !this.showml;
      this.setshow = !this.setshow;
    },

    // 打开目录 暂时没用到
    mulu() {
      this.showml = !this.showml;
      this.book.ready
        .then(() => {
          this.navigation = this.book.navigation;

          return this.book.locations.generate();
        })
        .then((result) => {})
        .catch((err) => {
          console.log(err);
        });
    },

    // 暂时没用到
    setFontSize(fontSize) {
      this.size = fontSize;
      if (this.type == ".epub") {
        if (this.rendition.themes) {
          this.rendition.themes.fontSize(40 + "px");
        }
      } else {
      }
    },

    // 暂时没用到
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          if (file.name.endsWith(".txt")) {
            this.parseTxt(fileContent);
          } else if (file.name.endsWith(".epub")) {
            this.parseEpub(fileContent);
          } else {
            console.log("Unsupported file format");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },

    /**
     * 加载资源
     * @param {文件路径} filePath
     * @param {文件类型} fileType
     * @param {H5地址} qrcodePath
     */
    async loadEpub(filePath, fileType, qrcodePath) {
      console.log("--filePath--🚀", filePath);
      console.log("--fileType--🚀", fileType);
      // 重置提示语状态
      this.isLoadErr = false;
      this.QrcodeTitle = qrcodePath; // 获取二维码扫描路径
      this.makeQrcode();
      this.type = fileType;

      const folderPath = filePath.replace(/\\/g, "/");
      const isOnlineVersion =
        this.$store.state.setting.changeVersion === "online";

      try {
        const data = isOnlineVersion
          ? await this.fetchFileFromServer(folderPath)
          : await this.fetchFileFromLocal(folderPath);

        if (this.book) {
          this.book.destroy();
        }

        this.parseFile(data, fileType, folderPath);
      } catch (error) {
        this.isResourceLoadingComplete = true;
        // console.error(error, '文件路径');
        // console.error(error, '加载错误');
      }
    },

    async fetchFileFromServer(folderPath) {
      try {
        console.time(`加载资源耗时`);
        const response = await axios.get(folderPath, {
          responseType: "arraybuffer",
        });
        console.timeEnd(`加载资源耗时`);

        // const timeInMilliseconds = performance.now() - startTime; // 或者使用其他方法获取
        // const timeInSeconds = timeInMilliseconds / 1000;

        // // 输出以秒为单位的时间
        // console.log("加载资源耗时: " + timeInSeconds + " 秒");

        return response.data;
      } catch (error) {
        this.$emit("loadErr");
        // 资源加载失败

        this.isResourceLoadingComplete = true;

        this.isLoadErr = true;
        console.log("--errorFilePath--🚀", folderPath);
        throw new Error("Error fetching file from server");
      }
    },

    async fetchFileFromLocal(folderPath) {
      try {
        console.time(`加载资源耗时`);

        const data = fs.readFileSync(folderPath);
        console.timeEnd(`加载资源耗时`);

        return data.buffer;
      } catch (error) {
        this.isLoadErr = true;
        this.isResourceLoadingComplete = true;
        console.log("加载错误");
        this.$emit("loadErr");
        console.log(folderPath, "===异常文件路径===");
        throw new Error("Error fetching file from local");
      }
    },

    parseFile(data, fileType, folderPath) {
      switch (fileType) {
        case ".epub":
          this.parseEpub(data, folderPath);
          break;
        case ".pdf":
          this.parsePdf(folderPath, data);
          break;
        default:
          this.parseTxt(data);
      }
    },

    // 新增解析pdf
    parsePdf(pdfPath, data) {
      console.time(`解析资源耗时`);

      setTimeout(() => {
        PDFJS.getDocument({
          url: pdfPath,
          cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/",
          cMapPacked: true,
        })
          .promise.then((parsePDFRes) => {
            console.timeEnd(`解析资源耗时`);

            this.pdfDoc = parsePDFRes;
            this.pdfPages = parsePDFRes.numPages; //页数
            this.renderPage(this.currentPage);
            this.showView = true;
            this.isResourceLoadingComplete = true;
          })
          .catch((error) => {
            this.isLoadErr = true;
            this.$emit("loadErr");

            console.log(pdfPath, "===文件解析格式异常路径===");
            console.log("PDF Open Error:", error);

            this.isResourceLoadingComplete = true;
          });
      }, 1000);
    },
    renderPage(num) {
      //0.获取每一页的内容
      this.pdfDoc.getPage(num).then((page) => {
        //1.获取canva节点
        let canvas = document.getElementById("canvas_id");
        //2.获取上下文
        let ctx = canvas.getContext("2d");
        //3.获取像素比，将canvas宽高进行发达缩小，解决canvas失真
        const dpr = window.devicePixelRatio || 1; //设备像素
        const bsr =
          window.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
        const ratio = dpr / bsr;
        //获取视图宽高
        const viewport = page.getViewport({ scale: 2 }); //设置文件显示比例
        const CSS_UNITS = 96.0 / 72.0;
        canvas.width = viewport.width * CSS_UNITS;
        canvas.height = viewport.height * CSS_UNITS;
        canvas.style.width = 100 + "%"; //0.04时为了改成相对单位
        canvas.style.height = 100 + "%"; //px改成em：0.038
        //设置背景色
        // ctx.fillStyle="#C2D8AA";
        //ctx.fillRect(0,0,300,200);
        //设置当pdf在缩小和放大状态时可以拖动

        // ctx.setTransform(CSS_UNITS , 0, 0, CSS_UNITS , 0, 0);

        // var CSS_UNITS = 96.0 / 72.0;
        const renderContext = {
          transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
          canvasContext: ctx,
          viewport: viewport,
        };
        //将pdf文件上传到canvase
        page.render(renderContext);
      });
    },
    parseTxt(txtContent) {
      const txtDecoder = new TextDecoder("utf-8");
      const txtText = txtDecoder.decode(txtContent);
      // 渲染 txt 文本内容
      this.renderContent(txtText);
    },
    goToPrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.setPageContent(this.currentPage);
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.setPageContent(this.currentPage);
      }
    },
    async parseEpub(epubContent, folderPath) {
      console.time(`解析资源耗时`);

      this.book = new ePub.Book();
      this.book
        .open(epubContent)
        .then((res) => {
          console.timeEnd(`解析资源耗时`);

          this.book.loaded.navigation.then((hfg) => {
            this.titlelist = hfg;
            const container = document.getElementById("container");
            container.style.lineHeight = "10px;";
            this.rendition = this.book.renderTo(container, {
              snap: true, //翻页动画
              restore: true,
              width: "100%",
              height: "32vh",
              manager: "continuous",
              spread: "none", // 设置为 'none' 将展示为单页
              flow: "paginated", //scrolled-doc滚动 paginated分页
              spacing: "2em",
            });
            // 设置容器的字体间距
            container.style.lineHeight = "1.5"; // 1.5 倍行高，可以根据需要进行调整
            this.rendition.themes.fontSize(32 + "px");
            // this.book.setStyle("font-size", "1.2em");
            this.book.rendition.display();
            this.isResourceLoadingComplete = true;
            // container.innerText = "";
          });
        })
        .catch((error) => {
          this.isLoadErr = true;
          this.$emit("loadErr");
          console.log(folderPath, "===文件解析格式异常路径===");

          console.log("EPUB Open Error:", error);

          this.isResourceLoadingComplete = true;
        });
    },
    renderContent(content) {
      console.log(content, "---content+++");
      this.isResourceLoadingComplete = true;
      this.totalPages = Math.ceil(content.length / this.pageSize);
      this.paginateContent(content);
    },
    paginateContent(txtContent) {
      // console.log(txtContent)
      this.txtContent = txtContent;
    },
    // 上一页
    prev() {
      if (!this.isResourceLoadingComplete) {
        return;
      }
      if (!this.throttle) {
        this.throttle = true;
        this.clickPageTrue = false; //点击翻页隐藏提示的点击图标
        if (this.type == ".epub") {
          this.book.rendition.prev();
        } else if (this.type == ".pdf") {
          if (this.currentPage <= 1) {
            this.currentPage = 1;
            return;
          }
          this.currentPage--;
          this.renderPage(this.currentPage); //获取页面信息
        } else {
          this.prevPage();
        }
        clearTimeout(this.throttleTime);
        this.throttleTime = setTimeout(() => {
          this.throttle = false;
        }, 500);
      }
    },
    // 下一页
    next() {
      if (!this.isResourceLoadingComplete) {
        return;
      }
      if (!this.throttle) {
        this.throttle = true;
        this.clickPageTrue = false; //点击翻页隐藏提示的点击图标
        if (this.type == ".epub") {
          this.book.rendition.next();
        } else if (this.type == ".pdf") {
          this.currentPage++;
          if (this.currentPage > this.pdfPages) {
            this.currentPage = this.pdfPages;
            return;
          }
          this.renderPage(this.currentPage); //获取页面信息
        } else {
          this.nextPage();
        }
        clearTimeout(this.throttleTime);
        this.throttleTime = setTimeout(() => {
          this.throttle = false;
        }, 500);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    close() {
      this.setshow = false;
      this.book.destroy();
    },
  },
};
</script>
<style>
.el-loading-text {
  font-size: 2rem !important;
}
</style>
<style scoped lang="scss">
.left {
  // 左测翻页隐藏按钮
  height: 25vh;
  width: 40vw;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  opacity: 0;
}

.right {
  // 右测翻页隐藏按钮
  height: 25vh;
  width: 40vw;
  background: red;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10000;
  opacity: 0;
}

// 点击提示的图片
.clickPage {
  width: 25vw;
  height: 3.5vh;
  border-radius: 10vw;
  background: rgba(51, 51, 51, 0.1);
  position: absolute;
  top: 20vh;
  right: 15vw;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 8vw;
    height: 8vw;
  }

  p {
    font-size: 3vw;
    color: #333333;
  }
}

.container {
  width: 80%;
  height: 32vh;
  margin: 5% auto;
  position: relative;
}

.containers {
  width: 80%;

  margin: 5% auto;
  position: absolute;
  top: 88%;
  right: 10%;
}

.containera {
  width: 80%;
  margin: 0% auto;
  height: 32vh;
}

.btn {
  width: 10vw;
  height: 10vw;
  margin: 0 3vw;
  font-size: 7vw;
  border-radius: 50%;
}

.btnz {
  display: flex;
  // flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.p1 {
  font-size: 3vw;
  line-height: 1.6;
  margin: 0 auto;
}

.p2 {
  font-size: 3vw;
  line-height: 1.6;
  margin: 0 auto;
  color: #6bffdc;
}

.setpage {
  display: flex;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 11.4vw;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: center;

  div {
    margin: 0 auto;

    img {
      width: 5vw;
      height: 5vw;
    }
  }
}

.list_one {
  list-style-type: none;
  width: 100%;
  margin: 5% auto;

  li {
    margin: 2% 5%;
    width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    font-size: 3vw;
    color: white;
    text-align: left;
  }
}

.mululist {
  position: absolute;
  bottom: 11vw;
  height: 12vh;
  width: 100%;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.7);

  .list_one {
    height: 8vh;
    overflow-x: hidden;
  }
}

.color {
  width: 10vw;
  height: 7vw;
  margin: 2% auto;
}

.colors {
  background-color: #6bffdc;
}

.settingName {
  font-size: 3vw;
  margin-left: 2%;
  text-align: left;
  color: white;
}

.wenzi {
  width: 20vw;
  height: 10vw;
  margin: 2%;
}

.border {
  width: 15vw;
  margin: 0 3vw;
  text-align: center;
  height: 5vw;
  line-height: 6vw;
  border: 1px solid white;
}

.ceshi {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
