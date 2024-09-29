<template>
  <div class="pos">
    <el-dialog :visible.sync="dialogVisible" width="91%" class="dialog" :before-close="handleClose"
      customClass="customClass" :show-close="false" style="margin: 0 2%;">
      <img src="../../assets/closes.png" alt="" style="
        position: absolute;
        border: 24px solid white;
        borderRadius: 50%;
       right:-7%;
       bottom:49%;
        width: 11vw;
        height: 11vw;
      " @click="goback()" />
      <div class="process">
        <el-dialog width="55%" title="下载进度" :visible.sync="innerVisible" append-to-body custom-class="process">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="parseFloat(downloadState)"></el-progress>
        </el-dialog>
      </div>
      <keybord :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show"
        :close="() => keySet.show = false">
      </keybord>
      <div style="width: 94%;margin:0 auto;">
        <div class="formtable" style="  justify-content: space-between;">
          <p class="nameTitle">返回主页</p>
          <el-input v-model="time" placeholder="请输入内容" class="inpt_one" @blur="delName('time')" @focus="addName('time')"
            ref="time" id="time" type="number"></el-input>
        </div>
        <div class="formtable">
          <p class="nameTitle" style="margin:0">选择版本</p>
          <div class="flex">
            <el-radio-group v-model="chooseVersion">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" label="online">在线版</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" label="outline">离线版</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="formtable">
          <p class="nameTitle" style="margin:0">自动关机</p>
          <div class="flex">
            <el-radio-group v-model="closeWin">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" label="day">每天</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" label="week">每周</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" label="never">从不</el-radio>
            </el-radio-group>
            <el-time-picker v-model="closeTime" :disabled="btnclick" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点" popper-class="picker">
            </el-time-picker>
          </div>
        </div>
        <div class="formtable">
          <p class="nameTitle">流速设置</p>
          <div class="flex">
            <el-radio-group v-model="pull">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="10">快</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="5">中</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="1">慢</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="formtable">
          <p class="nameTitle">下落效果</p>
          <div class="flex">
            <el-radio-group v-model="radioeffect" fill="#27D257">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="false">平滑</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="true">呼吸</el-radio>
            </el-radio-group>
          </div>

        </div>
        <div class="formtable">
          <p class="nameTitle">按钮高度</p>
          <div class="flex">
            <el-radio-group v-model="buttonHeight">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="false">可移动</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="true">固定高度</el-radio>
            </el-radio-group>
          </div>

        </div>
        <div class="formtable ">
          <p class="nameTitle">阅读高度</p>
          <div class="flex change">
            <el-radio-group v-model="readHeight">
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="false">跟随资源</el-radio>
              <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="true">固定高度</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="formtable">
          <p class="nameTitle">下落列数</p>
          <div style="display:flex" class="flexs">
            <div style="display:flex;align-items: center;margin: 0 1vw;">
              <p style="margin:0 ;white-space:nowrap;">图书</p>
              <el-radio-group v-model="fallingNumber">
                <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="3">三列</el-radio>
                <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="4">四列</el-radio>
              </el-radio-group>
            </div>
            <div style="display:flex;align-items: center;margin: 0 1vw;">
              <p style="margin:0 ;white-space:nowrap;">视频</p>
              <el-radio-group v-model="fallingNumbers">
                <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="3">三列</el-radio>
                <el-radio :class="$bis == '0' ? 'custom-radioBlue' : 'custom-radioRed'" :label="2">二列</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="formtable">
          <p class="nameTitle">主题颜色</p>
          <div style="display:flex">
            <div v-for="(item, index) in colorList" :key="index" :style="{ backgroundColor: `${item}` }" class="color"
              @click="handColor(item)">
              <img src="../../assets/zhe.png" alt="" v-if="item == color" class="background">
            </div>
          </div>

        </div>
        <div class="formtable between">
          <p class="nameTitle">服务器地址</p>
          <el-input v-model="downloadAddress" placeholder="请输入内容" class="inpt_one" @blur="delName('downloadAddress')"
            @focus="addName('downloadAddress')" ref="downloadAddress" id="downloadAddress"></el-input>
        </div>
        <div class="formtable between">
          <p class="nameTitle">资源下载</p>
          <el-button type="primary" @click="download()" round :disabled="innerVisible">获取</el-button>
        </div>
        <div class="formtable between">
          <p class="nameTitle">储存路径</p>
          <p class="file-one" @click="selectFolder">{{ filepath }}</p>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from 'vuex';
