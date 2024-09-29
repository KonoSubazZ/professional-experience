<template>
  <div
    class="box"
    v-loading="loading"
    element-loading-text="激活中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    @click="cancelLoading"
  >
    <div class="center">
      <div class="box_top" v-if="firstShowUnit">
        <ul>
          <li class="title">
            设备指纹:<span class="sn" style="margin-left: 5px">{{
              firstMd5Key
            }}</span
            ><el-link
              id="copyButton"
              @click="copy()"
              style="margin-left: 10px"
              type="primary"
              >复制</el-link
            >
          </li>
          <!-- <li>CPU:{{ secretKey.cpuSerialNumber }}</li>
                <li>SN码:{{ secretKey.serialNumber }}</li> -->
        </ul>
      </div>
      <div class="box_center">
        <div class="box_center_top">
          <p style="width: 25%">单位名称:</p>
          <el-input
            id="unit"
            style="border: 1px solid #c0c4cc; background-color: #fff"
            v-model="unitName"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <!-- <div class="box_center_top" v-else>
                    <p style="width: 15%;">校验码:</p><el-input style="border: 1px solid #C0C4CC;background-color: #fff;"
                        v-model="key" placeholder="请输入内容"></el-input>
                </div> -->
        <div class="box_center_footer">
          <el-button type="primary" @click="save">在线激活</el-button>
          <el-button type="primary" @click="out">关 闭</el-button>
          <el-button @click="dialogVisible = true" type="primary"
            >离线激活</el-button
          >
        </div>
      </div>
      <el-dialog title="离线激活" :visible.sync="dialogVisible" width="60%">
        <div style="display: flex">
          <div style="width: 25%; align-self: center">激活码:</div>
          <el-input
            v-model="outlineKey"
            placeholder="请输入离线激活码"
            style="margin-left: 0px"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="outlineActivation">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const { ipcRenderer, remote, clipboard } = require("electron");
