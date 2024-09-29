const { ipcMain } = require("electron");
const { getDevice, getRFIDDriverPath } = require("../hardwareDll.js");
let mainDevice = null;
function init() {
  mainDevice = getDevice("readerCardReader");
  // 借还机的那种刷卡器
  ipcMain.removeAllListeners("readReaderCard");
  ipcMain.removeAllListeners("stopReaderCard");
  ipcMain.on("readReaderCardTwo", startRead);
  ipcMain.on("stopReaderCardTwo", stopRead);
}
// 借还机那种刷卡器
//开始阅读IC卡
function startRead(event, args) {
  console.log("start read IC Card");
  if (mainDevice == null) {
    event.returnValue = 601;
    return;
  }
  let payload = {
    driver: getRFIDDriverPath(),
    type: "IC",
    changed(data) {
      console.log(data,'data');
      event.sender.send("readCardF750", data);
    },
  };
  let readIC = mainDevice.startRead(payload, true);
  console.log("readIC", readIC);
  event.returnValue = true;
}
//停止阅读IC卡
function stopRead(event, args) {
  console.log("stop read IC Card");
  if (mainDevice == null) {
    event.returnValue = 601;
    return;
  }
  mainDevice.stopRead(null, true);
  event.returnValue = true;
}
module.exports = {
  init,
};
