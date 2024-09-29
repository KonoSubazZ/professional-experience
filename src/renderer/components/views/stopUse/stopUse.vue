<template>
  <div class="door-show">
    <div class="door-box">
      <div class="box-left">
        <div class="header" @click="open">
          <div>温馨提示</div>
        </div>
        <div class="body">
          <div class="caption">本机已停止使用</div>
          <div class="caption">请前往前台人工处理</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickNumber: 0,
      setTimeout: "",
    };
  },
  created() {},
  methods: {
    open() {
      if (this.clickNumber < 5) {
        this.clickNumber += 1;
        if (this.setTimeout) {
          clearInterval(this.setTimeout);
        }
        this.setTimeout = setTimeout(() => {
          this.clickNumber = 0;
        }, 2000);
      } else {
        this.clickNumber = 0;
        this.$prompt("请输入停用验证密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "email",
        }).then((res) => {
          if (res.action == "confirm") {
            let password = localStorage.getItem("stopPassword");
            if (password == res.value) {
              this.$store.dispatch("add_to_log", "启用平台");

              this.$router.replace("/");
            } else {
              this.$message.error("验证失败");
            }
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.door-show {
  background-color: #f0f2f5;
  width: 100%;
  height: 100vh;
  padding: 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .door-box {
    display: flex;
    flex: 1;
    .box-left {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .header {
        background-color: rgb(40, 120, 255);
        height: 80px;
        font-size: 20px;
        color: white;
        display: flex;
        // justify-content: space-between;
        justify-content: center;
        padding: 0 1rem;
        align-items: center;
        box-sizing: border-box;
      }
      .body {
        background-color: white;
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size:3rem;
        .caption {
          font-size: 50px;
          line-height: 70px;
          color: red;
        }
      }
    }
  }
}
</style>