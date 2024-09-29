<template>
    <div class="offline-100-vh">
        <div class="offline-bar">
            读写板连接状态：
            <div :class="connectStatus" />
            {{ connectStatus === "on" ? "已连接" : "已断开" }}
            <button @click="loadDrivers" class="w69-h23">连接/断开</button>
            <div class="header-right">
                <!-- <button @click="edit" class="w70-h30">修改标签</button> -->
                <!-- <button @click="del" class="w70-h30">清空标签</button> -->
                <button @click="check" class="w70-h30">标签检测</button>
            </div>
        </div>
        <div class="offline-main">
            <label>馆标识：
                <el-input clearable v-model="OI" size="mini" class="offline-main-input" />
            </label>
            <label>载体类型：
                <el-select v-model="ztlx" clearable size="mini" class="offline-main-input">
                    <el-option v-for="item in ztlxOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </label>

            <label>
                应用类型：<el-select clearable v-model="TU" size="mini" class="offline-main-input">
                    <el-option v-for="item in rfidType === 'hf' ? TUOptions : TUHFOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </label>

            <span>
                防盗位（EAS）：
                <el-radio v-model="EAS" :disabled="rfidType == 'uhf' ? true : false" label="1">开启</el-radio>
                <el-radio v-model="EAS" :disabled="rfidType == 'uhf' ? true : false" label="0">关闭</el-radio>
            </span>
            <!-- <label for="lockTag"><input id="lockTag" type="checkbox"/> 锁定标签</label> -->
        </div>
        <div class="offline-bar">
            <label class="lay-out-m">{{ rfidType == 'hf' ? 'UID:' : 'TID:' }}
                <el-input size="mini" placeholder="请将书放入平板读卡器" disabled v-model="rfId"
                    class="input-w-layout input-w-layout-bg" />
            </label>
            <label class="lay-out-m">条码号:
                <el-input size="mini" placeholder="请扫描文献条码" key="barCode" v-model="barCode" class="input-w-layout"
                    ref="barCode" @keyup.enter.native="getSearch" />
            </label>
            <el-button type="primary" :disabled="searchDisabled" :loading="loading" @click="search" class="lay-out-m">转换
            </el-button>
            <label>
                条码号生成方式：
                <el-radio v-model="tmh" label="1">递增</el-radio>
                <el-radio v-model="tmh" label="0">递减</el-radio>
            </label>
        </div>
        <div class="offline-footer">
            <div class="left">
                <el-table height="100%" :data="tableData" style="width: 100%" >
                    <el-table-column align="center" type="index" label="序号" />
                    <el-table-column v-for="item in [
                        { prop: 'OI', label: '馆标识' },
                        { prop: 'tulx', label: '应用类型' },
                        rfidType === 'hf' && { prop: 'EAS', label: 'EAS状态' },
                        { prop: 'tmh', label: '条码号' },
                        { prop: 'UID', label: rfidType === 'hf' ? 'UID' : 'TID' },
                    ]" align="center" :prop="item.prop" :label="item.label" :key="item.prop" />

                    <el-table-column align="center" prop="zhzt" label="转换状态" width="100">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.zhzt !== '成功' ? 'danger' : 'success'" disable-transitions>
                                {{ scope.row.zhzt }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <div style="transform: translate(40%,80px)">转换数量：</div>
                <div class="number">
                    {{ zhNumber }}
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showStatus" title="请将标签放入扫描区" width="80%" :close-on-click-modal="false">
            <look :show="showStatus" :rfidType="rfidType" />
        </el-dialog>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    components: { look: () => import('./check') },

    props: ["rfidType"],
    data() {
        return {
            searchDisabled: false,
            loading: false,
            tableData: [],
            connectStatus: 'on',
            showStatus: false,
            rfId: '',
            barCode: '',
            checked: false,
            type: true,
            ztlxOptions: [
                { label: '无', value: '' },
                { label: '1 图书', value: '01' },
                { label: '2 期刊', value: '02' },
                { label: '3 非书资料', value: '03' },
                { label: '4 古籍书目', value: '04' },
                { label: '5 地方资料', value: '05' },
                { label: '6 技术标准', value: '06' },
                { label: '7 实用技术', value: '07' },
                { label: '8 音像资料', value: '08' },
                { label: '9 民国书目', value: '09' },
                { label: '10 少儿图书', value: '10' },
                { label: '11 少儿期刊', value: '11' },
            ],
            AFI: '',
            DSFID: '',
            EAS: '1',
            tmh: '1',
            //所属机构，即所属馆标识
            OI: 'CN01',
            //应用类别，即馆藏类别与状态
            TU: '00',
            TUOptions: [
                { label: "文献", value: '00' },
                { label: "光盘", value: '10' },
                { label: "架标/层标", value: '20' },
                { label: "读者证", value: '30' },
                { label: "设备", value: '40' },
            ],
            TUHFOptions: [
                { label: "文献", value: '00' },
                { label: "光盘", value: '10' },
                { label: "读者证", value: '30' },
                { label: "设备", value: '40' },
            ],
            //载体类型
            ztlx: '01',
            zhNumber: 0,
            epcStr: '',
        };
    },
    created() {
        if (this.rfidType == 'uhf') {
            this.OI = '00000'
        }
        window.blueDevice.inventoryRFIDReader(this.readBookId); //读标签

        // ipcRenderer.on("configMessage", (event, args) => {
        //     console.log("渲染进程收到的数据:", args);
        // })

    },
    mounted() {

    },
    beforeDestroy() {
        window.blueDevice.stopInventoryRFIDReader();
    },
    watch: {
        showStatus(val) {
            if (!val) {
                window.blueDevice.stopInventoryRFIDReader();
                setTimeout(() => {
                    window.blueDevice.inventoryRFIDReader(this.readBookId); //读标签
                    console.log('showStatus', this.readBookId);
                }, 1000)
            }
        },
        rfId(val) {
            if (val) {
                window.blueDevice.getSystemInfo(this.rfId)
            }
        },
        TU(val) {
            if (val != "00" && val != "10") {
                this.ztlx = ""
            }
        }
    },
    methods: {
        getSearch() {
            if (this.searchDisabled) {
                return
            }
            this.search();
        },
        check() {
            this.showStatus = true;
            window.blueDevice.stopInventoryRFIDReader();
        },
        // 开始读取
        readBookId(e) {
            // console.log(e)
            if (e.length == 0) {
                return;
            }
            // console.log('tags', e[0].tag);
            if (this.rfidType == 'uhf' ? this.epcStr == e[0].tag.EPCStr : this.rfId == e[0].tag) {
                clearTimeout(this.time);
                this.time = setTimeout((res) => {
                    this.rfId = '';
                    this.epcStr = '';
                }, 1000);
            } else {
                if (this.rfidType == 'uhf') {
                    this.rfId = e[0].tag.TID;
                    this.epcStr = e[0].tag.EPCStr;
                } else {
                    this.rfId = e[0].tag;
                }

                this.$refs.barCode.focus();
                this.$refs.barCode.select();
            }

        },
        search() {
            if (!this.rfId) {
                return this.$message.warning('请将书放入平板读卡器')
            }
            if (!this.barCode) {
                return this.$message.warning('请扫描或输入文献条码')
            }
            if (this.rfidType == 'uhf') {
                if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(this.OI) || this.OI.length > 5 || this.OI.length < 5) {
                    this.$hint.warning("馆标识必须是5位数字")
                    return
                }

                if (this.barCode.length > 14) {
                    return this.$hint.warning("文献条码长度不能大于14位")

                }
            }
            if(this.barCode.indexOf(' ')!== -1){
                this.barCode = this.barCode.replace(/[ ]/g,"");
            }
            if (this.barCode) {
                this.searchDisabled = true;
                this.loading = true;
                setTimeout(() => {
                    let status = window.blueDevice.writeRFIDReaderMulti({
                        rfid: this.rfidType == 'uhf' ? this.epcStr : this.rfId,         //UID
                        barCode: this.barCode,   //PII（条码号）
                        OwnerName: this.OI,      //馆标识
                        TU: this.TU,             //应用类型（图书、读者证）
                        ztlx: this.ztlx || "",     //载体类型
                    })
                    if (status.res === 0) {
                        this.loading = false;
                        this.$message.success("转换成功")
                    }
                    if (status.res !== 0) {
                        this.loading = false;
                        this.searchDisabled = false;
                        return this.$message.error("转换失败，请重新操作")
                    }
                    const item = {
                        OI: this.OI || '',
                        tulx: (this.TUOptions.find(item => this.TU === item.value) || {}).label || "",
                        EAS: Number(this.EAS) ? 'open' : 'close',
                        tmh: this.barCode,
                        UID: this.rfId,
                        zhzt: status.res === 0 ? "成功" : "失败"
                    }
                    this.tableData.unshift(item)
                    let code = this.barCode
                    const len = code.length
                    let temp = /[a-zA-Z]/g.test(code)
                    let pre = '', suf = ''
                    if (temp) {
                        // 有字母
                        const data = /[0-9]+(?=[^0-9]*$)/g.exec(code)
                        if (data) {
                            const index = data.index
                            const value = data[0]
                            const pre = code.substr(0, index)
                            const suf = code.substr(index)
                            //是数字
                            if ((suf == value) && (!isNaN(Number(value)))) {
                                const sufLen = suf.toString().length
                                if (Number(this.tmh)) {
                                    let result = (Number(value) + 1)
                                    result = result.toString().padStart(sufLen, '0')
                                    code = pre + result

                                } else {
                                    let result = (Number(value) - 1)
                                    if (result > 0) {
                                        result = result.toString().padStart(sufLen, '0')
                                        code = pre + result

                                    }
                                }
                            }
                        }
                    } else {
                        if (Number(this.tmh)) {
                            code++
                        } else {
                            code--
                        }
                    }
                    this.barCode = code.toString().padStart(len, 0)
                    this.zhNumber++;
                    if (this.rfidType == 'hf' && this.TU == "00") {
                        // 图书
                        window.blueDevice.writeRFIDReaderIn(this.rfId);
                        if (Number(this.EAS)) {
                            window.blueDevice.enableEAS(this.rfId)
                        } else {
                            window.blueDevice.disableEAS(this.rfId)
                        }
                        window.blueDevice.writeDSFID({
                            rfid: this.rfId,
                            DSFID: "05"
                        })
                    }
                    if (this.rfidType == 'hf' && this.TU == "30") {
                        // 读者证
                        window.blueDevice.writeAFI({
                            rfid: this.rfId,
                            AFI: "146"
                        })
                        window.blueDevice.writeDSFID({
                            rfid: this.rfId,
                            DSFID: "06"
                        })
                    }

                    this.searchDisabled = false;
                }, 1500);





            }
        },
        edit() {
            if (!this.rfId) {
                return this.$message.error('请将书放入平板读卡器');
            } else {
                this.$prompt('条码号', '修改条码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                    .then((res) => {
                        if (res && res.value) {
                            window.blueDevice.writeRFIDReaderMulti({
                                rfid: this.rfId,
                                barCode: res.value,
                            });
                            this.$message.success("操作成功")
                        }
                    })
            }
        },
        del() {
            window.blueDevice.writeRFIDReaderMulti({
                rfid: this.rfId,
                barCode: new Array(80).fill(0).join(""),
            });
            this.$message.success("操作成功")
        },
        loadDrivers() {
            if (this.connectStatus === 'on') {
                ipcRenderer.sendSync("stopInventoryRFIDReader");
                setTimeout(() => {
                    window.blueDevice.closeRFIDReader()
                    this.connectStatus = 'off';
                }, 1000)
            } else {
                ipcRenderer.sendSync("openRFIDReader");
                setTimeout(() => {
                    ipcRenderer.sendSync("inventoryRFIDReader");
                    // ipcRenderer.sendSync("gaoxiaoReads");
                    this.$message.success("连接成功")
                    this.connectStatus = 'on';
                })
            }
        }
    }
};
</script>
<style lang="less">
.el-message__content {
    font-size: 20px;
}
</style>
<style lang="less" scoped>
/deep/.el-input--mini .el-input__inner {
    height: 36px;
    color: black !important;
    font-weight: bold;
    font-size: 16px;
}
</style>
<style scoped>
.input-w-layout {
    width: 260px;
    height: 36px;
    display: inline-block;
}

