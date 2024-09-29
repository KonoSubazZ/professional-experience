import axios from "axios";
import { showMessage } from "./status";
import { ElMessage } from "element-plus";

axios.defaults.timeout = 30 * 1000;
axios.defaults.baseURL = "/";
axios.interceptors.request.use(
  (config) => {
    // 配置请求头
    try {
      config.headers = {
        //'Content-Type':'application/x-www-form-urlencoded',   // 传参方式表单
        "Content-Type": "application/json;charset=UTF-8", // 传参方式json
        accessToken: "4476162c0ef645ec9cd0cabb0855aa4f",
      };
    } catch (err) {}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      return Promise.reject(response.data);
    } else {
      ElMessage.error("网络连接异常,请稍后再试!");
    }
  }
);
// 封装 GET POST 请求并导出
export const request = (url = "", params = {}, type = "POST") => {
  //设置 url params type 的默认值
  return new Promise((resolve, reject) => {
    let promise;
    if (type.toUpperCase() === "GET") {
      promise = axios({
        url,
        params,
      });
    } else if (type.toUpperCase() === "POST") {
      promise = axios({
        method: "POST",
        url,
        data: params,
      });
    }
    //处理返回
    promise
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
