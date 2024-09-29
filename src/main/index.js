import { app, globalShortcut } from "electron";
import init from "./init.js";
import fs from "fs";
import "./ApplicationConfig";
import ApplicationIndex from "./application/index";
import WindowHandler from "./window/index";
// 检查是否已经有一个实例在运行
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow;
function createWindow() {
  console.log(process.env.application,'---process.env.application');
  // mainWindow = WindowHandler.initWindow(process.env.application);
  mainWindow = WindowHandler.initWindow( "borrow_portrait" );
}

let paths =
  "env:" +
  process.env.NODE_ENV +
  " \n process.cwd()：" +
  process.cwd() +
  " \n __dirname： " +
  __dirname +
  "\n app.getAppPath():" +
  app.getAppPath() +
  " \n app.getVersion():" +
  app.getVersion() +
  " \n app.getName() " +
  app.getName() +
  " \n\t";
console.log(paths);
if (!gotTheLock) {
  app.quit();
} else {
  app.on("ready", () => {
    createWindow();
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    ApplicationIndex.init(process.env.application, mainWindow);
    init.createTray();
    init.autoLaunch();
  });
}
//监听应用ready事件

app.on("will-quit", () => {
  // 注销快捷键
  globalShortcut.unregister("CommandOrControl+X");

  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

//监听应用窗口时间，当所有的窗口关闭后，关闭应用
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    init.destroyTray();
    app.quit();
  }
});
//应用被激活事件
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
