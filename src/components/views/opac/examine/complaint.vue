<template>
  <div>
    <List :dataUrl="'/applets/complaintCenter/getComplaintCenterList'" :disableMeta='true' :tableMeta='meta'
      :isHeaderHeigt='30' ref="list" @selected='selected'>
      <template slot="addition-table-actions" slot-scope="scope">
        <el-button type="text" class="m-r-10 color_dan" @click="handleComment(scope.item.row, 2)">删除</el-button>
        <el-button type="text" @click="editData(scope.item.row, 2)">编辑</el-button>
      </template>
    </List>
    <el-dialog title="编辑投诉" :visible.sync="dialogFormVisible">
      <el-form label-position="right" label-width="80px" :model="formLabelAlign">
        <el-form-item label="读者证号">
          <el-input v-model="formLabelAlign.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="投诉场景">
          <el-input v-model="formLabelAlign.complaintScenario" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="投诉原因">
          <el-input v-model="formLabelAlign.complaintType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="图书条码号">
          <el-input v-model="formLabelAlign.barCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="正题名">
          <el-input v-model="formLabelAlign.positiveTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否处理">
          <el-switch v-model="alreadyPending"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import List from '../../../view/List'

export default {
  components: { List },
  data() {
    return {
      meta: '',
      dialogFormVisible: false,
      formLabelAlign: {
      },
      alreadyPending: false,
      updateID: ""
    };
  },
  created() {
    this.getTitle();
  },
  methods: {
    handleComment(scope) {
      this.ax.delete('/applets/complaintCenter/deleteCenter?id=' + scope.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      });
      this.bus.$emit(`flash_/applets/complaintCenter/getComplaintCenterList`);
    },
    editData(scope) {
      this.formLabelAlign = scope
      this.updateID = scope.id
      if (scope.alreadyPending == 1) {
        this.alreadyPending = true
      } else {
        this.alreadyPending = false
      }
      this.dialogFormVisible = true
    },
    modifyData() {
      if (this.alreadyPending) {
        this.ax.get('/applets/complaintCenter/modifyData?id=' + this.updateID + '&alreadyPending=' + 1)
        this.dialogFormVisible = false
      } else {
        this.ax.get('/applets/complaintCenter/modifyData?id=' + this.updateID + '&alreadyPending=' + 0)
        this.dialogFormVisible = false
      }
      this.$message({
        message: '修改成功',
        type: 'success'
      });
      this.bus.$emit(`flash_/applets/complaintCenter/getComplaintCenterList`);
    },
    getTitle() {
      this.meta = {
        "key": "ReaderComment",
        "name": "",
        "searchable": false,
        "displayInList": false,
        "displayName": false,
        "delete": "",
        "edit": "",
        "print": "NONE",
        "export": "NONE",
        "insertable": false,
        "deleteKey": "id",
        "searchOption": null,
        "type": null,
        "sort": 0,
        "sortable": false,
        "clickable": false,
        "path": "com.cq1080.library.cluster.bean.entity.ReaderComment",
        "subs": [
          {
            "key": "number",
            "name": "读者证号",
            "searchable": true,
            "displayInList": true,
            "displayName": false,
            "delete": null,
            "edit": null,
            "print": null,
            "export": null,
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "type": null,
            "sort": 0,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "complaintScenario",
            "name": "投诉场景",
            "searchable": false,
            "displayInList": true,
            "displayName": false,
            "delete": null,
            "edit": null,
            "print": null,
            "export": null,
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "type": null,
            "sort": 0,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "complaintType",
            "name": "投诉原因",
            "searchable": false,
            "displayInList": true,
            "displayName": false,
            "delete": null,
            "edit": null,
            "print": null,
            "export": null,
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "type": null,
            "sort": 0,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "barCode",
            "name": "图书条码",
            "searchable": false,
            "displayInList": true,
            "displayName": false,
            "delete": null,
            "edit": null,
            "print": null,
            "export": null,
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "type": null,
            "sort": 0,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "positiveTitle",
            "name": "正题名",
            "searchable": true,
            "displayInList": true,
            "displayName": false,
            "delete": "DELETE",
            "edit": "EDIT",
            "print": "NONE",
            "export": "NONE",
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "type": "TEXT",
            "sort": 7,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "alreadyPending",
            "name": "是否处理",
            "searchable": true,
            "displayInList": true,
            "subs": null,
            "searchOption": [{
              key: 0, name: "未处理"
            }, { key: 1, name: "已处理" }],
            "type": null,
            "sortable": false,
          },
          {
            "key": "createTime",
            "name": "投诉时间",
            "searchable": false,
            "displayInList": true,
            "displayName": false,
            "delete": "DELETE",
            "edit": "EDIT",
            "print": "NONE",
            "export": "NONE",
            "insertable": false,
            "deleteKey": null,
            "subs": null,
            "searchOption": null,
            "sort": 16,
            "sortable": false,
            "clickable": false,
            "path": null
          },
          {
            "key": "id",
            "name": "",
            "searchable": false,
            "displayInList": false,
            "displayName": false,
            "delete": "DELETE",
            "edit": "EDIT",
            "print": "NONE",
            "export": "NONE",
            "insertable": false,
            "deleteKey": 'id',
            "subs": null,
            "searchOption": null,
            "sort": 16,
            "sortable": false,
            "clickable": false,
            "path": null
          }
        ]
      }
    },
    selected(val) {
      this.chooseBox = val
    },
  }
};
</script>

<style></style>
