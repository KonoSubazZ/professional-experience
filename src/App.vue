<template>
  <router-view></router-view>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  font-weight: bold !important;
}

body {
  height: 100vh;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.el-input__wrapper {
  background-color: #fff !important;
  box-shadow: none !important;
  border: none !important;
}

.el-input__inner {
  font-size: 36px !important;
  border-radius: 10px !important;
  height: 80px !important;
}

.el-input__suffix {
  padding-right: 7px;
  display: flex;
  align-items: center;
}

.el-input__prefix {
  padding-left: 7px;
  display: flex;
  align-items: center;
}

.el-input__password {
  font-size: 35px !important;
}

.el-checkbox__inner::after {
  width: 10px !important;
  height: 10px !important;
  top: 5px !important;
  left: 8px !important;
  transform: rotate(45deg) scaleY(2) !important;
}

.el-checkbox__inner {
  width: 30px !important;
  height: 30px !important;
}

.el-checkbox__label {
  font-size: 25px !important;
  display: flex;
  align-items: center;
}

.el-message {
  top: 33% !important;
}

.el-input.is-disabled .el-input__inner {
  color: var(--el-input-text-color, var(--el-text-color-regular)) !important;
  -webkit-text-fill-color: var(--el-input-text-color, var(--el-text-color-regular)) !important;
}

.el-dialog {
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);

  .el-dialog__title,
  .el-dialog__headerbtn {
    font-size: 30px;
  }
}

.less {
  width: 220px;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-message {
  font-size: 40px !important;
}

.el-message__content {
  font-size: 23px !important;
}

.el-message-box {
  padding: 20px;
}

.el-message-box__title {
  font-size: 26px;
}

.el-message-box__close {
  width: 2em !important;
}

.el-message-box__message {
  padding-left: 50px !important;
  font-size: 20px;
}

.el-message-box__btns .el-button {
  padding: 20px !important;
  font-size: 20px !important;
}

.el-backtop {
  bottom: 90px !important;
  left: 30px;
}

.key-board {
  width: 100% !important;
  height: 516px !important;
  top: auto !important;
  bottom: 0 !important;
  transform: translate(-50%, 0%) !important;
}

.key-board-result {
  width: 100% !important;
  height: 135px !important;
}

.key-board-result .key-board-code-show {
  height: 37px !important;
  font-size: 30px !important;
  line-height: 37px !important;
  color: black !important;
}

.key-board .key-board-container .key-board-area {
  width: 100% !important;
  height: 100% !important;
}

.key-board-button svg {
  width: 50px !important;
  height: 35px !important;
}

.key-board-result-show {
  color: black !important;
}

.key-board-result-show-more {
  justify-content: center !important;
}

.key-board-result .key-board-result-show .key-board-result-show-more span {
  border: 13px solid !important;
  border-color: transparent !important;
  border-top-color: rgb(0, 102, 255) !important;
}

.default-key-board {
  justify-content: space-around !important;
}

.default-key-board .line.line1 {
  height: 50px !important;
  width: 98% !important;
}

.default-key-board .line.line2 {
  height: 50px !important;
  width: 88% !important;
}

.default-key-board .line.line3 {
  height: 50px !important;
  width: 98% !important;
}

.default-key-board .line.line4 {
  height: 50px !important;
  width: 98% !important;
}



.key-board-button {
  font-size: 34px !important;
  width: 75px !important;
  height: 75px !important;
  border-radius: 18px !important;
  color: black !important;
}

.default-key-board .line.line4 .key-board-button+.key-board-button span {
  font-size: 15px !important;
  // width: 46px !important;
  // height: 46px !important;
  // border-radius: 10px !important;
  // color: black !important;
}
.default-key-board .line.line4 .key-board-button+.key-board-button span label{
  font-size: 34px !important;
}

.key-board-button:hover {
  background: #ff9159 !important;
  color: #fff !important;
}

.key-board-button-active {
  background: #ff9159 !important;
  color: #fff !important;
}

.key-board-button.key-board-button-delete svg {
  width: 50px !important;
  height: 100% !important;
}

.key-board-result .key-board-result-show .key-board-result-show-container span {
  font-size: 35px !important;
}

.key-board-button.key-board-button-close svg {
  width: 50px !important;
  height: 26px !important;
}

.svg-icon {
  stroke: black !important;
}
.el-range-editor.el-input__wrapper{
  width: 400px;
  height: 40px;
}
</style>
