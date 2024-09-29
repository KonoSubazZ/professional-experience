// 请求配置
import axios from "axios";
import { ElMessage } from 'element-plus';
const request = axios.create({
    baseURL: '/',
})
request.interceptors.request.use((config) => {
    return config

})
request.interceptors.response.use((response) => {
    try {
        if (response.data.data) {
            return response.data
        }
    } catch (error) {
        ElMessage.error(response.data.msg||'网络连接失败')
    }
})
export default request;