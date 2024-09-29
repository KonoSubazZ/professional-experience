import {nativeImage, Tray} from "electron";
import path from "path";
import AutoLaunch from "auto-launch";
import ApplicationConfig from "./ApplicationConfig";

const variable = {
    tray: null,
};

function getAppName() {
    let application = process.env.application
    switch (application) {
        case "borrow_landscape":
            return "蓝鲸图书馆借还机"
        case "borrow_portrait":
            return "蓝鲸图书馆借还机-竖屏版"
        case "card_machine":
            return "蓝鲸图书馆自助办卡机"
        case "security_gate":
            return "蓝鲸图书馆安全门软件"
        case "work_deck_opac":
            return "蓝鲸图书馆OPAC"
        case "work_deck":
            return "蓝鲸图书馆工作站"
        case "work_deck_main":
            return "蓝鲸图书馆主软件"
    }
}

const init = {
    /**
     * @description:创建系统托盘
     */
    createTray() {
        let iconPath =  path.join(ApplicationConfig.getResourcePath(), "\\extraResources\\icon\\ico.ico")
        variable.tray = new Tray(
            nativeImage.createFromPath(iconPath)
        );
        variable.tray.setToolTip(getAppName());
        console.log(iconPath)
    },
    /**
     * @description:销毁系统托盘
     */
    destroyTray() {
        variable.tray.destroy();
    },
    /**
     * @description:开机启动
     */
    autoLaunch() {
        let exePath = process.cwd() + "\\" + getAppName() + ".exe"
        let app = new AutoLaunch({
            name: getAppName(),
            path: exePath
        });
        app.isEnabled().then((isEnabled) => {
            if (!isEnabled) {
                app.enable();
            }
        });
    },
};

export default init;