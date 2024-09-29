//工作站应用
import ICReader from "./hardware/ICReader"
import RFIDReader from "./hardware/RFIDReader"
import IdCardReader from "./hardware/IDReader"
import FaceRecognition from "./hardware/FaceRecognition";

export default {
    init(config, win, applicationType) {
        if (!config || !config.url) {
            console.log("not config")
            return
        }
        let url = ""
        if (applicationType === 'work_deck') {
            //只有工作站的时候才初始化硬件，opac和主软件没有硬件
            url = config.url.workstation
            this.initDevice(win, config)
        }
        if (applicationType === 'work_deck_main') {
            url = config.url.library
        }
        if (applicationType === 'work_deck_opac') {
            url = config.url.opac
        }
        console.log("load config url:", url)
        if(!url){
            return;
        }
        // win.loadURL('http://localhost:8004/#/login?id=2')
        win.loadURL(url)
    },
    initDevice(win, config) {
        console.log(121212122,config);
        // todo
        ICReader.F750.init(win)
        if (!config.readBlockType) {
            config.readBlockType = 'USB';
        }
        if(config.readBlockType ==='USB'){
            console.log('USB')
            RFIDReader.init(win,RFIDReader.pad[config.rfidType], config)
        }else{
            console.log('串口')
            RFIDReader.init(win,RFIDReader.embedded[config.rfidType], config)
        }
        // RFIDReader.init(win,  RFIDReader.pad[config.rfidType],config)
        IdCardReader.ID180.init(win)
        FaceRecognition.BaiduFace.init(win)
    }
}
