import AutoLaunch from "auto-launch";
import axios from "axios";
import { exec } from "child_process";
import { log, timeEnd } from "console";
import {
  BrowserWindow,
  Renderer,
  app,
  dialog,
  ipcMain,
  protocol,
  session,
  globalShortcut,
} from "electron";
import fs from "fs";
import path from "path";
const { Transform } = require("stream");
const { StringDecoder } = require("string_decoder");
const { cpus, networkInterfaces } = require("os");
const { execSync } = require("child_process");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// process.env.node_env 是nodejs中内置的一个这个全局变量,用来保存当前的环境变量
// development为开发环境,production为生产环境
const isDevelopment = process.env.NODE_ENV !== "production"; //如果是开发环境此变量为true,相反则false

// 这段代码将app协议注册为特权协议，使得应用程序可以通过app://协议加载资源
// protocol.registerSchemesAsPrivileged([
//   { scheme: "app", privileges: { secure: true, standard: true } },
// ]);

var win;
// 创建一个窗口并配置这个窗口的各种配置参数,并将窗口对象保存在win这个全局参数当中
async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    icon: path.join(__dirname, "/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true, // 使用remote模块
      webviewTag: true,
      // 启用硬件加速
      accelerator: "hardware",
      hardwareAcceleration: true,
      disableBlinkFeatures: "DoubleTapToZoom",
      partition: String(+new Date())
    },
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // await win.loadURL("https://www.baidu.com");
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    // createProtocol("app");
    // win.loadURL("https://www.baidu.com");
    win.loadURL(`file://${path.resolve(__dirname, 'index.html')}`);
    // win.loadURL('http://192.168.11.6:3000');
  }
}

//当所有窗口都关闭的时候执行
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//当点击桌面图标的时候这里会执行,普通的命令启动方式这里应该是不执行的
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

//当组件初始化好了这里就会执行,命令行启动的话这里会首先执行
app.on("ready", () => {
  // 获取设备信息
  globalShortcut.register("CommandOrControl+Shift+i", function () {
    win.webContents.openDevTools();
  });
  const macAddresses = getMacAddress()["以太网"];
  const cpuSerialNumber = getCpuSerialNumber();
  const serialNumber = getDeviceSerialNumber();
  // protocol.registerFileProtocol("app", (request, callback) => {
  //   const url = request.url.substr(6);
  //   callback({ path: path.resolve(__dirname, url) });
  // });
  createWindow(); //配置窗口的各种配置参数
  autoLaunch(); //开启自动启动
  // loadExtensions()
  ipcMain.on("getDeviceInfo", (event) => {
    let data = {
      macAddresses,
      cpuSerialNumber,
      serialNumber,
    };
    event.returnValue = data;
  });
  protocol.registerHttpProtocol("app", (request, callback) => {
    const url = request.url.replace("app://", "http://");
    callback({ url });
  });
});

const ex = process.execPath; //当前可执行文件对应的绝对路径

//注意：生产环境情况下,设置这个开启自动启动项设置
if (!isDevelopment) {
  if (process.platform === "darwin") {
    app.setLoginItemSettings({
      openAtLogin: true, //是否开机启动
      openAsHidden: false, //是否隐藏主窗体，保留托盘位置
    });
  } else {
    // app.setLoginItemSettings({
    //   openAtLogin: true,
    //   openAsHidden: false,
    //   path: process.cwd() + "\\" + "瀑布流" + ".exe",
    //   args: ["--processStart", `"${ex}"`, "--process-start-args", `"--hidden"`],
    // });
  }
}
// 注:开发环境执行此内容,主要是制定一些这个开关机逻辑
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

/**
 * @author 钟豪
 * @example 添加自动启动项目,并且判断当前程序有没有开启自动启动项,没有开启的就给他开启这个功能
 */
function autoLaunch() {
  // 创建了一个名为"瀑布流"的AutoLaunch实例。这个实例将用于控制应用程序是否在系统启动时自动运行
  let app = new AutoLaunch({
    name: "瀑布流",
  });
  // 使用isEnabled()方法检查该应用程序是否已启用自动启动
  // 如果应用程序未启用自动启动，则使用enable()方法启用它
  // app.isEnabled().then((isEnabled) => {
  //   if (!isEnabled) {
  //     app.enable();
  //   }
  // });
}

