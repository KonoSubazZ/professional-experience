import {getDateTime} from "./utils";

const fetcher = ({url,data}) => fetch(url,{
    headers:{
        "Content-Type":"application/json"
    },
    method:"post",
    body:JSON.stringify(data) // "202200003"
}).then(res => res.json()).then(res => res)


export const patronInformation = (PII) => fetcher({
    url:localStorage.getItem("tempURL") + "/sip2/patronInformation",
    data:{
        patronIdentifier:PII
    }
})
/**
 *
 * @param direction 1是进，2是出
 * @param userName
 * @param cardId
 * @returns {Promise<any>}
 */
export const addData = (direction,userName,cardId) => fetcher({
    url:localStorage.getItem("sip2URL")+"/doorData/addData",
    data:{
        ...getDateTime(),
        direction,
        userName,
        cardId,
        snName:localStorage.getItem("snName")||"",
        snCode:localStorage.getItem("snCode")
    }
})


