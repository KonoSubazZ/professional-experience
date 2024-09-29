import { request } from './axios';
import store from "../store";
export class UserService {

    static async getValidationCode() {   //获取图片验证码
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/getValidationCode','', 'get')
    }
    static async sendValidationSMS(params) {   //发送短信验证码
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/sendValidationSMS',params, 'post')
    }
    static async phoneLogin(params) {   //读者手机号登录
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/readerLoginByPhone',params, 'post')
    }
    static async icCardLogin(params) {   //读者读者证登录
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/readerLoginByNumber',params, 'post')
    }
    static async faceLogin(params) {   //读者人脸识别登录
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/readerLoginByFace',params, 'post')
    }
    static async sysUserLogin(params) {   //管理员登录
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request( url + '/caseClient/login/sysUserLogin',params, 'post')
    }
}

export class otherInterface {

    static async caseLogin(params,http) {
        console.log(params,'params');
        console.log(http,'http');
        //let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
            //保存书柜配置接口
        return request(http + '/caseClient/front/caseLogin',params,'post')
    }
    static async getBookCaseInfo(params) {    //根据书柜硬件唯一标识UUID查询书柜信息接口
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getBookCaseInfo',params,'post')
    }
    static async getBookInfo(params) {    //根据格子编号或者图书名称查询图书信息和所在格子编号接口
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getBookInfo',params,'post')
    }
    static async getBookDetail(params) {    //根据图书条码号查询图书详情
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/bookDetail',params,'get')
    }
    static async getLackBookInfo(params) {    //根据当前盘点的图书对比获取格子里少的或多的图书条码号
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getLackBookInfo',params,'post')
    }
    static async checkOperatingBook(params) {    //借书、还书、续借等操作图书前预检查
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/checkOperatingBook',params,'post')
    }
    static async checkReaderAndCase(params) {    //通过格子操作图书预检查
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/checkReaderAndCase',params,'post')
    }
    static async operatingBook(params) {    //借书、还书、续借等操作图书
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/operatingBook',params,'post')
    }
    static async getLatticeNoOfBack(params) {    //还书，根据规则返回可以放书的格子编号
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getLatticeNoOfBack',params,'post')
    }
    static async getMyBorrow(params) {    //我的借阅列表
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getBorrowingInformationBorrowFalse',params,'post')
    }
    static async getBookSort(params) {    //图书借阅排行榜
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getBorrowingInformationRanking',params,'post')
    }
    static async getReaderOtherInfo(params) {    //获取读者最大借书量和待还图书数量
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getReaderOtherInfo',params,'post')
    }
    static async getCompanyInfo(params) {    //获取关于我们
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getCompanyInfo',params,'get')
    }
    static async sendMail(params) {    //发送柜门未关闭邮件
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/sendMail',params,'get')
    }
    static async getBookList(params) {    //获取所有在柜图书列表-分页
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getBookList',params,'get')
    }
    static async searchBook(params) {    //获取所有在柜图书列表-分页
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/searchBook',params,'post')
    }
    static async getBookDetail(params) {    //获取图书详情
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/hardware/interface/bookDetail',params,'post')
    }
    static async getNotice(params) {    //根据通知id获取通知详情
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');
        return request(url + '/caseClient/front/getNoticeById',params,'get')
    }
    static async weather(params) {    //天气接口
        return request('https://v0.yiketianqi.com/free/day',params,'get')
    }
    static async randomLove(params) {    //随机语句接口
        return request('https://api.mcloc.cn/words',params,'get')
    }
    //关联图书
    static async relevanceBookAPI(params) {  
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');  
        // return request('/bookCaseAdmin/case/caseInfo/relationBook',params,'post')
        return request(url+'/caseClient/front/relationBook',params,'post')
    }
    //获取书柜关联图书列表
    static async getCaseAndBookListAPI(params) {  
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http');  
        return request(url+'/caseClient/front/getBookList',params,'get')
    }
    // 书柜解绑图书
    static async unbindingBookAPI(params) { 
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http'); 
        return request(url+'/caseClient/front/unbindingCaseAndBook',params,'post')
    }

    /**
     * 开锁异常短信
     * @param {*} params 
     * @returns 
     */
    static async sendUnlockedSMS(params) { 
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http'); 
        return request(url+'/caseClient/front/unlockException',params,'get')
    }

    /**
     * 盘点异常短信
     * @param {*} params 
     * @returns 
     */
    static async sendUnInventorySMS(params) { 
        let url = store.state.platform.info ? store.state.platform.info.http :localStorage.getItem('http'); 
        return request(url+'/caseClient/front/inventoryAbnormality',params,'get')
    }
}




