import Uuid from "uuidjs";
import fs from "fs";
import { MessageBox } from "element-ui";
import router from "../router";

const func = {
    getNextIndex(list) {
        let index = "";
        list.forEach((it, ix) => {
            if (!it.select && !index && index !== 0) {
                index = ix;
            }
        });
        return index;
    },
    getNextPath(list) {
        let prefix = ""
        if (process.env.application === 'borrow_portrait'&&!list[0].path=='/getCard/'){
            prefix = "/portrait"
        }else{
            prefix=''
        }
        return prefix+list[this.getNextIndex(list)].path;
    },
    getNextKey(list, key) {
        return list[this.getNextIndex(list)][key];
    },
    setNextTrue(list) {
        list[this.getNextIndex(list)].select = true;
        return list;
    },
    getPrevIndex(list) {
        let index = "";
        list.forEach((it, ix) => {
            if (it.select && !list[ix + 1].select) {
                index = ix;
            }
        });
        return index;
    },
    setPrevFalse(list) {
        list[this.getPrevIndex(list)].select = false;
        return list;
    },
    /**
     * 判断一个数是否是个位，个位加0
     * @param {*} number
     */
    addZero(number) {
        return number < 10 ? "0" + number : number;
    },
    /**
     * 转换身份证日期
     * @param {String} data
     */
    changeIdCardDate(data) {
        return (
            data.substring(0, 4) +
            "-" +
            data.substring(4, 6) +
            "-" +
            data.substring(6, 8)
        );
    },
    /**
     * 获取日期 返回年、月、日
     * @param {*} time 需要转化的日期
     */
    changeDate(time) {
        let date = time ? new Date(time) : new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + "-" + this.addZero(month) + "-" + this.addZero(day);
    },
    /**
     * @description:获取时间
     * @param {*} time 需要转换的时间
     * @param {array} arr 需要返回的信息的key.h:小时，m:分钟，s:秒
     */
    changeTime(time, arr) {
        let date = time ? new Date(time) : new Date();
        let dataHours = date.getHours();
        let dataMinute = date.getMinutes();
        let dataSecond = date.getSeconds();
        let info = {
            h: this.addZero(dataHours),
            m: this.addZero(dataMinute),
            s: this.addZero(dataSecond),
        };
        let str = "";
        // console.log(arr)
        arr.forEach((it, ix) => {
            str = str + info[it] + (ix < arr.length - 1 ? ":" : "");
        });
        return str;
    },
    /**
     * 转换成文件
     * @param {*} dataUrl
     * @param {*} fileName
     */
    toFile(dataUrl, fileName) {
        var arr = dataUrl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, {
            type: mime,
        });
    },
    /**
     * 提示消息
     */
    toast({ content, type, confirmBtnName, cancelBtnName, title }, cb) {
        let typeOBJ = {
            ERROR: "error",
            WARNING: "warning",
            INFO: "info",
        };
        if (!confirmBtnName && type == "ERROR") {
            confirmBtnName = "回到首页";
        }
     
        MessageBox.confirm(content, title || "提示", {
            type: typeOBJ[type],
            confirmButtonText: confirmBtnName || "确定",
            cancelButtonText: cancelBtnName || "取消",
            showCancelButton: type != "ERROR" ? true : false,
            showClose: type != "ERROR" ? true : false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
        }).then((res) => {
            switch (type) {
                case "ERROR":
                    router.replace("/");
                    break;
                case "WARNING":
                    cb && cb();
                    break;
            }
        });
        if (type == "ERROR") {
            setTimeout(()=>{
                MessageBox&&MessageBox.close(false);
                router.replace("/");
            }, 5 * 1000) 
        }
        
    },
    debounce(fn, delay) {

        let timer;
        return function () {
            let th = this;
            let args = arguments;
          if (timer) {
            clearTimeout(timer);
          }
          if(!timer){
            fn.apply(th, args);
          }
          timer = setTimeout(function () {
            timer = null;
          }, delay);
        };
      }
    /**
     * 调用屏幕系统键盘
     */
};
export default func;
