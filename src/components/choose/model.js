import axios from 'axios';
import { ipcRenderer } from "electron";
import { Message } from 'element-ui';
// 按终端号码获取推送列表
const terminalNumber = localStorage.getItem("SECRETKEY")
const getPushListByTerminalNumber = `/terminalHome/getPushListByTerminalNumber?terminalNumber=${terminalNumber}`;
// 获取压缩文件路径
const getPushFileZipPath = '/terminalHome/getPushFileZipPath?pushId=';
/**
 * 
 * @param {*} param0 
 */
export const getResource = ({url,filePath,callback,showProgress,}) => {
    if(url && url.includes('http')){
        axios.get(`${url}${getPushListByTerminalNumber}`).then(res => {
            if(res?.data?.code != -1){
                const list = res?.data?.data?.list;
                console.log(list,'----list');
                if(Array.isArray(list)){
                    Promise.allSettled(list.map(item => axios.get(`${url}${getPushFileZipPath}${item.id}`)))

                    .then(result => {
                        console.log(result,'result');
                        const urlAndNames = result.map(item => {
                            const path = item.value.data?.data.resourcePath;
                            if(path){
                                const a=  {
                                    url: `${url}/${path}`,
                                    name: `${path.slice(path.lastIndexOf("\\") + 1, path.length)}`,
                                    filePath,
                                }
                                console.log(a,'aaaaaaaaaaaaaaaa------------');
                                return a
                            }
                        }).filter(Boolean);
                        console.log(urlAndNames,'---urlAndNames');
                        if(urlAndNames.length){
                            ipcRenderer.removeAllListeners(['receive-progress'])
                            ipcRenderer.on("receive-progress", (event, percent) => {
                                console.log(percent,'----percent');
                                callback(percent)
                            })
                            Message.success('准备下载');
                            showProgress();
                            console.log("开始下载!!---download-resource");
                            ipcRenderer.send('download-resource', urlAndNames)
                        }
                    })
                }
            } else {
                Message.warning("暂无数据")
            }
        })
    }
    
}