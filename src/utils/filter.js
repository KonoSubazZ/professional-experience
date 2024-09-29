import {ElMessageBox} from "element-plus";

const filter = {
    /**
     * 验证正数
     */
    checkPlus(val) {
        let reg = new RegExp(/^[1-9]{1}[0-9]*(\.\d*)?$/)
        return reg.test(val);
    },
    /**
     * 验证正整数
     */
    checkPositiveInteger(val) {
        let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
        return reg.test(val);
    },
    /**
     * 验证字母加数字，长度6-16
     */
    checkPassword(val, min, max) {
        let reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
        return reg.test(val)
    },
    /**
     * 验证小数位数,默认验证2位,没有小数位数返回true
     */
    checkPlaces(val, number) {
        let str = String(val);
        return str.indexOf('.') > -1 ? String(val).split('.')[1].length <= number : true;
    },
    /**
     * 验证电话
     */
    checkPhone(val) {
        let reg = new RegExp(/^1[3456789]\d{9}$/g);
        return reg.test(val)
    },
    /**
     * 验证身份证
     */
    checkIdCard(val) {
        let reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
        return reg.test(val)
    },
    /**
     * 验证中文姓名
     */
    checkName(val) {
        let reg = new RegExp(/^[\u4e00-\u9fa5]{2,20}$/);
        return reg.test(val)
    },
    toast({ content, type, confirmBtnName, cancelBtnName, title }, cb) {
        let typeOBJ = {
            ERROR: "error",
            WARNING: "warning",
            INFO: "info",
        };
        ElMessageBox.confirm(content, title || "提示", {
            type: typeOBJ[type],
            confirmButtonText: confirmBtnName || "确定",
            cancelButtonText: cancelBtnName || "取消",
            showCancelButton: type != "ERROR" ? true : false,
            showClose: type != "ERROR" ? true : false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
        })
    },
    //姓名脱敏
    hideName (val) {
        if (!val || val === '') return ''
        let name = ''
        if (val.length === 2) {
            name = val.substring(0, 1) + '*' // 截取name 字符串截取第一个字符，
        } else if (val.length === 3) {
            name = val.substring(0, 1) + '*' + val.substring(2, 3) // 截取第一个和第三个字符
        } else if (val.length === 4) {
            name = val.substring(0, 2) + '*' + '*' // 4个字隐藏后面两个
        } else if (val.length > 4) {
            name = val.substring(0, 1) // 5个字只显示第一个字
            for (let i = 0; i < val.length - 1; i++) {
                name = name + '*'
            }
        }
        return name
    }
}
export default filter