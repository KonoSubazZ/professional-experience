//RFID 标签阅读器
import { ipcMain } from "electron";
import path from "path";
import DeviceHelper from "../HardwareHelper";
var fork = require("child_process").fork;
let deviceDefine = null,
  mainWindow = null,
  mainDevice = null,
  applicationConfig = null;
let rfidMap = {};
let deviceState = {};
let applicationType = "";

const methodArr = ["enableEAS", "disableEAS", "writeAFI"];
// 第一步代码
class LRUCache {
  constructor(n) {
    this.size = n; // 初始化最大缓存数据条数n
    this.data = new Map(); // 初始化缓存空间map
  }
  // 第二步代码
  put(domain, info) {
    if (this.data.size >= this.size) {
      // 删除最不常用数据
      const firstKey = [...this.data.keys()][0]; // 次数不必当心data为空，因为this.size 一般不会取0，满足this.data.size >= this.size时，this.data自然也不为空。
      this.data.delete(firstKey);
    }
    this.data.set(domain, info); // 写入数据
  }

  // 第三步代码
  get(domain) {
    if (!this.data.has(domain)) {
      return false;
    }
    const info = this.data.get(domain);
    console.log(info, "第三步代码");
    //获取结果
    if (Date.now() - info > 3000) {
      this.data.delete(domain); // 移除数据
    }
    // this.data.set(domain, info); // 重新添加该数据
    return info;
  }
}
var child = fork(path.resolve(__dirname, "./readerchange.mjs"));
var dstpath = DeviceHelper.getDllPathchange();

function init(win, device, config, appType) {
  child.send({ dstpath: dstpath });
  child.send({ config: config, device: device, appType: appType });
  deviceDefine = device;
  mainWindow = win;
  applicationType = appType;
  applicationConfig = config;
  ipcMain.on("openRFIDReader", open);
  ipcMain.on("inventoryRFIDReader", inventory);
  ipcMain.on("stopInventoryRFIDReader", stopInventory);
  ipcMain.on("closeRFIDReader", close);
  ipcMain.on("bookCheckOut", checkOut);
  ipcMain.on("bookCheckIn", checkIn);
  ipcMain.on("writeRFIDReaderMulti", writeMulti);
  ipcMain.on("readTagData", readTagData);
  ipcMain.on("readGateData", readGateData);
  ipcMain.on("getSystemInfo", getSystemInfo);
  ipcMain.on("wordWirte", wordWirte);
  ipcMain.on("writeDSFID", function(event, data) {
    console.log(data, "changdatachangdata");
    child.send({ hfdata: data });
    event.returnValue = true;
  });
  if (!applicationType && !applicationConfig.ip) {
    methodArr.map((item) => {
      ipcMain.on(item, function(event, data) {
        child.send({ [item]: data });
        event.returnValue = true;
      });
    });
  }

  applicationType &&
    methodArr.map((item) => {
      ipcMain.on(item, function(event, data) {
      
        if (typeof data == "string") {
          !isUHF() && child.send({ [item]: data });
        } else {
          !isUHF() && child.send({ [item]: data.UID });
          if (isUHF()) {
            child.send({ uhfdata: data });
          }
        }
        event.returnValue = true;
      });
    });

  var type;
  if (applicationConfig.boards == "LR601") {
    type = "LrReader";
  } else if (applicationConfig.boards == "RRU9880") {
    type = "RrUHFReader";
  } else {
    type = applicationConfig.boardsType;
  }
  // 灵瑞高频LR601需要掉两次open方法才可以启动盘点
  mainDevice = DeviceHelper.getDevice(type);
  open({}, {});
  if (applicationConfig.boards == "LR601") {
    open({}, {});
  }
}
function open(event, args) {
  console.log('open进来这里了');
  child.send({ openRFIDReader: "openRFIDReader" });
  child.once("message", (msg) => {
    console.log(msg,'---msg');
    if (msg.mainName == "openRFIDReader") {
      event.returnValue = msg.returnData;
    }
  });

}
function wordWirte(event, data) {
  DeviceHelper.getDevice("BuildUHFTag").gaoxiaoWrite(
    {
      pii: data.result.PII,
      OwnerName: data.result.OI || "",
      typeName: data.result.TU || "",
      isInHome: data.isInHome,
    },
    function(error, result) {
      console.log("write", err, result);
      // result就是转码之后的值
      if (result) {
        workstationWriteEPC(data.UID, result.EpcBank).then((res) => {
          let msg = res;
          event.returnValue = msg;
        });
      }
    }
  );
}

