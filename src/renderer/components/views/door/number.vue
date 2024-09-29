<template>
  <div class="door-number">
    <div class="door-header">
      <div @click="goSetting">
        {{ type == "number" ? "进出数据" : "警报数据" }}
      </div>
      <div v-if="!useSip2" class="btns" @click="changeInfo">
        <img class="table" src="@/assets/images/light/door.png" alt="" />
        <div>{{ type == "number" ? "警报数据" : "进出数据" }}</div>
      </div>
    </div>
    <div class="door-body" v-if="type == 'number'">
      <div class="number-box">
        <!-- <div class="number-total">累计进:{{ totalIn }}</div> -->
        <div class="in-number number-detail">{{ inNumber }}</div>
        <div class="number-title">当天进馆</div>
      </div>
      <div class="number-box">
        <!-- <div class="number-total">累计出:{{ totalOut }}</div> -->
        <div class="out-number number-detail">{{ outNumber }}</div>
        <div class="number-title">当天出馆</div>
      </div>
    </div>
    <div class="door-body" v-if="type == 'table'">
      <div class="table-body">
        <el-table :data="tableList" style="width: 100%" height="100%">
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
              {{ scope.row.createTime | dateTime }}
            </template>
          </el-table-column>
        </el-table>
        <div class="navigation">
          <el-pagination
            @current-change="changeIndex"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            layout="prev, pager, next,total"
            :total="alarmList.length"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <copyright :color="'black'"></copyright>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import {addData, patronInformation} from "./fetch";
export default {
  components: {
    copyright: () => import("@/components/common/copyright.vue"),
  },
  data() {
    return {
      type: "number",
      inNumber: 0 /** 进入 */,
      outNumber: 0 /** 离开 */,
      alarmList: [] /** 警报列表 */,
      pageSize: 20,
      currentPage: 1,
      totalIn:0,
      totalOut:0,
      totalIpIN:{},
      totalIpOut:{},
      tagList:[],
      realTag:{},
      tagUID:'',
      reader:{
        direction:null,
        time:0,
        doorTime:0,
        tag:null,
      }
    };
  },
  computed: {
    tableList() {
      return this.alarmList.filter((it, ix) => {
        return (
          (this.currentPage - 1) * this.pageSize <= ix &&
          this.currentPage * this.pageSize > ix
        );
      });
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    doorSetting() {
      return this.$store.state.Setting.doorSetting;
    },
    useSip2:() => !!JSON.parse(localStorage.getItem("useSip2")),
  },
  watch: {
    inNumber(val) {
      !this.useSip2 &&this.addDoorNumber("In");
    },
    outNumber(val) {
      !this.useSip2 && this.addDoorNumber("Out");
    },
    reader:{
      handler: function (data) {
        if(!this.useSip2) return
        let newVal = JSON.parse(JSON.stringify(data))
        if(newVal.direction && newVal.doorTime && newVal.tag){
          //返回人流量数据
          if(Math.abs(newVal.doorTime-newVal.time)<100){
            this.readSuccess(newVal.direction,newVal.tag.split(",")[0])
          }else {
            this.reader = {direction:null, time:0, doorTime:0, tag:null,}
          }
        }
      },
      deep: true
    }
  },
  created() {
    if (!this.doorSetting || !this.doorSetting.ip) {
      this.$router.replace("/doorSetting");
      return;
    }
    ipcRenderer.on("onDoorTag", (event, tag) => {
      this.reader.doorTime = tag.time
      this.reader.tag = tag.tag
      //ipcRenderer.sendSync('readGateData',tag.tag)
      !this.useSip2 && this.addDoorRecord(tag.tag);
    });
    ipcRenderer.on("onDoorNumber", (event, tag) => {
      const ip = tag.id;
      this.reader.time = tag.time
      this.reader.direction = tag.direction === "In" ? 1 : 2
      switch (tag.direction) {
        case "Out":
          this.totalIpOut[ip] = Number(tag.count)
          this.outNumber = Object.values(this.totalIpOut).reduce((a,b)=>a+b,0);
          break;
        case "In":
          this.totalIpIN[ip] = Number(tag.count)
          this.inNumber = Object.values(this.totalIpIN).reduce((a,b)=>a+b,0);
      }
      // this.execCallBack()
    });
      // this.execCallBack()
    ipcRenderer.on('onRealGateTag', (event,data) => {
      if(!data.result) return;
    this.realTag[data.UID] = data.result ? data.result.split(',') : []
    })
  },
  methods: {
    execCallBack() {
      const {Out,In} = ipcRenderer.sendSync("onHumanFlow")
      this.totalIn = In || 0
      this.totalOut = Out || 0
    },
    changeIndex(e) {
      this.currentPage = e;
    },
    /**
     * 切换数据
     */
    changeInfo() {
      this.type = this.type == "number" ? "table" : "number";
    },
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
          this.alarmList.unshift({
            ...res.data,
          });
          this.alarmList = JSON.parse(JSON.stringify(this.alarmList));
        });
    },
    readSuccess(direction,data){
      if(!data) return
      patronInformation(data).then(res => {
          this.reader = {direction:null, time:0, doorTime:0, tag:null,}
          if(res.validPatron){
            addData(direction,res.personalName,data)
          }
        })
    }
  },
};
</script>

<style>
.door-number {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.door-header {
  background-color: #1da1f2;
  height: 120px;
  display: flex;
  align-items: center;
  padding: 0 10%;
  box-sizing: border-box;
  justify-content: space-between;
  color: white;
  font-size: 32px;
}
.door-body {
  flex: 1;

  background-image: url("~@/assets/images/light/back_bottom.png");
  background-size: 100%;
  background-position: bottom left;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 4rem;
  box-sizing: border-box;
}
.table-body {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}
.door-header .btns {
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
.door-header .table {
  width: 30px;
  height: 30px;
  display: inline-block;
}
.number-box {
  width: 520px;
  height: 300px;
  background: #ffffff;
  box-shadow: 0px 3px 20px rgba(29, 161, 242, 0.15);
  opacity: 1;
  border-radius: 20px;
  margin: 0 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.number-box .number-total {
  font-size: 24px;
}
.number-box .number-title {
  font-size: 40px;
  font-family: "黑体";
  font-weight: bold;
  line-height: 56px;
  color: #666666;
  opacity: 1;
}
.number-box .number-detail {
  font-size: 70px;
  font-family: "黑体";
  font-weight: bold;
  line-height: 98px;
  opacity: 1;
}
.number-box .in-number {
  color: #02c8db;
}
.number-box .out-number {
  color: #fc9733;
}
.el-table {
  background-color: transparent;
  border: 1px solid #1da1f2;
}
.el-table__header thead tr th {
  background-color: rgba(240, 248, 253, 0.5);
}
.navigation {
  text-align: center;
  margin-top: 1rem;
}

.el-table__body-wrapper::-webkit-scrollbar {
  /*滚动条整体样式*/

  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/

  height: 1px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/

  border-radius: 10px;

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

  background: rgba(29, 161, 242, 0.785);
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  /*滚动条里面轨道*/

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

  border-radius: 10px;

  background: #ededed;
}
</style>
