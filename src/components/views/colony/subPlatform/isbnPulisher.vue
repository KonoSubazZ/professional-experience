<template>
    <div>
        <div class="container " :style="$height()">
            
                       
                            <List
                                :dataUrl="'/manage/united/subPlatform/isbnPulisher'"
                                :disableMeta="true"
                                :tableMeta="meta"
                                @edit="editBook"
                                ref="list"
                                @create='create'
                                @delete="deleteBook"
                                :chooseBox='true'
                            >
                              
                            </List>
                  
          <!-- 弹框 -->
        <el-dialog title="出版社编辑" :visible.sync="createModel" width="30%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="150px" class=" m-b-30">
                    
                        <el-form-item label="出版社名称" prop='name' >
                            <el-input v-model="form.publisher" ></el-input>
                        </el-form-item>

                        <el-form-item label="出版地" prop='name' >
                            <el-input v-model="form.pubPlace" ></el-input>
                        </el-form-item>
                         <el-form-item label="地区代码"  >
                            <el-input v-model="form.areaCode" ></el-input>
                        </el-form-item>

                        <el-form-item label="ISBN对应出版社代码"  >
                            <el-input v-model="form.code" ></el-input>
                        </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="createModel = false">取 消</el-button>
                    <el-button type="primary" @click="save_mar('form')">确 定</el-button>
                </span>
        </el-dialog>
         </div>
    </div>
</template>

<script>
import List from '../../../view/List';
import fromData from '../../../view/form'

const qs = require('qs');
export default {
    components: {
        List,
        fromData
    },
    data() {
        return {bus: this.bus(this),
            meta:'',
            createModel:false,
            form:{},
            rules:{}
        };
    },
    created() {
       
       
        this.metasList()
        document.onkeydown = e => {
            let key = window.event.keyCode;
            // console.log(e);
        };
    },
    methods: {
        save_mar(){
              this.loading()
            this.ax.post('/manage/united/subPlatform/isbnPulisher',{params:this.form})
                .then(res=>{
                      this.bus.$emit('flash_/manage/united/subPlatform/isbnPulisher')
                       this.$message.success('保存成功');
                        this.sloading()
                })
        },
        create(){
             this.createModel=true
        },
        close(){
            this.form={}
        },
        // 获取meta
        metasList() {
            this.meta = {
                insertable: true,
                edit: 'EDIT',
                delete: 'DELETE',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        searchable: true,
                        name: '出版社名称'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'pubPlace',
                        searchable: false,
                        name: '出版地'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: false,
                        key: 'areaCode',
                        name: '地区代码'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'code',
                        name: 'ISBN对应出版社代码'
                    },
                ]
            };
        },
       
        deleteBook(val){
            this.loading()
            let ids = val.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/united/subPlatform/isbnPulisher?ids='+ids)
                .then(res=>{
                    this.bus.$emit('flash_/manage/united/subPlatform/isbnPulisher')
                       this.$message.success('删除成功');
                        this.sloading()
                })
        },
        editBook(val){
             this.form =val[0]
            this.createModel=true
             
        },
    }
};
</script>

<style scoped>

</style>
