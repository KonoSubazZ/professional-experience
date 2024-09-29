<template>
  <div class="readCard">
    <div v-if="handc" class="change">
      <el-dialog :title="title" :visible.sync="dialogAddgsVisible" @close="closeDialogAddgsVisible"
        style="width:100%;height:90vh;" :showClose="false" :close-on-click-modal="false" class="func">
        <div slot="title" class="dialog-title">
          <span class="title-text" style="text-align:center;font-size:20px;font-weight:bold">   注册规则</span>
          <div class="button-right">
            <span class="title-close"></span>
          </div>
        </div>
        <div style="width:90%;margin:0 auto;line-height:26px;height:55vh;overflow-x: hidden;
                                                      overflow-y: scroll;">
          <p>
                    一、读者凭第二代身份证可在本设备免押金注册，申办读者IC卡，身份证及读者证均可作为为读者证使用，可在本图书馆及分馆通借通还。<br>
                    二、读者可通过身份证/读者证在本馆服务台及各种移动设备进行读者信息登录，实现本图书馆及分馆之间的通借通还。。<br>
                    三、读者使用身份证和读者卡在享受以下服务内容：。<br>
                    （一）外借服务。<br>
                    1、每次可外借中文图书8本、中文期刊4本、外文图书2本；。<br>
                    2、外借借期30天（可网上/自助设备续借3次/15天），超期滞纳金为0.1元/本 天。。<br>
                    （二）图书检索平台。<br>
                    免费使用“数字图书馆”全部功能。。<br>
                    四、挂失。<br>
                    注册后，读者身份证/读者证若遗失，请至注册馆进行读者信息挂失登记，挂失后读者证及身份证无法完成借还，证件找回后可在注册馆取消挂失登记。。<br>
                    原持证读者退证及重新注册说明。<br>
                    一、请原缴纳押金的持证读者（含通过24小时自助办证借还一体机缴纳押金办证读者，部分读者持有单独的读者证)凭身份证、借书卡、押金凭条(24小时自助办证借还一体机读者无需凭条)到图书馆总服务台办理押金退还，重新用身份证进行读者注册。。<br>
                    二、若出现“借书证”“押金条”遗失或其中之一遗失时(24小时自助办证借还一体机办证读者无需凭条，直接用身份证注册的读者无需读者证)，先凭身份证办理挂失手续。挂失一个月后，可退还押金。。<br>
                    三、所有退证均需要携带身份证复印件。。<br>

                    社保卡服务温馨提示：。<br>
                    一、关于读者证。<br>
                    开放公共图书馆读者证是指本馆下发的读者卡。。<br>
                    二、证件等效。<br>
                    已身份证注册的读者可以使用读者证借阅文献，到公共图书馆使用过读者卡的读者也可使用身份证借阅文献，不需再注册。。<br>
                    三、关于微信服务号绑定。<br>
                    读者如要使用图书馆的微信公众号在线服务，请在第一次使用读者证的图书馆微信公众号上绑定身份信息。。<br>
                    四、关于自助借还。<br>
                    读者证支持在图书馆各种自助借还设备上使用。。<br>

                    图书检索平台使用说明。<br>
                    一、用身份证（免押金）注册读者请通过<a>https://cluster.bwlib.cn/opacClient/index.html#/search?id=26387</a>。<br>
            使用图书馆图书检索功能，用户名是读者证号，密码为注册时读者自定义的密码，也可以使用注册时上传的手机号进行登录。。<br>
                    二、读者若在注册时未自定义密码，则密码默认为123123。。<br>
                    三、读者在图书检索平台可以查看馆内藏书，图书在馆情况，个人的借阅情况。。<br>
           
                    24小时自助办证借还一体机。<br>
                    启动身份证注册读者工作后，图书馆铺设的24小时自助办证借还一体机不再办理押金读者，全面启用免费身份证注册，读者权益同到馆注册读者，享受相同服务。原在图书馆缴纳押金办证读者（部分读者直接使用身份证）请留意上述“原持证读者退证及重新注册说明”。。<br>
               
            注意。<br>
            一、本馆采集的身份证信息仅用作读者再图书馆体系内的唯一身份标志，馆内遵循GB/Z 28828 等标准要求，妥善保护读者的个人信息、借阅信息以及读者的其他隐私信息；。<br>
            二、读者注册信息应准确并及时更新，确保信息的真实性、有效性和一致性；。<br>
            三、读者上送的手机号仅用作办理读者证时的验证码获取及读者信息登录的验证途径；。<br>
          </p>
          <el-checkbox v-model="checked">同意</el-checkbox>
          <br>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handchangeone">取 消</el-button>
          <el-button type="primary" :disabled="checked == false" @click="handchange()">确定</el-button>
        </div>
      </el-dialog>

    </div>
    <div v-else>
      <div v-if="status == 'start'">
        <img :src="require('@/assets/images/' + skin + '/read_idCard.png')" class="margin-center" :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
              ? 'w-status-dark'
              : 'w-status-light'
        " alt />
        <div class="mt-20 color-blue font-18 text-center">
          请将身份证放置指定位置
        </div>
      </div>
      <div class="book-error" v-if="status == 'fail'">
        <img class="margin-center" :class="
          skin == 'child'
            ? 'w-status-img'
            : skin == 'dark'
              ? 'w-status-dark'
              : 'w-status-light'
        " :src="
  require('@/assets/images/' +
    skin +
    '/' +
    (skin == 'child'
      ? 'read_error.png'
      : skin == 'dark'
        ? 'auth_error.png'
        : 'read_idCard_error.png'))
