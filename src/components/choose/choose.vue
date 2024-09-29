<template>
  <div>
    <div class="height jieruwang flexbox center">
      <div
        class="cen"
        :style="{
          backgroundColor:
            $bis == '0' ? 'rgba(41, 84, 240, 1)' : 'rgba(168, 0, 16, 1)',
        }"
        v-if="disclick"
      >
        <div class="fixed">
          <div
            v-for="(item, index) in list"
            :key="item"
            @click="choose(item, index)"
            :class="index == indexNum ? 'yellow' : 'green'"
            style="position: relative"
          >
            <img
              :src="$bis == '0' ? $TY.green : $DJ.green"
              alt=""
              v-if="index != indexNum"
              class="background"
            />
            <img
              src="../../assets/yellow.png"
              alt=""
              v-else
              class="background"
            />
            <p class="name_title">{{ item }}</p>
          </div>
        </div>
        <img
          src="../../assets/xian.png"
          alt=""
          style="width: 90%; margin: 0 5%"
        />
        <div class="jc">
          <div
            class="jrwLeft center"
            id="div1"
            ref="bigcircle"
            style="left: 50vw"
            :style="{
              transform: `rotate(${turnRotate}deg)`,
              height: clientWidth + 'vw',
              width: clientWidth + 'vw',
            }"
            @mouseover="stop"
            @mouseout="start()"
          >
            <img
              :src="$bis == '0' ? $TY.yuan : $DJ.yuan"
              alt=""
              style="width: 69vw"
            />
            <div
              @click="chooseTwo(item)"
              v-for="(item, idx) in cityList"
              :key="item + idx"
              @mousedown.prevent
              @mouseup.prevent
              @mousemove.prevent
              :class="[
                'city green',
                'city' + idx,
                city == item ? 'active' : '',
              ]"
              :style="computedCardPosStyle(idx - 1)"
            >
              <img
                :src="$bis == '0' ? $TY.green : $DJ.green"
                alt=""
                :class="backgroundNum"
                style="position: absolute"
              />
              <div
                style="
                  width: 12vw;
                  height: 12vw;
                  z-index: 10;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  name: "jieruWang",
  components: {},
  data() {
    return {
      disabled: false,
      yellow: "background-image: url('@/assets/yellow.png')",
      green: "background-image: url('@/assets/green.png')",

      list: ["设置", "图书", "视听", "听书"],
      isWindowHidden: false, // 添加一个标志来判断窗口是否已经隐藏
      indexNum: 1,
      cityList: [],
      timer: null,
      a0: 0,
      a1: 0,
      circleTimer: null,
      clientWidth: 63,
      smallcircle: 120,
      msg: {},
      city: "图书",
      startX: 0,
      endX: 0,
      UDLMactionTimer: null,
      mouseIsDown: false,
      xGap: 0,
      lastSpeed: 0,
      direction: 1,
      containerScale: 1,
      // 配置
      timeGap: 20,
      turnRotateProportion: 500,
      reduceSpeed: 0.7,
      turntableR: 200,
      cardCount: 19,
      pause: "",
      wxwpause: "",
      zqpause: "",
      clickType: "",
      disclick: true,
    };
  },
  watch: {
    indexNum(val) {
      this.$store.dispatch("handIndexNum", val);
    },
  },
  created() {
    this.$bis = localStorage.getItem("confirmVersion");
  },
  mounted() {
    setTimeout(() => {
      document.addEventListener("click", this.handleClickOutside);
      this.disclick = true;
    }, 10);
    this.disabled = false;
    this.choose();
    // this.indexNum = this.$store.state.setting.indexNum;
    this.$nextTick(() => {
      this.start();
      let container_dom = this.$refs.bigcircle;
      container_dom.addEventListener(
        "mousedown",
        this.handleMouseDown.bind(this)
      );
      container_dom.addEventListener("mouseup", this.handleMouseUp.bind(this));
      container_dom.addEventListener(
        "mouseleave",
        this.handleMouseUp.bind(this)
      );
      container_dom.addEventListener(
        "mousemove",
        this.handleMouseMove.bind(this)
      );
      container_dom.addEventListener(
        "touchstart",
        this.handleMouseDown.bind(this)
      );
      container_dom.addEventListener("touchend", this.handleMouseUp.bind(this));
      container_dom.addEventListener(
        "touchcancel",
        this.handleMouseUp.bind(this)
      );
      container_dom.addEventListener(
        "touchmove",
        this.handleMouseMove.bind(this)
      );
      window.addEventListener("resize", this.responseContainerScale.bind(this));
      window.addEventListener("load", this.responseContainerScale.bind(this));
    });
  },
  beforeDestroy() {
    this.remove();

    this.isWindowHidden = false;
    let container_dom = this.$refs.bigcircle;
    if (!container_dom) return;
    container_dom.removeEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    container_dom.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    container_dom.removeEventListener(
      "mouseleave",
      this.handleMouseUp.bind(this)
    );
    container_dom.removeEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    container_dom.removeEventListener(
      "touchstart",
      this.handleMouseDown.bind(this)
    );
    container_dom.removeEventListener(
      "touchend",
      this.handleMouseUp.bind(this)
    );
    container_dom.removeEventListener(
      "touchcancel",
      this.handleMouseUp.bind(this)
    );
    container_dom.removeEventListener(
      "touchmove",
      this.handleMouseMove.bind(this)
    );
    window.removeEventListener(
      "resize",
      this.responseContainerScale.bind(this)
    );
  },

  methods: {
    handleClickOutside(event) {
      const element = document.querySelector(".cen");
      if (element && !element.contains(event.target)) {
        // 如果点击事件的目标不在元素内部，则关闭窗口
        if (document.querySelector(".flexbox").contains(event.target)) {
          this.$parent.settingShow(); //控制模态框的关闭
          this.isWindowHidden = true; //    设置标志为true
        }
        this.remove();
      }
    },
    remove() {
      this.$nextTick(() => {
        try {
          document.removeEventListener("click", this.handleClickOutside);
          this.disclick = false;
          console.log("移除全局监听事件");
        } catch (e) {
          console.log(e);
        }
      });
    },
    choose(e = "图书", a = 1) {
      console.log(e, a);
      // debugger
      console.log(new Date().getTime(), "开始时间");
      this.indexNum = a;
      let rightnowVersion = this.rightnowVersion;
      if (e) {
        if (e == "设置") {
          this.remove();
          this.disabled = true;
          this.$parent.sets();
        } else {
          if (rightnowVersion == "online") {
            let finnalType = null;
            switch (a) {
              case 1:
                finnalType = 0;
                break;
              case 2:
                finnalType = 4;
                break;
              case 3:
                finnalType = 3;
                break;
            }
            const terminalNumber = localStorage.getItem("SECRETKEY");
            console.log(this.downloadAddress, "this.downloadAddress");
            axios
              .post(
                `${this.downloadAddress}/ElectronBookAndCategoryToHome/getsTheSpecifiedTypeClassification`,
                { type: Number(finnalType), terminalNumber: terminalNumber }
              )
              .then(
                (res) => {
                  console.log(res);
                  if (res.data.code != 0) {
                    console.log("出错了");
                    return;
                  }
                  this.cityList = []; //这个是存放小分类的数组,但是这里面只存在小分类的名称
                  this.city = e; //大分类的名称
                  this.$store.dispatch("handtypesOf", e); //把当前对应的大分类的名称存储起来
                  // 下面这段代码主要是根据大分类找出来其对应的所有数据,然后从这些数据当中筛选出来其中存在多少个小分类,并放入到citylist中去
                  // var changList = this.$store.state.setting.datalist.filter(
                  //   (it) => it.typename == e
                  // );
                  // changList.forEach((it) => {
                  //   if (this.cityList.includes(it.categoryTitle)) {
                  //   } else {
                  //     this.cityList.push(it.categoryTitle);
                  //   }
                  // });
                  // 由于这个接口调用的接口返回的就是以及筛选好了的city,所以这里直接赋值就好了
                  let resArr = [];
                  res.data.data.forEach((item) => {
                    resArr.push(item.title);
                    // if (item.title !== '科学竞技') {

                    // }
                  });

                  this.cityList = resArr;
                  this.$store.dispatch(
                    "handlRightnowChckedCityList",
                    res.data.data
                  );
                  console.log(new Date().getTime(), "结束时间");
                },
                (err) => {}
              );
          } else if (rightnowVersion == "outline") {
            console.log(e, "e---");
            this.cityList = [];
            this.city = e;
            this.$store.dispatch("handtypesOf", e);
            let changeListOne = this.$store.state.setting.datalist;
            var changList = changeListOne.filter((it) => it.typename == e);
            console.log(changList, "dadada");
            changList.forEach((it, i) => {
              // console.log(it.categoryTitle,i);
              if (this.cityList.includes(it.categoryTitle)) {
              } else {
                // console.log(it.categoryTitle);
                this.cityList.push(it.categoryTitle);
              }
            });
            console.log(new Date().getTime(), "结束时间");
          }
        }
      } else {
        let a;
        // 这里只有初次渲染的时候才会进来
        if (rightnowVersion == "online") {
          let typesOf = this.$store.state.setting.typesOf;
          let index = this.list.indexOf(typesOf);
          if (index != -1) {
            a = index;
          } else {
            return;
          }
          let finnalType = null;
          switch (a) {
            case 1:
              finnalType = 0;
              break;
            case 2:
              finnalType = 4;
              break;
            case 3:
              finnalType = 3;
              break;
          }
          const terminalNumber = localStorage.getItem("SECERTKEY");
          console.log(this.downloadAddress, "--this.downloadAddress---");
          axios
            .post(
              `${this.downloadAddress}/ElectronBookAndCategoryToHome/getsTheSpecifiedTypeClassification`,
              { type: Number(finnalType), terminalNumber: terminalNumber }
            )
            .then(
              (res) => {
                if (res.data.code != 0) {
                  console.log("出错了");
                  return;
                }
                console.log(new Date().getTime(), "到请求回来时间");
                let resArr = [];
                res.data.data.forEach((item) => {
                  resArr.push(item.title);
                });
                this.cityList = resArr;
                console.log(new Date().getTime(), "结束时间");
              },
              (err) => {}
            );
        } else if (rightnowVersion == "outline") {
          var changList = this.$store.state.setting.datalist.filter(
            (it) => it.typename == this.$store.state.setting.typesOf
          );
          changList.forEach((it) => {
            if (this.cityList.includes(it.categoryTitle)) {
            } else {
              this.cityList.push(it.categoryTitle);
            }
          });
          console.log(new Date().getTime(), "结束时间");
        }
      }
    },
    chooseTwo(e) {
      // 在执行这个函数的时候就应该知道这里需要检查现在是在线模式还是离线模式,所以下面应该加上一个判断
      console.log(e, "点击选中具体分类要进行查看了");
      this.$store.dispatch("handclassification", e); //储存对应点击的小分类
      this.$parent.Setting(); //展开选择功能页面
      this.$parent.chose(this.city, e); //调用chose方法进行重置,然后就能看到选中的list
      // this.$router.go(0)
      // location.reload();
      this.$parent.settingShow(); //隐藏选择功能页面
      this.$emit("chooseTwo"); //感觉多此一举了,不知道下面两行和上面的this.$parent.Setting()有什么意义,因为我记得在chose方法中就进行了隐藏功能
    },
    handleMouseDown(e) {
      clearInterval(this.UDLMactionTimer);
      this.mouseIsDown = true;
      this.startX = e.clientX || e.touches[0].clientX;
      this.endX = e.clientX || e.touches[0].clientX;
    },
    handleMouseUp() {
      this.mouseIsDown = false;
      clearInterval(this.timer);
      this.timer = null;
      this.startX = 0;
      this.endX = 0;
      if (this.lastSpeed) this.UDLMaction();
    },
    handleMouseMove(e) {
      this.endX = e.clientX || e.touches[0].clientX;
      if (!this.mouseIsDown) return;
      if (!this.timer) {
        this.timer = setInterval(() => {
          let moveGap = this.endX - this.startX;
          this.lastSpeed = moveGap / this.timeGap;
          this.xGap += moveGap;
          this.direction = moveGap > 0 ? 1 : -1;
          this.startX = this.endX;
        }, this.timeGap);
      }
    },
    computedCardPosStyle() {
      return {
        transform: `rotate(${-this.turnRotate}deg)`,
      };
    },
    UDLMaction() {
      let a = -this.reduceSpeed * this.direction;
      this.UDLMactionTimer = setInterval(() => {
        this.lastSpeed =
          (this.lastSpeed + a) * this.direction >= 0 ? this.lastSpeed + a : 0;
        this.xGap += this.lastSpeed * this.timeGap;
        if (!this.lastSpeed) {
          this.moreDynamic();
          return clearInterval(this.UDLMactionTimer);
        }
      }, this.timeGap);
    },
    moreDynamic() {
      let time = 10;
      let timer = setInterval(() => {
        this.xGap += this.direction * 3;
        if (--time <= 0) clearInterval(timer);
      }, 20);
    },
    responseContainerScale() {
      if (window.innerWidth < 650) {
        this.containerScale = window.innerWidth / 650;
        this.turnRotateProportion = 800;
      }
    },
    posimgs1(obj) {
      var da = obj.da,
        a0 = obj.a0;
      var circlename = obj.circlename;
      var w = obj.w;
      var centerx = obj.centerx,
        centery = obj.centery || w,
        r = w - 12;
      for (var i = 0; i < $("." + circlename).length; i++) {
        $("." + circlename)[i].style.left =
          centerx + r * Math.cos(((da * i + a0) / 180) * Math.PI) + "px";
        $("." + circlename)[i].style.top =
          centery + r * Math.sin(((da * i + a0) / 180) * Math.PI) + "px";
      }
    },
    start() {
      var that = this;
      const timer = window.setInterval(function () {
        var w = $(".jrwLeft").width() / 2;
        var obj = {
          classname: "jrwLeft",
          circlename: "city",
          da: 360 / that.cityList.length, //图片间隔角度
          a0: that.a0, //已旋转角度,
          w: w - 12,
          centerx: w - 12,
          centery: w - 12,
        };
        that.posimgs1(obj);
        that.a0++;
      }, 300);
      that.circleTimer = timer;
      that.$once("hook:beforeDestroy", () => {
        clearInterval(this.circleTimer);
      });
    },
    stop() {
      window.clearInterval(this.circleTimer);
    },
  },
  computed: {
    downloadAddress() {
      return this.$store.state.setting.downloadAddress;
    },
    rightnowVersion() {
      return this.$store.state.setting.changeVersion;
    },
    turnRotate() {
      return (
        (this.xGap * this.turnRotateProportion) /
        (2 * Math.PI * this.turntableR)
      );
    },
    backgroundNum() {
      return this.cityList.length < 10
        ? "backgrounds"
        : this.cityList.length == 10
        ? "backgroundsTwo"
        : this.cityList.length == 11
        ? "backgroundsThree"
        : "backgroundsFour"; //计算用哪个样式
    },
  },
};
</script>
<style lang="scss" scoped>
.background {
  width: 20vw;
  height: 20vw;
}