function scheduleShutdown() {
  // 计算关机时间（例如，10分钟后）
  setTimeout(() => {
    // 执行系统关机命令（根据操作系统选择适当的命令）
    if (process.platform === "win32") {
      exec("shutdown /s /t 0", (error, stdout, stderr) => {
        if (error) {
          console.error(`关机命令执行错误: ${error}`);
        }
      });
    } else if (process.platform === "darwin" || process.platform === "linux") {
      exec("shutdown -h now", (error, stdout, stderr) => {
        if (error) {
          console.error(`关机命令执行错误: ${error}`);
        }
      });
    } else {
      console.error("不支持的操作系统");
    }
  }, 2000);
}

ipcMain.on("fullscreen", () => {
  win.setFullScreen(true);
});
// 响应函数,关闭window的时候执行
ipcMain.on("closeWin", scheduleShutdown);

ipcMain.on("hand", (event, res) => {
  fs.readFile(`${res}/列表2.txt`, "utf-8", function (err, data) {
    if (err == null) {
      // 如果 decoded.json 读取成功，则发送数据
      win.webContents.send("datas", data.toString());
    } else {
      // 当 decoded.json 读取失败时，尝试读取 decode.txt
      fs.readFile(
        `${res}/decoded.json`,
        "utf-8",
        function (errReadTxt, dataReadTxt) {
          if (errReadTxt == null) {
            // 如果 decode.txt 读取成功，则发送数据
            win.webContents.send("datas", dataReadTxt.toString());
          } else {
            // 如果 decode.txt 也读取失败，则输出错误信息
            console.error(
              "Both decoded.json and decode.txt failed to read:",
              err,
              errReadTxt
            );
          }
        }
      );
    }
  });
});


