<template>
  <div class="confirm" v-loading="loading">
    <div class="flex-row">
      <div class="form-label code-name font-28 mr-20 font-bold" style=" white-space:nowrap;">
        请选择读者类型
      </div>
      <div class="form-input code-input" :class="className.indexOf('type') != -1 ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''">
        <el-select class="font-28 selectType" @blur.stop="delName('type')" disabled @focus.stop="addName('type')"
          placeholder="请选择" v-model="type">
          <el-option v-for="(item, index) in cardType" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="flex-row mt-20" v-if="!this.manageSetting.selfServiceCardMachineIsIdCard">
      <div class="form-label code-name font-28 mr-20 font-bold">请输入姓名</div>
      <div class="form-input code-input" :class="className.indexOf('userName') != -1 ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''">
        <input class="font-28 mr-10" id="userName" ref="userName" @blur.stop="delName('userName')"
          @focus.stop="addName('userName')" @click.stop="" v-model="userName" type="text" placeholder="请输入姓名" />
        <!-- <img
          :src="
            show.phone
              ? require('@/assets/images/child/eyeOpen.png')
              : require('@/assets/images/child/eyeClose.png')
          "
          class="w-24 pointer"
          alt
          @click="changeShow('phone')"
        /> -->
      </div>
    </div>
    <div class="flex-row mt-20">
      <div class="form-label code-name font-28 mr-20 font-bold">
        请输入手机号
      </div>
      <div class="form-input code-input" :class="className.indexOf('phone') != -1 ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''">
        <input class="font-28 mr-10" id="phone" ref="phone" @blur.stop="delName('phone')" @focus.stop="addName('phone')"
          @click.stop="" v-model="phone" type="text" placeholder="请输入" />
        <!-- <img
          :src="
            show.phone
              ? require('@/assets/images/child/eyeOpen.png')
              : require('@/assets/images/child/eyeClose.png')
          "
          class="w-24 pointer"
          alt
          @click="changeShow('phone')"
        /> -->
      </div>
    </div>
    <!-- 短信验证码 -->
    <!-- <div class="flex-row mt-20">
      <div class="form-label code-name font-28 mr-20 font-bold">
        请输入短信验证码
      </div> -->
    <!-- @blur.stop="delName('phone')" @focus.stop="addName('phone')"
          @click.stop=""  -->
    <!-- <div class="form-input code-input" :class="className.indexOf('phone') != -1 ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''">
        <input class="font-28 mr-10" id="phone" ref="phone" v-model="phoneMessage" type="text" placeholder="请输入" /> -->
    <!-- <button @click="handchange()">验证码</button> -->
    <!-- <div class='single-wrapper fs14'> -->
    <!-- <div class='single-mb'>短信验证</div> -->
    <!-- <mt-field type='number' v-model="phoneMessage" placeholder="短信验证码" class='message-wrapper fs15'>
            <mt-button size='small' class='fs14' @click="getCode" :disabled="codeDisabled">{{ codeMsg }}</mt-button>
          </mt-field>
        </div>
      </div>
    </div> -->

    <div class="flex-row mt-20">
      <div class="form-label code-name font-28 mr-20 font-bold">请输入密码</div>
      <div class="form-input code-input" :class="className.indexOf('password') != -1 ? 'form-input-acitve' : ''"
        :style="skin != 'child' ? 'border-radius:5px' : ''">
        <input class="font-28 mr-10" id="password" ref="password" @blur.stop="delName('password')"
          @focus.stop="addName('password')" @click.stop="" v-model="password" :type="show.password ? 'text' : 'password'"
          placeholder="请输入(选填)" />
        <img :src="
          show.password
            ? require('@/assets/images/child/eyeOpen.png')
            : require('@/assets/images/child/eyeClose.png')
        " class="w-24 pointer" alt @click="changeShow('password')" />
      </div>
    </div>
    <div class="flex-row mt-20" v-if="password">
      <div class="form-label code-name font-28 mr-20 font-bold">请确定密码</div>
      <div class="form-input code-input" :class="
        className.indexOf('confirmPassword') != -1 ? 'form-input-acitve' : ''
      " :style="skin != 'child' ? 'border-radius:5px' : ''">
        <input class="font-28 mr-10" id="confirmPassword" ref="confirmPassword" @blur.stop="delName('confirmPassword')"
          @focus.stop="addName('confirmPassword')" @click.stop="" v-model="confirmPassword"
          :type="show.confirmPassword ? 'text' : 'password'" placeholder="请输入" />
        <img :src="
          show.confirmPassword
            ? require('@/assets/images/child/eyeOpen.png')
            : require('@/assets/images/child/eyeClose.png')
        " class="w-24 pointer" alt @click="changeShow('confirmPassword')" />
      </div>
    </div>
    <div class="flex-row mt-40">
      <div class="code-name mr-20"></div>
      <div class="code-input">
        <button class="form-blue-btn font-24 mr-20" :style="skin != 'child' ? 'border-radius:5px' : ''" @click="confirm">
          确认
        </button>
        <button class="form-yellow-btn font-24" :style="skin != 'child' ? 'border-radius:5px' : ''" @click="reback">
          重新采集人脸信息
        </button>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogAddgsVisible" @close="closeDialogAddgsVisible">

      <div slot="title" class="dialog-title">
        <span class="title-text" style="text-align:center;font-size:20px;font-weight:bold">验证码</span>
        <div class="button-right">
          <span class="title-close"></span>
        </div>
      </div>
      <div>
        <img :src="'https://cluster.bwlib.cn' + this.handimg" alt="">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddgsVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <keybord :type="keySet.type" :top="keySet.top" @result="getResult" :left="keySet.left" v-if="keySet.show"></keybord>
  </div>
