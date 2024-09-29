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
  }
  //打开连接读者卡
  if (msg.event == "openReadCard") {
    mainDevice.openReadCard(
      {
        driver: dllPath + "drivers\\",
      },
      false
    );
  }
  //断开连接
  if (msg.event == "closeReadCard") {
    mainDevice.closeReadCard(null, true);
  }
  //开始盘点
  if (msg.event == "inventoryReadCard") {
    mainDevice.inventoryReadCard({
      changed(data) {
        if (data && data.UID) {
          process.send({ mainName: "inventoryReadCard", returnData: data.UID });
        }
      },
    });
  }
  //停止盘点
  if (msg.event == "stopReadCard") {
    mainDevice.stopReadCard(null, true);
  }
});
