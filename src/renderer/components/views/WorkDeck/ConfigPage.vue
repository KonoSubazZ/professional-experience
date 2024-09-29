<template>
  <div>
    <div v-if="!offline" class="box">
      <div class="logo">
        <img src="@/assets/logo.png" alt=""/>
      </div>
      <div class="input-box">
        <div v-if="applicationType && applicationType =='work_deck'" style="display: flex;align-items: center;margin-top: 1rem">
          <div class="form-label font-28" style="margin-right: 1rem">读写板类型:</div>
          <div class="form-value">
            <el-select v-model="rfidType"  class="form-input" style="padding: 0 !important; border-radius: 6px !important">
              <el-option label="高频" value="hf"></el-option>
              <el-option label="超高频" value="uhf"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="applicationType && applicationType =='work_deck'" style="display: flex;align-items: center;margin-top: 1rem">
          <div class="form-label font-28" style="margin-right: 1rem">读写板型号:</div>
          <div class="form-value">
            <el-select v-model="highBoard" class="form-input" placeholder="请选择"
              v-if="rfidType == 'hf'"
              style="padding: 0 !important; border-radius: 6px !important;display: flex !important;">
              <el-option label="M201" value="M201"></el-option>
              <el-option label="RL8000" value="RL8000"></el-option>
            </el-select>
            <el-select v-model="superBoard" class="form-input" placeholder="请选择" v-else
              style="padding: 0 !important; border-radius: 6px !important;display: flex !important;">
              <el-option label="M60" value="M60"></el-option>
              <el-option label="UM200" value="UM200"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="applicationType && applicationType =='work_deck'" style="display: flex;align-items: center;margin-top: 1rem">
          <div class="form-label font-28" style="margin-right: 1rem">&nbsp;&nbsp;&nbsp;连接方式:</div>
          <div class="form-value">
            <el-select v-model="readBlockType" class="form-input" placeholder="请选择"
              style="padding: 0 !important; border-radius: 6px !important;display: flex !important;">
              <el-option label="USB" value="USB"></el-option>
              <el-option label="串口" value="串口"></el-option>
            </el-select>
          </div>
        </div>
        <div >
          <div style="display: flex;align-items: center;margin-top: 1rem">
            <div class="form-label font-28" style="margin-right: 1rem">配置地址:</div>
            <input
                    class="input"
                    id="input"
                    style="background: white;border-radius: 6px"
                    type="text"
                    :disabled="status"
                    v-model="url"
                    autofocus
                    @focus="error = ''"
                    :placeholder="`请输入配置地址`"
            />

          </div>

        </div>
      </div>
      <div class="error-info">
        <div>{{ error }}</div>
      </div>
      <button class="button" @click="openUrl" v-loading="status" style="margin-top: 1rem;width: 20rem">保存</button>
      <button class="button" @click="netoffline" style="margin-top: 1rem;width: 20rem">无网络使用</button>
    </div>
    <Offline v-if="offline" :rfidType="rfidType" />
  </div>
</template>

