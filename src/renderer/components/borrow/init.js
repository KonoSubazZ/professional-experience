import {
  nativeImage,
  Tray
} from "electron";
import path from "path";
import AutoLaunch from "auto-launch";

const variable = {
  tray: null,
};

const init = {
  /**
   * @description:创建系统托盘
   */
  createTray() {
    variable.tray = new Tray(
      nativeImage.createFromPath(
        path.join(__dirname, "../../build/icons/ico.ico")
      )
    );
    variable.tray.setToolTip("蓝鲸图书馆");
  },
  /**
   * @description:销毁系统托盘
   */
  destoryTray() {
    variable.tray.destroy();
    // variable.tray = null;
    console.log(variable.tray.isDestroyed());
  },
  /**
   * @description:开机启动
   */
  autoLanuch() {
    let app = new AutoLaunch({
      name: "蓝鲸图书馆",
    });
    app.isEnabled().then((isEnabled) => {
      if (!isEnabled) {
        app.enable();
      }
    });
  },
};

export default init;