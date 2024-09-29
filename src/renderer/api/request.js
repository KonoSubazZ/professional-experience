import axios from "./axios";
let instance = axios({
  timeout: 1000000,
  withCredentials: true,
});
// let httpHeader = "http://";
let httpHeader = '';
export default {
  get(url, params, headers) {
    let options = {};
    if (!params) {
      params = {};
    }
    if (params) {
      options.params = params;
    }
    if (headers) {
      options.headers = headers;
    } else {
      options.headers = {};
    }
    if (url.indexOf("http") < 0) {

      let httpUrl = localStorage.getItem("httpUrl");
      url = httpHeader + httpUrl + url;
    }
    return instance.get(url, options);
  },
  post(url, query, headers) {
    let options = {};
    if (headers) {
      options.headers = headers;
    } else {
      options.headers = {};
    }
    let httpUrl = localStorage.getItem("httpUrl");
    url = httpHeader + httpUrl + url;
    console.log(url, "路径")
    return instance.post(url, query, options);
  },
  delete(url, query, headers) {
    let options = {};

    if (headers) {
      options.headers = headers;
    } else {
      options.headers = {};
    }
    options.params = query;
    let httpUrl = localStorage.getItem("httpUrl");
    url = httpHeader + httpUrl + url;
    return instance.delete(url, options);
  },
};