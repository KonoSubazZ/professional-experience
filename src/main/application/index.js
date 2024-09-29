//设备初始化,根据应用类型初始化相应的应用
import { ipcMain, globalShortcut } from "electron";
import SecurityGate from "./SecurityGate";
import WorkDeck from "./WorkDeck";
import BorrowMachine from "./BorrowMachine";
import CardMachine from "./CardMachine";
import ApplicationConfig from "../ApplicationConfig";
let application = null,
  mainWindow = null,
  applicationType = null;
export default {
  init(type, win) {
    globalShortcut.register("CommandOrControl+Shift+i", function() {
      mainWindow.webContents.openDevTools();
    });
    mainWindow = win;
    applicationType = type;
    application = this.getCurrentApplication(applicationType);

    //在线版
    if (applicationType === "work_deck") {
      ipcMain.on("loadDrivers", (event, args) => {
        application.initDevice(mainWindow, ApplicationConfig.getConfig());
        event.returnValue = true;
      });
    }
    this.initApplication();
    this.listenConfigChange();
    this.configData();

    // //离线版
    // if(applicationType === "work_deck"){
    //     ipcMain.on("loadDrivers", (event, args) => {
    //         application.initDevice(mainWindow,{})
    //         event.returnValue = true
    //     })
    //     // 工作站有无网络时
    //     application.initDevice(mainWindow,{})
    //     this.initApplication()
    //     this.listenConfigChange()
    // } else {
    //     this.initApplication()
    //     this.listenConfigChange()
    // }
  },
  //监听页面的配置消息
  listenConfigChange() {
    let vm = this;
    ipcMain.on("updateSetting", (event, args) => {
      ApplicationConfig.updateConfig(args);
      vm.initApplication();
      event.returnValue = true;
    });
  },
  //初始化应用
  initApplication() {
    try {
      let config = ApplicationConfig.getConfig();
      if (!config) {
        console.log("config file not found");
        return;
      }
      application.init(config, mainWindow, applicationType);
    } catch (e) {
      console.log(e);
    }
  },
  configData() {
    try {
      ipcMain.on("updateConfig", (event, args) => {
        let settingConfig = false; //本地的config.json文件是否有内容
        const webContents = mainWindow.webContents;
        let config = ApplicationConfig.getConfig();
        console.log(config, "----config");
        if (!config) {
          console.log("进来了null");
          settingConfig = false;
        } else {
          console.log("进来了true");
          settingConfig = true;
        }
        webContents.send("message-main-config", settingConfig);
        event.returnValue = true;
      });
    } catch (e) {
      console.log(e, "-Noconfig");
      ipcMain.on("updateConfig", (event, args) => {
        webContents.send("message-main-config", false);
        event.returnValue = true;
      });
    }
  },
  //根据应用类型获取应用
  getCurrentApplication(applicationType) {
    console.log(applicationType);
    switch (applicationType) {
      case "security_gate":
        return SecurityGate;
      case "work_deck":
      case "work_deck_main":
      case "work_deck_opac":
        return WorkDeck;
      case "borrow_landscape":
        return BorrowMachine;
      case "borrow_portrait":
        return BorrowMachine;
      case "card_machine":
        return CardMachine;
    }
  },
};
