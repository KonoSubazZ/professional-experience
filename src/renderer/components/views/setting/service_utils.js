// 获取所有硬件设备的连接状态
import hardWare from "../../../api/hardWare_renderer";
const hardWareClass = hardWare.init(); //硬件类
// 刷卡器
export const cardReaderFn = () => {
  let valueData = hardWareClass.readReaderCard("IC");
  hardWareClass.stopReaderCard();
  return Number(valueData) == 0 ? true : false;
};
// 读写板
export const rfidReaderFn = () => {
  let valueData = hardWareClass.openRFIDReader();
  return Number(valueData) == 0 ? true : false;
};
// 摄像头
export const cameraFn = () => {
  return new Promise((reslove) => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput"
        );
        console.log(hasCamera,'--hasCamera');
        reslove(hasCamera)
      })
      .catch((error) => {
        console.error("获取设备列表时发生错误:", error);
        reslove(false)
      });
  });
};
// 吐卡器
export const cardDeliverFn = () => {
  let valueData = hardWareClass.connectCardDeliver();
  console.log(valueData,'吐卡器');
  return valueData;
};
// 身份证阅读器
export const readIdCardFn = () => {
  
 return new Promise((reslove)=>{
   let valueData = hardWareClass.readIdCard((data)=>{
      console.log(data,'身份证阅读器data');
      hardWareClass.stopReadIdCard();
      reslove(data?true:false)
    });
    console.log(valueData,'身份证阅读器valueData');
    if(!valueData||valueData==601){
      reslove(false)
    }
  })
  
};