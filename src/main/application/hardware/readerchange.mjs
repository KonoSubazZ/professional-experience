// const edge = require("electron-edge-js");

let dllRelativePath =
  (process.env.NODE_ENV == "development" ? "\\" : "") +
  "extraResources\\modules\\";
let deviceStore = {};
function isDev() {
  return process.env.NODE_ENV === "development";
}
//获取主BlueWhaleSDK.dll的目录
var type;
var dstpath;
process.on("message", (data) => {
  console.log(data, "子进程接受的数据");
  if(data.openRFIDReader){
    open({},{})
  }
  // console.log(Object.keys(data), "根绝key进行判断");
  if (Object.keys(data)[0] == "config") {
    init(
      data[Object.keys(data)[0]],
      data[Object.keys(data)[1]],
      data[Object.keys(data)[2]]
    );
  } else if (Object.keys(data)[0] == "dstpath") {
    dstpath = data[Object.keys(data)[0]];
  } else if (Object.keys(data)[0] == "inventoryRFIDReader") {
    inventory();
  } else if (Object.keys(data)[0] == "stopInventory") {
    stopInventory();
  } else if (Object.keys(data)[0] == "uhfdata") {
    uhfchange(data[Object.keys(data)[0]]);
  } else if (Object.keys(data)[0] == "hfdata") {
    hfchange(data[Object.keys(data)[0]]);
  } else if (
    Object.keys(data)[0] == "enableEAS" ||
    Object.keys(data)[0] == "disableEAS" ||
    Object.keys(data)[0] == "writeAFI"
  ) {
    if (!applicationType && !applicationConfig.ip) {
      hfchangezero(Object.keys(data)[0], data[Object.keys(data)[0]]);
    }
    hfchangeone(Object.keys(data)[0], data[Object.keys(data)[0]]);
  }
});
//获取RFID标签driver的目录
function getRFIDDriverPath() {
  return dstpath + "drivers\\";
}
//获取一个硬件实例
function getDevice(type) {
  return;
  let device = deviceStore[type];
  //已存在直接返回
  if (device) {
    console.log(device);
    return device;
  }
  //初始化
  let sdkPath = dstpath + "BlueWhaleSDK.dll";
  let item = edge.func({
    assemblyFile: sdkPath,
    typeName: "BluewhaleSDK.SdkEntry",
    methodName: type,
  });

  device = item(null, true);
  deviceStore[type] = device;
  return device;
}

let deviceDefine = null,
  mainWindow = null,
  mainDevice = null,
  applicationConfig = null;
var type;
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
      const firstKey = [...this.data.keys()][0];
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
    return info;
  }
}

