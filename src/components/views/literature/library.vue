<template>
    <div>
        <div class="container library" :style="'height:' + height + 'px'" @keyup="monitor">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class="title_library">图书编目</div>
                <div class="display_flex">
                    <!-- <el-button-group>
                    <el-button type="primary" icon="el-icon-edit">检索（F）</el-button>
                    <el-button type="primary" icon="el-icon-share">套录（T）</el-button>
                    <el-button type="primary" >
                        复本（C）
                    </el-button>
                </el-button-group> -->
                    <div @click="search" class="cursor text_center m-r-10">
                        <img src="../../../assets/img/search.png" class="btn_img" />
                        <div class="f-s-14">检索（F）</div>
                    </div>
                    <div @click="register" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/book.png" class="btn_img" />
                        <div class="f-s-14">套录（T）</div>
                    </div>
                    <div @click="copy" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/copy.png" class="btn_img" />
                        <div class="f-s-14">复本（C）</div>
                    </div>
                    <div @click="copys(true)" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/more.png" class="btn_img" />
                        <div class="f-s-14">多卷（M）</div>
                    </div>
                    <div @click="edit" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/edit.png" class="btn_img" />
                        <div class="f-s-14">修改（E）</div>
                    </div>
                    <div @click="add" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/add.png" class="btn_img" />
                        <div class="f-s-14">新增（N）</div>
                    </div>
                    <div @click="del" class="text_center cursor m-r-10">
                        <img src="../../../assets/img/del.png" class="btn_img" />
                        <div class="f-s-14">删除（D）</div>
                    </div>
                    <div @click="setDefault" class="text_center cursor">
                        <img src="../../../assets/img/default.png" class="btn_img" />
                        <div class="f-s-14">默认参数</div>
                    </div>
                </div>
            </div>
            <div class="padding_20 m-b-30">
                <div class="display_flex w-100">
                    <div class="display_flex w-25 m-r-20">
                        <div class="title_info m-r-20">查询项目</div>
                        <el-select v-model="searchType" placeholder="请选择" class="w-80">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :disabled="item.disabled" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="display_flex w-25">
                        <div class="title_info m-r-20">查询内容</div>
                        <el-input v-model.trim="content" :placeholder="searchTitle||'请输入内容'" autofocus id="getFocus"
                            @keyup.enter.native="search" ref="searchCotent" class="w-80"></el-input>
                    </div>
                </div>
            </div>
            <div class="">
                <div class="padding_20 source m-b-30">
                    检索源<span class="sizes" v-show="rightShow">按ctrl+方向键右键（ctrl + →）检索下一个数据源</span>
                </div>

                <div class="padding_20 m-b-30">
                    <el-checkbox-group v-model="checkList" @change="chooseBox">
                        <el-checkbox :label="item" :checked="item.checked" v-for="item of searchFrom" :key="item.id">{{
                            item.serviceName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <!-- 查询列表 -->
                <div v-if="tableData.length > 0">
                    <!-- " -->
                    <div class="padding_20 source m-b-30">命中数据列表</div>
                    <div class="padding_20 m-b-80">
                        <el-table class="m-b-20" ref="multipleTable" :data="tableData" tooltip-effect="dark" border
                            highlight-current-row @current-change="handleCurrentChoose" @row-dblclick="handledbClick"
                            style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55"> </el-table-column>

                            <el-table-column align="center" prop="callNumber" sortable width="180" :label="labelType">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.source == '本馆数据库'">
                                        <span v-if="scope.row.callNumberColor" v-html="scope.row.callNumberColor"></span>
                                        <span v-else>{{ scope.row.callNumber }}</span>
                                    </div>
                                    <div v-else>
                                        <span v-if="scope.row.classificationNumberColor"
                                            v-html="scope.row.classificationNumberColor"></span>
                                        <span v-else>{{ scope.row.classificationNumber }}</span>
                                    </div>
                                </template>
                            </el-table-column>

                            <!--                            <el-table-column-->
                            <!--                            v-else-->
                            <!--                            prop="classificationNumber"-->
                            <!--                             width="180"-->
                            <!--                             sortable-->
                            <!--                            align='center'-->
                            <!--                            label="分类号">-->
                            <!--                               <template slot-scope="scope">-->
                            <!--                                    <div>{{scope.row.classificationNumber}}</div>-->
                            <!--                                </template>-->
                            <!--                            </el-table-column>-->

                            <el-table-column prop="allTitle" sortable align="center" width="400"
                                v-if="checkList[0].serviceName == '本馆数据库'" label="正题名">
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="right">
                                        <div v-if="listCode.length > 0" :style="'height:' + popoverHeight + 'px'"
                                            style="overflow-y: auto">
                                            <p v-for="item of listCode" :key="item.id">{{ item }}</p>
                                        </div>
                                        <div v-else>
                                            <p>无馆藏</p>
                                        </div>

                                        <div slot="reference" class="name-wrapper" @mouseover="getCodes(scope.row.id)">
                                            <span v-if="scope.row.allTitleColor" v-html="scope.row.allTitleColor"></span>
                                            <span v-else>{{ scope.row.allTitle }}</span>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                            <el-table-column v-else align="center" width="400" sortable prop="allTitle" label="正题名">
                            </el-table-column>
                            <el-table-column align="center" width="300" sortable prop="displayIsbn" label="ISBN/ISSN">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isbnColor" v-html="scope.row.isbnColor"></span>
                                    <span v-else>{{ scope.row.displayIsbn }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="pageNumber" align="center" sortable width="180" label="页码">
                            </el-table-column>
                            <el-table-column prop="priceStr" width="150" sortable align="center" label="价格">
                            </el-table-column>
                            <el-table-column prop="publicationDate" width="150" sortable align="center" label="出版时间">
                            </el-table-column>

                            <el-table-column prop="source" sortable align="center" label="来源">
                                <template slot-scope="scope">
                                    <div class="size" :style="{
                                        color:
                                            scope.row.source == '本馆数据库'
                                                ? '#67C23A'
                                                : scope.row.source == '套录库'
                                                    ? '#409EFF'
                                                    : scope.row.source == '云端数据库'
                                                        ? '#E6A23C'
                                                        : '#606266'
                                    }">
                                        {{ scope.row.source }}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage" :page-sizes="[5, 20, 50, 100]" :page-size="pageSize"
                            layout=" prev, pager, next, jumper,total, sizes" :total="list.length">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="container library_bottom display_flex">
            <div class="w-25">默认文献：{{ defa.mediumName ? defa.mediumName : '未设置' }}</div>
            <div class="w-25">默认语种：{{ defa.languageName ? defa.languageName : '未设置' }}</div>
            <div class="w-25">默认批次：{{ defa.batchName ? defa.batchName : '未设置' }}</div>
            <div class="w-25">默认藏址：{{ defa.collectionPlaceName ? defa.collectionPlaceName : '未设置' }}</div>
        </div>

        <!-- 弹框 -->
        <el-dialog title="参数设置" :visible.sync="openDefa" width="45%" :close-on-click-modal="false">
            <el-dialog width="30%" :title="newAddName" :visible.sync="innerVisible" append-to-body>
                <el-form :model="form" :rules="rule" ref="form" label-width="100px" class="m-b-30">
                    <el-form-item :label="newAddLab ? '批次名称' : '馆藏地名称'" prop="name">
                        <el-input v-model="form.name"></el-input>
                        <el-checkbox v-model="form.defaultSetting">是否默认</el-checkbox>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="form.note" maxlength="200" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBatch('form')" v-if="newAddLab">确 定</el-button>
                    <el-button type="primary" @click="addPlace('form')" v-else>确 定</el-button>
                </span>
            </el-dialog>
            <el-form :model="defa" :rules="rules" ref="defa" label-width="124px" class="m-b-30">
                <div class="display_flex between">
                    <div class="w-50 display_flex">
                        <el-form-item label="默认批次" prop="batchId" class="m-r-10">
                            <el-select v-model="defa.batchId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('batchName', 'batches', defa.batchId)">
                                <el-option v-for="item in params.batches" :key="item.id" :label="item.name"
                                    :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                        <div class="add_btn cursor" @click="openBatch">+</div>
                    </div>
                    <div class="w-50 display_flex">
                        <el-form-item label="默认语种" prop="languageId" class="m-r-10">
                            <el-select v-model="defa.languageId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('languageName', 'languages', defa.languageId)">
                                <el-option v-for="item in params.languages" :key="item.id" :label="item.name"
                                    :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>

                <div class="display_flex between">
                    <div class="w-50 display_flex">
                        <el-form-item label="默认藏址" prop="collectionPlaceId" class="m-r-10">
                            <el-select v-model="defa.collectionPlaceId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('collectionPlaceName', 'collectionPlaces', defa.collectionPlaceId)">
                                <el-option v-for="item in params.collectionPlaces" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div class="add_btn cursor" @click="open">+</div>
                    </div>
                    <div class="w-50 display_flex">
                        <el-form-item label="默认状态" prop="bookStatus" class="m-r-10">
                            <el-select v-model="defa.bookStatus" clearable placeholder="请选择" class="w-100">
                                <el-option v-for="item in arrparams" :key="item.key" :label="item.name"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>

                <div class="display_flex between">
                    <div class="w-50 display_flex">
                        <el-form-item label="默认文献类型" prop="mediumId" class="m-r-10">
                            <el-select v-model="defa.mediumId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('mediumName', 'mediums', defa.mediumId)">
                                <el-option v-for="item in params.mediums" :key="item.id" :label="item.name"
                                    :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="w-50 display_flex">
                        <el-form-item label="文献流通类型" prop="documentCirculationTypeId" class="m-r-10">
                            <el-select v-model="defa.documentCirculationTypeId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('documentCirculationTypeId', 'documentCirculationTypeId', defa.documentCirculationTypeId)">
                                <el-option v-for="item in circulationList" :key="item.id" :label="item.name"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>

                <div class="display_flex between">
                    <div class="w-50 display_flex">
                        <el-form-item label="MARC类型" prop="marcTypeDetailId" class="m-r-10">
                            <el-select v-model="defa.marcTypeDetailId" clearable placeholder="请选择" class="w-100"
                                @change="getCode('marcTypeDetailName', 'marcTypeDetails', defa.marcTypeDetailId)">
                                <el-option v-for="item in params.marcTypeDetails" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="w-50 display_flex">
                        <el-form-item label="默认复本" prop="number" class="m-r-10">
                            <el-input v-model="defa.number" class="w-40 m-r-10"></el-input>
                            <el-checkbox v-model="defa.autofill">新增自动填充</el-checkbox>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openDefa = false">取 消</el-button>
                <el-button type="primary" @click="save_params('defa')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 弹框 -->
        <el-dialog title="请选择需加载的MARC系统默认工作单" :visible.sync="showModel" width="60%" :close-on-click-modal="false">
            <div class="display_flex start boxChoose" :style="$height(400)">
                <div class="w-60 m-r-20">
                    <div class="title_model m-b-10">文献数据库</div>
                    <div class="m-b-10">
                        <el-input v-model="chooseBook[0].source" disabled
                            v-if="chooseBook && chooseBook.length > 0 && chooseBook[0].source"></el-input>
                    </div>
                    <div class="box_border w-100">
                        <div v-if="radio">
                            <el-table :data="radio.marcTemplateDetails" style="width: 100%">
                                <el-table-column prop="marcFieldDetailFather" label="字符表示符" width="180">
                                    <template slot-scope="scope">
                                        <div>{{ scope.row.marcFieldDetailFather.code }}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="indicatorOne" label="指示符">
                                    <template slot-scope="scope">
                                        <div>
                                            {{ scope.row.marcFieldDetailFather.indicatorOne
                                            }}{{ scope.row.marcFieldDetailFather.indicatorTwo }}
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="note" label="字段帮助信息">
                                    <template slot-scope="scope">
                                        <div>{{ scope.row.marcFieldDetailFather.note }}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <div class="m-b-10">字符表示符:{{radio.code}}</div>
                            <div class="m-b-10">字段名称:{{radio.name}}</div>
                            <div class="m-b-10">指示符:{{radio.indicatorOne}}{{radio.indicatorTwo}}</div>
                            <div class="m-b-10">字段帮助信息:{{radio.note}}</div> -->
                        </div>
                    </div>
                </div>
                <div class="w-40">
                    <div class="title_model m-b-10">模板列表</div>
                    <div class="box_border m-b-20">
                        <el-radio-group v-model="radio">
                            <div v-for="(item, i) of models" :key="i" class="m-b-20">
                                <el-radio :label="item">{{ item.name }}</el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <el-pagination :page-size="5" @current-change="handleCurrentChange1" :current-page="currentPage1"
                        layout="prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.enter="addModel">加载模板(Enter)</el-button>

                <el-button @click="showModel = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="本馆数据库查重列表（按正题名）" :visible.sync="dialogTableVisible" width="80%">
            <div style="display: flex; justify-content: flex-start; margin-bottom: 15px">
                <div @click="copy" class="text_center cursor m-r-10" style="margin-left: 15px">
                    <img src="../../../assets/img/copy.png" class="btn_img" />
                    <div class="f-s-14">复本（C）</div>
                </div>
                <div @click="copys(true)" class="text_center cursor m-r-10" style="margin-left: 30px">
                    <img src="../../../assets/img/more.png" class="btn_img" />
                    <div class="f-s-14">多卷（M）</div>
                </div>
            </div>

            <el-table class="m-b-20" ref="multipleTable" :data="tableBooklist" tooltip-effect="dark" border
                highlight-current-row @current-change="handleCurrentChoose" @selection-change="handleSelectionChange"
                style="width: 100%" v-loading="loadingBook">
                <el-table-column type="selection" width="55"> </el-table-column>

                <el-table-column align="center" prop="callNumber" sortable width="180" :label="labelType">
                    <template slot-scope="scope">
                        <div v-if="scope.row.source == '本馆数据库'">
                            <span v-if="scope.row.callNumberColor" v-html="scope.row.callNumberColor"></span>
                            <span v-else>{{ scope.row.callNumber }}</span>
                        </div>
                        <div v-else>
                            <span v-if="scope.row.classificationNumberColor"
                                v-html="scope.row.classificationNumberColor"></span>
                            <span v-else>{{ scope.row.classificationNumber }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="allTitle" sortable align="center" width="350" label="正题名">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="right">
                            <div v-if="listCode.length > 0" :style="'height:' + popoverHeight + 'px'"
                                style="overflow-y: auto">
                                <p v-for="item of listCode" :key="item.id">{{ item }}</p>
                            </div>
                            <div v-else>
                                <p>无馆藏</p>
                            </div>

                            <div slot="reference" class="name-wrapper" @mouseover="getCodes(scope.row.id)">
                                <span v-if="scope.row.allTitleColor" v-html="scope.row.allTitleColor"></span>
                                <span v-else>{{ scope.row.allTitle }}</span>
                            </div>

                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column align="center" width="300" sortable prop="displayIsbn" label="ISBN/ISSN">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isbnColor" v-html="scope.row.isbnColor"></span>
                        <span v-else>{{ scope.row.displayIsbn }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pageNumber" align="center" sortable width="150" label="页码"> </el-table-column>
                <el-table-column prop="priceStr" width="150" sortable align="center" label="价格"> </el-table-column>
                <el-table-column prop="publicationDate" width="150" sortable align="center" label="出版时间"> </el-table-column>

                <el-table-column prop="source" sortable align="center" label="来源">
                    <template slot-scope="scope">
                        <div class="size" :style="{
                            color:
                                scope.row.source == '本馆数据库'
                                    ? '#67C23A'
                                    : scope.row.source == '套录库'
                                        ? '#409EFF'
                                        : scope.row.source == '云端数据库'
                                            ? '#E6A23C'
                                            : '#606266'
                        }">
                            {{ scope.row.source }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChangeBook" @current-change="handleCurrentChangeBook"
                :current-page="currentPageBook" :page-sizes="[5, 20, 50, 100]" :page-size="pageSizeBook"
                layout=" prev, pager, next, jumper,total, sizes" :total="listbook.length">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
const qs = require('qs');
export default {
    components: {},
    data() {
        return {
            bus: this.bus(this),
            labelType: '',
            arrparams:[],
            loadingBook: false,
            dialogTableVisible: false,
            gridData: [],
            listCode: [],
            circulationList: [],
            height: '', //高度
            checkList: [], //选择
            content: '', //内容
            searchType: '1',
            marcDatabases: [], //数据库
            searchFrom: [
                { type: 'LOCAL', serviceName: '本馆数据库', checked: false, sort: 0 },
                { type: 'DEFAULT', serviceName: '套录库', checked: false, sort: 1 },
                { type: 'CLOUD', serviceName: '云端数据库', checked: false, sort: 2 },
                { type: 'NEW', serviceName: 'Z39.50服务器', sort: 3, checked: false }
            ], //源
            tableData: [], //分页数据
            currentPage: 1, // 页码
            list: [], //全部数据
            listbook: [],
            pageSize: 5, //大小
            currentPageBook: 1,
            pageSizeBook: 5,
            openDefa: false, //弹框
            //    内框
            innerVisible: false,
            // new_add
            newAddName: '', //快速新增
            newAddLab: '', //快速新增
            defa: {}, // 默认参数
            //    参数选择
            showModel: false, //模板弹框
            models: [], //获取的模板列表
            mysql: '', //模板库
            radio: '', //选择模板
            currentPage1: 0,
            total: 0,
            params: {},
            options: [], //选择
            rules: {},
            isAdd: '', //是否新增
            checked: false,
            chooseBook: [{ source: '' }], //选择的书
            // 新增批次
            form: {
                defaultSetting: false
            },
            options: [
                //选择
                {
                    label: 'ISBN',
                    value: '1',
                    disabled: false
                },
                {
                    label: '题名',
                    value: '2',
                    disabled: false
                },
                {
                    label: '责任者',
                    value: '3',
                    disabled: false
                },
                {
                    label: '出版社',
                    value: '4',
                    disabled: false
                },
                {
                    label: '主题词',
                    value: '5',
                    disabled: false
                },
                {
                    label: '分类号',
                    value: '6',
                    disabled: false
                }
                // {
                //   label:'条码号',
                //   value:'7',
                //   disabled:false
                //
                // },
            ],
            //
            rules: {
                batchId: [{ required: true, message: '请选择', trigger: 'change' }],
                languageId: [{ required: true, message: '请选择', trigger: 'change' }],
                collectionPlaceId: [{ required: true, message: '请选择', trigger: 'change' }],
                marcTypeDetailId: [{ required: true, message: '请选择', trigger: 'change' }],
                bookStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                number: [{ required: true, message: '请选择', trigger: 'change' }],
                mediumId: [{ required: true, message: '请选择', trigger: 'change' }],
                documentCirculationTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
                barCodeId: [{ required: true, message: '请选择', trigger: 'change' }]
            },
            rule: {
                name: [{ required: true, message: '请选择', trigger: 'blur' }]
            },
            clickChooseIndex: 0,
            defaSetChoose: {},
            click: {},
            rightNum: -1,
            rightShow: false,
            popoverHeight: '',
            tableBooklist: [],
            searchTitle:'',//查询内容输入框中的提示文字
        };
    },
    created() {
        this.clickChooseIndex = 0;
        // alert(this.$blue)
        // // console.log(this.$blue)

        this.getDefault().then((res) => {
            this.getMeta();
            this.getCirculation();
        });
        // this.height = this.$height()

        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.$nextTick(() => {
            this.getDefa();
        });

        this.getSet();
        // // console.log(JSON.parse(sessionStorage.getItem('chooseLoca')))
        if (JSON.parse(sessionStorage.getItem('chooseLoca'))) {
            let arr = JSON.parse(sessionStorage.getItem('chooseLoca'));
            this.searchFrom.map((it) => {
                arr.map((item) => {
                    if (it.type == item.type) {
                        it.checked = true;
                    }
                });
            });
            arr.map((it) => {
                this.options.map((item) => {
                    if (it.type == 'NEW') {
                        if (item.value == 1 || item.value == 2) {
                            item.disabled = false;
                        } else {
                            item.disabled = true;
                        }
                    } else {
                        item.disabled = false;
                    }
                });

                // console.log(this.options)
            });
        } else {
            this.searchFrom = [
                { type: 'LOCAL', serviceName: '本馆数据库', checked: true, sort: 0 },
                { type: 'DEFAULT', serviceName: '套录库', checked: true, sort: 1 },
                { type: 'CLOUD', serviceName: '云端数据库', checked: true, sort: 2 },
                { type: 'NEW', serviceName: 'Z39.50服务器', sort: 3 }
            ];
        }
    },
    watch: {
        $route(val, oldval) {
            if (val != oldval && val.path == '/catalogue/literature/library') {
                this.clickChooseIndex = 0;
                let input = document.getElementById('getFocus');
                this.defaSetChoose = JSON.parse(sessionStorage.getItem('setting'));
                input.focus();
                input.select();
            }
        }
    },
    mounted() {
        console.log(this.params, 444444444444444444)
        this.clickChooseIndex = 0;
        this.getDefault().then((res) => {
            this.getMeta();
            this.getCirculation();
        });
        console.log(this.$route.path);
    },
    activated() {
        if (this.content && this.tableData[0].source == '本馆数据库') {
            this.ActivatedSearch();
        }
        //缓存时进入
        this.getDefault().then((res) => {
            this.getMeta();
            this.getCirculation();
        });
        setTimeout(() => {
            let input = document.getElementById('getFocus');
            input.focus();
            input.select();
        }, 500)
    },
    methods: {
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 200;
            }, 100);
        },
        // 获取条码
        getCodes(bookBaseId) {
            this.listCode = [];
            this.ax
                .get('/manage/unit/catalog/bibliography/getBarCode', {
                    params: { bookBaseId, platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    this.listCode = res.slice(0, 15);
                    if (this.listCode.length > 10) {
                        this.popoverHeight = '100';
                    }
                });
        },
        clearCodes() {
            this.listCode = [];
        },
        // 监听
        monitor() {
            document.onkeyup = (e) => {
                if (this.$route.path != '/catalogue/literature/library') {
                    return;
                }
                let key = window.event.keyCode;
                console.log(key);
                // f
                if (key == 70 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.search();
                } else if (key == 39 && e.ctrlKey && !e.altKey) {
                    this.rightNum++;
                    
                    if (this.rightNum > this.checkList.length-1) {
                        this.rightNum = 0;
                    }
                    this.rightSearch();
                }
                // t
                else if (key == 84 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.register();
                }
                // c
                else if (key == 67 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.copy();
                }
                // m
                else if (key == 77 && e.path.length != 17 && !e.ctrlKey && !e.altKey) {
                    this.copys(true);
                }
                // e
                else if (key == 69 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.edit();
                }
                // n
                else if (key == 78 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.add();
                }
                // d
                else if (key == 68 && e.path.length == 4 && !e.ctrlKey && !e.altKey) {
                    this.del();
                } else if (key == 38 && e.path.length == 4) {
                    this.chooseDown(-1);
                } else if (key == 39 && e.path.length == 4) {
                } else if (key == 40 && e.path.length == 4) {
                    this.chooseDown(1);
                } else if (key == 13 && e.path.length == 4 && this.chooseBook.length == 1) {
                    if (this.chooseBook[0].source !== '本馆数据库') {
                        this.register();
                    } else {
                        // // console.log(123)
                        this.edit();
                    }
                }
            };
        },
        // 设置快捷操作
        getSet() {
            this.ax
                .get('/manage/unit/general/catalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, marcType: 'BOOK' }
                })
                .then((res) => {
                    sessionStorage.setItem('setting', JSON.stringify(res));
                    this.defaSetChoose = res;
                });
        },
        // 上下运动
        chooseDown(index) {
            this.$refs.multipleTable.clearSelection();
            this.clickChooseIndex += index * 1;
            if (this.clickChooseIndex > 4) {
                this.clickChooseIndex = 4;
            } else if (this.clickChooseIndex < 0) {
                this.clickChooseIndex = 0;
            }
            let val = this.tableData[this.clickChooseIndex];

            this.$refs.multipleTable.toggleRowSelection(val);
        },

        // 打开内框
        openBatch() {
            this.newAddName = '新建批次';
            this.newAddLab = true;
            this.innerVisible = true;
        },
        open() {
            this.newAddName = '新建馆藏地';
            this.newAddLab = false;
            this.innerVisible = true;
        },
        // 快速新增批次
        addBatch(formName) {
            this.loading();
            this.defa.form = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.type = 'CATALOG';
                    this.ax
                        .post('/manage/unit/general/batch', this.form)
                        .then((res) => {
                            this.sloading();
                            this.innerVisible = false;
                            this.$message.success('保存成功');
                            this.form = {};

                            this.getDefa();
                            this.getDefault().then((res) => {
                                this.getCirculation();
                                this.getMeta();
                            });
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

        // 快速新增地址
        addPlace(formName) {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.type = 'LITERATURE';
                    this.ax
                        .post('/manage/unit/general/collectionPlace', this.form)
                        .then((res) => {
                            this.sloading();
                            this.innerVisible = false;
                            this.$message.success('保存成功');
                            // this.innerVisible =false
                            this.form = {};
                            this.getDefault().then((res) => {
                                this.getCirculation();
                                this.getMeta();
                            });
                            this.getDefa();
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
        // 获取类型列表
        getDetail(type) {
            return new Promise((resolve) => {
                this.ax
                    .get(`/manage/unit/catalog/bibliography/bookCatalogParameterTypeDetail?bookCatalogParameterType=${type}&size=999`)
                    .then((res) => {
                        this.type = res;
                        resolve();
                    });
            });
        },
        //查询文献流通类型
        getCirculation() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax.get('/manage/unit/circulation/circulationParameters/getDocumentCirculationTypeAll', { params }).then((res) => {
                this.circulationList = res;
            });
        },
         // 获取参数meta
         getMeta() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.BookCatalogSetting' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'bookStatus') {
                        this.params.bookStatus = it.searchOption;
                        this.arrparams = it.searchOption
                    }
                });
                // console.log(res)
            });
        },
        //查询默认参数选择
        getDefault() {
            return new Promise((resolve) => {
                this.ax.get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting').then((res) => {
                    this.params = res;
                    console.log(this.params,'params,sssss');
                    resolve(res);
                });
            });
        },
       
        // 获取getcode
        getCode(val, name, id) {
            // // console.log(val)
            // // console.log(name)
            // // console.log(id)
            this.params[name].map((it) => {
                if (it.id && it.id == id) {
                    this.defa[val] = it.name;
                } else if (it.key == id) {
                    this.defa[val] = it.name;
                }
                // // console.log(this.defa)
            });
        },
        // 设置默认参数
        setDefault() {
            this.openDefa = true;
            // this.getCirculation();
            this.getDefa();
        },
        // 查询默认参数
        getDefa() {
            let platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax.get('/manage/unit/catalog/bibliography/bookCatalogSetting', { params: { platformId } }).then((res) => {
                this.defa = res;
                this.getDefault().then(res => {
                    res.collectionPlaces.filter(it => {
                        // console.log(it.id, 'it.id');
                        if (it.id == this.defa.collectionPlaceId) {
                            // console.log(it.name);
                            this.defa.collectionPlaceName = it.name
                        }

                    })
                })
            });
        },
        // 保存默认参数
        save_params(formName) {
            this.loading();
            this.defa.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sloading();
                    this.ax
                        .post('/manage/unit/catalog/bibliography/bookCatalogSetting', this.defa)
                        .then((res) => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.openDefa = false;
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
        //根据主题名检索关于图书
        searchBook(res) {
            this.loadingBook = true;
            let params = {
                content: res[0].positiveTitle,
                searchType: '2',
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                marcDatabases: [this.checkList[0]]
            };
            this.ax
                .post(`/manage/unit/catalog/bibliography/marc`, params)
                .then((result) => {
                    if (result.length > 1) {
                        this.dialogTableVisible = true;
                        result.map((it) => {
                            let reg = /[a-zA-Z]+/;
                            let objs;
                            if (!it.marcTypeDetailId) {
                                it.marcTypeDetailId = this.defa.marcTypeDetailId;
                            }
                            if (it.source == '中央数据库') {
                                this.labelType = '索书号';
                            } else {
                                this.labelType = '分类号';
                            }
                            if (it.priceStr) {
                                while ((objs = it.priceStr.match(reg))) {
                                    it.priceStr = it.priceStr.replace(objs[0], '');
                                }
                                return it.priceStr;
                            }
                        });
                        this.currentPageBook = 1;
                        this.listbook = result.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));
                        this.mapList();
                    }
                    this.loadingBook = false;
                })
                .catch((err) => {
                    this.loadingBook = false;
                });
        },
        // 检索F
        search() {
            this.rightNum = 0;
            if (this.checkList.length == 0) {
                return this.$message.error('请选择数据库');
            }
            this.loading();
            this.tableData = [];
            // // // console.log(this.checkList)
            // var params = new FormData()
            this.checkList.sort((a, b) => {
                return a.sort - b.sort;
            });

            let params = {
                content: this.content,
                searchType: this.searchType,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                marcDatabases: this.checkList
            };
            this.ax
                .post(`/manage/unit/catalog/bibliography/marc`, params)
                .then((res) => {
                    let reg = /[a-zA-Z]+/;
                    let objs;
                    res.map((it) => {
                        if (!it.marcTypeDetailId) {
                            it.marcTypeDetailId = this.defa.marcTypeDetailId;
                        }
                        if (it.source == '中央数据库') {
                            this.labelType = '索书号';
                        } else {
                            this.labelType = '分类号';
                        }
                        if (it.priceStr) {
                            while ((objs = it.priceStr.match(reg))) {
                                it.priceStr = it.priceStr.replace(objs[0], '');
                            }
                            return it.priceStr;
                        }
                    });
                    this.currentPage = 1;
                    this.$refs.searchCotent.blur();
                    this.rightShow = true;
                    this.sloading();
                    if (res.length == 0) {
                        this.$message.error('您输入的检索词检索不到数据');
                        if (this.defaSetChoose.directAdd) {
                            this.$confirm('您输入的检索词检索不到,是否新增数据?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                                .then(() => {
                                    this.add();
                                    this.sloading();
                                })
                                .catch(() => {
                                    this.sloading();
                                });
                        }
                    } else if (res.length == 1) {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));
                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];

                        setTimeout((ress) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                            if (res[0].source != '中央数据库') {
                                if (this.defaSetChoose.directCopy) {
                                    this.register();
                                }
                            }
                            if (res[0].source == '中央数据库' && this.defaSetChoose.directDuplication) {
                                this.copy();
                            }
                        });
                        if (
                            this.checkList[0].serviceName == '本馆数据库' &&
                            this.searchType != '2' &&
                            JSON.parse(sessionStorage.getItem('rechecking')) == true
                        ) {
                            this.searchBook(res);
                        }
                    } else {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));

                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];
                        setTimeout((res) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                        });
                        if (
                            this.checkList[0].serviceName == '本馆数据库' &&
                            this.searchType != '2' &&
                            JSON.parse(sessionStorage.getItem('rechecking')) == true
                        ) {
                            this.searchBook(res);
                        }
                    }

                })
                .catch((err) => {
                    this.searchTitle = err.msg
                    this.sloading();
                });
        },
        changeColor(resultsList, tableBooklist) {
            if (resultsList) {
                resultsList.map((item, index) => {
                    if (this.content) {
                        // 匹配关键字正则
                        let replaceReg = new RegExp(this.content, 'g')
                        let replaceString = '<span style="color: red">' + this.content + '</span>'
                        if (resultsList[index].displayIsbn && this.searchType === '1') {
                            resultsList[index].isbnColor = item.displayIsbn.replace(replaceReg, replaceString)
                        }
                        if (resultsList[index].allTitle && this.searchType === '2') {
                            resultsList[index].allTitleColor = item.allTitle.replace(replaceReg, replaceString)
                        }
                        if ((resultsList[index].classificationNumber || resultsList[index].callNumber) && this.searchType === '6') {
                            resultsList[index].callNumberColor = item.callNumber.replace(replaceReg, replaceString)
                            resultsList[index].classificationNumberColor = item.classificationNumber.replace(replaceReg, replaceString)
                        }
                    }
                })
                this.tableData = []
                this.tableData = resultsList
            }
            if (tableBooklist) {
                tableBooklist.map((item, index) => {
                    if (this.content) {
                        // 匹配关键字正则
                        let replaceReg = new RegExp(this.content, 'g')
                        let replaceString = '<span style="color: red">' + this.content + '</span>'
                        if (resultsList[index].displayIsbn && this.searchType === '1') {
                            resultsList[index].isbnColor = item.displayIsbn.replace(replaceReg, replaceString)
                        }
                        if (tableBooklist[index].allTitle && this.searchType === '2') {
                            tableBooklist[index].allTitleColor = item.allTitle.replace(replaceReg, replaceString)
                        }
                        if ((tableBooklist[index].classificationNumber || tableBooklist[index].callNumber) && this.searchType === '6') {
                            tableBooklist[index].callNumberColor = item.callNumber.replace(replaceReg, replaceString)
                            tableBooklist[index].classificationNumberColor = item.classificationNumber.replace(replaceReg, replaceString)
                        }
                    }
                })
                this.tableBooklist = []
                this.tableBooklist = tableBooklist
            }
        },
        //只检索不跳转
        ActivatedSearch() {
            this.rightNum = 0;
            if (this.checkList.length == 0) {
                return this.$message.error('请选择数据库');
            }
            this.loading();
            this.tableData = [];
            this.checkList.sort((a, b) => {
                return a.sort - b.sort;
            });

            let params = {
                content: this.content,
                searchType: this.searchType,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                marcDatabases: this.checkList
            };
            this.ax
                .post(`/manage/unit/catalog/bibliography/marc`, params)
                .then((res) => {
                    let reg = /[a-zA-Z]+/;
                    let objs;
                    res.map((it) => {
                        if (!it.marcTypeDetailId) {
                            it.marcTypeDetailId = this.defa.marcTypeDetailId;
                        }
                        if (it.source == '中央数据库') {
                            this.labelType = '索书号';
                        } else {
                            this.labelType = '分类号';
                        }
                        if (it.priceStr) {
                            while ((objs = it.priceStr.match(reg))) {
                                it.priceStr = it.priceStr.replace(objs[0], '');
                            }
                            return it.priceStr;
                        }
                    });
                    this.currentPage = 1;
                    this.$refs.searchCotent.blur();
                    this.rightShow = true;
                    this.sloading();
                    if (res.length == 0) {
                        this.$message.error('您输入的检索词检索不到数据');
                        if (this.defaSetChoose.directAdd) {
                            this.$confirm('您输入的检索词检索不到,是否新增数据?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                                .then(() => {
                                    this.add();
                                    this.sloading();
                                })
                                .catch(() => {
                                    this.sloading();
                                });
                        }
                    } else if (res.length == 1) {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));
                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];

                        setTimeout((ress) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                        });
                        if (
                            this.checkList[0].serviceName == '本馆数据库' &&
                            this.searchType != '2' &&
                            JSON.parse(sessionStorage.getItem('rechecking')) == true
                        ) {
                            this.searchBook(res);
                        }
                    } else {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));
                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];
                        setTimeout((res) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                        });
                        if (
                            this.checkList[0].serviceName == '本馆数据库' &&
                            this.searchType != '2' &&
                            JSON.parse(sessionStorage.getItem('rechecking')) == true
                        ) {
                            this.searchBook(res);
                        }
                    }

                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 检索right
        rightSearch() {
            if (this.checkList.length == 0) {
                return this.$message.error('请选择数据库');
            }
            console.log(this.rightNum, 'hhhhh')

            this.loading();
            this.tableData = [];
            // // // console.log(this.checkList)
            // var params = new FormData()
            this.checkList.sort((a, b) => {
                return a.sort - b.sort;
            });

            let params = {
                content: this.content,
                searchType: this.searchType,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                marcDatabases: [this.checkList[this.rightNum]]
            };
            // if(!params.marcDatabases.filter(Boolean).length) return
            this.ax
                .post(`/manage/unit/catalog/bibliography/marc`, params)
                .then((res) => {
                    let reg = /[a-zA-Z]+/;
                    let objs;
                    res.map((it) => {
                        if (!it.marcTypeDetailId) {
                            it.marcTypeDetailId = this.defa.marcTypeDetailId;
                        }
                        if (it.source == '中央数据库') {
                            this.labelType = '索书号';
                        } else {
                            this.labelType = '分类号';
                        }
                        if (it.priceStr) {
                            while ((objs = it.priceStr.match(reg))) {
                                it.priceStr = it.priceStr.replace(objs[0], '');
                            }
                            return it.priceStr;
                        }
                    });
                    this.currentPage = 1;
                    this.$refs.searchCotent.blur();
                    this.rightShow = true;
                    this.sloading();
                    if (res.length == 0) {

                        this.rightNum = this.rightNum + 1;
                        if (this.rightNum === this.checkList.length && res.length === 0) {
                            return this.$message.error('您输入的检索词检索不到数据');
                        }
                        if (this.rightNum == this.checkList.length) {
                            this.rightNum = 0;
                        }
                        this.rightSearch();
                    } else if (res.length == 1) {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));

                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];

                        setTimeout((ress) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                            if (res[0].source != '中央数据库') {
                                if (this.defaSetChoose.directCopy) {
                                    this.register();
                                }
                            }
                            if (res[0].source == '中央数据库' && this.defaSetChoose.directDuplication) {
                                this.copy();
                            }
                        });
                    } else {
                        this.list = res.map((e) => ({
                            ...e,
                            source: e.source == '中央数据库' ? '本馆数据库' : e.source
                        }));
                        this.mapList();
                        let val = this.tableData[this.clickChooseIndex];
                        setTimeout((res) => {
                            this.$refs.multipleTable.toggleRowSelection(val);
                        });
                    }
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 新增
        add() {
            this.$router.push({
                path: 'library/libraryBookInfo',
                query: { autofill: this.defa.autofill }
            });
        },
        // 套录
        register() {
            if (this.chooseBook.length > 1) {
                return this.$message.error('请选择单一图书编目');
            }
            if (this.chooseBook.length == 0 || this.chooseBook[0].source == '' || this.chooseBook[0].source == '本馆数据库') {
                return this.$message.error('请选择非本馆数据库图书编目');
            }
            let info = {
                book: this.chooseBook[0]
            };
            this.$router.push({
                path: 'library/libraryBookInfo',
                query: { copys: JSON.stringify(info), autofill: this.defa.autofill }
            });
        },

        handleCurrentChange1(val) {
            this.currentPage1 = val;
        },
        // 选择模板
        addModel() {
            // // console.log(this.radio)
            this.showModel = false;
            let params = {
                add: false,
                bookBase: this.chooseBook[0],
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            params.marcTemplateDetails = this.radio.marcTemplateDetails.map((it) => {
                let one = '';
                if (it.marcFieldDetailFather.indicatorOne && it.marcFieldDetailFather.indicatorTwo) {
                    one = it.marcFieldDetailFather.indicatorOne + it.marcFieldDetailFather.indicatorTwo;
                } else if (it.marcFieldDetailFather.indicatorOne) {
                    one = it.marcFieldDetailFather.indicatorOne;
                } else if (it.marcFieldDetailFather.indicatorTwo) {
                    one = it.marcFieldDetailFather.indicatorTwo;
                }
                let str = [it.marcFieldDetailFather.note, it.marcFieldDetailFather.code, one, null];
                return str;
            });
            params.bookBase.marcTypeDetailId = this.radio.marcTypeDetailId;
            this.$router.push({
                path: 'library/libraryBookInfo',
                query: { params: JSON.stringify(params) }
            });
        },
        // 多卷
        copys() {
            if (this.isCheck()) {
                return this.$message.error('仅支持对本馆数据库图书编目');
            }
            if (this.chooseBook.length > 1) {
                return this.$message.error('请选择单一图书编目');
            }
            let info = {
                book: this.chooseBook[0]
            };
            console.log('info', info);
            this.$router.push({
                path: 'library/libraryBookInfo',
                query: { copy: JSON.stringify(info), autofill: this.defa.autofill }
            });
            this.dialogTableVisible = false;
        },
        // 副本
        copy() {
            if (this.isCheck()) {
                return this.$message.error('仅支持对本馆数据库图书编目');
            }
            if (this.chooseBook.length > 1) {
                return this.$message.error('请选择单一图书编目');
            }
            let info = {
                defa: this.defa,
                book: this.chooseBook[0],
                params: this.params
            };

            this.$router.push({
                path: 'library/libraryInfo',
                query: { info: JSON.stringify(info), autofill: this.defa.autofill }
            });
            this.dialogTableVisible = false;
        },
        edit() {
            if (this.isCheck()) {
                return this.$message.error('仅支持对本馆数据库图书编目');
            }
            if (this.chooseBook.length > 1) {
                return this.$message.error('请选择单一图书编目');
            }
            let bookBase = this.chooseBook[0];
            this.$router.push({
                path: 'library/libraryBookInfo',
                query: { infos: JSON.stringify(bookBase), autofill: this.defa.autofill }
            });
        },
        // 删除
        del() {
            if (this.isCheck()) {
                return this.$message.error('仅支持对本馆数据库图书编目');
            }
            this.$confirm('是否确认删除当前图书编目?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let ids = this.chooseBook
                        .map((it) => {
                            return it.id;
                        })
                        .join(',');
                    this.ax.delete('/manage/unit/catalog/bibliography/bookBase?ids=' + ids).then((res) => {
                        this.chooseBook.map((item) => {
                            this.tableData.map((it, index) => {
                                if (it.id == item.id) {
                                    this.tableData.splice(index, 1);
                                }
                            });
                        });
                        this.$message.success('删除成功');
                    });
                })
                .catch(() => { });
        },
        // 检查是否单选
        isCheck() {
            if (this.chooseBook.length == 0 || this.chooseBook[0].source != '本馆数据库') {
                //  // console.log(1)
                return true;
            } else {
                //    // console.log(this.chooseBook)
                return false;
            }
        },
        // 选择源
        chooseBox(e) {
            this.checkList.sort((a, b) => {
                return a.sort - b.sort;
            });
            this.rightNum = -1;
            sessionStorage.setItem('chooseLoca', JSON.stringify(this.checkList));

            this.checkList.map((it) => {
                this.options.map((item) => {
                    if (it.type == 'NEW') {
                        if (item.value == 1 || item.value == 2) {
                            item.disabled = false;
                        } else {
                            item.disabled = true;
                        }
                    } else {
                        item.disabled = false;
                    }
                });

                // // console.log(this.options)
            });
            if (this.checkList.length == 1 && this.checkList[0].type == 'NEW') {
                if (this.searchType != '1' && this.searchType != '2') {
                    if (this.searchType != '') {
                        this.searchType = '';
                        this.$message.error('当前查询项目不能在Z39.50查询');
                    }
                }
            }
        },
        // 单选
        handleCurrentChoose(val) {
            // // console.log(val)
            // // console.log(1)
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(val);
        },
        handledbClick(val) {
            this.chooseBook.map((it) => {
                if (it.isbn == val.isbn) {
                    if (val.source !== '本馆数据库') {
                        this.register();
                    } else {
                        // // console.log(123)
                        this.edit();
                    }
                }
            });
        },
        // 改变大小
        handleSizeChange(val) {
            this.pageSize = val;
            this.mapList();
        },
        // 页面改版
        handleCurrentChange(val) {
            this.currentPage = val;
            this.mapList();
        },
        handleSizeChangeBook(val) {
            this.pageSizeBook = val;
            this.mapList();
        },
        handleCurrentChangeBook(val) {
            this.currentPageBook = val;
            this.mapList();
        },
        // 数据分页
        mapList() {
            this.tableData = this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            this.tableData.map((it) => {
                it.callNumber = it.classificationNumber;
                if (it.speciesNumber) {
                    it.callNumber += '/' + it.speciesNumber;
                }
                if (it.auxiliaryNumber && it.auxiliaryNumber != 'null') {
                    it.callNumber += '/' + it.auxiliaryNumber;
                }
                if (!it.allTitle) {
                    it.allTitle = it.positiveTitle;
                    if (it.subTitle) {
                        it.allTitle += ':' + it.subTitle;
                    }
                    if (it.sectionTitle) {
                        it.allTitle += '.' + it.sectionTitle;
                    }
                    if (it.sectionNumber) {
                        it.allTitle += '.' + it.sectionNumber;
                    }
                }
            });
            this.tableBooklist = this.listbook.slice(
                (this.currentPageBook - 1) * this.pageSizeBook,
                this.currentPageBook * this.pageSizeBook
            );
            this.tableBooklist.map((it) => {
                it.callNumber = it.classificationNumber;
                if (it.speciesNumber) {
                    it.callNumber += '/' + it.speciesNumber;
                }
                if (it.auxiliaryNumber && it.auxiliaryNumber != 'null') {
                    it.callNumber += '/' + it.auxiliaryNumber;
                }
                if (!it.allTitle) {
                    it.allTitle = it.positiveTitle;
                    if (it.subTitle) {
                        it.allTitle += ':' + it.subTitle;
                    }
                    if (it.sectionTitle) {
                        it.allTitle += '.' + it.sectionTitle;
                    }
                    if (it.sectionNumber) {
                        it.allTitle += '.' + it.sectionNumber;
                    }
                }
            });
            this.changeColor(this.tableData, this.tableBooklist);

        },
        // 选择查询数据
        handleSelectionChange(val) {
            this.chooseBook = val;
        }
    }
};
</script>

<style scoped>
.sizes {
    margin-left: 1rem;
    color: #999999;
    font-size: 0.88rem;
    font-weight: 400;
}

.library {
    position: relative;
}

.title_info {
    width: 4rem;
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: #999999;
}

.library .source {
    font-size: 1rem;
    font-weight: normal;
    color: #000000;
    line-height: 3rem;
    border-bottom: 1px solid #dcdcdc;
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

.library_bottom div:not(:last-child) {
    border-right: 1px solid #dcdcdc;
}

.add_btn {
    width: 1rem;
    height: 1rem;
    background: rgba(38, 127, 249, 1);
    border-radius: 3px;
    color: #fff;
    text-align: center;
    line-height: 0.9rem;
    margin-bottom: 18px;
}

/* 加载模板弹框 */
.title_model {
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: #999999;
}

.box_border {
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #dddddd;
    min-height: 200px;
}

.boxChoose {
    overflow: auto;
}
</style>