" alt />
        <div class="flex-row flex-center">
          <img class="w-24" src="@/assets/images/child/error_icon.png" alt />
          <div class="color-red font-18">{{ caption }}</div>
        </div>
        <div class="flex-row flex-center mt-40">
          <button class="form-blue-btn font-24 mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
            @click="recertify">
            放弃办卡
          </button>
          <button class="form-yellow-btn font-24" :style="{ borderRadius: skin != 'child' ? '5px' : '' }" @click="start">
            重新读取
          </button>
        </div>
      </div>
      <div class="book-success" v-if="status == 'success'">
        <div class="info-box font-24">
          <div class="info-line">
            <span class="info-title">读者姓名</span>
            <span class="info-value">{{ user.name }}</span>
          </div>
          <div class="info-line">
            <span class="info-title">读者性别</span>
            <span class="info-value">{{ user.sex }}</span>
          </div>
          <div class="info-line">
            <span class="info-title">出生年月</span>
            <span class="info-value">{{ user.birth | birth }}</span>
          </div>
          <div class="info-line">
            <span class="info-title">家庭住址</span>
            <span class="info-value">{{ user.address }}</span>
          </div>
          <div class="info-line">
            <span class="info-title">身份证号</span>
            <span class="info-value">{{ user.number }}</span>
          </div>
        </div>
        <div class="flex-row flex-center mt-40">
          <button class="form-blue-btn font-24 mr-10" :style="{ borderRadius: skin != 'child' ? '5px' : '' }"
            @click="confirmInfo">
            确认
          </button>
          <button class="form-yellow-btn font-24" :style="{ borderRadius: skin != 'child' ? '5px' : '' }" @click="start">
            重新采集身份信息
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import test from "@/api/hardWare_renderer.js";

