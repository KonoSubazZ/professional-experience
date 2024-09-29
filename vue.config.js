const { defineConfig } = require("@vue/cli-service");
// import { defineConfig } from "@vue/cli-service";
module.exports = defineConfig({
  transpileDependencies: true,
  transpileDependencies: ['pdfjs-dist'],
  pluginOptions: {
    electronBuilder: {
      externals: ['vue-cli-plugin-electron-builder'],
      customFileProtocol: './',
      nodeIntegration: true,
      builderOptions: {
        productName: '瀑布流',
        appId: 'com.waterFall.app',
        asar: false,
        win: {
          target: "nsis"
        },
        directories: {
          "output": "dist"
        },
        nsis: {
          "oneClick": false,
          "guid": "瀑布流",
          "perMachine": true,
          "allowElevation": true,
          "allowToChangeInstallationDirectory": true,
          "createDesktopShortcut": true,
          "createStartMenuShortcut": true,
          "shortcutName": "瀑布流",
          "installerIcon": "./public/icon.ico",
          "installerHeaderIcon": "./public/icon.ico"
        },
        extraResources: [
          {
            from: "node_modules/pdfjs-dist/build/pdf.worker.js",
            to: "./",
          },
        ],
      },
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000
  },

  configureWebpack: {
    devtool: 'inline-cheap-module-source-map',
    externals: {
      sharp: 'module sharp',
    },
    resolve: {
      fallback: {
        path: false,
      },
    },
  },
});