function init(config, device, appType) {
  deviceDefine = device;

  applicationType = appType;
  applicationConfig = config;

  if (applicationConfig.boards == "LR601") {
    type = "LrReader";
  } else if (applicationConfig.boards == "RRU9880") {
    type = "RrUHFReader";
  } else {
    type = applicationConfig.boardsType;
  }

  // 灵瑞高频LR601需要掉两次open方法才可以启动盘点
  mainDevice = getDevice(type);
  console.log(mainDevice);
  open({}, {});
  if (applicationConfig.boards == "LR601") {
    open({}, {});
  }
}
function hfchangeone(item, data) {
  console.log(data,'------------data');
  console.log(item,'------------item');
  if (typeof data == "string") {
    !isUHF() && mainDevice[item](data);
  } else {
    if (applicationConfig.boards == "LR601") {
      !isUHF() && mainDevice[item](data.UID);

      if (item == "enableEAS") {
        !isUHF() &&
          mainDevice.writeAFI({ uid: data.UID, AFI: "07" }, function(
            error2,
            result2
          ) {
            if (error2 == undefined) {
              console.log(result2);
            } else {
              console.log(error2);
            }
          });
      } else {
        console.log(data);
        !isUHF() &&
          mainDevice.writeAFI({ uid: data.UID, AFI: "194" }, function(
            error1,
            result1
          ) {
            if (error1 == undefined) {
              console.log(result1);
            } else {
              console.log(error1);
            }
          });
      }
    } else {
      !isUHF() && mainDevice[item](data.UID);
    }
  }
}
function hfchangezero(item, data) {
  if (typeof data == "string") {
    !isUHF() && mainDevice[item](data, function(error, result) {});
  } else {
    !isUHF() &&
      mainDevice[item](item === "writeAFI" ? data : data.UID, function(
        error,
        result
      ) {
        console.log(error, result);
      });
  }
}
function hfchange(data) {
  console.log(data,'----------------data');
  console.log(applicationConfig,'----------------applicationConfig');
  if (applicationConfig.boards == "LR601") {
    !isUHF() &&
      mainDevice.writeDSFID({ uid: data.rfid, DSFID: data.DSFID }, function( error, result) {});
  } else {
   if(applicationConfig.rfidType=='hf'){
    console.log('走了这里了',data.AFI);
    mainDevice.writeDSFID(data, function(error, result) {console.log(error,result);});
    if(data.AFI=='194'){
      mainDevice.disableEAS(data.rfid)
    }else if(data.AFI=='07'){
      console.log('走了这里');
      mainDevice.enableEAS(data.rfid)
    }
   }
  }
}
function uhfchange(data) {
  var handchange = {};
  if (applicationConfig.radioone == "false") {
    handchange = {
      pii: data.result.PII,
      OwnerName: "00000",
      typeName: "0.0",
      isInHome: data.isInHome,
    };
  } else {
    handchange = {
      pii: data.result.PII,
      OwnerName: data.result.OI,
      typeName: data.result.TU,
      isInHome: data.isInHome,
    };
  }
  getDevice("BuildUHFTag").gaoxiaoWrite(handchange, function(err, result) {
    if (result) {
      if (applicationConfig.boards == "RRU9880") {
        writeEPC(data.UID[0][1], result.EpcBank);
      } else {
        writeEPC(data.UID.EPCStr, result.EpcBank);
      }
    }
  });
}
function wordWirte(event, data) {
  getDevice("BuildUHFTag").gaoxiaoWrite(
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
function readTID(event, data) {
  let res = mainDevice.readTID(
    {
      epcStr: data[0].tag,
    },
    true
  );
  event.returnValue = res;
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

// function readGateData(event, data) {
//   mainDevice.readGateData(data, function(error, result) {
//     sendMessage("onRealGateTag", { result, UID: data });
//   });
//   event.returnValue = true;
// }

// function getSystemInfo(event, args) {
//   mainDevice.getSystemInfo &&
//     mainDevice.getSystemInfo(getRealTag(args), function(error, result) {
//       sendMessage("onRealTagInfo", result);
//     });

//   event.returnValue = true;
// }

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

function writeUSER(epcStr, Word) {
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
          .catch((Error) => {});
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
    getDevice("write").write(
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
    getDevice("BuildUHFTag").gaoxiaoWrite(
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
function open(event, args) {
  console.log('open近来了');
  let open = mainDevice.open(
    {
      driver: getRFIDDriverPath(),
      ...deviceDefine.params,
      RDType: applicationConfig.boards,
    },
    true
  );
    console.log(open,'---open');
  deviceState.open = true;
  event.returnValue = true;
  process.send({ mainName: "openRFIDReader", returnData: open })
}

function epcUserPromise(data) {
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
            resolve(res);
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
  try {
    if (deviceState.inventory) {
      // event.returnValue = true;
      return;
    }

    if (applicationConfig.boards == "LR601") {
      inventorychangeone();
    } else {
      inventorychangetwo();
    }
    deviceState.inventory = true;
    if (applicationType) {
      startRFIDTimeout();
    }
  } catch (e) {
    stopRFIDTimeout();
  }
  // event.returnValue = true;
}
var change = [];
var a = 0;
var changfor = "";

function inventorychangeone() {
  mainDevice.inventory({
    changed(data) {
      if (applicationType) {
        if (applicationConfig.radiotwo == "true") {
          change.unshift(data);
          a++;
          if (data.code != "-1") {
            if (a == 1) {
              mainDevice.readerBlockDataDecode(
                { uid: data.UidList[0] },
                function(error, result) {
                  const reschange = result.blockDataDecode;
                  if (reschange && reschange.split) {
                    const [tag] = reschange.split(",");
                    changfor = tag;
                    onRFIDTag(tag, data.UidList[0]);
                  }
                }
              );
            } else if (a >= 2) {
              if (change[0].UidList[0] == change[1].UidList[0]) {
                onRFIDTag(changfor, data.UidList[0]);
              } else if (change[1].UidList[0] != change[0].UidList[0]) {
                !isUHF() &&
                  mainDevice.readerBlockDataDecode(
                    { uid: data.UidList[0] },
                    function(error, result) {
                      const reschange = result.blockDataDecode;
                      if (reschange && reschange.split) {
                        const [tag] = reschange.split(",");
                        changfor = tag;
                        onRFIDTag(tag, data.UidList[0]);
                      }
                    }
                  );
              }
            }
          }
        } else {
          onRFIDTag(data.UidList[0], data.UidList[0]);
        }
      } else {
        onRFIDTag(data.UidList[0]);
      }
    },
  });
}
function readTagData(event, data, callBack) {
  //超高频读取第一步

  if (applicationConfig.boards == "RRU9880") {
    isUHF() &&
      epcuser(data[0][1]).then((res) => {
        const obj = { ...res };
        getDevice("ParseUHFTag").gaoxiaoRead(
          {
            EpcBank: obj[0].lfg,
            UserBank: null,
          },
          function(err, result) {
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
        getDevice("ParseUHFTag").gaoxiaoRead(
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
function inventorychangetwo() {
  let openResult = mainDevice.inventory({
    changed(data) {
      if (applicationType) {
        if (applicationConfig.radiotwo == "true") {
          !isUHF() &&
            mainDevice.readTagData(data, function(error, result) {
              if (result && result.split) {
                const [, tag] = result.split(",");
                onRFIDTag(tag, data);
              }
            });
          isUHF() && readTagData({}, data, onRFIDTag); //超高频第一步
        } else {
          if (applicationConfig.boards == "RRU9880") {
            isUHF() && onRFIDTag(data[1][1], data);
          } else {
            isUHF() && onRFIDTag(data.TID, data);
          }
          !isUHF() && onRFIDTag(data, data);
        }
      } else {
        if (applicationConfig.boards == "RRU9880") {
          onRFIDTag({ EPCStr: data[0][1], TID: data[1][1] });
        } else {
          onRFIDTag(data);
        }
      }
    },
  });
}

//停止阅读
function stopInventory(event, args) {
  if (applicationConfig.boards == "RRU9880") {
    let openResult = mainDevice.stopInventoryMIX();
  } else {
    change = [];
    a = 0;
    changfor = "";
    let openResult = mainDevice.stopInventory(null, true);
  }
  stopRFIDTimeout();
  deviceState.inventory = false;
  console.log(event);
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

//关闭
function close(event, args) {
  mainDevice.close(null, true);
  stopRFIDTimeout();
  event.returnValue = true;
}

//像页面发送数据
function sendMessage(eventType, data) {
  var changedata = JSON.stringify(data);
  process.send({ [eventType]: changedata });
}

//标签的回调
const rfidMapData = new Map();
// 清理超时的标签数据
function cleanExpiredTags() {
  const now = Date.now();
  for (const tag of rfidMapData.keys()) {
    const item = rfidMapData.get(tag);
    if (item.timeout < now) {
      rfidMapData.delete(tag);
    }
  }
}
function onRFIDTag(data, UID, result) {
  console.log(data,'-datata');
  //超高频读取第三步
  if (!applicationType) {
    rfidList = [];
  }
  let tag = data;
  if (isUHF()) {
    let epc = applicationType ? data.substring(12) : data;
    rfidMap[epc] = data;
  }
  let item = rfidMapData.get(tag)
  // let item = rfidList.filter((it) => {
  //   return it.tag === tag;
  // });
  let timeout = Date.now() + 3000;
  if (item) {
    item.timeout = timeout;
  } else {
    item = { tag: tag, timeout: timeout, UID, result };
    rfidMapData.set(tag,item);
  }
  cleanExpiredTags()
  // TODO 这里什么时候会被清空
  rfidList = Array.from(rfidMapData.values());
  sendMessage("onTag", rfidList);
}
// function onRFIDTag(data, UID, result) {
//   //超高频读取第三步
//   console.log(data, UID, result);
//   if (!applicationType) {
//     rfidList = [];
//   }
//   let tag = data;
//   if (isUHF()) {
//     let epc = applicationType ? data.substring(12) : data;
//     rfidMap[epc] = data;
//   }
//   let item = rfidList.filter((it) => {
//     return it.tag === tag;
//   });
//   let timeout = new Date().getTime() + 5000;
//   if (item && item.length) {
//     item.timeout = timeout;
//   } else {
//     item = { tag: tag, timeout: timeout, UID, result };
//     rfidList.push(item);
//   }
//   console.log("onTag", rfidList);
//   sendMessage("onTag", rfidList);
// }
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
