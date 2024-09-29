import workDeck from "./WorkDeckWindow"
import fullscreen from "./FullScreenWindow"
import cameraWindow from "./CameraWindow"

export default {
    initWindow(platform) {
        if (platform.indexOf("work_deck") === 0) {
            let mainWindow = workDeck.init(platform);
            cameraWindow.init(mainWindow)
            return mainWindow
        }
        return fullscreen.init(platform);
    }
}