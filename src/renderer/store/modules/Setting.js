import fs from "fs"
import func from "../../api/global_func"

const errorPath = process.cwd() + '\\errorLog.txt'

const logPath = process.cwd() + '\\log.txt'
const state = {
    base: 0,
    handbus: true,
    appType: "one", //one-借还机，two-办卡机
    skin: "light", //child,dark,light
    back: false, //默认返回首页，当是true时，不进行操作。
    readerCardType: "IC", //IC,RFID读者卡类型
    readerApiType: "COM", //usb,com阅读器接口类型.
    readerApiTypeDetail: "COM5",
    httpUrl: "", //请求地址
    rfidType: "hf",
    readBlockType: "串口",
    radiotwo: "true",
    radioone: "true",
    platform: "", //平台信息
    uuid: "", //硬件唯一标识
    manageSetting: "", //后台相关硬件设置
    audioLabel: "",//** 语音标签 */
    doorSetting: {}, //安全门配置
    highboard: '',   //高频读写板
    superboard: '',  //超高频读写板
    Tuka: false,  //是否吐卡
    settingConfig: false,
};

const getters = {
    http(state) {
        return state.httpUrl
    },
    rfidType(state) {
        return state.rfidType
    },
    readBlockType(state) {
        return state.readBlockType
    },
    radiotwo(state) {
        return state.radiotwo
    },
    radioone(state) {
        return state.radioone
    },
}
const mutations = {
    set_app_type(state, value) {
        state.appType = value;
    },
    set_skin_value(state, value) {
        state.skin = value;
    },
    set_back_value(state, value) {
        state.back = value;
    },
    set_readerCard_type(state, value) {
        state.readerCardType = value;
    },
    set_reader_api_type(state, value) {
        state.readerApiType = value.type;
        state.readerApiTypeDetail = value.typeDetail;
    },
    set_httpUrl_value(state, value) {
        state.httpUrl = value;
    },
    set_platform_value(state, value) {
        state.platform = value;
    },
    set_manage_setting(state, value) {
        state.manageSetting = value;
    },
    set_uuid(state, value) {
        state.uuid = value;
    },
    set_door_setting(state, value) {
        state.doorSetting = value;
    },
    set_label_name(state, value) {
        state.audioLabel = value;
    },
    set_rfid_type(state, value) {
        state.rfidType = value
    },
    set_tuka_type(state, value) {
        state.Tuka = value
    },
    set_read_type(state, value) {
        state.readBlockType = value
    },
    set_read_radioone(state, value) {
        state.radioone = value
    },
    set_read_radiotwo(state, value) {
        state.radiotwo = value
    },
    set_highboard_type(state, value) {
        state.highboard = value
    },
    set_superboard_type(state, value) {
        state.superboard = value
    },
    set_settingconfig_type(state, value) {
        state.settingConfig = value
    },
    set_modifybase(state, value) {
        state.base = value
    },
    set_handbus(state, value) {
        state.handbus = value
    },
};
const actions = {
    modhandbus({ commit }, value) {
        commit("set_handbus", value)
    },
    modifyAppType({ commit }, value) {
        commit("set_app_type", value)
    },
    modifyRfidType({ commit }, value) {
        commit("set_rfid_type", value)
    },
    modifyTukaType({ commit }, value) {
        commit("set_tuka_type", value)
    },
    modifyReadBlockType({ commit }, value) {
        commit("set_read_type", value)
    },
    modifyradioone({ commit }, value) {
        commit("set_read_radioone", value)
    },
    modifyradiotwo({ commit }, value) {
        commit("set_read_radiotwo", value)
    },
    modifyHighBoard({ commit }, value) {
        commit("set_highboard_type", value)
    },
    modifybase({ commit }, value) {
        commit("set_modifybase", value)
    },
    modifySuperBoard({ commit }, value) {
        commit("set_superboard_type", value)
    },
    modifySettingConfig({ commit }, value) {
        console.log(value,'config');
        commit("set_settingconfig_type", value)
    },
    modifySkin({
        commit
    }, value) {
        commit("set_skin_value", value);
    },
    modifyBack({
        commit
    }, value) {
        commit("set_back_value", value);
    },
    modifyReaderCardType({
        commit
    }, value) {
        commit("set_readerCard_type", value);
    },
    modifyReaderApi({
        commit
    }, value) {
        commit("set_reader_api_type", value);
    },
    modifyHttpUrl({
        commit
    }, value) {
        console.log("setHttp")
        commit("set_httpUrl_value", value);
    },
    modifyPlatform({
        commit
    }, value) {
        commit("set_platform_value", value);
    },
    modifyManageSetting({
        commit
    }, value) {
        commit("set_manage_setting", value);
    },
    modifyUuid({
        commit
    }, value) {
        commit("set_uuid", value)
    },
    modifyDoorSetting({
        commit
    }, value) {
        commit("set_door_setting", value)
    },
    add_to_log({
        commit
    }, value) {
        let log = value + '\n' + func.changeDate() + ' ' + func.changeTime('', ['h', 'm', 's']) + '\n' + '-------------------------\n'
        fs.readFile(logPath, 'utf-8', function (err, data) {
            if (err) {
                /** 没有内容，创建文件 */
                fs.writeFile(logPath, log, 'utf-8', function (error) {
                    if (error) {
                        console.log("写入失败")
                    }
                })
            }
            if (data) {
                /** 已有内容追加内容 */
                fs.appendFile(logPath, log, function (error) {
                    if (error) {
                        console.log("追加失败")
                    }
                })
            }
        })
    },
    add_to_error_log({
        commit
    }, value) {
        let log = value + '\n' + func.changeDate() + ' ' + func.changeTime('', ['h', 'm', 's']) + '\n' + '-------------------------\n'
        fs.readFile(errorPath, 'utf-8', function (err, data) {
            if (err) {
                /** 没有内容，创建文件 */
                fs.writeFile(errorPath, log, 'utf-8', function (error) {
                    if (error) {
                        console.log("写入失败")
                    }
                })
            }
            if (data) {
                /** 已有内容追加内容 */
                fs.appendFile(errorPath, log, function (error) {
                    if (error) {
                        console.log("追加失败")
                    }
                })
            }
        })
    }
};
export default {
    state,
    mutations,
    actions,
    getters
};