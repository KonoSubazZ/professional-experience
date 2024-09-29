<template>
  <div class="settingBox">
    <p class="title" style="position: relative;">
      配置信息
      <el-button @click='outExe' type="primary" style="position: absolute; right: 5%;">关闭程序</el-button>
    <div>
    </div>
    </p>
    <div class="flex">
      <div class="form-label">服务器地址</div>
      <div class="form-value">
        <div class="form-input">
          <input ref="http" id="http" class="inputs" v-model="inputInfo.http" data-mode @click.stop type="text"
            placeholder="请输入服务器地址（例http://127.0.0.1:3000）" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">书柜IP</div>
      <div class="form-value">
        <div class="form-input">
          <input ref="ip" id="ip" class="inputs" v-model="inputInfo.ip" data-mode @click.stop type="text"
            placeholder="请输入书柜IP（例127.0.0.1）" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">读写板IP</div>
      <div class="form-value">
        <div class="form-input">
          <input ref="rfidIP" id="rfidIP" class="inputs" v-model="inputInfo.rfidIP" data-mode @click.stop type="text"
            placeholder="请输入读写板IP（例127.0.0.1）" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">平台ID</div>
      <div class="form-value">
        <div class="form-input">
          <input ref="platformId" id="platformId" class="inputs" v-model="inputInfo.platformId" data-mode @click.stop
            type="text" placeholder="请输入平台ID" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">读写版类型</div>
      <div class="form-value">
        <div class="form-input">
          <el-select @change="typeSelectChage" v-model="typeL" placeholder="请选择">
            <el-option v-for="item in types" :key="item.type" :label="item.value" :value="item.type">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">读写版型号</div>
      <div class="form-value">
        <div class="form-input">
          <!-- 高频 -->
          <el-select v-if="typeL == 'hf'" v-model="model" placeholder="请选择">
            <el-option v-for="item in HFmodels" :key="item.type" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
          <!-- 超高频 -->
          <el-select v-else v-model="model" placeholder="请选择">
            <el-option v-for="item in UHFmodels" :key="item.type" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">连接方式</div>
      <div class="form-value">
        <div class="form-input">
          <el-select v-model="connectType" placeholder="请选择">
            <el-option v-for="item in connectTypeList" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">标签类型</div>
      <div class="form-value">
        <div class="form-input">
          <el-select v-model="labelType" placeholder="请选择">
            <el-option v-for="item in labelTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>  
    </div>
    <div class="flex">
      <div class="form-label">待机页时间</div>
      <div class="form-value">
        <div class="form-input">
          <input ref="standbyTime" id="standbyTime" class="inputs" v-model="inputInfo.standbyTime" data-mode @click.stop
            type="text" placeholder="单位分钟" />
        </div>
      </div>
    </div>
    <div style="display: flex;margin-top: 30px;margin-left: -385px;align-items: center; justify-content: center;">
      <div class="form-label">开启消毒灯</div>
      <div class="form-value">
        <div class="form-input">
          <el-switch v-model="openLamp" class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">开启时间段</div>
      <div class="form-value">
        <div class="form-input" style="margin-top: 5px;">
          <el-time-picker @change="gaibian" format="HH:mm" :disabled="!openLamp" class="inputs" v-model="lampTime"
            is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
          <p style="font-size: 12px;" v-show="startTime !== 'undefined' && startTime !== ''">上次设置时间为:{{ startTime + '-' +
            endTime }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="form-label">再次启用时间</div>
      <div class="form-value">
        <div class="form-input">
          <input :disabled="!openLamp" ref="reactivation" id="reactivation" class="inputs"
            v-model.trim="inputInfo.reactivation" data-mode @click.stop type="text" placeholder="单位分钟" />
        </div>
      </div>
    </div>
    <div class="flex">
      <el-button type="primary" :loading="saveLoading" @click="submit">保存并返回
      </el-button>
      <el-button @click="goHome">返回首页</el-button>
    </div>

    <Key-Board @change="keyChange" :blurHide="false" :color="'#06f'" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, computed } from "vue";
