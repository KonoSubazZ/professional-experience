const { ipcMain } = require("electron");
const { getDevice, getDllPath } = require("../hardwareDll.js");
const path = require("path");
const fork = require("child_process").fork;
const electron = require("../electron.js");

let mainDevice = null;
// 后加的获取子进程
const child = fork(path.resolve(__dirname, "./child/LockDoorChild.js"));
function init() {

  child.send({ event: "getDllPath", getDllPath: getDllPath() }); //发送dll文件的地址给子进程
  mainDevice = getDevice("lockAndLight");
  ipcMain.on("connectLock", connectLock);
  ipcMain.on("openLock", openLock);
  ipcMain.on("openAllLock", openAllLock);
  ipcMain.on("getLockState", getLockState);
  ipcMain.on("closeLock", closeLock);
}
//锁控连接
function connectLock(event, args) {
  child.send({ event: "connectLock" });
}
//单个开锁
function openLock(event, data) {
  child.send({ event: "openLock", data });
}
//开所有锁
function openAllLock(e, data) {
  console.log(data, "====openAllLock====",new Date());
  child.send({ event: "openAllLock", data });
}
//获取锁状态
function getLockState(e, data) {
  child.send({ event: "getLockState", data });
  child.once("message", (msg) => {
    if (msg.mainName == "getLockState") {
      e.returnValue = msg.returnData;
    }
  });
}
//断开锁连接
function closeLock(event, args) {
  child.send({ event: "closeLock" });
}

module.exports = {
  init,
};