const cache = new LRUCache(10);

function writeEPC(epcStr, writeData) {
  if (applicationConfig.boards == "RRU9880") {
    mainDevice.writeEPC(
      {
        epcStr,
        writeData: writeData,
      },
      function(err, res) {}
    );
  } else {
    mainDevice.writeEPC(
      {
        epcStr,
        Word: writeData,
      },
      function(err, res) {
        console.log(res);
      }
    );
  }
}

function readGateData(event, data) {
  mainDevice.readGateData(data, function(error, result) {
    sendMessage("onRealGateTag", { result, UID: data });
  });
  event.returnValue = true;
}

function getSystemInfo(event, args) {
  mainDevice.getSystemInfo &&
    mainDevice.getSystemInfo(getRealTag(args), function(error, result) {
      // console.log("getSystemInfo", result)
      sendMessage("onRealTagInfo", result);
    });

  event.returnValue = true;
}

function workstationWriteEPC(epcStr, Word) {
  return new Promise((resolve, reject) => {
    mainDevice.writeEPC(
      {
        epcStr,
        Word,
      },
      function(err, res) {
        let msg = { err, res };
        resolve(msg);
      }
    );
  });
}
child.on("message", (message) => {
  if(message.mainName!=='openRFIDReader'){
    sendMessage(
      Object.keys(message)[0],
      JSON.parse(message[Object.keys(message)[0]])
    );
  }
});
function writeUSER(epcStr, Word) {
  console.log("超高频读取user区");
  return new Promise((resolve, reject) => {
    mainDevice.writeUSER(
      {
        epcStr,
        Word: Word.UserBank,
      },
      function(err, res) {
        let msg = { err, res };
        workstationWriteEPC(epcStr, Word.EpcBank)
          .then((resEpc) => {
            if (resEpc.res === 0 && res === 0) {
              resolve(msg);
            } else {
              resolve((msg = { err, res: -1 }));
            }
          })
          .catch((Error) => {
            console.log(Error, "sdhjvfbchkdsbvfklhjsd");
          });
      }
    );
  });
}

// 高频/超高频编码
function writeMulti(event, data) {
  const { rfid, barCode, OwnerName, TU, ztlx: mediaFormat } = data;
  // 先转码
  let msg;
  if (!isUHF()) {
    DeviceHelper.getDevice("write").write(
      {
        pii: barCode,
        OwnerName: OwnerName || "",
        typeName: TU || "",
        mediaFormat,
      },
      function(error, result) {
        // result就是转码之后的值
        let len = parseInt(result.length / 8) + 1;
        mainDevice.writeMulti(
          { rfid, barCode: result.padEnd(len * 8, 0) },
          function(err, res) {
            msg = { err, res };
            event.returnValue = msg;
          }
        );
      }
    );
  } else {
    let TUsarr = TU ? TU.split("") : "";
    TUsarr != "" && TUsarr.splice(1, 0, ".");
    let Tus = TUsarr != "" ? TUsarr.join("") : "";
    DeviceHelper.getDevice("BuildUHFTag").gaoxiaoWrite(
      {
        pii: barCode,
        OwnerName: OwnerName || "",
        typeName: Tus,
        isInHome: true,
      },
      function(err, result) {
        // result就是转码之后的值
        if (result) {
          console.log("写入user区数据");
          writeUSER(rfid, result).then((res) => {
            msg = res;
            event.returnValue = msg;
          });
        }
      }
    );
  }
  // event.returnValue = true;
}
//打开设备

function epcUserPromise(data) {
  console.log(data, "epcepcepcepcepcepcepcepcepc");
  if (applicationConfig.radioone == "true") {
    return Promise.all([
      new Promise((resolve, reject) => {
        mainDevice.readEPC(
          {
            epcStr: data,
            WordCnt: parseInt((data.length - 8) / 4),
          },
          function(err, res) {
            resolve(res);
          }
        );
      }),
      new Promise((resolve, reject) => {
        mainDevice.readUSER(
          {
            epcStr: data,
          },
          function(err, res) {
            resolve(res);
          }
        );
      }),
    ]).catch((error) => {});
  } else {
    return Promise.all([
      new Promise((resolve, reject) => {
        mainDevice.readEPC(
          {
            epcStr: data,
            WordCnt: parseInt((data.length - 8) / 4),
          },
          function(err, res) {
            resolve(res, err);
          }
        );
      }),
      new Promise((resolve, reject) => {
        resolve(null);
      }),
    ]);
  }
}
function epcuser(data) {
  return Promise.all([
    new Promise((resolve, reject) => {
      if (applicationConfig.radioone == "true") {
        mainDevice.readUSER(
          {
            epcStr: data,
          },
          function(err, res) {
            resolve({ lfg: data, age: res.data });
          }
        );
      } else {
        resolve({ lfg: data, age: null });
      }
    }),
  ]).catch((error) => {});
}
//阅读标签
function inventory(event, args) {
  child.send({ inventoryRFIDReader: "inventoryRFIDReader" });
  event.returnValue = true;
}
var change = [];
var a = 0;
var changfor = "";

