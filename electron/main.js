// electron主窗口
/**
 * 状况
在创建窗体后,整个界面是白色的
原因
在窗体创建完毕后,vue的渲染进程是还没有完成加载,而造成加载失败
解决
在创建窗体实例的时候先隐藏,之后再createWindow函数中,给BrowserWindow实例用once添加一个ready-to-show事件,去主动的展示窗体即可解决
 */
const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
const isDev = process.env.IS_DEV == "true" ? true : false;
const url = isDev
  ? " http://127.0.0.1:5173"
  : // : `http://192.168.12.70:5173`;
    `file://${path.join(__dirname, "../dist/index.html")}`;
const gotTheLock = app.requestSingleInstanceLock(); //单例实例锁
const createWindow = () => {
  // 创建主窗口
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false, // 先隐藏窗口
    webPreferences: {
      nodeIntegration: true,
      allowFileAccess: true, // 添加此选项
      webSecurity: false, // 添加此选项(此选项应在开发过程中使用，并在发布前再次启用以保持安全)
      preload: path.join(app.getAppPath(), "preload.js"),
      // contextIsolation: false, // 禁用上下文隔离
    },
  });
  mainWindow.loadURL(url);
  mainWindow.setFullScreen(true);
  mainWindow.webContents.once("dom-ready", () => {
    // 监听窗口内容准备就绪事件
    mainWindow.show(); // 窗口内容准备就绪后再显示窗口
  });
  Menu.setApplicationMenu(null);
  globalShortcut.register("CommandOrControl+Shift+i", function () {
    mainWindow.webContents.openDevTools();
  });
};

app.whenReady().then(() => {
  createWindow();
});
//开机自启
if (!app.isPackaged) {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: false,
    path: process.execPath,
    args: [path.resolve(process.argv[1])],
  });
} else {
  app.setLoginItemSettings({
    openAtLogin: true,
  });
}
// 只允许启动一个
if (!gotTheLock) {
  app.quit();
}