import hardware from "@api/hardwareDeviceApi";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const child_process = require("child_process");
import { otherInterface } from "@api/request";
const init = hardware.init();
const { ipcRenderer } = require("electron");
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const inputInfo = ref({
  ip: "",
  platformId: "",
  http: "",
  rfidIP: "",
  uuid: "",
  standbyTime: localStorage.getItem("standbyTime") || "", //待机时间
  // 消毒灯的再次启用时间
  reactivation: "",
});

console.log(inputInfo.value, "---inputInfo");
const keyChange = () => {
  inputInfo.value.ip = document.getElementById("ip").value;
  inputInfo.value.platformId = document.getElementById("platformId").value;
  inputInfo.value.rfidIP = document.getElementById("rfidIP").value;
  inputInfo.value.http = document.getElementById("http").value;
  inputInfo.value.standbyTime = document.getElementById("standbyTime").value;
  inputInfo.value.reactivation = document.getElementById("reactivation").value;
};
const gaibian = () => {
  clearInterval();
};
// ------------消毒灯
// 是否开启消毒灯
const openLamp = ref(JSON.parse(localStorage.getItem("openLamp")) || false);
const lampTime = ref([]); //消毒灯的开启时间和结束时间
const startTime = ref(
  localStorage.getItem("startTime") ? localStorage.getItem("startTime") : ""
);
console.log(startTime.value, "----startTime");
const endTime = ref(
  localStorage.getItem("endTime") ? localStorage.getItem("endTime") : ""
);
// ------------------------
// 20231222新增超高频配置
// 新增区分超高频和高频的
const typeL = ref("");
const model = ref(""); //读写版型号
const connectType = ref(""); //连接方式
const labelType = Number(localStorage.getItem("labelType")) || ref(1); //标签类型
const labelTypeList = ref([
  { label: "通用", value: 1 },
  { label: "U9", value: 2 },
]); //标签类型下拉框
// 类型
const types = ref([
  { type: "hf", value: "高频" },
  { type: "uhf", value: "超高频" },
]);
// 高频型号
const HFmodels = ref([
  {
    name: "RD5200",
    type: "bookcaserfid", //dll实例
  },
]);
// 超高频型号
const UHFmodels = ref([
  {
    name: "UM200",
    type: "uhfRFID", //dll实例
  },
]);
// 连接方式
const connectTypeList = ref([
  {
    type: "COM",
    name: "串口",
  },
  {
    type: "NET",
    name: "网络",
  },
]);
// 类型选择
const typeSelectChage = (e) => {
  inputInfo.value.type = e;
  if (e == "hf") {
    model.value = "RD5200";
  } else {
    model.value = "UM200";
  }
};
// -----------------------
const saveLoading = ref(false);

const platInfo = store.getters.platform;

