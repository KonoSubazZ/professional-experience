// webScoket数据状态管理
import { defineStore } from 'pinia'
import Axios from 'axios'
// 补零
function convertToPaddedArray(num: string): string[] {
    if (num) {
        if (num.length < 5) {
            return num.padStart(5, '0').split('');
        } else if (num.length <= 7) {
            return num.split('');
        } else {
            return num.slice(0, 7).split('');
        }
    } else {
        return '00000'.split("");
    }
}
interface myData {
    number: number;
    time: string;
    type: number;
}
// 计算实时借还书
const realTime = (list: myData[]): (string | number)[] => {
    let timeX: string[] = [
        "07:00:00",
        "08:00:00",
        "09:00:00",
        "10:00:00",
        "11:00:00",
        "12:00:00",
        "13:00:00",
        "14:00:00",
        "15:00:00",
        "16:00:00",
        "17:00:00",
        "18:00:00",
        "19:00:00",
        "20:00:00",
        "21:00:00",
    ];
    let timelist: (string|number)[] = [
        "07:00:00",
        "08:00:00",
        "09:00:00",
        "10:00:00",
        "11:00:00",
        "12:00:00",
        "13:00:00",
        "14:00:00",
        "15:00:00",
        "16:00:00",
        "17:00:00",
        "18:00:00",
        "19:00:00",
        "20:00:00",
        "21:00:00",
    ];
    timeX.forEach((it,index)=>{
        list.map(e=>{
            let time = e.time.split(' ')
            if(it==time[1]){
                timelist.splice(index,1,e.number)
            }
        })
    })
    return timelist.map(item=>typeof item=='string'?0:item)
}
// 创建小仓库
let useWebscoketStore = defineStore('wenscoketStore', {
    state: () => {
        return {
            todayBorrow: 0,//今日借书数量
            todayReturn: 0,//今日还书数量
            collectionSpeciesNum: 0,//馆藏种数
            collectionCopiesNum: 0,//馆藏册数
            collectionData: {},//馆藏数据
            thisYearCollectionCopiesNum: Array(5).fill("0") as string[],//今年新增馆藏册数
            thisMonthBrowBookNum: Array(5).fill("0") as string[],//本月借书数量
            readerBorrowingRanking: [] as object[],//读者借阅排行
            classBorrowingRanking: [] as object[],//班级借阅排行
            collectionProportion: {},//五大部类馆藏占比   
            borrowingRatio: {},//五大部类借阅占比   
            totalNumberTtems: {} as any,//各项总数   
            borrowedBookNumber: [] as any,//借书数量(实时)  
            returnBookNumber: [] as any,//还书数量(实时) 
            systemConfiguration: {} as any,//系统配置
            popularBooks: [] as any,//热门图书
            newBooks: [] as any,//新书推荐
        }
    },
    actions: {
        useWebscoketData(data: any) {
            let { event, httpUrl, platformId } = data
            if (event.data == '连接成功') {
                setTimeout(() => {
                    Axios.get(`${httpUrl}/api/initWebSocketData?platformId=${platformId}`)
                }, 1000)
            } else if (event.data && event.data != '连接成功') {
                let typename = JSON.parse(event.data).typeName
                const wsData = JSON.parse(event.data)
                if (wsData.data) {
                    switch (typename) {
                        case '图书种类数量':
                            break
                        case '图书册数数量':
                            break
                        case '当日借书数量':
                            this.todayBorrow = wsData.data.number
                            break
                        case '当日还书数量':
                            this.todayReturn = wsData.data.number
                            break
                        case '本周借书数量':
                            break
                        case '本周还书数量':
                            break
                        case '当月借书数量':
                            this.thisMonthBrowBookNum = convertToPaddedArray(wsData.data.number.toString());
                            break
                        case '当月还书数量':
                            break
                        case '五大部类馆藏占比':
                            this.collectionProportion = wsData.data
                            break
                        case '五⼤部类借阅占⽐':
                            this.borrowingRatio = wsData.data
                            break
                        case '按天统计图书借阅数量':
                            this.borrowedBookNumber = realTime(wsData.data)
                            break
                        case '按天统计图书还回数量':
                            this.returnBookNumber = realTime(wsData.data)
                            break
                        case '班级借阅排行数据':
                            this.classBorrowingRanking = wsData.data
                            break
                        case '读者借阅排行数据':
                            this.readerBorrowingRanking = wsData.data
                            break
                        case '各项总数':
                            let totalNum = wsData.data[0]
                            let totalList: any = []
                            for (const key in totalNum) {
                                if (key == 'averageNumber') {//平均复本
                                    totalList[key] = { value: totalNum[key], name: '平均复本' }
                                }
                                if (key == 'bookRateNumber') {//图书利用率
                                    totalList[key] = { value: totalNum[key], name: '图书利用率' }
                                }
                                if (key == 'percapitaNumber') {//人均复本
                                    totalList[key] = { value: totalNum[key], name: '人均复本' }
                                }
                                if (key == 'readersBorrowingNumber') {//读者借阅
                                    totalList[key] = { value: totalNum[key], name: '读者借阅' }
                                }
                            }
                            this.totalNumberTtems = totalList
                            break
                        case '图书年度流通情况':
                            break
                        case '读者类型数量':
                            break
                        case '馆藏变化数据':
                            let baseNumber = 0;
                            let bookNumber = 0;
                            let collectionData: any = {
                                year: [],
                                baseNumber: [],
                                bookNumber: [],
                            }
                            wsData.data.forEach((item: { baseNumber: number; bookNumber: number, year: string }) => {
                                collectionData.year.push(item.year)
                                collectionData.baseNumber.push(item.baseNumber)
                                collectionData.bookNumber.push(item.bookNumber)
                                baseNumber += item.baseNumber;
                                bookNumber += item.bookNumber;
                            });
                            this.collectionData = collectionData
                            this.collectionSpeciesNum = baseNumber
                            this.collectionCopiesNum = bookNumber
                            let lastBookNumber = wsData.data[wsData.data.length - 1].bookNumber?.toString()
                            this.thisYearCollectionCopiesNum = convertToPaddedArray(lastBookNumber)
                            break
                        case '热门图书数据':
                            this.popularBooks = wsData.data
                            break
                        case '新书推荐数据':
                            this.newBooks = wsData.data
                            break
                        case '系统配置信息':                            
                            this.systemConfiguration = wsData.data
                            break
                    }
                }
            }
        }
    }
})
export default useWebscoketStore