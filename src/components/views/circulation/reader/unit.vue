<template>
  <div class="container classify">
    <div class="display_flex start">
      <div class="w-20 m-r-10 background_f h-100">
        <div class="tree_header ">
          <div style="position: relative;bottom:8px;font-weight: bold;">单位列表</div>
          <p class="type"></p>
          <div>
            <div style="position: relative;top:1.5px;">
              <i class="el-icon-upload2" @click="clearTree()">收起</i>
            </div>
          </div>
        </div>
        <div>
          <el-tree :style="'height:' + height + 'px'" class="tree_body" :props="props" :load="loadNode"  @node-expand='getNode'
          @node-collapse='getNodes' lazy>
          </el-tree>
        </div>
      </div>
      <div class='w-80 background_f'>
        <div class="container">
          <List :dataUrl="'/manage/unit/circulation/readerManagement/readerUnit'" :disableMeta="true" :tableMeta="meta"
            @edit="editUpdate" ref="list" @delete="deleteUpdate" :chooseBox='true' @create="open" :childId="childId">
            <template slot="addition-actions">
              <el-button type="primary" plain @click="useUp">更新流通记录</el-button>
            </template>
          </List>
          <!-- 弹框 -->
          <el-dialog title="读者单位编辑" :visible.sync="createModel" width="30%" :close-on-click-modal='false'
            @close='close'>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class=" m-b-30">
              <el-form-item label="读者单位名称" prop='name'>
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="选择父级">
                <el-select v-model="form.fatherid" placeholder="请选择" ref="selectUpResId">
                  <el-option hidden :key="form.fatherid" :label="fatherName" :value="form.fatherid">
                  </el-option>
                  <!-- <el-tree :data="tableData" node-key="id" highlight-current :props="defaultProps"
                    @node-click="handleNodeClick" :current-node-key="value" :expand-on-click-node="expandOnClickNode"
                    default-expand-all /> -->

                  <el-tree :current-node-key="form.fatherid" :style="'height:' + height + 'px'" class="tree_body"
                    :props="props" :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current
                    lazy>
                  </el-tree>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.note"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="createModel = false">取 消</el-button>
              <el-button type="primary" @click="save_mar('form')">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from '../../../view/List'

