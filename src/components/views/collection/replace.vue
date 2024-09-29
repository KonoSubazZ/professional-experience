<template>
  <div class="container">
    <div class="padding_20">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单个替换" name="DOING">
          <!-- 单个条码 -->
          <div class="display_flex p-t-20">

            <div class="display_flex  w-20 ">
              <div class="label w-20 ">原条码</div>
              <el-input  class="w-70" id="getFocus" v-model="oldCode"></el-input>
            </div>

            <div class="display_flex  w-20 ">
              <div class="label w-20 ">新条码</div>
              <el-input  class="w-70" v-model="newCode" @keyup.enter.native="deleteCode"></el-input>
            </div>

            <div class="display_flex ">
              <div class="label w-40">是否替换确认</div>
              <el-select
                  v-model="isTrue"
                  clearable
                  class="m-r-20"
              >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
              </el-select>


            </div>
            <el-button type="primary" @click="deleteCode">替换</el-button>


          </div>
          <!-- 列表 -->

        </el-tab-pane>
        <el-tab-pane label="批量替换" name="LIST">
          <div class="display_flex start w-100 ">

            <div class="display_flex start w-100">
              <div class="display_flex start w-30">
                <div class="m-r-10">
                  <el-radio v-model="able" :label="2" class="p-t-20">多个条码</el-radio>
                  <br>
                  <div class="numberes">{{number}}行</div>
                </div>
                <div class="w-80">
                  <el-input type="textarea" class="textarea w-80" placeholder="请输入内容并以回车分割" @input="getCount" :disabled='able==1?true:false'  :rows="5"  v-model="codes"></el-input>
                </div>
              </div>
              <div class="display_flex start w-50 m-r-20">
                <div class="m-r-10">
                  <el-radio v-model="able" :label="1" class=" m-b-40">原条码范围</el-radio>
                  <div class="label m-l-10">替换条码范围</div>
                </div>

                <div class="w-80">
                  <div class="display_flex between m-b-25">
                    <el-input class="w-40 " v-model="startCode"  :disabled='able==2?true:false' placeholder='起始文献条码范围'></el-input>
                    <div class="through "></div>
                    <el-input class="w-40" v-model="endCode"  :disabled='able==2?true:false' placeholder='终止文献条码范围'></el-input>
                  </div>
                  <div class="display_flex between">

                    <el-input class="w-40" v-model="newStartCode"  placeholder='起始文献条码范围'></el-input>
                    <div class="through"></div>
                    <el-input class="w-40" v-model="newEndCode"  placeholder='终止文献条码范围'></el-input>
                  </div>
                </div>
              </div>
              <div class="display_flex  w-30 ">
                <div class="label w-40">是否替换确认</div>
                <el-select
                    v-model="isTrue"
                    clearable
                    class="m-r-20"
                >
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="w-20">
                <el-button type="primary"  @click="deleteCode">替换</el-button>
              </div>
            </div>



            <div class="display_flex end w-25">
              <el-button-group>
                <el-button type="primary" plain @click="open" icon="el-icon-upload2">导入文件</el-button>
                <el-button type="warning" @click="showError" plain icon="el-icon-warning-outline">查看错误条码</el-button>
              </el-button-group>
              <!-- <div @click="open" class="text_center cursor m-r-20">
                  <img src="../../../assets/img/import.png" class="btn_img" />
                  <div class="f-s-14">导入文件</div>
              </div>
               <div @click="showError" class="text_center cursor ">
                  <img src="../../../assets/img/back.png" class="btn_img" />
                  <div class="f-s-14">查看错误条码</div>
              </div>  -->
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
      <div >
        <List
            :data="tableData"
            :isSort="true"
            :isHeaderHeigt='120'
            :disableTableAction="true"
            :disableMeta="true"
            :tableMeta="meta"
            @search="selected"
        ></List>
      </div>
    </div>
    <!-- model -->
    <el-dialog title="导入条码" :visible.sync="model" width="30%" :close-on-click-modal='false'  @close='close'>
      <up-load @getInfo='getText' :show="model"></up-load>
    </el-dialog>

    <!-- 确认弹框 -->
    <el-dialog
        title="图书替换"
        :visible.sync="showModel"
        width="80%"
        :close-on-click-modal="false"
        @close="close">

      <table-list :tableList='tableDataList' :newCode='newCode'></table-list>

      <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="nowDo">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import upLoad from '../textUp';
import tableList from './page/table'

