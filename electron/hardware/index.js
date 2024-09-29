const RFIDReader = require('./RFIDReader');
const ICReader = require('./ICReader');
const LockDoor = require('./LockDoor');
const LockLight = require('./LockLight');
const ICReaderF750 = require('./ICReaderF750');

module.exports = {
    initDevice(){
        RFIDReader.init();
        ICReader.init();
        LockDoor.init();
        LockLight.init();
        ICReaderF750.init()
    }
}