ipcMain.on("select-folder", (event) => {
  // 打开文件夹选择对话框
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      const folderPath = result.filePaths[0];
      event.reply("folder-selected", folderPath);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("download-files", (event, { url, filePath, downloadlist }) => {
  return;
  if (Array.isArray(downloadlist)) {
    if (downloadlist.length == 0) {
      try {
        const downloadList = fs.readFileSync(
          path.join(filePath, "./decoded.json"),
          "utf-8"
        );
        downloadlist = JSON.parse(downloadList);
      } catch (error) {
        console.log("资源清单格式错误,请联系管理员!");
      }
    }
    // 计算总数
    let total = downloadlist.length;
    downloadlist.forEach((file) => {
      total += file.fileDownloadUrl.split(";").filter(Boolean).length;
    });
    let percent = {};
    // console.log(downloadlist,'downloadlist-------------------------------------------------');
    downloadlist.forEach((file, index) => {
      // 文件名称 -- 绝对路径
      // const tempPath = path.join(
      //   `${filePath}/${file.filePath}/${file.type}`,
      //   file.pictureTitle
      // );

      // 目录
      // console.log(filePath, '-----filePath------------');
      // console.log(`${filePath}/${file.type}`, '----------------filefilefile---------');
      const type = "分类板块";
      // console.log(file.type,'------file.type------');
      // console.log(file.typename,'------file.name------');
      // let fileType;
      // switch (file.type) {
      //   case "0":
      //     fileType = "图书"
      //     break;
      //   case 4:
      //     fileType = "视听"
      //     break;
      //   case 3:
      //     fileType = "听书"
      //     break;
      // }
      // console.log(fileType);
      const targetFolder = path.join(`${filePath}/${type}/${file.typename}`);
      file.localFilePath = targetFolder;
      // const targetFolder = path.join(
      //   `${filePath}/test`
      // );

      // 不放在循环里是 我暂定理解是 一系列的书籍或视频 封面相同
      const picturePathName = path.join(targetFolder, file.pictureTitle);

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      // fileDownloadUrl可能有多条记录要去下载

      const DownloadUrlArr = file.fileDownloadUrl
        .split(";")
        .filter((item) => item != "");
      console.log(
        DownloadUrlArr.length,
        "---------DownloadUrlArr.length-------------"
      );
      const fileTitleArr = file.fileTitle
        .split(";")
        .filter((item) => item != "");
      const DownloadUrlArrPromises = DownloadUrlArr.map(
        (fileDownloadUrlItem, i) => {
          // 创建除图片外 具体的路径 也就是文件名字
          console.log(
            fileTitleArr[i],
            i,
            "--------------fileTitleArr[i]--------------------"
          );
          const filePathName = path.join(targetFolder, fileTitleArr[i]);

          // 对特殊格式处理
          if (fileDownloadUrlItem.indexOf("=http") !== -1) {
            fileDownloadUrlItem =
              "http" + fileDownloadUrlItem.split("=http")[1];
          }

          // 下载文件
          // 返回一个 Promise 对象
          return new Promise((resolve, reject) => {
            // 下载文件
            axios
              .get(`${fileDownloadUrlItem}`, {
                responseType: "stream",
                onDownloadProgress: (evt) => {
                  percent[`${index}_${i}`] = evt.progress || 1;
                  win.webContents.send(
                    "on-progress",
                    (Object.values(percent).reduce((a, b) => a + b, 0) /
                      total) *
                    100
                  );
                },
              })
              .then((res) => {
                const fileStream = fs.createWriteStream(filePathName, {
                  highWaterMark: 1024,
                });
                res.data.pipe(fileStream);
                fileStream.on("finish", () => {
                  resolve(filePathName); // 当文件写入完成时，resolve Promise 并传递文件路径
                });
                fileStream.on("error", (err) => {
                  reject(err); // 如果发生错误，reject Promise
                });
              })
              .catch((err) => {
                reject(err); // 如果发生错误，reject Promise
              });
          });

          // return axios.get(`${fileDownloadUrlItem}`, {
          //   responseType: "stream",
          //   onDownloadProgress: (evt) => {
          //     percent[`${index}_${i}`] = evt.progress || 1;
          //     win.webContents.send(
          //       "on-progress",
          //       (Object.values(percent).reduce((a, b) => a + b, 0) /
          //         total) *
          //       100
          //     );
          //   },
          // })
          //   .then((res) => {
          //     res.data.pipe(
          //       fs.createWriteStream(filePathName, { highWaterMark: 1024 })
          //     );
          //   });
        }
      );
      Promise.all(DownloadUrlArrPromises)
        .then(() => {
          axios
            .get(`${file.pictureDownloadUrl}`, {
              responseType: "stream",
              onDownloadProgress: (evt) => {
                percent[index] = evt.progress || 1;
                win.webContents.send(
                  "on-progress",
                  (Object.values(percent).reduce((a, b) => a + b, 0) / total) *
                  100
                );
              },
            })
            .then((res) =>
              res.data.pipe(
                fs.createWriteStream(picturePathName, { highWaterMark: 1024 })
              )
            );
        })
        .catch((err) => {
          // console.log(err, '文件下载出错!--------------');
        });
      // Promise.all(
      //   file.fileDownloadUrl
      //     .split(";")
      //     .map((fileDownloadUrlItem, i) => {
      //       const filePathTemp = path.join(
      //         // `${filePath}/${file.pushType}/${file.type}`,
      //         targetFolder,
      //         file.fileTitle.split(";")[i]
      //       );
      //       // console.log(targetFolder, "文件夹位置-----");
      //       // console.log(filePathTemp, '文件位置---------------');
      //       // console.log(tempPath, '图片文件---------------');
      //       if (fileDownloadUrlItem.indexOf("=http") !== -1) {
      //         fileDownloadUrlItem = "http" + fileDownloadUrlItem.split("=http")[1];
      //       }
      //       try {
      //         if (!fs.existsSync(targetFolder)) {
      //           fs.mkdirSync(targetFolder, { recursive: true });
      //         }
      //       } catch (error) {
      //         console.log(targetFolder, 'catch--targetFolder---------------------------------------------------------------');
      //         console.log(error, 'catch--error---------------------------------------------------------------');
      //       }

      //       // return
      //       axios
      //         // .get(`${url}/${it}`, {
      //         .get(`${fileDownloadUrlItem}`, {
      //           responseType: "stream",
      //           onDownloadProgress: (evt) => {
      //             percent[`${index}_${i}`] = evt.progress || 1;
      //             win.webContents.send(
      //               "on-progress",
      //               (Object.values(percent).reduce((a, b) => a + b, 0) /
      //                 total) *
      //               100
      //             );
      //           },
      //         })
      //         .then((res) => {
      //           res.data.pipe(
      //             fs.createWriteStream(filePathTemp, { highWaterMark: 1024 })
      //           );
      //         });
      //     })
      //     .concat(
      //       axios
      //         .get(`${file.pictureDownloadUrl}`, {
      //           responseType: "stream",
      //           onDownloadProgress: (evt) => {
      //             percent[index] = evt.progress || 1;
      //             win.webContents.send(
      //               "on-progress",
      //               (Object.values(percent).reduce((a, b) => a + b, 0) /
      //                 total) *
      //               100
      //             );
      //           },
      //         })
      //         .then((res) =>
      //           res.data.pipe(
      //             fs.createWriteStream(tempPath, { highWaterMark: 1024 })
      //           )
      //         )
      //     )
      // );
    });
  }
});

ipcMain.on("download-resource", (event, resources) => {
  const total = resources.length;
  let percent = new Array(resources.length).fill(0);
  resources.forEach(({ url, name, filePath: address }, index) => {
    // 原始文件名字
    const filePath = path.join(`${address}`, name);
    // 输出文件名字
    const filedecodedPath = path.join(`${address}`, "decoded.json");
    const targetFolder = path.dirname(filePath);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    axios
      .get(url, {
        responseType: "stream",
        onDownloadProgress: (evt) => {
          percent[index] = evt.progress;
          win.webContents.send(
            "receive-progress",
            (percent.reduce((a, b) => a + b, 0) / total) * 100
          );
        },
      })
      .then(async (res) => {
        // 先全部写入文件 再读取解码
        await new Promise((resolve, reject) => {
          const fileStream = fs.createWriteStream(filePath);
          res.data.on("end", () => {
            if (decodeBase64AndWriteToFile(filePath, filedecodedPath)) {
              // 读取并解码成功后的逻辑
            } else {
              // 处理错误的逻辑
            }
          });
          res.data.on("error", (err) => {
            reject(err);
          });
          res.data.pipe(fileStream);
        });

        function decodeBase64AndWriteToFile(inputFilePath, outputFilePath) {
          try {
            // 同步读取文件内容
            const fileContent = fs.readFileSync(inputFilePath, "utf-8");

            // 使用 Node.js 的 Buffer 对象进行 Base64 解码
            const decodedContent = Buffer.from(fileContent, "base64").toString(
              "utf-8"
            );

            // 同步写入文件
            fs.writeFileSync(outputFilePath, decodedContent, "utf-8");

            console.log(
              `File "${inputFilePath}" has been decoded and written to "${outputFilePath}" successfully.`
            );

            return true;
          } catch (error) {
            console.error(
              `Error reading, decoding, or writing the file:`,
              error
            );
            return false;
          }
        }
      })
      .catch((err) => {
        console.error("Error downloading file:", err);
      });
  });
});
// 获取 MAC 地址
function getMacAddress() {
  const nets = networkInterfaces();
  const result = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // We only want the IPv4 address
      if (net.family === "IPv4" && !net.internal) {
        result[name] = net.mac;
      }
    }
  }
  return result;
}
// 获取 CPU 唯一编号
function getCpuSerialNumber() {
  const cpuData = cpus();
  return cpuData[0].model;
}
// 获取硬件设备的序列号
function getDeviceSerialNumber() {
  if (process.platform === "win32") {
    try {
      const serialNumber = execSync("wmic bios get serialnumber")
        .toString()
        .split("\n")[1]
        .trim();
      return serialNumber;
    } catch (error) {
      console.error(error);
    }
  } else {
    // 添加其他平台的支持代码
  }
}