// function inventorychangeone() {
//   mainDevice.inventory({
//     changed(data) {
//       if (applicationType) {
//         if (applicationConfig.radiotwo == "true") {
//           change.unshift(data);
//           a++;
//           if (data.code != "-1") {
//             if (a == 1) {
//               mainDevice.readerBlockDataDecode(
//                 { uid: data.UidList[0] },
//                 function(error, result) {
//                   const reschange = result.blockDataDecode;
//                   if (reschange && reschange.split) {
//                     const [tag] = reschange.split(",");
//                     changfor = tag;
//                     onRFIDTag(tag, data.UidList[0]);
//                   }
//                 }
//               );
//               // DeviceHelper.getDevice(applicationConfig.boardsType).readTagData(data.UidList[0],
//               //     function (error, result) {
//               //         const reschange = result
//               //         if (reschange && reschange.split) {
//               //             const [tag,] = reschange.split(',')
//               //             changfor = tag
//               //             onRFIDTag(tag, data.UidList[0])
//               //         }
//               //     })
//             } else if (a >= 2) {
//               if (change[0].UidList[0] == change[1].UidList[0]) {
//                 onRFIDTag(changfor, data.UidList[0]);
//               } else if (change[1].UidList[0] != change[0].UidList[0]) {
//                 !isUHF() &&
//                   mainDevice.readerBlockDataDecode(
//                     { uid: data.UidList[0] },
//                     function(error, result) {
//                       const reschange = result.blockDataDecode;
//                       if (reschange && reschange.split) {
//                         const [tag] = reschange.split(",");
//                         changfor = tag;
//                         onRFIDTag(tag, data.UidList[0]);
//                       }
//                     }
//                   );
//               }
//             }
//           }
//         } else {
//           onRFIDTag(data.UidList[0], data.UidList[0]);
//         }
//       } else {
//         onRFIDTag(data.UidList[0]);
//       }
//     },
//   });
// }
// function inventorychangetwo() {
//   let openResult = mainDevice.inventory({
//     changed(data) {
//       console.log(data, "1111111111");
//       if (applicationType) {
//         if (applicationConfig.radiotwo == "true") {
//           !isUHF() &&
//             mainDevice.readTagData(data, function(error, result) {
//               if (result && result.split) {
//                 const [, tag] = result.split(",");
//                 onRFIDTag(tag, data);
//               }
//             });
//           isUHF() && readTagData({}, data, onRFIDTag); //超高频第一步
//         } else {
//           if (applicationConfig.boards == "RRU9880") {
//             isUHF() && onRFIDTag(data[1][1], data);
//           } else {
//             isUHF() && onRFIDTag(data.TID, data);
//           }
//           !isUHF() && onRFIDTag(data, data);
//         }
//       } else {
//         if (applicationConfig.boards == "RRU9880") {
//           onRFIDTag({ EPCStr: data[0][1], TID: data[1][1] });
//         } else {
//           onRFIDTag(data);
//         }
//       }
//     },
//   });
// }
function readTagData(event, data, callBack) {
  //超高频读取第一步
  if (applicationConfig.boards == "RRU9880") {
    isUHF() &&
      epcuser(data[0][1]).then((res) => {
        const obj = { ...res };
        DeviceHelper.getDevice("ParseUHFTag").gaoxiaoRead(
          {
            EpcBank: obj[0].lfg,
            UserBank: null,
          },
          function(err, result) {
            console.log(result, "sdbfvlusbdfvjdisbfvcldsbfv");
            if (err) return;
            if (callBack) {
              callBack(result.PII, data, result);
            } else {
              if (!cache.get(data[1][1])) {
                cache.put(data[1][1], Date.now());
                sendMessage("onRealTag", { result, UID: data[1][1] });
              }
            }
          }
        );
      });
  } else {
    isUHF() &&
      epcUserPromise(data.EPCStr).then((res) => {
        const [epc, user] = res || "";
        console.log(epc, user);
        DeviceHelper.getDevice("ParseUHFTag").gaoxiaoRead(
          {
            EpcBank: epc,
            UserBank: user,
          },
          function(err, result) {
            // 编码后的值
            console.log(err, result);
            if (err) return;
            if (callBack) {
              callBack(result.PII, data, result);
            } else {
              if (!cache.get(data.TID)) {
                cache.put(data.TID, Date.now());
                sendMessage("onRealTag", { result, UID: data.TID });
              }
            }
          }
        );
      });
  }
  !isUHF() &&
    mainDevice.readTagData(data, function(error, result) {
      sendMessage("onRealTag", { result, UID: data });
    });
  event.returnValue = true;
}

