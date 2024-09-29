const { ipcMain } = require("electron");
const fs = require("fs");
const { resolve } = require("path");
const isDev = process.env.IS_DEV == "true" ? true : false;
let configPath = null;
const getConfig = () => {
  configPath =
    process.execPath.replace("微图借还柜.exe", "") +
    "/resources/extraResources/config/config.json";
  if (isDev) {
    configPath = process.cwd() + "/extraResources/config/config.json";
  }
  return configPath;
};
exports.updateSetting = () => {
  ipcMain.on("updateSetting", (event, args = {}) => {
    console.log(getConfig(),"====configPath====",new Date());
    fs.writeFileSync(resolve(getConfig()), JSON.stringify(args));
    console.log(args, new Date(),"====updateSetting====" );
    event.returnValue = true;
  });
};
