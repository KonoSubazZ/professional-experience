<template>
  <div class="container">
    <List :faceValue="faceValue" :nonephoto="nonephoto" :readerUnitName="readerUnitName"
      :dataUrl="'/manage/unit/circulation/readerManagement/reader'" :disableMeta="true" :tableMeta="meta"
      @edit="editUpdate" ref="list" @delete="deleteUpdate" @selected="getChoose" :isHeaderHeigt='30'
      :showDeleteText='true' :chooseBox='true'>

      <template slot="filter">
        <div style="display: flex;">
          <div class="m-r-20 m-b-10">
            <el-select @change="readerUnitNameChange" filterable v-model="readerUnitName" clearable placeholder="单位名称"
              class="w-100">
              <el-option hidden :key="readerUnitName" :label="readerUnitName" :value="readerUnitName"></el-option>
              <el-tree :current-node-key="readerUnitName" class="tree_body" :props="propsSelect" :load="loadNodeSelect"
                @node-click="handleNodeClick" node-key="id" highlight-current lazy>
              </el-tree>
            </el-select>
          </div>
          <div class="m-r-20 m-b-10">
            <el-select @change="handleChange" v-model="faceValue" placeholder="人脸认证">
              <el-option v-for="item in faceAuthentications" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="m-r-20 m-b-10">
            <el-select @change="photoChange" v-model="nonephoto" placeholder="读者照片">
              <el-option v-for="item in photoList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
      <template slot="addition-actions">
        <el-button-group class="ground_btn_w">
          <el-button type="primary" plain class="add m-r-20" icon='el-icon-folder-add' @click="addReader">办证</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" @click="change">换证</el-button>
          <el-button type="primary" plain icon="el-icon-back" @click="backCard">退证</el-button>

          <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="open('TOLL')">收费</el-button>
          <el-button type="primary" plain icon="el-icon-remove-outline" @click="open('REFUND')">退费</el-button>

          <el-button type="primary" plain icon="el-icon-tickets" @click="jump">财务清单</el-button>
          <el-button type="primary" plain icon="el-icon-setting" @click="AllEdit">批量修改</el-button>
          <el-button type="primary" plain icon="el-icon-setting" @click="printInfo">打印</el-button>
        </el-button-group>
      </template>

    </List>
    <!-- 弹框 -->
    <el-dialog title="读者单位编辑" :visible.sync="createModel" width="30%" :close-on-click-modal='false' @close='close'>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">

        <el-form-item label="读者单位名称" prop='name'>
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <!-- <el-form-item label="排序字段" prop='name' >
            <el-input v-model="form.name" ></el-input>
        </el-form-item> -->

        <el-form-item label="备注">
          <el-input v-model="form.note"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="save_mar('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批修改弹框 -->
    <el-dialog title="修改类型" :visible.sync="showAll" width="30%" :close-on-click-modal='false' @close='close'>
      <el-form label-width="120px" class=" m-b-30">
        <el-form-item label="修改类型" prop='name'>

          <el-select filterable v-model="allSelect" clearable @change="editOption = {}" placeholder="请选择批修改类型"
            class="w-100">
            <el-option v-for="items in options" :key="items.type" :label="items.name" :value="items.type"></el-option>
          </el-select>


        </el-form-item>

        <el-form-item label="读者密码" v-if="allSelect == 'password'">
          <el-input v-model="editOption.password"></el-input>
        </el-form-item>

        <el-form-item label="读者类型" v-if="allSelect == 'readerTypeId'">

          <!-- <el-input v-model="editOption.readerTypeId" ></el-input> -->
          <el-select filterable v-model="editOption.readerTypeId"
            @change="changeName('readerTypeName', editOption.readerTypeId, read)" clearable placeholder="请选择"
            class="w-100">
            <el-option v-for="items in read" :key="items.key" :label="items.name" :value="items.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="读者单位" v-if="allSelect == 'readerUnitName'">
          <el-select filterable v-model="editOption.readerUnitName" clearable placeholder="请选择" class="w-100">
            <el-option hidden :key="editOption.readerUnitName" :label="readerUnitName"
              :value="editOption.readerUnitName"></el-option>
            <el-tree :current-node-key="editOption.readerUnitName" class="tree_body" :props="propsSelect"
              :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current lazy>
            </el-tree>
          </el-select>
        </el-form-item>

        <el-form-item label="读者状态" v-if="allSelect == 'status'">

          <el-select filterable v-model="editOption.status" clearable placeholder="请选择" class="w-100">
            <el-option v-for="items in status" :key="items.key" :label="items.name" :value="items.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="截至日期" v-if="allSelect == 'end'">

          <el-date-picker class="w-100" v-model="editOption.end" type="date" value-format="timestamp"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAll = false">取 消</el-button>
        <el-button type="primary" @click="saveAllEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog :title="forms.financeType == 'TOLL' ? '收费' : '退费'" :visible.sync="createModels" width="40%"
      :close-on-click-modal='false' @close='close'>
      <el-form :model="forms" :rules="rules" ref="forms" label-width="120px" class=" m-b-30">

        <div class="display_flex between">
          <el-form-item label="财务类型" prop='financeType' class="w-50">
            <el-select v-model="forms.financeType" class="w-100" clearable disabled placeholder="请选择">
              <el-option v-for="items in financeType" :key="items.key" :label="items.name" :value="items.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="读者证号" prop='number' class="w-50">
            <el-input v-model="forms.number" class="w-100"></el-input>
          </el-form-item>
        </div>

        <div class="display_flex between">


          <el-form-item label="费用金额" prop='fee' class="w-50">
            <el-input v-model="forms.fee" class="w-100"></el-input>
          </el-form-item>

          <el-form-item label="收费类型" prop='chargeType' class="w-50">
            <el-select v-model="forms.chargeType" class="w-100" @change="chargeTypeChange" clearable placeholder="请选择">
              <el-option v-for="items in chargeType" :key="items.key" :label="items.name" :value="items.key">
              </el-option>
            </el-select>
          </el-form-item>


        </div>

        <div class="display_flex between">
          <el-form-item label="财务方式" prop='chargeMethod' class="w-50">
            <el-select v-model="forms.chargeMethod" class="w-100" clearable placeholder="请选择">
              <el-option v-for="items in chargeMethod" :key="items.key" :label="items.name" :value="items.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收费状态" prop='chargeStatus' class="w-50">
            <el-select v-model="forms.chargeStatus" class="w-100" clearable placeholder="请选择">
              <el-option v-for="items in chargeStatus" :key="items.key" :label="items.name" :value="items.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="display_flex between">


          <el-form-item label="文献条码" class="w-50" v-if="forms.chargeType != 'DEPOSIT'">
            <el-input v-model="forms.code"></el-input>
          </el-form-item>

          <!-- <el-form-item label="书目ID" prop='name' >
              <el-input v-model="form.name" ></el-input>
          </el-form-item> -->
        </div>

        <el-form-item label="备注">
          <el-input v-model="forms.note"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <span v-if="forms.financeType == 'TOLL' &&
          (forms.chargeType == 'OVERDUE_FINE' || forms.chargeType == 'DAMAGE_FINE')"
          style="font-size: 14px;color: #E6A23C;margin-right: 15px">* 收费后请主动进行归还图书</span>
        <el-button @click="createModels = false">取 消</el-button>
        <el-button type="primary" @click="save_pay('forms')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog title="读者打印" :visible.sync="Model" width="30%" :close-on-click-modal='false' @close='close'>
      <el-checkbox-group v-model="prantList" :max="3">
        <el-checkbox class="w-25 m-b-10" v-for="item of titleList" :key='item.id' :label="item.id">{{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Model = false">取 消</el-button>
        <el-button type="primary" @click="jumps">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 换证弹框 -->
    <el-dialog title="换证" :visible.sync="newUserModel" width="30%" :close-on-click-modal='false' @close='close'
      style="margin-top: 15vh">
      <div style="display: flex;align-items: center">
        <span style="width: 110px">新读者证号:</span>
        <el-input v-model="newUser" placeholder="请输入新的读者证号"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="newUserModel = false">取 消</el-button>
        <el-button type="primary" @click="newUserSave">确 定</el-button>
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
      propsSelect: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      bus: this.bus(this),
      newUserModel: false,
      createModels: false,
      forms: {
        chargeStatus: 'UNPAID',
        chargeMethod: 'CASH',
        chargeType: 'OVERDUE_FINE'
      },
      newUser: '',
      financeType: [],
      chargeType: [],
      chargeStatus: [],
      chargeMethod: [],
      titleList: [
        { name: '读者证号', id: 'number' },
        { name: '证件类型', id: 'certificateType', type: 'select', options: [] },
        // { name: '历史违章次数', id: 'historicalViolation',placeholder:true, disable: true },

        { name: '读者类型', id: 'readerTypeName', relation: 'readerTypeName', type: 'select', options: [] },
        { name: '读者证件证号', id: 'certificateNumber', max: '18' },
        // { name: '当前违章次数', id: 'currentViolation',placeholder:true, disable: true },

        { name: '状态', id: 'status', type: 'select', options: [] },
        // { name: '单位名称', id: 'readerUnitName',type: 'select', options:[] },
        // { name: '借阅次数', id: 'borrowNumber',placeholder:true, disable: true },

        // { name: '读者姓名', id: 'name' },
        { name: '出生日期', id: 'birthday', type: 'times' },
        // { name: '预约次数', id: 'documentAppointmentNumber',placeholder:true, disable: true },


        { name: '启用日期', id: 'start', type: 'times' },
        { name: '邮箱', id: 'mailbox' },
        // { name: '欠款', id: 'arrears', disable: true,placeholder:true, },


        { name: '截止日期', id: 'end', type: 'times' },
        { name: '性别', id: 'gender', type: 'select', options: [] },
        // { name: '押金', id: 'deposit', disable: true ,placeholder:true,},


        { name: '联系地址', id: 'address' },

        { name: '手机', id: 'phone' },
        // { name: '续借次数', id: 'renewNumber', disable: true ,placeholder:true,},


        // { name: '密码', id: 'password',type:'password' },
        { name: '电话', id: 'telephone' },
        // { name: '读者所属馆', id: 'libraryName' ,disable:true,placeholder:true, },

        { name: '备注', id: 'note' },

        { name: '办证日期', id: 'createTime', type: 'times', disable: true },
      ],
      prantList: ['number', 'certificateType', 'readerTypeName'],
      meta: '',
      showAll: false,
      Model: false,

      allName: '',
      createModel: false,

      allSelect: '',
      status: [],
      editOption: {},
      options: [
        { name: '读者密码', type: 'password' },
        { name: '读者类型', type: 'readerTypeId' },
        { name: '读者单位', type: 'readerUnitName' },
        { name: '读者状态', type: 'status' },
        { name: '截至日期', type: 'end' },

      ],
      unit: [],
      read: [],
      form: {},
      choose: [],
      rules: {
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        note: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],

      },
      unitStatus: [
        { key: 1, name: '正常' },
        { key: 2, name: '已毕业' },
      ],
      // 20240126修改了这里,增加人脸认证查询条件
      faceAuthentications: [
        { name: '全部', value: 'whole' },
        { name: '认证通过', value: 'facekeyTrue' },
        { name: '认证失败', value: 'facekeyFalse' },
        // {name:'无头像',value:'nonephoto'},
      ],
      photoList: [
        { name: '全部', value: 'whole' },
        { name: '有读者照片', value: 'photoTrue' },
        { name: '无读者照片', value: 'photoFalse' },
        // {name:'无头像',value:'nonephoto'},
      ],
      faceValue: null,
      nonephoto: null,//是否有头像
      readerUnitName: ""
    };
  },
  created() {
    this.getUnit()

    this.getReadType()
      .then(res => {
        this.metaList();
      })
    this.metaLists()
  },
  methods: {
    handleNodeClick(node) {
      this.editOption.readerUnitName = node.name
      this.readerUnitName = node.name
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
    // 20240220新增人脸认证查询条件
    handleChange(e) {
      this.faceValue = e
    },
    photoChange(e) {
      this.nonephoto = e
    },
    readerUnitNameChange(e) {
      this.readerUnitName = e
    },
    chargeTypeChange(e) {
      //DEPOSIT借书证押金
      if (e === 'DEPOSIT') {
        this.forms.code = ''
      }
    },
    printInfo() {
      if (this.choose.length < 1) {
        return this.$message.warning('请选择读者');
      }
      this.Model = true
    },
    jumps() {
      if (this.prantList.length != 3) {
        return this.$message.error('请选择3条参数');
      }
      this.$router.push({
        path: '/circulation/reader/index/prantUser',
        query: {
          info: JSON.stringify(this.choose),
          check: JSON.stringify(this.prantList),
          data: JSON.stringify(this.titleList)
        }
      })
    },
    jump() {
      if (this.choose.length != 1) {
        return this.$message.warning('请选择单个读者');
      }
      this.$router.push({
        path: '/circulation/finance/index',
        query: { number: this.choose[0].number }
      })
    },
    open(chargeStatus) {
      if (this.choose.length != 1) {
        return this.$message.error('请选择一位读者');
      }
      this.forms.financeType = chargeStatus
      this.forms.number = this.choose[0].number
      this.createModels = true
    },
    saveAllEdit() {

      this.loading()
      let params = this.editOption
      params.readerList = this.choose
      this.ax.post('/manage/unit/circulation/readerManagement/changeReaderContent', params)
        .then(res => {
          this.sloading()
          this.$message.success('修改成功');
          this.showAll = false
          this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/reader`, res);
        })
        .catch(() => {
          this.sloading()
        });
    },
    changeName(e, id, row) {
      if (e) {
        row.map(it => {
          if (it.key == id) {
            this.editOption[e] = it.name;
          }
        });
      }

    },
    getUnit() {
      this.ax.get('/manage/unit/report/journalReport/readerUnit',
        { params: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1 } })
        .then(res => {
          this.unit = res.content.map(it => {
            return { name: it.name, key: it.name }
          })
        })

    },
    AllEdit() {
      if (this.choose.length == 0) {
        return this.$message.warning('请选择读者');
      }
      this.showAll = true
    },
    async search() {
      let params = {
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
      }
      return await this.ax.get('/manage/unit/catalog/collectionHandling/collectionBatch', { params });
    },
    async save_pay(formName) {
      // this.ruleForm.roles = this.mapList();
      // this.form.permissions = this.pushSelect()
      if (this.forms.chargeType == 'LOST_FINE' && this.forms.financeType == 'TOLL') {
        let bookres = await this.search();
        let arr = bookres.content.filter(item => {
          return item.barCode == this.form.code
        });
        let params = {
          collectionBatchResList: arr,
          collectionBatchUpdateReq: {
            bookStatus: "LOST",
            undefined: ""
          },
          query: { page: 1, platformId: JSON.parse(localStorage.getItem("user")).platform.id, size: 5 }
        }
        this.ax.post('/manage/unit/catalog/collectionHandling/collectionBatch', params).then()
      }
      this.forms.platformId = JSON.parse(localStorage.getItem("user")).platform.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading();
          this.ax
            .post('/manage/unit/circulation/readerManagement/readerFinance', this.forms)
            .then(res => {
              this.sloading();
              this.$message.success('保存成功');
              this.bus.$emit(`flash_/manage/unit/circulation/financeManagement/finance`, res);
              this.createModels = false
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

    // 选择
    getChoose(val) {
      this.choose = val
    },
    getReadType() {
      return new Promise(resolve => {
        this.ax.get('/manage/unit/report/journalReport/readerType',
          { parasm: { size: 999, platformId: JSON.parse(localStorage.getItem("user")).platform.id } })
          .then(res => {
            this.read = res.content.map(it => {
              return { name: it.name, key: it.id }
            })
            // console.log(this.read);
            resolve(this.read)
          })

      })
    },
    getInfo() {
      this.ax.get('/manage/unit/circulation/readerManagement/doCertificateForInsertReader')
        .then(res => {
          this.newUser = res.reader.number
        })
    },
    //查询读者超期记录
    async getOver(e) {
      let params = {
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        page: 0,
        size: 1,
        readerNumber: this.choose[0].number ? this.choose[0].number : e.number
      }
      return await this.ax.get('manage/unit/circulation/circulationManagement/borrowingInformation', { params })
    },
    //查询读者借还记录
    async searchReaders(e) {
      let params = {
        readerNumber: this.choose[0].number ? this.choose[0].number : e.number,
        barCode: '',
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        borrowingInquiry: true
      }
      return await this.ax
        .get('/manage/unit/circulation/circulationManagement/literatureReader', { params })
    },
    //查询是否有未交的罚款
    async searchFine(e) {
      let params = {
        number: this.choose[0].number ? this.choose[0].number : e.number,
        page: 0,
        size: 1,
        chargeStatus: 'UNPAID',
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
      }
      return await this.ax
        .get('/manage/unit/circulation/financeManagement/finance', { params })
    },
    // 换证
    async change() {
      if (this.choose.length != 1) {
        return this.$message.error('请选择一位读者');
      }
      this.getInfo();
      // if(this.choose[0].number==null){
      //   return  this.newUserModel = true;
      // }

      // let res = await this.searchReaders();
      // if (res.borrowingInformationList.length != 0) {
      //   return this.$message.error('当前读者有图书未归还，不能换证！')
      // }
      //
      // let overRes = await this.getOver();
      // if (overRes.content.length != 0) {
      //   return this.$message.error('当前读者有图书已超期，不能换证！')
      // }
      //
      // let fires = await this.searchFine()
      // if (fires.content.length != 0) {
      //   return this.$message.error('当前读者有未支付的罚款，不能换证！')
      // }

      this.newUserModel = true;
    },
    //保存换证读者证号
    newUserSave() {
      this.ax.post('/manage/unit/circulation/readerManagement/changeCertificate', {
        readerId: this.choose[0].id,
        readerNumber: this.newUser
      })
        .then(res => {
          this.sloading()
          this.newUserModel = false;
          this.$message.success('换证成功');
          this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/reader`, res);
        })
    },
    // 办证
    addReader() {
      this.$router.push('/circulation/reader/index/addReader')
    },
    async backCard() {
      if (this.choose.length != 1) {
        return this.$message.error('请选择一位读者');
      }
      let res = await this.searchReaders();
      if (res.borrowingInformationList.length != 0) {
        return this.$message.error('当前读者有图书未归还，不能退证！')
      }

      let overRes = await this.getOver();
      if (overRes.content.length != 0) {
        return this.$message.error('当前读者有图书已超期，不能退证！')
      }

      let fires = await this.searchFine()
      if (fires.content.length != 0) {
        return this.$message.error('当前读者有未支付的罚款，不能退证！')
      }
      this.$confirm('是否退还当前读者证?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading()
        this.choose[0].status = 'LOGOUT'
        this.choose[0].presenceStatus = 0
        this.ax.post('/manage/unit/circulation/readerManagement/reader', this.choose[0])
          .then(res => {
            this.sloading()
            this.$message.success('退证成功');
            this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/reader`, res);
          })

      }).catch(() => {

      });
    },
    // 修改
    editUpdate(e) {
      // e[0].fatherid = e[0].readerUnitName
      // e[0].fatherName = e[0].readerUnitName
      // console.log(e);
      
      this.$router.push({
        path: '/circulation/reader/index/addReader',
        query: { id: e[0].id, readerNumber: e[0].number, readerUnitName: e[0].readerUnitName }
      })
    },
    // 删除
    async deleteUpdate(e) {
      let result = await this.searchReaders(e);
      if (result.borrowingInformationList.length != 0) {
        return this.$message.error('当前读者有图书未归还，不能删除！')
      }
      let overRes = await this.getOver(e);
      if (overRes.content.length != 0) {
        return this.$message.error('当前读者有图书已超期，不能删除！')
      }
      let fires = await this.searchFine(e)
      if (fires.content.length != 0) {
        return this.$message.error('当前读者有未支付的罚款，不能删除！')
      }

      this.loading();
      let ids = e.map(it => {
        return it.id
      }).join(',')
      this.ax
        .delete('/manage/unit/circulation/readerManagement/reader?ids=' + ids)
        .then(res => {
          this.sloading();
          this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/reader`, res);
          this.$message.success('删除成功');
        })
        .catch(res => {
          this.sloading();
        });

    },
    close() {
      this.form = {}
      this.forms = {
        chargeStatus: 'UNPAID',
        chargeMethod: 'CASH',
        chargeType: 'OVERDUE_FINE'
      }
      this.editOption = {}
      this.allSelect = ''
    },

    metaList() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then(res => {
        res.insertable = false

        res.delete = 'DELETE'
        res.subs.map(it => {
          if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId' || it.key == 'readerTypeName') {
            it.displayInList = false;
            it.searchable = false;
          }
          if (it.key == 'name') {
            it.searchable = true;
          }
          if (it.key == 'phone') {
            it.searchable = true;
            it.sort = 16
          }
          if (it.key == 'certificateNumber') {
            it.searchable = true;
            it.sort = 15
          }
          if (it.key == 'certificateType') {
            this.titleList[1].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name, }
            })
            it.sort = 14
          }
          if (it.key == 'status') {
            this.status = it.searchOption
            this.titleList[4].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name }
            })
          }
          if (it.key == 'gender') {
            this.titleList[9].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name }
            })
          }
          if (it.key == 'readerTypeId') {
            it.name = '读者类型'
            it.displayInList = true;
            it.searchable = true;
            it.searchOption = this.read
          }
          if (it.key == 'readerUnitName') {
            it.searchable = false;
          }
          if (it.key == 'unitPresenceStatus') {
            it.name = '读者单位状态'
            it.searchable = true;
            it.searchOption = this.unitStatus
            it.type = 'TEXT'
            it.print = "NONE"
            it.sort = 14
          }
        });
        this.meta = res;
      });
    },
    metaLists() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Finance' } }).then(res => {
        res.insertable = false
        res.delete = 'DELETE'
        res.subs.map(it => {
          if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
            it.displayInList = false;
            it.searchable = false;
          }
          if (it.key == 'financeType') {
            this.financeType = it.searchOption
          }
          if (it.key == 'chargeType') {
            this.chargeType = it.searchOption
          }
          if (it.key == 'chargeStatus') {
            this.chargeStatus = it.searchOption
          }
          if (it.key == 'chargeMethod') {
            this.chargeMethod = it.searchOption
          }
          // if(it.key=='readerTypeName'){
          //      it.displayInList = false;
          //     it.searchable = true;
          // }
        });
        // res.subs = res.subs.concat([{key:'readerTypeNames',name:'单位名称',displayInList:true}])
      });
    }
  }
};
</script>

<style scoped>
.text_center {
  width: 100px;
}

.ground_btn_w {
  width: 630px;
}
</style>