export default {
  components: { List, upLoad ,tableList},
  data() {
    return {bus: this.bus(this),
      able:1,
      showModel:false,
      tableDataList:{},
      errorCode:'',
      meta: '',
      activeName: 'DOING',
      form: {},
      oldCode: '', //单个
      newCode:'',
      codes: '', //数组
      options: [
        { value: true, name: '是' },
        { value: false, name: '否' }
      ],
      batches: [],
      isTrue: false, //是否
      url: '',
      rules: {},
      tableData: {
        content: [],
        number:0,
        size:20,
        totalElements:0
      },
      tableDatas:{
        content: []
      },
      // 弹框
      model:false,
      // 起始
      startCode:'',
      endCode:'',
      newStartCode:'',
      number:0,
      page:1,
      size:20,
      newEndCode:''
    };
  },
  created() {
    this.getMeta();
  },
  methods: {
    selected(e){
      // console.log(this.page)
      if(e){
        this.page=e.page
        this.size=e.size
      }else{
        this.page=this.page+1
      }
      this.tableData = {
        content:this.tableData.content.slice( ( this.page-1) * this.size, this.page * this.size ),
        number:this.page,
        size:this.size,
        totalElements:this.tableData.content.length
      }
      // console.log(this.backList.slice( ( this.page-1) * this.size, this.page * this.size ))
      // console.log( this.tableData)
    },
    getCount(e){
      let number =  e.split('\n')
      this.number = number.length
    },
    // 获取getText
    getText(val) {
      // console.log(val);
      this.radio='more'
      if(val.cover){
        val.data = val.data.split(/[\r\n]/g);
        this.getError(val.data)
      }else{
        this.codes = val.data;
        this.deleteCode()
      }
      // this.model=false
      // this.codes = val;
    },
    showError(){
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '本次操作错误条码： '),
          h('i', { style: 'color: red' }, this.errorCode),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {

      }).catch(() => {

      });

    },
    getError(barCodes){
      let params={
        barCodes,
        platformId :JSON.parse(localStorage.getItem("user")).platform.id
      }
      this.ax.post('/manage/unit/catalog/collectionHandling/bookIs',params)
          .then(res=>{
            if(res.length>0){
              let code = res.join('\n')
              this.errorCode += code
              const h = this.$createElement;
              this.$msgbox({
                title: '提示',
                message: h('p', null, [
                  h('span', null, '条码 '),
                  h('i', { style: 'color: red' }, code),
                  h('span', null, '错误，是否继续盘点'),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                // console.log(code)
                this.codes = barCodes.filter(it=>{
                  return it!=''
                }).join('\n')
                this.deleteCode()
              }).catch(() => {

              });
            }else{
              this.codes = barCodes.filter(it=>{
                return it!=''
              }).join('\n')
              this.deleteCode()
            }

          })
    },
    nowDo(){

      this.loading()
      let params={
        newCode:[this.newCode],
        oldCode:[this.oldCode],
        platformId:JSON.parse(localStorage.getItem("user")).platform.id
      }
      this.ax.post('/manage/unit/catalog/collectionHandling/barCodeReplace', params).then(res => {
        // console.log(res);
        res.map(it=>{
          it.bookStatus = 1
        })
        this.page=0
        let arr = this.tableData.content;
        this.tableData.content = arr.concat(res);
        this.selected()
        this.$message.success('替换成功');
        let input = document.getElementById('getFocus')
        input.focus()
        input.select()
        this.sloading()
        this.showModel = false
        this.form={}
      }).catch(res=>{
        this.sloading()
      })

    },
    //   开始替换
    deleteCode() {

      if(this.activeName =='LIST' && !this.isTrue){
        // console.log(this.codes !='')
        if(this.codes !=''){

          //    this.form.oldCode = this.codes.split(/[\n,]/g);
          this.form.oldCode = this.codes.split(/[\r\n]/g);
          this.form.oldCode =  this.form.oldCode.filter((it,i)=>{
            return it!=''
          })

          this.form.startNewBarcode = this.newStartCode

          this.form.endNewBarcode = this.newEndCode
          this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
        }else{
          this.form.startNewBarcode = this.newStartCode

          this.form.endNewBarcode = this.newEndCode

          this.form.startOldBarcode = this.startCode

          this.form.endOldBarcode =this.endCode
          this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
        }

        this.ax.post('/manage/unit/catalog/collectionHandling/barCodeReplace',this.form)
            .then(res=>{
              // console.log(res)
              let arr = this.tableDatas.content;
              if(arr==undefined){
                arr=[]
              }
              res.map(it=>{
                it.bookStatus = 1
              })
              this.page=0
              // this.tableData.content = arr.concat(res);
              this.tableData = {
                content:arr.concat(res)
              }
              // console.log( this.tableData.content)
              this.form={}
              this.$message.success('替换成功');
              this.selected()
              this.sloading()
              let input = document.getElementById('getFocus')
              input.focus()
              input.select()
            })

      }
      else if(this.activeName =='LIST'){
        this.$confirm('是否确认替换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          if(this.codes !=''){

            //    this.form.oldCode = this.codes.split(/[\n,]/g);
            this.form.oldCode = this.codes.split(/[\r\n]/g);
            this.form.oldCode =  this.form.oldCode.filter((it,i)=>{
              return it!=''
            })

            this.form.startNewBarcode = this.newStartCode

            this.form.endNewBarcode = this.newEndCode
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
          }else{
            this.form.startNewBarcode = this.newStartCode

            this.form.endNewBarcode = this.newEndCode

            this.form.startOldBarcode = this.startCode

            this.form.endOldBarcode =this.endCode
            this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
          }

          this.ax.post('/manage/unit/catalog/collectionHandling/barCodeReplace',this.form)
              .then(res=>{
                // console.log(res)
                let arr = this.tableDatas.content;
                if(arr==undefined){
                  arr=[]
                }
                res.map(it=>{
                  it.bookStatus = 1
                })
                this.page=0
                // this.tableData.content = arr.concat(res);
                this.tableData = {
                  content:arr.concat(res)
                }
                // console.log( this.tableData.content)
                this.form={}
                this.$message.success('替换成功');
                this.selected()
                this.sloading()
                let input = document.getElementById('getFocus')
                input.focus()
                input.select()
              })



        }).catch(() => {

        });
      }
      else{

        if(this.isTrue){

          let params={
            barCode:this.oldCode,
            platformId:JSON.parse(localStorage.getItem("user")).platform.id
          }
          this.ax.get('/manage/unit/catalog/collectionHandling/bookByBarCode',{params})
              .then(res=>{
                // console.log(res)

                this.showModel = true
                this.tableDataList = res
              })

        }else{
          this.loading()
          let params={
            newCode:[this.newCode],
            oldCode:[this.oldCode],
            platformId:JSON.parse(localStorage.getItem("user")).platform.id
          }
          this.ax.post('/manage/unit/catalog/collectionHandling/barCodeReplace', params).then(res => {
            // console.log(res);
            res.map(it=>{
              it.bookStatus = 1
            })
            let arr = this.tableData.content;
            if(arr==undefined){
              arr=[]
            }
            this.page=0
            // this.tableData.content = arr.concat(res);
            this.tableData = {
              content:arr.concat(res)
            }
            this.$message.success('替换成功');
            this.selected()
            this.sloading()
          }).catch(res=>{
            this.sloading()
          })
        }

      }



    },
    open(){
      if(this.newStartCode=='' || this.newEndCode==''){
        return this.$message.error('请输入替换范围');
      }
      this.model= true
    },
    close(){},

    getCode(a,b){


      // // console.log(this.startCode.toString())
      let num1 = a.toString().replace(/[^0-9]/ig,"");
      let num2 = b.toString().replace(/[^0-9]/ig,"");
      let str1 = a.replace(/[^a-zA-Z]/g,'')
      let str2 = b.replace(/[^a-zA-Z]/g,'')
      let lengthMax = num1.length
      // console.log(num1)
      // console.log(num2)
      // return
      if(str1 != str2 && str1==''){
        return this.$message.error('请输入正确的前缀');
      }
      if(num1.length != num2.length || num1>=num2){
        return this.$message.error('请输入正确的范围并且长度相等');
      }

      let arr=[]
      for(let i=0;i<=num2-num1;i++){
        let index = num1*1+i*1
        index = this.PrefixZero(index,lengthMax)
        arr.push(index)
      }
      // console.log(arr)
      return  { str:str1, num: arr }
      // this.codes = arr.join(',')
      // // console.log(this.codes)
    },
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    // 获取meta
    getMeta() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } }).then(res => {
        // console.log(res);
        res.insertable = false;
        res.edit = 'NONE';
        res.delete = 'NONE';
        res.subs = [
          {
            clickable: false,
            displayInList: true,
            key: 'positiveTitle',
            name: '题名',
            sort: 0
          },
          {
            clickable: false,
            displayInList: true,
            key: 'isbn',
            name: 'ISBN',
            sort: 1
          },
          {
            clickable: false,
            displayInList: true,
            key: 'firstResponsible',
            name: '第一责任者',
            sort: 2
          },
          {
            clickable: false,
            displayInList: true,
            key: 'oldBarCode',
            name: '原文献条码',
            sort: 3
          },

          {
            clickable: false,
            displayInList: true,
            key: 'barCode',
            name: '新文献条码',
            sort: 3
          },
          {
            clickable: false,
            displayInList: true,
            key: 'callNumber',
            name: '索书号',
            sort: 4
          },
          {
            clickable: false,
            displayInList: true,
            key: 'publicationDate',
            name: '出版日期',
            sort: 5
          },
          {
            clickable: false,
            displayInList: true,
            key: 'collectionPlaceName',
            name: '馆藏地',
            sort: 6
          },
          {
            clickable: false,
            displayInList: true,
            key: 'price',
            name: '价格',
            sort: 7
          },
          {
            clickable: false,
            displayInList: true,
            key: 'bookStatus',
            name: '状态',
            searchOption: [
              {
                key: '1',
                name: '替换成功',
                color: '#51C549'
              }

            ],
            sort: 8
          }
        ];

        this.meta = res;
      });
    }
  }
};
</script>

<style scoped>
.label {
  height: 1.25rem;
  font-size: 0.88rem;
  font-weight: normal;
  line-height: 1.25rem;
  color: #333333;
}
.through{
  border-bottom: 1px solid #dddddd;
  padding: 0 20px;
}

</style>
