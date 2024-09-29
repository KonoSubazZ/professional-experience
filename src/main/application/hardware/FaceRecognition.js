//人脸是识别
import {ipcMain} from "electron"
import DeviceHelper from "../HardwareHelper"
//GQXN-VGNW-FLWX-QVES
let deviceDefine = null, mainWindow = null, mainDevice = null
let states = {}

function init(win, device) {
    deviceDefine = device
    mainWindow = win
    ipcMain.on("testFace", testFace)
    ipcMain.on("onFace", onFaceConfirm)
    mainDevice = DeviceHelper.getDevice(deviceDefine.type)
    initSDK()
}

//初始化人脸SDK
function initSDK() {
    console.log("init face sdk", deviceDefine.type)
    states.init = mainDevice.init(0, true)
}

//人脸选择确认
function onFaceConfirm(event, args) {
    mainWindow.webContents.send("onFace", args)
    event.returnValue = true
}

//获取人脸评分
function testFace(event, args) {
    if (!args || !args.img) {
        event.returnValue = 0
        return;
    }
    if (states.init === -1) {
        event.returnValue = 1
        return;
    }
    let re = mainDevice.testFace({pic: args.img}, true);
    try {
        let faceRe = JSON.parse(re);
        console.log("BaiduFace test face", faceRe, JSON.stringify(faceRe), "结果")
        if (faceRe.errno === 0) {
            event.returnValue = faceRe.data.list[0].score
            return
        }
        event.returnValue = 0
    } catch (e) {
        event.returnValue = 0
    }
}

export default {
    BaiduFace: {
        type: "FaceAPI",
        init(win) {
            init(win, this)
        },
    }
}