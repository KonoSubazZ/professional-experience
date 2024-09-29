<template>
  <div class="keyboard" :style="{ bottom: bottom + 'px', left: left + 'px' }">
    <!-- <div class="number-keyboard">
      <div
        class="number-item"
        v-for="(item, index) in numberList"
        :key="index"
        @click.stop="clickNumber(item)"
      >
        <div>{{ item }}</div>
      </div>
    </div> -->
    <div class="str-keyboard" v-if="pinyinStatus">
      <div class="pinyin"></div>
      <div class="pinyin-result"></div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            @click.stop="clickNumber(item)"
            v-for="(item, index) in strListOne"
            :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            @click.stop="clickNumber(item)"
            v-for="(item, index) in strListTwo"
            :key="index"
        >
          {{ item }}
        </div>
        <div class="str-item" @click.stop="clickNumber('pinyin')">符号</div>
      </div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            v-for="(item, index) in strListThree"
            @click.stop="clickNumber(item)"
            :key="index"
        >
          {{ item }}
        </div>
        <div class="str-item color-red" @click.stop="clickNumber('close')">
          清空
        </div>
        <div class="str-item" @click.stop="clickNumber('pinyin')">字母</div>
        <div class="str-item" @click.stop="clickNumber('pinyin')">数字</div>
      </div>
      <div class="str-line">
        <div class="close-item" style="border-top: none">关闭</div>
      </div>
    </div>

    <div class="str-keyboard" v-if="!pinyinStatus">
      <div class="str-line">
        <div
            class="str-item font-bold"
            @click.stop="clickNumber(item)"
            v-for="(item, index) in numberList"
            :key="index"
        >
          {{ item }}
        </div>
        <div class="str-item" @click.stop="clickNumber('del')">
          <img src="../../assets/image/del.png">
        </div>
      </div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            @click.stop="clickNumber(item)"
            v-for="(item, index) in strListOne"
            :key="index"
        >
          {{ item }}
        </div>
        <div class="str-item font-bold" @click.stop="clickNumber(':')">:</div>
      </div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            @click.stop="clickNumber(item)"
            v-for="(item, index) in strListTwo"
            :key="index"
        >
          {{ item }}
        </div>

        <div class="str-item font-bold" @click.stop="clickNumber('?')">?</div>
        <div class="str-item font-bold" @click.stop="clickNumber('=')">=</div>
      </div>
      <div class="str-line">
        <div
            class="str-item font-bold"
            v-for="(item, index) in strListThree"
            @click.stop="clickNumber(item)"
            :key="index"
        >
          {{ item }}
        </div>
        <div class="str-item font-bold" @click.stop="clickNumber('.')">.</div>
        <div class="str-item font-bold" @click.stop="clickNumber('/')">/</div>
        <div class="str-item font-bold" @click.stop="clickNumber(';')">
          ;
        </div>
        <div class="str-item" @click.stop="changeUp">
          <img v-if="!upStatus" src="../../assets/image/bigWrite.png" />
          <img v-else src="../../assets/image/smallWrite.png" />
        </div>

        <!-- <div class="str-item" @click.stop="clickNumber('pinyin')">拼音</div> -->
      </div>
      <div class="str-line">
        <div class="close-item">关闭</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["top", "left", "right", "bottom"],
  data() {
    return {
      numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      strListOne: "qwertyuiop",
      strListTwo: "asdfghjkl",
      strListThree: "zxcvbnm",
      result: "",

      upStatus: false, //是否大写
      pinyinStatus: false, //是否拼音
    };
  },
  methods: {
    /**
     * 切换大小写
     */
    changeUp() {
      if (this.upStatus) {
        this.upStatus = false;
        this.strListOne = this.strListOne.toLocaleLowerCase();
        this.strListTwo = this.strListTwo.toLocaleLowerCase();
        this.strListThree = this.strListThree.toLocaleLowerCase();
      } else if (!this.upStatus) {
        this.upStatus = true;
        this.strListOne = this.strListOne.toLocaleUpperCase();
        this.strListTwo = this.strListTwo.toLocaleUpperCase();
        this.strListThree = this.strListThree.toLocaleUpperCase();
      }
    },
    /**
     * @params data 点击的字符
     */
    clickNumber(data) {
      switch (data) {
        case "del":
          this.delResult();
          break;
        case "pinyin":
          this.openPinyin();
          break;
        default:
          this.setResult(data);
          break;
      }
    },
    /**
     * 打开拼音键盘
     */
    openPinyin() {
      this.pinyinStatus = !this.pinyinStatus;
    },
    /**
     * 设置结果字符串
     */
    setResult(str) {
      this.result = String(str);
      this.backResult();
    },
    /**
     * 删除单个字符
     */
    delResult() {
      this.result = "del";
      this.backResult();
    },
    /**
     * 清除结果
     */
    // clearResult() {
    //   this.result = "";
    //   this.backResult();
    // },
    /**
     * 返回内容
     */
    backResult() {
      this.$emit("result", this.result);
    },
  },
};
</script>

<style lang="less" scoped>
.keyboard {
  width: 97vw;
  padding: 0.2rem;
  background-color: #E9FFE8;
  box-shadow: 0 5px 10px 1px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  position: fixed;
  //transform: translateX(-50%);
  //top: 50px;
  bottom: 0;
  transition: all 0.3s ease-in-out;
  animation: showKeyBoard 0.15s ease-in-out;
  z-index: 99;
}
.font-bold {
  font-size: 0.36rem;
  font-weight: bold;
}
.color-red {
  color: red;
}
@keyframes showKeyBoard {
  0% {
    transform: translate(30px);
    opacity: 0;
  }
  50% {
    transform: translateX(0px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

.close-item {
  width: 100%;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  cursor: pointer;
  // border-top: 1px solid rgba(0, 0, 0, 0.15);
  &:active {
    background-color: rgba(0, 0, 0, 0.15);
  }
}
.str-keyboard {
  width: 100%;
  .str-line {
    display: flex;
    //border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    // &:nth-of-type(n + 4) {
    //   border-bottom: none;
    // }
    .str-item {
      font-size: 0.36rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 1.1rem;
      cursor: pointer;
      border-radius: 0.1rem;
      box-shadow: 0px 5px 5px rgba(14,89,170,0.2900);
      //border-right: 1px solid rgba(0, 0, 0, 0.15);
      img{
        width: 0.6rem;
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.15);
      }
      &:nth-of-type(11n) {
        border-right: none;
      }
    }
  }
}

.number-keyboard {
  display: flex;
  width: 242px;
  flex-wrap: wrap;
  background-color: white;
  box-shadow: 0 5px 10px 1px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  .number-item {
    width: 80px;
    height: 3.5rem;
    text-align: center;
    line-height: 3.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    &:active {
      background-color: rgba(0, 0, 0, 0.15);
    }
    &:nth-of-type(n + 10) {
      border-bottom: none;
    }
    &:nth-of-type(3n) {
      border-right: none;
    }
    // border: 1px solid black;
  }
}
</style>
