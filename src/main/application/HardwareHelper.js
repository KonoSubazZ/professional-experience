//硬件工具类
// import edge from "electron-edge-js";
import path from "path";
import ApplicationConfig from "../ApplicationConfig";


let dllRelativePath = (process.env.NODE_ENV == "development" ? "\\" : "") + "extraResources\\modules\\";
let deviceStore  = {}



// fork(path.resolve(__dirname, "./hardware/RFIDReader.js"), [], {})
//获取主BlueWhaleSDK.dll的目录
function getDllPath() {
    let p = dllRelativePath;
    try {
        p = path.join(ApplicationConfig.getResourcePath(), (p ? p : ""));
      
    } catch (error) {
        console.log(error,dllRelativePath)
    }
    return p;
}

export default {
     getDllPathchange() {
        let p = dllRelativePath;
        try {
            p = path.join(ApplicationConfig.getResourcePath(), (p ? p : ""));
          
        } catch (error) {
            console.log(error,dllRelativePath)
        }
        return p;
    },
    //获取RFID标签driver的目录
    getRFIDDriverPath(){
        return getDllPath()+"drivers\\"
    },
    //获取一个硬件实例
    getDevice(type){
      return;
        let device = deviceStore[type];
        //已存在直接返回
        if (device) {
            console.log(device)
            return device
        }
        //初始化
        let sdkPath =  getDllPath() + "BlueWhaleSDK.dll";
        let item = edge.func({
            assemblyFile:sdkPath,
            typeName: "BluewhaleSDK.SdkEntry",
            methodName: type,
        });
        console.log({
            assemblyFile:sdkPath,
            typeName: "BluewhaleSDK.SdkEntry",
            methodName: type
        })
        if(type === 'LS406Gate') {
            deviceStore[type] = item
            return item
        }
        device = item(null, true);
        deviceStore[type] = device
       
        return device;
    },
}