import axios from "axios";
import md5 from "md5";
export default {
  data() {
    return {
      property: "value",
      timer: "",
      outlineKey: "",
      key: "",
      unitName: "",
      firstMd5Key: "",
      firstShowUnit: true,
      dialogVisible: false,
      loading: false,
    };
  },
  created() {
    const secretKey = JSON.parse(localStorage.getItem("deviceInfo"));
    if (!secretKey) {
      return this.$message.error("获取硬件信息失败,请联系管理员!");
    }
    const { macAddresses, cpuSerialNumber, serialNumber } = secretKey;
    const sn = macAddresses + cpuSerialNumber + serialNumber.trim();
    this.firstMd5Key = md5(sn).toUpperCase();
    // localStorage.setItem("SECRETKEY", 'CA22553552CA9C3F');
    localStorage.setItem("SECRETKEY", this.firstMd5Key.slice(0, 16));
    localStorage.setItem("confirmVersion", 0);

    this.$router.push("/");
  },
  methods: {
    cancelLoading() {
      if (this.loading == false) return;
      this.$confirm("取消激活, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = false;
          this.timer && clearTimeout(this.timer);
          this.$message({
            type: "success",
            message: "取消激活成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    },
    // 在线激活
    async save() {
      console.log("/ 在线激活");
      if (!this.unitName) return this.$message.error("请输入单位名称");

      // let password =  md5(this.firstMd5Key.slice(0, 16)).toUpperCase().slice(0, 16);
      const terminalNumber = this.firstMd5Key.slice(0, 16);
      const params = {
        platformName: this.unitName,
        terminalNumber,
      };
      console.log(this.$store);

      const address = this.$store.state.setting.downloadAddress;
      const res = await axios.post(
        `${address}/terminalHome/ConfigurationTerminal`,
        params
      );
      if (res.data.code != 0) {
        return this.$message.error(res.data.message);
      }
      const response = await axios.post(
        `${address}/terminalHome/getEquipmentControl`,
        { terminalNumber }
      );
      if (response.data.code !== 0) {
        console.log(response.data.data);
        return this.$message.error(res.data.message);
      }
      // 是否激活成功
      //   let timer;
      console.log(response.data.data.status, "response.data.data.status");
      if (response.data.data.status == 0) {
        // this.$message.error("设备已停用,请联系管理员!");
        this.loading = true;
        console.log();
        this.timer = setTimeout(() => {
          console.log("auto");
          this.save();
        }, 60 * 1000);
        console.log(!this.timer, "this.timer");
        return;
      }
      this.timer && clearTimeout(this.timer);
      this.loading = false;
      this.$message.success("激活成功!");
      // miyao
      localStorage.setItem("SECRETKEY", this.firstMd5Key.slice(0, 16));

      this.$router.push({ name: "homesetting" });
      //     axios.post('http://192.168.13.7:8122/terminalHome/ConfigurationTerminal',params).then(res=>{
      //         if(res.data.code!=0){
      //             this.$message.error(res.data.message)
      //             return
      //         }
      //         axios.post('http://192.168.13.7:8122/terminalHome/getEquipmentControl',{terminalNumber:password})
      //         .then(res=>{
      //             if(res.data.code!=0){

      //             }
      //             this.firstShowUnit=false
      //         },err=>{})
      //     },err=>{})

      //     if (!this.key) return this.$message.error('请输入校验码')
      //     let md5sn = md5(this.md5sn.toUpperCase().slice(0, 16)).toUpperCase().slice(0, 16);
      //     // let mds = md5(md5sn).toUpperCase().slice(0, 16);  //第二次md5加密
      //     // let result = mds;

      //     localStorage.setItem('miyao',this.md5sn)
      //     // for (let i = 0; i < mds.length; i++) {
      //     //     if (i % 4 === 0 && i !== 0) {
      //     //         result += '-' + mds[i];
      //     //     }else {
      //     //         result += mds[i];
      //     //     }
      //     // }
      //     // console.log(result,'result');
      //     console.log(md5sn,'md5sn');
      //     if (md5sn == this.key) {

      //         window.localStorage.setItem('keyPas',this.key)
      //         this.$router.push('/homesetting')
      //     } else {
      //         this.$message.error('校验码不正确')
      //     }
      // }
    },
    outlineActivation() {
      this.timer && clearTimeout(this.timer);
      if (!this.outlineKey) return this.$message.error("请输入激活码");
      const a = this.firstMd5Key.slice(0, 16);
      const b = md5(a).toUpperCase().slice(0, 16);
      let c = md5(b).toUpperCase().slice(0, 16);
      let result = "";
      for (let i = 0; i < c.length; i += 4) {
        result += c.substr(i, 4) + "-";
      }
      // 去除最后多余的一个横线
      const OUTLINEKEY = result.slice(0, -1);
      console.log(OUTLINEKEY, "OUTLINEKEY");
      if (OUTLINEKEY !== this.outlineKey) {
        return this.$message.error("激活码输入有误");
      }
      this.outlineKey = "";
      localStorage.setItem("SECRETKEY", this.firstMd5Key.slice(0, 16));

      this.$router.push({ name: "homesetting" });
    },
    out() {
      remote.app.quit();
    },
    // 复制
    copy() {
      const copyText = document.querySelector(".sn").innerText;
      // 将文本复制到剪贴板
      clipboard.writeText(copyText);
      // 在控制台打印消息以确认复制操作是否成功
      console.log("复制成功");
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: rgba(41, 84, 240, 1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  .center {
    width: 60%;
    height: 5vh;
  }

  .box_top {
    margin-bottom: 30px;

    .title {
      display: flex;
      align-items: center;
    }

    ul {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;

      li {
        list-style: none;
      }
    }
  }

  .box_center {
    display: flex;
    flex-direction: column;

    .box_center_top {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .box_center_footer {
      flex: 1;
      display: flex;
      justify-content: center;
      margin-top: 10%;
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
