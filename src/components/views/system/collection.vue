<template>
    <div class="container">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="文献馆藏地点" name="LITERATURE"></el-tab-pane>
                <el-tab-pane label="分发馆藏地点" name="DISTRIBUTION"></el-tab-pane>
            </el-tabs>
        </div>
       
            <List
                :dataUrl="dataUrl"
                :disableMeta="true"
                :tableMeta="meta"
                :isHeaderHeigt='80'
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                :chooseBox='true'
                @create="open"
            ></List>
        
         <!-- 弹框 -->
        <el-dialog title="馆藏地点管理" :visible.sync="createModel" width="40%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="馆藏名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>

                        

                        <el-form-item label="备注"  >
                            <el-input v-model="form.note" type="note" :rows="2"></el-input>
                        </el-form-item>
                       
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            activeName: 'LITERATURE',
            meta: '',
            dataUrl:'/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE',
            loadings: false,
            createModel: false,
            form: {},
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                code: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.metaList();
    },
    methods: {
        handelClick(e){
            // // console.log(this.activeName)
             this.loading();
            if(this.activeName=='LITERATURE'){
                this.dataUrl='/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE'
                setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE`, e);
                    
                })
            }else{
                 this.dataUrl='/manage/unit/system/systemSettings/collectionPlace?type=DISTRIBUTION'
                 setTimeout(res=>{
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE`, e);
                    
                })
            }
             setTimeout(res=>{
                   this.sloading()
                },500)
           
            //  // console.log(e)
        },
        // 修改
        editUpdate(e) {
            this.loadings = true;
            this.form = e[0];
            this.createModel = true;
            setTimeout(res => {
                this.loadings = false;
            }, 500);
        },
      //查询默认参数选择
      async getDefault() {
        let platformId = JSON.parse(localStorage.getItem('user')).platform.id;
         return await this.ax.get('/manage/unit/catalog/bibliography/bookCatalogSetting', { params: { platformId } });
      },
        // 删除
        async deleteUpdate(e) {
          const defaults = await this.getDefault();
          if(e.map(it=>it.id).includes(defaults.collectionPlaceId)){
            return this.$message.error('您要删除的馆藏地点中包含默认馆藏地点不允许删除');
          }

             let ids = e.map(it=>{
                return it.id
            }).join(',');
            this.loading();
            this.ax
                .delete('/manage/unit/system/systemSettings/collectionPlace?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        // 新增打开
        open() {
            this.createModel = true;
        },
        //
        close() {
            this.form = {};
        },
        // 保存
        save_mar() {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.form.type=this.activeName
            this.ax
                .post('/manage/unit/system/systemSettings/collectionPlace', this.form)
                .then(res => {
                    this.sloading();
                    this.createModel = false;
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/collectionPlace?type=LITERATURE`, res);
                })
                .catch(res => {
                    this.sloading();
                });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.CollectionPlace' } }).then(res => {
                res.delete='DELETE'
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId' || it.key =='code') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
