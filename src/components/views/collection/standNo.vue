<template>
    <div>
        <div class="container libraryInfo">
            <div class="padding_20">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="架位查询" name="first">
                        <div class="fromFirst" :style="'height:' + height + 'px'">
                            <List :dataUrl="'/manage/unit/catalog/collectionHandling/rackBook'" :disableMeta="true"
                                :tableMeta="meta" @edit="editBook" @search="search" :isHeaderHeigt="100" :delName="'删除架位'"
                                ref="list" :chooseBox="true" @delete="deleteBook">
                                <template slot="addition-actions" class="display_flex">
                                    <!-- <div @click="doEx" class="text_center cursor m-r-20">
                                        <img src="../../../assets/img/ocap.png" class="btn_img" />
                                        <div class="f-s-14 noWrap">导出</div>
                                    </div> -->
                                    <el-button type="primary" plain @click="deleteBookall"
                                        icon="el-icon-delete">清除本页架位号</el-button>
                                    <el-button type="primary" plain @click="deleteBookallAll"
                                        icon="el-icon-delete">一键清除所有架位号</el-button>
                                    <el-button type="primary" plain @click="doEx" icon="el-icon-download">导出</el-button>
                                </template>
                            </List>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="架位号设定" name="second">
                        <!-- <div :style="'height:' + height2 + 'px'"> -->
                        <List :dataUrl="'/manage/unit/catalog/collectionHandling/rack'" :disableMeta="true"
                            :tableMeta="metas" @data="data" :isHeaderHeigt="100" @edit="editUpdate" ref="list"
                            @delete="deleteUpdate" @create="open" @selected="selectBox" :chooseBox="true">
                            <template slot="addition-actions" class="display_flex">
                                <el-button type="primary" plain @click="batchSet">批量设置架位号</el-button>

                                <el-button type="primary" plain icon="el-icon-download" @click="doBatch">导出</el-button>
                                <!-- <div @click="doBatch" class="text_center cursor m-r-20">
                                        <img src="../../../assets/img/ocap.png" class="btn_img" />
                                        <div class="f-s-14 noWrap">导出</div>
                                    </div> -->
                            </template>
                            <template slot="addition-table-actions" slot-scope="scope">
                                <el-button type="primary" size="text" class="m-r-10"
                                    @click="deal(scope.item.row)">编辑详情</el-button>

                                <el-button type="primary" size="text" class="m-r-10"
                                    @click="setBook(scope.item.row)">设置书本架位号</el-button>
                            </template>
                        </List>
                        <!-- </div> -->
                    </el-tab-pane>
                    <el-tab-pane label="扫描入库" name="scanWarehousing">
                        <div class="padding_20"
                            style="height: 100%;padding-bottom: 2.5rem; box-sizing: border-box;background-color: #fff;">
                            <div class="top" style="height: 10%;">
                                <div style="width:60%;height:100%;display: flex;align-items: center; margin-bottom: 20px;">
                                    <el-cascader :debounce="0" :props="props" :before-filter="query" filterable
                                        placeholder="架位号" class="inputClass" style="flex: 1;" v-model="formData.rackName"
                                        :options="options" @change="handleChange"></el-cascader>
                                    <el-input @blur=layerFrameFn @keyup.enter.native="layerFrameFn" ref="layerFrameNumber"
                                        style="flex: 1;" class="inputClass" clearable v-model="formData.layerFrameNumber"
                                        placeholder="层架编号"></el-input>
                                    <el-input clearable @keyup.enter.native="barCodeFn" ref="barCode" style="flex: 1;"
                                        class="inputClass" v-model="formData.barCode" placeholder="条码号"></el-input>
                                    <el-button @click="barCodeFn" style="margin-left: 20px;" type="primary">上架</el-button>
                                </div>
                            </div>
                            <div class="center" :style="'height:' + tablePadding + 'px'">
                                <el-table :header-cell-style="{ 'text-align': 'center' }" height="95%" :data="tableData"
                                    border style="width: 100%">
                                    <el-table-column align="center" type="index" label="序号" width="100">
                                    </el-table-column>
                                    <el-table-column align="center" prop="rackname" label="架位详情" width="180">
                                    </el-table-column>
                                    <el-table-column align="center" prop="barCode" label="条码号" width="180">
                                    </el-table-column>
                                    <el-table-column align="center" prop="positiveTitle" label="题名"></el-table-column>
                                    <el-table-column align="center" prop="createTime" label="入库时间">
                                        <template slot-scope="scope">
                                            <span>{{ new Date(scope.row.createTime).toLocaleString() }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="createTime" label="状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.state !== '上架失败'" style="color:#67C23A ;">{{
                                                scope.row.state
                                            }}</span>
                                            <span v-else style="color:#F56C6C ;">{{ scope.row.state }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="footer"
                                    style="height: 10%;display: flex;align-items: center;justify-content: flex-end">
                                    <el-pagination background @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange" :current-page="page"
                                        :page-sizes="[20, 100, 300, 500]" :page-size="size"
                                        layout="total, sizes, prev, pager, next, jumper" :total="this.listData.length">
                                    </el-pagination>
                                </div>
                            </div>

                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="批量设定" name="thr">
                        <div :style="'height:' + height3 + 'px'">
                            <div class="display_flex between padding20">
                                <div class="display_flex">
                                    <div class="el-form-item__label" style="width: 120px">文件名称</div>
                                    <el-input v-model="input" class="w-100 m-r-20" disabled></el-input>
                                </div>
                                <div class="display_flex">
                                    <el-button class="m-b-5" style="margin-right: 10px;" size="small" type="primary"
                                        @click="custom">自定义导入</el-button>
                                    <el-upload class="upload-demo m-r-10" ref="upload"
                                        action="/manage/unit/catalog/collectionHandling/rackUploadNewFile"
                                        :on-change="uploadBefore" :show-file-list="false" :data="datas" :headers="headers"
                                        :accept="'.xls,.xlsx'" :on-success="handleAvatarSuccess" :file-list="fileList"
                                        :before-upload="beforeAvatarUpload" :on-error="onError">
                                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                    </el-upload>
                                    <el-button class="m-b-5" size="small" type="primary" @click="downModel">下载模板</el-button>
                                </div>
                            </div>

                            <div>
                                <el-table class="m-b-20" ref="multipleTable" :data="upLoadInfo" tooltip-effect="dark"
                                    style="width: 100%">
                                    <el-table-column prop="name" label="架位号"> </el-table-column>

                                    <el-table-column prop="barCodes" label="文献条码"> </el-table-column>

                                    <el-table-column prop="startRange" label="索书号开始"> </el-table-column>

                                    <el-table-column prop="endRange" label="索书号结尾"> </el-table-column>
                                </el-table>
                            </div>
                            <!-- 自定义导入弹框 -->
                            <el-dialog width="30%" title="自定义架位号设定" :visible.sync="customTableVisible">
                                <div style="display: flex; flex-wrap: wrap;justify-content: space-around">
                                    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                                        ref="customupload" :http-request="customhandleAvatarSuccess" :headers="headers"
                                        :file-list="fileList">
                                        <el-button style="height:35px;" size="small" type="primary">选取文件</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">导入成功</div> -->
                                    </el-upload>
                                    <el-button style="height:35px;" class="m-b-5" size="small" type="primary"
                                        @click="customdownModel">下载模板</el-button>

                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="customTableVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="customTableVisible = false">确 定</el-button>
                                </span>
                            </el-dialog>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog title="架位号编辑" :visible.sync="model" @close="close" width="25%" :close-on-click-modal="false">
            <el-form :model="defa" :rules="rules" ref="defa" label-width="124px" class="m-b-30">
                <el-form-item label="架位号名称" prop="name" class="m-r-10">
                    <el-input placeholder="请输入内容" v-model.trim="defa.name" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="model = false">取 消</el-button>
                <el-button type="primary" @click="save_params('defa')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 弹框 -->
        <el-dialog title="架位号详情编辑" :visible.sync="modelSync" @close="close" width="50%" :close-on-click-modal="false">
            <div :style="$height(400)" class="boxAuto">
                <el-form :model="form" :rules="rules" ref="defa" label-width="124px" class="m-b-30">
                    <div class="display_flex between m-b-20">
                        <div class="w-50">
                            <el-form-item label="架位号名称" prop="name" class="m-r-10">
                                <el-input v-model="form.name" disabled maxlength="1" clearable></el-input>
                            </el-form-item>
                        </div>
                        <div class="w-50">
                            <el-form-item label="层数" prop="layer" class="m-r-10">
                                <el-input v-model="form.layer" disabled clearable></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div v-for="(item, i) of form.rackDetails" :key="i">
                        <div class="display_flex between start m-b-20">
                            <div class="w-50 display_flex">
                                <img src="../../../assets/img/delBlock.png" class="delBlock m-b-20 cursor"
                                    @click="rackBlock" />
                                <el-form-item :label="'第' + (i * 1 + 1) + '层'" prop="showNumber" class="m-r-10">
                                    <el-input v-model="item.showNumber" disabled clearable></el-input>
                                </el-form-item>
                            </div>
                            <div class="w-50 display_flex between" v-if="RackType == 'ONE'">
                                <el-form-item label="索书号范围" prop="startRange" class="w-60">
                                    <el-input v-model="item.startRange" class="w-100" clearable></el-input>
                                </el-form-item>
                                <div class="m-b-20">——</div>
                                <el-input class="m-b-20 w-30" v-model="item.endRange" clearable></el-input>
                            </div>
                            <div class="w-50 display_flex between" v-else>
                                <el-form-item label="" prop="barCodes" class="w-60">
                                    <el-input v-model="item.barCodes" :rows="4" type="textarea" class="w-100"
                                        clearable></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="addBox" @click="addLength(form.rackDetails.length)">+</div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modelSync = false">取 消</el-button>
                <el-button type="primary" @click="saveRack">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择价位 -->
        <!-- 弹框 -->
        <el-dialog title="编辑架位号" :visible.sync="modelBlock" @close="close" width="40%" :close-on-click-modal="false">
            <from-data :row="1" ref="form" :list="lists" :rule="rackRules" @getForm="getForm"
                :model="chooseRacks"></from-data>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modelBlock = false">取 消</el-button>
                <el-button type="primary" @click="saveBlock('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Axios from 'axios';
import List from '../../view/List';
import fromData from '../../view/form';

const qs = require('qs');
export default {
    components: {
        List,
        fromData
    },
    data() {
        return {
            bus: this.bus(this),
            defa: {},
            customTableVisible: false,//自定义导入弹框
            lists: [
                { name: '架位号名称', id: 'rackId', type: 'select', options: [] },
                { name: '层数', id: 'rackDetailId', type: 'select', options: [] }
            ],
            input: '',
            headers: {
                accessToken: JSON.parse(localStorage.getItem('user')).token
            },
            datas: {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            },
            upLoadInfo: [],
            fileList: [],
            chooseNumber: [],
            chooseRacks: {},
            chooseRack: {},
            form: {},
            height: '', //高度
            height2: '', //高度
            height3: '',
            RackType: '',
            activeName: 'first',
            metas: '',
            meta: '',
            tableData: '',
            searchParam: {},
            rules: {
                name: []
            },
            modelBlock: false,
            model: false,
            modelSync: false,
            type: '',
            rackRules: {
                rackId: [{ required: true, message: '请选择架位号名称', trigger: 'change' }],
                rackDetailId: [{ required: true, message: '请选择层数', trigger: 'change' }]
            },
            tableData: [],
            page: 1,
            size: 20,
            total: 0,
            formData: {
                rackName: '',//架位名称
                layerFrameNumber: '',//层架编号
                barCode: '',//条码号
            },
            tablePadding: document.documentElement.clientHeight - 140 - 200,
            options: [],
            props: {
                lazy: true,
                lazyLoad: this.lazyLoad,
            },
            rackDetailId: '',//架位详情id
            nodes: [],//获取到的架位详情
            listData: [],//全部的扫码价位数据
        };
    },
    created() {
        this.metasList();
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
            this.tablePadding = document.documentElement.clientHeight - 140 - 200
        });
        this.getList();
        this.getRack();
        document.onkeydown = (e) => {
            let key = window.event.keyCode;
            // console.log(e);
        };
    },
    methods: {
        // 选择每页显示条数
        handleSizeChange(val) {
            this.size = val
            const start = (this.page - 1) * this.size
            const end = start + this.size
            this.tableData = this.listData.slice(start, end)
        },
        // 选择页数
        handleCurrentChange(val) {
            this.page = val
            const start = (this.page - 1) * this.size
            const end = start + this.size
            this.tableData = this.listData.slice(start, end)
        },
        // 架位号下拉框发生改变的时候
        async handleChange(row) {
            console.log(row[0], 'row121');
            if (row.length) {
                if (!this.formData.layerFrameNumber) {
                    this.rackDetailId = row[row.length - 1]
                }
                this.$refs.layerFrameNumber.focus()
            } else {
                return this.$message.error('架位号有误,请重新选择');
            }

        },
        // 增加编号回车得时候
        async layerFrameFn() {

            if (this.formData.layerFrameNumber) {
                let res = await this.ax.get(`/hardware/interface/rackDetailByRfId?rfId=${this.formData.layerFrameNumber}&platformId=${JSON.parse(localStorage.getItem('user')).platform.id}`)
                if (res) {
                    console.log(res, 'resss');
                    this.rackDetailId = res.id
                    let params = { rackId: res.rackId }
                    let rest = await this.ax.get("/manage/unit/catalog/collectionHandling/rackDetail", { params })
                    const nodes = rest.rackDetails.map((it) => ({
                        ...it,
                        value: it.id,
                        label: it.showNumber,
                    }));
                    console.log(nodes)
                    this.$refs.barCode.focus()
                    this.nodes = nodes

                }

            } else { this.$refs.barCode.focus() }

        },
        // 条码号回车的时候
        async barCodeFn() {
           
            if (!this.formData.rackName && !this.formData.layerFrameNumber) return this.$message.error('请选择架位号');
            if (!this.formData.barCode) return this.$message.error('请输入条码号');
            // 查询图书bookid
            const bookData = await this.ax.get(`/hardware/interface/bookDetail?barCode=${this.formData.barCode}&platformId=${JSON.parse(localStorage.getItem('user')).platform.id}`)
            if (bookData && bookData.id) {
                let data = {
                    "type": "2",
                    "bookIds": [bookData.id],
                    "rackDetailId": this.rackDetailId,
                    "uuid": "213213123123213",
                    "platformId": JSON.parse(localStorage.getItem('user')).platform.id
                }
                let res = await this.ax.post('/hardware/interface/books', data)
                let rackname = ''
                this.nodes.filter(it => {
                    console.log(it, 'itt');
                    if (it.id == this.rackDetailId) {
                        rackname = it.name
                    }
                })//获取对应的架位详情
                this.listData.unshift({
                    rackname,
                    positiveTitle: res.books[0].positiveTitle,
                    barCode: res.books[0].barCode,
                    createTime: res.books[0].createTime,
                    state: res.books[0].rackName ? '图书上架' : '上架失败'
                })
                const start = (this.page - 1) * this.size
                const end = start + this.size
                this.tableData = this.listData.slice(start, end)
                const len = this.formData.barCode.length;
                let temp = /[a-zA-Z]/g.test(this.formData.barCode);
            if (temp) {
                // 有字母
                const data = /[0-9]+(?=[^0-9]*$)/g.exec(this.formData.barCode);
                if (data) {
                    const index = data.index;
                    const value = data[0];
                    const pre = this.formData.barCode.substr(0, index);
                    const suf = this.formData.barCode.substr(index);
                    //是数字
                    if (suf == value && !isNaN(Number(value))) {
                        const sufLen = suf.toString().length;
                        let result = Number(value) + 1;
                        result = result.toString().padStart(sufLen, "0");
                        this.formData.barCode = pre + result;
                        console.log(this.$refs.barCode)
                       setTimeout(()=>{
                        this.$refs.barCode.select()
                       },90)
                    }
                }
            } else {
                this.formData.barCode++;
                setTimeout(()=>{
                        this.$refs.barCode.select()
                       },90)
            }

                // this.form.barCode = this.form.barCode.toString().padStart(len, 0);
                // this.formData.barCode = String(barCode).padStart(this.formData.barCode.length, '0');
                if (res.books[0].rackName) {
                    this.$message.success("上架成功")
                } else {
                    this.$message.error('上架失败')
                }

            }
        },
        //架位号二级联动
        lazyLoad(node, resolve) {
            const { level, data } = node;
            if (data && data.value) {
                let params = { rackId: data.value }
                this.ax
                    .get("/manage/unit/catalog/collectionHandling/rackDetail", { params })
                    .then((res) => {
                        console.log(res, 'ress');
                        const nodes = res.rackDetails.map((it) => ({
                            ...it,
                            value: it.id,
                            label: it.showNumber,
                            leaf: level === 1,
                        }));
                        this.nodes = nodes
                        resolve(nodes);
                    });
            }
        },
        // 新增搜索架位号的时候
        async query(name) {
            console.log(name, 'name');
            this.options = []
            const res = await this.ax
                .get('/manage/unit/catalog/collectionHandling/rack', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 9999, name }
                })
            res.content.map(it => {
                this.options.push({
                    value: it.id,
                    label: it.name
                })
            })
            console.log(this.options, 'this.options');
        },
        // 新增自定义导入
        custom() {
            this.customTableVisible = true
            this.$refs.customupload.clearFiles();
        },
        // 新增自定义上传
        customhandleAvatarSuccess(param) {
            var formData = new FormData();
            formData.append('file', param.file);
            formData.append('platformId', JSON.parse(localStorage.getItem('user')).platform.id);
            Axios({
                url: '/manage/unit/catalog/collectionHandling/rackUploadNewFileSimple',
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            }).then(res => {
                this.$message.success('导入成功');
            })
        },
        // 新增模板导入
        customdownModel() {
            this.loading();
            this.ax
                .post('/manage/unit/catalog/collectionHandling/rackExcelTemplateSimple')
                .then((res) => {
                    // console.log(res)
                    this.FileSaver(res);
                    this.sloading();
                })
                .catch((err) => {
                    this.sloading();
                });
        },
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 245;
                this.height2 = document.documentElement.clientHeight - 245;
                this.height3 = document.documentElement.clientHeight - 245;
            }, 100);
        },
        close() {
            this.defa = {};
        },
        downModel() {
            this.loading();
            this.ax
                .post('/manage/unit/catalog/collectionHandling/rackExcelTemplate')
                .then((res) => {
                    // console.log(res)
                    this.FileSaver(res);
                    this.sloading();
                })
                .catch((err) => {
                    this.sloading();
                });

        },
        saveBlock(form) {
            this.$refs[form].$refs[form].validate((valid) => {
                if (valid) {
                    if (!this.chooseRack.rackId) {
                        return this.$message.error('请选择架位号名称');
                    }
                    if (!this.chooseRack.rackDetailId) {
                        return this.$message.error('请选择层数');
                    }
                    let params = {
                        bookIds: [this.chooseRacks.id],
                        rackDetailId: this.chooseRack.rackDetailId,
                        rackId: this.chooseRack.rackId
                    };

                    this.ax.post('/manage/unit/catalog/collectionHandling/rackBook', params).then((res) => {
                        this.$message.success('保存成功');
                        this.bus.$emit('flash_/manage/unit/catalog/collectionHandling/rackBook');
                        this.modelBlock = false;
                    });
                }
            });
        },
        // getList
        async getList() {
            this.options = []
            const res = await this.ax
                .get('/manage/unit/catalog/collectionHandling/rack', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 9999, name }
                })
            this.lists[0].options = res.content;
            res.content.map(it => {
                console.log(it, 'itt');
                this.options.push({
                    value: it.id,
                    label: it.name
                })
            })
        },
        // 获取选择
        getForm(val) {
            this.chooseRack = val;
            let str = {
                id: val.rackId
            };
            if (val.rackId) {
                this.deal(str, true);
            }
        },
        // 获取设置方式
        getRack() {
            this.ax
                .get('/manage/unit/catalog/collectionHandling/rackSettingInsertRack', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    this.RackType = res.type;
                });
        },
        // saveRack
        saveRack() {
            for (let i = 0; i < this.form.rackDetails.length; i++) {
                if (this.form.rackDetails[i].barCodes) {
                    this.form.rackDetails[i].barCodes = this.form.rackDetails[i].barCodes.split('\n').join(',');
                }
            }
            let arr = [];
            this.form.rackDetails.map((it) => {
                // console.log(it.barCodes.split(',')[0],'it.barCodes.splice(',')[0]');
                arr.push(it.barCodes ? (it.barCodes.indexOf(',') != -1 ? it.barCodes.split(',')[0] : it.barCodes.split('\n')[0]) : null);
            });
            arr = arr.filter((it) => {
                return it !== null;
            });
            console.log(this.form.rackDetails, 'this.form.rackDetails');
            this.form.barCodes = arr.length ? arr.toString() : null;
            let params = {
                rack: this.form
            };
            this.ax.post('/manage/unit/catalog/collectionHandling/rackDetail', params).then((res) => {
                // console.log(res)
                this.modelSync = false;
                this.$message.success('保存成功');
                this.bus.$emit('flash_/manage/unit/catalog/collectionHandling/rack');
            });
        },
        // 删除
        rackBlock() {
            this.form.rackDetails.splice(this.form.rackDetails.length - 1, 1);
            this.form.layer = this.form.rackDetails.length;
        },
        //批量设置架位号
        async batchSet() {
            if (this.chooseNumber.length > 0) {
                this.loading();
                await Promise.all(
                    this.chooseNumber.map(async (item) => {
                        const ids = await new Promise((rej, rek) => {
                            setTimeout(() => {
                                return rej(item);
                            }, 1000);
                        });
                        let params = {
                            platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                            rackId: ids.id
                        };
                        let previous = '';
                        this.axios({
                            url: '/manage/unit/catalog/collectionHandling/bookInsertRack',
                            method: 'post',
                            onDownloadProgress: (event) => {
                                let data = event.currentTarget.response.replace(previous, '');
                                previous += data;
                                // console.log(event)
                            },
                            data: params
                        })
                            .then((it) => {
                                this.$messageOnce.success('设置成功');
                                this.sloading();
                            })
                            .catch((it) => {
                                this.sloading();
                            });
                    })
                );
            }
        },
        // 设置书本
        setBook(val) {
            this.loading();
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                rackId: val.id
            };
            let previous = '';
            this.axios({
                url: '/manage/unit/catalog/collectionHandling/bookInsertRack',
                method: 'post',
                onDownloadProgress: (event) => {
                    let data = event.currentTarget.response.replace(previous, '');
                    previous += data;
                    // console.log(event)
                },
                data: params
            })
                .then((it) => {
                    this.$message.success('设置成功');
                    this.sloading();
                })
                .catch((it) => {
                    this.sloading();
                });
        },
        //获取metas
        metaLists(ress) {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Rack' } }).then((res) => {
                res.delete = 'DELETE';
                res.edit = 'EDIT';
                res.insertable = true;
                res.subs.map((it) => {
                    if (it.key == 'platformId' || it.key == 'createTime') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if (this.RackType == 'ONE') {
                    } else {
                        if (it.key == 'range') {
                            it.displayInList = false;
                            it.searchable = false;
                        }
                        if (it.key == 'barCodes') {
                            it.displayInList = true;
                            it.searchable = false;
                        }
                        if (it.key == 'name') {
                            it.searchOption = this.rangeOptions;
                        }
                    }
                });
                console.log(res), 'ressssssss';
                this.metas = res;
            });
        },
        selectBox(val) {
            console.log(val);
            this.chooseNumber = val;
        },
        // 获取meta
        metasList() {
            this.meta = {
                insertable: false,
                edit: 'EDIT',
                delete: 'DELETE',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'barCode',
                        searchable: false,
                        name: '文献条码'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'barCode',
                        searchable: true,
                        name: '文献条码'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'callNumber',
                        name: '索书号'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'positiveTitle',
                        name: '题名'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        name: '出版社'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'rackName',
                        name: '所在架位'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'subTitle',
                        name: '副题名'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'tiedTitle',
                        name: '并列题名'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'sectionTitle',
                        name: '分辑名'
                    },
                    {
                        select: true,
                        clickable: false,
                        displayInList: false,
                        searchable: true,
                        key: 'rackStatus',
                        name: '上架状态',
                        searchOption: [{ key: 1, name: '已上架' }, { key: 2, name: '未上架' }]
                    }
                ],
                types: ''
            };
        },

        // 保存
        save(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sloading();
                    this.ax
                        .post('/manage/unit/catalog/bibliography/bookBase', this.form)
                        .then((res) => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.back();
                        })
                        .catch((res) => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        handleClick() {
            if (this.activeName == 'second') {
                if (this.metas == '') {
                    this.metaLists();
                }
            }
        },
        async searchlist() {
            return await this.ax.get('/manage/unit/catalog/collectionHandling/rackBook', { params: this.searchParam });
        },
        async deleteBookall() {
            let res = await this.searchlist();
            this.$confirm('确定一键清除本页架位号?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(res.content, 'res.contentres.content');
                this.deleteBook(res.content);
            });
        },
        async deleteBookallAll() {
            let res = await this.searchlist();
            this.$confirm('确定一键清除所有架位号?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(res.content, 'res.contentres.content');
                this.deleteBookAll(res.content);
            });
        },
        //价位本页删除
        deleteBook(val) {
            this.loading();
            let ids = val
                .map((it) => {
                    return it.id;
                })
                .join(',');
            this.ax
                .delete('/manage/unit/catalog/collectionHandling/rackBook?ids=' + ids)
                .then((res) => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/rackBook`, res);
                    this.$message.success('删除成功');
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 2024-01-02新增,修改了这里
        //架位所有删除
        deleteBookAll(val) {
            this.loading();
            this.ax
                .delete('/manage/unit/catalog/collectionHandling/rackBookAll?platformId=' + JSON.parse(localStorage.getItem('user')).platform.id)
                .then((res) => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/rackBook`, res);
                    this.$message.success('删除成功');
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        search(val) {
            this.searchParam = val;
        },
        // 编辑价位
        editBook(val) {
            // console.log(val)
            this.modelBlock = true;
            this.chooseRacks = val[0];
            if (val[0].rackId) {
                let str = {
                    id: val[0].rackId
                };
                this.deal(str, true);
            }
        },
        doEx() {
            console.log(this.searchParam, 'this.searchParam');
            this.searchParam.size = 9999999;
            // let newTab;
            // newTab = window.open();
            this.loading();
            this.ax
                .get('/manage/unit/catalog/collectionHandling/exportExcelRackBook', { params: this.searchParam })
                .then((res) => {
                    // // console.log(res)
                    // newTab.location = res;
                    this.FileSaver.saveAs(res, res);
                    this.sloading();
                })
                .catch((err) => {
                    this.sloading();
                });
        },
        doBatch() {
            if (this.chooseNumber.length > 0) {
                let params = {
                    name: this.chooseNumber
                        .map((it) => {
                            return it.name;
                        })
                        .join(','),
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id
                };
                console.log(99, params);
                this.loading();
                this.ax
                    .get('/manage/unit/catalog/collectionHandling/exportExcelRack', { params })
                    .then((res) => {
                        this.FileSaver.saveAs(res, res);
                        this.sloading();
                    })
                    .catch((err) => {
                        this.sloading();
                    });
            } else {
                this.loading();
                this.ax
                    .get('/manage/unit/catalog/collectionHandling/exportExcelRack', {
                        platformId: JSON.parse(localStorage.getItem('user')).platform.id
                    })
                    .then((res) => {
                        this.FileSaver.saveAs(res, res);
                        this.sloading();
                    })
                    .catch((err) => {
                        this.sloading();
                    });
            }
        },

        editUpdate(val) {
            this.defa = val[0];
            this.model = true;
        },
        deal(val, isTure) {
            this.loading();
            this.ax.get('/manage/unit/catalog/collectionHandling/rackDetail', { params: { rackId: val.id } }).then((res) => {
                res.rackDetails.map((it) => {
                    if (it.showNumber.indexOf('层') == -1) {
                        it.showNumber = it.showNumber + '层';
                    }
                });
                this.form = res;
                console.log(res, 'ressssss');
                this.lists[1].options = res.rackDetails;
                this.sloading();
                if (isTure) {
                } else {
                    this.modelSync = true;
                }
            });
        },
        data(val) {
            val.content.map((it) => {
                // // console.log(it)
                if (it.startRange) {
                    it.range = it.startRange + '-' + it.endRange;
                }
            });
            this.rangeOptions = val.content.map((it) => {
                return { name: it.name, key: it.name };
            });
        },
        deleteUpdate(val) {
            this.loading();
            let ids = val
                .map((it) => {
                    return it.id;
                })
                .join(',');
            this.ax
                .delete('/manage/unit/catalog/collectionHandling/rack?ids=' + ids)
                .then((res) => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/rack`, res);
                    this.$message.success('删除成功');
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        open() {
            this.model = true;
        },
        addLength(index) {
            let block = {
                startRange: '',
                endRange: '',
                number: index * 1 + 1,
                showNumber: this.form.name + '-' + (index * 1 + 1) + '层'
            };
            console.log(block, 'block,,,,,,,,,,,,');

            this.form.rackDetails.push(block);
            this.form.layer = this.form.rackDetails.length;
            // console.log( this.form.rackDetails)
        },
        save(formName) {
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;

            this.ax.post('/manage/unit/catalog/collectionHandling/rackDetail', this.form).then((res) => {
                this.$message.success('保存成功');
                this.model = false;
                this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/rack`, res);
            });
        },
        save_params(formName) {
            if(!this.defa.name) return this.$message.error("请输入架位号名称")
            this.defa.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ax.post('/manage/unit/catalog/collectionHandling/rack', this.defa).then((res) => {
                        this.$message.success('保存成功');
                        this.model = false;
                        this.bus.$emit(`flash_/manage/unit/catalog/collectionHandling/rack`, res);
                    });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        },
        //上传
        uploadBefore(val) {
            this.input = val.name;
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        beforeAvatarUpload(item) {
            this.loading();
            this.types = item.type.split('/')[0];
        },
        onError() {
            this.sloading();
            this.$message.error('导入失败');
        },
        handleAvatarSuccess(val) {
            if (val.data) {
                this.upLoadInfo = val.data;
                this.$message.success('导入成功');
            } else {
                if (this.types != 'application') {
                    this.$message.error('选择的文件类型不对');
                } else {
                    this.$message.error(val.msg);
                }
            }
            this.sloading();
        }
    }
};
</script>

<style scoped>
.inputClass {
    margin: 0 10px;
}

.libraryInfo .el-tabs__item {
    line-height: 60px;
    height: 60px;
}

.libraryInfo {
    position: relative;
}

.libraryInfo .choose {
    position: absolute;
    top: 10px;
    right: 20px;
}

.libraryInfo .info {
    height: 1.38rem;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.38rem;
    color: #000000;
    width: 100%;
}

.b-b-1 {
    border-bottom: 1px solid #ddd;
}

.library_bottom {
    width: 100%;
    height: 2.5rem;
    background: #ffffff;
    box-shadow: 0px -1px 1px #94949429;
    padding: 0 20px !important;
    font-size: 0.88rem;
    color: #777777;
    box-sizing: border-box;
}

.library_bottom div {
    padding: 0 20px;
}

.fromFirst {
    /* overflow: scroll; */
    box-sizing: border-box;
    /* padding: 20px; */
}

.addBox {
    background: rgba(222, 222, 222, 0.6);
    text-align: center;
    font-size: 30px;
    width: 100%;
    height: 42px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 10px;
}

.delBlock {
    width: 20px;
    height: 20px;
}

.padding20 {
    padding: 20px;
}

.boxAuto {
    overflow: auto;
}
</style>
