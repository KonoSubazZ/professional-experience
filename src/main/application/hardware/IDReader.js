//身份证阅读器
import {ipcMain} from "electron"
import DeviceHelper from "../HardwareHelper"
let deviceDefine = null,mainWindow = null,mainDevice = null

function init(win,device){
    deviceDefine = device
    mainWindow = win
    ipcMain.on("readIdCard", startRead)
    ipcMain.on("stopReadIdCard", stopRead)
    mainDevice = DeviceHelper.getDevice(deviceDefine.type)
}

//开始阅读身份证
function startRead(event, args) {
    console.log("start read ID card")
    if (mainDevice == null) {
        event.returnValue = 601;
        return
    }
    let readIC =  mainDevice.startRead({
        changed: function (data) {
            console.log("on ID Card",data)
            sendMessage( data)
        }
    })
    event.returnValue  = readIC
}
//停止阅读身份证
function stopRead(event, args) {
    console.log("stop read ID card")
    if (mainDevice == null) {
        event.returnValue = 601;
        return
    }
    mainDevice.stopRead(null, true)
    event.returnValue = true;
}

//向页面发送结果
function  sendMessage(data) {
    if (!mainWindow) {
        return
    }
    mainWindow.webContents.send("onDeviceIdCard", data);
}


export default {
    ID180: {
        type: "id180",
        init(win) {
            init(win,this)
        },
    }
}