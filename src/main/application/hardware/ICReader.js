//IC卡阅读器
import {ipcMain} from "electron"
import DeviceHelper from "../HardwareHelper"
let deviceDefine = null,mainWindow = null,mainDevice = null
function init(win,device){
    deviceDefine = device
    mainWindow = win
    ipcMain.removeAllListeners("readReaderCard")
    ipcMain.removeAllListeners("stopReaderCard")
    ipcMain.on("readReaderCard", startRead)
    ipcMain.on("stopReaderCard", stopRead)
    mainDevice = DeviceHelper.getDevice(deviceDefine.type)
}
//开始阅读IC卡
function startRead(event, args) {
    console.log("start read IC Card")
    if (mainDevice == null) {
        event.returnValue = 601;
        return
    }
    let payload = {
        ...deviceDefine.param,
        changed(data) {
            console.log(data,'11111111111111')
            sendMessage(data);
        }
    }

    let readIC =  mainDevice.startRead(payload, true);
    console.log('readIC',readIC)
    event.returnValue  =readIC
}
//停止阅读IC卡
function stopRead(event, args) {
    console.log("stop read IC Card")
    if (mainDevice == null) {
        event.returnValue = 601;
        return
    }
    mainDevice.stopRead(null, true)
    event.returnValue = true;
}

//向页面发送消息
function sendMessage(data) {
    if (!mainWindow) {
        return
    }
    // console.log("IC Read Result:",data)
    mainWindow.webContents.send("getReaderCard", data);
}


export default {
    F750: {
        device: null,
        window: null,
        type: "readerCardReader",
        param: {
            type: "IC"
        },
        init(win) {
          init(win,this)
        },
    }
}