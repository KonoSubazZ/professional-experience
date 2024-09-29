<template>
    <div class="container">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>记到详情</div>
        </div>
        <List :style="$height(250)" :dataUrl="dataUrl" :disableMeta="true" :tableMeta="meta" @edit="editUpdate"
            :isSort="true" ref="list" @selected='selected' @delete="deleteUpdate" @create="open"
            @data="handleGetListData">
            <template slot="addition-actions">
                <el-button-group>
                    <el-button type="primary" plain icon='el-icon-circle-check' @click="rem">记到</el-button>
                    <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="andBe">合刊</el-button>
                    <el-button type="success" plain icon="el-icon-circle-plus-outline" @click="addAnd">增刊</el-button>
                    <el-button type="primary" plain icon="el-icon-back" @click="back">返回</el-button>

                </el-button-group>


            </template>
        </List>
        <!-- 弹框 -->
        <el-dialog title="记到" :visible.sync="createModel" width="60%" :close-on-click-modal="false" @close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                <div class="display_flex around m-b-20">
                    <el-form-item label="供货单位" prop="deliveryUnit" class="w-30">
                        <el-input v-model="form.deliveryUnit" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="订购年份" prop="year" class="w-30">
                        <el-input v-model="form.year" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="期" prop="cycleNumberDisplay" class="w-30">
                        <el-input v-model="form.cycleNumberDisplay" disabled></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <el-form-item label="卷" prop="volume" class="w-30">
                        <el-input v-model="form.volume" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="总期" prop="cycleName" class="w-30">
                        <el-input v-model="form.cycleName" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="价格" prop="price" class="w-30">
                        <el-input v-model="form.price" disabled></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex around m-b-20">
                    <!-- <el-form-item label="分发馆藏地点" prop="name" class="w-30">
                        <el-select v-model="form.distributiondcollectionPlaceId" placeholder="请选择" @change="getName(form.distributiondcollectionPlaceId,place)">
                            <el-option
                            v-for="item in place"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item label="复本" prop="copy" class="w-30">
                        <el-input v-model="form.copy" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="分发总量" prop="distributionNumber" class="w-30">
                        <el-input v-model="form.distributionNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="记到数量" prop="detailReceiveNumber" class="w-30">
                        <el-input v-model="form.detailReceiveNumber"></el-input>
                    </el-form-item>
                </div>



                <div class='display_flex between m-b-20'>
                    <div></div>
                    <div class="">
                        <div @click="addPlace" class="text_center cursor m-r-20">
                            <img src="../../../../assets/img/add.png" class="btn_img" />

                        </div>
                        <!-- <div
                            @click="delPlace"
                            class="text_center cursor m-r-20"
                        >
                            <img src="../../../../assets/img/del.png" class="btn_img" />

                        </div> -->
                    </div>
                </div>

                <div class="">
                    <el-table class="m-b-20" ref="multipleTable" :data="bookList" tooltip-effect="dark"
                        style="width: 100%">

                        <!-- <el-table-column type="selection" width="55"></el-table-column> -->

                        <el-table-column prop="price" align="center" label="分发馆藏地点">


                            <template slot-scope="scope">

                                <el-select v-model="scope.row.distributionCollectionPlaceId"
                                    @change="getName(scope.row.distributionCollectionPlaceId, scope.row, place)"
                                    placeholder="请选择" class="w-40">
                                    <el-option v-for="item in place" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>

                            </template>
                        </el-table-column>
                        <el-table-column prop="number" align="center" label="分类数量">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.number" class="w-20"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" class="m-r-20 color_dan"
                                    @click="delPlace(scope.row, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>




                    </el-table>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 弹框 -->
        <el-dialog title="增刊" :visible.sync="model" width="60%" :close-on-click-modal="false" @close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                <div class="display_flex around m-b-20">
                    <el-form-item label="供货单位" prop="deliveryUnit" class="w-30">
                        <el-select v-model="form.deliveryUnit" placeholder="请选择">
                            <el-option v-for="item in unit" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="订购年份" prop="year" class="w-30">
                        <el-input v-model="form.year"></el-input>
                    </el-form-item>
                    <el-form-item label="周期" prop="cycleName" class="w-30">
                        <el-select v-model="form.cycleId" placeholder="请选择" @change="getCycleName(form.cycleId, cycle)">
                            <el-option v-for="item in cycle" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>


                </div>

                <div class="display_flex around m-b-20">

                    <el-form-item label="期" prop="cycleNumber" class="w-30">
                        <el-input v-model="form.cycleNumber"></el-input>
                    </el-form-item>

                    <el-form-item label="卷" prop="volume" class="w-30">
                        <el-input v-model="form.volume"></el-input>
                    </el-form-item>
                    <el-form-item label="复本" prop="copy" class="w-30">
                        <el-input v-model="form.copy"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="分发馆藏地点" prop="name" class="w-30">
                        <el-select v-model="form.distributiondcollectionPlaceId" placeholder="请选择" @change="getName(form.distributiondcollectionPlaceId,place)">
                            <el-option
                            v-for="item in place"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->



                </div>

                <div class="display_flex around m-b-20">




                    <!-- <el-form-item label="分发总量" prop="distributionNumber" class="w-30">
                        <el-input v-model="form.distributionNumber" ></el-input>
                    </el-form-item> -->

                    <div class="w-30"></div>
                    <div class="w-30"></div>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="model = false">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import viewForm from '../../../view/form';
