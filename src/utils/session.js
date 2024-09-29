export default function resetSetItem  (key, newVal) {
    if (key === 'watchStorage') {
        // 创建一个StorageEvent事件
        let newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal);
    }
    if (key === 'user' || key === 'lockStatus') {
        // 创建一个StorageEvent事件
        let newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal);
    }
}

