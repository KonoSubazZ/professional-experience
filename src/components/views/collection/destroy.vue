<template>
  <div class="container">
    <div class="padding_20 padding_t_20">

      <div class="w-100 display_flex start m-b-10">

        <div class="display_flex start w-80">
          <div class="display_flex start w-40">
            <div class="m-r-10">
              <el-radio v-model="able" label="多个条码" class="p-t-20"></el-radio>
              <br>
              <div class="numberes">{{number}}行</div>
            </div>
            <div class="w-80">
              <el-input type="textarea" class="textarea w-80" placeholder="请输入内容并以回车分割" @input="getCount" :disabled='able==1?true:false'  :rows="5"  v-model="codes"></el-input>
            </div>
          </div>
          <div class="display_flex start w-50 m-r-10">
            <div class="m-r-10">
              <el-radio v-model="able" :label="1" class="m-b-40" >单个条码</el-radio>
              <div class="label m-l-10">是否注销确认</div>
            </div>

            <div class="w-80">
              <div class="display_flex between m-b-25">
                <el-input
                    id='getFocus'
                    placeholder="请输入内容"
                    :disabled='able==2 && able !=""'
                    @keyup.enter.native="destroy"
                    v-model="code">
                </el-input>
              </div>
              <div class="display_flex between">
                <el-select v-model="isTrue" placeholder="请选择" class="w-100">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>

              </div>
            </div>
          </div>
          <div class="">
            <el-button type="primary"  @click="destroy" >注销</el-button>
          </div>
        </div>


        <div class="display_flex end w-20">
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
          </div>    -->
        </div>

      </div>
      <!-- 列表 -->
      <div>
        <List
            :data='tableData'
            :isHeaderHeigt='150'
            :isSort='true'
            :disableTableAction='true'
            :disableMeta='true'
            :tableMeta='meta'
            @search="selected"
        ></List>
      </div>

    </div>


    <!-- 弹框 -->
    <el-dialog title="导入条码" :visible.sync="model" width="30%" :close-on-click-modal='false'  @close='close'>
      <up-load @getInfo='getText' :show="model"></up-load>
    </el-dialog>

    <!-- 确认弹框 -->
    <el-dialog
        title="图书注销"
        :visible.sync="showModel"
        width="80%"
        :close-on-click-modal="false"
        @close="close">

      <table-list :tableList='tableDataList'></table-list>

      <span slot="footer" class="dialog-footer">
                <el-button @click="showModel = false">取 消</el-button>
                <el-button type="primary" @click="nowDo">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import upLoad from '../textUp'

import tableList from './page/table'

