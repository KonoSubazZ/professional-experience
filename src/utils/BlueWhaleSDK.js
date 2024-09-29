
export default (()=>{
    window.addEventListener("hashchange",()=>{
        //close device
         // console.log("page chaged, close device")
         window.blueDevice.close();
    })
    window.BlueWhale = {
        //读取RFID标签
        readTag(cb){
            window.blueDevice.readTag(cb)
        },
        //归还
        checkIn(tag){
            return window.blueDevice.checkIn(tag)
        },
        //借出
        checkOut(tag){
            return window.blueDevice.checkOut(tag)
        },
        //阅读读者卡
        readPatron(cb){
            window.blueDevice.readPatron(cb)
        },
        //获取人脸分数
        validatePatronFaceScore(){

        },
        close(){
            // console.log("close")
            window.blueDevice.close()
          
        },
        takePicture(cb){
           window.blueDevice.takePicture(cb)
        },
    }


    //拦截所有的请求，检查环境
    for (let key in window.BlueWhale){
        let old = window.BlueWhale[key]
        window.BlueWhale[key] = function () {
            if(!checkEnv()){
                return
            }
            return old(...arguments);
        }
        return -1
    }
    function checkEnv() {
     if(window.blueDevice){
         return true
     }
     alert("请在蓝鲸中使用该功能")
     return  false;
    }

})();
