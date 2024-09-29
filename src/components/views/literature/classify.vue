<template>
    <div class="container classify">
        <div class="display_flex start">
            <div class="w-20 m-r-10 background_f h-100">
                <div class="tree_header ">
                    <div>中国图书馆分类法第五版</div>
                    <div class="f-s-12 color_r">总种数:{{ allNumber.bookBaseNumber }}，总册数:{{ allNumber.bookNumber }}</div>
                </div>
                <div>
                    <el-tree
                        :style="'height:' + height + 'px'"
                        class="tree_body"
                        :props="props"
                        @node-expand="getNode"
                        @node-collapse="getNodes"
                        :load="loadNode"
                        lazy
                    >
                    </el-tree>
                </div>
            </div>

            <div class="w-80 background_f">
                <list
                    class="w-100"
                    :disableMeta="true"
                    :tableMeta="meta"
                    :chooseBox="true"
                    :isHeaderHeigt="30"
                    @search="search"
                    ref="list"
                    @edit="editRow"
                    @delete="deleteRow"
                    :data="tableData"
                ></list>
                <!-- <form-data :model='searchInfo' :list='searchAbleData'></form-data> -->
            </div>
        </div>
    </div>
</template>

<script>
import list from '../../view/List';
import formData from '../../view/form';

export default {
    components: {
        list,
        formData
    },
    data() {
        return {
            bus: this.bus(this),
            props: {
                label: 'label',
                children: 'zones',
                isLeaf: 'leaf'
            },
            searchAbleData: [
                { name: 'ISBN', id: 'isbn' },
                { name: '索书号', id: 'isbn' },
                { name: '题名', id: 'isbn' },
                { name: '出版社', id: 'isbn' },
                { name: '出版日期', id: 'isbn' },
                { name: '操作人', id: 'isbn', type: 'select' },
                { name: '入库时间', id: 'isbn', type: 'aroundTimes' }
            ],
            classificationNumber: null,
            allNumber: {},
            height: '',
            meta: '',
            tableData: {
                content: []
            },
            V_cableType: null //索书号显示类型
        };
    },
    created() {
        this.callNumberSettingFn();
        this.getAllNumber();
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.getManger();
        this.$nextTick(() => {
            console.log(this.$V_cableType, 'dadadsa');
        });
    },
    watch: {
        $route(val, oldval) {
            // // console.log(val)
            if (val.path == '/catalogue/literature/classify') {
                this.getAllNumber();
                this.$refs.list.doSearch();
            }
        }
    },
    methods: {
        // 新增的获取索书号显示条件
        callNumberSettingFn() {
            this.ax
                .get('/manage/unit/system/systemSettings/callNumberSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then(res => {
                    if (res.type == 'ONE') {
                        this.V_cableType = 'speciesNumber';
                    } else if (res.type == 'TWO') {
                        this.V_cableType = 'authorNumber';
                    } else if (res.type == 'THERE') {
                        this.V_cableType = 'sihms';
                    } else if (res.type == 'FOUR') {
                        this.V_cableType = 'authorNumberSZM';
                    }
                });
        },
        calcTableHeight(val) {
            setTimeout(res => {
                this.height = document.documentElement.clientHeight - 230;
            }, 100);
        },
        getAllNumber() {
            this.ax
                .get('/manage/unit/catalog/bibliography/bookBaseAndBook', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then(res => {
                    this.allNumber = res;
                });
        },
        getNodes(e) {
            // console.log(e)
            if (e.fatherId == 0) {
                this.classificationNumber = null;
            }
        },
        // 修改
        editRow(val) {
            // // console.log(val)
            let bookBase = val[0];
            this.$router.push({
                path: '/catalogue/literature/library/libraryBookInfo',
                query: { infos: JSON.stringify(bookBase) }
            });
        },
        search(val) {
            console.log(val, '======================');
            val.classificationNumber = this.classificationNumber;
            if (val.callNumber) {
                val.callNumber = val.callNumber.split('/');
                // console.log(val.callNumber)
                val.classificationNumber = val.callNumber[0];
                val.speciesNumber = val.callNumber[1];
                val.auxiliaryNumber = val.callNumber[2];
                val.callNumber = '';
            }

            this.ax.get('/manage/unit/catalog/bibliography/bookBase', { params: val }).then(res => {
                console.log(res, 'dasdas');
                let reg = /[a-zA-Z]+/;
                let objs;
                res.content.map(it => {
                    it.callNumber =
                        (it.classificationNumber ? it.classificationNumber : '') +
                        (it.speciesNumber ? `/${it.speciesNumber}` : '') +
                        (it.auxiliaryNumber ? `/${it.auxiliaryNumber}` : '');

                    let formatted = it.callNumber.replace(/(\/+)/g, '/');
                    // 分割字符串为两部分：日期和后缀数字
                    const parts = formatted.split(' ');
                    // 处理日期部分，确保格式正确
                    const datePart = formatted.replace(/^\//, '').replace(/\/*$/g, '');
                    // 拼接回完整的格式化字符串
                    it.callNumber = `${datePart}`;
                    // it.callNumber = it.classificationNumber + '/' + it.speciesNumber + '/' + it.auxiliaryNumber;
                    console.log(it.classificationNumber, 'it.classificationNumber');
                    console.log(it.speciesNumber, 'it.speciesNumber');
                    console.log(it.auxiliaryNumber, 'it.auxiliaryNumber');
                    console.log(it.callNumber, 'it.callNumber');
                    // if (it.speciesNumber) {
                    // 修改了这里
                    // it.callNumber += it[this.V_cableType] ? '/' + it[this.V_cableType] : '';
                    // }
                    // if (it.auxiliaryNumber && it.auxiliaryNumber != 'null') {
                    //   it.callNumber += '/' + it.auxiliaryNumber
                    // }

                    // 修改了这里
                    if (it.subTitle) {
                        it.positiveTitle += ':' + it.subTitle;
                    }
                    if (it.sectionTitle) {
                        it.positiveTitle += '.' + it.sectionTitle;
                    }
                    if (it.sectionNumber) {
                        it.positiveTitle += '.' + it.sectionNumber;
                    }
                    if (it.tiedTitle) {
                        it.positiveTitle += '=' + it.tiedTitle;
                    }
                    if (it.priceStr) {
                        while ((objs = it.priceStr.match(reg))) {
                            it.priceStr = it.priceStr.replace(objs[0], '');
                        }
                        return it.priceStr;
                    }
                });
                this.tableData = res;
            });
        },
        // 删除
        async deleteRow(val) {
            console.log(123, val);
            this.loading();
            let ids = val
                .map(it => {
                    return it.id;
                })
                .join(',');
            this.ax.delete('/manage/unit/catalog/bibliography/bookBase?ids=' + ids).then(res => {
                this.sloading();

                this.$message.success('删除成功');
                // this.search({})
                this.getAllNumber();
                this.bus.$emit(`flash`, res);
            });
        },
        // 获取树结构
        getClassify(fatherId) {
            return this.ax.get('/manage/unit/catalog/bibliography/classification', {
                params: {
                    fatherId,
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id
                }
            });
        },
        // 获取子级列表
        getClassList(classificationNumber) {
            if (classificationNumber == null || classificationNumber == '') {
                //  this.classificationNumber = classificationNumber
                this.ax
                    .get('/manage/unit/catalog/bibliography/bookBase', {
                        params: {
                            isOther: true,
                            platformId: JSON.parse(localStorage.getItem('user')).platform.id
                        }
                    })
                    .then(res => {
                        // console.log(res,'ssadasda')
                        let reg = /[a-zA-Z]+/;
                        let objs;
                        res.content.map(it => {
                            it.callNumber = it.classificationNumber;
                            if (it.speciesNumber) {
                                it.callNumber += '/' + it.speciesNumber;
                            }
                            if (it.auxiliaryNumber && it.auxiliaryNumber != 'null') {
                                it.callNumber += '/' + it.auxiliaryNumber;
                            }
                            if (it.priceStr) {
                                while ((objs = it.priceStr.match(reg))) {
                                    it.priceStr = it.priceStr.replace(objs[0], '');
                                }
                                return it.priceStr;
                            }
                        });
                        this.tableData = res;
                    });
            } else {
                this.classificationNumber = classificationNumber;
                this.ax
                    .get('/manage/unit/catalog/bibliography/bookBase', {
                        params: {
                            classificationNumber,
                            platformId: JSON.parse(localStorage.getItem('user')).platform.id
                        }
                    })
                    .then(res => {
                        // console.log(res)
                        let reg = /[a-zA-Z]+/;
                        let objs;
                        res.content.map(it => {
                            it.callNumber = it.classificationNumber;
                            if (it.speciesNumber) {
                                it.callNumber += '/' + it.speciesNumber;
                            }
                            if (it.auxiliaryNumber && it.auxiliaryNumber != 'null') {
                                it.callNumber += '/' + it.auxiliaryNumber;
                            }
                            if (it.priceStr) {
                                while ((objs = it.priceStr.match(reg))) {
                                    it.priceStr = it.priceStr.replace(objs[0], '');
                                }
                                return it.priceStr;
                            }
                        });
                        this.tableData = res;
                    });
            }
        },
        getNode(node) {
            // // console.log(node)
            this.getClassList(node.number, 1);
        },
        // 获取子级结构
        loadNode(node, resolve) {
            // console.log(node)
            if (node.level == 0) {
                this.getClassify(0).then(res => {
                    res = res.concat({ name: '其他', number: '', id: -1 });
                    res.map(it => {
                        it.label = `${it.number}    ${it.name}`;
                        it.dis = it.id;
                    });
                    resolve(res);
                });
            } else {
                this.loading();
                this.getClassify(node.data.id).then(res => {
                    this.getClassList(node.data.number);
                    res.map(it => {
                        it.label = `${it.number}    ${it.name}`;
                        it.dis = it.id;
                    });
                    // console.log(res)
                    resolve(res);
                    this.sloading();
                });
            }
        },
        getManger() {
            this.ax
                .get('/manage/unit/general/manager', { params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id } })
                .then(res => {
                    this.getMeta(
                        res.content.map(it => {
                            return { name: it.name, key: it.id };
                        })
                    );
                });
        },
        // 获取meta
        getMeta(ress) {
            // console.log(ress)
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
                res.edit = 'EDIT';
                res.delete = 'DELETE';
                res.insertable = false;
                res.subs = [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'displayIsbn',
                        name: 'ISBN',
                        sort: 0,
                        searchable: false
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'isbn',
                        name: 'ISBN',
                        sort: 0,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'callNumber',
                        name: '索书号',
                        sort: 1,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        name: '题名',
                        sort: 2,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'barCode',
                        name: '条码号',
                        sort: 3,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        name: '出版社',
                        sort: 3,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publicationDate',
                        name: '出版日期',
                        sort: 4,
                        searchable: true
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'copyNumber',
                        name: '复本',
                        sort: 5
                    },
                    {
                        searchable: true,
                        searchOption: ress,
                        displayInList: false,
                        key: 'managerId',
                        name: '操作人',
                        sort: 6
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'priceStr',
                        name: '价格',
                        sort: 6
                    },
                    {
                        searchable: true,
                        displayInList: false,
                        type: 'TIMESTAMP',
                        key: 'createTime',
                        name: '入库时间',
                        sort: 6
                    }
                ];

                this.meta = res;
            });
        }
    }
};
</script>

<style scoped>
.tree_header {
    width: 100%;
    padding-left: 1.19rem;
    padding-top: 0.5rem;
    height: 3.5rem;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
    box-sizing: border-box;
}

.tree_body {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
}

.classify {
    background: #f9f9f9;
}

.background_f {
    background: #fff;
    overflow: hidden;
}

.color_r {
    color: red;
}
</style>
