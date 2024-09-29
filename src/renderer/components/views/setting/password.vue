<template>
  <background :setting="backSetting">
    <template v-slot:body>
      <div class="setting-form posi-center-top-10">
        <div class="form-line">
          <div class="form-label font-28">请输入原硬件密码</div>
          <div class="form-value">
            <div
              class="form-input"
              :class="
                className.indexOf('oldPassword') != -1
                  ? 'form-input-acitve'
                  : ''
              "
              :style="skin != 'child' ? 'border-radius:5px' : ''"
            >
              <input
                v-model="info.oldPassword"
                class="font-28 mr-10"
                @blur="delName('oldPassword')"
                @focus="addName('oldPassword')"
                :type="show.oldPassword ? 'text' : 'password'"
                placeholder="请输入"
              />
              <img
                :src="
                  show.oldPassword
                    ? require('@/assets/images/child/eyeOpen.png')
                    : require('@/assets/images/child/eyeClose.png')
                "
                class="w-24 pointer"
                alt
                @click="changeShow('oldPassword')"
              />
            </div>
          </div>
        </div>
        <div class="form-line">
          <div class="form-label font-28">设置新硬件密码</div>
          <div class="form-value">
            <div
              class="form-input"
              :class="
                className.indexOf('newPassword') != -1
                  ? 'form-input-acitve'
                  : ''
              "
              :style="skin != 'child' ? 'border-radius:5px' : ''"
            >
              <input
                v-model="info.newPassword"
                class="font-28 mr-10"
                @blur="delName('newPassword')"
                @focus="addName('newPassword')"
                :type="show.newPassword ? 'text' : 'password'"
                placeholder="请输入"
              />
              <img
                :src="
                  show.newPassword
                    ? require('@/assets/images/child/eyeOpen.png')
                    : require('@/assets/images/child/eyeClose.png')
                "
                class="w-24 pointer"
                @click="changeShow('newPassword')"
                alt
              />
            </div>
          </div>
        </div>
        <div class="form-line">
          <div class="form-label font-28">确认新硬件密码</div>
          <div class="form-value">
            <div
              class="form-input"
              :class="
                className.indexOf('confirmPassword') != -1
                  ? 'form-input-acitve'
                  : ''
              "
              :style="skin != 'child' ? 'border-radius:5px' : ''"
            >
              <input
                v-model="info.confirmPassword"
                class="font-28 mr-10"
                @blur="delName('confirmPassword')"
                @focus="addName('confirmPassword')"
                :type="show.confirmPassword ? 'text' : 'password'"
                placeholder="请输入"
              />
              <img
                :src="
                  show.confirmPassword
                    ? require('@/assets/images/child/eyeOpen.png')
                    : require('@/assets/images/child/eyeClose.png')
                "
                class="w-24 pointer"
                @click="changeShow('confirmPassword')"
                alt
              />
            </div>
          </div>
        </div>
        <div class="form-line">
          <div class="form-label"></div>
          <div class="form-btn">
            <button
              class="form-blue-btn font-24 mr-20"
              :style="skin != 'child' ? 'border-radius:5px' : ''"
              @click="confirmEdit"
            >
              完成
            </button>
            <button
              class="form-yellow-btn font-24"
              v-if="platform.password"
              :style="skin != 'child' ? 'border-radius:5px' : ''"
              @click="goBack"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    </template>
  </background>
</template>
<script>
import background from "@/components/common/background";
import uuid from "uuidjs";

export default {
  name: "password",
  components: {
    background,
  },
  data() {
    return {
      backSetting: {
        showTime: false,
        titleType: "setting",
        back: false,
      },
      className: "", //选中的输入框
      show: {
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      },
      info: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    platform() {
      return this.$store.state.Setting.platform;
    },
    uuid() {
      return this.$store.state.Setting.uuid;
    },
  },
  methods: {
    /**
     * 返回
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * @description:添加name
     */
    addName(name) {
      if (this.className.indexOf(name) == -1) {
        this.className = this.className + name;
      }
    },
    /**
     * @description:删除name
     */
    delName(name) {
      this.className = this.className.replace(name, "");
    },
    /**
     * @description:切换输入框内容
     */
    changeShow(name) {
      this.show[name] = !this.show[name];
      this.show = Object.assign({}, this.show);
    },
    /**
     * 确定修改硬件密码
     */
    confirmEdit() {
      let info = this.info;
      if (!info.oldPassword) {
        this.$message.error("请输入原硬件密码");
        return;
      }
      if (!info.newPassword) {
        this.$message.error("请输入新硬件密码");
        return;
      }
      if (!info.confirmPassword) {
        this.$message.error("请输入确认新硬件密码");
        return;
      }
      if (info.newPassword != info.confirmPassword) {
        this.$message.error("两次输入的新密码不一致");
        return;
      }
      this.$store.dispatch("add_to_log", "修改硬件密码");

      this.$axios
        .post("/hardware/interface/modifyPassword", {
          newPassword: info.newPassword,
          oldPassword: info.oldPassword,
          platformId: this.platform.id,
          uuid: this.uuid,
        })
        .then((res) => {
          this.$store.dispatch("add_to_log", "修改硬件密码成功");

          this.$message.success("修改成功");
          this.info = {};
        })
        .catch((err) => {
          this.$store.dispatch("add_to_log", "修改硬件密码失败");
        });
    },
  },
};
</script>
<style lang="less" scoped>
.setting-form {
  //   padding-top: 5%;
  .form-line {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 30px;
    .form-label {
      width: 35%;
      text-align: right;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
      padding-right: 20px;
    }
    .form-value {
      flex: 1;
    }
    .form-btn {
      margin-top: 2;
    }
  }
}
</style>
