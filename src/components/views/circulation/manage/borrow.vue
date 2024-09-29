<template>
    <div class="container" :style="'height:' + height + 'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="外借&归还" name="AND">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.readerNumber" placeholder="读者证号" clearable type="text"
                                v-if="activeName != 'RETURN' && activeName != 'RENEW' && activeName != 'LITERATURE'"
                                class="m-r-20 w-20" @keyup.enter.native="searchRead"></el-input>
                            <el-input v-model="form.barCode" placeholder="文献条码" clearable id="AND" type="text"
                                v-if="activeName != 'READERS'" class="m-r-20 w-20"
                                @keyup.enter.native="searchInfo"></el-input>

                            <el-button type="primary" class="m-r-20"
                                v-if="activeName == 'AND' || activeName == 'LITERATURE' || activeName == 'READERS'"
                                @click="searchInfo()">搜索</el-button>
                            <el-button type="primary" class="m-r-20" v-if="face" @click="faceIdentify()">人脸识别</el-button>

                            <el-button type="primary" class="m-r-20"
                                v-if="(info.reader && info.book && info.book.borrowReaderId == info.reader.id) || activeName == 'RETURN'"
                                @click="borrowBook('RESTITUTION')">归还</el-button>

                            <el-button type="primary" class="m-r-20" v-else-if="(info.reader && info.book && info.book.borrowReaderId != info.reader.id) ||
                                activeName == 'BORROW' ||
                                activeName == 'UNLICENSED'
                                " @click="borrowBook('LOAN')">外借</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="外借" name="BORROW">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.readerNumber" placeholder="读者证号" clearable type="text"
                                v-if="activeName != 'RETURN' && activeName != 'RENEW' && activeName != 'LITERATURE'"
                                class="m-r-20 w-20" @keyup.enter.native="searchRead"></el-input>
                            <el-input v-model="form.barCode" placeholder="文献条码" clearable id="BORROW" type="text"
                                v-if="activeName != 'READERS'" class="m-r-20 w-20"
                                @keyup.enter.native="borrowBook('LOAN')"></el-input>
                            <el-button type="primary" class="m-r-20" @click="borrowBook('LOAN')">外借</el-button>
                            <el-button type="primary" class="m-r-20" v-if="face" @click="faceIdentify()">人脸识别</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="归还" name="RETURN">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <!--                                @blur="searchBook()"-->
                            <el-input v-model="form.barCode" placeholder="文献条码" clearable id="RETURN" type="text"
                                v-if="activeName != 'READERS'" class="m-r-20 w-20"
                                @keyup.enter.native="returnBook('RESTITUTION')"></el-input>
                            <el-button type="primary" class="m-r-20"
                                v-if="(info.book && info.book.bookStatus == 'LEND') || activeName == 'RETURN'"
                                @click="returnBook('RESTITUTION')">归还</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="续借" name="RENEW">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.barCode" placeholder="文献条码" clearable id="RENEW" type="text"
                                v-if="activeName != 'READERS'" class="m-r-20 w-20"
                                @keyup.enter.native="returnBook('RENEW')"></el-input>
                            <el-button type="primary" class="m-r-20" v-if="activeName == 'RENEW'"
                                @click="returnBook('RENEW')">续借</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="无证外借" name="UNLICENSED">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.readerNumber" placeholder="读者证号" clearable type="text"
                                class="m-r-20 w-20" @keyup.enter.native="searchRead"></el-input>

                            <el-input v-model="form.password" auto-complete="new-password" placeholder="密码" clearable
                                id="UNLICENSED" @keyup.enter.native="getFocus('pass')"
                                :type="activeName == 'UNLICENSED' ? 'password' : 'text'" class="m-r-20 w-20"></el-input>

                            <el-input v-model="form.barCode" placeholder="文献条码" clearable type="text" id="pass"
                                class="m-r-20 w-20" @keyup.enter.native="searchBook"></el-input>

                            <el-button type="primary" class="m-r-20"
                                @click="borrowBook('LOAN', form.password)">外借</el-button>
                            <el-button type="primary" class="m-r-20" v-if="face" @click="faceIdentify()">人脸识别</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="读者外借查询" name="READERS">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.readerNumber" placeholder="读者证号" clearable
                                v-if="activeName != 'RETURN' && activeName != 'RENEW' && activeName != 'LITERATURE'"
                                class="m-r-20 w-20" @keyup.enter.native="searchInfo"></el-input>
                            <el-button type="primary" class="m-r-20"
                                v-if="activeName == 'AND' || activeName == 'LITERATURE' || activeName == 'READERS'"
                                @click="searchInfo()">搜索</el-button>
                            <el-button type="primary" class="m-r-20" v-if="face" @click="faceIdentify()">人脸识别</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文献外借查询" name="LITERATURE">
                    <div class="padding_20 m-b-40">
                        <div class="display_flex">
                            <el-input v-model="form.barCode" placeholder="文献条码" clearable v-if="activeName != 'READERS'"
                                class="m-r-20 w-20" @keyup.enter.native="searchInfo"></el-input>
                            <el-button type="primary" class="m-r-20"
                                v-if="activeName == 'AND' || activeName == 'LITERATURE' || activeName == 'READERS'"
                                @click="searchInfo()">搜索</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="离线借还" name="back">
                    <div class="w-60 m-b-20">
                        离线借还功能用于在网络连接或服务器发生故障时，
                        临时进行借还续图书的本地工具，需在有网络时下载到本地并进行安装后，方可在无网络时进行使用，待网络或服务器恢复正常后，即可将数据同步到服务器；点击“下载”按钮进行下载安装；
                    </div>
                    <el-button type="primary" class="m-r-20" @click="down">下载</el-button>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="padding_20 m-b-40" v-if="showRead">
            <div class="title_reader m-b-25">读者信息</div>
            <div class="display_flex start">
                <div class="readerHeader m-r-25 backgound_d">
                    <img v-if="info.reader && info.reader.photo" :src="info.reader.photo" class="img" />
                    <div v-else class="header_NO">
                        <i class="el-icon-s-custom icon_header"></i>
                        <div class="f-s-14">暂无头像</div>
                    </div>
                </div>
                <div class="w-90 display_flex start">
                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20" v-if="info.reader && info.reader.number">
                            <span class="m-r-10 info color_6">读者证号</span>
                            <span>{{ info.reader.number }}</span>
                        </div>
                        <div class="m-b-20" v-if="info.reader && info.reader.end">
                            <span class="m-r-10 info color_6">截止日期</span>
                            <span>{{ getTime(info.reader.end) }}</span>
                        </div>
                        <div class="m-b-20 cursor color_b" @click="lookReader = true">查看读者信息</div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20" v-if="info.reader && info.reader.name">
                            <span class="m-r-10 info color_6">读者姓名</span>
                            <span>{{ info.reader.name }}</span>
                        </div>
                        <div class="m-b-20" v-if="info.reader && info.reader.status">
                            <span class="m-r-10 info color_6">状态</span>
                            <span
                                v-if="info.reader && info.reader.status && status[info.reader.status] && status[info.reader.status].name">{{
                                    status[info.reader.status].name }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20" v-if="info.reader && info.reader.readerUnitName">
                            <span class="m-r-10 info color_6">单位名称</span>
                            <span>{{ info.reader.readerUnitName }}</span>
                        </div>
                        <div class="m-b-20" v-if="info.reader && info.reader.libraryName">
                            <span class="m-r-10 info color_6">读者所属馆</span>
                            <span>{{ info.reader.libraryName }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20" v-if="info.reader && info.reader.readerTypeName">
                            <span class="m-r-10 info color_6">读者类型</span>
                            <span>{{ info.reader.readerTypeName }}</span>
                        </div>
                        <div class="m-b-20" v-if="info.reader && info.reader.borrowNumber">
                            <span class="m-r-10 info color_6">总计借阅</span>
                            <span>{{ info.reader.borrowNumber }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3"></div>
                </div>
            </div>
        </div>

        <div class="padding_20 m-b-40" v-if="showBook">
            <div class="title_reader m-b-25">书目信息</div>
            <div class="display_flex start">
                <div class="readerHeader m-r-25"></div>
                <div class="w-90 display_flex start">
                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">题名</span>
                            <span>{{ info.bookBase.positiveTitle }}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">ISBN号</span>
                            <span>{{ info.bookBase.isbn }}</span>
                        </div>
                        <div class="m-b-20 cursor color_b" @click="getBooks(info.bookBase.id)">查看书目信息</div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">索书号</span>
                            <span>{{ info.book.callNumber }}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">出版社</span>
                            <span>{{ info.bookBase.publisher }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">馆藏地</span>
                            <span>{{ info.book.collectionPlaceName }}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">出版时间</span>
                            <span>{{ info.bookBase.publicationDate }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">架位号</span>
                            <span>{{ info.book.rackName }}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">出版地</span>
                            <span>{{ info.bookBase.publisherPlace }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">单价</span>
                            <span>{{ info.bookBase.price }}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-10 info color_6">文献语种</span>
                            <span>{{ info.bookBase.language }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="padding_20 m-b-40" v-if="info.borrowingInformationList && info.borrowingInformationList.length > 0">
            <div class="title_reader m-b-25">当前借阅信息</div>

            <el-table :data="info.borrowingInformationList" style="width: 100%">
                <el-table-column prop="readerNumber" label="读者证号" width="180"></el-table-column>
                <el-table-column prop="barCode" label="文献条码" width="180"></el-table-column>
                <el-table-column prop="collectionPlaceName" label="馆藏地"></el-table-column>
                <el-table-column prop="positiveTitle" label="题名"></el-table-column>
                <el-table-column prop="firstResponsible" width="200" label="第一责任者"></el-table-column>
                <el-table-column prop="callNumber" label="索书号"></el-table-column>
                <el-table-column prop="price" label="单价"></el-table-column>
                <el-table-column width="300" label="借/应还日期">
                    <template slot-scope="scope">
                        <div>{{ getTime(scope.row.borrowDate) }}/{{ getTime(scope.row.borrowAlso) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否归还">
                    <template slot-scope="scope">
                        <div :class="scope.row.borrow == true ? 'color_suc' : 'color_dan'">
                            {{ scope.row.borrow == true ? '归还' : '借出' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex" class="table-action flex-row flex-wrap flex_center">
                            <el-button v-if="!scope.row.borrow" size="mini" type="text" class="m-r-20"
                                @click="borrowBook('RENEW', '', scope.row.barCode, scope.row.readerNumber)">续借</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- model -->
        <el-dialog title="读者信息" :visible.sync="lookReader" width="40%" :close-on-click-modal="false">
            <div class="display_flex readerInfo">
                <div class="w-50" v-if="info.reader">
                    <div class="display_flex start m-b-15">
                        <div class="m-r-20 readerTitle color_6">读者照片</div>
                        <img :src="info.reader.photo" v-if="info.reader && info.reader.photo"
                            class="readerHeader m-r-25 img" />
                    </div>
                    <div v-for="(item, i) of readerList1" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{ item.name }}</span>
                        <span class="readerText" v-if="!item.isArry">{{ info.reader[item.id] }}</span>
                        <span class="readerText" v-else>{{
                            item.type[info.reader[item.id]] ? item.type[info.reader[item.id]].name : '' }}</span>
                    </div>
                </div>
                <div class="w-50" v-if="info.reader">
                    <div v-for="(item, i) of readerList2" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{ item.name }}</span>
                        <span class="readerText" v-if="item.isData">{{ getTime(info.reader[item.id]) }}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{ info.reader[item.id] }}</span>
                        <span class="readerText" v-else>
                            <span v-if="item.type &&
                                info.reader[item.id] &&
                                item.type[info.reader[item.id]] &&
                                item.type[info.reader[item.id]].name
                                ">{{ item.type[info.reader[item.id]].name }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- model -->
        <el-dialog title="书目信息" :visible.sync="lookBook" width="60%" :close-on-click-modal="false">
            <div class="display_flex between start readerInfo f-s-12">
                <div class="w-30" v-if="info.book">
                    <div v-for="(item, i) of bookList1" :key="i" class="m-b-15 display_flex end b-b-1">
                        <span class="m-r-20 readerTitle color_6">{{ item.name }}</span>
                        <span class="readerText" v-if="item.isData">{{ getTime(info.all[item.id]) }}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{ info.all[item.id] }}</span>
                        <span class="readerText" v-else>{{ item.type[info.all[item.id]].name }}</span>
                    </div>
                </div>
                <div class="w-30" v-if="info.book">
                    <div v-for="(item, i) of bookList2" :key="i" class="m-b-15 display_flex end b-b-1">
                        <span class="m-r-20 readerTitle color_6">{{ item.name }}</span>
                        <span class="readerText" v-if="item.isData">{{ getTime(info.all[item.id]) }}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{ info.all[item.id] }}</span>
                        <span class="readerText" v-else>{{ item.type[info.all[item.id]].name }}</span>
                    </div>
                </div>
                <div class="w-30" v-if="info.book">
                    <div v-for="(item, i) of bookList3" :key="i" class="m-b-15 display_flex end b-b-1">
                        <span class="m-r-20 readerTitle color_6">{{ item.name }}</span>
                        <span class="readerText" v-if="item.isData">{{ getTime(info.all[item.id]) }}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{ info.all[item.id] }}</span>
                        <span class="readerText" v-else>{{ item.type[info.all[item.id]].name }}</span>
                    </div>
                </div>
            </div>
            <el-table :data="showBookList" style="width: 100%">
                <el-table-column prop="barCode" label="文献条码"></el-table-column>

                <el-table-column prop="callNumber" label="索书号"></el-table-column>

                <el-table-column prop="bookStatus" label="状态">
                    <template slot-scope="scope">
                        <div class="table-action flex-row flex-wrap flex_center">
                            {{ scope.row.bookStatus == 'InCollection' ? '在馆' : scope.row.bookStatus == 'LEND' ? '借出' : '丢失'
                            }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="collectionPlaceName" label="馆藏地"></el-table-column>

                <el-table-column prop="price" label="单价"></el-table-column>

                <el-table-column prop="warehousingTime" label="入库时间">
                    <template slot-scope="scope">
                        <div class="table-action flex-row flex-wrap flex_center">
                            {{ getTime(scope.row.warehousingTime) }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- showPay -->
        <el-dialog title="读者信息" :visible.sync="showPay" width="40%" :close-on-click-modal="false">
            <div>
                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者证号</span>
                        <span class="label w-60">{{ over.borrowingInformation.readerNumber }}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者姓名</span>
                        <span class="label w-60">{{ over.borrowingInformation.readerName }}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">借阅日期</span>
                        <span class="label w-60">{{ getTime(over.borrowingInformation.borrowDate) }}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">应还日期</span>
                        <span class="label w-60">{{ getTime(over.borrowingInformation.borrowAlso) }}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期天数</span>
                        <span class="label w-60">{{ over.beyondNumber }}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者单位名称</span>
                        <span class="label w-60">{{ over.borrowingInformation.readerUnitName }}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期每日罚款</span>
                        <span class="label w-60">{{ over.circulationRules.overdueFine }}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期最大罚款</span>
                        <span class="label w-60">{{ over.circulationRules.maxOverdueFine }}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期罚款金额</span>
                        <span class="label w-60">
                            <el-input class="w-40" v-model="over.finance.fee" clearable></el-input>
                        </span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">收费方式</span>
                        <span class="label w-60"
                            v-if="over.finance.chargeType && chargeType[over.finance.chargeType].name">{{
                                chargeType[over.finance.chargeType].name
                            }}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">支付状态</span>
                        <span class="label w-60">
                            <el-select v-model="over.finance.chargeStatus" class="w-100" clearable placeholder="请选择">
                                <el-option v-for="items in chargeStatus" :key="items.key" :label="items.name"
                                    :value="items.key">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">支付方式</span>
                        <span class="label w-60">
                            <el-select v-model="over.finance.chargeMethod" class="w-100" clearable placeholder="请选择">
                                <el-option v-for="items in chargeMethod" :key="items.key" :label="items.name"
                                    :value="items.key">
                                </el-option>
                            </el-select>
                        </span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-100">
                        <span class="w-15 m-r-10 label">备注</span>
                        <span class="label w-80">
                            <el-input class="w-100" v-model="over.finance.note" type="textarea" :row="4"
                                clearable></el-input>
                        </span>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showPay = false">取 消</el-button>
                <el-button type="primary" @click="save_pay()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 人脸识别 -->
        <el-dialog :show-close="false" title="人脸识别" :visible.sync="dialogVisibleFace" width="380px"
            :before-close="handleClose">
            <div style="height: 400px; width: 100%">
                <video id="videoCamera" class="video" :width="videoWidth" :height="videoHeight" autoplay></video>
                <canvas class="canvas" style="display: none" id="canvasCamera" :width="videoWidth"
                    :height="videoHeight"></canvas>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" ref="btnFace" @click="setImage()">拍 照</el-button>
                <el-button @click="stopNavigator()">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';
import axios from 'axios'
import Axios from 'axios'

export default {
    components: { List },
    data() {
        return {

            bus: this.bus(this),
            showPay: false, //支付罚款

            financeType: [],

            chargeType: [],

            chargeStatus: [],

            chargeMethod: [],

            over: {
                borrowingInformation: {},
                circulationRules: {},
                finance: {}
            },
            showBookList: [],
            data: {},
            renewalsDay: 0,
            activeName: 'AND',
            rfid: '',
            cardId: '',
            showRead: false,
            showBook: false,
            info: {
                //    reader:{},
                borrowingInformationList: []
                //    bookBase:{},
                //    book:{}
            },
            form: {
                readerNumber: '',
                barCode: ''
            },
            height: '',
            tableData: [],
            // 读者信息字段
            readerList1: [
                { name: '证件类型', id: 'certificateType', type: [], isArry: true },
                { name: '邮箱', id: 'mailbox', type: [] },
                { name: '手机', id: 'phone', type: [] },
                // {name:'电话',id:'phone',type:[]},
                { name: '借阅次数', id: 'borrowNumber', type: [] },
                { name: '欠款', id: 'arrears', type: [] },
                { name: '续借次数', id: 'renewNumber', type: [] },
                { name: '历史违章次数', id: 'historicalViolation', type: [] },
                { name: '读者证号', id: 'number', type: [] },
                { name: '读者类型', id: 'readerTypeName', type: [] },
                { name: '状态', id: 'status', type: [], isArry: true }
            ],
            readerList2: [
                { name: '读者所属馆', id: 'libraryName' },
                { name: '读者姓名', id: 'name' },
                { name: '启用日期', id: 'start', isData: true },
                { name: '截止日期', id: 'end', isData: true },
                { name: '单位名称', id: 'readerUnitName' },
                { name: '证件号码', id: 'certificateNumber' },
                { name: '性别', id: 'gender', type: [], isArry: true },
                { name: '联系地址', id: 'address' },
                { name: '出生日期', id: 'birthday', isData: true },
                { name: '电话', id: 'telephone' },
                { name: '预约次数', id: 'documentAppointmentNumber' },
                { name: '押金', id: 'deposit' },
                { name: '最大借阅数', id: 'maxRenewals' },
                { name: '当前违章次数', id: 'currentViolation' },
                { name: '备注', id: 'note' }
            ],
            // 书目信息字段
            bookList1: [
                { name: 'ISBN', id: 'isbn' },
                { name: '索书号', id: 'callNumber' },
                { name: '题名', id: 'positiveTitle' },
                { name: '并列题名', id: 'tiedTitle' },
                { name: '副题名', id: 'subTitle' },
                { name: '分辑名', id: 'sectionTitle' },
                { name: '分辑号', id: 'sectionNumber' },
                { name: '其他责任者', id: 'otherResponsible' },
                { name: '丛编著者', id: 'seriesOwner' },
                { name: '出版地', id: 'publisherPlace' }
            ],
            bookList2: [
                { name: '页码', id: 'pageNumber' },
                { name: '附件', id: 'annex' },
                { name: '装帧方式', id: 'bindingMethod' },
                { name: '尺寸', id: 'formatSize' },
                // { name: '系统记录号', id: '' },
                { name: '文献类型', id: 'medium' },
                // {name:'校审',id:''},
                // { name: '书目馆', id: '' },
                { name: '编目人', id: 'managerName' },
                { name: '第一责任者', id: 'firstResponsible' }
            ],
            bookList3: [
                { name: '丛书名', id: 'seriesTitle' },
                { name: '出版社', id: 'publisher' },
                { name: '出版时间', id: 'publicationDate' },
                { name: '版次', id: 'edition' },
                { name: '图表', id: 'chart' },
                { name: '文献语种', id: 'language' },
                { name: '定价', id: 'price' },
                { name: '主题词', id: 'keywords' },
                { name: '内容摘要', id: 'contentSummary' }
            ],
            // model
            lookReader: false,
            lookBook: false,
            // 字段对应
            status: [],
            certificateType: [],
            bookStatus: [],
            time: '',
            times: '',
            face: false,//人脸识别是否显示
            dialogVisibleFace: false,//人脸识别弹框
            // 关于摄像头的
            videoWidth: 340,
            videoHeight: 350,
            imgSrc: "",
            thisCancas: null,
            thisContext: null,
            thisVideo: null,
            openVideo: false,
            platformID: null,
        };
    },
    created() {
        this.face = JSON.parse(localStorage.getItem('user')).platform.isFace
        this.platformID = JSON.parse(localStorage.getItem('user')).platform.id
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.metaList();
        this.metaLists();
        this.metaListes();
        this.getDay();
    },
    mounted() {
        this.IDNumberFn();//初次获取身份证号
        // this.getReadId();
    },
    // BW0000578
    beforeDestroy() {
        // window.BlueWhale.close();
    },
    methods: {
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 170;
            }, 100);
        },
        printing() {
            let meta = [
                { name: '读者证号', key: 'readerNumber', displayInList: true },
                { name: '文献条码', key: 'barCode', displayInList: true },
                { name: '馆藏地', key: 'collectionPlaceName', displayInList: true },

                { name: '题名', key: 'positiveTitle', displayInList: true },

                { name: '第一责任者', key: 'firstResponsible', displayInList: true, width: '200' },
                { name: '索书号', key: 'callNumber', displayInList: true },
                { name: '单价', key: 'price', displayInList: true },
                // { name: '借/应还日期', key: 'borrowDates', displayInList: true,width:'300' },
                { name: '是否归还', key: 'borrowStatus', displayInList: true }
            ];
            row.borrowStatus = row.borrow == true ? '归还' : '借出';
            let data = JSON.stringify([row]);
            meta = JSON.stringify(meta);
            let newsUrl = this.$router.resolve({ path: '/print', query: { data, meta } });
            window.open(newsUrl.href, '_blank');
        },
        // 下载
        down() {
            this.FileSaver('/offlineBorrow/offlineBorrow.exe', '离线借还.exe');
        },
        // 获取焦点
        getFocus(id) {
            let input;
            if (id) {
                input = document.getElementById(id);
            } else {
                input = document.getElementById(this.activeName);
            }
            input.focus();
            setTimeout((it) => {
                input.select();
            });
        },
        // 获取书本表
        getBooks(bookBaseId) {
            this.lookBook = true;
            let params = {
                bookBaseId,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax.get('/manage/unit/circulation/circulationManagement/books', { params }).then((res) => {
                this.showBookList = res;
            });
        },
        getDay() {
            this.ax.get('/manage/unit/circulation/circulationManagement/circulationRules').then((res) => {
                this.renewalsDay = res.renewalsDay;
            });
        },
        getNeedPay() {
            let params = {
                barCode: this.form.barCode,
                chargeType: 'OVERDUE_FINE',
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax.post('/manage/unit/circulation/circulationManagement/finance', params).then((res) => {
                this.over = res;
            });
        },
        save_pay() {
            let params = this.over.finance;
            params.barCode = this.form.barCode;
            params.code = this.form.barCode;
            params.number = this.over.borrowingInformation.readerNumber;
            this.ax.post('/manage/unit/circulation/circulationManagement/insertFinance', params).then((res) => {
                this.$message.success('添加成功,请再次归还');
                this.showPay = false;
            });
        },
        // 设备获取身份证号
        IDNumberFn() {
            axios.get(`http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&common=1&random=${new Date().getTime()}`).then(res => {
                // 新增获取身份证
                if (res.ret == 0) {
                    this.form.readerNumber = res.Certificate.IDNumber
                }
            })
        },
        handleClick() {
            this.IDNumberFn()
            this.showBook = false;
            this.showRead = false;
            this.lookReader = false;
            this.info = {
                borrowingInformationList: []
            };
            this.form = {
                readerNumber: '',
                barCode: ''
            };
        },

        searchRead() {
            this.loading();
            let params = {
                readerNumber: this.form.readerNumber,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax
                .get('/manage/unit/circulation/circulationManagement/reader', { params })
                .then(async (res) => {
                    if (this.form.readerNumber) {
                        const reader = await this.readerDetail(res.reader.id);
                        this.info.reader = reader;
                    }
                    this.info.borrowingInformationList = res.borrowingInformationList.filter(it => !it.borrow);
                    this.showRead = true;
                    this.sloading();
                    this.getFocus();
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        searchBook(barCode) {
            this.loading();
            let params = {
                barCode: barCode ? barCode : this.form.barCode,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax
                .get('/manage/unit/circulation/circulationManagement/book', { params })
                .then((res) => {
                    this.info.book = res.book;
                    this.info.bookBase = res.bookBase;
                    this.info.all = Object.assign(res.book, res.bookBase);
                    this.showBook = true;
                    this.sloading();
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 初始化监听机器
        getReadId(e) {
            window.BlueWhale.readPatron((cardId) => {
                if (cardId == null) {
                    return;
                }
                if (this.cardId == cardId) {
                    clearTimeout(this.times);
                    this.times = setTimeout((res) => {
                        this.form.readerNumber = '';
                        this.cardId = '';
                    }, 3000);
                } else {
                    this.cardId = cardId;
                    this.getReaderNumber(cardId);
                }
            });
            window.BlueWhale.readTag(this.readBookId);
        },
        // 获取读者卡id
        getReaderNumber(rfId) {
            this.ax
                .get('/manage/unit/circulation/readerManagement/readerNumber', {
                    params: { rfId, platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    this.form.readerNumber = res;
                });
        },
        // 获取barcode
        readBookId(e) {
            if (e == null) {
                return;
            }
            if (this.rfid == e) {
                clearTimeout(this.time);
                this.time = setTimeout((res) => {
                    // this.loading =true
                    this.rfid = '';
                    this.form.barCode = '';
                }, 3000);
            } else {
                //  this.loading =false
                this.rfid = e;
                this.getBarCode(e);
                //   this.$refs['barCode'].focus()
            }
        },
        getBarCode(rfId) {
            this.ax
                .get('/manage/unit/circulation/circulationManagement/barCode', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, rfId }
                })
                .then((res) => {
                    this.form.barCode = res;
                });
        },
        // returnBook
        returnBook(name) {//归还
            if ((this.activeName === 'RETURN' || this.activeName === 'RENEW') && !this.form.barCode) {
                return this.$message.error('文献条码不能为空')
            }
            this.searchBook();
            this.ax
                .post('/manage/unit/circulation/circulationManagement/readerAndBookContent', {
                    barCode: this.form.barCode,
                    type: 'RENEW',
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id
                })
                .then(async (res) => {
                    if (res.reader.id) {
                        const reader = await this.readerDetail(res.reader.id);
                        this.info.reader = reader;
                    }
                    this.info.bookBase = res.bookBase;
                    this.info.book = res.book;
                    this.info.all = Object.assign(res.book, res.bookBase);
                    this.borrowBook(name, '', '', '', 'returnBook');
                    if (res.reader) {
                        this.showRead = true;
                    }
                    if (res.bookBase) {
                        this.searchBook();
                        this.showBook = true;
                    }

                    // // this.info = res;
                    // console.log('ceshi');
                });
        },
        // 操作
        borrowBook(type, pwd, code, readerNumber, returnBook) {//外借
            // console.log('type', type);
            if (this.activeName === 'BORROW' && !this.form.readerNumber && !this.form.barCode) {
                return this.$message.error('读者证号及文献条码不能为空')
            }
            let params;
            if (pwd) {
                params = {
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                    barCode: code ? code : this.form.barCode,
                    type,
                    password: this.md5(pwd),
                    isUndocumented: true,
                    readerNumber: readerNumber ? readerNumber : this.form.readerNumber
                };
            } else {
                params = {
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                    barCode: code ? code : this.form.barCode,
                    type,
                    readerNumber: readerNumber ? readerNumber : this.form.readerNumber
                };
            }

            let url = '/manage/unit/circulation/circulationManagement/literatureLoan';
            this.ax
                .post(url, params)
                .then((res) => {
                    this.getFocus();
                    if (this.activeName == 'AND') {
                        this.searchBook(code);
                        this.searchRead();
                    }

                    if (type == 'LOAN' || type == 'RENEW') {
                        if (res === '外借成功') {
                            this.$message.success(res);
                        } else {
                            this.$message.success(`成功续借${this.renewalsDay}天`);
                        }
                        this.searchBook(code);
                        if (this.form.readerNumber) {
                            this.searchRead();
                        }

                        // window.BlueWhale.checkOut(this.rfid);
                    } else {
                        this.$message.success(res);
                        // window.BlueWhale.checkIn(this.rfid);
                    }

                    if (returnBook) {
                        this.searchInfo();
                    }
                })
                .catch((res) => {
                    if (res.code == 40001) {
                        this.getNeedPay();
                        this.showPay = true;
                    }
                });
        },
        async searchReturn(readerNumber) {
            this.form.readerNumber = readerNumber;
            return await this.ax.get('/manage/unit/circulation/circulationManagement/literatureReader', { params: this.form })
        },
        async readerDetail(id) {
            let params = {
                id
            }
            return await this.ax.get('manage/unit/circulation/readerManagement/readerDetail', { params })
        },
        // 搜索
        searchInfo() {
            if (this.activeName === 'AND' && !this.form.readerNumber && !this.form.barCode) {
                return this.$message.error('读者证号及文献条码不能为空')
            }
            this.loading();

            let url = '/manage/unit/circulation/circulationManagement/literatureLoan';

            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;

            if (this.activeName == 'RETURN' || this.activeName == 'RENEW' || this.activeName == 'LITERATURE') {
                this.form.borrowingInquiry = true;

                url = '/manage/unit/circulation/circulationManagement/literatureRenewRestitution';
            } else if (this.activeName == 'READERS') {
                this.form.borrowingInquiry = true;
                // url = '/manage/unit/circulation/circulationManagement/literatureReader';
                // 20240220修改了这里,换了一个接口,这个接口数据完整
                url = '/manage/unit/circulation/circulationManagement/reader';
            }

            this.form.page = 1;
            this.form.size = 100;
            console.log(this.form, '--this.form');
            this.ax
                .get(url, { params: this.form })
                .then(async (res) => {
                    this.sloading();
                    if (res.reader) {
                        this.showRead = true;
                    }
                    if (res.bookBase) {
                        this.showBook = true;
                    }
                    this.info = res;
                    this.info.all = Object.assign(res.book, res.bookBase);
                    if (res.reader.id) {
                        const reader = await this.readerDetail(res.reader.id);
                        this.info.reader = reader;
                    }
                    if (this.activeName === 'RETURN') {
                        const returns = await this.searchReturn(res.reader.number);
                        if (returns.borrowingInformationList) {
                            this.info.borrowingInformationList = returns.borrowingInformationList
                        }
                    }

                })
                .catch((res) => {
                    this.sloading();
                });
        },
        // 人脸识别
        // 打开摄像头
        faceIdentify() {
            var _this = this;
            navigator.mediaDevices.enumerateDevices().then(data => {
                let list = data.filter((it) => {
                    return it.kind == "videoinput"
                });
                if (!list || !list.length) {
                    this.$message.error("未找到摄像头");
                    return;
                } else {
                    this.dialogVisibleFace = true;
                    this.$nextTick(() => {
                        _this.thisCancas = document.querySelector("#canvasCamera"); //获取画布
                        _this.thisContext = this.thisCancas.getContext("2d"); //用户绘画画布的示例
                        _this.thisVideo = document.getElementById("videoCamera"); //获取视频标签
                        // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
                        if (navigator.mediaDevices === undefined) {
                            navigator.mediaDevices = {};
                        }
                        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                        // 使用getUserMedia，因为它会覆盖现有的属性。
                        // 这里，如果缺少getUserMedia属性，就添加它。
                        if (navigator.mediaDevices.getUserMedia === undefined) {
                            navigator.mediaDevices.getUserMedia = function (constraints) {
                                // 首先获取现存的getUserMedia(如果存在)
                                var getUserMedia =
                                    navigator.webkitGetUserMedia ||
                                    navigator.mozGetUserMedia ||
                                    navigator.getUserMedia;
                                // 有些浏览器不支持，会返回错误信息
                                // 保持接口一致
                                if (!getUserMedia) {
                                    //不存在则报错
                                    return Promise.reject(
                                        new Error("getUserMedia is not implemented in this browser")
                                    );
                                }
                                // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                                return new Promise(function (resolve, reject) {
                                    getUserMedia.call(navigator, constraints, resolve, reject);
                                });
                            };
                        }
                        var constraints = {
                            audio: false,
                            video: {
                                width: this.videoWidth,
                                height: this.videoHeight,
                                // transform: "scaleX(-1)",
                            },
                        };
                        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                            this.$message.error('请到浏览器设置中手动打开摄像头权限')
                        } else {
                            navigator.mediaDevices
                                .getUserMedia(constraints)
                                .then(function (stream) {
                                    // 旧的浏览器可能没有srcObject
                                    if ("srcObject" in _this.thisVideo) {
                                        _this.thisVideo.srcObject = stream;
                                    } else {
                                        // 避免在新的浏览器中使用它，因为它正在被弃用。
                                        _this.thisVideo.src = window.URL.createObjectURL(stream);
                                    }
                                    _this.thisVideo.onloadedmetadata = function (e) {
                                        _this.thisVideo.play();
                                    };
                                })
                                .catch((err) => {
                                    this.$message.error('请到浏览器设置中手动打开摄像头权限')
                                });
                        }

                    });
                }

            })
            //    console.log(,'this.$refs.editTask');
        },
        // 关闭摄像头
        stopNavigator() {
            this.dialogVisibleFace = false;
            this.thisVideo.srcObject.getTracks()[0].stop();
        },
        // 拍照
        setImage() {
            // console.log(document.body.clientWidth,'document.body.clientWidth');
            let bodyWidth = document.body.clientWidth
            let contX = bodyWidth < 1200 ? -340 : 0
            let contY = bodyWidth < 1200 ? 5 : 0
            var _this = this;
            // canvas画图
            // if (bodyWidth < 1200) {
            //     _this.thisContext.rotate(90 * Math.PI / 180);
            // }
            _this.thisContext.drawImage(
                _this.thisVideo,
                contY,
                contX,
                _this.videoWidth,
                _this.videoHeight
            );
            // 获取图片base64链接
            var image = this.thisCancas.toDataURL("image/png").replace("data:image/png;base64,", "");
            let data = {
                photo: image,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                type: 1,
                hardwareType: 1
            }
            _this.ax.post('/hardware/interface/readerLogin', data).then((res) => {
                if (res) {
                    _this.form.readerNumber = res.number
                    _this.stopNavigator()
                    _this.$message.success('识别成功');
                }
            });
            // _this.imgSrc = image; //赋值并预览图片
            // let aa = this.dataURLtoFile(image, 'png')

        },
        // 弹框关闭前
        handleClose() {
            this.$refs.rulesForm.resetFields();
            this.dialogVisibleFace = false;
        },
        metaListes() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'status') {
                        it.searchOption.map((item) => {
                            this.readerList1[9].type[item.key] = item;
                            this.status[item.key] = item;
                        });
                    }
                    if (it.key == 'certificateType') {
                        it.searchOption.map((item) => {
                            this.readerList1[0].type[item.key] = item;
                            this.certificateType[item.key] = item;
                        });
                    }
                    if (it.key == 'gender') {
                        it.searchOption.map((item) => {
                            this.readerList2[6].type[item.key] = item;
                        });
                    }
                });
            });
        },
        metaLists() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'bookStatus') {
                        it.searchOption.map((item) => {
                            this.bookStatus[item.key] = item;
                        });
                    }
                });
            });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Finance' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'financeType') {
                        this.financeType = it.searchOption;
                    }
                    if (it.key == 'chargeType') {
                        it.searchOption.map((it) => {
                            this.chargeType[it.key] = it;
                        });
                    }
                    if (it.key == 'chargeStatus') {
                        this.chargeStatus = it.searchOption;
                    }
                    if (it.key == 'chargeMethod') {
                        this.chargeMethod = it.searchOption;
                    }
                });
            });
        }
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
    width: 80px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
}

.info+span {
    max-width: 180px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.readerInfo {
    text-align: left;
}

.readerTitle {
    text-align: right;
    display: inline-block;
    /* padding-left: 20px; */
    width: 100px;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid transparent;
}

.readerText {
    display: inline-block;
    width: 200px;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid transparent;
}

.readerTitle:hover,
.readerText:hover {
    border: 1px solid #267ff9;
    border-radius: 5px;
}

.label {
    display: inline-block;
}

.backgound_d {
    background: #ddd;
}

.header_NO {
    color: #999;
    text-align: center;
    font-size: 60px;
    /* padding-top: 40px; */
}
</style>
