/**
 * 盘点的子进程
 */

// electron-edge-js 是一个 Node.js 模块，它允许在 Electron 应用程序中使用 .NET 代码，
// 并在 Electron 和 .NET 之间进行交互。它提供了一种跨语言调用的方式，可以让你在 Electron 应用中调用 .NET 程序集或代码。
// 这里我认为是在调用dll方法
const edge = require("electron-edge-js");
let mainDevice = {};
let dllPath;
function getDevice(type, dllPath) {
  let sdkPath = dllPath + "BookCaseSDK.dll";
  let item = edge.func({
    assemblyFile: sdkPath,
    typeName: "BluewhaleSDK.SdkEntry",
    methodName: type,
  });
  return item(null, true);
}
process.on("message", (msg) => {
  if (msg.event == "getDllPath") {
    dllPath = msg.getDllPath;
    mainDevice = getDevice("bookcaserfid", dllPath);
    // ------------------下面是要连接盘点了
  }
  //开启柜子连接
  if (msg.event == "open") {
    let openStatus = mainDevice.open(
      {
        driver: dllPath + "drivers\\",
        // type: "NET",
        type: "COM",
        RDType: "RD5200",
        IP: msg.rfidIP,
      },
      true
    );
    console.log(openStatus,'=====opendata=0=RFID===',new Date());
    process.send({ mainName: "open", returnData: openStatus });
  }
  //单格盘点
  if (msg.event == "inventoryOne") {
    mainDevice.inventoryOne(
      { antennaId: String(msg.antennaId) },
      function (err, res) {
        // 单格盘点回调
        if (res) {
          let arr = [];   
          res.forEach((it) => {
            getDevice("HFDecode", dllPath).read(
              it.DataBlocks,
              function (error, result) {
                if (result && result.split) {
                  const PII = result.split(",")[0];
                  arr.push({ PII });
                }
              }
            );
          });
          
          console.log(arr,'=====inventoryOne=DATA====',new Date())
          process.send({ mainName: "inventoryOne", returnData: arr });
        }
      }
    );
  }

  // 盘点所有格子
  if (msg.event == "inventory") {
    // ----现在的
    mainDevice.inventoryOne(
      { antennaId: String(msg.antennaId) },
      function (err, res) {
        if (res) {
          let arr = [];   
          res.forEach((it) => {
            getDevice("HFDecode", dllPath).read(
              it.DataBlocks,
              function (error, result) {
                if (result && result.split) {
                  console.log(result,"=====inventory==result=====",new Date())
                  const PII = result.split(",")[0];
                  arr.push({ PII,id:msg.antennaId});
                }
              }
            );
          });
          process.send({ mainName: "inventory", returnData: arr });
        }
      }
    );
    // ----------
    //实时盘点---以前的
    // mainDevice.inventory({
    //   changed(data) {
    //     console.log(data,'---data');
    //     //解码
    //     let arr = [];
    //     data.forEach((it) => {
    //       getDevice("HFDecode", dllPath).read(
    //         it.DataBlocks,
    //         function (error, result) {
    //           if (result && result.split) {
    //             const PII = result.split(",")[0];
    //             arr.push({ PII });
    //           }
    //         }
    //       );
    //     });
    //     process.send({ mainName: "inventory", returnData: arr });
    //   },
    // });
  }
  //停止盘点
  if (msg.event == "stopInventory") {
    mainDevice.stopInventory(null, true);
  }
  //关闭连接柜子
  if (msg.event == "close") {
    mainDevice.close(null, true);
  }
});
