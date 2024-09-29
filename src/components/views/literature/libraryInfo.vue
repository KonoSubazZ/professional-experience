<template>
    <div class="container" :style="height">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class="">
                馆藏信息
            </div>
            <div class="display_flex">
                <div @click="delBook" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/del.png" class="btn_img" />
                    <div class="f-s-14">删除</div>
                </div>
                <div @click="save" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">保存(F8)</div>
                </div>
                <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">取消(F9)</div>
                </div>
            </div>
        </div>
        <div class="padding_40">
            <div class="display_flex between padding_40 m-b-10">
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">题名</div>
                    <el-input v-model="info.book.positiveTitle" disabled class="m-r-10"></el-input>
                </div>
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">作者</div>
                    <el-input v-model="info.book.firstResponsible" disabled class="m-r-10"></el-input>
                </div>
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">索书号</div>
                    <el-input v-model="info.book.callNumber" disabled class="m-r-10"></el-input>
                </div>
            </div>
            <div class="display_flex between padding_40 m-b-40">
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">单价</div>
                    <el-input v-model="info.book.price" disabled class="m-r-10"></el-input>
                </div>
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">*复本数</div>
                    <el-input v-model="info.defa.number" @keyup.enter.native="getBooksList" @blur="getBooksList"
                        class="m-r-10"></el-input>
                </div>
                <div class="w-30 display_flex">
                    <div class="w-15 label_title">*条码号</div>
                    <el-input v-model="code" class="m-r-10" @keyup.enter.native="getBooksList"></el-input>
                </div>
            </div>
            <div class="padding_40 cope_text">

                <!-- 展示预生成的 -->
                <div class="m-b-20">
                    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="barCode" align="center" label="条形码">
                            <template slot-scope="scope" align="center">
                                <el-input v-model="scope.row.barCode"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="price" align="center" label="单价">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.price" class="w-60"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="callNumber" align="center" label="索书号"></el-table-column>

                        <el-table-column prop="batchName" align="center" label="批次号">
                            <template slot-scope="scope" align="center">
                                <el-select v-model="scope.row.batchName"
                                    @change="changeName(scope.row.batchId, scope.row.batchName, params.batches)"
                                    class="w-90">
                                    <el-option v-for="item in params.batches" :key="item.id" :label="item.name"
                                        :value="item.name"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column prop="rackName" align="center" label="架位号">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.rackName"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="managerName" align="center" label="入库人员 "></el-table-column>

                        <el-table-column prop="warehousingTime" align="center" label="入库时间 ">
                            <template slot-scope="scope">
                                <div>{{ getTime(scope.row.warehousingTime) }}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="collectionPlaceName" align="center" label="馆藏地址 ">
                            <template slot-scope="scope" align="center">
                                <div class="display_flex">
                                    <el-select v-model="scope.row.collectionPlaceName"
                                        @change="changeName(scope.row.collectionPlaceId, scope.row.collectionPlaceName, params.collectionPlaces)"
                                        class="w-60 m-r-5" :disabled="scope.row.isPlace">
                                        <el-option v-for="item in params.collectionPlaces" :key="item.id" :label="item.name"
                                            :value="item.name"></el-option>
                                    </el-select>
                                    <el-checkbox v-model="scope.row.isPlace"
                                        @change="savePlace(scope.row.isPlace, scope.row, scope.$index)">默认</el-checkbox>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="documentCirculationTypeId" align="center" width='130' label="文献流通类型">
                            <template slot-scope="scope">
                                <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                                <el-select v-model="scope.row.documentCirculationTypeId" clearable class="w-80">
                                    <el-option v-for="item in circulationList" :key="item.id" :label="item.name"
                                        :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bookStatus" align="center" label="状态">
                            <template slot-scope="scope">
                                <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                                <el-select v-model="scope.row.bookStatus" clearable class="w-80">
                                    <el-option v-for="item in options" :key="item.key" :label="item.name"
                                        :value="item.key"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                           >
                            <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="barCode"
                            label="条形码">
                                   
                            </el-table-column>
                            <el-table-column
                            prop="price"
                            label="单价">
                            </el-table-column>
                            <el-table-column
                            prop="callNumber"
                            label="索书号">
                             </el-table-column>
                            <el-table-column
                            prop="batchName"
                            label="批次号">
                             </el-table-column>
                            <el-table-column
                            prop="collectionPlaceName"
                            label="馆藏地址 ">
                            </el-table-column>
                            <el-table-column
                            prop="bookStatus"
                            label="状态">
                                     <template slot-scope="scope" align="center">
                                         <div>
                                             {{options[scope.row.bookStatus].name}}
                                         </div>
                                    </template>
                             </el-table-column>
                        </el-table>
                        <el-pagination
                            
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="pageSize"
                            layout=" prev, pager, next, jumper,total,sizes"
                            :total="total">
                        </el-pagination>       -->

            </div>
        </div>
    </div>
