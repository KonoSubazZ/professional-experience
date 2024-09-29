const { ipcMain } = require("electron");
const fork = require("child_process").fork;
const path = require("path");
// 后加的获取子进程
const child = fork(path.resolve(__dirname, "./child/ICReaderChild.js"));
const {
  getDevice,
  getRFIDDriverPath,
  getDllPath,
} = require("../hardwareDll.js");
let mainDevice = null;
function init() {
  child.send({ event: "getDllPath", getDllPath: getDllPath() }); //发送dll文件的地址给子进程
  mainDevice = getDevice("bookcaserfid");
  ipcMain.on("openReadCard", openReadCard);
  ipcMain.on("closeReadCard", closeReadCard);
  ipcMain.on("inventoryReadCard", inventoryReadCard);
  ipcMain.on("stopReadCard", stopReadCard);
}

//打开连接读者卡
function openReadCard(event, args) {
  child.send({ event: "openReadCard" });

  // event.returnValue = true;
}
//断开连接
function closeReadCard(event, args) {
  child.send({ event: "closeReadCard" });
  // event.returnValue = true;
}

//开始盘点
function inventoryReadCard(e, args) {
  child.send({ event: "inventoryReadCard" });
  child.once("message", (msg) => {
    if (msg.mainName == "inventoryReadCard") {
      e.sender.send("readCard", msg.returnData);
    }
  });

  // event.returnValue = true;
}

//停止盘点
function stopReadCard(event, args) {
  child.send({ event: "stopReadCard" });
  // event.returnValue = true;
}
module.exports = {
  init,
};