import { getResource } from './model';
export default {
  data() {
    return {
      innerVisible: false,//下载提示
      inputTime: '',//返回时间
      pull: 1,//流速设置
      updateDatas: [],
      selectName: "",
      colorList: ["#E5E5E5", "#EBE4CE", "#D5E8DD", "#E6E1F2", "#2B2B2B"],
      btndis: false,
      downloadState: 0,
      btnclick: true,
      time: null,
      dialogVisible: true, //判断弹窗的显示
      timeChange: null,
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
    };
  },
  components: {
    keybord: () => import("./keyboard.vue"),
  },
  computed: {
    ...mapState(["setting", "user"]),
    filepath() {
      return this.$store.state.setting.filepath;
    },
    chooseVersion: {
      get() {
        return this.$store.state.setting.changeVersion
      },
      set(val) {
        location.reload()
        this.$store.dispatch("handlChangeVersion", val)
      }
    },
    radioeffect: {
      //下落效果
      get() {
        return this.$store.state.setting.radioeffect;
      },
      set(val) {
        this.$store.dispatch("handRadioeffect", val);
      },
    },
    fallingNumber: {
      //图书下落的列数
      get() {
        return this.$store.state.setting.row;
      },
      set(val) {
        this.$store.dispatch("handrow", val);
      },
    },
    color: {
      //当前选择的颜色
      get() {
        return this.$store.state.setting.color;
      }
    },

    fallingNumbers: {
      //视频下落的列数
      get() {
        return this.$store.state.setting.low;
      },
      set(val) {
        this.$store.dispatch("handlow", val);
      },
    },

    closeTime: {
      //计算机关闭时间
      get() {
        return this.$store.state.setting.closeTime;
      },
      set(val) {
        this.$store.dispatch("handCloseTime", val);
      },
    }, downloadAddress: {
      //资源下载地址
      get() {
        return this.$store.state.setting.downloadAddress;
      },
      set(val) {
        this.$store.dispatch("handDownloadAddress", val);
      },
    },
    closeWin: {
      //计算机关闭周期
      get() {
        return this.$store.state.setting.closeWin;
      },
      set(val) {
        this.$store.dispatch("handCloseWin", val);
      },
    },
    buttonHeight: {
      //按钮高度
      get() {
        return this.$store.state.setting.buttonHeight;
      },
      set(val) {
        this.$store.dispatch("handButtonHeight", val);
      },
    },
    readHeight: {
      //计算机关闭周期
      get() {
        return this.$store.state.setting.readHeight;
      },
      set(val) {
        this.$store.dispatch("handReadHeight", val);
      },
    },

  },
  watch: {
    closeWin(val) {
      if (val == "never") {
        this.btnclick = true
      } else {
        this.btnclick = false
      }
      this.$store.dispatch("handCloseWin", val);
    },
    closeTime(val) {
      this.$store.dispatch("handCloseTime", val);
    },
    pull(val) {
      this.$store.dispatch("handpull", val);
    },
    fallingNumber(val) {
      this.$store.dispatch("handrow", val);
    },
    fallingNumbers(val) {
      this.$store.dispatch("handlow", val);
    }
  },
  created() {
    // 根据设置看看当前是党建办还是通用版,然后确定按钮的样式
    this.$bis = localStorage.getItem('confirmVersion')
  },
  mounted() {
    this.time = this.$store.state.setting.time / 1000
    this.pull = this.$store.state.setting.pull
  },
  methods: {
    changeVersion(val) {
      console.log(this, val, '看看选择的是线上版本还是线下版本');
    },
    addName(name) {
      if (this.selectName && this.selectName != name) {
        this.selectName = "";
      }
      this.selectName = name;
      this.setKeybord(name);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.selectName = name;
      if (name == 'time') {
        this.$store.dispatch("handTime", this.time * 1000);
      }
    },
    setKeybord(name) {
      let item = this.$refs[name].$el.getBoundingClientRect();
      this.keySet.top = item.top + item.height + 10;
      this.keySet.right = item.right + 160;
      this.changeOpen(true);
    },
    changeOpen(status) {
      this.keySet.show = status;
      this.keySet = Object.assign({}, this.keySet);
    },
    getResult(data) {
      if (this.selectName == 'time') {
        var num = this.time
      } else {
        var num = this.downloadAddress
      }
      if (data && data != "del") {
        num =
          num + data;
      } else if (data == "del") {
        num = num
          .toString()
          .substring(0, num.length - 1);
      } else {
        num = "";
      }
      if (this.selectName == 'time') {
        this.time = num
      } else {
        this.downloadAddress = num
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    handColor(e) {
      this.$store.dispatch("handColor", e);
    },
    goback() {
      this.dialogVisible = false,
        this.$parent.disabl();
    },
    dialogVisibleShow() {
      this.dialogVisible = true
    },
    handleClose(done) {
      done();
    },
    /**
     * 主题内容就是在选择好了文件之后,将文件所在位置存储在这个vuex中,然后刷新页面,就会进入到首页的mounted中的逻辑
     */
    selectFolder() {
      console.log("这里执行了");
      ipcRenderer.send('select-folder') //执行使用electron打开选择文件的输入框,等选择完毕之后会调用下面的这个folder-selected,将选择好文件的这个绝对路径传送过来
      ipcRenderer.removeAllListeners('folder-selected') //移除已有的这个folder-selected事件,下面在重新定义这个事件
      ipcRenderer.on('folder-selected', (event, folderPath) => {//第一个参数是默认的,第二个参数是传送过来的绝对路径
        this.$store.dispatch("handlists", []); //将handlists置空
        if (folderPath != undefined) {
          this.$store.dispatch("handfilepath", folderPath);
          window.location.reload()
          return
        }
        // 这里可以根据需要进行进一步的处理
      })
    },
    download() {
      getResource({
        url: this.downloadAddress,
        filePath: this.$store.state.setting.filepath,
        callback: (percent) => {
          this.downloadState = percent.toFixed(2);
          if (percent == 100) {
            this.innerVisible = false
            this.$message.success("文件清单下载完成，开始下载文件资源")
            this.$nextTick(() => {
              this.downloadState = 0;
              this.innerVisible = true
              ipcRenderer.removeAllListeners('on-progress')
              ipcRenderer.on("on-progress", (event, percent) => {
                this.downloadState = percent.toFixed(2);
                if (percent == 100) {
                  this.innerVisible = false
                }
              })
              ipcRenderer.send('download-files', {
                url: this.downloadAddress,
                filePath: this.$store.state.setting.filepath,
                downloadlist: this.$store.state.setting.datalist
              })
            })
          }
        },
        showProgress: () => {
          this.innerVisible = true
        }
      })
    },
  },

};
</script>
<style scoped lang="scss">
.custom-radioBlue::v-deep {
  span {
    color: #409EFF !important;
  }

  .el-radio__input.is-checked {
    .el-radio__inner {
      // 增加嵌套选择器以提高优先级
      background-color: #409EFF !important;
      border: 1px solid #409EFF !important;

    }
  }
}

.custom-radioRed::v-deep {
  span {
    color: rgba(222, 47, 47, 1) !important;
  }

  .el-radio__input.is-checked {
    .el-radio__inner {
      // 增加嵌套选择器以提高优先级
      background-color: rgba(222, 47, 47, 1) !important;
      border: 1px solid rgba(222, 47, 47, 1) !important;
    }
  }
}

.process::v-deep {
  font-size: 200px
}

.background {
  width: 8vw;
  height: 6vw;
}

.change::v-deep {
  .el-radio-group {
    .el-radio {
      margin-right: 20%;
    }
  }
}

.inpt_one::v-deep {
  width: 20vw;
  border: 1px solid white;

  .el-input__inner {
    width: 46vw;
    margin-left: -33vw;
    height: 2.5vh;
    font-size: 4vw;
    padding: 1% 26%;
    border-radius: 22.4px;
    background: rgba(246, 246, 246, 1);
    color: rgba(222, 47, 47, 1) !important;
    border: 3.2px solid rgba(190, 190, 190, 1);
  }

  .el-input__inner::placeholder {
    color: rgba(222, 47, 47, 1) !important;
  }
}

.flex::v-deep {
  align-items: center;
  font-size: 3vw;
  display: flex;

  .el-date-editor {
    margin: 0 0.5vw;


    .el-input__inner {
      height: 2.5vh;
      font-size: 3.3vw;
      padding: 1% 9%;
      width: 18vw;
      margin: 0 2%;
      border-radius: 22.4px;
      background: rgba(246, 246, 246, 1);
      border: 3.2px solid rgba(190, 190, 190, 1);
    }
  }

  .el-input__prefix {
    display: none;
  }

  .el-radio-group {

    display: flex;

    .el-radio {
      display: flex;
      white-space: nowrap;
      width: 14vw;

      .el-radio__label {
        font-size: 3.3vw;

      }

      .el-radio__input {


        .el-radio__inner {
          width: 3vw;
          height: 3vw;
        }
      }
    }
  }
}

.flexs::v-deep {
  align-items: center;
  font-size: 3vw;

  .el-date-editor {
    .el-input__inner {
      width: 21vw;
      margin-left: 6vw;
      height: 2.5vh;
      font-size: 4vw;
      padding: 1% 26%;
      border-radius: 22.4px;
      background: rgba(246, 246, 246, 1);
      color: rgba(222, 47, 47, 1) !important;
      border: 3.2px solid rgba(190, 190, 190, 1);
    }
  }

  .el-radio-group {
    display: flex;

    .el-radio {
      margin: 0 17px;
      display: flex;
      white-space: nowrap;

      .el-radio__label {
        font-size: 3.1vw;
      }

      .el-radio__input {


        .el-radio__inner {
          width: 3vw;
          height: 3vw;

        }
      }
    }
  }
}

.color {
  width: 13vw;
  height: 6vw;
  margin: 2% 4%;
}

.pos::v-deep {
  margin: 0;


  .customClass {
    // height: 30vh;  

    .between {
      justify-content: space-between;

      .el-button {
        font-size: 4vw;
        padding: 1vw 2vw;
        margin-left: 20px;
      }

      .file-one {
        font-size: 4vw;
        padding: 1vw 3vw;
      }
    }

    .formtable {
      display: flex;
      padding: 3.1vw 1vw;
      height: 2.2vh;
      align-items: center;
      border-bottom: 1px solid gray;

      .nameTitle {
        font-size: 3vw;
        font-weight: bold;
        white-space: nowrap;
        padding-right: 1vw;
      }
    }
  }

  .title {
    font-size: 3vw;
  }

  .el-dialog__wrapper {
    .el-dialog {
      position: fixed;
      // bottom: 22vh; 临时改动
      bottom: 10vh;
      border-radius: 75px;
    }
  }
}

// 修改单选框颜色</style>
