import request  from  './request.js'

const HOST = 'http://localhost:8082'
const WS_HOST = 'ws://localhost:8082/websocket'
/**
 * 打开rfid阅读器
 */
function openRFIDReader() {
    
   return request.get(`${HOST}/ReadAndWriting/readBlock`);
}

/**
 * 关闭rfid阅读器
 */
function closeRFIDReader() {
    return  request.get(`${HOST}/ReadAndWriting/closeBoard`);
}

/**
 * 还书-开启报警位
 */
function enableDoorAlarmBits() {
    return  request.get(`${HOST}/ReadAndWriting/returningBooks`);
}

/**
 * 借书-关闭报警位
 */
function disableDoorAlarmBits() {
    return  request.get(`${HOST}/ReadAndWriting/borrowBooks`);
}

/**
 * 通过websocket获取图书条码号
 */
function getBooksBarcode(){
    
    ws.onopen = function() {
        console.log('WebSocket 连接已经建立。');
    };
    ws.onmessage = function(event) {
        console.log('收到服务器消息：', event.data);
    };
    ws.onerror = function(event) {
        console.error('WebSocket 连接出现错误：', event);
    };
    ws.onclose = function() {
        console.log('WebSocket 连接已经关闭。');
    };
}

/**
 * 初始化reader websocket
 */

function initReaderWebsocket( ){
    return  new WebSocket(WS_HOST); 
}

export {openRFIDReader, closeRFIDReader, enableDoorAlarmBits, disableDoorAlarmBits, initReaderWebsocket}