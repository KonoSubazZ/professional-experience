import vue from "vue";
import axios from "axios";
import router from "../router";
import { Message } from "element-ui";
import global_func from "./global_func";

let http = axios.create({
    timeout: 30000,
});

http.defaults.headers.post["Content-Type"] = "application/json";
http.interceptors.request.use(
    (config) => {
        try {
        } catch (e) { }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
http.interceptors.response.use((response) => {
    let { data, code, msg } = response.data;
    if (code == 200 || code == 204 || code == 1 || code == 0) {
        return Promise.resolve({
            data: data,
            msg: msg,
        });
    } else if (code == 400) {
        // Message.error(msg);
        return Promise.reject(msg);
    } else if (code == 401 || code == 403 || code == 409 || code == 404) {
        // Message.error(msg);
        // global_func.toast({
        //     content: msg,
        //     type: "WARNING",
        // });
        return Promise.reject(msg);
    } else {
        global_func.toast({
            content: msg,
            type: "ERROR",
        });
        return Promise.reject(msg);
    }
});
export default function () {
    return http;
}
