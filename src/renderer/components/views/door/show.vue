<template>
  <div class="door-show">
    <div class="door-title">高频安全门</div>
    <div class="door-box">
      <div class="box-left">
        <div class="header">
          <div>进出数据</div>
        </div>
        <div class="body">
          <div class="in">
            <div class="number">{{ inNumber }}</div>
            <div class="name">进入</div>
          </div>
          <div class="out">
            <div class="number">{{ outNumber }}</div>
            <div class="name">出去</div>
          </div>
        </div>
      </div>
      <div class="box-right">
        <div class="header">
          <div>警报数据</div>
          <div><el-button @click="goSetting">配置</el-button></div>
        </div>
        <div class="body">
          <el-table :data="alarmList" style="width: 100%" height="100%">
            <el-table-column
              prop="positiveTitle"
              label="图书名"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="barCode"
              align="center"
              label="条码号"
            ></el-table-column>
            <el-table-column
              prop="collectionPlaceName"
              label="馆藏地址"
              align="center"
            ></el-table-column>
            <el-table-column prop="createTime" align="center" label="警报时间">
              <template slot-scope="scope">
                {{ scope.row.creaetTime | dateTime }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      inNumber: 0 /** 进入 */,
      outNumber: 0 /** 离开 */,
      alarmList: [] /** 警报列表 */,
    };
  },
  watch: {
    inNumber(val) {
      this.addDoorNumber("In");
    },
    outNumber(val) {
      this.addDoorNumber("Out");
    },
  },
  created() {
    if (!this.doorSetting || !this.doorSetting.ip) {
      this.$router.replace("/doorSetting");
      return;
    }
    ipcRenderer.on("onDoorTag", (event, tag) => {
      console.log(tag, "tag");
      this.addDoorRecord(tag.tag);
    });
    ipcRenderer.on("onDoorNumber", (event, tag) => {
        console.log(tag)
      switch (tag.direction) {
        case "Out":
          this.outNumber = tag.count;
          break;
        case "In":
          this.inNumber = tag.count;
      }
    });
  },
  computed: {
    uuid() {
      return this.$store.state.Setting.uuid;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    doorSetting() {
      return this.$store.state.Setting.doorSetting;
    },
  },
  methods: {
    /**
     * 去设置
     */
    goSetting() {
      this.$router.push("/doorSetting");
    },
    /**
     * 添加安全门出入记录
     */
    addDoorNumber(data) {
      this.$axios.post("/hardware/interface/safetyDoorPeopleRecord", {
        platformId: this.platform.id,
        uuid: this.uuid,
        gate: data == "Out" ? "EXPORT" : "ENTRANCE",
      });
    },
    /** 添加警报记录 */
    addDoorRecord(data) {
      this.$axios
        .post("/hardware/interface/safetyDoorRecord", {
          platformId: this.platform.id,
          rfId: data,
          uuid: this.uuid,
        })
        .then((res) => {
          this.alarmList.push({
            ...res.data,
          });
          this.alarmList = JSON.parse(JSON.stringify(this.alarmList));
        });
    },
  },
};
</script>

<style lang="less" scoped>
.door-show {
  background-color: #f0f2f5;
  width: 100%;
  height: 100vh;
  padding: 3rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .door-title {
    font-size: 30px;
    color: black;
    text-align: center;
    margin-bottom: 3rem;
  }
  .door-box {
    display: flex;
    flex: 1;
  }
  .box-left,
  .box-right {
    box-shadow: 0 6px 20px 5px rgba(40, 120, 255, 0.1),
      0 16px 24px 2px rgba(0, 0, 0, 0.05);
  }
  .box-right {
    width: 60%;
    margin-left: 5%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header {
      background-color: rgb(40, 120, 255);
      //   line-height: 80px;
      height: 80px;
      font-size: 20px;
      color: white;
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      align-items: center;
      box-sizing: border-box;
    }
    .body {
      background-color: white;
      flex: 1;
      // display: flex;
      // flex-direction: column;
      padding: 1rem;
      box-sizing: border-box;
      overflow-y: scroll;
    }
  }
  .box-left {
    width: 35%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header {
      background-color: rgb(40, 120, 255);
      line-height: 80px;
      height: 80px;
      font-size: 20px;
      color: white;
      text-align: center;
    }
    .body {
      background-color: white;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      .name {
        font-size: 18px;
        font-weight: bold;
        margin-top: 1rem;
      }
      .number {
        font-size: 92px;
        letter-spacing: 6px;
      }
      .in {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .number {
          color: rgba(103, 194, 58, 1);
          text-shadow: 0 8px 9px rgba(103, 194, 58, 0.75),
            0px -2px 1px rgba(0, 0, 0, 0.5);
          font-weight: bold;
        }
      }
      .out {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .number {
          color: rgba(245, 108, 108, 1);
          text-shadow: 0 8px 9px rgba(245, 108, 108, 0.75),
            0px -2px 1px rgba(0, 0, 0, 0.5);
          font-weight: bold;
        }
      }
    }
  }
}
</style>