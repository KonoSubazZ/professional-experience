<template>
  <div class="marquee-wrapper" :style="{ width: realWidth + 'vw' }">
    <div
      class="marquee-container"
      :style="{ height: realHeight + 'vh' }"
      :class="className"
    >
      <ul
        ref="marqueeCon"
        :id="tooltipId"
        class="marquee-content"
        :class="{ anim: animate === true }"
        @mouseenter="handleStop()"
        @mouseleave="handleUp()"
      >
        <li
          v-for="(item, index) in Array1"
          :key="`${tooltipId}-${item.id}-${index}`"
          class="marquee-item"
          @click="handleClick(item.id)"
        >
          <slot name="itemCon" :item="item"></slot>
        </li>
      </ul>
      <ul
        ref="marqueeCona"
        :id="tooltipId"
     
        class="marquee-content"
        :class="{ anim: animate === true }"
        @mouseenter="handleStop()"
        @mouseleave="handleUp()"
      >
        <li
          v-for="(item, index) in Array2"
          :key="`${tooltipId}-${item.id}-${index}`"
          class="marquee-items"
          @click="handleClick(item.id)"
        >
          <slot name="itemCon" :item="item"></slot>
        </li>
      </ul>
      <ul
        ref="marqueeConb"
        :id="tooltipId"
        class="marquee-content"
        :class="{ anim: animate === true }"
        @mouseenter="handleStop()"
        @mouseleave="handleUp()"
      >
        <li
          v-for="(item, index) in Array3"
          :key="`${tooltipId}-${item.id}-${index}`"
          class="marquee-item"
          @click="handleClick(item.id)"
        >
          <slot name="itemCon" :item="item"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { generateId, parseToNum } from "./parseToNum.js";
export default {
  name: "so-marquee",
  props: {
    /*
     * 可接受传参
     * data          列表数据
     * className     自定义类名
     * width         列表宽度，默认值：400
     * height        列表高度,默认值：200
     * showNumber    可视的条目数，默认值：5
     * speed         轮播速度，默认值：1000
     * */
    //列表数据
    data: {
      type: Array,
      default: () => [],
    },
    //自定义类名
    className: String,
    //列表宽度，默认值：400
    width: {
      type: [Number, String],
      default: 100,
    },
    //列表高度,默认值：200
    height: {
      type: [Number, String],
      default: 30,
    },
    //可视的条目数，默认值：5
    showNumber: {
      type: [Number, String],
      default: 5,
    },
    //轮播速度，默认值：1000
    speed: {
      type: [Number, String],
      default: 5000,
    },
  },
  data() {
    return {
      intnum: undefined,
      animate: false,
      Array1: [],
      Array2: [],
      Array3: [],
    };
  },
  computed: {
    tooltipId() {
      return `marquee-con-${generateId()}`;
    },
    realWidth() {
      return parseToNum(this.width);
    },
    realHeight() {
      return parseToNum(this.height);
    },
    realShowNumber() {
      return parseToNum(this.showNumber);
    },
    realSpeed() {
      console.log(parseToNum(this.speed) < 1000 ? 1000 : parseToNum(this.speed))
      return parseToNum(this.speed) < 1000 ? 1000 : parseToNum(this.speed);
    },
    itemHeigth() {
      return this.realHeight / this.realShowNumber;
    },
    realData() {
      console.log(this.$store.state.typesOf);
      return JSON.parse(JSON.stringify(this.data)).filter(
        (it) => it.typename == this.$store.state.typesOf
      );
    },
  },
  mounted() {
    console.log(this.realData.length, this.realShowNumber);
    setTimeout(() => {
      if (this.realData.length > this.realShowNumber) {
        for (var i = 0; i < this.realData.length; i++) {
          var element = this.realData[i];
          // this.scrollUp();
          // 将元素插入到适当的数组中
          if (i % 3 === 0) {
            this.Array1.push(element);
          } else if (i % 2 === 0) {
            this.Array2.push(element);
          } else {
            this.Array3.push(element);
          }
        }
        console.log(this.Array1, this.Array2, this.Array3);
        if (this.Array1.length != 0) {
          this.scrollUp(this.Array1, 1);
        }
        if (this.Array2.length != 0) {
          this.scrollUp(this.Array2, 2);
        }
        if (this.Array3.length != 0) {
          this.scrollUp(this.Array3, 3);
        }
      }
    }, 2000);
  },
  methods: {
    scrollUp(e, num) {
      console.log(num)
      // eslint-disable-next-line no-unused-vars
      this.intnum = setInterval((_) => {
        this.animate = true;
        setTimeout(() => {

          e.push(e[0]); // 将数组的第一个元素添加到数组的
          e.shift(); //删除数组的第一个元素
          this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, this.realSpeed / 2);
        this.$once("hook:beforeDestroy", () => {
          this.cleanup();
        });
      }, this.realSpeed);
    },
    handleStop() {
      this.cleanup();
    },
    handleUp() {
      setTimeout(() => {
        if (this.Array1.length != 0) {
          this.scrollUp(this.Array1, 1);
        }
        if (this.Array2.length != 0) {
          this.scrollUp(this.Array2, 2);
        }
        if (this.Array3.length != 0) {
          this.scrollUp(this.Array3, 3);
        }
      }, 1000);
    },
    handleClick(row) {
      this.$emit("handleClick", row);
    },
    cleanup() {
      if (this.intnum) {
        clearInterval(this.intnum);
        this.intnum = null;
      }
    },
  },
  beforeDestroy() {
    this.cleanup();
  },
  deactivated() {
    this.cleanup();
  },
  watch: {
    animate(flag) {
      this.marqueeCon = this.$refs.marqueeCon;
      this.marqueeCona = this.$refs.marqueeCona;
      this.marqueeConb = this.$refs.marqueeConb;
      if (flag) {
        this.marqueeCon.style.marginTop = `-13vh`;
        this.marqueeCona.style.marginTop = `-13vh`;
        this.marqueeConb.style.marginTop = `-13vh`;
      } else {
        this.marqueeCon.style.marginTop = 0;
        this.marqueeCona.style.marginTop = 0;
        this.marqueeConb.style.marginTop = 0;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.marquee-container {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}

.marquee-content {
  position: relative;
}

.anim {
  transition: all 5s;
}

.marquee-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 30vw;
  height: 10vh;
}
.marquee-items {
  margin-top: 2vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 30vw;
  height: 10vh;
}
</style>
