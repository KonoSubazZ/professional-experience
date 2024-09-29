<template>
  <div style="height: 100%">
    <div class="display_flex">
      <div>
        <el-select v-model="search.category" clearable placeholder="请选择备份方式">
          <el-option
              v-for="item in [{id:1,name:'手动备份'},{id:2,name:'自动备份'}]"
              :key="item.id"
              :label="item.name"
              :value="item.name">
          </el-option>
        </el-select>
      </div>
<!--      <div class="m-l-20">-->
<!--        <el-select v-model="search.dataType" clearable placeholder="请选择备份类型">-->
<!--          <el-option-->
<!--              v-for="item in [{id:1,name:'只备份表数据',},{id:2,name:'备份表结构+数据'}]"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </div>-->
      <div class="m-l-20">
        <el-button
            type="primary"
            class=""
            icon="el-icon-search"
            plain
            @click="getList"
        >搜索</el-button>
      </div>

    </div>
    <el-table stripe
              label="更新"
              height="calc(100vh - 360px)"
              style="margin-top: 20px;"
              border :data="tableData" v-loading="loading">
      <el-table-column
          label="数据库名"
          prop="databaseName"
          sortable
          align="center"
      ></el-table-column>
      <el-table-column
          label="备份方式"
          prop="category"
          sortable
          align="center"
      ></el-table-column>
      <el-table-column
          label="备份时间"
          prop="createTime"
          sortable
          align="center"
      >
        <template slot-scope="scope">
          <span>{{getTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="备份类型"
          align="center"
          sortable
          prop="dataType">
        <template slot-scope="scope">
          <span>{{scope.row.dataType === 0 ? '只备份表结构' : scope.row.dataType === 1 ? '只备份表数据' : '备份表结构+数据'}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="备份状态"
          align="center"
          sortable
          prop="status">
        <template slot-scope="scope">
          <span :style="{color:scope.row.status === -1?'#F56C6C':scope.row.status === 0 ?'#409EFF':scope.row.status === 1?'#e67e22':'#67C23A'}">
            {{scope.row.status === -1 ? '备份失败' : scope.row.status === 0 ? '备份中' : scope.row.status === 1 ? '上传中' :'备份成功'}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="邮箱地址"
          prop="email"
          sortable
          align="center"
      ></el-table-column>
      <el-table-column
          label="操作"
          align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.category === '手动备份'" type="text" @click="downLoad(scope.row.filePath)">下载</el-button>
          <span v-else>{{ scope.row.delFlag === 0 ? '请到服务器（' +scope.row.filePath+ '）自行下载' : '文件已被清理' }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--          label="是否删除"-->
<!--          align="center"-->
<!--          sortable-->
<!--          prop="delFlag">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.status === 0 ? '删除' : '已删除'}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->


    </el-table>
    <div class="pagination m-t-20">
      <el-pagination
          background
          layout="sizes,total, prev, pager, next"
          :current-page="page + 1"
          :page-sizes="[20, 100, 200, 300, 500]"
          :page-size="size"
          :total="total"
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      search:{},
      tableData:[],
      loading:false,
      page:0,
      size:20,
      total:0
    }
  },
  mounted() {
    this.getList();
  },
  methods:{
    downLoad(path){
      if(!path){
        return this.$message.error('当前下载的文件路径不存在')
      }
      window.location = path;
    },
    getList(){
      let params = {
        page:this.page,
        size:this.size,
        ...this.search
      }
      this.loading = true;
      this.ax.get('/manage/unit/system/dbbackup/getDbBackupLogList', {params}).then(res=>{
        this.tableData = res.content;
        this.total = res.totalElements;
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
    onPageSizeChange(e) {
      this.size = e;
      this.getList();
    },
    onPageChange(e) {
      this.page = e - 1;
      this.getList();
    },
  }
}
</script>