export default {
  components:{List,upLoad,tableList},
  data() {
    return {bus: this.bus(this),
      showModel:false,
      tableDataList:{},
      meta:'',
      able:1,
      activeName:'DOING',
      errorCode:'',
      form:{},
      code:'', //单个
      codes:'', //数组
      options:[
        {value:true,label:'是'},
        {value:false,label:'否'}
      ],
      number:0,
      page:1,
      size:20,
      isTrue:false,//是否盘点
      model:false,
      tableData:{
        content:[],
        number:0,
        size:20,
        totalElements:0
      }

    };
  },
  created() {
    this.getMeta()
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
        this.destroy()
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
                  h('span', null, '错误，是否继续注销'),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                // console.log(code)
                this.codes = barCodes.filter(it=>{
                  return it!=''
                }).join('\n')
                this.destroy()
              }).catch(() => {

              });
            }else{
              // debugger
              this.codes = barCodes.filter(it=>{
                return it!=''
              }).join('\n')
              this.destroy()
            }


          })
    },
    nowDo(){

      this.loading();
      if(this.radio=='more'){
        let str = JSON.stringify(this.codes)
        this.form.codes = JSON.parse(str).split(/[\r\n]/g)
        this.form.codes =  this.form.codes.filter((it,i)=>{
          return it!=''
        })
      }else{
        this.form.codes = [this.code]
      }
      this.ax.post('/manage/unit/catalog/collectionHandling/bookLogout',this.form)
          .then(res=>{
            // // console.log(res)
            this.sloading();
            this.page = 0
            this.tableData.content =res.concat(this.tableData.content)
            this.showModel = false
            this.$message.success('注销成功');
            this.selected()
            let input = document.getElementById('getFocus')
            input.focus()
            input.select()
          }).catch(res=>{
        this.sloading();
      })

    },
    //   开始销毁
    destroy(){

      this.form.platformId=JSON.parse(localStorage.getItem("user")).platform.id
      if (this.isTrue && !this.codes) {

        let params={
          barCode:this.code,
          platformId:JSON.parse(localStorage.getItem("user")).platform.id
        }
        this.ax.get('/manage/unit/catalog/collectionHandling/bookByBarCode',{params})
            .then(res=>{
              // console.log(res)
              this.showModel = true
              this.tableDataList = res
            })



      }
      else if(this.isTrue && this.codes){
        this.$confirm('是否确认注销?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.able==2 || this.codes){
            this.form.codes = this.codes.split(/[\r\n]/g);
            this.form.codes =  this.form.codes.filter((it,i)=>{
              return it!=''
            })
          }else{
            this.form.codes = [this.code]
          }
          this.ax.post('/manage/unit/catalog/collectionHandling/bookLogout',this.form)
              .then(res=>{
                // console.log(this.tableData.content)
                this.sloading();
                // let arr =  this.tableData.content
                this.page = 0

                this.tableData.content = res.concat(this.tableData.content)

                // console.log(this.tableData.content)
                this.$message.success('注销成功');
                this.selected()
                let input = document.getElementById('getFocus')
                input.focus()
                input.select()
              }).catch(res=>{
            this.sloading();
          })
        }).catch(() => {

        });
      }else {
        this.loading();
        if(this.able==2 || this.codes){
          this.form.codes = this.codes.split(/[\r\n]/g);
          this.form.codes =  this.form.codes.filter((it,i)=>{
            return it!=''
          })
        }else{
          this.form.codes = [this.code]
        }
        this.ax.post('/manage/unit/catalog/collectionHandling/bookLogout',this.form)
            .then(res=>{
              // console.log(this.tableData.content)
              this.sloading();
              // let arr =  this.tableData.content
              this.page = 0
              this.tableData.content = res.concat(this.tableData.content)

              // console.log(this.tableData.content)
              this.$message.success('注销成功');
              this.selected()
              let input = document.getElementById('getFocus')
              input.focus()
              input.select()
            }).catch(res=>{
          this.sloading();
        })
      }



    },
    close(){
      this.batch={}
    },
    open(){
      this.model=true
    },
    // 获取meta
    getMeta(){
      this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.Book'}})
          .then(res=>{
            // console.log(res)
            res.insertable=false
            res.edit='NONE'
            res.delete='NONE'
            res.subs=[
              {
                clickable: false,
                displayInList: true,
                key: "positiveTitle",
                name: "题名",
                sort: 0,
              },
              {
                clickable: false,
                displayInList: true,
                key: "isbn",
                name: "ISBN",
                sort: 1,

              },
              {
                clickable: false,
                displayInList: true,
                key: "firstResponsible",
                name: "第一责任者",
                sort: 2,

              },

              {
                clickable: false,
                displayInList: true,
                key: "barCode",
                name: "文献条码",
                sort: 3,
              },
              {
                clickable: false,
                displayInList: true,
                key: "callNumber",
                name: "索书号",
                sort: 4,
              },
              {
                clickable: false,
                displayInList: true,
                key: "publicationDate",
                name: "出版日期",
                sort: 5,
              },
              {
                clickable: false,
                displayInList: true,
                key: "collectionPlaceName",
                name: "馆藏地",
                sort: 6,
              },
              {
                clickable: false,
                displayInList: true,
                key: "price",
                name: "价格",
                sort: 7,
              },
              {
                clickable: false,
                displayInList: true,
                key: "bookStatus",
                name: "状态",
                searchOption:[
                  {
                    key:'CULLING',
                    name:'已注销'
                  },
                  {
                    key:'LEND',
                    name:'已盘点'
                  }
                ],
                sort: 8,
              },
            ]


            this.meta = res
          })
    },
  }
};
</script>

<style scoped>
.label{
  height:1.25rem;
  font-size:0.88rem;
  font-weight:normal;
  line-height:1.25rem;
  color:#333333;
}

.padding_t_20{
  padding-top: 20px;
}
</style>
