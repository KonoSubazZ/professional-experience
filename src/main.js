import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import request from './utils/request';

import axios from 'axios';

import './assets/css/zc.css';
import { Message } from 'element-ui';
import { message } from './utils/message'; //引用message要在Vue.use(ElementUI)后面，不然没有效果
import DeleteButton from './components/view/DeleteButton';
import './router/permission';
import bus from './components/common/bus';
import md5 from 'md5';
import { Base64 } from 'js-base64';

import store from './store/index';
import moment from 'moment';
import onKey from './utils/onKey';

import testJs from './utils/BlueWhaleSDK';

import FileSaver from 'file-saver';

import pinyin from 'pinyin';
import BusFactory from 'vue-happy-bus';
import filter from '@/utils/filter';
//使用全局变量引用
import echarts from 'echarts';
Vue.prototype.$messageOnce = message;
Vue.prototype.Base64 = Base64;
Vue.prototype.$echarts = echarts;
Vue.prototype.$filters = filter;
Vue.prototype.bus = BusFactory;
axios.interceptors.request.use(
    config => {
        config.headers['accessToken'] = JSON.parse(localStorage.getItem('user')).token;
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

(Vue.prototype.toFix = val => {
    return val.toFixed(2);
}),
    //http response拦截器
    axios.interceptors.response.use(
        response => {
            return response.data;
        },
        error => {
            return Promise.reject(error);
        }
    );
Vue.prototype.axios = axios;

Vue.prototype.pinyin = pinyin;

Vue.prototype.$blue = testJs;

Vue.prototype.FileSaver = FileSaver;

Vue.prototype.$platform = () => {
    return JSON.parse(localStorage.getItem('user')).platform.id;
};

Vue.prototype.md5 = md5;

Vue.prototype.onKey = onKey;

Vue.config.productionTip = false;

Vue.prototype.ax = request;

Vue.use(DeleteButton);

Vue.use(ElementUI, {
    size: 'small'
});

Vue.prototype.back = () => {
    // 返回
    //  console.log(router.app._route.path)
    bus.$emit('close', router.app._route.path);
    router.go(-1);
};
Vue.prototype.$height = res => {
    if (res != null) {
        return `height:${document.documentElement.clientHeight - res}px`;
    } else {
        return `height:${document.documentElement.clientHeight - 200}px`;
    }
};

Vue.prototype.generateMeta = (list, key, name, displayInList, searchable) => {
    return list.concat({
        key: key,
        name: name,
        displayInList: displayInList,
        searchable: searchable
    });
};

Vue.prototype.updateMeta = (meta, key, cb) => {
    meta.subs.subs = meta.subs.map(it => {
        if (it.key === key && cb) {
            return cb(it);
        }
        return it;
    });
};

Vue.prototype.getMetaItem = (meta, key) => {
    let items = meta.subs.filter(item => {
        return item.key === key;
    });
    return items && items.length && items[0];
};

Vue.prototype.toast = function(msg, type) {
    if (!msg) {
        return;
    }
    Message({ type: type || 'error', message: msg });
};

Vue.prototype.selfLoading = function(object, loading) {
    Vue.set(object, 'loading', loading);
};
let loadingInstance;

Vue.prototype.loading = function() {
    loadingInstance = app.$loading({
        lock: true,
        text: '请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.8)'
    });
};
Vue.prototype.sloading = function() {
    loadingInstance && loadingInstance.close();
};

Vue.prototype.addProperty = function(object, name, value) {
    Vue.set(object, name, value);
};

Vue.prototype.delay = function(cb, time) {
    setTimeout(
        () => {
            cb && cb();
        },
        time ? time * 1000 : 2000
    );
};

Vue.prototype.getTime = function(value, format, defaultVal) {
    if (!value) {
        return defaultVal || '';
    }
    return moment(value).format(format ? format : 'YYYY-MM-DD HH:mm:ss');
};

let app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