.offline-main-input input::placeholder {
    color: black;
}

.offline-100-vh {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.offline-bar {
    height: 5%;
    margin: 20px 30px;
}

.offline-main {
    margin: 0 30px;
    border: 2px solid lightgray;
    padding: 50px 100px 120px 25px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.offline-footer {
    margin: 0 30px;
    height: 60vh;
    display: flex;
}

.on {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: rgb(26, 247, 72);
    transform: translateY(3px);
}

.off {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: red;
    transform: translateY(3px);
}

.header-right {
    float: right;
}

.header-right>button {
    margin: 0 20px;
}

button {
    background-color: rgb(55, 160, 252);
    border-radius: 10%;
    border: none;
    color: white;
    cursor: pointer;
}

.left {
    border: 2px solid lightgray;
    width: 70%;
}

.right {
    width: 30%;
}

.uid {
    background-color: rgb(222, 220, 221);
}

.number {
    background-color: white;
    width: 260px;
    height: 120px;
    margin: 0 auto;
    border: 2px solid lightgray;
    color: rgb(255, 172, 0);
    text-align: center;
    font-size: 80px;
    font-weight: bold;
    transform: translateY(100px);
}

.w70-h30 {
    width: 70px;
    height: 30px;
}

.w69-h23 {
    width: 73px;
    height: 23px;
    margin-left: 20px;
}

.offline-main-input {
    width: 100px;
    margin-right: 30px;
}

.lay-out-m {
    margin-right: 20px;
}

.input-w-layout-bg ::-webkit-input-placeholder {
    color: black !important;
}
</style>
