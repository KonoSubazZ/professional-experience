import { otherInterface } from "@api/request.js";
/**
 * 读写版连接
 * @param {*} connectFunction
 * @param {*} maxAttempts
 * @returns boolean 是否连接成功
 */
const openRFIDReader = (connectFunction, maxAttempts) => {
  let isConnectedSuccess = false;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 0连接成功 -7连接失败
    const openStatus = connectFunction();
    console.log(openStatus, "==连接读写版状态==", new Date());
    if (openStatus === 0) {
      isConnectedSuccess = true;
      break;
    }
  }
  return isConnectedSuccess;
};

/**
 * 柜门开锁
 * @param {*} connectLockFn
 * @param {*} getLockState
 * @param {*} maxAttempts
 * @returns 是否开锁成功
 */
const openLock = (connectLockFn, getLockState, maxAttempts) => {
  let isOpened = false;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    connectLockFn();
    const res = getLockState();
    // 【锁板1-锁号1】状态:开 
    if (res?.includes("开")) {
      isOpened = true;
      break;
    }
  }
  return isOpened;
};

const inventory = (inventoryFn, MaxAttempts) => {
  /**
   * 盘点结果成功( 正确连上盘点天线 ) 盘点到的图书
   * [{PII:BW0000373, id: 1},{PII :BW0000517, id :1}]
   * 或没有数据[]
   *
   * 其余为盘点异常
   *
   * 还有一种情况是连接不到读写版和天线 会一直等待进程卡死
   */
  let inventoryRes = [];
  let isInventory = false; // 是否连接成功盘点器
  for (let attempt = 0; attempt < MaxAttempts; attempt++) {
    const res = inventoryFn();
    if (Array.isArray(res)) {
      inventoryRes = [...res];
      isInventory = true;
    }
  }
  return isInventory ? inventoryRes : isInventory;
};

/**
 * 设置柜门状态列表
 */
const setLatticeList = () => {
  const savedLatticeList = JSON.parse(
    window.localStorage.getItem("latticeList")
  );
  if (savedLatticeList?.length > 0) {
  } else {
    const latticeNumber = JSON.parse(
      window.localStorage.getItem("latticeNumber")
    );
    const savedLatticeList = [];
    for (let i = 0; i < latticeNumber; i++) {
      savedLatticeList.push({ id: i + 1, name: `柜门${i + 1}`, locked: false });
      window.localStorage.setItem(
        "latticeList",
        JSON.stringify(savedLatticeList)
      );
    }
  }
};

/**
 * 开锁异常,锁定单个柜门
 * @param {*} latticeItemId
 */
const setLatticeItemLocked = (latticeItemId) => {
  const savedLatticeList = JSON.parse(
    window.localStorage.getItem("latticeList")
  );
  const updatedLatticeList = savedLatticeList.map((item) => {
    if (Number(latticeItemId) === item.id) {
      return { ...item, locked: true };
    }
    return item;
  });
  localStorage.setItem("latticeList", JSON.stringify(updatedLatticeList));
};

/**
 * 校验柜门是否被锁定
 * @param {*} latticeNo
 * @returns
 */
const checklatticeNoLocked = (latticeNo) => {
  const latticeList = JSON.parse(localStorage.getItem("latticeList"));
  console.log(latticeNo, '--latticeNo--');
  const curLatticeItem = latticeList.find(
    (latticeItem) => latticeItem.id == latticeNo
  );
  console.log(curLatticeItem, 'curLatticeItem');
  return curLatticeItem?.locked;
};

/**
 * 异常发送短信
 * @param {*} caseId 柜子id
 * @param {*} latticeNo 格口号
 * @param {*} exceptionType 异常类型 0读写板 1开锁
 */
const sendExceptionSMSMAIL = (caseId, latticeNo = 1, exceptionType) => {
  console.log(
    "设备异常参数caseId:" +
    caseId +
    ",latticeNo:" +
    latticeNo +
    ",exceptionType:",
    +exceptionType,
    new Date()
  );
  console.log(
    "设备异常参数caseId:%s,latticeNo:%s,exceptionType:%s,异常时间:%s",
    caseId,
    latticeNo,
    exceptionType,
    new Date()
  );
  const params = {
    caseId,
    latticeNo,
  };

  otherInterface.sendMail(params);
  if (exceptionType == 0) {
    otherInterface.sendUnInventorySMS({
      caseId,
      readerName: "--",
      readerNumber: "--",
    });
  } else {
    otherInterface.sendUnlockedSMS(params);
  }
};

export {
  openRFIDReader,
  openLock,
  inventory,
  setLatticeList,
  setLatticeItemLocked,
  checklatticeNoLocked,
  sendExceptionSMSMAIL,
};