.backgrounds {
  width: 20vw;
  height: 20vw;
}

.backgroundsTwo {
  width: 18vw;
  height: 18vw;
}

.backgroundsThree {
  width: 16vw;
  height: 16vw;
}

.backgroundsFour {
  width: 14vw;
  height: 14vw;
}

.yellow {
  height: 20vw;
  width: 20vw;
  background-size: cover;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

.green {
  height: 20vw;
  width: 20vw;
  background-size: cover;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

.name_title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.jc {
}

.fixed {
  display: flex;
  font-size: 2vh;
  color: white;
  justify-content: space-around;
  align-items: center;
  margin: 5%;
}

.jieruwang {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .center {
    margin: 2% 12vw;
  }

  .jrwLeft {
    position: relative;
    border-radius: 50%;
    z-index: 2;
    cursor: pointer;

    background-size: cover;
    background-repeat: no-repeat;
    box-sizing: border-box;
    margin: 3.7vh -10vh;

    .city {
      position: absolute;
      color: #e4e4e4;
      font-size: 1.3vh;
      text-align: center;
      z-index: 0;
      display: flex;
      align-items: center;

      justify-content: center;
      background-size: cover;

      background-repeat: no-repeat;

      box-sizing: border-box;
      line-height: 7vw;
      margin: -5vw -6vw;
      width: 18vw;
      height: 18vw;
      border-radius: 50vw;
    }

    .city:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    .block {
      width: 82%;
      height: 82%;
      border-radius: 50%;
      background-color: #070a24;
      text-align: center;
    }

    .middle {
      width: 90%;
      height: 90%;
      border-radius: 50%;
      position: relative;
      background-color: #070e3a;

      p {
        position: absolute;
        top: 2%;
        left: 36%;
        font-size: 14px;
        color: #559ae7;
      }
    }

    .leftTitle {
      position: relative;
    }

    .leftTitle::after {
      position: absolute;
      content: "O/B/M域";
      text-align: center;
      left: 40%;
      top: 1%;
      font-size: 14px;
      color: #559ae7;
    }
  }
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate1 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

@-webkit-keyframes rotate1 {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes myfirst {
  0% {
    left: 0%;
  }

  25% {
    left: 25%;
  }

  50% {
    left: 50%;
  }

  75% {
    left: 75%;
  }

  100% {
    left: 100%;
  }
}

.pause {
  -webkit-animation-play-state: paused !important;
  animation-play-state: paused !important;

  p,
  img {
    -webkit-animation-play-state: paused !important;
    animation-play-state: paused !important;
    cursor: pointer;
  }
}

.pause::after {
  -webkit-animation-play-state: paused !important;
  animation-play-state: paused !important;
}

.active {
  font-weight: bold;
  text-decoration: underline;
  color: #ec725b !important;
}

.small {
  font-size: 10px;
}

.cen {
  position: absolute;
  //top: 50%;
  top: 70%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
}
</style>
