const path = require("path");
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain,
} = require("electron");
const AutoLaunch = require("auto-launch");
const isDev = process.env.IS_DEV == "true" ? true : false;
const url = isDev
  ? " http://127.0.0.1:5173"
  : // : `http://192.168.12.70:5173`;
    `file://${path.join(__dirname, "../dist/index.html")}`;
const { initDevice } = require("./hardware/index");
const { updateSetting } = require("../electron/util");
const { init } = require("./createTray");



function createWindow() {
  initDevice();
  updateSetting();
  init.createTray();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 605,
    height: 993,
    useContentSize: true,
    frame: true,
    resizable: true,
    fullscreen: isDev ? false : true,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      accelerator: "hardware",
    },
  });

  // // 主要就是以下三段，本质上就是启动debugger，强制进入移动端模式，然后让鼠标事件也能触发touch事件，而且界面也不会显示控制台
  // mainWindow.webContents.debugger.attach("1.3");
  // mainWindow.webContents.debugger.sendCommand(
  //   "Emulation.setTouchEmulationEnabled",
  //   {
  //     enabled: true,
  //     configuration: "mobile",
  //   }
  // );
  // mainWindow.webContents.debugger.sendCommand(
  //   "Emulation.setEmitTouchEventsForMouse",
  //   { enabled: true }
  // );
  // -------------------------------------------
  let webContents = mainWindow.webContents;
  // webContents
  //   .executeJavaScript('localStorage.getItem("http");', true)
  //   .then((result) => {
  //     local = result;
  //     console.log(result, "----http------");
  //   });

  webContents.on("did-finish-load", () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
    // webContents.setLayoutZoomLevelLimits(0, 0);
  });
  mainWindow.loadURL(url);
  ipcMain.on("outExe", function (e) {
    // console.log(e, "ee");
    mainWindow.close();
  });
  // Open the DevTools.
  globalShortcut.register("CommandOrControl+Shift+i", function () {
    mainWindow.webContents.openDevTools();
  });
  Menu.setApplicationMenu(null);
  const clearObj = {
    storages: [
      "appcache",
      "filesystem",
      "shadercache",
      "websql",
      "serviceworkers",
      "cachestorage",
      "sessionStorage",
    ],
  };
  mainWindow.webContents.session.clearStorageData(clearObj);
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//开机自启
let exePath = process.cwd() + "\\" + "微图借还柜.exe";
let autoLaunch = new AutoLaunch({
  name: "微图借还柜",
  path: exePath,
});
autoLaunch.isEnabled().then((isEnabled) => {
  if (!isEnabled) autoLaunch.enable();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