export default {
  data() {
    return {
      checked: false,
      dialogAddgsVisible: true,
      handc: true,
      status: "start",
      testReader: "",
      readStatus: false,
    };
  },
  filters: {
    birth(val) {
      return (
        val.substring(0, 4) +
        "年" +
        val.substring(4, 6) +
        "月" +
        val.substring(6) +
        "日"
      );
    },
  },
  created() {
    this.handc = true
  },
  mounted() {
    // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //   showConfirmButton:false,
    //   showClose:false,
    //   closeOnClickModal: false,
    //       // confirmButtonText: '确定',
    //       cancelButtonText: '关闭',
    //       type: 'error'
    //     }).catch(() => {
    //       // this.$message({
    //       //   type: 'info',
    //       //   message: '已取消删除'
    //       // });          
    //     });
    // this.$axios
    //   .post("/hardware/interface/reader", {
    //     address: "1212",
    //     birthDay:
    //       " 1998-01-01",
    //     uuid: this.$store.state.Setting.uuid,
    //     certificateNumber: "131022200203074256",
    //     idNumber: "131022200203074256",
    //     rfId: "8EB075AC",
    //     gender: "MALE",
    //     name: "1234",
    //     password: "123",
    //     photoBase64:"MTIzNDU2",
    //     phone: 18942669478,
    //     readerUnitName:"蓝鲸知图",
    //     readerTypeId: 25914,//35
    //     readerTypeName: "普通读者",
    //     platformId:26387
    //   }).then(res => {
    //     console.log(res, 'sfasfdfdsaasf')
    //   })


    console.log(this.$route.query.index == undefined, 'asdklfbaskdlbfklajsbdf')
    if (this.$route.query.index == undefined) {
      console.log("12")
      this.handc = true
    } else {
      this.handc = this.$route.query.index
      this.handchange()
    }


    // this.start()
  },
  computed: {
    // handbus() {
    //   this.handc =  this.$store.state.Setting.handbus
    //   console.log()
    //   return this.$store.state.Setting.handbus
    // },
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    user() {
      return this.$store.state.User.idNumberInfo;
    },
    caption() {
      return this.$store.state.Borrow.caption;
    },
  },
  watch: {
    // handbus(val) {
    //   console.log('1111111',val)
    //   if (val) {
    //     this.handc =  this.$store.state.Setting.handbus
    //     console.log(this.handc)
    //   }
    // },
    backStatus(val) {
      if (!val) {
        this.readFail();
      }
    },
  },
  destroyed() {
    // console.log("12")
    this.handc = true
    console.log(this.handc, 'asdfgbaklsjdbf')
    clearTimeout(this.interval);
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
    if (this.readStatus) {
      this.readStatus = !this.testReader.stopReadIdCard();
    }
  },
  methods: {
    handchangeone() {

      this.dialogAddgsVisible = false
      this.$router.replace("/")

    },
    handchange() {
      this.handc = false
      this.$store.dispatch("modhandbus", this.handc)
      console.log(this.handc, '1111111111111111111')
      this.dialogAddgsVisible = false,

        this.testReader = test.init();
      this.$store.dispatch("add_to_log", "读取身份证");
      if (this.$func.getNextIndex(this.list) == 0) {
        this.$store.dispatch(
          "modifyProgreeList",
          this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
        );
      } else {
        this.$store.dispatch(
          "modifyProgreeList",
          this.$func.setPrevFalse(JSON.parse(JSON.stringify(this.list)))
        );
      }
      this.start();
    },
    /**
     * @description:放弃办卡
     */
    recertify() {
      this.$store.dispatch("add_to_log", "放弃办卡");
      this.$router.replace("/");
    },
    /**
     * @description:读取读者卡信息
     */
    start() {
      this.$store.dispatch("modifyCaption", "请将身份证放置指定位置");
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "idCard");
      });
      this.$store.dispatch("modifyBack", true);
      this.status = "start";
      if (this.readStatus) {
        return;
      }
      this.readStatus = this.testReader.readIdCard((data) => {
        this.$store.dispatch("modifyIdNumber", data);
        this.readStatus = false;
        this.testReader.stopReadIdCard();
        this.readSuccess();
      });
      // setTimeout(() => {
      //   this.$store.dispatch("modifyIdNumber", {
      //     address: "固安县",
      //     birth: "1999-5-19",
      //     number: "131022156502134221",
      //     sex: "MALE",
      //     name: "张三",
      //     photo: "/image",
      //   });
      //   this.readSuccess();
      // }, 1000);
    },
    /**
     * @description:读取失败
     */
    readFail() {
      if (this.status == "start") {
        this.$store.dispatch("add_to_log", "读取身份证失败");
        this.$store.dispatch("modifyCaption", "身份信息读取失败");
        this.$store.dispatch("modifyBack", false);
        this.status = "fail";
      } else if (this.status == "success") {
        this.$store.dispatch("add_to_log", "未确认身份信息");
        this.$store.dispatch("modifyCaption", "未确认身份信息,请重新读取");
        this.$store.dispatch("modifyBack", false);
        this.status = "fail";
      }
    },
    /**
     * @description:读取成功
     */
    readSuccess() {
      this.$store.dispatch("add_to_log", "读取身份证信息成功");
      this.status = "success";
      this.$nextTick(() => {
        this.$store.commit("set_label_name", "peopleInfo");
      });
      this.$store.dispatch("modifyCaption", "请确认身份信息");
    },
    /**
     * @description:确定身份信息
     */
    confirmInfo() {
      this.$router.push({
        path: this.$func.getNextPath(this.list),
        // path: '/getCard/success',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.func::v-deep {
  .el-dialog {
    width: 70% !important;
  }
}

.change::v-deep {
  .el-dialog__wrapper {
    overflow-y: hidden !important;
  }
}

.readCard {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  margin: 0 auto;

}

.info-box {
  border: 1px solid rgba(29, 161, 242, 0.23);
  border-radius: 6px;
  background-color: rgba(29, 161, 242, 0.1);
  width: 80%;
  margin: 0 auto;
  padding: 2% 8%;
  box-sizing: border-box;

  .info-line {
    margin: 2% auto;
  }

  .info-title {
    margin-right: 20px;
  }

  .popWindow {
    background-color: #9D9D9D;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    filter: alpha(opacity=50);
    opacity: 0.5;
    z-index: 1;
    position: absolute;

  }

  .maskLayer {
    background-color: #000;
    width: 200px;
    height: 30px;
    line-height: 30px;
    left: 50%;
    top: 50%;
    color: #fff;
    z-index: 2;
    position: absolute;
    text-align: center;
  }
}
</style>