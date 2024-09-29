import { BrowserWindow,app } from "electron";
import path from "path";
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;
export default {
  getScreenWidth() {
    return process.env.application === "borrow_portrait" ? 600 : 1000;
  },
  getScreenHeight() {
    return process.env.application === "borrow_portrait" ? 1000 : 563;
  },
  init(platform) {
    // 设置忽略SSL证书错误的命令行选项
    app.commandLine.appendSwitch("ignore-certificate-errors");
    let mainWindow = new BrowserWindow({
      icon: path.join(__static, "icons/ico.png"),
      height: this.getScreenHeight(),
      useContentSize: true,
      width: this.getScreenWidth(),
      frame: false,
      show: false,
      movable: true,
      resizable: true,
      fullscreen: true,
      enableLargerThanScreen: false,
      // alwaysOnTop: true,
      // 网页功能的设置
      webPreferences: {
        // - 是否集成Node，默认false
        nodeIntegration: true,
        webSecurity: false,
      },
    });
    let webContents = mainWindow.webContents;
    webContents.on("did-finish-load", () => {
      webContents.setZoomFactor(1);
      webContents.setVisualZoomLevelLimits(1, 1);
      webContents.setLayoutZoomLevelLimits(0, 0);
    });
    mainWindow.loadURL(winURL);
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
    });
    return mainWindow;
  },
};
