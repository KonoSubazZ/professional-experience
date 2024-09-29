//安全门应用
import Gate from "./hardware/Gate"
import RFIDReader from "./hardware/RFIDReader";
export default {
    init(config, win) {
        if (!config.rfidType){
            return
        }
        RFIDReader.init(win, {
            type: "rfid",
            params: {
                type: "USB"
            },
        })
        Gate[config.rfidType].init(win,config)
    }
}
