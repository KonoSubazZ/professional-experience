const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  getAppPath: () => {
    const isDev = process.env.IS_DEV == "true" ? true : false;
    let url = "";
    if (isDev) {
      url = require("path").resolve(__dirname);
    } else {
      url = require("path").resolve(__dirname, "..");
    }
    return url;
  },
});
