export const batchQuery = (promise, params) => {
    return new Promise((resolve, reject) => {
        promise(params).then(res => {
            const total = res?.data?.data?.totalElements
            if(total > 500) {
                const results = [null,]
                let pageNumber = params.pageNumber;
                const count = Math.floor(total / 500) 
                const min = Math.min(6, count);
                let totalIndex = pageNumber
                while(pageNumber++ < min) {
                    let index = pageNumber
                    promise({...params, pageNumber: index}).then((result) => {
                        results[index] = result.data.data.content;
                        totalIndex++
                        if((totalIndex) === min) {
                            res.data.data.content = res.data.data.content.concat(results.filter(Boolean).flat())
                            resolve(res);
                        }
                    })
                }
            } else {
                resolve(res)
            }
        },reject)
    })
}