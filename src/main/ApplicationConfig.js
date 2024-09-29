//应用配置信息
import {app} from "electron";

const fs = require("fs")
import Uuid from "uuidjs";

let resourcePath = null

function isDev() {
    return process.env.NODE_ENV === 'development'
}


function getResourcePath() {
    if (!resourcePath) {
        resourcePath = app.getAppPath().replace("app", "")
        if (isDev()) {
            resourcePath = process.cwd()
        }
    }
    return resourcePath
}

function getPrdFilePath(path) {
    return getResourcePath() + path
}

//环境文件
let devEnv = "./extraResources/config/env.json"
if (!isDev()) {
    global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");

}
if (isDev()) {
    let key = process.argv[process.argv.length - 1]
    if (key !== 'dev') {
        devEnv = "./buildConfig/" + key + '/config/env.json'
    }
}
let envFilePath = isDev() ? devEnv : getPrdFilePath("config/env.json")

try {
    console.log("env file", envFilePath)
    let env = JSON.parse(fs.readFileSync(envFilePath))
    process.env.application = env.application
} catch (e) {
    if (process.env.NODE_ENV === 'development') {
        process.env.application = process.argv[process.argv.length - 1]
    }
}


//uuid文件

let uuidFilePath = isDev() ? './extraResources/config/uuid' : getPrdFilePath("config/uuid")
try {
    console.log(' uuidFilePath',uuidFilePath);
    let uuid = ""
    if (!fs.existsSync(uuidFilePath)) {
        uuid = Uuid.generate()
        fs.writeFileSync(uuidFilePath, uuid)
    } else {
        uuid = fs.readFileSync(uuidFilePath)
    }
    console.log('uuid',uuid);
    process.env.uuid = uuid
} catch (e) {

}

//配置文件
let configFilePath = isDev() ? './extraResources/config/config.json' : getPrdFilePath("config/config.json")
let config = null
process.env.hasConfig = null
try {
    config = JSON.parse(fs.readFileSync(configFilePath))
    process.env.hasConfig = "true"
} catch (e) {

}
console.log(getResourcePath())

export default {
    updateConfig(args) {
        try {
            fs.writeFileSync(configFilePath, JSON.stringify(args))
            config = args
            process.env.hasConfig = "true"
        } catch (e) {
        }
    },
    getConfig() {
        return config;
    },
    getWebSDKPath() {
        return getResourcePath() + (isDev() ? "/extraResources/sdk/BlueWebSdk.js" : "sdk/BlueWebSdk.js");
    },
    getResourcePath() {
        return getResourcePath()
    },
}