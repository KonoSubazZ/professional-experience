<template>
  <div>
    <div class="container libraryInfo" :style="'height:' + height + 'px'" @click="closeMenu">
      <div class="padding_20">
        <el-tabs v-model="activeName" v-loading.fullscreen.lock="fullscreenLoading" class="m-b-20">
          <el-tab-pane label="表单编目" name="first">
            <div class="fromFirst">
              <div>
                <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
                  <div class="display_flex between">
                    <div class="display_flex start maxbe w-30">
                      <el-form-item label="标准编号" class="w-100">
                        <div class="display_flex">
                          <el-input @input="getMarc(formData.isbn, 'isbn')" v-model="formData.isbn"
                            class="m-r-10"></el-input>
                          <el-checkbox v-model="checked" @change="checkIsbns(formData.isbn)">13位ISBN
                          </el-checkbox>
                        </div>
                      </el-form-item>


                    </div>
                    <el-form-item class="w-15" label="统一书号" label-width="100px">
                      <!--                                            <span style="font-size: 14px; color: #606266">{{ isbnUnite }}</span>-->
                      <el-input v-model="formData.isbnRealUnite" class="m-r-10"
                        @input="getMarc(formData.isbnRealUnite, 'isbnRealUnite')"></el-input>
                    </el-form-item>
                    <el-form-item class="w-15" prop="priceStr" label="单价">
                      <el-input id="price" v-model="formData.priceStr" @input="getMarc(formData.priceStr, 'priceStr')"
                        class="m-r-10" @blur="getPrice(formData.priceStr)"></el-input>
                    </el-form-item>

                    <el-form-item class="w-20" label="文献类型" prop="medium">
                      <el-select v-model="formData.medium" clearable placeholder="文献类型" class="w-100"
                        @input="getMarc(formData.medium, 'medium')">
                        <el-option v-for="item in params.mediums" :key="item.id" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item class="w-20" label="文献语种" prop="language">
                      <el-select v-model="formData.language" clearable placeholder="文献语种" class="w-100"
                        @input="getMarc(formData.language, 'language')">
                        <el-option v-for="item in params.languages" :key="item.id" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>

                  <div class="display_flex between">
                    <el-form-item label="正题名" class="w-30" prop="positiveTitle">
                      <el-input v-model="formData.positiveTitle" @input="getMarc(formData.positiveTitle, 'positiveTitle')"
                       class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="副题名">
                      <el-input v-model="formData.subTitle" class="m-r-10"
                        @input="getMarc(formData.subTitle, 'subTitle')"></el-input>
                    </el-form-item>

                    <el-form-item label="分辑名" class="w-20">
                      <el-input v-model="formData.sectionTitle" class="m-r-10"
                        @input="getMarc(formData.sectionTitle, 'sectionTitle')"></el-input>
                    </el-form-item>

                    <el-form-item class="w-20" label="分辑号">
                      <el-input v-model="formData.sectionNumber" class="m-r-10"
                        @input="getMarc(formData.sectionNumber, 'sectionNumber')"></el-input>
                    </el-form-item>
                  </div>

                  <div class="display_flex between">
                    <el-form-item class="w-30" label="并列题名">
                      <el-input v-model="formData.tiedTitle" class="m-r-10"
                        @input="getMarc(formData.tiedTitle, 'tiedTitle')"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="第一责任者">
                      <el-input v-model="formData.firstResponsible"
                        @input="getMarc(formData.firstResponsible, 'firstResponsible')" class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item label="其他责任者" class="w-40">
                      <el-input v-model="formData.otherResponsible"
                        @input="getMarc(formData.otherResponsible, 'otherResponsible')" class="m-r-10"></el-input>
                    </el-form-item>
                  </div>

                  <div class="display_flex between">
                    <el-form-item class="w-30" label="出版地">
                      <el-input v-model="formData.publisherPlace"
                        @input="getMarc(formData.publisherPlace, 'publisherPlace')" class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="出版社">
                      <el-input v-model="formData.publisher" @input="getMarc(formData.publisher, 'publisher')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item label="出版年" class="w-20">
                      <el-input v-model="formData.publicationDate"
                        @input="getMarc(formData.publicationDate, 'publicationDate')" class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item label="重印年" class="w-20">
                      <el-input v-model="formData.reprintYear" @input="getMarc(formData.reprintYear, 'reprintYear')"
                        class="m-r-10"></el-input>
                    </el-form-item>
                  </div>

                  <div class="display_flex between">
                    <el-form-item class="w-30" label="丛书名">
                      <el-input v-model="formData.seriesTitle" @input="getMarc(formData.seriesTitle, 'seriesTitle')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="丛书责任者">
                      <el-input v-model="formData.seriesOwner" @input="getMarc(formData.seriesOwner, 'seriesOwner')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-20" label="版次">
                      <el-input v-model="formData.edition" @input="getMarc(formData.edition, 'edition')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-20" label="装帧方式">
                      <el-input v-model="formData.bindingMethod"
                        @input="getMarc(formData.bindingMethod, 'bindingMethod')" class="m-r-10"></el-input>
                    </el-form-item>
                  </div>

                  <div class="display_flex between">
                    <el-form-item label="页码" class="w-30">
                      <el-input v-model="formData.pageNumber" @input="getMarc(formData.pageNumber, 'pageNumber')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item label="图表" class="w-30">
                      <el-input v-model="formData.chart" @input="getMarc(formData.chart, 'chart')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item label="开本尺寸" class="w-20">
                      <el-input v-model="formData.formatSize" @input="getMarc(formData.formatSize, 'formatSize')"
                        class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-20" label="附件">
                      <el-input v-model="formData.annex" @input="getMarc(formData.annex, 'annex')"
                        class="m-r-10"></el-input>
                    </el-form-item>
                  </div>

                  <el-form-item label="一般性附注">
                    <el-input v-model="formData.generalNotes" @input="getMarc(formData.generalNotes, 'generalNotes')"
                      class="m-r-10"></el-input>
                  </el-form-item>

                  <el-form-item label="主题词">
                    <el-input v-model="formData.keywords" @input="getMarc(formData.keywords, 'keywords')"
                      class="m-r-10"></el-input>
                  </el-form-item>

                  <el-form-item label="内容摘要">
                    <el-input v-model="formData.contentSummary"
                      @input="getMarc(formData.contentSummary, 'contentSummary')" type="textarea" :row="3"
                      class="m-r-10 textarea"></el-input>
                  </el-form-item>

                  <div class="display_flex between">
                    <el-form-item label="分类号" class="w-30" prop="classificationNumber">
                      <el-input id='classificationNumber' v-model="formData.classificationNumber"
                        @input="getMarc(formData.classificationNumber, 'classificationNumber')"
                        @blur="getBooksList(''); getSpeNumber();" @keyup.enter.native="changeBook(
                          cableType == '种次号' ? 'speciesNumber' : cableType == '著者号' ? 'authorNumber' : cableType == '四角号码' ? 'sihms' : 'authorNumberSZM'
                        )" class="m-r-10"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="种次号" v-if="cableType === '种次号'" prop="speciesNumber">
                      <el-input v-model.trim="formData.speciesNumber" id="speciesNumber"
                        @input="getMarc(formData.speciesNumber, 'speciesNumber', true)" class="m-r-10"
                        @keyup.enter.native="changeBook('auxiliaryNumber')"
                        @blur="getSpeNumber(), getBooksList('')"></el-input>
                    </el-form-item>
                    <el-form-item class="w-30" label="著者号" v-if="cableType === '著者号'" prop="authorNumber">
                      <el-input v-model="formData.authorNumber" id="authorNumber"
                        @input="getMarc(formData.authorNumber, 'authorNumber', true)" class="m-r-10"
                        @keyup.enter.native="changeBook('auxiliaryNumber')" @blur="getSpeNumber"></el-input>
                    </el-form-item>
                    <el-form-item class="w-30" label="四角号码" v-if="cableType === '四角号码'" prop="sihms">
                      <el-input v-model="formData.sihms" id="sihms" @input="getMarc(formData.sihms, 'sihms', true)"
                        class="m-r-10" @keyup.enter.native="changeBook('auxiliaryNumber')" @blur="getSpeNumber"
                        onkeyup="value = value.replace(/[^\d]/g,'')" maxlength="4"></el-input>
                    </el-form-item>
                    <el-form-item class="w-30" label="著者首拼" v-if="cableType === '著者首拼'" prop="authorNumberSZM">
                      <el-input v-model="formData.authorNumberSZM" id="authorNumberSZM"
                        @input="getMarc(formData.authorNumberSZM, 'authorNumberSZM', true)" class="m-r-10"
                        @keyup.enter.native="changeBook('auxiliaryNumber')" @blur="getSpeNumber"></el-input>
                    </el-form-item>

                    <el-form-item class="w-30" label="辅助区分">
                      <el-input id='auxiliaryNumber' v-model="formData.auxiliaryNumber"
                        @input="getMarc(formData.auxiliaryNumber, 'auxiliaryNumber')"
                        @keyup.enter.native="getBooksList('')" class="m-r-10"></el-input>
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
              <tr v-for="(item, i) of form.newMarc" :key="i">
                <td class="textMarc">
                  <div class="w-100 f-s-12">{{ item[0] }}</div>
                </td>
                <td class="textCode">
                  <el-input v-model="item[1]" @focus="getIndex(i)" @blur="shtName(item[1], i)" class="w-100"
                    :id="'code' + i" maxlength="3" @input="checkContent(item[3], i, 'input' + i)"></el-input>
                </td>
                <td class="textQ">
                  <el-input v-model="item[2]" :id="'index' + i" @focus="getIndex" maxlength="2"></el-input>
                </td>

                <td class="w-84">
                  <div class="w-100">
                    <textarea spellcheck="false" v-model="item[3]" class="textareas" style="border:0"
                      :rows='Math.ceil(item[3].length / 97) > 0 ? Math.ceil(item[3].length / 97) : 1' @focus="getIndex"
                      :id="'input' + i" @select="getVal" @keydown.enter="changeInput"
                      @input="checkContent(item[3], i, 'input' + i)"></textarea>
                  </div>
                </td>
              </tr>
            </table>
          </el-tab-pane>
        </el-tabs>
        <!-- 已有 -->
        <div>
          <div class=" m-b-20 display_flex between">
            <div style="position:relative" class="padding_20 info m-b-10">
              <p>馆藏信息</p>
            </div>
            <el-button type="primary" plain icon="el-icon-refresh" @click="getBooks">刷新</el-button>
            <el-button type="danger" plain icon="el-icon-delete" v-if="chooseBookCope.length > 0 && !showAdd"
              @click="delBook">删除
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" v-if="chooseBookCope.length > 0 && showAdd"
              @click="delBooks">删除
            </el-button>
          </div>
          <div class="display_flex between">
            <el-form :model="cope" :rules="rules" ref="cope" label-width="100px" class="w-100">
              <div class="display_flex between w-100">
                <el-form-item class="w-25" label="单价">
                  <el-input v-model="cope.priceStr" @input="getMarc(cope.priceStr, 'priceStr')" id="copePrice"
                    @blur="formData.priceStr = cope.priceStr" @keyup.enter.native="getBooksList('addnumber')"
                    class="m-r-10"></el-input>
                </el-form-item>
                <el-form-item class="w-25" label="复本数">
                  <el-input v-if="xiugai == true" id="addnumber" :disabled='!showAdd' v-model="total"
                    @keyup.enter.native="getBooksList('addnumber')" @blur="getBooksList('addnumber')"
                    class="m-r-10"></el-input>
                  <el-input v-else id="addnumber" :disabled='!showAdd' v-model="cope.addNumber"
                    @keyup.enter.native="getBooksList('addnumber')" @blur="getBooksList('addnumber')"
                    class="m-r-10"></el-input>

                </el-form-item>
                <span style="font-size:14px;color:#ccc" v-if="xiugai == true">编辑下无法添加复本，请使用“复本”功能进行添加</span>
                <el-form-item class="w-25" prop="code" label="条码号">
                  <el-input id="code" v-model="cope.code" @keyup.enter.native="getBooksList('')"
                    class="m-r-10"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <!-- 展示现在已经存在的 -->
          <div class="m-b-20" v-show="!showAdd">
            <el-table class="m-b-20" ref="multipleTables" :data="bookList.content" tooltip-effect="dark"
              style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="barCode" align="center" label="条形码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.barCode" v-if="scope.row.edit"></el-input>
                  <div v-else>{{ scope.row.barCode }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="price" align="center" label="单价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" class="w-80" v-if="scope.row.edit"></el-input>
                  <div v-else>{{ scope.row.price }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="callNumber" align="center" label="索书号"></el-table-column>

              <el-table-column prop="batchName" align="center" label="批次号">
                <template slot-scope="scope" align="center">
                  <el-select v-model="scope.row.batchName" v-if="scope.row.edit"
                    @change="changeName(scope.row.batchId, scope.row.batchName, params.batches)" class="w-90">
                    <el-option v-for="item in params.batches" :key="item.id" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.batchName }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="rackName" align="center" label="架位号">
                <template slot-scope="scope">
                  <!--                  <el-input v-model="scope.row.rackName" v-if="scope.row.edit"></el-input>-->
                  <el-autocomplete v-if="scope.row.edit" class="inline-input" v-model="scope.row.rackName"
                    :fetch-suggestions="querySearch" placeholder="请输入架位号"></el-autocomplete>
                  <div v-else>{{ scope.row.rackName }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="managerName" align="center" label="入库人员 "></el-table-column>

              <el-table-column prop="warehousingTime" align="center" width='240' label="入库时间 ">
                <template slot-scope="scope">
                  <div>{{ getTime(scope.row.warehousingTime) }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="collectionPlaceName" align="center" label="馆藏地址 " width='250'>
                <template slot-scope="scope" align="center">
                  <div class="display_flex" v-if="scope.row.edit">
                    <el-select v-model="scope.row.collectionPlaceId"
                      @change="changeNames('collectionPlaceId', scope.row.collectionPlaceName, params.collectionPlaces, scope.row)"
                      class="w-70 m-r-5" :disabled="scope.row.isPlace">
                      <el-option v-for="item in params.collectionPlaces" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                    <el-checkbox v-model="scope.row.isPlace"
                      @change="savePlace(scope.row.isPlace, scope.row, scope.$index)">默认
                    </el-checkbox>
                  </div>
                  <div v-else>{{ params.collectionPlaces.filter(it => it.id == scope.row.collectionPlaceId).length > 0 ?
                    params.collectionPlaces.filter(it => it.id == scope.row.collectionPlaceId)[0].name :
                    scope.row.collectionPlaceName ? scope.row.collectionPlaceName : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="documentCirculationTypeId" align="center" label="文献流通类型">
                <template slot-scope="scope">
                  <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                  <el-select v-model="scope.row.documentCirculationTypeId" clearable v-if="scope.row.edit" class="w-80">
                    <el-option v-for="item in circulationList" :key="item.id" :label="item.name"
                      :value="item.id"></el-option>
                  </el-select>


                  <!-- <div v-else>{{ scope.row.documentCirculationTypeId != null ?
                    circulationList.filter(e => e.id === scope.row.documentCirculationTypeId)[0].name : '' }}</div> -->
                    <div v-else>{{ scope.row.documentCirculationTypeId != null ?
                    circulationList.filter(e => e.id === scope.row.documentCirculationTypeId)[0] !=null ?circulationList.filter(e => e.id === scope.row.documentCirculationTypeId)[0].name :'' : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bookStatus" align="center" label="状态">
                <template slot-scope="scope">
                  <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                  <el-select v-model="scope.row.bookStatus" clearable v-if="scope.row.edit" class="w-80">
                    <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key"></el-option>
                  </el-select>


                  <div v-else>{{ option[scope.row.bookStatus].name }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="bookStatus" align="center" label="操作">
                <template slot-scope="scope">
                  <div class="table-action flex-row flex-wrap flex_center">
                    <el-button size="mini" type="text" class="m-r-20" @click="scope.row.edit = true"
                      :disabled="scope.row.rackDetailId && scope.row.collectionPlaceId && scope.row.rackId === null ? true : false"
                      v-if="!scope.row.edit">修改
                    </el-button>
                    <el-button size="mini" type="text" class="m-r-20" @click="saveCodes(scope.row.edit, scope)" v-else>
                      保存
                    </el-button>

                  </div>
                </template>
              </el-table-column>

            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPageTwo" :page-sizes="[5, 10, 20, 50]" :page-size="pageSize"
              layout=" prev, pager, next, jumper,total,sizes" :total="total"></el-pagination>
          </div>
          <!-- 展示预生成的 -->
          <div class="m-b-20" v-show="showAdd">

            <el-table ref="multipleTable" :data="showListInfo" tooltip-effect="dark"
              @selection-change="handleSelectionChange" style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="barCode" align="center" label="条形码">
                <template slot-scope="scope" align="center">
                  <el-input v-model="scope.row.barCode"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="price" align="center" width='100' label="单价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" class="w-80"></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="callNumber" align="center" label="索书号"></el-table-column>

              <el-table-column prop="batchName" align="center" label="批次号">
                <template slot-scope="scope" align="center">
                  <el-select v-model="scope.row.batchName"
                    @change="changeName(scope.row.batchId, scope.row.batchName, params.batches)" class="w-90">
                    <el-option v-for="item in params.batches" :key="item.id" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="rackName" align="center" label="架位号">
                <template slot-scope="scope">
                  <!--                  <el-input v-model="scope.row.rackName"></el-input>-->
                  <el-autocomplete class="inline-input" v-model="scope.row.rackName" :fetch-suggestions="querySearch"
                    placeholder="请输入架位号"></el-autocomplete>
                </template>
              </el-table-column>

              <el-table-column prop="managerName" align="center" label="入库人员 "></el-table-column>

              <el-table-column prop="warehousingTime" align="center" label="入库时间 ">
                <template slot-scope="scope">
                  <div>{{ getTime(scope.row.warehousingTime) }}</div>
                </template>
              </el-table-column>

              <el-table-column prop="collectionPlaceName" align="center" width='180' label="馆藏地址 ">
                <template slot-scope="scope" align="center">
                  <div class="display_flex">
                    <el-select v-model="scope.row.collectionPlaceName"
                      @change="changeName(scope.row.collectionPlaceId, scope.row.collectionPlaceName, params.collectionPlaces)"
                      class="w-70 m-r-5" :disabled="scope.row.isPlace">
                      <el-option v-for="item in params.collectionPlaces" :key="item.id" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                    <el-checkbox v-model="scope.row.isPlace"
                      @change="savePlace(scope.row.isPlace, scope.row, scope.$index)">默认
                    </el-checkbox>
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
              <el-table-column prop="bookStatus" align="center" width='130' label="状态">
                <template slot-scope="scope">
                  <!-- <div>{{option[scope.row.bookStatus].name}}</div> -->
                  <el-select v-model="scope.row.bookStatus" clearable class="w-80">
                    <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination class="pages" @current-change="handleCurrentChanges" :current-page="currentPage"
              :page-size="20" layout=" prev, pager, next, jumper,total" :total="bookList.content.length">
            </el-pagination>
          </div>
        </div>
        <div class="display_flex choose">
          <div @click="save('formData')" class="text_center cursor m-r-20">
            <img src="../../../assets/img/add.png" class="btn_img" />
            <div class="f-s-14">保存(F8)</div>
          </div>
          <div @click="backs" class="text_center cursor m-r-20">
            <img src="../../../assets/img/return.png" class="btn_img" />
            <div class="f-s-14">取消(F9)</div>
          </div>
        </div>
      </div>

      <div class="marcMenus" id="marcMenus" :style="menu ? 'display:block' : 'display:none'" @click="getFun($event)">
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
import List from '../../view/List';
import Vue from 'vue';
import bus from '../../common/bus';
import { log } from "util";
export default {
  props: ['index'],
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
    var validateNumber = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error(`请输入种次号`));
      } else {
        let reg = /^([0-9]+)$/;
        if (!reg.test(value)) {
          callback(new Error('请输入数字'));
        }
        let arr = value.replace(/[^0-9]/gi, '');
        arr = arr.split('');
        callback();
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
      changeById: '',
      changeByName: '',
      restaurants: [],
      circulationList: [],
      tagsList: [],
      // chooseBookCope
      delIds: '',
      chooseBookCope: [], //选择书
      pageSize: 5,
      total: 0,
      currentPage: 0,
      currentPageTwo: 0,
      selectionStart: -1,
      chooseValue: '', //选择的值
      chooseValueIndex: '',
      copeValue: '',
      isPlace: true,
      option: [],
      bookList: {
        content: []
      },
      arr: [],
      fullscreenLoading: false,
      cope: {
        priceStr: '',
        addNumber: 0,
        code: ''
      }, //多卷
      menu: false,
      checkIsbn: false,
      isShowBlock: false,
      createModel: false,
      addBlockForms: [],
      isbnUnite: '',
      meta: '',
      height: '', //高度
      activeName: '',
      formData: {
        isbn: '',
        priceStr: '',
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
        authorNumber: '',
        sihms: '',
        authorNumberSZM: '',
        auxiliaryNumber: ''
      },
      form: {
        newMarc: []
      }, //表单对应字段

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

        speciesNumber: [{ required: true, validator: validateNumber, trigger: 'blur' }],
        authorNumber: [{ required: true, message: '请输入著者号', trigger: 'blur' }],
        sihms: [{ required: true, message: '请输入四角号码', trigger: 'blur' }],
        authorNumberSZM: [{ required: true, message: '请输入著者首拼', trigger: 'blur' }],

        classificationNumber: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      // show 是否显示馆藏信息
      showListInfo: [],
      show: false,
      checked: '',
      options: [],
      tableData: [],
      isAdd: {},
      showAdd: '', //是否展示
      // info
      click: {},
      info: {},
      saveIdType: '',
      cableType: '',
      changeNames: false,
      xiugai: false,
    };
  },
  created() {
    let platformId = JSON.parse(localStorage.getItem('user')).platform.id
    this.ax.get('/manage/unit/system/systemSettings/callNumberSetting', { params: { platformId } })
      .then(res => {
        if (res.type == 'ONE') {
          this.cableType = '种次号'
        } else if (res.type == 'TWO') {
          this.cableType = '著者号'
        } else if (res.type == 'THERE') {
          this.cableType = '四角号码'
        } else if (res.type == 'FOUR') {
          this.cableType = '著者首拼'
        }
      })
    if (sessionStorage.getItem('setting')) {
      let obj = JSON.parse(sessionStorage.getItem('setting'))
      if (obj.openMethod == '1') {
        this.activeName = 'first';
      } else {
        this.activeName = 'second';
      }
      this.getSet(false); //获取设置
    } else {
      this.getSet(); //获取设置
    }

    this.getSetting(); //获取设置

    this.getDefault();
    this.metaLists(); //获取meta

    this.metaList(); //获取meta
    let obj;

    if (this.$route.query.copys) {
      this.xiugai = false
      // 套录
      console.log('套录')
      this.show = true;
      this.showAdd = true;
      this.isAdd = true;
      obj = JSON.parse(this.$route.query.copys).book;
    } else if (this.$route.query.copy) {
      this.xiugai = false
      // 多卷
      console.log('多卷')
      this.show = true;
      this.isAdd = false;
      this.showAdd = true;
      let params = JSON.parse(this.$route.query.copy).book;
      params.id = '';
      obj = params;
    } else if (this.$route.query.infos) {
      // 修改
      console.log('修改')
      this.xiugai = true
      this.show = false;
      this.showAdd = false;
      this.isAdd = false;
      obj = JSON.parse(this.$route.query.infos);
    } else {
      this.xiugai = false
      console.log('new')
      // 新增
      this.show = true;
      this.showAdd = true;
      obj = null;
    }
    if (obj) {
      this.ax
        .post('/manage/unit/catalog/bibliography/bookBaseDetail', {
          add: this.isAdd,
          bookBase: obj,
          platformId: JSON.parse(localStorage.getItem('user')).platform.id
        })
        .then((res) => {
          this.saveIdType = JSON.parse(JSON.stringify(res))
          this.form = res
          this.formData = res  //修改了分类号显示第一个
          let reg = /[a-zA-Z]+/;
          let objs1;
          if (this.formData.priceStr) {
            while (objs1 = this.formData.priceStr.match(reg)) {
              this.formData.priceStr = this.formData.priceStr.replace(objs1[0], '')
            }
          }

          if (res.newMarc) {
            res.newMarc = this.getMapList(res.newMarc).filter((it) => {
              if (it.includes('091')) {
                this.isbnUnite = it[it.length - 1].split('▼')[1].split('a')[1]
                if (this.formData.priceStr == '') {
                  this.formData.priceStr = it[it.length - 1].split('▼')[2].split('dCNY')[1]
                }
              }

              if (it.length == 4) {
                return it
              } else if (it.length >= 5) {
                for (let index = 0; index < it.length; index++) {

                  if (index < 4) {
                    it[index] = it[index]
                  } else {
                    it[3] = it[3] + ',' + it[index]
                  }

                }
                return it
              }
            });
            this.checkContent();
          } else {
            res.newMarc = this.info.marcTemplateDetails;
            this.form.newMarc = res.newMarc;

          }
          this.formData.speciesNumber = this.saveIdType.speciesNumber
          this.formData.authorNumber = this.saveIdType.authorNumber
          this.formData.sihms = this.saveIdType.sihms
          this.formData.authorNumberSZM = this.saveIdType.authorNumberSZM
          this.cope.priceStr = this.form.priceStr;
          if (this.show) {

            this.$route.query.autofill == true && this.getBooksList();
          } else {
            this.getBooks();
          }
        });
    } else {
      this.ax
        .post('/manage/unit/catalog/bibliography/addBookBaseDetail', {
          platformId: JSON.parse(localStorage.getItem('user')).platform.id
        })
        .then((res) => {
          this.form = res;
          this.formData = res;
          res.newMarc = this.getMapList(res.newMarc).filter((it) => {
            return it.length == 4;
          });
          this.checkContent();
        })
        .catch(it => {
          this.backs()
        })
    }
    this.getCirculation()
    this.calcTableHeight();
    window.addEventListener('resize', () => {
      this.calcTableHeight();
    });
  },
  mounted() {
    document.onkeydown = (e) => {
      if (this.$route.path != '/catalogue/literature/library/libraryBookInfo') {
        return
      }
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
        this.backs();
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
        input.focus();
      } else if (key == '36' && e.path.length >= 21) {
        //home

        let id = e.target.id;

        let num1 = id.toString().replace(/[^\d\.\d]/gi, '');
        id = id.replace(num1, '');
        let input = '';
        if (e.target.selectionStart == this.selectionStart) {
          this.selectionStart = -1;
          if (id == 'input') {
            input = 'index';
          } else if (id == 'index') {
            input = 'code';
          }
          let doc = document.getElementById(input + num1);
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
        let price = document.getElementById('copePrice');
        price.focus();
        price.select()
      } else if (key == 113) {
        e.preventDefault();
        let addnumber = document.getElementById('addnumber');
        addnumber.focus();
        addnumber.select()
      } else if (key == 114) {
        e.preventDefault();
        let code = document.getElementById('code');
        code.focus();
        code.select()
        // speciesNumber;
      } else if (key == 115) {
        if (this.cableType == '种次号') {
          let speciesNumber = document.getElementById('speciesNumber');
          speciesNumber.focus();
        } else if (this.cableType == '著者号') {
          let authorNumber = document.getElementById('authorNumber');
          authorNumber.focus();
        } else if (this.cableType == '四角号码') {
          let sihms = document.getElementById('sihms');
          sihms.focus();
        } else if (this.cableType == '著者首拼') {
          let authorNumberSZM = document.getElementById('authorNumberSZM');
          authorNumberSZM.focus();
        }

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
      } else if (key == '65' && e.altKey && !e.shiftKey && !e.ctrlKey) {
        //alt+a
        this.getNewsWork()
        //生成数据
        // this.save('formData');
      } else if (key == '66' && e.ctrlKey && !e.shiftKey && !e.altKey) {
        //拼音

        e.preventDefault();

        let start = e.path[0].selectionStart;
        let end = e.path[0].selectionEnd;
        let str = JSON.parse(JSON.stringify(this.form.newMarc[this.chooseValueIndex][3]))
        let field = e.path[0].value.slice(start, end); //选择的
        field = field.replace('▼', '\u001F')
        let marc = str.split('▼').join('\u001F') //全部的
        let arr = str.split('▼')
        let sonMarc = null
        arr = arr.filter(it => {
          return it != ''
        })
        arr.map(it => {
          it = '\u001F' + it
          if (it.indexOf(field) != -1) {
            sonMarc = it
          }
        })
        let params = {
          marc,
          sonMarc,
          field
        }
        this.getPin(params)

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
    // 20231120修改了这里,加到了/manage/unit/catalog/bibliography/bookBaseDetail接口的返回值里面
    // setTimeout((res) => {
    //   if (this.show) {

    //     this.$route.query.autofill == true && this.getBooksList();
    //   } else {
    //     this.getBooks();
    //   }
    // }, 1200);

    if (!this.showAdd) {
      // this.$message.warning('编辑下无法添加复本，请使用“复本”功能进行添加');
    }

    this.getRack()

  },
  methods: {
    getRack() {
      let params = {
        platformId: JSON.parse(localStorage.getItem('user')).platform.id,
        page: 0,
        size: 999999
      }
      this.ax.get('/manage/unit/catalog/collectionHandling/rack', { params }).then(res => {
        this.restaurants = res.content;
      })
    },
    querySearch(queryString, cb) {
      let results = this.restaurants.map(it => {
        return { value: it.name, name: it.id }
      });
      results = queryString
        ? results.filter(this.createFilter(queryString))
        : results;
      cb(results)
    },
    createFilter(queryString) {
      return (item) => {
        return item.value.toUpperCase().match(queryString.toUpperCase());
      };
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
    calcTableHeight(val) {
      setTimeout(res => {

        this.height = document.documentElement.clientHeight - 170;

      }, 100)
    },
    getPin(params) {
      this.ax.get('/manage/unit/catalog/bibliography/pinyinMarc', { params })
        .then(res => {
          let arr = res.split('\u001F').join('▼')
          this.form.newMarc[this.chooseValueIndex][3] = arr
          this.$forceUpdate()
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
          let ids = this.chooseBookCope
            .map((it) => {
              return it.id;
            })
            .join(',');
          this.chooseBookCope.map(its => {
            this.bookList.content.map((it, index) => {
              if (its.id == it.id) {
                this.bookList.content.splice(index, 1)
              }
            })
          })
          this.delIds = ids
        })
        .catch(() => {
        });
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

          this.chooseBookCope.map(its => {
            this.bookList.content.map((it, index) => {
              if (its.barCode == it.barCode) {
                this.bookList.content.splice(index, 1)
              }
            })
          })

        })
        .catch(() => {
        });
    },

    // xedlBook
    del() {

      this.ax.delete('/manage/unit/catalog/bibliography/book?ids=' + this.delIds).then((res) => {

      });
    },
    // 选择书本
    handleSelectionChange(val) {
      this.chooseBookCope = val;
    },
    // 切换
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBooks();
    },
    handleCurrentChange(val) {
      this.currentPage = val - 1;
      this.currentPageTwo = val;
      console.log(this.currentPage, '--this.currentPage');
      this.getBooks();
    },
    // 储存
    savePlace(isTrue, val, index) {
      if (isTrue) {
        let arr;
        if (JSON.parse(sessionStorage.getItem('setPlace'))) {
          arr = JSON.parse(sessionStorage.getItem('setPlace'));
        } else {
          arr = [];
        }
        arr[index] = val;
        sessionStorage.setItem('setPlace', JSON.stringify(arr));
      } else {
        let arr;
        if (JSON.parse(sessionStorage.getItem('setPlace'))) {
          arr = JSON.parse(sessionStorage.getItem('setPlace'));
        } else {
          arr = [];
        }
        arr[index] = '';
        sessionStorage.setItem('setPlace', JSON.stringify(arr));
      }
    },

    changeInput(e) {
      e.preventDefault();
      let id = e.path[0].id;
      id = id.replace('input', '');
      id = id * 1 + 1;

      if (id < 0) {
        id = 0;
      }


      else if (id >= this.form.newMarc.length) {
        id = this.form.newMarc.length - 1

        if (this.form.newMarc[id][1] == 905) {
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
              repit = true;
            }
          }
          // 定长
          if (it.fixedLength) {
            if (this.form.newMarc[this.chooseValueIndex][3].length > it.totalLength) {
              maxlength = true;
            }
          }
          // 指
          let one = this.form.newMarc[this.chooseValueIndex][2].split('');

          if (one.length == 1) {
            if (it.indicatorOne.indexOf(one[0]) == -1) {
              oneWory = true;
            }
          } else if (one.length == 2) {
            if (it.indicatorOne) {
              if (it.indicatorOne.indexOf(one[0]) == -1) {
                oneWory = true;
              }
            }
            if (it.indicatorTwo) {
              if (it.indicatorTwo.indexOf(one[1]) == -1) {
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
          this.form.newMarc[index][0] = it.note;
          Vue.set(this.form, '', '');
        }
      });
    },
    // 当前焦点
    getIndex(e) {
      // let id = e.path[0].id;
      // id = id.toString().replace(/[^\d\.\d]/gi, '');
      this.chooseValueIndex = e;
    },
    changeBook(e) {
      console.log(e, 'ee');
      if (e) {
        this.formData[e] = ''
        let id = e
        let input = document.getElementById(id);
        input.focus();
      }
    },
    getVal(val) {
      let text;
      if (window.getSelection) {
        text = window.getSelection();
      } else if (document.selection) {
        text = document.selection.createRange();
      }
    },
    getSpeNumber() {
      // if(this.cableType != '种次号'){
      //   return
      // }
      return new Promise(async (resolve, reject) => {
        const res = await this.ax.get('/manage/unit/general/speciesNumber', {
          params: {
            classificationNumber: this.formData.classificationNumber,
            medium: this.formData.medium,
            platformId: JSON.parse(localStorage.getItem('user')).platform.id
          }
        })
        if (res) {
          resolve(res)
          // this.formData.speciesNumber = res;
          // this.getBooksList('')
        }
      })
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
        this.getNewsWork()
        //生成数据
      } else if (index == 12) {
        //保存
        this.save('formData');
      } else if (index == 13) {
        //拼音
        // let start = e.path[0].selectionStart;
        // let end = e.path[0].selectionEnd;
        let str = JSON.parse(JSON.stringify(this.form.newMarc[this.chooseValueIndex][3]))
        let field = this.chooseValue; //选择的
        field = field.split('▼').join('\u001F')
        let marc = str.split('▼').join('\u001F') //全部的
        let arr = str.split('▼')
        let sonMarc = null
        arr = arr.filter(it => {
          return it != ''
        })
        arr.map(it => {
          it = '\u001F' + it
          if (it.indexOf(field) != -1) {
            sonMarc = it
          }
        })
        let params
        if (field !== marc) {
          params = {
            marc,
            sonMarc,
            field
          }
        } else {
          params = {
            marc,
          }
        }

        this.getPin(params)
        // let str = this.pinyin(this.chooseValue, { style: this.pinyin.STYLE_NORMAL }).join(' ');
        // let number = str.indexOf('▼');

        // if (number != -1) {
        //     str = str.substring(number * 1 + 2);
        // }
        // if (str == '') {
        //     this.$message.warning('请选择要转换的中文');
        //     // this.$message.success('保存成功');
        //     return;
        // }

        // let index = this.form.newMarc[this.chooseValueIndex][3].indexOf('▼9');

        // if (index == -1) {
        //     this.form.newMarc[this.chooseValueIndex][3] = this.form.newMarc[this.chooseValueIndex][3] + '▼9' + str;
        // } else {
        //     // this.form.newMarc[this.chooseValueIndex][3].splice(index)
        //     this.$message.warning('当前字段已有拼音');
        //     // this.$message.success('保存成功');
        // }

        // document.execCommand("insertText","false",str)
      } else if (index == 14) {
        //排序

        this.form.newMarc.sort((a, b) => {
          return a[1] - b[1];
        });
      } else if (index == 15) {
        //效验

        this.checkValue();
      }
    },
    // 右键菜单
    openMenu(e) {
      e.preventDefault();

      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      let str = e.target.value.slice(start, end);


      if (str == '' || str == null) {
        this.chooseValue = e.target.value;
      } else {
        this.chooseValue = str;
      }
      let marcMenus = document.getElementById('marcMenus');

      var x = e.clientX; // 鼠标的x坐标
      var y = e.clientY; //鼠标的y坐标
      let hei = document.documentElement.clientHeight;
      if (y >= hei - marcMenus.offsetHeight || hei - y < 420) {
        if (marcMenus.offsetHeight) {
          y = y - marcMenus.offsetHeight;
        } else {
          y = y - 400;
        }
      }
      marcMenus.style.top = y + 'px';
      marcMenus.style.left = x + 'px';

      this.menu = true;
    },
    closeMenu() {
      this.menu = false;
    },
    changePage(page) {
      if (page) {
        this.showListInfo = this.bookList.content.slice((page) * 20, (page + 1) * 20)
      } else {
        this.currentPage = 0
        this.showListInfo = this.bookList.content.slice((this.currentPage) * 20, (this.currentPage + 1) * 20)
      }
    },
    handleCurrentChanges(val) {
      console.log(val, '---val');
      this.currentPage = val
      this.changePage(val - 1)
    },
    // 选择
    changeName(e, name, row, obj) {

      this.changeNames = true
      if (e) {
        row.map((it) => {
          if (it.name == name) {
            e = it.id;
          }
        });

      }
      this.changeById = e
      this.changeByName = name;
    },
    changeNames(key, name, row, obj) {
      if (key) {
        let os = JSON.parse(JSON.stringify(obj))
        row.map((it) => {
          if (name === it.name) {
            os[key] = it.id;
          }
        });
      }
    },
    // 监听事件
    monitor() {
    },
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
                its = 'bBWL'
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
    // 传入对应字段解析数据点
    mapMarc(code, val) {
      let districts = JSON.parse(JSON.stringify(code)).slice(-1);
      this.form.newMarc.map((item) => {
        if (item[3] == undefined && item[3] == null && item.length < 2) {
          return;
        } else if (item[1] + districts == code && item[1]) {
          let number = 0;
          let str = item[3].split('▼');
          str = str.map((its) => {
            let district = its.slice(0, 1);
            if (item[1] + district == code) {
              if (item[1] + district == '010d') {
                its = district + 'CNY' + val
                return its
              }
              return district + val
            }
            return its;
          });

          setTimeout(it => {
            if (str.indexOf(districts + val) == -1 && item[1] + districts != '010d') {
              str.push(districts + val)
              item[3] = str.join('▼');
              return
            } else {
              item[3] = str.join('▼');
            }
          })

        }

      });

    },
    // 解析表单转marc
    getMarc(val, code, isget) {
      if (code == 'isbn') {
        val = [val];
        let clu = this.form.newMarc.map(it => it[1])
        if (!clu.includes('010')) {
          this.form.newMarc.splice(3, 0, ['ISBN', '010', ' ', ''])
        }
      } else if (code == 'keywords') {
        // if(){
        val = val.split('-');
        // }
      } else {
        val = [val]
      }
      if (code == 'auxiliaryNumber') {
        this.form.newMarc.map(it => {
          // if(it[1]==905){
          //     let pass =true
          //     it[3] =  it[3].split('▼').filter(res=>{return res!=''}).map(item=>{
          //         let str = item.slice(0,1)

          //          if(str=='v'){

          //              pass =false
          //              item = str+val
          //          }
          //          return item

          //     }).join('▼')
          //     it[3] = '▼'+it[3]
          //     if(pass){
          //         it[3] = it[3]+'▼v'+val
          //     }
          // }
        })
      } else if (code == 'classificationNumber') {
        this.form.newMarc.map(it => {
          // if(it[1]==905){
          //         it[3] =  it[3].split('▼').map(item=>{
          //         if(item==''){
          //                 return
          //         }
          //         let str = item.slice(0,1)
          //         if(str=='d'){
          //              item = str+val
          //          }
          //          return item
          //     }).join('▼')
          //     // it[3] = '▼'+it[3]
          // }
        })
      } else if (code == 'speciesNumber') {
        this.form.newMarc.map(it => {
          // if(it[1]==905){
          //         it[3] =  it[3].split('▼').map(item=>{
          //         if(item==''){
          //                 return
          //         }
          //         let str = item.slice(0,1)
          //         if(str=='e'){
          //              item = str+val
          //          }
          //          return item
          //     }).join('▼')
          //     // it[3] = '▼'+it[3]
          // }
        })
      }
      this.arr.map((it) => {
        if (it.name == code) {

          it.value.split(',').map((item, i) => {
            this.mapMarc(item, val[i]);
          });
        }
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
      // Vue.set(this.form.newMarc, '', '');

      if (val) {

        let length = this.form.newMarc[index][3].indexOf('\\');

        val = val.replace(';', ' ');
        val = val.replace('\\', '▼');

        this.form.newMarc[index][3] = val

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
          if (str) {
            this.mapFrom(index, str, text);
          }

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
              if (item[1] == 801 && str == 'b') {

                text = 'bwlib'

                this.mapFrom(i, str, text);
              } else {
                this.mapFrom(i, str, text);
              }


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
          if (this.cableType == '种次号') {
            this.formData.speciesNumber = text
            this.getMarc(this.formData.speciesNumber, 'speciesNumber');
          } else if (this.cableType == '著者号') {
            this.formData.authorNumber = text
            this.getMarc(this.formData.authorNumber, 'authorNumber');
          } else if (this.cableType == '四角号码') {
            this.formData.sihms = text
            this.getMarc(this.formData.sihms, 'sihms');
          } else if (this.cableType == '著者首拼') {
            this.formData.authorNumberSZM = text
            this.getMarc(this.formData.authorNumberSZM, 'authorNumberSZM');
          }

        } else {
          //    let arr = this.form.newMarc[index][3].split('▼')
          //    arr = arr.map(it=>{
          //         let str = it.slice(0, 1);
          //         let text = it.slice(1);

          //         return it

          //    })

          //  this.form.newMarc[index][3] =  arr.join("▼")

        }
      } else if (code == 905 && str == 'v') {
        if (text) {
          this.formData.auxiliaryNumber = text;
          this.getMarc(this.formData.auxiliaryNumber, 'auxiliaryNumber');
        }
      }
      this.arr.map((it) => {
        it.value.split(',').map((item) => {


          if (code + str == item && code != 606 && str !== '') {

            if (it.value.split(',').length == 1) {


              if (it.name == 'priceStr') {
                text = text.split(',')[0];
                let num1 = text.toString().replace(/[^\d\.\d]/gi, ' ');
                num1 = parseFloat(num1)

                num1 = num1.toFixed(2)
                num1 = num1 > 0 ? num1 : '0.00'
                this.form[it.name] = num1;
                this.getPrice(num1);
              } else {
                this.form[it.name] = text;
              }
            } else {
              if (this.form[it.name] == '' || it.name == 'priceStr') {
                if (it.name == 'priceStr') {
                  text = text.split(',')[0];
                  let num1 = text.toString().replace(/[^\d\.\d]/gi, ' ');
                  num1 = parseFloat(num1)
                  num1 = num1.toFixed(2)
                  this.form[it.name] = num1;
                  this.getPrice(num1);
                } else {
                  this.form[it.name] = text;
                }
              } else {
                this.form[it.name] = this.form[it.name] + '-' + text;
              }
            }

          } else if (code == 606 && code + str == item && text != '') {

            let index = this.form.keywords.indexOf(text)

            if (this.form.keywords == '' || this.form.keywords == null) {
              this.form.keywords = text
            } else {
              if (index == -1) {
                this.form.keywords = this.form.keywords + '-' + text;
              }
            }

          }
        });
      });
    },
    // 添加实体书，多卷
    addBook(res) {
      this.bookList.content.map(im => {
        this.params.batches.map(it => {
          if (it.name === im.batchName) {
            im.batchId = it.id
          }
        });

      })
      if (this.bookList.content.length == 0 && this.cope.addNumber > 0) {
        return this.$message.error('请生成书本');
      }
      let marc = JSON.stringify(res)
      let doid = this.bookList.content.map(e => e.documentCirculationTypeId)
      if (doid.includes(null)) {
        return this.$message.error('请选择文献流通类型')
      }
      this.bookList.content.map(it => {
        it.batchId = this.params.batches.filter(es => es.name === (this.changeByName != '' ? this.changeByName : this.defaultSet.batchName)).length > 0 ?
          this.params.batches.filter(es => es.name === (this.changeByName != '' ? this.changeByName : this.defaultSet.batchName))[0].id : it.batchId;
        it.collectionPlaceId = this.params.collectionPlaces.filter(key => it.collectionPlaceName === key.name).length > 0 ?
          this.params.collectionPlaces.filter(key => it.collectionPlaceName === key.name)[0].id : it.collectionPlaceId;
      })
      this.loading();
      let params = {
        bookBase: JSON.parse(marc),
        books: this.bookList.content
      };
      params.bookBase.newMarc = '';
      this.ax
        .post('/manage/unit/catalog/bibliography/bookNew', params)
        .then((res) => {
          this.sloading();
          this.$message.success('保存成功');

          if (JSON.parse(sessionStorage.getItem('setting')).newCheck) {
            this.backs();
          } else {
            this.getSet();

            this.getBooksList();
          }
        })
        .catch((res) => {
          this.sloading();
        });
    },
    async getBarCodeLength() {
      let params = {
        platformId: JSON.parse(localStorage.getItem('user')).platform.id
      }
      return await this.ax
        .get('/manage/unit/system/systemSettings/barCode', { params })
    },
    // 获取书本--预生成
    async getBooksList(id) {
      console.log('进来了');
      if (this.formData.speciesNumber.length > 5) {
        return this.$message.error('种次号长度不能超过5位')
      }
      if (/\s/g.test(this.formData.speciesNumber)) {
        return this.$message.error('种次号不能有空格')
      }
      let speciesNumber = await this.getSpeNumber()
      console.log(speciesNumber, 'speciesNumber');
      if (speciesNumber == this.formData.speciesNumber || !speciesNumber || !this.formData.speciesNumber) {
        this.formData.speciesNumber = speciesNumber
      }
      console.log(this.show, 'this.show');
      // console.log(this.);
      this.changeName()
      this.changeNames = false
      if (!this.show) {
        if (!this.xiugai) {
          if (id) {
            let input = document.getElementById(id);
            input.focus();

          }
          return
        } else {
          let arr = this.bookList.content.map(it => {
            console.log(it, 'itt');
            it.classificationNumber = this.formData.classificationNumber
            if (this.cableType == '种次号') {
              it.speciesNumber = this.formData.speciesNumber
              it.callNumber = (this.formData.auxiliaryNumber ? (it.classificationNumber + '/' + it.speciesNumber + '/' + this.formData.auxiliaryNumber) : (it.classificationNumber + '/' + it.speciesNumber))
              // this.formData.auxiliaryNumber
            } else if (this.cableType == '四角号码') {
              it.sihms = this.formData.sihms
              it.callNumber = (this.formData.auxiliaryNumber ? (it.classificationNumber + '/' + it.sihms + '/' + this.formData.auxiliaryNumber) : (it.classificationNumber + '/' + it.sihms))
            } else if (this.cableType == '著者号') {
              it.authorNumber = this.formData.authorNumber
              it.callNumber = (this.formData.auxiliaryNumber ? (it.classificationNumber + '/' + it.authorNumber + '/' + this.formData.auxiliaryNumber) : (it.classificationNumber + '/' + it.authorNumber))
            } else if (this.cableType == '著者首拼') {
              it.authorNumberSZM = this.formData.authorNumberSZM
              it.callNumber = (this.formData.auxiliaryNumber ? (it.classificationNumber + '/' + it.authorNumberSZM + '/' + this.formData.auxiliaryNumber) : (it.classificationNumber + '/' + it.authorNumberSZM))
            }

            return it
          })
          setTimeout(() => {
            this.bookList.content = arr;
          }, 1000)
          return
        }

      }
      if (!Number(this.cope.priceStr.toString().replace(/[^\d\.\d]/gi, '')) && this.cope.priceStr != 0) {
        return this.$message.error('输入的单价格式不对');
      }
      if (this.cope.addNumber == '' || this.cope.addNumber == 0 || this.cope.code == '' || this.cope.code == 0) {
        // console.log('进来了');
        return;
      }
      console.log('走到这里了');
      let price = this.cope.priceStr.toString().replace(/[^\d\.\d]/gi, '');
      const barlength = await this.getBarCodeLength();
      console.log(barlength, 'bar');
      // let bar = barlength.content.filter(it => it.bookCatalogParameterTypeDetailName == '中文图书')
      // if (this.cope.code.length > bar[0].length) {
      //   return this.$message.error(`条码长度应为${bar[0].length}`);
      // }
      let bookBase = JSON.stringify(this.formData);
      let params = {
        addNumber: this.cope.addNumber,
        bookBase: JSON.parse(bookBase),
        code: this.cope.code,
        price: price,
        platformId: JSON.parse(localStorage.getItem('user')).platform.id
      };
      params.bookBase.newMarc = '';
      this.ax.post('/manage/unit/catalog/bibliography/foreseeBook', params).then((res) => {
        // if (id) {
        //   let input = document.getElementById(id);
        //   input.focus();
        // }
        console.log(this.changeByName, 'this.changeByName');
        let objs = {}
        if (res == null) {
          objs = {
            authorNumber: this.formData.authorNumber,
            authorNumberSZM: this.formData.authorNumberSZM,
            bookBaseId: this.formData.bookBaseId,
            bookStatusStr: this.formData.bookStatusStr,
            borrowAlso: this.formData.borrowAlso,
            borrowDate: this.formData.borrowDate,
            borrowReaderId: this.formData.borrowReaderId,
            classificationNumber: this.formData.classificationNumber,
            collectionPlaceId: this.defaultSet.collectionPlaceId,
            createTime: null,
            documentCirculationTypeId: 2,
            firstResponsible: this.formData.firstResponsible,
            id: null,
            inventoryStatus: null,
            inventoryTime: null,
            isPlace: false,
            isbn: this.formData.isbn,
            lendNumber: this.formData.lendNumber,
            managerId: JSON.parse(localStorage.getItem('user')).info.id,
            oldBarCode: this.formData.oldBarCode,
            platformId: JSON.parse(localStorage.getItem('user')).platform.id,
            positiveTitle: this.formData.positiveTitle,
            presenceStatus: this.formData.presenceStatus,
            publicationDate: null,
            publisher: this.formData.publisher,
            rackDeatilId: null,
            rack: null,
            rackName: null,
            rackStatus: null,
            readerNumber: null,
            rfId: null,
            sihms: this.formData.sihms,
            speciesNumber: this.formData.speciesNumber,
            updateTime: null,
            barCode: this.cope.code,
            price: this.cope.priceStr,
            callNumber: this.formData.auxiliaryNumber ? this.formData.classificationNumber + '/' +
              (this.cableType == '种次号' ? this.formData.speciesNumber + '/' : this.cableType == '四角号码' ? this.formData.sihms + '/' :
                this.cableType == '著者号' ? this.formData.authorNumber + '/' : this.formData.authorNumberSZM + '/') + this.formData.auxiliaryNumber :
              this.formData.classificationNumber + '/' +
              (this.cableType == '种次号' ? this.formData.speciesNumber : this.cableType == '四角号码' ? this.formData.sihms :
                this.cableType == '著者号' ? this.formData.authorNumber : this.formData.authorNumberSZM)
            ,
            batchId: !this.changeById ? this.changeById : this.defaultSet.batchId,
            batchName: this.changeByName ? this.changeByName : this.defaultSet.batchName,
            managerName: JSON.parse(localStorage.getItem('user')).info.name,
            warehousingTime: new Date().getTime(),
            collectionPlaceName: this.defaultSet.collectionPlaceName,
            bookStatus: 'InCollection',
            oknot: false
          }
          res = new Array(Number(this.cope.addNumber)).fill(objs).map((v, i) => {
            let d = v.barCode.substring(0, v.barCode.length - 1) + (Number(v.barCode.split('')[v.barCode.length - 1]) + i)
            // let d =(Array(this.cope.code.length).join("0") + String(Number(v.barCode)+i)).slice(-this.cope.code.length);
            return { ...v, barCode: d }
          })
        }
        res.map((it) => {
          it.isPlace = false;
          it.documentCirculationTypeId = this.defaultSet.documentCirculationTypeId
          if (JSON.stringify(objs) === '{}') {
            if (this.cableType == '四角号码') {
              this.formData.sihms = it.sihms;//新增回显
              it.callNumber = it.classificationNumber + (it.sihms != null ? '/' + it.sihms : '') + (it.auxiliaryNumber ? '/' + it.auxiliaryNumber : '')
            } else if (this.cableType == '著者号') {
              this.formData.authorNumber = it.authorNumber;//新增回显
              it.callNumber = it.classificationNumber + (it.authorNumber != null ? '/' + it.authorNumber : '') + (it.auxiliaryNumber ? '/' + it.auxiliaryNumber : '')
            } else if (this.cableType == '著者首拼') {
              this.formData.authorNumberSZM = it.authorNumberSZM;//新增回显
              it.callNumber = it.classificationNumber + (it.authorNumberSZM != null ? '/' + it.authorNumberSZM : '') + (it.auxiliaryNumber ? '/' + it.auxiliaryNumber : '')
            }
          }


        });


        if (JSON.parse(sessionStorage.getItem('setPlace'))) {
          let arr = JSON.parse(sessionStorage.getItem('setPlace'));
          arr.map((it, index) => {
            if (it) {
              res[index].collectionPlaceId = it.collectionPlaceId;
              res[index].collectionPlaceName = it.collectionPlaceName;
              res[index].isPlace = true;
            }
          });
        }
        // console.log(this.bookList,'this.bookList');
        this.bookList = {
          content: res
        };
        console.log(res, 'resresres');
        this.changePage()
      });
    },
    // 获取书本列表
    getBooks() {
      if (!this.form.id) {
        return
      }
      this.ax
        .get('/manage/unit/catalog/bibliography/book', {
          params: {
            bookBaseId: this.formData.id,
            size: this.pageSize,
            page: this.currentPage,
            platformId: JSON.parse(localStorage.getItem('user')).platform.id
          }
        })
        .then((res) => {
          if (!this.showAdd) {
            this.cope.addNumber = res.bookList.content.length;
          }
          res.bookList.content.map(it => {
            it.edit = false
            if (this.cableType == '四角号码') {
              it.callNumber = it.classificationNumber + (this.formData.sihms != null && this.formData.sihms != '' ? '/' + this.formData.sihms :
                '') + (it.auxiliaryNumber != null && it.auxiliaryNumber != '' ? '/' + it.auxiliaryNumber : '')
            } else if (this.cableType == '著者号') {
              it.callNumber = it.classificationNumber + (this.formData.authorNumber != null && this.formData.authorNumber != '' ? '/' + this.formData.authorNumber : '') +
                (it.auxiliaryNumber != null && it.auxiliaryNumber != '' ? '/' + it.auxiliaryNumber : '')
            } else if (this.cableType == '著者首拼') {
              it.callNumber = it.classificationNumber + (this.formData.authorNumberSZM != null && this.formData.authorNumberSZM != '' ? '/' + this.formData.authorNumberSZM : '') +
                (it.auxiliaryNumber != null && it.auxiliaryNumber != '' ? '/' + it.auxiliaryNumber : '')
            } else if (this.cableType == '种次号') {
              it.callNumber = it.classificationNumber + (it.speciesNumber != null ? '/' + this.formData.speciesNumber : '') +
                (it.auxiliaryNumber != null && it.auxiliaryNumber != '' ? '/' + it.auxiliaryNumber : '')
            }
          })
          this.bookList = {
            content: res.bookList.content
          };
          this.total = res.bookList.totalElements;
        });
    },

    // 检查isbn
    checkIsbns(val) {

      // // // console.log(val)
      // return
      // if(val.length==17) return
      this.loading();
      let type;
      if (this.checked) {
        type = 1;

        if (val.length == 17) {
          this.sloading()
          return
        }
      } else {
        type = 2;
      }
      this.ax
        .get('/manage/unit/general/isbnCheck', { params: { type, content: val } })
        .then((res) => {
          this.form.isbn = res;
          this.sloading();
        })
        .catch((res) => {
          this.sloading();
        });
    },
    // 获取快捷设置 --快捷键的
    getSet(isTure) {
      this.ax
        .get('/manage/unit/general/catalogSetting', {
          params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, marcType: 'BOOK' }
        })
        .then((res) => {
          sessionStorage.setItem('setting', JSON.stringify(res));
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
        .get('/manage/unit/catalog/bibliography/bookCatalogSetting', {
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
        });
    },
    // 获取选择参数--select
    getDefault() {
      return new Promise((resolve) => {
        this.ax
          .get('/manage/unit/catalog/bibliography/obtainEditBookCatalogSetting', {
            params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
          })
          .then((res) => {
            this.params = res;
            resolve(res);
          });
      });
    },
    // 保存
    save(formName) {
      this.changeName()
      if (!this.showAdd) {
        this.cope.code = '0'
      }
      let pass = true
      this.showListInfo.map(it => {
        if (!it.callNumber) {
          pass = false
        }
      })
      if (!pass) {
        return this.$message.warning('索书号不能为空');
      }
      if (/[\u4E00-\u9FA5]/.test(this.formData.classificationNumber)) {   //判断包含汉字
        return this.$message.error('分类号格式不正确');
      }
      if (new RegExp(/\s/).test(this.formData.classificationNumber)) {  //判断包含空格
        return this.$message.error('分类号格式不正确');
      }
      if (this.cope.code == '' || this.cope.code == null) {
        return this.$message.warning('请输入文献条码');
      }
      if (!Number(this.cope.priceStr.toString().replace(/[^\d\.\d]/gi, '')) && this.cope.priceStr != 0) {
        return this.$message.error('输入的单价格式不对');
      }
      if (this.formData.speciesNumber.length > 5) {
        return this.$message.error('种次号长度不能超过5位')
      }
      this.loading();

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
          this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
          let marc;
          let saveMarc;
          let params = JSON.stringify(this.formData);
          if (this.form.newMarc) {
            marc = JSON.stringify(this.form.newMarc);
            saveMarc = JSON.stringify(this.form.newMarc);
            marc = JSON.parse(marc);
            marc = marc
              .map((it) => {
                it[3] = it[3].split('▼').join('\u001F').replace(';', ' ')
                if (it.length == 4) {
                  it = it.join(',');
                } else if (it.length > 4) {
                  it = it.slice(0, 4)

                  it = it.join(',');
                }
                return it;
              })
              .join(';');
          }

          params = JSON.parse(params);

          params.newMarc = marc;


          if (!this.$route.query.copy) {
            this.formData.id = this.form.id;
          } else {
            this.formData.id = '';
          }
          // this.formData.marcTypeDetailName = this.form.marcTypeDetailName;
          this.formData.marcTypeDetailId = this.saveIdType.marcTypeDetailId;
          params.marcTypeDetailId = this.saveIdType.marcTypeDetailId;
          if (!params.marcTypeDetailId) {
            params.marcTypeDetailId = this.defaultSet.marcTypeDetailId
          }
          params.priceStr = this.cope.priceStr;
          this.ax
            .post('/manage/unit/catalog/bibliography/bookBase', params)
            .then((res) => {
              this.form.id = res.id
              this.sloading();

              if (this.delIds) {
                this.del()
              }

              if (this.cope.code != '' && this.cope.addNumber != '') {

                this.addBook(res);
              } else {
                this.$message.success('保存成功');
                if (JSON.parse(sessionStorage.getItem('setting')).newCheck) {
                  this.backs();
                } else {
                  this.sloading();
                }
              }
            })
            .catch((res) => {

              this.form.newMarc = JSON.parse(saveMarc)
              this.formData.newMarc = JSON.parse(saveMarc)
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
      // -----------20231117新增的代码,为了校验条码号符不符合规则,修改了这里
      let barCodeLength = ''
      this.params.barCodes.map(it => {
        if (it.bookCatalogParameterTypeDetailName == this.formData.medium) {
          barCodeLength = it.length
        }
      })
      if (barCodeLength !== obj.row.barCode.length) {
        return this.$message.error('条码号长度为' + barCodeLength)
      }
      let barCodeTrue = /\d$/.test(obj.row.barCode)
      if (!barCodeTrue) return this.$message.error('条码号只能以数字结尾')
      // -------------
      let bookBase = JSON.stringify(this.form)
      obj.row.collectionPlaceName = this.params.collectionPlaces.filter(it => it.id === obj.row.collectionPlaceId)[0].name;
      let params = {
        bookBase: JSON.parse(bookBase),
        books: [obj.row]
      };
      params.bookBase.newMarc = '';
      this.ax
        .post('/manage/unit/catalog/bibliography/bookNew', params)
        .then((res) => {
          this.sloading();

          this.sloading()
          obj.row.edit = false
        })
        .catch((res) => {
          this.sloading();
        });


    },
    getNewsWork() {
      let mark = JSON.parse(JSON.stringify(this.form.newMarc))
      mark = mark.map(it => {
        it[3] = it[3].split('▼').join('\u001F')
        it = it.join(',')
        return it
      }).join(';')
      this.ax.post('/manage/unit/catalog/bibliography/autoGenerate', {
        newMarc: mark,
        medium: this.form.medium,
        speciesNumber: this.form.speciesNumber
      })
        .then(res => {
          let newMark = res = this.getMapList(res).filter((it) => {
            if (it.length == 4) {
              return it
            } else if (it.length >= 5) {
              for (let index = 0; index < it.length; index++) {
                if (index < 4) {
                  it[index] = it[index]
                } else {
                  it[3] = it[3] + ',' + it[index]
                }

              }
              return it
            }
          })
          this.form.newMarc = newMark;
        })

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
    },
    backs() {
      this.$router.go(-1)
      this.$parent.$parent.closeTags()
    },
  }
};
</script>

<style>
.el-form-item__error {
  line-height: 0 !important;
}

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
