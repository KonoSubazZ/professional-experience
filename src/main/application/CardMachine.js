//办卡机
import ICReader from "./hardware/ICReader";
import TicketPrinter from "./hardware/TicketPrinter"
import IDReader from "./hardware/IDReader"
import FaceRecognition from "./hardware/FaceRecognition"
import CardDelivery from "./hardware/CardDelivery"

export default {
    init(config, win) {
        this.initDevice(config, win)
    },
    initDevice(config, win) {
        ICReader.F750.init(win)
        IDReader.ID180.init(win)
        TicketPrinter.TX80.init(win)
        FaceRecognition.BaiduFace.init(win)
        CardDelivery.F3.init(win)
    }
}