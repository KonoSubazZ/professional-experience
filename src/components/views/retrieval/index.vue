<template>
  <div class="container" :style="'height:' + height + 'px'">
    <div class="display_flex between header_title padding_20 m-b-20">
      <div class="">
        图书检索
      </div>
      <div class="display_flex">
        <!-- <div @click="save('code')" class="cursor text_center m-r-20">
            <img src="../../../assets/img/search.png" class="btn_img" />
            <div class="f-s-14">检索</div>
        </div> -->
        <el-button type="primary" icon="el-icon-search" @click="save('code')">检索</el-button>
      </div>
    </div>
    <div class="padding_20" @keyup="monitor">
      <el-form :model="code" :rules="rules" ref="code" class=" m-b-30">

        <div class="display_flex between m-b-20 w-100">


          <div class="display_flex w-30">

            <div class="labels ">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link cursor ">
                  {{ chooseName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, i) of chooseList" :key='i' :command='item'>{{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <el-input v-model="form[codes]" clearable placeholder="请输入内容" class="w-70"></el-input>
          </div>

          <div class="display_flex w-30">
            <div class="label">馆藏地址</div>
            <el-select v-model="form.collectionPlaceId" clearable placeholder="请选择" class="w-90">
              <el-option v-for="item in collections" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>

          <div class="display_flex w-30">
            <div class="label">批次号</div>
            <!-- <el-input v-model="form.baseId" placeholder="请输入内容" class="w-70"></el-input> -->
            <el-select v-model="form.batchId" clearable placeholder="请选择" class="w-90">
              <el-option v-for="item in option" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>

          </div>
        </div>

        <div class="display_flex m-b-20">
          <div class="label">主题词</div>
          <el-input v-model="form.keywords" clearable placeholder="请输入内容" class="w-90"></el-input>
        </div>

        <div class="display_flex m-b-20">
          <div class="label">文献条码</div>
          <el-input v-model="form.barCode" clearable placeholder="请输入内容" class="w-90"></el-input>
        </div>

        <div class="display_flex">
          <div class="label m-b-20">文献条码范围</div>
          <div class="display_flex w-90">
            <el-input v-model="form.startCode" clearable placeholder="请输入内容" class="w-40 m-b-20"></el-input>
            <div class="padding_20 w-10 m-b-20">————</div>
            <el-form-item class="w-50">
              <el-input v-model="form.endCode" clearable placeholder="请输入内容" class="w-100"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="display_flex   m-b-20">
          <div class="label">入库时间范围</div>
          <div class="w-90 display_flex">
            <el-date-picker clearable v-model="form.startWarehousingTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
              class="w-40" :picker-options="pickerOptionStart" placeholder="选择日期时间">
            </el-date-picker>
            <div class="padding_20 w-10">————</div>
            <el-date-picker clearable v-model="form.endWarehousingTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
              class="w-50" :picker-options="pickerOptionEnd" placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>

        <div class="display_flex  m-b-20">
          <div class="label">出版时间</div>
          <el-input v-model="form.publicationDate" clearable placeholder="请输入内容" class="w-90"></el-input>
        </div>

        <div class="display_flex m-b-20">
          <div class="label">文献状态</div>
          <el-select v-model="form.bookStatus" clearable placeholder="请选择" class="w-90">
            <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>

      </el-form>
    </div>
    <div class="padding_20 searchFor m-b-20" v-if="tableData.content.length > 0">
      搜索结果
    </div>
    <div class="m-b-20" v-if="tableData.content.length > 0">
      <div class="padding_20 m-b-80">
        <el-table class="m-b-20" ref="multipleTable" :data="tableData.content" tooltip-effect="dark" style="width: 100%">
          <el-table-column align="center" width="100" type="index" label="序列号">
          </el-table-column>
          <el-table-column prop="positiveTitle" label="正题名">
          </el-table-column>

          <el-table-column prop="displayIsbn" label="ISBN">
          </el-table-column>

          <el-table-column prop="publisher" label="出版社">
          </el-table-column>

          <el-table-column prop="publicationDate" label="出版时间">
          </el-table-column>

          <el-table-column prop="callNumber" label="索书号">
          </el-table-column>

          <el-table-column prop="pageNumber" label="页码">
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size @click="editdata(scope.row)">编辑</el-button>
              <el-button type="text" size @click="updata(scope.row)">详情</el-button>

            </template>
          </el-table-column>


        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum"
          :page-sizes="[5, 10, 20, 50]" :page-size="form.pageSize" layout=" prev, pager, next, jumper,total, sizes"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import list from '../../view/List'

export default {
  components: {
    list
  },
  data() {
    var validateCode = (rule, value, callback) => {
      if (this.code.startCode == '' && value === '') {
        callback();
      } else if (value === '') {
        callback(new Error('请输入'));
      } else {
        let num1 = this.code.startCode.replace(/[^0-9]/ig, "");
        let num2 = this.code.endCode.replace(/[^0-9]/ig, "");
        let str1 = this.code.startCode.replace(/[^a-zA-Z]/g, '')
        // console.log(this.code.startCode.length)
        let str2 = this.code.endCode.replace(/[^a-zA-Z]/g, '')
        // console.log(this.code.endCode.length)

        if (this.code.startCode.length != this.code.endCode.length) {
          callback(new Error('请输入正确的条码'));
        } else {

          if (num1 >= num2) {
            callback(new Error('请输入正确的范围'));
          } else if (str1 != str2) {
            callback(new Error('请输入正确的前缀'));
          } else {
            callback();
          }
        }

      }
    };
    return {
      height: '',
      loadings: false,
      total: 0,
      form: {
        endCode: '',
        page: 0,
        size: 10
      },
      chooseList: [
        { name: 'ISBN', id: 'isbnFiled', code: 'isbn' },

        { name: '正题名', id: 'positiveTitleFiled', code: 'positiveTitle' },

        { name: '第一责任者', id: 'firstResponsibleFiled', code: 'firstResponsible' },

        { name: '丛书名', id: 'keywordsFiled', code: 'seriesTitle' },

        { name: '分类号', id: 'classificationNumberFiled', code: 'classificationNumber' },

      ],
      chooseName: 'ISBN',
      codes: 'isbn',
      rules: {
        endCode: [
          { validator: validateCode, trigger: 'blur' }
        ],
      },
      //    批次
      option: [],
      //    状态选择
      options: [],
      //    地址选择
      collections: [],
      //    范围
      code: {
        startCode: '',
        endCode: ''
      },
      meta: '',
      tableData: {
        content: []
      },
      pickerOptionStart: {
        disabledDate: time => {
          let endDateVal = this.form.endWarehousingTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionEnd: {
        disabledDate: time => {
          let beginDateVal = this.form.startWarehousingTime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 860000
            )
          }
        }
      }
    };
  },
  created() {
    this.getCollection()
    this.getType()
    this.getBitch()
    this.calcTableHeight();
    window.addEventListener('resize', () => {
      this.calcTableHeight();
    });
  },
  methods: {
    calcTableHeight(val) {
      setTimeout(res => {

        this.height = document.documentElement.clientHeight - 170;

      }, 100)
    },
    // 监听
    monitor() {
      document.onkeydown = (e) => {

        let key = window.event.keyCode;
        // console.log(e)
        // f
        if (key == 13) {
          this.save('code')
        }

      };
    },
    // 获取批次
    getBitch() {
      this.ax.get('/manage/unit/general/batch', {
        params: {
          type: 'CATALOG',
          platformId: JSON.parse(localStorage.getItem("user")).platform.id
        }
      })
        .then(res => {
          this.option = res.content;
        })
    },
    // 改变大小
    handleSizeChange(val) {
      this.form.size = val
      this.save('code')
    },
    // 页面改版
    handleCurrentChange(val) {
      this.form.page = val - 1
      this.save('code')
    },
    //编辑
    editdata(val) {
      let bookBase = val
      this.$router.push({
        path: '/catalogue/literature/library/libraryBookInfo',
        query: { infos: JSON.stringify(bookBase) }
      })
    },
    // 查看详情
    updata(row) {
      // console.log(row)
      this.$router.push({
        path: 'detail',
        query: { id: row.id }
      })
    },
    // 改变查询条件
    handleCommand(command) {
      this.chooseName = command.name
      this.codes = command.code
    },
    // 获取馆藏地址
    getCollection() {
      this.ax.get('/manage/unit/general/collectionPlace', {
        params: {
          type: 'LITERATURE',
          size: 999,
          platformId: JSON.parse(localStorage.getItem("user")).platform.id
        }
      })
        .then(res => {

          this.collections = res.content
        })
    },
    // 获取meta类型
    getType() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Book' } })
        .then(res => {
          // console.log(res)
          res.subs.map(it => {
            if (it.key == 'bookStatus') {
              this.options = it.searchOption
            }
          })
        })
    },
    // 搜索
    save(formName) {
      this.loading();
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sloading();
          this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
          console.log(this.form, 'this.formthis.formthis.form');
          this.ax
            .get('/manage/unit/catalog/bookSearch/bookBase', { params: this.form })
            .then(res => {
              this.sloading();
              if (res.content.length == 0) {
                return this.$message.error('没有检索到书本信息');
              }
              this.total = res.page.total
              res.content.map(it => {
                let str
                if (it.classificationNumber) {
                  str = it.classificationNumber
                }
                if (it.speciesNumber) {
                  str += '/' + it.speciesNumber
                }
                if (it.auxiliaryNumber) {
                  str += '/' + it.auxiliaryNumber
                }
                // 修改了这里
                if (!it.allTitle) {
                  it.allTitle = it.positiveTitle;
                  if (it.subTitle) {
                    it.positiveTitle += ':' + it.subTitle;
                  }
                  if (it.sectionTitle) {
                    it.positiveTitle += '.' + it.sectionTitle;
                  }
                  if (it.sectionNumber) {
                    it.positiveTitle += '.' + it.sectionNumber;
                  }
                }
                it.callNumber = str

              })
              this.tableData = res
            })
            .catch(err => {
              this.sloading();
              if (err.msg === '暂无数据') {
                this.form = {
                  endCode: '',
                  page: 0,
                  size: 10
                };
                this.tableData.content = [];
              }
            });
        } else {
          this.sloading();
          this.$message.error('请根据提示输入');
          return false;
        }
      });
    },

  }
};
</script>

<style scoped>
.label {
  width: 140px;
  margin-right: 20px;
  font-size: 0.88rem;
  color: rgba(32, 32, 32, 1);
  font-weight: 400;
  text-align: right;
  display: inline-block;
  text-align: right;
}

.labels {
  width: 140px;
  margin-right: 25px;
  font-size: 0.88rem;
  color: rgba(32, 32, 32, 1);
  font-weight: 400;
  text-align: right;
  display: inline-block;
  text-align: right;
}

.searchFor {
  height: 1.38rem;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.38rem;
  color: rgba(51, 51, 51, 1);
}
</style>
