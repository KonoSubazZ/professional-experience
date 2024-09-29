//发卡机
import {ipcMain} from "electron"
import DeviceHelper from "../HardwareHelper"

let deviceDefine = null, mainWindow = null, mainDevice = null
let test = false
let connectStatus = false

function init(win, device) {
    deviceDefine = device
    console.log('DeviceHelper',deviceDefine);
    mainWindow = win
    ipcMain.on("connectCardDeliver", connect)
    ipcMain.on("startCardDeliver", getCard)
    ipcMain.on("frontCardDeliver", moveCardToFront)
    mainDevice = DeviceHelper.getDevice(deviceDefine.type)
}

//连接
function connect(event, args) {
    if (connectStatus) {
        event.returnValue = true
        return
    }
    let re = mainDevice.connect(null, true);
    console.log("re---",re)
    connectStatus = re == 0 ? true : false
    event.returnValue = connectStatus
}

//读取一个卡片
function getCard(event, args) {
    if (test) {
        event.returnValue = "7601C27D"
        return
    }
    let moveStatus = mainDevice.moveCardToRead(null, true); //移动到读卡
    switch (moveStatus) {
        case 0:
            let no = mainDevice.readCardNo(null, true);
            event.returnValue = no != -1 ? no : -5; //卡号 -5 卡号读取错误
            break;
        default:
            event.returnValue = moveStatus != -1 ? moveStatus : -4 //-2,卡箱空；-3卡住；-4;移动错误
    }
}

//移动卡到取卡位置
function moveCardToFront(event, args) {
    if (test) {
        event.returnValue = 0
        return
    }
    try {
        let moveStatus = mainDevice.moveCardToFront(null, true);
        event.returnValue = moveStatus;
    } catch (error) {
        event.returnValue = 612
    }
    event.returnValue = 0
}


export default {
    F3: {
        device: null,
        window: null,
        type: "F3CardDeliver",
        param: {
            type: "IC"
        },
        init(win) {
            init(win, this)
        },
    }
}