const submit = () => {
  console.log(document.getElementById("reactivation").value, "----value");

  // if 校验逻辑
  if (openLamp.value) {
    //如果开启了消毒灯
    if (!inputInfo.value.reactivation) {
      return ElMessage.error("请输入消毒灯的再次开启时间/(分钟)");
    }
    if (/[^0-9]/g.test(inputInfo.value.reactivation)) {
      return ElMessage.error("开启时间必须时数字");
    }
    if (lampTime.value.length == 0) {
      return ElMessage.error("请选择消毒灯的开启时间段");
    }
  } else {
    //关闭了消毒灯
    delete inputInfo.value.reactivation;
    lampTime.value = [];
  }
  if (!inputInfo.value.http) {
    return ElMessage.error("请输入服务器地址");
  }
  if (!inputInfo.value.ip) {
    return ElMessage.error("请输入书柜IP");
  }
  if (!inputInfo.value.platformId) {
    return ElMessage.error("请输入平台ID");
  }
  if (!typeL.value) {
    return ElMessage.error("请选择读写版类型");
  }
  if (!model.value) {
    return ElMessage.error("请选择读写版型号");
  }
  if (!connectType.value) {
    return ElMessage.error("请选择连接方式");
  }
  if (/[^0-9]/g.test(inputInfo.value.standbyTime)) {
    return ElMessage.error("待机时间必须时数字");
  }

  // 消毒灯起止时间格式化
  let lampTimeList = [];
  lampTimeList = lampTime.value.map((it) => {
    const formatter = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: false, // 24 小时制
    });
    return formatter.format(it);
  });
  saveLoading.value = true;
  otherInterface
    .caseLogin(inputInfo.value, inputInfo.value.http)
    .then((res) => {
      console.log(res,"----res----",new Date());
      if (res.code == 0) { 
        console.log(res.code, "res.code");
        console.log(res.data, "res.data");
        inputInfo.value.typeL = typeL.value;
        inputInfo.value.model =
          typeL.value == "hf"
            ? HFmodels.value.map((it) => {
                if (it.name == model.value) return it;
              })[0]
            : UHFmodels.value.map((it) => {
                if (it.name == model.value) return it;
              })[0];
        inputInfo.value.connectType = connectType.value;
        inputInfo.value.labelType = labelType.value;
        store.dispatch("setPlatform", { ...res.data, info: inputInfo.value });
        localStorage.setItem("http", inputInfo.value.http);
        localStorage.setItem("latticeNumber", res.data.latticeNumber);
        localStorage.setItem("platformId", inputInfo.value.platformId);
        localStorage.setItem("reactivation", inputInfo.value.reactivation); //消毒等再次开启时间
        localStorage.setItem("openLamp", openLamp.value); //是否开启消毒灯
        localStorage.setItem("lampTime", lampTime.value); //消毒灯开启时间段
        localStorage.setItem("startTime", lampTimeList[0]); //消毒等再次开启时间
        localStorage.setItem("endTime", lampTimeList[1]); //消毒等再次开启时间
        localStorage.setItem("standbyTime", inputInfo.value.standbyTime); //待机时间
        localStorage.setItem("labelType", inputInfo.value.labelType); //标签类型
        // ---------20231222新增配置信息
        localStorage.setItem(
          "settingData",
          JSON.stringify({
            type: typeL.value,
            model: model.value,
            connectType: connectType.value,
          })
        ); //读写版类型
        // -------
      
        ipcRenderer.sendSync("updateSetting", JSON.stringify(inputInfo.value));
        // ipcRenderer.sendSync("updateConfig"); //更新获取json文件数据
        getBookCaseInfo();
        setTimeout(() => {
          saveLoading.value = false;
          ElMessage.success("配置成功");
          router.push("/");
        }, 1500);
      } else {
        ElMessage.error("配置失败");
        saveLoading.value = false;
      }
    })
    .catch((err) => {
      ElMessage.error("配置失败");
      saveLoading.value = false;
    });
};
const getBookCaseInfo = () => {
  let params = {
    uuid: inputInfo.value.uuid,
    platformId: inputInfo.value.platformId,
  };
  otherInterface.getBookCaseInfo(params).then((res) => {
    if (res.code == 0) {
      res.data.id = 10;
      store.dispatch("setCabinetInfo", res.data);
    }
  });
};

const reset = () => {
  inputInfo.value.http = "";
  inputInfo.value.ip = "";
  inputInfo.value.platformId = "";
  inputInfo.value.rfidIP = "";
};

const goHome = () => {
  router.push("/");
};

