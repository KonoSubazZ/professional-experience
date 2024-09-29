//安全门
import DeviceHelper from "../HardwareHelper";

let mainWindow = null
let deviceDefine = null
let applicationConfig = null
let mainDevice = null
import helper from "../HardwareHelper"
import {ipcMain} from "electron";

let tagStore = []

//初始化
function init(win, device, config) {
    mainWindow = win;
    deviceDefine = device
    applicationConfig = config
    let item = helper.getDevice(deviceDefine.type);
    connect(item)
}

//连接
function connect(factory) {
    let doorIpArray = (applicationConfig.ip||'').split(';').filter(Boolean)

    doorIpArray.map((item,index) => {
        let ins = factory(null,true);
        ins.connect({
            ip: item,
            driver: DeviceHelper.getRFIDDriverPath(),
            onTag: function (data) {
                if (isExpired(data)) {
                    sendMessage('onDoorTag', data)
                }
            },
            onHuman: function (data) {
                sendMessage('onDoorNumber', {...data,id:item})
            }
        }, true);
        ipcMain.on("onHumanFlow", (event)=>{
            let data
            ins.getCurrentFlow(null,function (err,result) {
                data = result
            })
            event.returnValue = data;
        })
    })
}


//tag是否过期，避免短时间出现大量重复的tag
function isExpired(data) {
    let time = new Date().getTime()
    let tags = tagStore.filter(it => {
        return it.tag === data.tag && it.expire > time
    })
    tagStore = tagStore.filter(it => {
        return it.expire > time
    })
    tagStore.push({tag: data.tag, expire: time + 3000})
    return !(tags && tags.length);
}

//发送消息
function sendMessage(channel, data) {
    try {
        data.rfidType = applicationConfig.rfidType
        if (isUHF() && data.tag) {
            data.origin = data.tag
            data.tag = data.tag.substring(4)
        }
        console.log(channel, JSON.stringify(data))
        mainWindow.webContents.send(channel, data)
    } catch (e) {
        console.log(e)
    }
}

//判断是否是超高频
function isUHF() {
    return deviceDefine && deviceDefine.type === 'RR15045Gate'
}

export default {
    window: null,
    config: null,
    hf: {
        name: "highDoor",
        type: "LS406Gate",
        init(window, config) {
            init(window, this, config)
        }
    },
    uhf: {
        name: "uhf_gate",
        type: "RR15045Gate",
        init(window, config) {
            init(window, this, config)
        }
    }
}
