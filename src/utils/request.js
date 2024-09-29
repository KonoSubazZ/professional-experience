import axios from 'axios';
import router from '../router/index';
import Vue from 'vue';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL: '/',
    timeout: 0 //超时设置
});
import { Message } from 'element-ui';

let time;
let pass = true;
// 请求拦截器
service.interceptors.request.use(
    config => {
        try {
            config.headers['accessToken'] = JSON.parse(localStorage.getItem('user')).token;
        } catch (e) {}
        config.headers['platform'] = 'MANAGER';
        if (pass) {
            pass = false;
            time = setTimeout(res => {
                pass = true;
                if (localStorage.getItem('alone') == 1) {
                    localStorage.removeItem('alone');
                    localStorage.removeItem('user');
                    sessionStorage.clear();
                    let path = '/loginAlone?id=' + localStorage.getItem('platformId');
                    router.push(path);
                } else if (localStorage.getItem('alone') == 2) {
                    localStorage.removeItem('alone');
                    localStorage.removeItem('user');
                    sessionStorage.clear();

                    router.push('/loginAll');
                } else if (localStorage.getItem('alone') == 3) {
                    localStorage.removeItem('alone');
                    localStorage.removeItem('user');
                    sessionStorage.clear();
                    router.push('/singleVisionLogin');
                } else {
                    //    localStorage.clear()
                    sessionStorage.clear();
                    localStorage.removeItem('alone');
                    localStorage.removeItem('user');
                    router.push('/login');
                }
                Vue.prototype.sloading();
            }, 30 * 1000);
        }
        return config;
    },
    error => {
        Vue.prototype.sloading();
        // //// console.log(error);
        return Promise.reject();
    }
);

let code = '';
let times = '';
// 响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            clearTimeout(time);
            if (response.data.code == 200 || response.data.code == 204 || response.data.code == 406 || response.data.code == 0) {
                return response.data.data;
            } else if (response.data.code == 10000 || response.data.code == 401) {
                Vue.prototype.sloading();
                if (code != response.data.code) {
                    if (response.data.code === 401) {
                        Message.error({
                            message: '当前平台已过期,请联系管理员进行开通！',
                            type: 'error'
                        });
                        setTimeout(it => {
                            try {
                                if (localStorage.getItem('alone') == 1) {
                                    // localStorage.removeItem('alone')
                                    localStorage.removeItem('user');
                                    sessionStorage.clear();
                                    let path = '/loginAlone?id=' + localStorage.getItem('platformId');
                                    router.push(path);
                                } else if (localStorage.getItem('alone') == 2) {
                                    // localStorage.removeItem('alone')
                                    localStorage.removeItem('user');
                                    sessionStorage.clear();

                                    router.push('/loginAll');
                                } else if (localStorage.getItem('alone') == 3) {
                                    // localStorage.removeItem('alone')
                                    localStorage.removeItem('user');
                                    sessionStorage.clear();
                                    router.push('/singleVisionLogin');
                                } else {
                                    //    localStorage.clear()
                                    sessionStorage.clear();
                                    // localStorage.removeItem('alone')
                                    localStorage.removeItem('user');
                                    router.push('/login');
                                }
                            } catch (error) {}
                        }, 1500);
                    }
                    code = response.data.code;
                    return Promise.reject(response.data);
                } else {
                    clearInterval(times);
                    times = setInterval(() => {
                        code == '';
                    }, 6000);
                }
            } else if (response.data.code == 403) {
                // router.push({path: "/403"})
                Message.error({
                    message: '没有权限',
                    type: 'error'
                });
                Vue.prototype.sloading();
                return Promise.reject(response);
            } else {
                if (code != response.data.code) {
                    code = response.data.code;
                    console.log(response.data.message, 'codecodecode');
                    Message.error({
                        message:
                            response.data.msg == '登陆账号不存在'
                                ? '登陆账号错误'
                                : response.data.msg == '链接云端服务器失败'
                                ? '您输入的检索词检索不到数据'
                                : !response.data.msg
                                ? '人脸识别失败'
                                : response.data.msg,
                        type: 'error'
                    });
                    Vue.prototype.sloading();
                    setTimeout(() => {
                        code = '';
                    }, 300);
                }
                return Promise.reject(response.data);
            }
        } else {
            return Promise.reject(response);
        }
    },
    error => {

        if (!window.navigator.onLine) {
            
            Message.error({
                message: '当前网络不可用，请检查网络',
                type: 'error'
            });
        } else {
            Message.error({
                message: error,
                type: 'error'
            });
            times = error;
        }

        Vue.prototype.sloading();
        return Promise.reject(error);
    }
);

export default service;