//停止阅读
function stopInventory(event, args) {
  child.send({ stopInventory: "stopInventory" });
  deviceState.inventory = false;
  event.returnValue = true;
}

//归还
function checkIn(event, args) {
  let result = mainDevice.checkIn(getRealTag(args), true);
  event.returnValue = true;
}

//借出
function checkOut(event, args) {
  let result = mainDevice.checkOut(getRealTag(args), true);
  event.returnValue = true;
}
//设置为层架
function bindShelf(event, args) {
  mainDevice.bindShelf(getRealTag(args), true);
  event.returnValue = true;
}

//关闭
function close(event, args) {
  mainDevice.close(null, true);
  stopRFIDTimeout();
  event.returnValue = true;
}

//像页面发送数据
function sendMessage(eventType, data) {
  mainWindow.webContents.send(eventType, data);
}

//标签的回调

function onRFIDTag(data, UID, result) {
  //超高频读取第三步
  console.log(data, UID, result);
  if (!applicationType) {
    rfidList = [];
  }
  let tag = data;
  if (isUHF()) {
    let epc = applicationType ? data.substring(12) : data;
    rfidMap[epc] = data;
  }
  let item = rfidList.filter((it) => {
    return it.tag === tag;
  });
  let timeout = new Date().getTime() + 5000;
  if (item && item.length) {
    item.timeout = timeout;
  } else {
    item = { tag: tag, timeout: timeout, UID, result };
    rfidList.push(item);
  }

  sendMessage("onTag", rfidList);
}
function onRFIDTagchange(data, UID, result) {
  //超高频读取第三步
  console.log(data, UID, result);
  if (!applicationType) {
    rfidList = [];
  }
  let tag = data;
  if (isUHF()) {
    let epc = applicationType ? data.substring(12) : data;
    rfidMap[epc] = data;
  }
  let item = rfidList.filter((it) => {
    return it.tag === tag;
  });
  let timeout = new Date().getTime() + 5000;
  if (item && item.length) {
    item.timeout = timeout;
  } else {
    item = { tag: tag, timeout: timeout, UID, result };
    rfidList.push(item);
  }
  if (rfidList.length >= 2) {
    rfidList.shift();
  }

  if (rfidList.length >= 2) {
    rfidList.shift();
  }
  mainWindow.webContents.send("setNewDatachange", rfidList);
}
let interval = null;

//对标签进行过期
function startRFIDTimeout() {
  interval = setInterval(() => {
    let now = new Date().getTime();
    let previousLength = rfidList.length;
    rfidList = rfidList.filter((it) => {
      return it.timeout > now;
    }, 5000);
    if (previousLength !== rfidList.length) {
      sendMessage("onTag", rfidList);
    }
  });
}

//停止定时任务
function stopRFIDTimeout() {
  if (interval) {
    clearInterval(interval);
  }
}

let rfidList = [];

//获取实际的标签
function getRealTag(tag) {
  if (isUHF()) {
    return rfidMap[tag];
  }
  return tag;
}

//是否是超高频
function isUHF() {
  return applicationConfig && applicationConfig.rfidType === "uhf";
}
//RFID读卡器
export default {
  init(win, deviceDefine, applicationType, config) {
    init(win, deviceDefine, applicationType, config);
  },
  //阅读板
  pad: {
    hf: {
      type: "rfid",
      params: {
        type: "USB",
      },
    },
    uhf: {
      type: "uhfRFID",
      params: {
        type: "USB",
      },
    },
  },
  //嵌入式阅读版
  embedded: {
    hf: {
      type: "rfid",
      params: {
        type: "COM",
      },
    },
    uhf: {
      type: "uhfRFID",
      params: {
        type: "COM",
      },
    },
  },
};
