// webScoket连接
import useWebscoketStore from '../store/modules/webScoket'
let { wsURL, platformId, httpUrl, userId } = JSON.parse(window.localStorage.getItem('setting')!)
let url = `ws://${wsURL}/api/pushMessage/${platformId},${userId}`
let useWsStore = useWebscoketStore()

export default {
    localSocket() {
        let newUrl = url.split('/')
        console.log(newUrl, '0-0-0-')
        let like = ''
        newUrl.forEach((item, index) => {
            if (index == 0) {
                like += item + '//'
            } else if (index == newUrl.length - 1) {
                like+=item
            } else if (index == 1 || index == 3) {

            } else {
                like += item + '/'
            }
        })
        // console.log(like, '看看处理之后的');
        // console.log(url,'看看url')
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket 连接已打开');
        };

        ws.onmessage = (event) => {
            let data = {
                event,
                httpUrl,
                platformId
            }
            useWsStore.useWebscoketData(data)
        };

        ws.onclose = () => {
            console.log('WebSocket 连接已关闭');
        };
    }
}