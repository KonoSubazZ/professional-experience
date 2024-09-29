<template>
    <div>
        <div class="container" :style="height">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>套录数据导入</div>
                <div class="display_flex">

                    <el-button-group>
                        <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-left'
                            @click="lookMarc(-1)">上一条</el-button>
                        <el-button type="primary" plain icon="el-icon-caret-right" @click="lookMarc(1)">下一条</el-button>
                        <el-button type="primary" plain icon="el-icon-folder-add" @click="add">开始导入</el-button>
                        <el-button type="primary" plain icon="el-icon-delete" @click="back">删除此文件</el-button>
                        <el-button type="primary" plain icon="el-icon-setting" @click="saveSet('form')">保存配置</el-button>
                        <el-button type="danger" plain icon="el-icon-delete" @click="delSet">删除配置</el-button>
                    </el-button-group>
                </div>
            </div>
            <div class="m-b-10">
                <div class="display_flex start">
                    <div class>
                        <span class="infoName m-r-20">文件名</span>
                        <span class="infoText">{{ info.name }}</span>
                    </div>
                    <div class>
                        <span class="infoName m-r-20">编码</span>
                        <span class="infoText">{{ info.enCoding }}</span>
                    </div>
                    <div class>
                        <span class="infoName m-r-20">上传时间</span>
                        <span class="infoText">{{ getTime(now) }}</span>
                    </div>
                    <div class>
                        <span class="infoName m-r-20">Marc类型</span>
                        <span class="infoText">{{ info.marcTypeDetailName }}</span>
                    </div>
                    <div class>
                        <span class="infoName m-r-20">总记录数</span>
                        <span class="infoText">{{ totalNumber }}</span>
                    </div>
                    <div class>
                        <span class="infoName m-r-20">当前预览记录</span>
                        <span class="infoText">{{ index }}</span>
                    </div>
                </div>
            </div>
            <div class="tableBox display_flex start between padding_20 m-b-20">
                <div class="w-30">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="name" label="字段"></el-table-column>
                        <el-table-column prop="marc" label="Marc字段">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.marc" @blur="getMarcText(scope.$index, scope.row.marc)"
                                    clearable></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mineIndex" label="自定义值">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.mineIndex" clearable :disabled='scope.row.abled'
                                    v-if="!scope.row.type"></el-input>

                                <el-select v-model="scope.row.mineIndex" @change='getValue(scope.row)' clearable
                                    placeholder="请选择" v-else>
                                    <el-option v-for="item in scope.row.options" :key="item.id" :label="item.name"
                                        :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="w-60">
                    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                        <el-form-item label="配置选择">
                            <el-select v-model="chooseSet" class="w-50" clearable placeholder="请选择" @change="setFrom">
                                <el-option v-for="item in chooseSets" :key="item.id" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置名称" prop>
                            <el-input v-model="form.name" class="w-50"></el-input>
                        </el-form-item>
                        <el-form-item label="批次号">
                            <el-select v-model="form.batchId" @change='getName' clearable placeholder="请选择">
                                <el-option v-for="item in bitchList" :key="item.id" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文献流通类型">
                            <el-select v-model="form.documentCirculationTypeId" @change='getName' clearable
                                placeholder="请选择">
                                <el-option v-for="item in circulationList" :key="item.id" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--                      <el-form-item label="文献语种" >-->
                        <!--                        <el-select-->
                        <!--                            v-model="form.languageId"-->
                        <!--                            @change='getName'-->
                        <!--                            clearable-->
                        <!--                            placeholder="请选择"-->
                        <!--                        >-->
                        <!--                          <el-option-->
                        <!--                              v-for="item in languageList"-->
                        <!--                              :key="item.id"-->
                        <!--                              :label="item.name"-->
                        <!--                              :value="item.id"-->
                        <!--                          ></el-option>-->
                        <!--                        </el-select>-->
                        <!--                      </el-form-item>-->
                        <!--                      <el-form-item label="文献类型" >-->
                        <!--                        <el-select-->
                        <!--                            v-model="form.mediumId"-->
                        <!--                            @change='getName'-->
                        <!--                            clearable-->
                        <!--                            placeholder="请选择"-->
                        <!--                        >-->
                        <!--                          <el-option-->
                        <!--                              v-for="item in booksList"-->
                        <!--                              :key="item.id"-->
                        <!--                              :label="item.name"-->
                        <!--                              :value="item.id"-->
                        <!--                          ></el-option>-->
                        <!--                        </el-select>-->
                        <!--                      </el-form-item>-->
                        <el-form-item label="索书号字段" prop="callNumberStr">
                            <el-input v-model="form.callNumberStr" @blur="getCallNumberStr"
                                placeholder="例：905d,905e,905v"></el-input>
                        </el-form-item>
                        <el-form-item label="更新种次号库">
                            <el-radio-group v-model="form.isUpdateSpecies">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="是否查重">
                            <el-radio-group v-model="form.duplicate">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="书目查重字段" v-if="form.duplicate == true">
                            <el-checkbox v-model="form.isbn">ISBN</el-checkbox>
                            <el-checkbox v-model="form.positiveTitle">正题名</el-checkbox>
                            <el-checkbox v-model="form.classificationNumber">分类号</el-checkbox>
                            <el-checkbox v-model="form.speciesNumber">种次号</el-checkbox>
                            <el-checkbox v-model="form.auxiliaryNumber">辅助区分</el-checkbox>
                            <el-checkbox v-model="form.firstResponsible">著者</el-checkbox>
                            <el-checkbox v-model="form.publisher">出版社</el-checkbox>
                            <el-checkbox v-model="form.publicationDate">出版日期</el-checkbox>

                        </el-form-item>





                        <el-form-item label="书目重复处理" v-if="form.duplicate == true">
                            <el-radio-group v-model="form.repeatBook">
                                <el-radio :label="1">书目不更新 馆藏不合并</el-radio>
                                <el-radio :label="2">书目不更新 馆藏合并</el-radio>
                                <el-radio :label="3">书目更新 馆藏合并</el-radio>

                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="删除字段设置">
                            <el-input v-model="form.deleteField" placeholder="例：100,101a,200f"></el-input>
                        </el-form-item>


                    </el-form>
                </div>
            </div>

            <div class="tableBox display_flex start between padding_20">
                <div class="border-1 w-50">
                    <div class="display_flex start" v-for="(item, i) of MarcList" :key="i">
                        <div class="m-r-20">{{ item.code }}</div>
                        <div>{{ item.content }}</div>
                    </div>
                </div>
                <div class="border-1 w-50">
                    <div class="display_flex start" v-for="(item, i) of chooseMarcList" :key="i">
                        <div class="m-r-20">{{ item.code }}</div>
                        <div>{{ item.content }}</div>
                    </div>
                </div>
            </div>

            <el-dialog title="导入进度" :visible.sync="showModel" width="30%" :show-close='false' :close-on-click-modal="false">
                <div>请勿关闭当前页，否则会导致部分数据存储失败,强行关闭导致数据丢失！</div>
                <div class="m-b-20">总数：{{ countNumber.realTotalNumber }}</div>


                <el-progress :text-inside="true" :stroke-width="26" :percentage="countNumber.percentage"></el-progress>

                <span slot="footer" class="dialog-footer" v-if="showClose">
                    <el-button type="primary" @click="closeAll">关 闭</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            bus: this.bus(this),
            info: {},
            circulationList: [],
            key: '',
            countNumber: {
                nowNumber: 0,
                totalNumber: 0,
                percentage: 0
            },
            marc: [],
            bitchList: [],
            fileParent: '',
            now: '',
            chooseSet: '',
            chooseSets: [],
            MarcList: [],
            chooseMarcList: [
                { code: '文献条码', content: '' },
                { code: '单价', content: '' },

                { code: '馆藏地址', content: '' },
                { code: '图书状态', content: '' },
                { code: '索书号', content: '' }
            ],
            siColl: '',
            showModel: false,
            showClose: false,
            form: {
                repeatOne: false,
                repeatTwo: false,
                repeatThree: false,
                repeatBook: 1,
                duplicate: true,
                isUpdateSpecies: false
            },
            rules: {
                callNumberStr: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
            totalNumber: '',
            tableData: [
                { name: '文献条码', marc: '', mineIndex: '', abled: true },
                { name: '单价', marc: '', mineIndex: '', abled: true },

                { name: '馆藏地址', marc: '', mineIndex: '', type: 'select', options: [] },
                {
                    name: '图书状态',
                    marc: '',
                    mineIndex: '',
                    type: 'select',
                    options: [
                        { name: '在馆', id: 'InCollection' },
                        { name: '借出', id: 'LEND' },
                        { name: '注销', id: 'CULLING' },
                        { name: '丢失', id: 'LOST' },
                        { name: '损坏', id: 'DAMAGE' }
                    ]
                },

            ],

            index: 1,
            languageList: [],
            booksList: [],
            searchOption: [
                { key: 'InCollection', name: '在馆' },
                { key: 'LEND', name: '借出' },
                { key: 'CULLING', name: '注销' },
                { key: 'LOST', name: '丢失' },
                { key: 'DAMAGE', name: '损坏' }
            ]
        };
    },
    created() {
        this.height = this.$height();
        this.now = new Date();
        // // console.log(this.$route.query)
        if (this.$route.query.info) {
            this.info = JSON.parse(this.$route.query.info)
        }
        if (this.$route.query.marc) {
            this.totalNumber = JSON.parse(this.$route.query.marc).totalNumber
            this.marc = JSON.parse(this.$route.query.marc).list
            this.fileParent = JSON.parse(this.$route.query.marc).fileParent
            this.getMarc(this.index);
        }
        this.getSetting();
        this.getPlace();
        this.getBitch();
        this.getCirculation()
        this.getDefault()
    },
    methods: {
        getDefault() {
            this.ax.get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting')
                .then(res => {
                    this.languageList = res.languages
                    this.booksList = res.mediums
                })
        },
        getCirculation() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            }
            this.ax.get('/manage/unit/circulation/circulationParameters/getDocumentCirculationTypeAll', { params })
                .then(res => {
                    this.circulationList = res
                })
        },
        delSet() {
            if (this.chooseSet == '') {
                return
            }
            this.$confirm('是否确认删除当前选择配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ax.delete('/manage/unit/system/dataReceive/marcBookReceiveConfig?ids=' + this.chooseSet)
                    .then(res => {
                        this.chooseSet = ''
                        this.getSetting();
                        this.setFrom('')
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })

            }).catch(() => {

            });

        },
        getBitch() {
            this.ax.get('/manage/unit/general/batch', { params: { type: 'CATALOG', size: 999, platformId: JSON.parse(localStorage.getItem('user')).platform.id } })
                .then(res => {
                    this.bitchList = res.content.map(it => {
                        return { id: it.id, name: it.name };
                    });
                })
        },
        getCallNumberStr() {
            let params = {
                callNumber: this.form.callNumberStr,
                marc: this.marc[this.index - 1],
                encoding: this.info.enCoding
            }
            if (!params.callNumber) {
                return
            }
            this.ax.post('/manage/unit/system/dataReceive/getCallNumber', params)
                .then(res => {
                    this.chooseMarcList[4].content = res
                })
        },
        getMarc(index) {
            if (this.marc.length == 0) {
                return (this.MarcList = []);
            }
            this.loading();
            this.ax
                .post('/manage/unit/system/dataReceive/jxMarc', { marc: this.marc[index - 1], enCoding: this.info.enCoding })
                .then(res => {
                    // // console.log(res);
                    this.sloading();
                    res.map(it => {

                        let arr = it.content.split('\u001F')

                        // // console.log(arr)
                        it.content = arr.join('▼')
                    })
                    this.MarcList = res
                })
                .catch(res => {
                    this.sloading();
                })
        },
        getName(val) {
            // // // console.log(val)
            this.bitchList.map(it => {
                if (it.id == val) {
                    this.form.batchName = it.name
                }
            })
        },
        getPlace() {
            this.ax.get('/manage/unit/general/collectionPlace', { params: { type: 'LITERATURE', size: 999, platformId: JSON.parse(localStorage.getItem('user')).platform.id } }).then(res => {
                // // console.log(res);
                this.tableData[2].options = res.content.map(it => {
                    return { id: it.id, name: it.name };
                });
            });
        },
        getMarcText(index, val) {
            // // // console.log(this.marc)
            if (val == undefined || val == '') {
                return (this.tableData[index].mineIndex = '');
            }
            let params = {
                code: val,
                marc: this.marc[this.index - 1],
                encoding: this.info.enCoding
            };
            // // console.log(params);
            this.ax.post('/manage/unit/system/dataReceive/getMarcSonField', params).then(res => {
                // // console.log(res);
                // this.tableData[index].mineIndex = res;
                let i = this.tableData[index].options.findIndex(it => it.name == res)
                this.tableData[index].mineIndex = this.tableData[index].options[i].id;
                this.chooseMarcList[index].content = res
            });
        },
        getSetting() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            }
            this.ax.get('/manage/unit/system/dataReceive/marcBookReceiveConfig', { params }).then(res => {
                res.content.map(it => {
                    if (!it.isUpdateSpecies) {
                        it.isUpdateSpecies = false
                    }
                })
                console.log( res.content,' res.content res.content');
                this.chooseSets = res.content;
                // // console.log(this.chooseSets)
            });
        },
        lookMarc(num) {
            if (num < 0) {
                if (this.index == 1 || this.marc.length == 0) {
                    return this.$message.error('没有上一条了');
                }
                // this.index+=num
                this.getMarc((this.index += num));
            } else {
                if (this.index == this.marc.length || this.marc.length == 0) {
                    return this.$message.error('没有下一条了');
                }
                // this.index+=num
                this.getMarc((this.index += num));
            }
        },
        // 获取文字
        getValue(value) {

            value.options.map(it => {
                if (it.id == value.mineIndex) {
                    value.mineName = it.name
                    this.chooseMarcList.map(item => {
                        if (item.code == value.name) {
                            item.content = it.name
                        }
                    })
                }
            })

        },
        add() {
            this.tableData.map((it, i) => {

                if (i == 0) {

                    if (it.marc) {

                        this.form.barCodeMarc = it.marc
                    }
                    if (it.mineIndex) {
                        this.form.barCodeValue = it.mineIndex
                    }
                } else if (i == 1) {
                    if (it.marc) {
                        this.form.priceMarc = it.marc
                    }
                    if (it.mineIndex) {
                        this.form.priceValue = it.mineIndex
                    }
                } else if (i == 2) {
                    if (it.marc) {
                        this.form.collectionPlaceMarc = it.marc
                    }
                    if (it.mineIndex) {
                        this.form.collectionPlaceIdValue = it.mineIndex
                        this.form.collectionPlaceValue = it.mineName
                    }
                } else if (i == 3) {
                    if (it.marc) {
                        this.form.bookStatusMarc = it.marc
                    }
                    if (it.mineIndex) {
                        this.form.bookStatusValue = it.mineIndex

                    }
                }

            })
            this.loading();
            this.key = (Math.ceil((new Date).getTime() + Math.random() * 100000000)) + ''
            let params = {
                key: this.key,
                config: this.form,
                fileParent: this.fileParent,
                enCoding: this.info.enCoding,
                marcTypeDetailId: this.info.marcTypeDetailId
            }
            let pass = true
            this.ax.post('/manage/unit/system/dataReceive/marcBookReceive', params).then(res => {
                this.sloading();
                console.log(res)
                // this.$message.success('添加成功'+res.successNumber+'条');
                //  this.showModel = false
                this.showClose = true
                if (res.isoPath) {

                    this.FileSaver.saveAs(res.isoPath, res.isoPath)
                }
                if (res.repeatBarCodePath) {

                    // this.FileSaver(res.isoPath,'')
                    this.FileSaver.saveAs(res.repeatBarCodePath, res.repeatBarCodePath)
                }

            })
                .catch(res => {
                    this.sloading();
                    pass = false
                })
            setTimeout(() => {
                if (pass) {
                    this.getNumber()
                    this.showModel = true
                }
            }, 2000);

        },
        getNumber() {
            this.ax.get('/manage/unit/system/dataReceive/plannedSpeed', { params: { key: this.key } })
                .then(res => {
                    try {
                        this.countNumber = res
                        if (res.totalNumber != res.nowNumber && this.showModel) {

                            setTimeout(() => {
                                this.getNumber()
                            }, 1000);
                        } else {

                        }
                        if (res.nowNumber == undefined) {
                            res.nowNumber = 0
                            res.totalNumber = 0
                        }
                        this.countNumber.percentage = Math.floor(res.nowNumber / res.totalNumber * 100)
                    } catch (error) {
                        setTimeout(() => {
                            this.getNumber()
                        }, 1000);
                    }
                })
        },
        setFrom(val) {
            console.log(this.chooseSets,'vasss');
            let number = 0
            this.chooseSets.map(it => {
                if (it.id == val) {
                    this.form = it
                } else {
                    number++
                }
            })
            if (number == this.chooseSets.length) {
                this.form = {}
            }
            if (this.form.batchId) {
                this.bitchList.map(it => {
                    // // console.log(it)
                })
            }
            if (this.form.barCodeMarc) {
                this.tableData[0].marc = this.form.barCodeMarc

            }
            if (this.form.barCodeValue) {
                this.tableData[0].mineIndex = this.form.barCodeValue
                this.chooseMarcList[0].content = this.form.barCodeValue
            }
            if (this.form.priceMarc) {
                this.tableData[1].marc = this.form.priceMarc
            }
            if (this.form.priceValue) {
                this.tableData[1].mineIndex = this.form.priceValue
                this.chooseMarcList[1].content = this.form.priceValue
            }
            if (this.form.collectionPlaceMarc) {
                this.tableData[2].marc = this.form.collectionPlaceMarc
            }
            if (this.form.collectionPlaceValue) {
                let pass = false
                this.tableData[2].options.map(it => {
                    //  // console.log(this.tableData[2].options)
                    if (it.id == this.form.collectionPlaceIdValue) {

                        pass = true
                    }
                })
                if (pass) {
                    this.tableData[2].mineIndex = this.form.collectionPlaceIdValue
                    this.chooseMarcList[2].content = this.form.collectionPlaceValue
                }
            }
            if (this.form.bookStatusMarc) {
                this.tableData[3].marc = this.form.bookStatusMarc
            }
            if (this.form.bookStatusValue) {
                this.tableData[3].mineIndex = this.form.bookStatusValue
                this.searchOption.forEach(it => {
                    if (it.key == this.form.bookStatusValue) {
                        this.chooseMarcList[3].content = it.name
                    }
                })

            }
            this.getCallNumberStr()


        },
        closeAll() {
            this.showModel = false
            this.countNumber = {
                nowNumber: 0,
                totalNumber: 0,
                percentage: 0
            }
        },
        // 新增保存
        saveSet(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sloading();
                    // // console.log(this.tableData)
                    this.tableData.map((it, i) => {
                        if (i == 0) {
                            //   // // console.log(it.marc)
                            if (it.marc) {
                                //  // // console.log(t.Marc)
                                this.form.barCodeMarc = it.marc
                            }
                            if (it.mineIndex) {
                                this.form.barCodeValue = it.mineIndex
                            }
                        } else if (i == 1) {
                            if (it.marc) {
                                this.form.priceMarc = it.marc
                            }
                            if (it.mineIndex) {
                                this.form.priceValue = it.mineIndex
                            }
                        } else if (i == 2) {
                            if (it.marc) {
                                this.form.collectionPlaceMarc = it.marc
                            }
                            if (it.mineIndex) {
                                this.form.collectionPlaceIdValue = it.mineIndex
                                this.form.collectionPlaceValue = it.mineName
                            }
                        } else if (i == 3) {
                            if (it.marc) {
                                this.form.bookStatusMarc = it.marc
                            }
                            if (it.mineIndex) {
                                this.form.bookStatusValue = it.mineIndex

                            }
                        } else if (i == 4) {
                            if (it.marc) {
                                this.form.bookStatusMarc = it.marc
                            }
                            if (it.mineIndex) {
                                this.form.bookStatusValue = it.mineIndex

                            }
                        }

                    })
                    this.ax.post('/manage/unit/system/dataReceive/marcBookReceiveConfig', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.getSetting();
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
    }
};
</script>

<style scoped >
.tableBox .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 0px;
}

.infoText {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(102, 102, 102, 1);
    text-align: left;
    display: inline-block;
}

.infoName {
    text-align: right;
    display: inline-block;
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(102, 102, 102, 1);
}

.border-1 {
    border: 1px solid #ddd;
    border-right: 10px;
    height: 600px;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
    font-size: 14px;
    line-height: 30px;
    color: rgba(0, 0, 0, 1);
}
</style>
