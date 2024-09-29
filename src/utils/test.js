const test = () => {
    const value = {
        startReader: window.blueDevice.rfidReader.start,
        closeReader: window.blueDevice.rfidReader.close,
        checkOut: window.blueDevice.rfidReader.checkOut,
        checkIn: window.blueDevice.rfidReader.checkIn,
        startIdCard: window.blueDevice.idCard.start,
        closeIdCard: window.blueDevice.idCard.close,
        startReaderCard: window.blueDevice.readerCard.start,
        closeReaderCard: window.blueDevice.readerCard.stop,
        print: window.blueDevice.print,
        takePicture: window.blueDevice.takePicture,
    }

    return value;
}
const init = () => {
    if (window.blueDevice) {
        return test();
    } else {
        // window.open('', '_self');
        //   alert('请使用软件打开');
        //   // console.log(window)


        // window.close();
    }
}
export default init;