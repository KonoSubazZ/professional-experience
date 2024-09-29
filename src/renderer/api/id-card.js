import request  from  './request.js'
const HOST = 'http://localhost:8082'

/**
 * 打开身份证读卡器 
 */
function openIdCardDevice() {
   return request.get(`${HOST}/identityCard/openDevice`);
}

/**
 * 关闭身份证读卡器
 * @param {string} handle 
 */
function closeIdCardDevice(handle) {
    return request.get(`${HOST}/identityCard/closeDevice?handle=${handle}`);
}

/**
 * 读取身份证
 * @param {string} handle 
 */
function readIdCard(handle) {
    return request.get(`${HOST}/identityCard/deviceRead?handle=${handle}`);
}

function readIcCard(handle, block = 1, sector = 0) {
    return request.get(`${HOST}/identityCard/onReadICCard?handle=${handle}&block=${block}&sector=${sector}`);
}

export { openIdCardDevice, closeIdCardDevice, readIdCard, readIcCard }