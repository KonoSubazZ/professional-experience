<template>
    <div class="container">
        <List
            :dataUrl="'/manage/unit/circulation/financeManagement/finance'"
            :disableMeta="true"
            :tableMeta="meta"
            @data="getData"
            @edit="editUpdate"
            ref="list"
            :searchName="searchName"
            :isHeaderHeigt="30"
            @delete="deleteUpdate"
            @selected="getChoose"
            :chooseBox="true"
        >
            <template slot="addition-actions">
                <el-button-group class="elg_s">
                    <el-button size="small " type="primary" plain class="add m-r-20" icon="el-icon-circle-plus-outline" @click="open('TOLL')" >收费</el-button>
                    <el-button size="small " type="primary" plain icon="el-icon-remove-outline" @click="open('REFUND')" >退费</el-button>
                    <el-button  size="small " type="primary" plain class="add m-r-20" icon="el-icon-printer" @click="printing" >打印</el-button>
                </el-button-group>
            </template>
            <template slot="addition-table-actions" slot-scope="scope">
                <el-button
                    type="primary"
                    size="text"
                    v-if="scope.item.row.chargeMethod == 'WECHAT' && scope.item.row.chargeStatus == 'UNPAID' && isWeChat"
                    @click="payMoney(scope.item.row, 'wx')"
                    >生成二维码</el-button
                >
            </template>
        </List>
        <!-- 弹框 -->
        <el-dialog
            :title="form.financeType == 'TOLL' ? '收费' : '退费'"
            :visible.sync="createModel"
            width="40%"
            :close-on-click-modal="false"
            @close="close"
        >
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="m-b-30">
                <div class="display_flex between">
                    <el-form-item label="财务类型" prop="financeType" class="w-50">
                        <el-select v-model="form.financeType" class="w-100" clearable disabled placeholder="请选择">
                            <el-option v-for="items in financeType" :key="items.key" :label="items.name" :value="items.key"> </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="读者证号" prop="number" class="w-50">
                        <el-input v-model="form.number" class="w-100" @keyup.enter.native="searchReaders"></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex between">
                    <el-form-item label="读者姓名" prop="name" class="w-50">
                        <el-input v-model="form.name" class="w-100"></el-input>
                    </el-form-item>

                    <el-form-item label="费用金额" prop="fee" class="w-50">
                        <el-input v-model="form.fee" class="w-100"></el-input>
                    </el-form-item>
                </div>

                <div class="display_flex between">
                    <el-form-item label="财务方式" prop="chargeMethod" class="w-50">
                        <el-select v-model="form.chargeMethod" class="w-100" @change="isPay" clearable placeholder="请选择">
                            <el-option v-for="items in chargeMethod" :key="items.key" :label="items.name" :value="items.key"> </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="收费状态" prop="chargeStatus" class="w-50">
                        <el-select
                            v-model="form.chargeStatus"
                            class="w-100"
                            :disabled="form.chargeMethod == 'WECHAT' || form.chargeMethod == 'ALIPAY'"
                            clearable
                            placeholder="请选择"
                        >
                            <el-option v-for="items in chargeStatus" :key="items.key" :label="items.name" :value="items.key"> </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="display_flex between">
                    <el-form-item label="收费类型" prop="chargeType" class="w-50">
                        <el-select v-model="form.chargeType" class="w-100" clearable placeholder="请选择">
                            <el-option v-for="items in chargeType" :key="items.key" :label="items.name" :value="items.key"> </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文献条码" class="w-50" prop="code" v-if="form.chargeType != 'DEPOSIT'">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="书目ID" prop='name' >
                                <el-input v-model="form.name" ></el-input>
                            </el-form-item> -->
                </div>

                <el-form-item label="备注">
                    <el-input v-model="form.note"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <span
                    v-if="form.financeType == 'TOLL' && (form.chargeType == 'OVERDUE_FINE' || form.chargeType == 'DAMAGE_FINE')"
                    style="font-size: 14px; color: #e6a23c; margin-right: 15px"
                    >* 收费后请主动进行归还图书</span
                >
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 弹框 -->
        <el-dialog title="微信支付页面" :visible.sync="wxModel" width="20%" :close-on-click-modal="false" @close="close">
            <div style="text-align: center">
                <img :src="wx" class="wxPay" />
                <div>未支付完成请勿关闭当前窗口</div>
            </div>
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
            meta: '',
            choose:[],
            createModel: false,
            form: {
                chargeStatus: 'UNPAID',
                name: '',
                chargeMethod: 'CASH',
                chargeType: 'OVERDUE_FINE'
            },
            isWeChat: false,
            wx: '',
            wxModel: false,
            rules: {
                number: [{ required: true, message: '请输入', trigger: 'blur' }],
                fee: [{ required: true, message: '请输入', trigger: 'blur' }],
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                code: [{ required: true, message: '请输入', trigger: 'blur' }],
                chargeMethod: [{ required: true, message: '请输入', trigger: 'change' }],
                chargeStatus: [{ required: true, message: '请输入', trigger: 'change' }],
                chargeType: [{ required: true, message: '请输入', trigger: 'change' }]
            },
            number: null,
            searchName: {},
            financeType: [],
            chargeType: [],
            chargeStatus: [],
            chargeMethod: [],
            data: {}
        };
    },
    created() {
        this.isWeChat = JSON.parse(localStorage.getItem('user')).platform.isWeChat;
        this.metaList();
        if (this.$route.query.number) {
            this.searchName = {
                number: this.$route.query.number
            };
        }
    },
    methods: {
        // 选择
        getChoose(val){
          this.choose = val
        },
        getData(val) {
            // val.content = val.content.map((e) => ({
            //     ...e,
            //     chargeType: this.chargeType.filter((it) => e.chargeType === it.key)[0].name,
            //     chargeStatus: this.chargeStatus.filter((it) => e.chargeStatus === it.key)[0].name,
            //     chargeMethod: this.chargeMethod.filter((it) => e.chargeMethod === it.key)[0].name,
            //     financeType: this.financeType.filter((it) => e.financeType === it.key)[0].name
            // }));
            this.data = val;
        },
        printing() {
            let meta = [
                { name: '费用金额', key: 'fee', displayInList: true },
                { name: '收费类型', key: 'chargeType', displayInList: true },
                { name: '收费状态', key: 'chargeStatus', displayInList: true },

                { name: '收费方式', key: 'chargeMethod', displayInList: true },

                { name: '财务类型', key: 'financeType', displayInList: true },
                { name: '读者证号', key: 'number', displayInList: true },
                { name: '读者姓名', key: 'name', displayInList: true },
                // { name: '借/应还日期', key: 'borrowDates', displayInList: true,width:'300' },
                { name: '文献条码', key: 'code', displayInList: true },
                { name: '备注', key: 'note', displayInList: true }
            ];

            let data = JSON.stringify(this.data);
            meta = JSON.stringify(meta);
            let newsUrl = this.$router.resolve({ path: '/print', query: { data, meta } });
            window.open(newsUrl.href, '_blank');
        },
        searchReaders() {
            let params = {
                readerNumber: this.form.number,
                barCode: '',
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                borrowingInquiry: true
            };
            this.ax.get('/manage/unit/circulation/circulationManagement/literatureReader', { params }).then((res) => {
                this.form.name = res.reader.name;
            });
        },
        // payMoney
        payMoney(row, type) {
            this.ax.get('/order/wechatFinance', { params: { financeId: row.id } }).then((res) => {
                // console.log(res)
                this.wxModel = true;
                this.wx = '/' + res;
                this.chechPay(row.id);
            });
        },
        // 查询是否支付
        chechPay(id) {
            this.ax
                .get('/order/wechatFinanceResult', { params: { financeId: id } })
                .then((res) => {
                    // console.log(res)
                    if (res) {
                        this.wxModel = false;
                        this.$message.success('支付成功');
                        this.bus.$emit(`flash_/manage/unit/circulation/financeManagement/finance`, res);
                    } else {
                        if (this.wxModel == true) {
                            setTimeout(() => {
                                this.chechPay(id);
                            }, 1000);
                        }
                    }
                })
                .catch((res) => {});
        },
        // 检测
        isPay(val) {
            console.log(val);
            if (val == 'WECHAT' || val == 'ALIPAY') {
                this.form.chargeStatus = 'UNPAID';
            }
        },
        open(chargeStatus) {
          if(this.choose.length !== 1 && chargeStatus === 'REFUND'){
            return this.$message.warning('请选择一条财务信息')
          }
          if(chargeStatus === 'REFUND'){
            this.form = this.choose[0];
          }
            this.form.financeType = chargeStatus;
            this.createModel = true;
        },
        async search() {
            let params = {
                platformId: JSON.parse(localStorage.getItem('user')).platform.id,

            };
            return await this.ax.get('/manage/unit/catalog/collectionHandling/collectionBatch', { params });
        },
        // 新增保存
        async save_mar(formName) {
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
            if (this.form.chargeType == 'LOST_FINE' && this.form.financeType == 'TOLL') {
                let bookres = await this.search();
                let arr = bookres.content.filter((item) => {
                    return item.barCode == this.form.code;
                });
                let params = {
                    collectionBatchResList: arr,
                    collectionBatchUpdateReq: {
                        bookStatus: 'LOST',
                        undefined: ''
                    },
                    query: { page: 1, platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 5 }
                };
                this.ax.post('/manage/unit/catalog/collectionHandling/collectionBatch', params).then();
            }
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading();
                    this.ax
                        .post('/manage/unit/circulation/financeManagement/finance', this.form)
                        .then((res) => {
                            this.sloading();

                            this.$message.success('保存成功');

                            this.bus.$emit(`flash_/manage/unit/circulation/financeManagement/finance`, res);
                            this.createModel = false;
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
        // 修改
        editUpdate(e) {
          console.log(e[0])
          if(e[0].chargeStatus === "PAY"){
            return this.$message.error('当前财务信息收费状态为已支付，不可编辑')
          }
            this.loading();
            this.form = JSON.parse(JSON.stringify(e[0]));
            this.createModel = true;
            setTimeout((res) => {
                this.sloading();
            }, 500);
        },
        // 删除
        deleteUpdate(e) {
            // // console.log(e)
            this.loading();
            let ids = e
                .map((it) => {
                    return it.id;
                })
                .join(',');
            this.ax
                .delete('/manage/unit/circulation/readerManagement/readerUnit?ids=' + ids)
                .then((res) => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/readerUnit`, res);
                    this.$message.success('删除成功');
                })
                .catch((res) => {
                    this.sloading();
                });
        },
        close() {
            this.form = {
                chargeStatus: 'UNPAID',
                name: '',
                chargeMethod: 'CASH',
                chargeType: 'OVERDUE_FINE'
            };
        },

        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Finance' } }).then((res) => {
                res.insertable = false;
                res.delete = 'NONE';
                res.subs.map((it) => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                    if (it.key == 'financeType') {
                        this.financeType = it.searchOption;
                    }
                    if (it.key == 'chargeType') {
                        this.chargeType = it.searchOption;
                    }
                    if (it.key == 'chargeStatus') {
                        this.chargeStatus = it.searchOption;
                    }
                    if (it.key == 'chargeMethod') {
                        this.chargeMethod = it.searchOption;
                    }
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style scoped>
.elg_s{
    display: flex;
}
.wxPay {
    width: 270px;
    height: 270px;
    margin: 0 auto;
}
</style>
