<template>
    <div class="container Textcolor">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" />
            <el-table-column v-for="item in [
                { prop: 'OI', label: '馆标识' },
                { prop: 'tulx', label: '应用类型' },
                rfidType === 'hf' && { prop: 'EAS', label: 'EAS状态' },
                { prop: 'tmh', label: '条码号' },
                { prop: 'UID', label: rfidType === 'hf' ?'UID':'TID' },
            ]" align="center" :prop="item.prop" :label="item.label" :key="item.prop" />
        </el-table>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
    props: ['show', 'rfidType'],

    data() {
        return {
            loading: true,
            tableData: [],
            checked: false,
            type: true,
            uidSet: new Set(),
            TUOptions: [
                { label: "文献", value: '00' },
                { label: "光盘", value: '10' },
                { label: "架标/层标", value: '20' },
                { label: "读者证", value: '30' },
                { label: "设备", value: '40' },
            ],
            TUOptionsTHF: [
                { label: "文献", value: '0.0' },
                { label: "光盘", value: '1.0' },
                { label: "架标/层标", value: '2.0' },
                { label: "读者证", value: '3.0' },
                { label: "设备", value: '4.0' },
            ],
            timer: null,
            index: 0,
            arr: []
        };
    },
    watch: {
        show: {
            handler(val) {
                if (val) {
                    // window.blueDevice.inventoryRFIDReader(this.readBookId); //读标签
                    // if(this.arr[this.index]==this.arr.length-1){
                    //     window.blueDevice.stopInventoryRFIDReader();
                    // }
                    window.blueDevice.stopInventoryRFIDReader();
                    if (this.timer) {
                        clearTimeout(this.timer)
                    }
                    this.timer = setTimeout(() => {
                        this.tableData = []
                        window.blueDevice.inventoryRFIDReader(this.readBookId); //读标签
                    }, 1000);

                } else {
                    this.tableData = []
                }
              this.uidSet.clear();
            }, deep: true, immediate: true
        }
    },
    mounted() {
        window.blueDevice.getRealTag(this.setBarCode)
    },
    methods: {
        setBarCode(data) {
          requestIdleCallback((deadline) => {
            if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
              this.setTableData(data)
            }
          }, { timeout: 500 })
        },
        setTableData(info) {
            if (info) {
                const { UID: uid, result = '' } = info
                if (this.rfidType === 'hf') {
                    let [EAS, tmh, TU = '', OI = '', MMF = ''] = result.split(',');
                    if (this.uidSet.has(uid)) {
                        // let index = this.tableData.findIndex(item => item.UID === uid)
                        // this.tableData.splice(index, 1, Object.assign({}, this.tableData[index], {
                        //     UID: uid, tmh, EAS,
                        //     tulx: (this.TUOptions.find(item => item.value === TU) || {}).label || "", OI
                        // }))
                    } else {
                        this.tableData.unshift({
                            UID: uid, tmh, EAS,
                            tulx: (this.TUOptions.find(item => item.value === TU) || {}).label || "", OI
                        })
                    }
                    this.uidSet.add(uid)
                } else {
                    let TU = result.TU , OI = result.OI ,tmh = result.PII
                    if (this.uidSet.has(uid)) {
                        // let index = this.tableData.findIndex(item => item.UID === uid)
                        // this.tableData.splice(index, 1, Object.assign({}, this.tableData[index], {
                        //     UID: uid, tmh,
                        //     tulx: (this.TUOptionsTHF.find(item => item.value === TU) || {}).label || "", OI
                        // }))
                    } else {
                        this.tableData.unshift({
                            UID: uid, tmh,
                            tulx: (this.TUOptionsTHF.find(item => item.value === TU) || {}).label || "", OI
                        })
                    }
                    this.uidSet.add(uid)
                }

            }
        },
        // 开始读取
        readBookId(e) {

            if (e.length == 0) {
                return;
            }
            e.map(it => {
                this.arr = this.arr.concat(it.tag)
                ipcRenderer.sendSync('readTagData', it.tag)
            })
        },
    }
};
</script>
