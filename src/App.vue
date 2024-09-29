<template>
  <div id="app" @click="isTimeOut">
    <router-view></router-view>
    <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: 3600000,// 设置超时时间:一小时
    };
  },
  created() {
    // setInterval(()=>{
    //   axios.get('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&common=1&random=1683531956810').then(res=>{
    //   console.log(res,'resss');
    // },3000)
    // })
    // console.log('Project Author: Zeng Cheng;')
    // console.log('Email address: 2468914478@qq.com;')
    // console.log('Completion time: October 31, 2020;')
  },
  methods: {
    isTimeOut() {
      this.currentTime = new Date().getTime()
      if (this.currentTime - this.lastTime > this.timeOut) {
        // if (localStorage.getItem("user")) {
        //   this.$message.error('登录超时，请重新登录！')
        //   setTimeout(() => {
        //     this.doLogout();
        //   }, 1000);
        // } else {
        //   this.lastTime = new Date().getTime()
        // }
      } else {
        this.lastTime = new Date().getTime()
      }
    },
    doLogout() {//退出登录
      if (localStorage.getItem('alone') == 1) {
        // localStorage.removeItem('alone');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        sessionStorage.clear();
        let path = '/loginAlone?id=' + localStorage.getItem('platformId');
        // console.log(path)
        this.$router.push(path);
      } else if (localStorage.getItem('alone') == 2) {
        // localStorage.removeItem('alone');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        sessionStorage.clear();
        this.$router.push('/loginAll');
      } else if (localStorage.getItem('alone') == 3) {
        // localStorage.removeItem('alone');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        sessionStorage.clear();
        this.$router.push('/singleVisionLogin');
      } else {
        //localStorage.clear()
        sessionStorage.clear();
        // localStorage.removeItem('alone');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        this.$router.push('/login');
      }

      // localStorage.clear()
    },
  }
};
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css'; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
/* 
    .el-input--small .el-input__inner{
        height: 42px !important;
        line-height: 42px !important;
} */
/* #app{
     font-family: Microsoft Yahei; 
   } */
.container {
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  overflow: auto;
}

.containeres {
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  overflow: auto;
}

.sidebar-el-menu::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.login .el-input--small .el-input__inner,
.login .el-range-editor--small.el-input__inner {
  height: 42px !important;
  line-height: 42px !important;
}

.el-pagination__editor.el-input .el-input__inner {
  height: 28px !important;
}

.color_dan,
.color_dan:active,
.color_dan:hover {
  color: #f56c6c !important;
}

.color_dan:active {
  color: #f56c6c !important;
}

.color_war {
  color: #e6a23c;
}

.color_suc {
  color: #67c23a;
}

.color_par {
  color: #267ff9;
}

.numberes {
  padding-right: 30px;
  box-sizing: border-box;
  color: #aaa;
  text-align: right;
  width: 100%;
  z-index: 10;
  font-size: 12px;
}

.poRa {
  position: relative;
}

.header_title {
  border-bottom: 1px solid #dcdcdc;
  height: 3.81rem;
}

.el-upload--text {
  border: 0;
}

.textarea .el-textarea__inner {
  resize: none;
}

.el-tree-node__label {
  font-size: 12px;
}

.el-dropdown-menu {
  background-color: #1f2d3d !important;
  border: 1px solid #1f2d3d !important;
  color: #fff !important;
}

.el-dropdown-menu__item {
  color: #fff !important;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #66b1ff !important;
}

.el-popper[x-placement^='bottom'] .popper__arrow::after {
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: rgb(12, 155, 250) !important;
}

.el-dropdown-menu__item--divided:before {
  background-color: #1f2d3d !important;
}

.el-dropdown-menu__item--divided {
  border: 0 !important;
}

.overaoto {
  overflow: auto;
  position: relative;
}

.el-table__footer-wrapper {
  position: absolute;
  bottom: 0;
}

.mineAlone .el-table__footer-wrapper {
  position: relative;
  bottom: 0;
}

.overaoto .el-table__body-wrapper {
  padding-bottom: 40px !important;
  overflow: auto;
  box-sizing: border-box;
}

.userPhoto .avatar-uploader-icon,
.userPhoto .avatar {
  width: 140px;
  height: 220px;
  object-fit: contain;
}

.text {
  user-select: text;
}

/* .userPhoto {
    width: 178px;
    min-height: 178px;
    display: block;
    position: relative;
    object-fit: cover;
    z-index: 1;
} */
.iocn_del {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>