<script>
import {ipcRenderer} from "electron";
import Offline from './Offline'
export default {
  components:{Offline},
  data() {
    return {
      applicationType: '',
      url: "",
      rfidType: "hf",
      error: "错误了",
      status: false,
      oldUrl: "",
      selectOptions: 0,
      blue: "",
      offline:false,
      highBoard:'M201',
      superBoard:'M60',
      readBlockType:'USB'
    };
  },
  created() {
    document.title = "蓝鲸";
    this.applicationType = process.env.application
  },
  methods: {
    /**
     * 设置input输入框焦点
     */
    inputFocus() {
      let input = document.getElementById("input");
      input.focus();
    },
    /**
     * 打开地址所在
     */
    openUrl() {
      var strRegex = "http";
      /** 简单检查url */
      console.log(
          this.url,
          this.url.indexOf(strRegex) < 0 ||
          this.url.indexOf("?platformId") < 0
      );
      if (
          this.url.indexOf(strRegex) < 0 ||
          this.url.indexOf("?platformId") < 0
      ) {
        console.log("错误");
        this.openError();
        return;
      }
      if (!this.rfidType) {
        this.openError("请选择标签类型")
        return;
      }
      let path = this.url.split("?");
      let platformId = path[1].split("=")[1];
      console.log(path);
      this.status = true;
      this.$axios
          .get(path[0] + "/other/checkHardware")
          .then((res) => {
            console.log(res.data)
            if (res.data === "longpeng") {
              /** 检测通过，该地址有效 */
              this.$axios.get(path[0] + "/other/blueWhaleBrowserAll",
                      {
                        url: path[0],
                        platformId: platformId
                      })
                  .then((res) => {
                    this.status = false;
                    let data = res.data;
                    console.log(res);
                    ipcRenderer.sendSync("updateSetting", {
                      url: data,
                      rfidType: this.rfidType,
                      settingUrl: this.url,
                      readBlockType: this.readBlockType,
                      boards : this.rfidType=='hf' ? this.highBoard:this.superBoard,
                      boardsType : this.rfidType=='hf' ? 'rfid':'uhfRFID'
                    });
                  });
            } else {
              this.openError();
              this.status = false;
            }
          })
          .catch((err) => {
            this.openError();
          });
    },
    /**
     * 输入错误
     */
    openError(error) {
      this.url = "";
      this.error = error || "地址输入错误，请输入正确的地址";
      this.status = false;
    },
    netoffline(){
      this.offline = true
      ipcRenderer.sendSync("updateSetting", {
                      url: {},
                      rfidType: this.rfidType,
                      boards:this.rfidType=='hf' ? this.highBoard:this.superBoard,
                      readBlockType: this.readBlockType,
                      boardsType:this.rfidType=='hf' ? 'rfid':'uhfRFID',
                      settingUrl: "",
                    });
    }
  },
};
</script>

<style>
html,
body {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
  "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  background-color: #f4f3f4;
  font-size: 14px;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo {
  width: 30%;
  height: auto;
  object-fit: contain;
}

.logo img {
  width: 100%;
}

.input-box {
  margin: 0 auto;
}

.error-info {
  font-size: 14px;
  font-weight: bold;
  color: red;
  /* left: 14%; */
  top: calc(100% + 1rem);
}

.caption {
  color: rgba(11, 126, 153, 1);
}

.input-father {
  width: 50%;
}

.input {
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  font-size: 1.1rem;
  /* border-radius: 5px; */
  outline: none;
  width: 100%;
  border: 1px solid rgba(11, 126, 153, 1);
  border-right: 0px;
  background-color: white;
  /* width: 50%; */
}

.button {
  height: 3rem;
  font-size: 1.1rem;
  border: 1px solid rgba(11, 126, 153, 0.15);
  /* border-radius: 5px; */
  color: white;
  background-color: rgba(11, 126, 153, 1);
  min-width: 100px;
  padding: 0 1.5rem;
  box-sizing: border-box;
  /* margin-left: 0.5rem;
margin-right: 0.5rem; */
}

.button:focus {
  outline: none;
}

.button:active {
  background-color: rgba(11, 126, 153, 0.75);
}

.input-type {
  display: flex;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
}

.input-type .input-item {
  width: 6rem;
  height: 2.8rem;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.15) transparent transparent rgba(0, 0, 0, 0.15);
  color: #999;
  text-align: center;
  line-height: 2.8rem;
  font-size: 14px;
  cursor: pointer;
}

.input-type .active {
  border-color: rgba(11, 126, 153, 0.75) rgba(11, 126, 153, 1) transparent rgba(11, 126, 153, 0.75);
  background-color: white;
  color: rgba(11, 126, 153, 1);
}

.input-type .active + .input-item {
  border-color: rgba(0, 0, 0, 0.15) transparent transparent transparent;
}
</style>
