<template>
  <div>
    <audio id="audioIC" :src="audioSrc"></audio>
    <div class="input">
      <div class="form-input" style="display: flex; align-items: center">
        <img class="search-icon" src="../../../assets/image/user.png" alt="" />
        <input
          ref="userNameT"
          id="userName"
          class="inputs"
          data-mode="en"
          v-model="inputInfo.userName"
          placeholder="请输入您的用户名"
        />
        <!-- <img @click="reload" style="width: 40px;margin-left:10px" src="../../../assets/image/breack.png" alt=""> -->
      </div>
    </div>
    <div class="input">
      <div class="form-input">
        <img
          class="search-icon"
          src="../../../assets/image/password.png"
          alt=""
        />
        <input
          id="password"
          class="inputs"
          data-mode="en"
          v-model="inputInfo.password"
          type="password"
          placeholder="请输入您的登录密码"
        />
      </div>
    </div>
    <div class="search_btn">
      <el-button type="primary" round @click="goLogin">登录</el-button>
    </div>

    <Key-Board @change="keyChange" :blurHide="false" :color="'#06f'" />
  </div>
</template>
<script setup>
import pic from "@utils/image";
import { UserService } from "@api/request";
import filter from "@utils/filter";
import { ElMessage } from "element-plus";
import resetSetItem from "@utils/session";
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
window.resetSetItem = resetSetItem;
const inputInfo = ref({
  userName: "",
  password: "",
});
const audioSrc = ref("");
let time = setTimeout(() => {
  console.log("准备出发");
  clearTimeout(time);
  router.push("/index");
}, 10000);
const keyChange = () => {
  inputInfo.value.userName = document.getElementById("userName").value;
  inputInfo.value.password = document.getElementById("password").value;
  clearTimeout(time);
  time = setTimeout(() => {
    console.log("准备出发");
    clearTimeout(time);
    router.push("/index");
  }, 10000);
};
// 页面刷新
const reload = () => {
  window.location.reload();
};
const goLogin = () => {
  clearTimeout(time);
  time = setTimeout(() => {
    console.log("准备出发");
    clearTimeout(time);
    router.push("/index");
  }, 10000);
  if (!inputInfo.value.userName) {
    return ElMessage.error("请输入您的用户名");
  }
  if (!inputInfo.value.password) {
    return ElMessage.error("请输入您的登录密码");
  }
  let params = {
    userName: inputInfo.value.userName,
    password: inputInfo.value.password,
    platformId: String(store.getters.platform.platformId),
    // caseId:1
    caseId: String(store.getters.getCabinetInfo.id),
  };
  UserService.sysUserLogin(params).then((res) => {
    if (res.code == 0) {
      if (res.data.code == -1) {
        return ElMessage.error(res.data.msg + "请开通登录权限");
      } else {
        store.dispatch("setUserInfo", res.data.user);
        resetSetItem("user", JSON.stringify(res.data.user));
        ElMessage.success(
          `登录成功，欢迎您管理员 ${filter.hideName(res.data.user.name)}`
        );
        nextTick(() => {
          playAudio("login");
        });
        clearTimeout(time);
        router.push("/managerBook");
      }
    } else {
      ElMessage.error(res.message);
      clearTimeout(time);
      time = setTimeout(() => {
        console.log("准备出发");
        clearTimeout(time);
        router.push("/index");
      }, 9000);
    }
  });
};
const playAudio = (label) => {
  let audio;
  try {
     audio = document.getElementById("audioIC");
  } catch (error) {
    console.log(
      "这里是因为异步settimeout导致没有获取到audioICDOM---try catch提前返回!!!"
    );
    return;
  }
  // let audio = document.getElementById("audioIC");
  audio.addEventListener("canplay", () => {
    console.log("加载成功");
    audio.play();
  });
  audio.addEventListener("play", () => {
    console.log("播放成功");
  });
  if (!label) {
    audio.pause();
    audioSrc.value = "";
  } else {
    audioSrc.value = pic[label];
  }
};
</script>
<style lang="less" scoped>
.search_btn {
  margin-top: 30px;
  padding: 15px;
  display: flex;
  justify-content: center;

  /deep/ .el-button--primary {
    width: 100%;
    height: 80px;
    background: rgba(255, 145, 89, 1);
    border: none;
    border-radius: 15px;
  }

  /deep/ .el-button--primary span {
    letter-spacing: 2px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 5px 8px rgba(14, 89, 170, 0.29);
  }
}

.search_book {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 750px;
  position: relative;
}

.inputs {
  padding-left: 80px;
  height: 80px;
  width: 89%;
  font-size: 29px;
  outline: none;
  border: 1px solid #eee;
  border-radius: 10px;
}

.search-icon {
  position: absolute;
  left: 25px;
  top: 20px;
}

.form-input {
  /deep/.el-button--primary {
    border-radius: 0;
    border: none;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 80px;
    color: #fff;
    font-size: 30px;
    box-shadow: none;
    background: linear-gradient(-28deg, #6dd89b 0%, #98f1c7 100%) !important;
  }
}
</style>