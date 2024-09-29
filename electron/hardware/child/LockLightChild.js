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
    mainDevice = getDevice("lockAndLight", dllPath);
  }
  //灯控连接
  if (msg.event == "connectLight") {
    let result = mainDevice.connectLight(null, false);
    console.log("connectLight--------", result);
  }
  //断开灯控连接
  if (msg.event == "closeConnectLight") {
    mainDevice.closeLight(null, true);
  }
  //开灯
  if (msg.event == "openLight") {
    let result = mainDevice.open(null, true);
    console.log("openLight----------", result);
  }
  //关灯
  if (msg.event == "closeLight") {
    mainDevice.close(null, true);
  }
  //开紫外线灯
  if (msg.event == "openZYX") {
    let openZYX = mainDevice.openZYX(null, true);
    console.log(openZYX,'------openZYX');
    process.send({ mainName: "openZYX", returnData: openZYX });
  }
  //关紫外线灯
  if (msg.event == "closeZYX") {
    let closeZYX = mainDevice.closeZYX(null, true);
    process.send({ mainName: "closeZYX", returnData: closeZYX });
  }
});