//获取UUID
const getUuid = () => {
  let tsk = child_process.exec("wmic diskdrive get serialNumber");
  console.log(tsk,'tsk');
  tsk.stdout.on("data", (data) => {
    if (data) {
      console.log(data,'---------data------------');
      let uuid = "";
      let number = data.trim().split("SerialNumber")[1].split("\n")[1];
      if (data.indexOf("_") !== -1) {
        uuid = data
          .trim()
          .split("SerialNumber")[1]
          .split("\n")[2]
          .split("_")
          .join("-")
          .slice(0, 19);
      } else if (number.length > 28) {
        let string16 = Number(number).toString(16).slice(0, 16);
        for (let i = 0; i < string16.length; i++) {
          if (i % 4 == 0 && i != 0) {
            uuid += "-" + string16[i];
          } else {
            uuid += string16[i];
          }
        }
      } else {
        let string16 = number.slice(-16).padEnd(16, "0");
        for (let i = 0; i < string16.length; i++) {
          if (i % 4 == 0 && i != 0) {
            uuid += "-" + string16[i];
          } else {
            uuid += string16[i];
          }
        }
      }
      inputInfo.value.uuid = uuid;
      store.dispatch("setUUID", uuid);
      console.log("%c " + "uuid：" + uuid, "color: red");
    } else {
      ElMessage.error("获取uuid标识失败");
    }
  });
};

// 退出程序
let dialogTableVisible = ref(false);
const outExe = () => {
  ipcRenderer.send("outExe", true);
};
onMounted(() => {
  
  if (store.getters.platform && JSON.stringify(platInfo) != "{}") {
    inputInfo.value = platInfo.info;
    inputInfo.value.uuid = store.getters.getUUID;
    typeL.value = store.getters.platform.info.typeL;
    model.value = store.getters.platform.info.model.name;
    connectType.value = store.getters.platform.info.connectType;
    console.log("%c " + "uuid：" + store.getters.getUUID, "color: blue");
  } else {
    getUuid();
  }
});
</script>
<style lang="less" scoped>
:deep(.el-select .el-input__wrapper) {
  width: 400px !important;
  height: 40px !important;
}

:deep(.key-board) {
  width: 100% !important;
  height: 350px !important;
  top: auto !important;
  bottom: 0 !important;
  transform: translate(-50%, 0%) !important;
}

:deep(.key-board-result) {
  width: 100% !important;
  height: 100px !important;
}

:deep(.key-board-result .key-board-code-show) {
  height: 37px !important;
  font-size: 24px !important;
  line-height: 37px !important;
  color: black !important;
}

:deep(.key-board-button svg) {
  width: 30px !important;
  height: 20px !important;
}

:deep(
    .key-board-result .key-board-result-show .key-board-result-show-more span
  ) {
  border: 10px solid !important;
  border-color: transparent !important;
  border-top-color: rgb(0, 102, 255) !important;
}

:deep(.key-board-button) {
  font-size: 21px !important;
  width: 46px !important;
  height: 46px !important;
  border-radius: 10px !important;
  color: black !important;
}

:deep(.default-key-board .line.line4 .key-board-button + .key-board-button) {
  font-size: 5px !important;
  // width: 46px !important;
  // height: 46px !important;
  // border-radius: 10px !important;
  // color: black !important;
}

:deep(.key-board-button label) {
  font-size: 25px !important;
  // width: 46px !important;
  // height: 46px !important;
  // border-radius: 10px !important;
  // color: black !important;
}

:deep(
    .key-board-result
      .key-board-result-show
      .key-board-result-show-container
      span
  ) {
  font-size: 21px !important;
}

.settingBox {
  height: 100vh;
  background: linear-gradient(
    135.48deg,
    rgba(249, 154, 132, 1) 0%,
    rgba(245, 235, 202, 1) 100%
  );
}

.title {
  padding-top: 30px;
  font-size: 30px;
  text-align: center;
  text-shadow: 1px 0px 1px #333;
  letter-spacing: 5px;
  font-weight: 500;
  font-family: "Microsoft YaHei";
}

.inputs {
  padding-left: 15px;
  height: 40px;
  width: 400px;
  font-size: 27px;
  outline: none;
  border: 1px solid #eee;
  border-radius: 5px;
}

.form-label {
  text-align: right;
  width: 150px;
  margin-right: 15px;
  font-size: 25px;
}

.flex {
  margin-top: 30px;
  justify-content: center;
  display: flex;
  align-items: center;
}

:deep(.el-message) {
  top: 10% !important;
}

/deep/ .el-input__inner {
  font-size: 16px !important;
}
</style>