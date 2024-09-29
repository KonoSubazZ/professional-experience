//小票打印
import {ipcMain} from "electron"
import DeviceHelper from "../HardwareHelper"
let deviceDefine = null,mainWindow = null,mainDevice = null

function init(win,device){
    deviceDefine = device
    mainWindow = win
    ipcMain.on("ticketPrint", ticketPrint)
    mainDevice = DeviceHelper.getDevice(deviceDefine.type)
}

//打印
function ticketPrint(event, args) {
    let result = mainDevice.print(args, true)
    console.log("Print result",deviceDefine.type,result)
    event.returnValue  =true
}

export default {
    TX80: {
        device: null,
        window: null,
        type: "Tx80Printer",
        init(win) {
            init(win,this)
        },
    }
}