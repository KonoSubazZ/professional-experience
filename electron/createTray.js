const {getResourcePath} = require('./hardwareDll');
const {nativeImage,Tray} = require('electron');
const path = require('path');

const variable = {
    tray: null,
};


exports.init = {
    /**
     * @description:创建系统托盘
     */
    createTray() {
        let iconPath =  path.join(getResourcePath(), "\\extraResources\\icon\\ico.ico")
        variable.tray = new Tray(
            nativeImage.createFromPath(iconPath)
        );
        variable.tray.setToolTip('24小时借书柜');
        // console.log(iconPath)
    },
}

