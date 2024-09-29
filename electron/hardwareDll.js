const { app } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');
const { resolve } = require('path');
const fs = require('fs');
const isDev = process.env.IS_DEV == 'true' ? true : false;
let dllRelativePath = (process.env.IS_DEV == "true" ? "\\" : "") + "extraResources\\modules\\";
let configPath = null;
let resourcePath = null;
const getResourcePath = () => {
    if (!resourcePath) {
        console.log('isDev', isDev)
        console.log('getAppPath', app.getAppPath())
        resourcePath = resourcePath = app.getAppPath().replace("app.asar", "");
        if (isDev) {
            resourcePath = process.cwd();
        }
    }
    return resourcePath;
}

const getDllPath = () => {
    let p = dllRelativePath;
    try {
        p = path.join(getResourcePath(), (p ? p : ''));
    } catch (err) {
        console.log(err, dllRelativePath)
    }
    return p;
}
//获取本地config路径
let config = null;
const getConfigJSON = () => {
    configPath = process.execPath.replace('微图借还柜.exe', '') + '/resources/extraResources/config/config.json';
    if (isDev) {
        configPath = process.cwd() + '/extraResources/config/config.json';
    }
    return config = JSON.parse(fs.readFileSync(resolve(configPath)));
}

let cacheDevice = {}

module.exports = {
    getConfig() {
        return getConfigJSON();
    },
    getRFIDDriverPath() {
        return getDllPath() + "drivers\\";
    },
    getDllPath() {
        return getDllPath();
    },
    getDevice(type) {
        if (cacheDevice[type]) {
            return cacheDevice[type]
        }
        let device = {};
        let sdkPath = getDllPath() + 'BookCaseSDK.dll';
        // console.log(type, "load BookCaseSDK from " + sdkPath)
        let item = edge.func({
            assemblyFile: sdkPath,
            typeName: 'BluewhaleSDK.SdkEntry',
            methodName: type
        })
        device = item(null, true);
        cacheDevice[type] = device
        return device;
    },
    // getDeviceTwo(type){
    //     let device = {};
    //     let sdkPath = getDllPath() + 'BookCaseSDK.dll';
    //     console.log(type, "load BlueWhaleSDK from " + sdkPath)
    //     let item = edge.func({
    //         assemblyFile: sdkPath,
    //         typeName: 'BlueWhaleSDK.SdkEntry',
    //         methodName: type
    //     })
    //     device = item(null, true);
    //     return device;
    // },
    getResourcePath() {
        return getResourcePath();
    }
}
