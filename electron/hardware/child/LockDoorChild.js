// 锁控的子进程
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
  //锁控连接
  if (msg.event == "connectLock") {
    mainDevice.connectLock(null, true);
  }
  //单个开锁
  if (msg.event == "openLock") {
    console.log("单个开锁", msg.data);
    let latticeNo = null; //格子编号
    let boradId = ""; //第几组柜子
    if (Number(msg.data) > 8 && Number(msg.data) <= 16) {
      latticeNo = Number(msg.data) - 8;
      boradId = "2";
    } else if (Number(msg.data) > 16) {
      latticeNo = Number(msg.data) - 16;
      boradId = "3";
    } else {
      latticeNo = msg.data;
      boradId = "1";
    }
    let aa = mainDevice.openLock(
      {
        boradIdStr: boradId, //一组所有格子是1
        lockIndexStr: String(latticeNo), //格子编号
      },
      true
    );
  }
  //开所有锁
  if (msg.event == "openAllLock") {
    console.log(msg, "----openAllLockmsg----");
    console.log(msg.data, "----openAllLockdata----");
    let { boradNum, lockNum } = msg.data;
    let resData = mainDevice.openAllLock(
      {
        boradNum,
        lockNum,
      },
      true
    );
    console.log(resData,'-----resData');
    process.send({ mainName: "openAllLock", returnData: resData });
  }
  //获取锁状态
  if (msg.event == "getLockState") {
    console.log("getLockState", msg.data);
    let latticeNo = null; //格子编号
    let boradId = ""; //第几组柜子
    if (Number(msg.data) > 8 && Number(msg.data) <= 16) {
      latticeNo = Number(msg.data) - 8;
      boradId = "2";
    } else if (Number(msg.data) > 16) {
      latticeNo = Number(msg.data) - 16;
      boradId = "3";
    } else {
      latticeNo = msg.data;
      boradId = "1";
    }
    mainDevice.getLockState(
      {
        boradIdStr: boradId, //一组所有格子是1
        lockIndexStr: String(latticeNo), //格子编号
      },
      function (err, res) {
        console.log(5555, res);
        process.send({ mainName: "getLockState", returnData: res });
      }
    );
  }
  //断开锁连接
  if (msg.event == "closeLock") {
    mainDevice.closeLock(null, true);
  }
});
