<template>
  <div class="people" :class="skin != 'child' ? 'position' : 'child'">
    <div class="flex-row font-20">
      <div class="flex-row w-number-50">
        <div class="label">
          <div class="mt-20">读者姓名</div>
          <div class="mt-20">读者性别</div>
          <div class="mt-20">读者卡号</div>

          <div class="mt-20">证件类型</div>
        </div>
        <div class="value">
          <div class="mt-20">{{ userInfo.name || "无" }}</div>
          <div class="mt-20">
            {{
              userInfo.gender == "MALE"
                ? "男"
                : userInfo.gender == "FEMALE"
                ? "女"
                : "无"
            }}
          </div>
          <div class="mt-20">{{ userInfo.number || "无" }}</div>
          <div class="mt-20">{{ cardType[userInfo.certificateType] }}</div>
        </div>
      </div>
      <div class="flex-row w-number-50">
        <div class="label">
          <div class="mt-20">联系电话</div>
          <!-- <div class="mt-20">当前借阅</div>
          <div class="mt-20">历史借阅</div> -->
          <div class="mt-20">办卡时间</div>
          <div class="mt-20">所缴押金</div>
          <div class="mt-20">证件号码</div>
        </div>
        <div class="value">
          <div class="mt-20">{{ userInfo.phone || "无" }}</div>
          <div class="mt-20">
            {{ userInfo.createTime | dateTime(["h", "m"]) }}
          </div>
          <!-- <div class="mt-20">2本</div>
          <div class="mt-20">12本</div> -->
          <div class="mt-20">
            {{ userInfo.deposit ? userInfo.deposit + "元" : "未缴纳" }}
          </div>
          <div class="mt-20">{{ userInfo.idNumber || "无" }}</div>
        </div>
      </div>
    </div>
    <el-button type="warning" round @click="goChild('code')"
      >修改密码</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardType: {
        ID_CARD: "身份证",
        CITIZEN_CARD: "市民卡",
        CAMPUS_CARD: "校园一卡通",
        OTHER: "其他",
      },
      listarr: {
        code: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
            path: "/editCode/",
          },
          // {
          //   name: "进行认证",
          //   select: false,
          //   ico: "loading_",
          // },
          {
            name: "修改密码",
            select: false,
            ico: "password_",
            path: "/editCode/code",
          },
          {
            name: "修改成功",
            select: false,
            ico: "success_",
          },
        ],
      },
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.reback();
      }
    },
  },
  created() {
    let list = JSON.parse(JSON.stringify(this.list));
    list.push({
      name: "个人信息",
      select: true,
      ico: "people_",
      menu: true,
    });
    this.$store.dispatch("add_to_log", "查询读者信息");
    this.$store.dispatch("modifyProgreeList", list);
    this.$store.dispatch("modifyCaption", "个人信息查询");
  },
  methods: {
    /**
     * @description:返回
     */
    reback() {
      this.$router.replace("/");
    },
    goChild(name) {
      let list = this.listarr[name];
      if (list[0].path == "/editCode/") {
        this.$store.dispatch("modifyProgreeList", list);
        this.$router.push({
          path: "/editCode/code",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.child {
  position: absolute;
  top: 33%;

  left: 0;
  right: 0;
  margin: 0 auto;
}

.position {
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.w-number-60 {
  width: 60%;
}
.w-number-50 {
  width: 50%;
}
.w-number-40 {
  width: 40%;
}
.people {
  // width: 70%;
  padding: 2% 2rem;
  box-sizing: border-box;
  background: rgba(220, 239, 255, 0.23);
  .label {
    width: 35%;
  }
  .value {
    width: 75%;
  }
  .font-20 {
    font-size: 1.35rem !important;
  }
  .el-button {
    position: absolute;
    right: 0;
    bottom: -50px;
  }
}
</style>