</template>

<script>
export default {

    data() {
        return {
            bus: this.bus(this),
            height: '',
            changeNameTwo:null,
            loadings: false,
            changeId: null,
            // 表单信息
            tableData: [],
            code: 0,
            // 信息
            info: {
                book: {
                    code: 0
                },
                defa: {

                }

            },
            chooseBookCope: [],
            params: {},
            // index数组
            options: [],
            // 选择书本
            chooseBook: [],
            circulationList: [],
            autofill: false,
            // 页码
            currentPage: 1,
            pageSize: 5,
            click: {},
            total: 0,
            defaultSet: {}
        };

    },
    created() {
        this.getDefault()
        this.height = this.$height()
        this.info = JSON.parse(this.$route.query.info)
        this.metaLists()
        this.getCirculation()
        this.getSetting()
        this.getBook(this.info.book.id)
        document.onkeydown = (e) => {
            let key = window.event.keyCode;
            // // console.log(key)
            if (key == 120) {
                this.back()
            }
            // e
            if (key == 119) {
                this.save()
            }

        };
    },
    methods: {
        getCirculation() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            }
            this.ax.get('/manage/unit/circulation/circulationParameters/getDocumentCirculationTypeAll', { params })
                .then(res => {
                    this.circulationList = res
                })
        },
        delBook() {
            if (this.chooseBookCope.length == 0) {
                return this.$message.warning('请选择删除书本');
            }
            this.$confirm('是否确认删除当前选择?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.chooseBookCope.map(its => {
                        this.tableData.map((it, index) => {
                            if (its.barCode == it.barCode) {
                                this.tableData.splice(index, 1)
                            }
                        })
                    })

                })
                .catch(() => { });
        },
        // 选择书本
        handleSelectionChange(val) {
            this.chooseBookCope = val;
        },
        // 获取选择参数--select
        getDefault() {
            return new Promise((resolve) => {
                this.ax
                    .get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting', {
                        params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                    })
                    .then((res) => {
                        //  ////  //  // console.log(res)
                        this.params = res;
                        resolve(res);
                    });
            });
        },
        //获取默认设置
        getSetting() {
            this.ax
                .get('/manage/unit/catalog/bibliography/bookCatalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    this.defaultSet = res;
                });
        },
        getDefa() {
            // console.log(123)
            this.ax.get('/manage/unit/catalog/bibliography/bookCatalogSetting', { platformId: JSON.parse(localStorage.getItem("user")).platform.id, })
                .then(res => {
                    // console.log(res)
                    this.autofill = res.autofill

                })
        },
        // 获取书本--预生成
        getBooksList() {
            console.log(123456, '改变了');

            if (this.info.defa.number == '' || this.info.defa.number == 0 || this.code == '' || this.code == 0) {
                return;
            }
            // let price = this.cope.priceStr.toString().replace(/[^\d\.\d]/gi, '');
            let bookBase = JSON.stringify(this.formData);
            let params = {
                addNumber: this.info.defa.number,
                bookBase: this.info.book,
                code: this.code,
                price: this.info.book.price,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            params.bookBase.newMarc = '';
            this.ax.post('/manage/unit/catalog/bibliography/foreseeBook', params).then((res) => {
                // console.log(res);
                res.map((it) => {
                    it.isPlace = false;
                    it.documentCirculationTypeId = this.defaultSet.documentCirculationTypeId
                });
                if (JSON.parse(sessionStorage.getItem('setPlace'))) {
                    let arr = JSON.parse(sessionStorage.getItem('setPlace'));
                    // console.log(arr);
                    arr.map((it, index) => {
                        if (it) {
                            res[index].collectionPlaceId = it.collectionPlaceId;
                            res[index].collectionPlaceName = it.collectionPlaceName;
                            res[index].isPlace = true;
                        }
                    });
                }
                this.tableData = res
            });
        },
        getSet() {
            this.ax
                .get('/manage/unit/general/catalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, marcType: 'BOOK' }
                })
                .then(res => {

                    if (res.lastBarCode) {
                        let a = res.lastBarCode
                        this.code = a
                        this.getBooksList()
                    }
                });
        },
        // 储存
        savePlace(isTrue, val, index) {
            // console.log(index);
            if (isTrue) {
                let arr;
                if (JSON.parse(sessionStorage.getItem('setPlace'))) {
                    // console.log(isTrue);
                    arr = JSON.parse(sessionStorage.getItem('setPlace'));
                } else {
                    arr = [];
                }
                arr[index] = val;
                // console.log(arr);
                sessionStorage.setItem('setPlace', JSON.stringify(arr));
            } else {
                let arr;
                if (JSON.parse(sessionStorage.getItem('setPlace'))) {
                    // console.log(isTrue);
                    arr = JSON.parse(sessionStorage.getItem('setPlace'));
                } else {
                    arr = [];
                }
                arr[index] = '';
                // console.log(arr);
                sessionStorage.setItem('setPlace', JSON.stringify(arr));
            }
        },
        metaLists() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'bookStatus') {
                        this.options = it.searchOption;
                        it.searchOption.map((item) => {
                            this.option[item.key] = item;
                        });
                    }
                });
            });
        },
        // 下拉改变状态
        changeName(id, name, batches) {
            console.log(id, 'idddd');
            console.log(name, 'namenamename');
            console.log(batches, 'batchesbatchesbatches');
            batches.map(it => {
                if (name == it.name) {
                    this.changeId = it.id
                    this.changeNameTwo = it.name
                }
            })


        },

        // 添加实体书，多卷
        save(res) {
            let pass = true
            if (this.info.defa.number == 0) {
                return this.$message.warning('复本数不能为0');
            }
            this.tableData.map(it => {
                if (it.barCode == '') {
                    pass = false
                }
            })
            if (!pass) {
                return this.$message.warning('请输入条形码');
            }
            this.loading();
            // this.cope.bookBaseId = res.id;
            // this.cope.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            let params
            this.tableData.map(im=>{
                console.log(im,'immm');
                this.params.batches.map(it=>{
                    console.log(it,'ittt');
                if(im.batchName === it.name){
                    im.batchId = it.id
                }
            })
            })
           console.log(this.tableData,'tabData');
            // if (this.changeId !== null&&this.changeName!==null) {
            //     this.tableData.map(it=>{
            //         console.log(it,'ittt');
            //         if(it.batchId===this.changeId){
            //             it.batchId = this.changeId
            //         }
            //     })
                
            //     params = {
            //         bookBase: this.info.book,
            //         books: this.tableData
            //     };
            // } else {
            //    
            // }
            params = {
                    bookBase: this.info.book,
                    books: this.tableData
                };
            params.bookBase.newMarc = '';
            this.ax
                .post('/manage/unit/catalog/bibliography/bookNew', params)
                .then((res) => {
                    this.sloading();
                    if (JSON.parse(sessionStorage.getItem('setting')).newCheck) {
                        this.$message.success('新增成功');
                        this.back();
                    } else {
                        this.$message.success('新增成功');
                        this.getSet()
                        this.getBooksList();
                    }
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 获取信息
        getBook(bookBaseId) {
            this.ax.get('/manage/unit/catalog/bibliography/book', { params: { bookBaseId, size: this.pageSize, page: this.currentPage - 1 } })
                .then(res => {
                    this.info.book.callNumber = res.callNumber
                    this.getSet()
                })
        }
    }
};
</script>

<style scoped>
.cope_text {
    user-select: text;
}
</style>
