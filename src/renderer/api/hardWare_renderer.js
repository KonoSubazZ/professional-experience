import {
    ipcRenderer
} from "electron";
import store from '../store/modules/Setting'
function openRFIDReader(setting) {
    return ipcRenderer.sendSync("openRFIDReader", setting);
}

function closeRFIDReader() {

    return ipcRenderer.sendSync("closeRFIDReader");
}

function inventoryRFIDReader(callBack) {
    ipcRenderer.removeAllListeners('onTag');
    ipcRenderer.on("onTag", (event, args) => {
        callBack && callBack(args)
    })
    return ipcRenderer.sendSync("inventoryRFIDReader")
}

function stopInventoryRFIDReader() {
    console.log("停止rfid--------")
    ipcRenderer.removeAllListeners('onTag')
    return ipcRenderer.sendSync("stopInventoryRFIDReader")
}

function writeRFIDReaderMulti(data) {
    return ipcRenderer.send("writeRFIDReaderMulti", data)
}


function writeRFIDReaderOut(tag) {
    return ipcRenderer.sendSync("bookCheckOut", tag);
}

function writeRFIDReaderIn(tag) {
    return ipcRenderer.sendSync("bookCheckIn", tag);
}

function readReaderCard(type, callback) {
    return type == 'IC' ? readReaderCardIC(callback) : readReaderCardRFID(callback)
}

function numchange(data) {
    console.log(data)
    var bbb = [...data];
    // var ccc = aaa.split('');
    var a, b;
    var aIndex = 0;
    var bIndex = 1;
    var arr = []
    bbb.forEach((str, index) => {
        if (index % 2 === 0) {
            a = str;
            aIndex += 1
            console.log('a,aIndex', a, aIndex)

        } else {
            b = str
            bIndex += 1
            console.log('b,bIndex', b, bIndex)
        }
        if (a && b && (bIndex - aIndex === 1)) {
            arr.push(a + b)
        }
    });
    var changle = arr.reverse().toString()
    var changeler = changle.replace(/,/g, '')
    console.log(changeler, '1111111111111')
    return changeler

}
function readReaderCardIC(callback) {
    ipcRenderer.removeAllListeners("getReaderCard");
    ipcRenderer.on("getReaderCard", (event, arg) => {

        // var base = localStorage.getItem("modifybase")
        // var num
        // var cardId
        // var change1 = numchange(arg)
        // console.log(change1, '转换之前的值经过反码')
        // if (typeof change1 == "string") {
        //     if (Number(base) == 8 || Number(base) == 10) {
        //         num = 16
        //         cardId = Number.parseInt(change1, Number(num));
        //         console.log(cardId)
        //     } else if (Number(base) == 0) {
        //         cardId = change1
        //     } else {
        //         num = base
        //         cardId = Number.parseInt(change1, Number(num));
        //     }
        // } else {
        //     cardId = Number.parseInt(change1, Number(num));
        // }
        // setTimeout(function () {
        //     if (("" + (Number.parseInt(change1, Number(num)))).length < 10) {
        //         var changenum = 10 - ("" + (Number.parseInt(change1, Number(num)))).length
        //         console.log(changenum)
        //         for (var a = 0; a <= changenum; a++) {
        //             cardId = '0' + Number.parseInt(change1, Number(num))

        //         }
        //     } else {
        //         cardId = Number.parseInt(change1, Number(num));
        //     }
        //     callback && callback(cardId);
        // }, 10)
        callback && callback(arg);
    });
    return ipcRenderer.sendSync("readReaderCard", {
        type: "IC"
    });
}

function readReaderCardRFID(callback) {
    ipcRenderer.on("getReaderCard", (event, arg) => {
        callback && callback(arg);
    });
    return ipcRenderer.sendSync("readReaderCard", {
        type: "RFID"
    });
}

function stopReaderCard() {
    return ipcRenderer.sendSync("stopReaderCard");
}

function readIdCard(callBack) {
    ipcRenderer.once("onDeviceIdCard", (event, arg) => {
        console.log("on id Card", arg)
        callBack && callBack(arg);
    });
    return ipcRenderer.sendSync("readIdCard");
}

function stopReadIdCard() {
    ipcRenderer.removeAllListeners("onDeviceIdCard")
    return ipcRenderer.sendSync("stopReadIdCard");

}

function startPrint(val) {
    console.log("print", val)
    return ipcRenderer.sendSync('ticketPrint', {
        content: val
    })
}

function takePicture(callBack) {
    ipcRenderer.on("onFace", (event, arg) => {
        callBack && callBack(arg)
    })
    return ipcRenderer.sendSync("takePicture");
}

function onFace(pic) {
    ipcRenderer.sendSync("onFace", pic)
}

function onPicture(pic) {
    return ipcRenderer.sendSync("onPicture", {
        pic: pic
    })
}
function setHighDoorIp(data) {
    console.log("render", JSON.stringify(data))
    data.callback && data.callback(ipcRenderer.sendSync("updateSetting", { ip: data.doorIp, rfidType: data.rfidType }))
}
function startCardDeliver() {
    return ipcRenderer.sendSync("startCardDeliver")
}

function frontCardDeliver() {
    return ipcRenderer.sendSync("frontCardDeliver")
}

function testFace(data) {
    console.log("test face")
    return ipcRenderer.sendSync("testFace", data);
}

function connectCardDeliver() {
    return ipcRenderer.sendSync("connectCardDeliver")
}
function writeDSFID(data) {
    return ipcRenderer.sendSync("writeDSFID", data)
}
function enableEAS(data) {
    return ipcRenderer.sendSync("enableEAS", data)
}
function disableEAS(data) {
    return ipcRenderer.sendSync("disableEAS", data)
}
function wordWirte(data) {
    return ipcRenderer.sendSync("wordWirte", data)
}
function readTID(data) {
    return ipcRenderer.sendSync("readTID", data)
}
export default {
    init() {
        let value = {
            readTID,
            wordWirte,
            writeDSFID,
            enableEAS,
            disableEAS,
            closeRFIDReader: closeRFIDReader,
            onFace: onFace,
            onPicture: onPicture,
            openRFIDReader: openRFIDReader,
            inventoryRFIDReader: inventoryRFIDReader,
            stopInventoryRFIDReader: stopInventoryRFIDReader,
            readIdCard: readIdCard,
            readReaderCard: readReaderCard,
            readReaderCardIC: readReaderCardIC,
            readReaderCardRFID: readReaderCardRFID,
            startPrint: startPrint,
            stopReadIdCard: stopReadIdCard,
            stopReaderCard: stopReaderCard,
            takePicture: takePicture,
            writeRFIDReaderMulti: writeRFIDReaderMulti,
            writeRFIDReaderOut: writeRFIDReaderOut,
            writeRFIDReaderIn: writeRFIDReaderIn,
            startCardDeliver: startCardDeliver,
            frontCardDeliver: frontCardDeliver,
            connectCardDeliver: connectCardDeliver,
            setHighDoorIp: setHighDoorIp,
            testFace: testFace

        }
        window.blueDevice = value;
        return value;
    }
}
