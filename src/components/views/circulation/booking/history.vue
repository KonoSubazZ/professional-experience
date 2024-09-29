<template>
    <div class="container">
        <List
            :dataUrl="'/manage/unit/circulation/borrowingInformationInquire/borrowingInformationBorrowFalse?borrowType=2'"
            :readerUnitName="readerUnitName" :disableMeta="true" :tableMeta="meta" ref="list" @data='getData' :isHeaderHeigt='30' @search='getSearch'
            :disableTableAction='true' :chooseBox='true'>
            <template slot="addition-actions">
                <el-button-group>
                    <el-button type="primary" plain class="add " icon='el-icon-download' @click="save">导出</el-button>
                    <el-button type="primary" plain class="add " icon='el-icon-printer' @click="print">打印</el-button>
                </el-button-group>
                <!-- <div
                    @click="print"
                    class="text_center cursor m-r-20"
                >
                    <img src="../../../../assets/img/printing.png" class="btn_img" />
                    <div class="f-s-14">打印</div>
                </div>

               <div
                    @click="save"
                    class="text_center cursor m-r-20"
                >
                    <img src="../../../../assets/img/export.png" class="btn_img" />
                    <div class="f-s-14">导出</div>
                </div> -->

            </template>

            <template slot="filter">
                <div style="display: flex;">
                    <div class="m-r-20 m-b-10">
                        <el-select @change="readerUnitNameChange" filterable v-model="readerUnitName" clearable
                            placeholder="单位名称" class="w-100">
                            <el-option hidden :key="readerUnitName" :label="readerUnitName"
                                :value="readerUnitName"></el-option>
                            <el-tree :current-node-key="readerUnitName" class="tree_body" :props="propsSelect"
                                :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current
                                lazy>
                            </el-tree>
                        </el-select>
                    </div>
                </div>
            </template>

        </List>

    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {
            propsSelect: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            bus: this.bus(this),
            meta: '',
            createModel: false,
            form: {},
            rules: {
                code: [{ required: true, message: '请输入', trigger: 'blur' }],
                note: [{ required: true, message: '请输入', trigger: 'blur' }],
                name: [{ required: true, message: '请输入', trigger: 'blur' }],

            },
            data: '',
            read: [],
            unit: [],
            place: [],

            readerUnitName: ""
        };
    },
    created() {
        this.metaList();
    },
    methods: {
        handleNodeClick(node) {
            this.readerUnitName = node.name
        },
        loadNodeSelect(node, resolve) {
            if (node.level === 0) {
                this.metaListfatherSelect(resolve);
            }
            if (node.level >= 1) {
                var searchNodeID = node ? node.data.id : null;
                if (searchNodeID == null) {
                    return resolve([]);
                }
                this.metaListchildSelect(searchNodeID, resolve);
            };
        },
        metaListfatherSelect(resolve) {
            this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
                params: {
                    size: 99999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1
                }
            }).then(res => {
                return resolve(res.content);
            })
        },
        metaListchildSelect(searchNodeID, resolve) {
            this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
                params: {
                    size: 999999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1, childId: searchNodeID
                }
            }).then(res => {
                return resolve(res.content);
            })
        },
        getData(val) {
            val.content.map(it => {
                it.carrierType = it.carrierType == 0 ? '馆内' : '书柜'
            })
            this.data = val
        },
        getSearch(val) {
            // console.log(val)
            this.searchInfo = val
        },
        print() {
            let meta = [
                { name: '读者证号', key: 'readerNumber', displayInList: 'true' },
                { name: '读者姓名', key: 'readerName', displayInList: 'true' },
                { name: '正题名', key: 'positiveTitle', displayInList: 'true' },
                { name: '文献条码', key: 'barCode', displayInList: 'true' },
                { name: '索书号', key: 'callNumber', displayInList: 'true' },
                { name: '借书日期', key: 'borrowDate', displayInList: 'true' },
                { name: '归还日期', key: 'borrowBookTime', displayInList: 'true' },
            ]

            window.open(`/#/print?data=${JSON.stringify(this.data)}&meta=${JSON.stringify(meta)}`);
        },
        // 导出
        save() {
            this.loading()
            let params = this.searchInfo
            params.borrowType = 2
            this.ax.get('/manage/unit/circulation/borrowingInformationInquire/exportBorrowingInformationBorrowFalse/excel', { params })
                .then(res => {
                    this.FileSaver.saveAs(res, res.split('/')[1])
                    this.sloading()
                }).catch(err => {
                    this.sloading()
                })
        },

        getPlace() {
            return this.ax.get('/manage/unit/report/journalReport/bookCollection',
                { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })


        },
        getUnit() {
            return this.ax.get('/manage/unit/report/journalReport/readerUnit',
                { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })


        },
        getReadType() {

            return this.ax.get('/manage/unit/report/journalReport/readerType',
                { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })

        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.BorrowingInformation' } }).then(res => {
                res.insertable = false
                res.delete = 'NONE'
                res.edit = 'NONE'
                res.subs.unshift({
                    key: 'readerTypeId',
                    name: '读者类型',
                    searchable: true

                })
                res.subs.unshift({
                    key: 'name',
                    name: '读者姓名',
                    searchable: true,
                    displayInList: false
                })
                res.subs.push({
                    key: 'carrierType',
                    name: '类型',
                    searchable: false,
                    displayInList: true,
                })
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId' || it.key == 'readerId' || it.key == 'borrowAlso') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if (it.key == 'positiveTitle') {
                        it.displayInList = true
                        it.searchable = false
                    }
                    if (it.key == 'borrow') {
                        it.searchable = false
                    }
                    if (it.key == 'borrowDate' || it.key == 'borrowBookTime') {
                        it.searchable = true
                    }
                    if (it.key == 'collectionPlaceId') {
                        // console.log(data)
                        it.searchable = true
                        it.name = '馆藏地'
                        this.getPlace()
                            .then(res => {
                                it.searchOption = res.content.map(it => {
                                    return { name: it.name, key: it.id }
                                })
                            })
                    }
                    if (it.key == 'readerUnitName') {
                        it.searchable = false;
                    }
                    if (it.key == 'borrowBookTime') {
                        it.name = '归还日期'
                    }
                    if (it.key == 'readerTypeId') {
                        // console.log(data)
                        it.searchable = true
                        this.getReadType()
                            .then(res => {
                                it.searchOption = res.content.map(it => {
                                    return { name: it.name, key: it.id }
                                })
                            })


                    }
                });

                this.meta = res;
            });
        }
    }
};
</script>

<style></style>
