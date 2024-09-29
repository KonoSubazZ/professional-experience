 <template>
    <div class="container" :style="'height:'+height+'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="超期罚款" name="OVERDUE_FINE"></el-tab-pane>
                <el-tab-pane label="丢失罚款" name="LOST_FINE"></el-tab-pane>
                <el-tab-pane label="污损罚款" name="DAMAGE_FINE"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="padding_20 m-b-40">
            <div class="display_flex">
                <el-input v-model="form.readerNumber" placeholder="读者证号" clearable  class="m-r-20 w-20"  @keyup.enter.native="searchRead" ></el-input>

                <el-input v-model="form.barCode" placeholder="文献条码" clearable  class="m-r-20 w-20" @keyup.enter.native="searchRead" ></el-input>

                <el-button type="primary"  class="m-r-20"    @click="searchRead()">搜索</el-button>

             
                 
            </div>
        </div>
        <div class="padding_20 m-b-40" v-if="showRead">
            <div class="title_reader m-b-25">读者信息</div>
            <div class="display_flex start">
                <img :src="info.reader.photo" class="readerHeader m-r-25 img" />
                <div class="w-90 display_flex start">
                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">读者证号</span>
                            <span>{{info.reader.number}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">截止日期</span>
                            <span>{{getTime(info.reader.end)}}</span>
                        </div>
                        <div class="m-b-20 cursor color_b" @click="lookReader=true">查看读者信息</div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">读者姓名</span>
                            <span>{{info.reader.name}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">状态</span>
                            <span
                                v-if="info.reader.status &&  status[info.reader.status].name"
                            >{{ status[info.reader.status].name }}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">单位名称</span>
                            <span>{{info.reader.readerUnitName}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">读者所属馆</span>
                            <span>{{info.reader.libraryName}}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">读者类型</span>
                            <span>{{info.reader.readerTypeName}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">总计借阅</span>
                            <span>{{info.reader.borrowNumber}}</span>
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
                            <span class="m-r-20 info color_6">题名</span>
                            <span>{{info.bookBase.positiveTitle}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">ISBN号</span>
                            <span>{{info.bookBase.isbn}}</span>
                        </div>
                        <div class="m-b-20 cursor color_b" @click="lookBook=true">查看书目信息</div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">索书号</span>
                            <span>{{info.book.callNumber}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">出版社</span>
                            <span>{{info.bookBase.publisher}}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">馆藏地</span>
                            <span>{{info.book.collectionPlaceName}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">出版时间</span>
                            <span>{{info.bookBase.publicationDate}}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">架位号</span>
                            <span>{{info.bookBase.rackName}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">出版地</span>
                            <span>{{info.bookBase.publisherPlace}}</span>
                        </div>
                    </div>

                    <div class="w-20 f-s-14 color_3">
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">单价</span>
                            <span>{{info.bookBase.price}}</span>
                        </div>
                        <div class="m-b-20">
                            <span class="m-r-20 info color_6">文献语种</span>
                            <span>{{info.bookBase.language}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="padding_20 m-b-40" v-if="info.borrowingInformationList.length>0">
            <div class="title_reader m-b-25">当前借阅信息</div>
            <el-table :data="info.borrowingInformationList" style="width: 100%">
                <el-table-column prop="readerNumber" label="读者证号" width="180"></el-table-column>
                <el-table-column prop="barCode" label="文献条码" width="180"></el-table-column>
                <el-table-column prop="collectionPlaceName" label="馆藏地"></el-table-column>
                <el-table-column prop="positiveTitle" label="题名"></el-table-column>
                <el-table-column prop="firstResponsible" label="第一责任者"></el-table-column>
                <el-table-column prop="callNumber" label="索书号"></el-table-column>
                <el-table-column prop="price" label="单价"></el-table-column>
                <el-table-column label="借/应还日期" width='150'>
                    <template slot-scope="scope">
                        <div>{{getTime(scope.row.borrowDate)}}/{{getTime(scope.row.borrowAlso)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='80'>
                    <template slot-scope="scope">
                        <div class="table-action flex-row flex-wrap flex_center">
                            <el-button
                                v-if="!scope.row.borrow"
                                size="mini"
                                type="text"
                                class="m-r-20"
                                @click="payMoney(scope.row.barCode)"
                            >罚款</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="padding_20 m-b-40" v-if="info.financeList.length>0">
            <div class="title_reader m-b-25">超期罚款未支付信息</div>
            <el-table :data="info.financeList" style="width: 100%">
                <el-table-column prop="financeType" label="财务类型" >
                    <template slot-scope="scope">
                       <span
                            class="label w-60"
                            v-if="scope.row.financeType && financeTypes[scope.row.financeType].name"
                        >{{financeTypes[scope.row.financeType].name}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="fee" label="费用金额" >

                </el-table-column>

                <el-table-column prop="chargeMethod" label="财务方式">
                     <template slot-scope="scope">
                       <span
                            class="label w-60"
                            v-if="scope.row.chargeMethod && chargeMethods[scope.row.chargeMethod].name"
                        >{{chargeMethods[scope.row.chargeMethod].name}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="chargeStatus" label="收费状态">
                     <template slot-scope="scope">
                       <span :class="scope.row.chargeStatus=='pay'?'color_suc':'color_dan'">{{scope.row.chargeStatus=='pay'?'已支付':'未支付'}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="firstResponsible" label="收费方式">
                    <template slot-scope="scope">
                       <span
                            class="label w-60"
                            v-if="scope.row.chargeType && chargeTypes[scope.row.chargeType].name"
                        >{{chargeTypes[scope.row.chargeType].name}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="number" label="读者证号"></el-table-column>

                <el-table-column prop="name" label="读者姓名"></el-table-column>

                <el-table-column prop="code" label="文献条码"></el-table-column>

                <el-table-column prop="managerName"  label="操作人"></el-table-column>

               

              



                <el-table-column label="添加日期">

                    <template slot-scope="scope">
                        <div>{{getTime(scope.row.createTime)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='80'>
                    <template slot-scope="scope">
                        <div class="table-action flex-row flex-wrap flex_center">
                            <el-button
                                v-if="!scope.row.borrow"
                                size="mini"
                                type="text"
                                class="m-r-20"
                               @click="editPay(scope.row)"
                            >编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>



        <!-- model -->
        <el-dialog
            title="读者信息"
            :visible.sync="lookReader"
            width="40%"
            :close-on-click-modal="false"
        >
            <div class="display_flex readerInfo">
                <div class="w-50" v-if="info.reader">
                    <div class="display_flex start m-b-15">
                        <div class="m-r-20 readerTitle color_6">读者照片</div>
                        <img
                            :src="info.reader.photo"
                            v-if="info.reader"
                            class="readerHeader m-r-25 img"
                        />
                    </div>
                    <div v-for="(item,i) of readerList1" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span class="readerText" v-if="!item.isArry">{{info.reader[item.id]}}</span>
                        <span class="readerText" v-else>{{item.type[info.reader[item.id]].name}}</span>
                    </div>
                </div>
                <div class="w-50" v-if="info.reader">
                    <div v-for="(item,i) of readerList2" :key="i" class="m-b-15">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span
                            class="readerText"
                            v-if="item.isData"
                        >{{getTime(info.reader[item.id])}}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{info.reader[item.id]}}</span>
                        <span class="readerText" v-else>
                             <span v-if="item.type && info.reader[item.id] && item.type[info.reader[item.id]] && item.type[info.reader[item.id]].name ">{{item.type[info.reader[item.id]].name}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- model -->
        <el-dialog title="书目信息" :visible.sync="lookBook" width="50%" :close-on-click-modal="false">
            <div class="display_flex between start readerInfo f-s-12">
                <div class="w-30 " v-if="info.book">
                    <div v-for="(item,i) of bookList1" :key="i" class="m-b-15 display_flex end b-b-1 ">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                        <span class="readerText" v-else>{{item.type[info.all[item.id]].name}}</span>
                    </div>
                </div>
                <div class="w-30" v-if="info.book">
                    <div v-for="(item,i) of bookList2" :key="i" class="m-b-15 display_flex  end b-b-1">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                        <span class="readerText" v-else>{{item.type[info.all[item.id]].name}}</span>
                    </div>
                </div>
                <div class="w-30 " v-if="info.book">
                    <div v-for="(item,i) of bookList3" :key="i" class="m-b-15 display_flex end b-b-1">
                        <span class="m-r-20 readerTitle color_6">{{item.name}}</span>
                        <span class="readerText" v-if="item.isData">{{getTime(info.all[item.id])}}</span>
                        <span class="readerText" v-else-if="!item.isArry">{{info.all[item.id]}}</span>
                        <span class="readerText" v-else>{{item.type[info.all[item.id]].name}}</span>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- showPay -->
        <el-dialog title="读者信息" :visible.sync="showPay" width="40%" :close-on-click-modal="false">
            <div>
                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者证号</span>
                        <span class="label w-60">{{over.borrowingInformation.readerNumber}}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者姓名</span>
                        <span class="label w-60">{{over.borrowingInformation.readerName}}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">借阅日期</span>
                        <span class="label w-60">{{getTime(over.borrowingInformation.borrowDate)}}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">应还日期</span>
                        <span class="label w-60">{{getTime(over.borrowingInformation.borrowAlso)}}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期天数</span>
                        <span class="label w-60">{{over.beyondNumber}}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">读者单位名称</span>
                        <span class="label w-60">{{over.borrowingInformation.readerUnitName}}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期每日罚款</span>
                        <span class="label w-60">{{over.circulationRules.overdueFine}}</span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">超期最大罚款</span>
                        <span class="label w-60">{{over.circulationRules.maxOverdueFine}}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">罚款金额</span>
                        <span class="label w-60">
                            <el-input class="w-40" v-model="over.finance.fee" clearable></el-input>
                        </span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">收费方式</span>
                        <span
                            class="label w-60"
                            v-if="over.finance.chargeType && chargeTypes[over.finance.chargeType].name"
                        >{{chargeTypes[over.finance.chargeType].name}}</span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">支付状态</span>
                        <span class="label w-60">
                            <el-select
                                v-model="over.finance.chargeStatus"
                                class="w-100"
                                clearable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="items in chargeStatus"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key"
                                ></el-option>
                            </el-select>
                        </span>
                    </div>
                    <div class="w-50">
                        <span class="w-30 m-r-10 label">支付方式</span>
                        <span class="label w-60">
                            <el-select
                                v-model="over.finance.chargeMethod"
                                class="w-100"
                                clearable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="items in chargeMethod"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key"
                                ></el-option>
                            </el-select>
                        </span>
                    </div>
                </div>

                <div class="display_flex between m-b-20">
                    <div class="w-100">
                        <span class="w-15 m-r-10 label">备注</span>
                        <span class="label w-80">
                            <el-input
                                class="w-100"
                                v-model="over.finance.note"
                                type="textarea"
                                :row="4"
                                clearable
                            ></el-input>
                        </span>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showPay = false">取 消</el-button>
                <el-button type="primary" @click="save_pay()">确 定</el-button>
            </span>
        </el-dialog>


         <!-- 弹框 -->
        <el-dialog :title="payInfo.financeType=='TOLL'?'收费':'退费'" :visible.sync="showpayInfo" width="40%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="payInfo" :rules="rules" ref="payInfo" label-width="120px" class=" m-b-30">
                    
                       <div class="display_flex between">
                            <el-form-item label="财务类型" prop='financeType' class="w-50">
                                <el-select v-model="payInfo.financeType" class="w-100" clearable disabled placeholder="请选择" >
                                    <el-option
                                    v-for="items in financeType"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="读者证号" prop='number' class="w-50" >
                                <el-input v-model="payInfo.number" class="w-100"></el-input>
                            </el-form-item>
                       </div>

                        <div class="display_flex between">
                            <el-form-item label="读者姓名" prop='name' class="w-50" >
                                <el-input v-model="payInfo.name" class="w-100"></el-input>
                            </el-form-item>

                            <el-form-item label="费用金额" prop='fee' class="w-50" >
                                <el-input v-model="payInfo.fee" class="w-100" ></el-input>
                            </el-form-item>

                           
                       </div>

                        <div class="display_flex between">
                            <el-form-item label="财务方式" prop='chargeMethod'  class="w-50">
                                 <el-select v-model="payInfo.chargeMethod" class="w-100" clearable placeholder="请选择" >
                                    <el-option
                                    v-for="items in chargeMethod"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="收费状态" prop='chargeStatus' class="w-50">
                                 <el-select v-model="payInfo.chargeStatus" class="w-100" clearable placeholder="请选择" >
                                    <el-option
                                    v-for="items in chargeStatus"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                       </div>

                        <div class="display_flex between">
                             <el-form-item label="收费方式" prop='chargeType' class="w-50">
                                 <el-select v-model="payInfo.chargeType" class="w-100" clearable placeholder="请选择" >
                                    <el-option
                                    v-for="items in chargeType"
                                    :key="items.key"
                                    :label="items.name"
                                    :value="items.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            

                            <el-form-item label="文献条码" class="w-50" prop='code' >
                                <el-input v-model="payInfo.code" ></el-input>
                            </el-form-item>

                       </div>

                        <el-form-item label="备注"  >
                            <el-input v-model="payInfo.note" ></el-input>
                        </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showpayInfo = false">取 消</el-button>
                    <el-button type="primary" @click="save_payInfo">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {
            bus: this.bus(this),
            showPay: false, //支付罚款

            financeType: [],
            financeTypes:[],
            chargeType: [],
            chargeTypes:[],
            chargeStatus: [],

            chargeMethod: [],
            chargeMethods:[],


            over: {
                borrowingInformation: {},
                circulationRules: {},
                finance: {}
            },
            payInfo:{},

            renewalsDay: 0,
            activeName: 'OVERDUE_FINE',
            rfid: '',
            cardId: '',
            showRead: false,
            showBook: false,
            showpayInfo:false,
            info: {
                //    reader:{},
                borrowingInformationList: [],
                financeList:[],
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
                { name: '手机', id: 'telephone', type: [] },
                // {name:'电话',id:'phone',type:[]},
                { name: '借阅次数', id: 'borrowNumber', type: [] },
                { name: '欠款', id: '', type: [] },
                { name: '续借次数', id: '', type: [] },
                { name: '历史违章次数', id: '', type: [] },
                { name: '读者证号', id: '', type: [] },
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
                { name: '电话', id: 'phone' },
                { name: '预约次数', id: '' },
                { name: '押金', id: 'deposit' },
                { name: '最大借阅数', id: 'maxRenewals' },
                { name: '当前违章次数', id: '' },
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
            rules:{},
            // model
            lookReader: false,
            lookBook: false,
            // 字段对应
            status: [],
            certificateType: [],
            bookStatus: [],
            time: '',
            times: ''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.metaList();
        this.metaLists();
        this.metaListes();
    },
    mounted() {
        // this.getReadId();
    },
    beforeDestroy() {
        window.BlueWhale.close();
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        // 添加罚款
        payMoney(barCode){
            let params={
                barCode,
                chargeType:this.activeName,
                 platformId: JSON.parse(localStorage.getItem('user')).platform.id
            }
            this.ax.post('/manage/unit/circulation/circulationManagement/finance',params)
                .then(res=>{
                    this.showPay = true;
                    this.over = res;
                })
        },
        close(){},
        // 编辑支付信息
        editPay(val){
            this.payInfo = val
            this.showpayInfo =true
        },
        save_payInfo(){
              this.loading();
                        this.ax
                            .post('/manage/unit/circulation/financeManagement/finance', this.payInfo)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/circulation/financeManagement/finance`, res);
                                 this.showpayInfo=false
                                  this.searchRead()
                            })
                            .catch(res => {
                                this.sloading();
                            });
        },
        save_pay() {
            let params = this.over.finance;
            params.barCode = this.over.borrowingInformation.barCode;
            params.code = this.over.borrowingInformation.barCode;
            params.number = this.over.borrowingInformation.readerNumber;
            this.ax.post('/manage/unit/circulation/circulationManagement/insertFinance', params).then((res) => {
                this.$message.success('添加成功');
                this.showPay = false;
                this.searchRead()
            });
        },
        handleClick() {
            this.showBook = false;
            this.showRead = false;
            this.info = {
                borrowingInformationList: [],
                financeList:[]
            };
            this.form = {
                readerNumber: '',
                barCode: ''
            };
        },

        searchRead() {
            this.loading();
            let params = {
                barCode: this.form.barCode,
                readerNumber: this.form.readerNumber,
                platformId: JSON.parse(localStorage.getItem('user')).platform.id
            };
            this.ax
                .get('/manage/unit/circulation/circulationManagement/finance', { params })
                .then((res) => {
                   
                    this.sloading();
                    if(!this.form.readerNumber){
                      this.showRead = false;
                    }
                   if(!this.form.barCode){
                     this.showBook = false;
                   }
                    if(res.book){
                         this.info.book = res.book;
                        this.info.bookBase = res.bookBase;
                        this.info.all = Object.assign(res.book, res.bookBase);
                        this.showBook = true;
                    }
                    if(res.reader){
                         this.info.reader = res.reader;
                         this.showRead = true;
                    }
                    if(res.borrowingInformationList){
                        let nowTime = new Date().getTime();
                        this.info.borrowingInformationList = this.activeName==='OVERDUE_FINE'?
                            res.borrowingInformationList.filter(it=> !it.borrow && it.borrowAlso < nowTime) : res.borrowingInformationList.filter(it=> !it.borrow);
                    }
                    if(res.financeList){
                        this.info.financeList = res.financeList;
                    }
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
            // console.log();
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
      
        metaListes() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then((res) => {
                res.subs.map((it) => {
                    if (it.key == 'status') {
                        it.searchOption.map((item) => {
                            this.readerList1[9].type[item.key] = item;
                            this.status[item.key] = item;
                        });
                    }
                    // // console.log()
                    if (it.key == 'certificateType') {
                        it.searchOption.map((item) => {
                            this.readerList1[0].type[item.key] = item;
                            this.certificateType[item.key] = item;
                        });
                    }
                    if (it.key == 'gender') {
                        it.searchOption.map((item) => {
                            this.readerList2[6].type[item.key] = item;
                            //  this.certificateType[item.key] = item
                        });
                    }
                });
                // // console.log(this.readerList1[9].type)
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
                         it.searchOption.map((it) => {
                            this.financeTypes[it.key] = it;
                        });
                    }
                    if (it.key == 'chargeType') {
                         this.chargeType = it.searchOption;
                        it.searchOption.map((it) => {
                           
                            this.chargeTypes[it.key] = it;
                        });
                    }
                    if (it.key == 'chargeStatus') {
                        this.chargeStatus = it.searchOption;
                    }
                    if (it.key == 'chargeMethod') {
                        this.chargeMethod = it.searchOption;
                        it.searchOption.map((it) => {
                            this.chargeMethods[it.key] = it;
                        });
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
}
.info + span {
    width: 180px;
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
    width: 80px;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid transparent;
}
.readerText {
    display: inline-block;
    width: 160px;
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


</style>
