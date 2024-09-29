const { ipcMain } = require("electron");
const path = require("path");
const fork = require("child_process").fork;
const {
  getDevice,
  getRFIDDriverPath,
  getConfig,
  getDllPath,
} = require("../hardwareDll.js");
let mainDevice = null;
let config = getConfig();
const methodArr = ["enableEAS", "disableEAS", "writeAFI"];
// 后加的获取子进程
const child = fork(path.resolve(__dirname, "./child/RFIDReaderChild.js"));

function init() {
  child.send({ event: "getDllPath", getDllPath: getDllPath() }); //发送dll文件的地址给子进程
  mainDevice = getDevice("bookcaserfid");
  ipcMain.on("openConnect", open);
  ipcMain.on("closeConnect", close);
  ipcMain.on("inventory", inventory);
  ipcMain.on("inventoryOne", inventoryOne);
  ipcMain.on("stopInventory", stopInventory);
  ipcMain.on("writeMulti", writeMulti);
  methodArr.map((item) => {
    ipcMain.on(item, function (event, data) {
      if (data) {
        mainDevice[item](data, function (error, result) {});
      } else {
        mainDevice[item](null, function (error, result) {});
      }
      event.returnValue = true;
    });
  });
}

//打开连接柜子
function open(e, rfidIP) {
  child.send({ event: "open", rfidIP });
  child.on("message", (msg) => {
    if (msg.mainName == "open") {
      e.returnValue = msg.returnData;
    }
  });
}

//单格盘点
function inventoryOne(e, antennaId) {
  child.send({ event: "inventoryOne", antennaId });
  child.once("message", (msg) => {
    if (msg.mainName == "inventoryOne") {
      e.returnValue = msg.returnData;
      console.log(msg.returnData, new Date(), "=====inventoryOne=====");
    }
  });
}

//实时盘点
function inventory(e, antennaId) {
  child.send({ event: "inventory", antennaId });
  child.once("message", (msg) => {
    if (msg.mainName == "inventory") {
      e.returnValue = msg.returnData;
      console.log(e.returnValue, new Date(), "=====inventory=====");

    }
  });
}

//写入标签DataBlock数据
function writeDataBlock(dataBlockStr) {
  mainDevice.writeMulti(
    {
      uid: "E004A211039736A7",
      dataBlockStr,
    },
    function (err, res) {
      console.log("writeDataBlock", err, res);
    }
  );
  // event.returnValue = true;
}

//停止盘点
function stopInventory(event, arg) {
  child.send({ event: "stopInventory" });
}

//高频编码
function writeMulti(event, data) {
  child.send({ event: "writeMulti", data });
}
//关闭连接柜子
function close(event, args) {
  console.log("========close=======");
  child.send({ event: "close" });
  // event.returnValue = true;
}

module.exports = {
  init,
};
