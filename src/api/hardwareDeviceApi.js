const { ipcRenderer } = require("electron");
function open(setting) {
  return ipcRenderer.sendSync("openConnect", setting); //连接
}
function inventory(data) {
  return ipcRenderer.sendSync("inventory", data); //实时循环盘点
}
/**
 * 
 * @param {*} data 单格盘点的图书 
 * @returns 
 */
function inventoryOne(data) {
  return ipcRenderer.sendSync("inventoryOne", data); //单格盘点
}
function stopInventory() {
  return ipcRenderer.send("stopInventory"); //停止盘点
}
function writeMulti(data) {
  return ipcRenderer.sendSync("writeMulti", data); //写入DataBlock数据
}
function enableEAS() {
  return ipcRenderer.sendSync("enableEAS"); //开启EAS
}
function disableEAS() {
  return ipcRenderer.sendSync("disableEAS"); //关闭EAS
}
function writeAFI(data) {
  return ipcRenderer.sendSync("writeAFI", data); //写入AFI
}
function close() {
  return ipcRenderer.send("closeConnect"); //关闭连接
}
function openReadCard() {
  return ipcRenderer.send("openReadCard"); //连接读者卡
}
function closeReadCard() {
  return ipcRenderer.send("closeReadCard"); //断开连接读者卡
}
function inventoryReadCard() {
  return ipcRenderer.send("inventoryReadCard"); //开始盘点读者卡
}
function stopReadCard() {
  return ipcRenderer.send("stopReadCard"); //停止盘点读者卡
}

function connectLock() {
  return ipcRenderer.send("connectLock"); //锁控连接
}
function openLock(data) {
  return ipcRenderer.send("openLock", data); //单个开锁
}
function openAllLock(data) {
  return ipcRenderer.send("openAllLock", data); //开所有锁
}
function getLockState(data) {
  return ipcRenderer.sendSync("getLockState", data); //获取锁状态
}

function closeLock() {
  return ipcRenderer.send("closeLock"); //断开锁连接
}
function connectLight() {
  return ipcRenderer.send("connectLight"); //灯控连接
}
function closeConnectLight() {
  return ipcRenderer.send("closeConnectLight"); //断开灯控连接
}
function openLight() {
  return ipcRenderer.send("openLight"); //开灯
}
function closeLight() {
  return ipcRenderer.send("closeLight"); //关灯
}
function openZYX() {
  console.log("开启紫外线灯");
  return ipcRenderer.sendSync("openZYX"); //开紫外线灯
}
function closeZYX() {
  console.log("关闭紫外线灯");
  return ipcRenderer.sendSync("closeZYX"); //关紫外线灯
}

// 新增借还机的读卡方法
function readReaderCardTwo() {
  return ipcRenderer.sendSync("readReaderCardTwo"); //开始读卡
}
function stopReaderCardTwo() {
  return ipcRenderer.sendSync("stopReaderCardTwo"); //停止读卡
}


export default {
  init() {
    let value = {
      open,
      close,
      inventory,
      inventoryOne,
      stopInventory,
      writeMulti,
      enableEAS,
      disableEAS,
      writeAFI,
      openReadCard,
      closeReadCard,
      inventoryReadCard,
      stopReadCard,
      connectLock,
      openLock,
      openAllLock,
      getLockState,
      closeLock,
      connectLight,
      closeConnectLight,
      openLight,
      closeLight,
      openZYX,
      closeZYX,
      readReaderCardTwo,
      stopReaderCardTwo,
    };
    window.blueDevice = value;
    return value;
  },
};
