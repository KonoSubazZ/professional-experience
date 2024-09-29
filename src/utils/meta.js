
export default {
    updateMeta(meta,key,cb){
        meta.subs.subs = meta.subs.map(it =>{
            if(it.key === key && cb){
                return  cb(it);
            }
            return it
        })
    },
    getMetaItem(meta,key){
        return this.getMetaItemFromList(meta.subs,key)
    },
    getMetaItemFromList(list,key){
        let items  =list.filter(item =>{
            return item.key == key
        })
        return items && items.length && items[0]
    },
    generateMeta(list,key,name,displayInList,searchable,clickable){
        return list.concat({
            key: key,
            name: name,
            clickable:clickable,
            displayInList: displayInList,
            searchable:searchable
        })
    },
    sortList(meta) {
        for (let key in arguments) {
            if (key == 0) {
                continue
            }
            let propertyKey = arguments[key]
            meta.subs = meta.subs.map(it => {
                if (it.key === propertyKey) {
                    it.sort = key
                }
                return it;
            })
        }
    }

}