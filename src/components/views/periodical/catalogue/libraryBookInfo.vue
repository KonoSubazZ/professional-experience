<template>
    <div>
        <div class="container libraryInfo" :style="height" @click="closeMenu">
            <div class="padding_20">
                <el-tabs
                    v-model="activeName"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    class="m-b-20"
                >
                    <el-tab-pane label="表单编目" name="first">
                        <div class="fromFirst">
                            <div>
                                <el-form
                                    :model="formData"
                                    :rules="rules"
                                    ref="formData"
                                    label-width="100px"
                                >
                                    <div class="display_flex between">
                                        <el-form-item class="w-30" label="ISSN号">
                                            <el-input
                                                v-model="formData.issn"
                                                @input="getMarc(formData.issn,'issn')"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item label="统一刊号" class="w-30">
                                            <el-input
                                                v-model="formData.unifiedIssue"
                                                @input="getMarc(formData.unifiedIssue,'unifiedIssue')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item label="邮发刊号" class="w-20">
                                            <el-input
                                                v-model="formData.postNumber"
                                                @input="getMarc(formData.postNumber,'postNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item label="国外发行刊号" class="w-20">
                                            <div class="display_flex">
                                                <el-input
                                                    @input="getMarc(formData.issuedAbroad,'issuedAbroad')"
                                                    v-model="formData.issuedAbroad"
                                                ></el-input>
                                            </div>
                                        </el-form-item>
                                    </div>

                                    <div class="display_flex between">
                                        <el-form-item label="刊名" class="w-30">
                                            <el-input
                                                v-model="formData.title"
                                                @input="getMarc(formData.title,'title')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item label="当年原名" class="w-30">
                                            <el-input
                                                v-model="formData.oldTitle"
                                                @input="getMarc(formData.oldTitle,'oldTitle')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="卷册信息">
                                            <el-input
                                                v-model="formData.volumeInformation"
                                                @input="getMarc(formData.volumeInformation,'volumeInformation')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="第一责任者">
                                            <el-input
                                                v-model="formData.responsible"
                                                @input="getMarc(formData.responsible,'responsible')"
                                            ></el-input>
                                        </el-form-item>
                                    </div>

                                    <div class="display_flex between"></div>

                                    <div class="display_flex between">
                                        <el-form-item label="单价" class="w-30">
                                            <el-input
                                               id="price"
                                                v-model="formData.priceStr"
                                                @input="getMarc(formData.priceStr,'priceStr')"
                                                @blur="getPrice(formData.priceStr)"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-30" label="总价">
                                            <el-input
                                                v-model="formData.totalPriceStr"
                                                @input="getMarc(formData.totalPriceStr,'totalPriceStr')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="语种" prop="language">
                                            <el-select
                                                v-model="formData.language"
                                                clearable
                                                class="w-100"
                                                @input="getMarc(formData.language,'language')"
                                            >
                                                <el-option
                                                    v-for="item in params.languages"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.name"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="文献类型" prop="medium">
                                            <el-select
                                                v-model="formData.medium"
                                                clearable
                                                placeholder="文献类型"
                                                class="w-100"
                                                @input="getMarc(formData.medium,'medium')"
                                            >
                                                <el-option
                                                    v-for="item in params.mediums"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.name"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>

                                    <div class="display_flex between">
                                        <el-form-item class="w-30" label="出版地">
                                            <el-input
                                                v-model="formData.publisherPlace"
                                                class="m-r-10"
                                                @input="getMarc(formData.publisherPlace,'publisherPlace')"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-30" label="出版社">
                                            <el-input
                                                v-model="formData.publisher"
                                                class="m-r-10"
                                                @input="getMarc(formData.publisher,'publisher')"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="出版年">
                                            <el-input
                                                v-model="formData.publicationDate"
                                                @input="getMarc(formData.publicationDate,'publicationDate')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="出版周期">
                                            <el-input
                                                v-model="formData.publishingCycle"
                                                @input="getMarc(formData.publishingCycle,'publishingCycle')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>
                                    </div>

                                    <div class="display_flex between">
                                        <el-form-item label="页码" class="w-30">
                                            <el-input
                                                v-model="formData.pageNumber"
                                                @input="getMarc(formData.pageNumber,'pageNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-30" label="尺寸">
                                            <el-input
                                                v-model="formData.formatSize"
                                                @input="getMarc(formData.formatSize,'formatSize')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-20" label="装帧方式">
                                            <el-input
                                                v-model="formData.bindingMethod"
                                                @input="getMarc(formData.bindingMethod,'bindingMethod')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item label="其他号" class="w-20">
                                            <el-input
                                                v-model="formData.otherNumber"
                                                @input="getMarc(formData.otherNumber,'otherNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>
                                    </div>

                                    <div class="display_flex between"></div>

                                    <el-form-item label="备注">
                                        <el-input
                                            v-model="formData.note"
                                            @input="getMarc(formData.note,'note')"
                                            type="textarea"
                                            :row="3"
                                            class="m-r-10 textarea"
                                        ></el-input>
                                    </el-form-item>

                                    <div class="display_flex between">
                                        <el-form-item
                                            label="分类号"
                                            class="w-30"
                                            prop="classificationNumber"
                                        >
                                            <el-input
                                                v-model="formData.classificationNumber"
                                                @input="getMarc(formData.classificationNumber,'classificationNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-30" label="种次号" prop>
                                            <el-input
                                                v-model="formData.speciesNumber"
                                                id="speciesNumber"
                                                @input="getMarc(formData.speciesNumber,'speciesNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>

                                        <el-form-item class="w-30" label="辅助区分" prop>
                                            <el-input
                                                v-model="formData.auxiliaryNumber"
                                                @input="getMarc(formData.auxiliaryNumber,'auxiliaryNumber')"
                                                class="m-r-10"
                                            ></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="MARC编目" name="second" class="Marc">
                        <table border="0" cellpadding="0" cellspacing="0" @contextmenu="openMenu">
                            <tr class="w-100 MarcTitle MarcText">
                                <td>
                                    <div class="textBox f-s-12 f-w-b">字段名称</div>
                                </td>
                                <td>
                                    <div class="box_marc f-s-12 f-w-b">字段标识符</div>
                                </td>
                                <td>
                                    <div class="box_marcs f-s-12 f-w-b">指</div>
                                </td>
                                <td>
                                    <div class="w-50 f-s-12 f-w-b padding_20">内容</div>
                                </td>
                            </tr>
                            <tr v-for="(item,i) of form.newMarc" :key="i">
                                <td class="textMarc">
                                    <div class="w-100 f-s-12">{{item[0]}}</div>
                                </td>
                                <td class="textCode">
                                    <el-input
                                        v-model="item[1]"
                                        @focus="getIndex"
                                        @blur="shtName(item[1],i)"
                                        class="w-100"
                                        :id="'code'+i"
                                        maxlength="3"
                                        @input="checkContent(item[3],i,'input'+i)"
                                    ></el-input>
                                </td>
                                <td class="textQ">
                                    <el-input
                                        v-model="item[2]"
                                        :id="'index'+i"
                                        @focus="getIndex"
                                        maxlength="2"
                                    ></el-input>
                                </td>

                                <td class="w-84">
                                    <div class="w-100">
                                        <textarea
                                            spellcheck="false"
                                            v-model="item[3]"
                                            class="textareas"
                                            style="border:0"
                                            :rows="Math.ceil(item[3].length/97) >0?Math.ceil(item[3].length/97):1"
                                            @focus="getIndex"
                                            :id="'input'+i"
                                            @select="getVal"
                                            @keydown.enter="changeInput"
                                            @input="checkContent(item[3],i,'input'+i)"
                                        ></textarea>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                </el-tabs>
                <!-- 已有 -->
                <div>
                    <div class="b-b-1 m-b-20 display_flex between">
                        <div class="padding_20 info m-b-10">馆藏信息</div>
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            v-if="chooseBookCope.length>0 && !showAdd"
                            @click="delBook"
                        >删除</el-button>
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            v-if="chooseBookCope.length>0 && showAdd"
                            @click="delBooks"
                        >删除</el-button>
                    </div>
                    <div class="display_flex between">
                        <el-form
                            :model="cope"
                            :rules="rules"
                            ref="cope"
                            label-width="100px"
                            class="w-100"
                        >
                            <div class="display_flex between w-100">
                                <el-form-item class="w-25" label="单价">
                                    <el-input v-model="cope.priceStr" id="copePrice"  @keyup.enter.native="getBooksList('addnumber')" class="m-r-10"></el-input>
                                </el-form-item>
                                <el-form-item class="w-25" label="复本数">
                                    <el-input
                                        id="addnumber"
                                        :disabled="!showAdd"
                                        v-model="cope.addNumber"
                                         @keyup.enter.native="getBooksList('code')"
                                        class="m-r-10"
                                    ></el-input>
                                </el-form-item>

                                <el-form-item class="w-25" prop="code" label="条码号">
                                    <el-input
                                        id="code"
                                        v-model="cope.code"
                                        @keyup.enter.native="getBooksList('')"
                                        class="m-r-10"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 展示现在已经存在的 -->
                    <div class="m-b-20" v-show="!showAdd">
                        <el-table
                            class="m-b-20"
                            ref="multipleTables"
                            :data="bookList.content"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="barCode" align="center" label="条形码">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.barCode" v-if="scope.row.edit"></el-input>
                                    <div v-else>{{scope.row.barCode}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="price" align="center" label="单价">
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="scope.row.price"
                                        class="w-80"
                                        v-if="scope.row.edit"
                                    ></el-input>
                                    <div v-else>{{scope.row.price}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="callNumber" align="center" label="索书号"></el-table-column>

                            <el-table-column prop="batchName" align="center" label="批次号">
                                <template slot-scope="scope" align="center">
                                    <el-select
                                        v-model="scope.row.batchName"
                                        v-if="scope.row.edit"
                                        @change="changeName(scope.row.batchId,scope.row.batchName,params.batches)"
                                        class="w-90"
                                    >
                                        <el-option
                                            v-for="item in params.batches"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name"
                                        ></el-option>
                                    </el-select>
                                    <div v-else>{{scope.row.batchName}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="rackName" align="center" label="架位号">
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="scope.row.rackName"
                                        v-if="scope.row.edit"
                                    ></el-input>
                                    <div v-else>{{scope.row.rackName}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="managerName" align="center" label="入库人员 "></el-table-column>

                            <el-table-column prop="warehousingTime" align="center" label="入库时间 ">
                                <template slot-scope="scope">
                                    <div>{{getTime(scope.row.warehousingTime)}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="collectionPlaceName"
                                align="center"
                                label="馆藏地址 "
                            >
                                <template slot-scope="scope" align="center">
                                    <div class="display_flex" v-if="scope.row.edit">
                                        <el-select
                                            v-model="scope.row.collectionPlaceName"
                                            @change="changeName(scope.row.collectionPlaceId,scope.row.collectionPlaceName,params.collectionPlaces)"
                                            class="w-70 m-r-5"
                                            :disabled="scope.row.isPlace"
                                        >
                                            <el-option
                                                v-for="item in params.collectionPlaces"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.name"
                                            ></el-option>
                                        </el-select>
                                        <el-checkbox
                                            v-model="scope.row.isPlace"
                                            @change="savePlace(scope.row.isPlace,scope.row,scope.$index)"
                                        >默认</el-checkbox>
                                    </div>

                                    <div v-else>{{scope.row.collectionPlaceName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bookStatus" align="center" label="状态">
                                <template slot-scope="scope">
                                    <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                                    <el-select
                                        v-model="scope.row.bookStatus"
                                        clearable
                                        v-if="scope.row.edit"
                                        class="w-80"
                                    >
                                        <el-option
                                            v-for="item in options"
                                            :key="item.key"
                                            :label="item.name"
                                            :value="item.key"
                                        ></el-option>
                                    </el-select>

                                    <div v-else>{{option[scope.row.bookStatus].name}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="bookStatus" align="center" label="操作">
                                <template slot-scope="scope">
                                    <div class="table-action flex-row flex-wrap flex_center">
                                        <el-button
                                            size="mini"
                                            type="text"
                                            class="m-r-20"
                                            @click="scope.row.edit = true"
                                            v-if="!scope.row.edit"
                                        >修改</el-button>
                                        <el-button
                                            size="mini"
                                            type="text"
                                            class="m-r-20"
                                            @click="saveCodes(scope.row.edit,scope)"
                                            v-else
                                        >保存</el-button>
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
                            :total="total"
                        ></el-pagination>
                    </div>
                    <!-- 展示预生成的 -->
                    <div class="m-b-20" v-show="showAdd">
                        <el-table
                            ref="multipleTable"
                            :data="bookList.content"
                            tooltip-effect="dark"
                            @selection-change="handleSelectionChange"
                            style="width: 100%"
                        >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="barCode" align="center" label="条形码">
                                <template slot-scope="scope" align="center">
                                    <el-input v-model="scope.row.barCode"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="price" align="center" label="单价">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.price" class="w-40"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column prop="callNumber" align="center" label="索书号"></el-table-column>

                            <el-table-column prop="batchName" align="center" label="批次号">
                                <template slot-scope="scope" align="center">
                                    <el-select
                                        v-model="scope.row.batchName"
                                        @change="changeName(scope.row.batchId,scope.row.batchName,params.batches)"
                                        class="w-90"
                                    >
                                        <el-option
                                            v-for="item in params.batches"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name"
                                        ></el-option>
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
                                    <div>{{getTime(scope.row.warehousingTime)}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="collectionPlaceName"
                                align="center"
                                label="馆藏地址 "
                            >
                                <template slot-scope="scope" align="center">
                                    <div class="display_flex">
                                        <el-select
                                            v-model="scope.row.collectionPlaceName"
                                            @change="changeName(scope.row.collectionPlaceId,scope.row.collectionPlaceName,params.collectionPlaces)"
                                            class="w-70 m-r-5"
                                            :disabled="scope.row.isPlace"
                                        >
                                            <el-option
                                                v-for="item in params.collectionPlaces"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.name"
                                            ></el-option>
                                        </el-select>
                                        <el-checkbox
                                            v-model="scope.row.isPlace"
                                            @change="savePlace(scope.row.isPlace,scope.row,scope.$index)"
                                        >默认</el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="bookStatus" align="center" label="状态">
                                <template slot-scope="scope">
                                    <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                                    <el-select
                                        v-model="scope.row.bookStatus"
                                        clearable
                                        class="w-80"
                                    >
                                        <el-option
                                            v-for="item in options"
                                            :key="item.key"
                                            :label="item.name"
                                            :value="item.key"
                                        ></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="display_flex choose">
                    <div @click="save('formData')" class="text_center cursor m-r-20">
                        <img src="../../../../assets/img/add.png" class="btn_img" />
                        <div class="f-s-14">保存(F8)</div>
                    </div>
                    <div @click="back" class="text_center cursor m-r-20">
                        <img src="../../../../assets/img/return.png" class="btn_img" />
                        <div class="f-s-14">取消(F9)</div>
                    </div>
                </div>
            </div>

            <div
                class="marcMenus"
                id="marcMenus"
                :style="menu?'display:block':'display:none'"
                @click="getFun"
            >
                <div class="display_flex between f-s-12 muens" data-index="0">
                    <div data-index="0">新建</div>
                    <div data-index="0">Alt+N</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="1">
                    <div data-index="1">插入子字段</div>
                    <div data-index="1">Ctrl+Enter</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="2">
                    <div data-index="2">插入字段</div>
                    <div data-index="2">Insert</div>
                </div>
                <div class="hr">
                    <div class="br"></div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="3">
                    <div data-index="3">复制</div>
                    <div data-index="3">Ctrl + C</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="4">
                    <div data-index="4">剪切</div>
                    <div data-index="4">Ctrl + X</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="5">
                    <div data-index="5">粘贴</div>
                    <div data-index="5">Ctrl + V</div>
                </div>
                <div class="hr">
                    <div class="br"></div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="7">
                    <div data-index="7">删除字段</div>
                    <div data-index="7">Ctrl + D</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="8">
                    <div data-index="8">删除子字段</div>
                    <div data-index="8">Alt + D</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="9">
                    <div data-index="9">复制整个MARC</div>
                    <div data-index="9">Ctrl + Shift + C</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="10">
                    <div data-index="10">粘贴整个MARC</div>
                    <div data-index="10">Ctrl + Shift + V</div>
                </div>
                <div class="hr">
                    <div class="br"></div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="11">
                    <div data-index="11">自动生成数据</div>
                    <div data-index="11">Alt + A</div>
                </div>

                <div class="display_flex between f-s-12 muens" data-index="13">
                    <div data-index="13">生成拼音</div>
                    <div data-index="13">Ctrl + B</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="14">
                    <div data-index="14">字段排序</div>
                    <div data-index="14">Alt + P</div>
                </div>
                <div class="display_flex between f-s-12 muens" data-index="15">
                    <div data-index="15">数据校验</div>
                    <div data-index="15">Alt + Y</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import List from '../../../view/List';
import Vue from 'vue';
export default {
    components: {
        List
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (!value || value === '') {
                callback(new Error('请输入ISBN'));
            } else {
                let reg = /^([0-9-]+)$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字和横线'));
                }
                let arr = value.replace(/[^0-9]/gi, '');
                arr = arr.split('');
                if (arr.length != 13) {
                    callback(new Error('请输入13位ISBN'));
                } else {
                    callback();
                }
            }
        };
        var validateCode = (rule, value, callback) => {
            if (!value || value === '') {
                callback(new Error('请输入条码号'));
            } else {
                let reg = /^([0-9-]+)$/;
                let arr = value.split('');
                let end = arr.pop() * 1;
                if (!reg.test(end)) {
                    callback(new Error('格式不正确'));
                } else {
                    callback();
                }
            }
        };
        return {
            // chooseBookCope
            delIds: '',
            chooseBookCope: [], //选择书
            pageSize: 5,
            total: 0,
            currentPage: 0,
            selectionStart: -1,
            chooseValue: '', //选择的值
            chooseValueIndex: '',
            copeValue: '',
            isPlace: true,
            option: [],
            bookList: {},
            arr: [],
            fullscreenLoading: false,
            cope: {
                priceStr: '1',
                addNumber: 0,
                code: ''
            }, //多卷
            menu: false,
            checkIsbn: false,
            isShowBlock: false,
            createModel: false,
            addBlockForms: [],
            meta: '',
            height: '', //高度
            activeName: '',
            formData: {
                isbn: '',
                medium: '',
                language: '',
                positiveTitle: '',
                tiedTitle: '',
                subTitle: '',
                sectionTitle: '',
                sectionNumber: '',
                firstResponsible: '',
                otherResponsible: '',
                publisher: '',
                publicationDate: '',
                seriesTitle: '',
                seriesOwner: '',
                pageNumber: '',
                edition: '',
                annex: '',
                chart: '',
                bindingMethod: '',
                formatSize: '',
                generalNotes: '',
                keywords: '',
                contentSummary: '',
                classificationNumber: '',
                speciesNumber: '',
                auxiliaryNumber: ''
            },
            form: {}, //表单对应字段

            // 默认设置
            defaultSet: {},
            // 选择参数
            params: {},
            rules: {
                // isbn: [{ validator: validatePass, trigger: 'blur' }],
                code: [{ validator: validateCode, trigger: 'blur' }],
                isbn: [{ required: true, message: '请输入', trigger: 'blur' }],
                positiveTitle: [{ required: true, message: '请输入', trigger: 'blur' }],
                priceStr: [{ required: true, message: '请输入', trigger: 'blur' }],
                auxiliaryNumber: [{ required: true, message: '请输入', trigger: 'blur' }],

                medium: [{ required: true, message: '请选择', trigger: 'change' }],

                speciesNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
                classificationNumber: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            // show 是否显示馆藏信息
            show: false,
            checked: '',
            options: [],
            tableData: [],
            isAdd: {},
            showAdd: '', //是否展示
            // info
            click: {},
            info: {}
        };
    },
    created() {
        if (sessionStorage.getItem('settingJOURNAL')) {
            let obj = JSON.parse(sessionStorage.getItem('settingJOURNAL'));
            if (obj.openMethod == '1') {
                this.activeName = 'first';
            } else {
                this.activeName = 'second';
            }
            this.getSet(false); //获取设置
        } else {
            this.getSet(); //获取设置
        }
        this.getDefault();
        this.metaLists(); //获取meta

        this.metaList(); //获取meta

        let obj;

        if (this.$route.query.copys) {
            // 套录
            this.show = true;
            this.showAdd = true;
            this.isAdd = true;
            obj = JSON.parse(this.$route.query.copys).book;
        } else if (this.$route.query.copy) {
            // 多卷
            this.show = true;
            this.isAdd = false;
            this.showAdd = true;
            let params = JSON.parse(this.$route.query.copy).book;
            params.id = '';
            obj = params;
        } else if (this.$route.query.infos) {
            // 修改
            this.show = false;
            this.isAdd = false;
            obj = JSON.parse(this.$route.query.infos);
        } else {
            // 新增
            this.show = true;
            this.showAdd = true;

            obj = null;
        }

        if (obj) {
            this.ax
                .post('/manage/unit/journal/journalCataloging/journalBaseDetail', {
                    add: this.isAdd,
                    journalBase: obj,
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id
                })
                .then((res) => {
                    this.form = res;

                    this.formData = res;
                    this.getSetting(); //获取设置
                    if (res.newMarc) {
                        res.newMarc = this.getMapList(res.newMarc).filter((it) => {
                            return it.length == 4;
                        });
                        this.checkContent();
                    } else {
                        res.newMarc = this.info.marcTemplateDetails;
                        this.form.newMarc = res.newMarc;
                    }
                    this.cope.priceStr = this.form.priceStr;
                });
        } else {
            this.ax
                .post('/manage/unit/journal/journalCataloging/addJournalBaseDetail', {
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id
                })
                .then((res) => {
                    this.form = res;

                    this.formData = res;
                    this.getSetting(); //获取设置
                    res.newMarc = this.getMapList(res.newMarc).filter((it) => {
                        return it.length == 4;
                    });
                    this.checkContent();
                });
        }

        this.height = this.$height(160);
    },
    mounted() {
        document.onkeydown = (e) => {
            // console.log(e);
            let key = window.event.keyCode;
            if (key == 17) {
                return;
            }
            if (key == '78' && e.altKey) {
                this.form.newMarc = [];
                this.form.newMarc = this.form.marcFieldDetails.map((it) => {
                    let arr = [];
                    arr[0] = it.note;
                    arr[1] = it.code;
                    arr[2] = '';
                    arr[3] = '';
                    return arr;
                });
            }

            // save
            if (key == 119) {
                e.preventDefault();
                this.save('formData');
            }
            // back
            else if (key == 120) {
                this.back();
            } else if (key == '33' && e.path.length == 21) {
                //page
                e.preventDefault();
                let input = document.getElementById('input0');
                input.focus();
            } else if (key == '34' && e.path.length == 21) {
                //page
                e.preventDefault();
                let id = this.form.newMarc.length - 1;
                let input = document.getElementById('input' + id);
                // console.log(input);
                input.focus();
            } else if (key == '36' && e.path.length >= 21) {
                //home

                let id = e.target.id;

                let num1 = id.toString().replace(/[^\d\.\d]/gi, '');
                // console.log(num1);
                id = id.replace(num1, '');
                // console.log(id);
                let input = '';
                if (e.target.selectionStart == this.selectionStart) {
                    this.selectionStart = -1;
                    if (id == 'input') {
                        input = 'index';
                    } else if (id == 'index') {
                        input = 'code';
                    }
                    // console.log(input + num1);
                    let doc = document.getElementById(input + num1);
                    // console.log(doc);
                    doc.focus();
                } else {
                    this.selectionStart = 0;
                }

                //  let id = this.form.newMarc.length-1
                //  let input = document.getElementById('input'+id)
                //  input.focus();
            } else if (key == '38' && e.path.length == 21) {
                //方向
                let id = e.path[0].id;
                id = id.replace('input', '');

                id -= 1;
                if (id < 0) {
                    id = 0;
                } else if (id > this.form.newMarc.length) {
                    id = this.form.newMarc.length;
                }
                let input = document.getElementById('input' + id);
                input.focus();
            } else if (key == '40' && e.path.length == 21) {
                //方向
                let id = e.path[0].id;
                id = id.replace('input', '');
                id = id * 1 + 1;
                if (id < 0) {
                    id = 0;
                } else if (id > this.form.newMarc.length) {
                    id = this.form.newMarc.length;
                }
                let input = document.getElementById('input' + id);
                input.focus();
            } else if (key == 112) {
                e.preventDefault();
                let price = document.getElementById('price');
                price.focus();
            } else if (key == 113) {
                e.preventDefault();
                let addnumber = document.getElementById('addnumber');
                addnumber.focus();
            } else if (key == 114) {
                e.preventDefault();
                let code = document.getElementById('code');
                code.focus();
                speciesNumber;
            } else if (key == 115) {
                let speciesNumber = document.getElementById('speciesNumber');
                speciesNumber.focus();
            } else if (key == '78' && e.ctrlKey) {
                e.preventDefault();
            } else if (key == '13' && e.ctrlKey) {
                //插入
                document.execCommand('insertText', 'false', '▼');
            } else if (key == '45' && e.path.length == 21) {
                //字段

                this.form.newMarc.splice(this.chooseValueIndex * 1 + 1, 0, ['', '', '', '']);
            } else if (key == '68' && e.ctrlKey) {
                //ctrl+d
                e.preventDefault();
                this.form.newMarc.splice(this.chooseValueIndex, 1);
            } else if (key == '68' && e.altKey) {
                //alt+c
                e.preventDefault();

                let index = this.form.newMarc[this.chooseValueIndex][3].lastIndexOf('▼');

                if (index != -1) {
                    let str = this.form.newMarc[this.chooseValueIndex][3].slice(index);
                    let arr = this.form.newMarc;
                    arr[this.chooseValueIndex][3] = arr[this.chooseValueIndex][3].replace(str, '');
                    this.form.newMarc = arr;
                    this.checkContent('', this.chooseValueIndex, 'input' + this.chooseValueIndex);
                    Vue.set(this.form.newMarc, '', '');
                }
            } else if (key == '67' && e.shiftKey && e.ctrlKey && !e.altKey) {
                // c+s+c
                sessionStorage.setItem('marc', JSON.stringify(this.form.newMarc));
            } else if (key == '86' && e.shiftKey && e.ctrlKey && !e.altKey) {
                //c+s+v
                this.form.newMarc = JSON.parse(sessionStorage.getItem('marc'));
            } else if (key == '83' && e.altKey && !e.shiftKey && !e.ctrlKey) {
                //alt+s
                this.save('formData');
            } else if (key == '66' && e.ctrlKey && !e.shiftKey && !e.altKey) {
                //拼音
                 e.preventDefault();

                let start = e.path[0].selectionStart;
                let end = e.path[0].selectionEnd;
                let chooose = e.path[0].value.slice(start, end);

                let str = this.pinyin(chooose, { style: this.pinyin.STYLE_NORMAL }).join(' ');

                document.execCommand('insertText', 'false', chooose);

                this.form.newMarc[this.chooseValueIndex][3] = this.form.newMarc[this.chooseValueIndex][3] + '▼9' + str;

                

                // Vue.set(this.form.newMarc, '', '');
            } else if (key == '80' && !e.ctrlKey && e.altKey && !e.shiftKey) {
                //排序
                this.form.newMarc.sort((a, b) => {
                    return a[1] - b[1];
                });
            } else if (key == '89' && !e.ctrlKey && e.altKey && !e.shiftKey) {
                //校验
                this.checkValue();
            }
        };
    },
    methods: {
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
                    let ids = this.chooseBookCope
                        .map((it) => {
                            return it.id;
                        })
                        .join(',');
                    this.chooseBookCope.map((its) => {
                        this.bookList.content.map((it, index) => {
                            if (its.id == it.id) {
                                this.bookList.content.splice(index, 1);
                            }
                        });
                    });
                    this.delIds = ids;
                })
                .catch(() => {});
        },
        delBooks() {
            if (this.chooseBookCope.length == 0) {
                return this.$message.warning('请选择删除书本');
            }
            this.$confirm('是否确认删除当前选择?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.chooseBookCope.map((its) => {
                        this.tableData.map((it, index) => {
                            if (its.barCode == it.barCode) {
                                this.tableData.splice(index, 1);
                            }
                        });
                    });
                })
                .catch(() => {});
        },
        // xedlBook
        del() {
            this.ax.delete('/manage/unit/journal/journalCataloging/journal?ids=' + this.delIds).then((res) => {});
        },
        // 选择书本
        handleSelectionChange(val) {
            this.chooseBookCope = val;
        },
        // 切换
        handleSizeChange(val) {
            this.pageSize = val - 1;
            this.getBooks();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getBooks();
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

        changeInput(e) {
            // console.log(123)
            e.preventDefault();
            let id = e.path[0].id;
            id = id.replace('input', '');
            id = id * 1 + 1;
          
            if (id < 0) {
                id = 0;
            }
            // else
             else if (id >= this.form.newMarc.length) {
                    id = this.form.newMarc.length-1
                       // console.log(id)
                  if(this.form.newMarc[id][1]==905){
                        // // // console.log(this.form.newMarc[id][3])
                           // console.log(id)
                           this.getBooksList('copePrice')
                  }
                  return
               
               
            }
           
            let input = document.getElementById('input' + id);
            input.focus();
        },
        // 校验s
        checkValue() {
            let repit = false;
            let maxlength = false;
            let oneWory = false;
            let twoWory = false;

            this.form.marcFieldDetails.map((it) => {
                if (this.form.newMarc[this.chooseValueIndex][1] == it.code) {
                    //  重复
                    if (!it.duplicate) {
                        let arr0 = this.form.newMarc.map((it) => {
                            return it[1];
                        });
                        let arr = Array.from(new Set(arr0));

                        if (arr.length == this.form.newMarc.length) {
                        } else {
                            // console.log('有');
                            repit = true;
                        }
                    }
                    // 定长
                    if (it.fixedLength) {
                        // console.log(this.form.newMarc[this.chooseValueIndex][3].length);
                        if (this.form.newMarc[this.chooseValueIndex][3].length > it.totalLength) {
                            // console.log('长度大于了');
                            maxlength = true;
                        }
                    }
                    // 指
                    let one = this.form.newMarc[this.chooseValueIndex][2].split('');

                    if (one.length == 1) {
                        if (it.indicatorOne.indexOf(one[0]) == -1) {
                            // console.log('第一个错误');
                            oneWory = true;
                        }
                    } else if (one.length == 2) {
                        if (it.indicatorOne) {
                            if (it.indicatorOne.indexOf(one[0]) == -1) {
                                // console.log('第一个错误');
                                oneWory = true;
                            }
                        }
                        if (it.indicatorTwo) {
                            if (it.indicatorTwo.indexOf(one[1]) == -1) {
                                // console.log('第2个错误');
                                twoWory = true;
                            }
                        }
                    }
                    let text = '';
                    if (repit) {
                        text += '当前字段重复,';
                    }
                    if (maxlength) {
                        text += '当前字段长度超出,';
                    }
                    if (oneWory) {
                        text += '当前字段，指第一位错误,';
                    }
                    if (twoWory) {
                        text += '当前字段，指第二位错误.';
                    }
                    if (text == '') {
                        this.$alert('当前数据正确', '校验结果', {
                            confirmButtonText: '确定'
                        });
                    } else {
                        this.$alert(text, '校验结果', {
                            confirmButtonText: '确定'
                        });
                    }

                    // if(){}
                }
            });
        },
        // 设置对应名称
        shtName(val, index) {
            this.form.marcFieldDetails.map((it) => {
                if (val == it.code) {
                    // console.log(it.note);
                    this.form.newMarc[index][0] = it.note;
                    Vue.set(this.form, '', '');
                }
            });
        },
        // 当前焦点
        getIndex(e) {
            // console.log(e);
            let id = e.path[0].id;
            // id = id.replace('input', '');
            id = id.toString().replace(/[^\d\.\d]/gi, '');
            // console.log(id);
            this.chooseValueIndex = id;
        },
        getVal(val) {
            let text;

            if (window.getSelection) {
                text = window.getSelection();
            } else if (document.selection) {
                text = document.selection.createRange();
            }
        },
        // 菜单点击
        getFun(e) {
            let index = e.target.dataset.index;

            if (index == 0) {
                this.form.newMarc = [];
                this.form.newMarc = this.form.marcFieldDetails.map((it) => {
                    let arr = [];
                    arr[0] = it.note;
                    arr[1] = it.code;
                    arr[2] = '';
                    arr[3] = '';
                    return arr;
                });
            } else if (index == 1) {
                document.execCommand('insertText', 'false', '▼');
            } else if (index == 2) {
                //插入
                this.form.newMarc.splice(this.chooseValueIndex * 1 + 1, 0, ['', '', '', '']);
            } else if (index == 3) {
                this.copeValue = this.chooseValue;
                document.execCommand('Copy', 'false', null);
            } else if (index == 4) {
                this.copeValue = this.chooseValue;
                document.execCommand('Cut', 'false', null);
            } else if (index == 5) {
                document.execCommand('insertText', 'false', this.copeValue);
            } else if (index == 7) {
                ///删除
                this.form.newMarc.splice(this.chooseValueIndex, 1);
            } else if (index == 8) {
                let index = this.form.newMarc[this.chooseValueIndex][3].lastIndexOf('▼');
                if (index != -1) {
                    let str = this.form.newMarc[this.chooseValueIndex][3].slice(index);
                    this.form.newMarc[this.chooseValueIndex][3] = this.form.newMarc[this.chooseValueIndex][3].replace(str, '');
                    this.checkContent('', this.chooseValueIndex, 'input' + this.chooseValueIndex);
                }
            } else if (index == 9) {
                //复制marc
                sessionStorage.setItem('marc', JSON.stringify(this.form.newMarc));
            } else if (index == 10) {
                this.form.newMarc = JSON.parse(sessionStorage.getItem('marc'));
            } else if (index == 11) {
                //生成数据
            } else if (index == 12) {
                //保存
                this.save('formData');
            } else if (index == 13) {
                //拼音

                let str = this.pinyin(this.chooseValue, { style: this.pinyin.STYLE_NORMAL }).join(' ');
                let number = str.indexOf('▼');

                if (number != -1) {
                    str = str.substring(number * 1 + 2);
                }
                // console.log(str);
                if (str == '') {
                    this.$message.warning('请选择要转换的中文');
                    // this.$message.success('保存成功');
                    return;
                }

                let index = this.form.newMarc[this.chooseValueIndex][3].indexOf('▼9');

                if (index == -1) {
                    this.form.newMarc[this.chooseValueIndex][3] = this.form.newMarc[this.chooseValueIndex][3] + '▼9' + str;
                } else {
                    // this.form.newMarc[this.chooseValueIndex][3].splice(index)
                    this.$message.warning('当前字段已有拼音');
                    // this.$message.success('保存成功');
                }

                // document.execCommand("insertText","false",str)
            } else if (index == 14) {
                //排序

                //  // console.log( this.form.newMarc)
                this.form.newMarc.sort((a, b) => {
                    return a[1] - b[1];
                });
                //   // console.log( this.form.newMarc)
            } else if (index == 15) {
                //效验

                this.checkValue();
            }
        },
        // 右键菜单
        openMenu(e) {
            // console.log(e);
            e.preventDefault();

            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            let str = e.target.value.slice(start, end);

            // console.log(e.target.value);

            if (str == '' || str == null) {
                this.chooseValue = e.target.value;
            } else {
                this.chooseValue = str;
            }
            let marcMenus = document.getElementById('marcMenus');

            var x = e.clientX; // 鼠标的x坐标
            var y = e.clientY; //鼠标的y坐标
            // console.log(y);
            let hei = document.documentElement.clientHeight;
            // console.log(hei);
            if (y >= hei - marcMenus.offsetHeight || hei - y < 420) {
                if (marcMenus.offsetHeight) {
                    y = y - marcMenus.offsetHeight;
                } else {
                    y = y - 400;
                }
            }
            // console.log(y);
            marcMenus.style.top = y + 'px';
            marcMenus.style.left = x + 'px';

            this.menu = true;
        },
        closeMenu() {
            this.menu = false;
        },
        // 选择
        changeName(e, name, row) {
            if (e) {
                row.map((it) => {
                    if (it.name == name) {
                        e = it.id;
                    }
                });
            }
        },
        // 监听事件
        monitor() {},
        // getMapList
        getMapList(val) {
            // return new Promise(resolve => {
            val = val.split(';');
            val = val.map((it) => {
                return (it = it.split(',').map((item) => {
                    return (item = item
                        .split('\u001F')
                        .map((its) => {
                            if (its == 'b91MARC' || its == 'b51MARC' || its == 'bNLC') {
                                its = 'bBWL';
                            }
                            return its;
                        })
                        .join('▼'));
                }));
            });
            // resolve(val);
            return val;
            // });
        },
       // 传入对应
        mapFrom(index, str, text) {
            let code = this.form.newMarc[index][1];

          

            if (code == 905 && str == 'd') {
                if (text) {
                    this.formData.classificationNumber = text;
                    this.getMarc(this.formData.classificationNumber, 'classificationNumber', true);
                }
            } else if (code == 905 && str == 'e') {
                if (text) {
                    this.formData.speciesNumber = text;
                    this.getMarc(this.formData.speciesNumber, 'speciesNumber');
                 }else{
                    
                    this.ax
                    .get('/manage/unit/general/speciesNumber', {
                        params: {
                            classificationNumber: this.formData.classificationNumber,
                            medium:this.formData.medium,
                            platformId: JSON.parse(localStorage.getItem('user')).platform.id
                        }
                    })
                    .then((res) => {
                        
                       let arr = this.form.newMarc[index][3].split('▼')
                       arr = arr.map(it=>{
                            let str = it.slice(0, 1);
                            let text = it.slice(1);
                           
                            if(str=='e'){
                                 text = res;
                                  this.formData.speciesNumber = text;
                                  this.getMarc(this.formData.speciesNumber, 'speciesNumber');
                                 return  it = str+text
                                
                            }
                           

                            return it
                            
                       })
                     
                     this.form.newMarc[index][3] =  arr.join("▼")
                   
                       
                    });
                }
            } else if (code == 905 && str == 'v') {
                if (text) {
                    this.formData.auxiliaryNumber = text;
                    this.getMarc(this.formData.auxiliaryNumber, 'auxiliaryNumber');
                }
            }

            this.arr.map((it) => {
                it.value.split(',').map((item) => {
                    
                

                    if (code + str == item && code!=606) {

                        if (it.value.split(',').length == 1) {


                                    if (it.name == 'priceStr') {
                                        text = text.split(',')[0];
                                        let num1 = text.toString().replace(/[^\d\.\d]/gi, '');
                                        num1 = parseInt(num1)
                                        num1 = num1.toFixed(2)
                                    
                                        this.form[it.name] = num1;
                                        this.getPrice(num1);
                                    } else {
                                        this.form[it.name] = text;
                                    }

                        } else {
                            // // console.log(it.name);
                            if (this.form[it.name] == '' || it.name == 'priceStr') {
                                        if (it.name == 'priceStr') {
                                            text = text.split(',')[0];
                                            let num1 = text.toString().replace(/[^\d\.\d]/gi, '');
                                            num1 = parseInt(num1)
                                            num1 = num1.toFixed(2)
                                            this.form[it.name] = num1;
                                            this.getPrice(num1);
                                        }
                                        // else if(){}
                                        else {
                                            this.form[it.name] = text;
                                        }
                            } else {
                                this.form[it.name] = this.form[it.name] + '-' + text;
                            }
                        }

                    } else if(code==606 && code + str == item && text!='' ){
                              
                               let index = this.form.keywords.indexOf(text)
                            
                                if( this.form.keywords =='' || this.form.keywords ==null){
                                     this.form.keywords = text
                                }else{
                                    if(index== -1){
                                        this.form.keywords = this.form.keywords+ '-' + text;
                                    }
                                }

                            }
                });
            });
        },
        // 去除空格
        diyTrim(str) {
            var result = '';
            let start; //非空起始位置
            let end; //非空终止位置
            //注意全角和半角！！！！
            //全角空格 Unicode编码 12288
            //半角空格 Unicode编码 32
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) != 12288 && str.charCodeAt(i) != 32) {
                    // //  // console.log(i);
                    start = i;
                    break;
                }
            }
            for (let i = str.length - 1; i >= 0; i--) {
                if (str.charCodeAt(i) != 12288 && str.charCodeAt(i) != 32) {
                    end = i + 1;
                    break;
                }
            }
            result = str.substring(start, end);

            return result;
        },
        // 遍历表单
        mapCheck(val, index) {
            let object = this.form.bookBaseCorrespond;
            this.arr = [];
            for (let key in object) {
                this.arr.push({ name: key, value: String(object[key]) });
            }
        },
        // 对应表单
        checkContent(val, index, id) {
            Vue.set(this.form.newMarc, '', '');

            if (val) {
                let length = this.form.newMarc[index][3].indexOf('\\');

                this.form.newMarc[index][3] = val.replace('\\', '▼');
                setTimeout((it) => {
                    if (length > -1) {
                        let input = document.getElementById(id);

                        input.selectionStart = length + 1;
                        input.selectionEnd = length + 1;
                        input.focus();
                    }
                });

                let lengths = this.form.newMarc[index][3].indexOf('▼');
                if (lengths == -1) {
                    return;
                }
                val.split('▼').map((item) => {
                    let str = item.slice(0, 1);
                    let text = item.slice(1);
                    this.mapFrom(index, str, text);
                });
            } else {
                if (this.arr.length == 0) {
                    let object = this.form.bookBaseCorrespond;
                    this.arr = [];
                    for (let key in object) {
                        this.arr.push({ name: key, value: String(object[key]) });
                    }
                }
                this.form.newMarc.map((item, i) => {
                    if (item[3] == undefined && item[3] == null && item.length < 2) {
                        return;
                    } else {
                        item[3].split('▼').map((it) => {
                            let str = it.slice(0, 1);
                            let text = it.slice(1);
                            this.mapFrom(i, str, text);
                        });
                    }
                });
            }
        },
        // 传入对应
        mapFrom(index, str, text) {
            let code = this.form.newMarc[index][1];

            if (code == 905 && str == 'd') {
                if (text) {
                    this.formData.classificationNumber = text;
                    this.getMarc(this.formData.classificationNumber, 'classificationNumber', true);
                }
            } else if (code == 905 && str == 'e') {
                if (text) {
                    this.formData.speciesNumber = text;
                    this.getMarc(this.formData.speciesNumber, 'speciesNumber');
                }
            } else if (code == 905 && str == 'v') {
                if (text) {
                    this.formData.auxiliaryNumber = text;
                    this.getMarc(this.formData.auxiliaryNumber, 'auxiliaryNumber');
                }
            }
            this.arr.map((it) => {
                it.value.split(',').map((item) => {
                    if (code + str == item) {
                        if (it.value.split(',').length == 1) {
                            if (it.name == 'priceStr') {
                                text = text.split(',')[0];
                                let num1 = text.toString().replace(/[^\d\.\d]/gi, '');
                                num1 = parseInt(num1)
                                num1 = num1.toFixed(2)
                                num1 =num1>0?num1:0
                                this.form[it.name] = num1;
                                this.getPrice(num1);
                            }
                            // else if(){}
                            else {
                                this.form[it.name] = text;
                            }
                        } else {
                            // console.log(it.name);
                            if (this.form[it.name] == '' || it.name == 'priceStr') {
                                if (it.name == 'priceStr') {
                                    text = text.split(',')[0];
                                    let num1 = text.toString().replace(/[^\d\.\d]/gi, ' ');
                                    num1 = parseFloat(num1)
                                    num1 = num1.toFixed(2)
                                    num1 =num1>0?num1:0
                                    this.form[it.name] = num1;
                                    this.getPrice(num1);
                                }
                                // else if(){}
                                else {
                                    this.form[it.name] = text;
                                }
                            } else {
                                this.form[it.name] = this.form[it.name] + '-' + text;
                            }
                        }
                    }
                });
            });
        },
        // 添加实体书，多卷
        addBook(res) {
            this.loading();
            let marc = JSON.stringify(res);

            let params = {
                journalBase: JSON.parse(marc),
                journals: this.bookList.content
            };
            params.journalBase.newMarc = '';
            this.ax
                .post('/manage/unit/journal/journalCataloging/journalNew', params)
                .then((res) => {
                    this.sloading();
                    this.$message.success('保存成功');
                    if (JSON.parse(sessionStorage.getItem('setting')).newCheck) {
                        this.back();
                    } else {
                        this.getSet();
                        ////  //  // console.log(res)
                        this.getBooksList();
                    }
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 添加实体书，多卷
        addBooks(res) {
            this.loading();
            this.cope.bookBaseId = res.id;
            this.cope.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax
                .post('/manage/unit/journal/journalCataloging/journal', this.cope)
                .then((res) => {
                    this.sloading();

                    if (JSON.parse(sessionStorage.getItem('setting')).newCheck) {
                        this.back();
                    } else {
                        this.getSet();
                        ////  //  // console.log(res)
                        this.getBooksList();
                    }
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 获取书本--预生成
        getBooksList(id) {
            if (!this.show) {
                 if(id){
                     let input = document.getElementById(id);
                     input.focus();
                }
                return;
            }

            if (this.cope.addNumber == '' || this.cope.addNumber == 0 || this.cope.code == '' || this.cope.code == 0) {
                return;
            }
            let price = this.cope.priceStr.toString().replace(/[^\d\.\d]/gi, '');
            let bookBase = JSON.stringify(this.formData);
            // console.log(this.formData);
            let params = {
                addNumber: this.cope.addNumber,
                journalBase: JSON.parse(bookBase),
                code: this.cope.code,
                price: price,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            params.journalBase.newMarc = '';
            this.ax.post('/manage/unit/journal/journalCataloging/foreseeJournal', params).then((res) => {
                // console.log(res);
                 if(id){
                     let input = document.getElementById(id);
                     input.focus();
                }
                res.map((it) => {
                    it.isPlace = false;
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
                this.bookList = {
                    content: res
                };
            });
        },
        // 获取书本列表
        getBooks() {
            this.ax
                .get('/manage/unit/journal/journalCataloging/journal', {
                    params: {
                        journalBaseId: this.formData.id,
                        size: this.pageSize,
                        page: this.currentPage,
                        platformId: JSON.parse(localStorage.getItem('user')).platform.id
                    }
                })
                .then((res) => {
                    // console.log(res);
                    res.journalList.content.map((it) => {
                        it.edit = false;
                    });
                    this.bookList = {
                        content: res.journalList.content
                    };
                    this.total = res.journalList.totalElements;
                });
        },
        // 获取快捷设置 --快捷键的
        getSet(isTure) {
            this.ax
                .get('/manage/unit/general/catalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, marcType: 'JOURNAL' }
                })
                .then((res) => {
                    sessionStorage.setItem('settingJOURNAL', JSON.stringify(res));
                    if (isTure) {
                        if (res.openMethod == '1') {
                            this.activeName = 'first';
                        } else {
                            this.activeName = 'second';
                        }
                    }

                    if (res.lastBarCode) {
                        this.cope.code = res.lastBarCode;
                    }
                });
        },
        // 获取价格
        getPrice(val) {
            this.cope.priceStr = val;
        },
        // 获取默认设置--文献等搜索的设置
        getSetting() {
            this.ax
                .get('/manage/unit/journal/journalCataloging/journalCatalogSetting', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    this.defaultSet = res;
                    this.formData.medium = this.defaultSet.mediumName;
                    this.formData.language = this.defaultSet.languageName;
                    if (!this.show && !this.isAdd) {
                    } else {
                        this.cope.addNumber = res.number;
                    }
                    if (this.show) {
                        this.getBooksList();
                    } else {
                        this.getBooks();
                    }
                });
        },
        // 获取选择参数--select
        getDefault() {
            return new Promise((resolve) => {
                this.ax
                    .get('/manage/unit/journal/journalCataloging/obtainEditJournalCatalogSetting', {
                        params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                    })
                    .then((res) => {
                        //  ////  //  // console.log(res)
                        this.params = res;

                        resolve(res);
                    });
            });
        },
        // 保存
        save(formName) {
            if (this.cope.code == '' || this.cope.code == null) {
                return this.$message.warning('请输入文献条码');
            }
            this.loading();

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formData.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
                    let params = JSON.stringify(this.formData);
                    let marc;

                    if (this.form.newMarc) {
                        // debugger
                        marc = JSON.stringify(this.form.newMarc);

                        marc = JSON.parse(marc);
                        marc = marc
                            .map((it) => {
                                it = it.join(',');
                                return it;
                            })
                            .join(';');
                    }
                    // this.formData.newMarc = marc

                    // let params
                    params = JSON.parse(params);

                    params.newMarc = marc;

                    // console.log(params);
                    if (!this.$route.query.copy) {
                        this.formData.id = this.form.id;
                    } else {
                        this.formData.id = '';
                    }

                    this.formData.marcTypeDetailName = this.form.marcTypeDetailName;
                    this.formData.marcTypeDetailId = this.form.marcTypeDetailId;
                    this.ax
                        .post('/manage/unit/journal/journalCataloging/journalBase', params)
                        .then((res) => {
                            // console.log(res);

                            if (this.delIds) {
                                this.del();
                            }

                            if (this.cope.code != '' && this.cope.addNumber != '') {
                                // console.log(222);
                                this.addBook(res);
                            } else {
                                if (JSON.parse(sessionStorage.getItem('settingJOURNAL')).newCheck) {
                                    this.back();
                                }
                            }
                            this.sloading();
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

        // saveCodes
        saveCodes(isAdd, obj) {
            // console.log(isAdd);
            // console.log(obj);
            let bookBase = JSON.stringify(this.form);
            let params = {
                journalBase: JSON.parse(bookBase),
                journals: [obj.row]
            };
            params.journalBase.newMarc = '';
            this.ax
                .post('/manage/unit/journal/journalCataloging/journalNew', params)
                .then((res) => {
                    this.sloading();

                    this.sloading();
                    obj.row.edit = false;
                    this.getBooksList();
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.MarcFieldDetail' } }).then((res) => {
                res.insertable = false;
                res.edit = 'NONE';
                res.subs.map((it) => {
                    if (it.key == 'createTime' || it.key == 'platformId' || it.key == 'marcType') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    // if (it.key == 'marcBookField') {
                    //     this.options = it.searchOption;
                    // }
                    if (this.activeName == 'BOOK' && it.key == 'marcJournalField') {
                        it.displayInList = false;
                    } else if (this.activeName == 'JOURNAL' && it.key == 'marcBookField') {
                        it.displayInList = false;
                    }
                });
                ////  //  // console.log(res);
                this.meta = res;
            });
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
        }
    }
};
</script>

<style >
.container .el-form-item--mini.el-form-item,
.container .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
.Marc .el-input--small .el-input__inner {
    height: 20px;
    line-height: 20px;
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
    padding: 5px;
}
.MarcTitle {
    width: 100%;
    text-align: left;
    /* padding: 0 20px; */
    height: 40px;
    background: rgba(241, 245, 249, 1);
}
.MarcContents {
    width: 100%;
    text-align: left;
    /* padding: 0 20px; */
    min-height: 45px;
}
.MarcText {
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    color: rgba(48, 49, 57, 1);
}
.MarcContent {
    height: 50px;
    line-height: 50px;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 20px;
    box-sizing: border-box;
}
.MarcContents {
    box-sizing: border-box;
    padding-right: 10px;
    border: 1px solid rgba(221, 221, 221, 0.1);
}

.MarcContents:not(:first-child) {
    border-top: 0;
}
.MarcContents input {
    border: 0;
}
.MarcText div {
    /* padding: 0 15px; */
    /* text-align: center; */
}
.box_marc {
    width: 70px;
    border-right: 1px solid #ddd;
    text-align: center;
    box-sizing: border-box;
    height: 45px;
    line-height: 45px;
    /* min-height: 44px; */
}
.maxbe {
    position: relative;
}
.maxbe_a {
    position: absolute;
    top: 10px;
    left: 22px;
}

.textBox {
    /* background: #0abebe; */
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-right: 1px solid #ddd;
}

.textarea {
    resize: none;
}
.textareas,
.textareas:focus {
    resize: none;
    border: 0;
    box-sizing: border-box;
    outline: none;
}
.box_marcs {
    height: 40px;
    line-height: 40px;
    width: 50px;
    border-right: 1px solid #dddddd;
    text-align: center;
    /* margin:auto; */
}
.textMarc {
    width: 120px;
    background: #ddeeee;
    text-align: center;
    line-height: 11px;
    border-bottom: 1px solid #ddd;
}
.textMarc .el-input__inner {
    border: 0 !important;
}
.textCode {
    width: 70px;
    border-bottom: 1px solid #ddd;
    /* border: 0 !important; */
    border-right: 1px solid #ddd !important;
}
.textCode .el-input__inner,
.textQ .el-input__inner {
    border: 0 !important;
}
.textCode .el-input.is-active .el-input__inner,
.textCode .el-input__inner:focus,
.textQ .el-input.is-active .textQ .el-input__inner,
.textQ .el-input__inner:focus {
    border: 0;
}
.textQ {
    width: 50px;
    /* border: 0 !important; */
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd !important;
}
.textareas {
    width: 100%;
    height: 100%;
    line-height: 22px;
}
.w-84 {
    width: 84%;
}
.Marc {
    /* position: relative; */
}
.marcMenus {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 200px;
    min-height: 400px;
    background: #e8f7f8;
    border: 1px solid #f5f5f5;
    box-shadow: 0 0 1px #777777;
    /* display: none; */
    padding: 0 0 0 20px;
}

.muens {
    background: #fff;
    padding: 5px 10px;
}
.muens:hover {
    background: #f5f5f5;
}
.hr {
    height: 0px;
    width: 100%;

    background: #fff;
    padding: 5px 0;
}
.br {
    border-bottom: 1px solid #ddd;
}
.blockDel {
    height: 64px;
}
</style>
