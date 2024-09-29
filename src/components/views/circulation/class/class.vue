<template>
    <div class="container" :style="'height:' + height + 'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="毕业年级" name="AND">
                    <div class="display_flex m-b-20">
                        <!-- <el-input
                            class="w-20 m-r-20"
                            placeholder="毕业年级"
                          
                            v-model="form.readerUnitName"
                            clearable
                        ></el-input> -->
                        <!-- 是否校验可毕业2023-11-04新增 -->
                        <span style="font-size: 14px">是否校验：</span>
                        <el-radio-group @input="changeGraduateType" v-model="graduateType">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                        <span style="margin-left: 30px;font-size: 14px">可毕业年级：</span>
                        <!-- <el-select v-model="form.readerUnitName" class="w-20 m-r-20" clearable filterable
                            placeholder="请选择可毕业年级">
                            <el-option v-for="item in optionYear" :key="item.name" :label="item.name"
                                :value="item.name"></el-option>
                        </el-select> -->
                        <el-select filterable v-model="form.readerUnitName" clearable placeholder="请选择可毕业年级"
                            class="w-20 m-r-20">
                            <el-option hidden :key="readerUnitNameData" :label="readerUnitNameData"
                                :value="readerUnitNameData"></el-option>
                            <el-tree :current-node-key="readerUnitNameData" class="tree_body" :props="propsSelect"
                                :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current
                                lazy>
                            </el-tree>
                        </el-select>
                        <!--                      <span style="font-size: 14px">毕业类型：</span>-->
                        <!--                        <el-select-->
                        <!--                            v-model="form.do"-->
                        <!--                            class="w-20 m-r-20"-->
                        <!--                            clearable-->
                        <!--                            placeholder="请选择毕业类型"-->
                        <!--                        >-->
                        <!--                            <el-option-->
                        <!--                                v-for="item in options"-->
                        <!--                                :key="item.name"-->
                        <!--                                :label="item.name"-->
                        <!--                                :value="item.value"-->
                        <!--                            ></el-option>-->
                        <!--                        </el-select>-->
                        <span style="font-size: 14px">年级名称：</span>
                        <el-input :disabled='form.do == 2' class="w-20 m-r-20" placeholder="请输入替换年级名称"
                            v-model="form.readerUnitNameNew" clearable></el-input>

                        <el-button type="primary" plain @click="lookList">添加到毕业列表</el-button>

                        <el-button type="primary" plain @click="going">开始毕业</el-button>
                    </div>

                    <el-table v-if="tableData.length > 0" :data="tableData" style="width: 100%">
                        <!--                        <el-table-column prop="type" align="center" label="处理方式">-->
                        <!--                             <template slot-scope="scope">-->
                        <!--                                 <div>{{scope.row.type==1?'注销':'删除'}}</div>-->
                        <!--                            </template>-->
                        <!--                        </el-table-column>-->
                        <el-table-column prop="readerUnitName" align="center" label="毕业年级"></el-table-column>
                        <el-table-column prop="readerUnitNameNew" align="center" label="替换年级名称"></el-table-column>
                        <el-table-column prop="readerUnitNameNew" align="center" label="删除">
                            <template slot-scope="scope">
                                <el-button type="text" @click="delRow(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="班级升级" name="BORROW">
                    <div class="display_flex m-b-20 w-100" v-for="(item, i) of forms" :key="i">
                        <div class="display_flex w-30">
                            <span style="font-size: 14px;width: 130px">待升级年级：</span>
                            <el-select filterable v-model="forms[i].replacedName" clearable placeholder="请选择待升级年级"
                                class="w-100 m-r-20">
                                <el-option hidden :key="replacedNameData" :label="replacedNameData"
                                    :value="replacedNameData"></el-option>
                                <el-tree :current-node-key="replacedNameData" class="tree_body" :props="propsSelect"
                                    :load="loadNodeSelect"  node-key="id" highlight-current @node-click="(data, node, item) => upgradeGeneration(data, node, item, i)"
                                    lazy>
                                </el-tree>
                            </el-select>
                        </div>

                        <div class="display_flex w-30">
                            <span style="font-size: 14px;width: 130px">升级至年级：</span>
                            <el-select filterable v-model="forms[i].replaceName" clearable placeholder="请选择升级至年级"
                                class="w-100 m-r-20">
                                <el-option hidden :key="replaceNameData" :label="replaceNameData"
                                    :value="replaceNameData"></el-option>
                                <el-tree :current-node-key="replaceNameData" class="tree_body" :props="propsSelect"
                                    :load="loadNodeSelect"  node-key="id" highlight-current @node-click="(data, node, item) => upgradeTo(data, node, item, i)"
                                    lazy>
                                </el-tree>
                            </el-select>
                        </div>
                        <el-button type="text" @click="updelrows(item, i)" v-if="i != 0">删除</el-button>
                        <!--                      <el-button type="text" @click="forms.splice(i,1)" v-if="i!=0">删除</el-button>-->
                    </div>
                    <div class="m-b-20">
                        <el-button type="primary" plain icon="el-icon-plus" @click="addList">增加</el-button>
                        <el-button type="primary" plain @click="addlookLists">生成毕业列表</el-button>

                        <el-button type="primary" plain @click="goings">开始毕业</el-button>
                    </div>



                    <el-table v-if="tableData.length > 0" :data="tableData" style="width: 100%">
                        <el-table-column prop="replacedName" align="center" label="毕业年级"></el-table-column>
                        <el-table-column prop="replaceName" align="center" label="替换年级名称"></el-table-column>
                        <el-table-column prop="status" align="center" label="状态">

                        </el-table-column>
                        <el-table-column align="center" label="删除">
                            <template slot-scope="scope">
                                <el-button type="text" @click="delRow(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="读者批量更换单位" name="upload">
                    <div class="display_flex padding_20 m-b-50">
                        <div class="el-form-item__label " style="width:150px">文件名称</div>
                        <el-input v-model="input" class="w-30 m-r-20" disabled></el-input>
                        <el-upload class="upload-demo m-r-10" ref="upload"
                            action="/manage/unit/circulation/readerManagement/graduationReaderBatchFile"
                            :on-change='uploadBefore' :show-file-list='false' :data='datas' :headers='headers'
                            :on-success="handleAvatarSuccess" :file-list="fileList" :before-upload="beforeAvatarUpload"
                            :on-error='onError'>
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>

                        <el-button class="m-b-5" size="small" type="primary" @click="downModel">下载模板</el-button>
                    </div>
                    <div>
                        <el-table class="m-b-20" ref="multipleTable" :data="upLoadInfo" tooltip-effect="dark"
                            style="width: 100%">

                            <el-table-column prop="number" label="读者证号">
                            </el-table-column>

                            <el-table-column prop="name" label="读者姓名">
                            </el-table-column>



                            <el-table-column prop="gender" label="性别">
                                <template slot-scope="scope">
                                    <div>{{ scope.row.gender == 'MALE' ? '男' : '女' }}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="readerUnitName" label="单位">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
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
            input: '',
            headers: {
                accessToken: JSON.parse(localStorage.getItem("user")).token
            },
            datas: {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            },
            fileList: [],
            activeName: 'AND',
            form: {
                readerUnitName: '',
                readerUnitNameNew: '',
                do: 1
            },
            upLoadInfo: [],
            forms: [
                {
                    replacedName: '',
                    replacedName: ''
                }
            ],
            optionYear: [],
            height: '',
            options: [
                { name: '注销', value: 1 },
                { name: '删除', value: 2 }
            ],
            upgradeList: [],
            upgradeLists: [],
            tableData: [],
            graduateType: 1,//是否校验可毕业
            readerUnitNameData: "",
            replacedNameData:"",
            replaceNameData:""
        };
    },
    computed: {

    },
    created() {
        this.getUnit()
        this.getUpgrade()
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
    },
    methods: {
        handleNodeClick(node) {
            this.form.readerUnitName = node.name
            this.readerUnitNameData = node.name
        },
        upgradeGeneration(data, node, item, i){
            this.forms[i].replacedName = data.name
            this.replacedNameData = data.name
        },
        upgradeTo(data, node, item, i){
            this.forms[i].replaceName = data.name
            this.replaceNameData = data.name
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
        // 是否校验毕业
        changeGraduateType() {
            this.getUnit()
        },
        updelrows(e, i) {
            this.forms.splice(i, 1)

        },
        calcTableHeight(val) {
            setTimeout(res => {

                this.height = document.documentElement.clientHeight - 170;

            }, 100)
        },
        delRow(index) {
            // // console.log(val)
            this.tableData.splice(index, 1)
        },
        getUnit() {
            this.ax.get('/manage/unit/circulation/readerManagement/getReaderUnitList', { params: { platformId: JSON.parse(localStorage.getItem("user")).platform.id, type: this.graduateType } })
                .then(res => {
                    this.optionYear = res
                })
        },
        getUpgrade() {
            this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
                params: {
                    size: 999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus:
                        1
                }
            })
                .then(res => {
                    this.upgradeList = res.content;
                    this.upgradeLists = res.content
                })
        },
        handleClick() {
            this.tableData = []
        },
        addList() {
            this.forms.push({
                readerUnitName: '',
                readerUnitNameNew: ''
            })
        },
        lookList() {
            if (this.form.do == 1 && this.form.readerUnitNameNew == '' || this.form.readerUnitName == '') {
                return this.$message.error('请输入替换的年级名称');
            }
            let arrs = this.tableData.map(it => it.readerUnitName)
            if (arrs.includes(this.form.readerUnitName)) {
                return this.$message.error('请勿重复添加')
            }

            this.tableData.push({ type: 3, readerUnitName: this.form.readerUnitName, readerUnitNameNew: this.form.readerUnitNameNew });

        },

        addlookLists() {
            let pass = true
            this.forms.map(it => {
                // console.log(it)
                // console.log(it.replaceName=='' || it.replacedName=='')
                if (it.replaceName == '' || it.replacedName == '') {
                    pass = false
                }

            })
            if (pass) {
                let arr = JSON.stringify(this.forms)
                this.tableData = JSON.parse(arr)
            } else {
                return this.$message.error('不能为空');
            }

        },
        going() {
            if (this.tableData.length == 0) {
                return this.$message.error('请先添加毕业列表')
            }
            this.loading();
            let params = {
                graduationReaderReqList: this.tableData,
                platformId: JSON.parse(localStorage.getItem("user")).platform.id
            }

            this.ax
                .post('/manage/unit/circulation/readerManagement/graduation', params)
                .then((res) => {
                    this.$message.success('操作成功');
                    this.sloading();
                    this.tableData = [];
                    this.form.readerUnitName = '';
                    this.form.readerUnitNameNew = ''
                    this.getUnit();
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        goings() {
            this.$confirm('<div class="color_dan">此操作不可逆，是否继续执行？<div>', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                this.loading();
                this.ax
                    .post('/manage/unit/circulation/readerManagement/graduationBatch', { platformId: JSON.parse(localStorage.getItem("user")).platform.id, graduationReaderReqList: this.forms })
                    .then((res) => {
                        this.tableData = res
                        // this.$message.success('修改成功');
                        this.sloading();
                    })
                    .catch((res) => {
                        this.sloading();
                    });
            }).catch(() => {

            });

        },
        //上传
        uploadBefore(val) {

            this.input = val.name

        },
        submitUpload() {

            this.$refs.upload.submit();

        },
        beforeAvatarUpload() {
            this.loading()
        },
        onError() {
            this.sloading()
            this.$message.error('导入失败');
        },
        handleAvatarSuccess(val) {
            // console.log(val)
            this.sloading()
            if (val.data && val.data.length > 0) {
                this.upLoadInfo = val.data
                this.$message.success('导入成功');
            } else {
                this.$message.error(val.msg);
            }
        },
        downModel() {
            this.ax.get('/manage/unit/circulation/readerManagement/graduationReaderBatchExcelTemplate')
                .then(res => {
                    // console.log(res)
                    this.FileSaver(res)
                })
        },
    }
};
</script>

<style scoped>
.title_reader {
    height: 40px;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    color: #000000;
    line-height: 22px;
    border-bottom: 1px solid rgba(220, 220, 220, 1);
}

.readerHeader {
    height: 118px;
    width: 92px;
}

.color_b {
    color: #267ff9;
}

.info {
    display: inline-block;
    width: 100px;
    text-align: right;
}
</style>
