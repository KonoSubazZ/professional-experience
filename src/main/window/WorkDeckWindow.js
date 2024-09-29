import {BrowserWindow, Menu} from "electron";
import path from "path"
import ApplicationConfig from "../ApplicationConfig";
const winURL = process.env.NODE_ENV == "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;
function isOPAC() {
    return process.env.application == 'work_deck_opac'
}
function isMainSoftware() {
    return process.env.application == 'work_deck_main'
}

export default {
    init(type) {
        return this.initDefaultWindow()
    },
    initDefaultWindow() {
        console.log("sdk url ", ApplicationConfig.getWebSDKPath(), "load url", winURL,"application",process.env.application)
        let mainWindow = new BrowserWindow({
            icon: path.join(__static, "ico.ico"),
            height: 768,
            useContentSize: true,
            width: 1200,
            frame: !isOPAC(),
            show: false,
            resizable: !isOPAC(),
            fullscreen: isOPAC(),
            enableLargerThanScreen: false,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                contextIsolation: false,
                preload: ApplicationConfig.getWebSDKPath(),
                partition: String(+new Date()),
            },
        });
        mainWindow.loadURL(winURL);
        mainWindow.on("closed", () => {
            mainWindow = null;
        });
        mainWindow.on("ready-to-show", () => {
            mainWindow.show();
            if (!isOPAC()) {
                this.createMenu()
            } else {
                Menu.setApplicationMenu(null)
            }
        });
        const clearObj = {
            storages: ['appcache', 'filesystem', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
        };
        mainWindow.webContents.session.clearStorageData(clearObj);
        return mainWindow;
    },
    createMenu() {
        let quit = [
            {
                label: "退出",
                role: "quit",
            },
        ];
        let template = [
            {
                label: "菜单",
                submenu: [],
            },
        ];
        template[0].submenu = template[0].submenu.concat(quit);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}
