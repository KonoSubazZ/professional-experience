//借还机
import RFIDReader from "./hardware/RFIDReader"
import ICReader from "./hardware/ICReader";
import TicketPrinter from "./hardware/TicketPrinter"
import IDReader from "./hardware/IDReader"
import FaceRecognition from "./hardware/FaceRecognition";
import CardDelivery from "./hardware/CardDelivery"
export default {
    init(config, win) {
        this.initDevice(config, win)
    },
    initDevice(config, win) {
        ICReader.F750.init(win)
        IDReader.ID180.init(win)
        TicketPrinter.TX80.init(win)
        CardDelivery.F3.init(win)
        if (!config.rfidType) {
            config.rfidType = 'hf';
        }if (!config.readBlockType) {
            config.readBlockType = '串口';
        }
        if(config.readBlockType ==='USB'){
            console.log('USB')
            RFIDReader.init(win,RFIDReader.pad[config.rfidType], config,true)
        }else{
            console.log('串口')
            RFIDReader.init(win,RFIDReader.embedded[config.rfidType], config,true)
        }
        FaceRecognition.BaiduFace.init(win)
    }
}