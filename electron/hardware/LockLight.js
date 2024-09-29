const { ipcMain } = require("electron");
const path = require("path");
const { getDevice, getDllPath } = require("../hardwareDll.js");
const fork = require("child_process").fork;
// 后加的获取子进程
const child = fork(path.resolve(__dirname, "./child/LockLightChild.js"));
let mainDevice = null;
function init() {
  child.send({ event: "getDllPath", getDllPath: getDllPath() }); //发送dll文件的地址给子进程
  mainDevice = getDevice("lockAndLight");
  ipcMain.on("connectLight", connectLight);
  ipcMain.on("openLight", openLight);
  ipcMain.on("closeLight", closeLight);
  ipcMain.on("closeConnectLight", closeConnectLight);
  ipcMain.on("openZYX", openZYX);
  ipcMain.on("closeZYX", closeZYX);
}
//灯控连接
function connectLight(event, args) {
  child.send({ event: "connectLight" });
}
//断开灯控连接
function closeConnectLight(event, args) {
  child.send({ event: "closeConnectLight" });
  // event.returnValue = true;
}
//开灯
function openLight(event, args) {
  child.send({ event: "openLight" });
  // event.returnValue = result;
}
//关灯
function closeLight(event, args) {
  child.send({ event: "closeLight" });
  // event.returnValue = true;
}
//开紫外线灯
function openZYX(e, args) {
  child.send({ event: "openZYX" });
  child.once("message", (msg) => {
    console.log(msg,'---msg');
    if (msg.mainName == "openZYX") {
      e.returnValue = msg.returnData;
    }
  });
}
//关紫外线灯
function closeZYX(e, args) {
  child.send({ event: "closeZYX" });
  child.once("message", (msg) => {
    if (msg.mainName == "closeZYX") {
      e.returnValue = msg.returnData;
    }
  });
}

module.exports = {
  init,
};