</template>

<script>
import test from "@/api/hardWare_renderer.js";
import Setting from '../../../../store/modules/Setting';

const { exec } = require("child_process");
const os = require("os");
export default {
  props: ["nextPath"],
  components: {
    keybord: () => import("@/components/common/keyboard2.vue"),
  },
  data() {
    return {
      changele: "",
      handimg: "",
      dialogAddgsVisible: false,
      telephone: '',
      phoneMessage: "",
      // 是否禁用按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '获取验证码',
      // 定时器
      timer: null,
      keySet: {
        show: false,
        top: 0,
        left: 0,
      },
      selectName: "",
      className: "",
      show: {
        password: false,
        phone: false,
        confirmPassword: false,
      },
      cardType: [], //办卡类型
      type: "" /** 类型 */,
      userName: "" /** 用户名称，没有身份认证时需要 */,
      phone: "", //电话
      password: "", //密码
      confirmPassword: "", //确认密码
      cardNumber: "", //读取的卡号

      loading: false /** 接口运行时loading */,
    };
  },
  created() {
    this.testHeader = test.init();
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$store.dispatch("modifyCaption", "请补全信息");
    this.$store.dispatch("add_to_log", "补全信息");

    this.getCardType();
    console.log(this.$store.state.Setting,'--this.$store.state.Setting');
      this.connect();
  },

  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
    idNumberInfo() {
      return this.$store.state.User.idNumberInfo;
    },
    face() {
      return this.$store.state.User.face;
    },
    readerCardType() {
      return this.$store.state.Setting.readerCardType;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    manageSetting() {
      return this.$store.state.Setting.manageSetting;
    },
  },
  mounted() {
    console.log('我是platform', this.platform);
    const numberInfo = Object.assign({}, this.idNumberInfo);
    console.log('我上来就有了身份证', numberInfo.number);
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "moreInfo");
    });
    document.body.addEventListener("click", (data) => {
      if (this.keySet.show) {
        this.className = this.className.replace(this.selectName, "");
        this.changeOpen(false);
      }
    });
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.$router.replace("/");
      }
    },
  },
  methods: {

    /**
     *关闭或取消模态框，清空值
     * @param
     */
    closeDialogAddgsVisible() {
      this.$refs.addForm.resetFields();//element封装的方法,清空模态框的值
      this.title = "" //初始化title的值
      this.addForm = {//初始化addForm中的值
        name: "",
        sort: "",
      }
    },

    /**
     *确定新增数据
     * @param
     */
    saveAddForm(aaa) {
      this.$refs[aaa].validate((valid) => {
        console.log(this.$refs[aaa])
        if (valid) {
          let params = {
            name: this.addForm.name,
            sort: this.addForm.sort
          }
          this.axios.post(`接口地址`, params).then(res => {
            alert('新增成功');
            this.dialogAddgsVisible = false;
            // this.$router.push({name:'categories'})
            this.init()
          })
        }
      })
    },
    getValidStr() {
      if (this.countdown > 0 && this.countdown <= 60) {
        this.countdown--;
        if (this.countdown !== 0) {
          this.codeMsg = "重新发送(" + this.countdown + ")";
        } else {
          clearInterval(this.timer);
          this.codeMsg = "获取验证码";
          this.countdown = 60;
          this.timer = null;
          this.codeDisabled = false;
        }
      }
    },
    // 获取验证码
    getCode() {
      // 验证码60秒倒计时
      if (!this.timer) {
        this.getValidStr();
        this.timer = setInterval(this.getValidStr, 1000)
        this.dialogAddgsVisible = true;
        this.$axios
          .get("https://cluster.bwlib.cn/api/opacClient/general/verificationCheck", { platformId: this.platform.id, phone: this.phone }).then(res => {
            console.log(res.data.imageUrl)
            this.handimg = res.data.imageUrl
          })
      }
    },
    handchange() {
      // 获取验证码

    },
    /**
     * 打开系统键盘
     */
    openKeyBoard() {
      if (os.platform() === "win32") {
        exec("osk.exe");
      } else {
        exec("onboard");
      }
    },
    /**
     * 连接出卡机
     */
    connect() {
      this.connectStatus = this.testHeader.connectCardDeliver();
      this.readCardNumber();
    },
    /**
     * 读取卡号
     */
    readCardNumber() {
      if (!this.connectStatus) {
        this.errorCaption();
        return;
      }
      this.cardNumber = this.testHeader.startCardDeliver();
      console.log(this.cardNumber,'---this.cardNumber');
      // switch (this.cardNumber) {
      //   case -5:
      //     this.errorCaption("办卡错误,错误码605,请联系管理员！");
      //     break;
      //   case -4:
      //     this.errorCaption("办卡错误,错误码604,请联系管理员！");
      //     break;
      //   case -3:
      //     this.errorCaption("办卡错误,错误码603,请联系管理员！");
      //     break;
      //   // case -2:
      //   //   this.errorCaption("办卡错误,错误码602,请联系管理员！");
      //   //   break;
      // }
    },
    errorCaption(caption) {
      console.log(caption)
      this.$store.dispatch("add_to_error_log", caption);
      this.changele = caption ? caption : "办卡机没有新卡或读卡失败，请联系管理员！"
      this.$confirm(
        caption ? caption : "办卡机没有新卡或读卡失败，请联系管理员！",
        "提示",
        {
          confirmButtonText: caption ? "关闭" : "回到首页",
          showClose: false,
          showCancelButton: false,
          type: "warning",
        }
      ).then(() => {
        console.log("11111111111111111", caption)
        if (this.changele == "办卡机没有新卡或读卡失败，请联系管理员！") {
          this.$router.replace("/");
        } else {

        }
      });
    },
    /**
     * 获取读者类型
     */
    getCardType() {
      this.$store.dispatch("add_to_log", "获取读者类型");

      this.$axios
        .get("/hardware/interface/readerType", { platformId: this.platform.id })
        .then((res) => {

          this.cardType = res.data.content;

          this.type = res.data.content[1].id;
          this.$store.dispatch("add_to_log", "获取读者类型成功");
        })
        .catch((err) => {
          this.$store.dispatch("add_to_error_log", "获取读者类型失败");
        });
    },
    /**
     * @description:添加name
     */
    addName(name) {
      if (this.className.indexOf(name) == -1) {
        this.className = this.className + name;
      }
      if (name == "type") {
        this.changeOpen(false);

        return;
      }
      if (this.selectName && this.selectName != name) {
        this.className = this.className.replace(this.selectName, "");
        this.selectName = "";
      }
      this.selectName = name;
      if (name == "userName") {
        this.openKeyBoard();
        this.changeOpen(false);
      } else {
        this.setKeybord(name);
      }
    },
    /**
     * 获取输入值
     */
    getResult(data) {
      if (data && data != "del") {
        this[this.selectName] = this[this.selectName] + data;
      } else if (data == "del") {
        this[this.selectName] = this[this.selectName].substring(
          0,
          this[this.selectName].length - 1
        );
      } else {
        this[this.selectName] = "";
      }
      let input = document.getElementById(this.selectName);
      input.focus();
      this.changeOpen(true);
    },
    /**
     * 设置键盘位置并打开
     */
    setKeybord(name) {
      let item = this.$refs[name].getBoundingClientRect();
      this.keySet.top = item.top + item.height + 10;
      this.keySet.left = item.left;
      this.changeOpen(true);
    },
    /**
     * 改变键盘的状态
     */
    changeOpen(status) {
      this.keySet.show = status;
      this.keySet = Object.assign({}, this.keySet);
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.selectName = name;
      exec("taskkill /f /im osk.exe");
    },
    /**
     * @description:切换输入框内容
     */
    changeShow(name) {
      this.show[name] = !this.show[name];
      this.show = Object.assign({}, this.show);
    },
    /**
     * @description:认证密码
     */
    confirm() {
      console.log(this.cardNumber);
      if (!this.cardNumber) {
        this.errorCaption();
        return;
      }
      if (!this.type) {
        this.$message.error("请选择读者卡类型");
        return;
      }
      if (!this.phone) {
        this.$message.error("请输入手机号");
        return;
      }
      if (
        !this.manageSetting.selfServiceCardMachineIsIdCard &&
        !this.userName
      ) {
        this.$message.error("请输入姓名");
        return;
      }
      if (this.phone && !this.$filter.checkPhone(this.phone)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      // if (!this.password) {
      //   this.$message.error("请输入密码");
      //   return;
      // }
      if (this.password && !this.confirmPassword) {
        this.$message.error("请确认密码");
        return;
      }
      if (this.password && this.password != this.confirmPassword) {
        this.$message.error("两次输入密码不一致");
        return;
      }
      this.loading = true;
      const numberInfo = Object.assign({}, this.idNumberInfo);
      console.log(numberInfo.number, this.cardNumber, '111111111111111111111111111111123222222222')
      this.$axios
        .post("/hardware/interface/reader", {
          uuid: this.uuid,
          address: numberInfo.address,
          birthDay:
            numberInfo && numberInfo.birth
              ? this.$func.changeIdCardDate(numberInfo.birth) + " 00:00:00"
              : "",
          certificateNumber: numberInfo.number,
          idNumber: numberInfo.number,
          rfId: this.cardNumber,
          gender: numberInfo.sex == "女" ? "FEMALE" : "MALE",
          name: numberInfo.name || this.userName,
          password: this.password ? this.password : "123456",
          phone: this.phone,
          photoBase64: this.face,
          readerTypeId: this.type,
          readerUnitName: "蓝鲸知图",
          readerTypeName: this.cardType.filter((it) => {
            return it.id == this.type;
          })[0].name,
          platformId: this.platform.id,
        })
        .then((res) => {
          console.log('我是res', res.data);
          this.loading = false;
          this.$store.commit("set_card_order", res.data);
          if (!this.password) {
            this.$message.success("您没有设置密码,默认为(123456)");
          }
          this.$router.push({
            path: this.$func.getNextPath(this.list),
          });
        })
        .catch((err) => {
          // this.readerFail();
          this.loading = false;

          this.$store.dispatch("add_to_error_log", "办卡失败,原因:" + err);
          this.$confirm(`办卡失败 ${err}`, '提示', {
            // confirmButtonText: '确定',
            showConfirmButton: false,
            showClose: false,
            closeOnClickModal: false,
            // confirmButtonText: '确定',
            cancelButtonText: '关闭',
            type: 'error'
          }).then(() => {

          }).catch(() => {

          });
          // this.$func.toast({
          //   content: "办卡失败," + err,
          //   type: "ERROR",
          // });
        });
    },
    /**
     * @description:重新认证
     */
    reback() {
      let list = this.$func.setPrevFalse(JSON.parse(JSON.stringify(this.list)));
      this.$store.dispatch("modifyProgreeList", this.$func.setPrevFalse(list));
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.confirm {
  position: absolute;
  top: 38%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 84%;
}

.code-name {
  width: 34%;
  text-align: right;
}

.code-input {
  width: 60%;
  display: flex;
}

/deep/.el-input__inner {
  &::placeholder {
    color: rgba(0, 0, 0, 0.75) !important;
  }

  padding: 0px !important;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.75) !important;
}

input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.75) !important;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(0, 0, 0, 0.75) !important;
}

input::-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(0, 0, 0, 0.75) !important;
}

input::-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(0, 0, 0, 0.75) !important;
}
</style>