export default {
  components: { List },
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      currentPage: 1,
      dataSize: 0,
      upgradeLists: [],
      pageSize: 20,
      nodeData: {},
      resolve: {},
      height: '',
      meta: '',
      bus: this.bus(this),
      meta: '',
      createModel: false,
      form: {
        fatherid: ""
      },
      rules: {
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        note: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],

      },
      childId: "",
      unitStatus: [
        { key: 1, name: '正常' },
        { key: 2, name: '已毕业' },
      ],
      childIdSelect: "",
      fatherName: ""
    };
  },
  created() {
    this.metaList();
  },
  methods: {
    //展开时调用方法
    getNode(e){
      this.childId = e.id;
    },
    //收起时调用方法
    getNodes(e){
      this.childId = e.childId;
    },
    handleNodeClick(node) {
      this.form.fatherid = node.id
      this.fatherName = node.name
      this.$refs.selectUpResId.blur()
    },
    metaListfather(resolve) {
      this.height = document.documentElement.clientHeight - 230;
      this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
        params: {
          size: 99999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1
        }
      }).then(res => {
        this.dataSize = res.totalElements;
        this.upgradeLists = res.content;
        this.tableData = res.content;
        return resolve(this.upgradeLists);
      })
    },
    metaListchild(searchNodeID, resolve) {
      this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
        params: {
          size: 999999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1, childId: searchNodeID
        }
      }).then(res => {
        return resolve(res.content);
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.nodeData = node;
        this.resolve = resolve;
        this.metaListfather(resolve);
      }
      if (node.level >= 1) {
        var searchNodeID = node ? node.data.id : null;
        if (searchNodeID == null) {
          return resolve([]);
        }
        this.metaListchild(searchNodeID, resolve);
      };
    },
    loadNodeSelect(node, resolve) {
      if (node.level === 0) {
        this.nodeData = node;
        this.resolve = resolve;
        this.childIdSelect = "";
        this.metaListfatherSelect(resolve);
      }
      if (node.level >= 1) {
        var searchNodeID = node ? node.data.id : null;
        if (searchNodeID == null) {
          return resolve([]);
        }
        this.childIdSelect = searchNodeID;
        this.metaListchildSelect(searchNodeID, resolve);
      };
    },
    metaListfatherSelect(resolve) {
      this.height = document.documentElement.clientHeight - 230;
      this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
        params: {
          size: 99999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1
        }
      }).then(res => {
        this.dataSize = res.totalElements;
        this.upgradeLists = res.content;
        this.tableData = res.content;
        return resolve(this.upgradeLists);
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
    clearTree() {// 清空树的方法
      this.nodeData.level = 0;
      this.nodeData.childNodes = [];
      this.loadNode(this.nodeData, this.resolve); //再次执行懒加载的方法
    },
    // 新增保存
    save_mar(formName) {
      // this.ruleForm.roles = this.mapList();
      // this.form.permissions = this.pushSelect()
      if (this.form.fatherid == this.form.id) {
        this.$message({
          message: '请选择正确的父级',
          type: 'warning'
        });
      } else {
        this.form.childId = this.form.fatherid
        this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading();
            this.ax
              .post('/manage/unit/circulation/readerManagement/readerUnit', this.form)
              .then(res => {
                // this.sloading();
                this.$message.success('保存成功');
                // this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/readerUnit`, res);
                this.createModel = false
                location.reload()
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
      }
    },
    // 修改
    editUpdate(e) {
      this.loading();
      this.form = e[0];
      this.createModel = true;
      setTimeout(res => {
        this.sloading();
      }, 500);
    },
    async getReader(e) {
      let params = {
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        readerUnitName: e.name,
        page: 0,
        size: 99999,
      }
      return await this.ax.get('/manage/unit/circulation/readerManagement/reader', { params })
    },
    // 删除
    async deleteUpdate(e) {
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        const reader = await this.getReader(e[i]);
        reader.content.forEach(it => {
          arr.push(it)
        })
      }
      if (arr.length > 0) {
        this.$confirm('当前读者单位下存在读者，是否一并删除读者?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.loading();
          let readerIds = arr.map(it => {
            return it.id
          }).join(',')
          this.ax
            .delete('/manage/unit/circulation/readerManagement/reader?ids=' + readerIds).then(res => {

              let ids = e.map(it => {
                return it.id
              }).join(',')
              this.ax
                .delete('/manage/unit/circulation/readerManagement/readerUnit?ids=' + ids).then(rel => {
                  this.sloading();
                  this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/readerUnit`, res);
                  this.$message.success('删除成功');
                }).catch(error => {
                  this.sloading();
                })
            }).catch(err => {
              this.sloading();
            })
        }).catch(() => {
          this.$message.error('当前读者单位下存在读者,不允许删除读者单位')
        })
      } else {
        this.loading();
        let ids = e.map(it => {
          return it.id
        }).join(',')
        this.ax
          .delete('/manage/unit/circulation/readerManagement/readerUnit?ids=' + ids)
          .then(res => {
            this.sloading();
            this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/readerUnit`, res);
            this.$message.success('删除成功');
          })
          .catch(res => {
            this.sloading();
          });
      }



    },
    useUp() {
      this.$confirm('是否执行更新操作?此操作不可逆', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ax.post('/manage/unit/circulation/readerManagement/changeBorrowingInformation', { platformId: JSON.parse(localStorage.getItem("user")).platform.id })
          .then(res => {
            this.$message.success('操作成功');
          })
      }).catch(() => {

      });


    },
    close() {
      this.form = {}
    },
    open() {
      this.createModel = true
    },
    metaList() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.ReaderUnit' } }).then(res => {
        res.delete = 'DELETE'
        res.subs.map(it => {
          if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId' || it.key == 'childId') {
            it.displayInList = false;
            it.searchable = false;
          }
          if (it.key == 'presenceStatus') {
            it.name = '单位状态'
            it.searchable = true;
            it.displayInList = true;
            it.searchOption = this.unitStatus
            it.type = 'TEXT'
            it.print = "NONE"
            it.sort = 2
          }
        });
        this.meta = res;
      });
    }
  }
};
</script>

<style>
.right-bottom {
  position: absolute;
  bottom: 10%;
  right: 5%;
}

.type {
  border-top: 1px solid #d0d0d5;
}

.tree_header {
  width: 100%;
  padding-top: 1rem;
  height: 4rem;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #DCDCDC;
  box-sizing: border-box;
}

.tree_icon {
  width: 100%;
  padding-top: 1rem;
  height: 1rem;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #DCDCDC;
  box-sizing: border-box;
}

.tree_body {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.classify {
  background: #F9F9F9;
}

.background_f {
  background: #fff;
  overflow: hidden;
}

.color_r {
  color: red;
}
</style>