import List from '../../../view/List';
export default {
    components: {
        viewForm,
        List
    },
    data() {
        return {
            bus: this.bus(this),
            bookList: [],
            unit: [],
            bacth: [],
            height: '',
            meta: '',
            // id:'',
            cycle: [],
            dataUrl: '',
            place: [],
            createModel: false,
            model: false,
            form: {
                cycleNumber: 10
            },
            chooseList: [],
            rules: {
                cycleNumber: [
                    { required: true, message: '请输入整数', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            // const intValue = parseInt(value);
                            // if (isNaN(intValue) || intValue <= 0) {
                            //     callback(new Error('请输入大于0的整数'));
                            // } else {
                            //     callback();
                            // }
                            let regexp = /^[1-9]\d*$/;
                            if (!regexp.test(value)) {
                                callback(new Error('请输入大于0的整数'));

                            } {
                                callback();
                            }

                        },
                        trigger: 'blur'
                    }
                ]
            },
            lastCycleNumber: 0
        };
    },
    created() {
        this.height = this.$height();
        if (this.$route.query.id) {
            //   this.id = this.$route.query.id
            this.dataUrl = '/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=' + this.$route.query.id;
        }
        this.getBatch()
            .then(res => {
                this.getUnit();
            })
            .then(res => {
                this.metaList();
            });
        this.getPlace()
        this.getCycle()
    },
    // computed:{
    //     // 自动生产期刊
    //     cycleNumber(){

    //     }
    // },
    methods: {
        handleGetListData({ content }) {
            if (content.length === 0) {
                this.form.cycleNumber = 1
            } else {
                // 期
                let cycleNumber;
                cycleNumber = content[content.length - 1].cycleNumberDisplay
                if (cycleNumber.includes('-')) {
                    const len = cycleNumber.length
                    cycleNumber = cycleNumber.slice(len - 1)
                }

                // 自动累加最新一期
                // this.form.cycleNumber = Number(cycleNumber) + 1
                this.lastCycleNumber = Number(cycleNumber) + 1

                console.log(this.form.cycleNumber, ' this.form.cycleNumber');
            }
        },
        addPlace() {
            this.bookList.push({ distributionCollectionPlaceName: '', distributionCollectionPlaceId: '', number: '' })
        },
        delPlace(row, index) {
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                if (row.id) {
                    this.loading()
                    this.ax.delete('/manage/unit/journal/journalBookingDetail/journalBookingDetailCollection?ids=' + row.id)
                        .then(res => {
                            this.bookList.splice(index, 1)
                            this.$message.success('删除成功');
                            this.sloading()
                        })
                } else {
                    this.bookList.splice(index, 1)
                }
            }).catch(() => {

            });
        },
        // 获取地点
        getPlace() {
            this.ax.get('/manage/unit/general/collectionPlace', { params: { type: 'DISTRIBUTION', size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })
                .then(res => {
                    // console.log(res)
                    this.place = res.content
                })
        },
        // 获取周期
        getCycle() {
            this.ax.get('/manage/unit/general/cycle', { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })
                .then(res => {
                    this.cycle = res.content
                })
        },
        // 获取地名
        getName(id, name, arr) {
            arr.map(it => {
                if (it.id == id) {
                    name.distributionCollectionPlaceName = it.name
                }
            })
        },
        getCycleName(id, arr) {
            // arr.map(it => {
            //     if (it.id == id) {
            //         this.form.cycleName = it.name
            //         this.form.cycleNumber = it.number
            //     }
            // })
        },
        // 获取供应商
        getUnit() {
            return new Promise(resolve => {
                this.ax.get('/manage/unit/journal/journalBooking/deliveryUnit', { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } }).then(res => {
                    // console.log(res);
                    this.unit = res.content;
                    resolve();
                });
            });
        },
        // 获取批次
        getBatch() {
            return new Promise(resolve => {
                this.ax.get('/manage/unit/general/batch', { params: { type: 'BOOKING', size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } }).then(res => {
                    this.bacth = res.content;
                    resolve();
                });
            });
        },
        // getChoose
        selected(e) {
            // console.log(e)
            this.chooseList = e
        },
        // 合刊
        andBe() {
            if (this.chooseList.length <= 1) {
                return this.$message.error('请选择2个以上')
            }
            this.loading()
            let ids = this.chooseList.map(it => {
                return it.id
            }).join(',')
            this.ax.get('/manage/unit/journal/journalBookingDetail/journalBookingDetailJoint', { params: { ids } })
                .then(res => {
                    // // console.log()
                    this.sloading()
                    this.$message.success('保存成功');
                    this.bus.$emit(`flash_/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=${this.$route.query.id}`, res);
                })
        },
        // 记到
        rem() {
            if (this.chooseList.length != 1) {
                return this.$message.error('请选择单个')
            }
            this.form = this.chooseList[0]
            this.getRemList(this.form.id)
            this.createModel = true
        },
        // 获取记到
        getRemList(id) {
            this.ax.get('/manage/unit/journal/journalBookingDetail/journalBookingDetailCollection', { params: { id } })
                .then(res => {
                    this.bookList = res

                })
        },
        // addAnd 增刊
        addAnd() {
            this.loading()
            this.ax.post('/manage/unit/journal/journalBookingDetail/journalBookingDetailOfJournalBooking?id=' + this.$route.query.id)
                .then(res => {
                    this.sloading()
                    this.form = res
                    this.form.cycleNumber = this.lastCycleNumber
                    this.model = true
                })

        },
        close() {
            this.form = {}
        },
        editUpdate() { },
        deleteUpdate(e) {
            this.loading()
            let ids = e.map(it => {
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/journal/journalBookingDetail/journalBookingDetail?id=' + ids)
                .then(res => {

                    this.$message.success('删除成功');
                    this.bus.$emit(`flash_/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=${this.$route.query.id}`, res);
                    this.sloading()
                })
        },
        open() { },
        // 记到
        save_mar(formName) {

            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading();

                    this.ax
                        .post('/manage/unit/journal/journalBookingDetail/journalBookingDetailForNumber', this.form)
                        .then(res => {

                            if (this.bookList.length == 0) {
                                this.$message.success(res)
                                this.sloading();
                                this.bus.$emit(`flash_/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=${this.$route.query.id}`, res);

                                this.createModel = false
                                return
                            }
                            this.saveAdd(this.form.id)

                        })
                        .catch(res => {
                            this.sloading();
                        });

                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        saveAdd(id) {
            this.bookList.map(it => {
                it.journalBookingDetailId = id
            })
            this.ax.post('/manage/unit/journal/journalBookingDetail/journalBookingDetailCollection', this.bookList)
                .then(res => {
                    this.sloading();
                    this.$message.success('保存成功');
                    this.bus.$emit(`flash_/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=${this.$route.query.id}`, res);

                    this.createModel = false
                })
                .catch(res => {
                    this.sloading();
                });
        },
        // 新增保存
        save(formName) {

            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading();
                    this.ax
                        .post('/manage/unit/journal/journalBookingDetail/journalBookingDetail', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.bus.$emit(`flash_/manage/unit/journal/journalBookingDetail/journalBookingDetailById?journalBookingId=${this.$route.query.id}`, res);
                            // this.back();
                            this.model = false
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;


                }
            });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.JournalBooking' } }).then(res => {
                res.delete = 'DELETE_BOTH'
                res.edit = 'NONE'
                res.insertable = false
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'receiveStatus' || it.key == 'marcType' || it.key == 'platformId' || it.key == 'bindingStatus') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if (it.key == 'batchId') {
                        it.searchable = true;
                        it.name = '批次'
                        it.searchOption = this.bacth.map(it => {
                            let arr = {
                                key: it.id,
                                name: it.name
                            };
                            return arr;
                        });
                    }
                });

                res.subs.unshift(
                    {
                        key: 'issn',
                        name: 'ISSN',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key: 'title',
                        name: '刊名',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'cycleName',
                        name: '出版周期/总期',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'deliveryUnit',
                        name: '供货单位',
                        displayInList: false,
                        searchable: true,
                        searchOption: this.unit.map(it => {
                            let arr = {
                                key: it.name,
                                name: it.name
                            };
                            return arr;
                        })
                    },
                    {
                        key: 'year',
                        name: '订购年份',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key: 'volume',
                        name: '卷',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'price',
                        name: '价格（单卷）',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'copy',
                        name: '复本',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'cycleNumberDisplay',
                        name: '期',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'detailReceiveNumber',
                        name: '记到份数',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'note',
                        name: '备注',
                        displayInList: true,
                        searchable: false
                    },
                    {
                        key: 'receiveTime',
                        name: '记到日期',
                        type: 'TIMESTAMP',
                        displayInList: true,
                        searchable: false
                    }
                );

                this.meta = res;
                // }
            });
        }
    }
};
</script>
