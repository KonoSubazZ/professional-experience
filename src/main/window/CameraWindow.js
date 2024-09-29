import {ipcMain, BrowserWindow} from "electron"
import ApplicationConfig from "../ApplicationConfig";
import path from "path";

ipcMain.on("takePicture", openWindow)
ipcMain.on("closePicture", closeCameraWindow)
let mainWindow = null, cameraWindow = null;

function closeCameraWindow() {
    if (!cameraWindow) {
        return
    }
    cameraWindow.destroy()
    cameraWindow = null
}

function openWindow(event, args) {
    cameraWindow = new BrowserWindow({
        icon: path.join(__static, 'ico.ico'),
        height: 600,
        width: 660,
        devTools: false,
        parent: mainWindow,
        modal: true,
        resizable: false,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            devTools: false,
            frame: false,
            nativeWindowOpen: true, //是否使用原生的window.open()
            webviewTag: true, //是否启用 <webview> tag标签
            plugins: true, //是否支持插件
            preload: ApplicationConfig.getWebSDKPath()
        },
    });
    cameraWindow.setMenu(null)
    let url = process.env.NODE_ENV == "development" ? (process.cwd() + `/extraResources/sdk/camera.html`) : (ApplicationConfig.getResourcePath()+ `sdk/camera.html`);
    cameraWindow.loadURL(url)
    event.returnValue = 0;
}

export default {
    init(win) {
        mainWindow = win
    }
}