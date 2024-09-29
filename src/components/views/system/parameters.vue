<template>
    <div class="container" >
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="基础参数" name="basics">
                    <div class="display_flex parameters" >
                        <div class="title_box " v-for="(item,i) of listTitle" :key="i" @click="getList(item)" :class="boxName==item.type?'active':''">
                            {{item.name}}
                        </div>
                    </div>
                    <List
                        :dataUrl="dataUrl"
                        :disableMeta="true"
                        :isHeaderHeigt='80'
                        :tableMeta="meta"
                         ref="list"
                        :isSort = true
                        @edit='editUpdate'
                        @delete="deleteUpdate"
                        @create="open"
                        :chooseBox='true'
                    ></List>
                </el-tab-pane>

                <el-tab-pane label="编目设置" name="setting" :style="$height(240)">
                       <div class="display_flex between">
                           <div></div>
                            <!-- <div @click="save" class="cursor text_center m-r-20">
                                <img src="../../../assets/img/add.png" class="btn_img" />
                                <div class="f-s-14">保存</div>
                            </div> -->
                            <el-button type="primary" @click="save">保存</el-button>
                        </div>

                        <div class="p-t-20">
                            <div class="display_flex w-70 m-b-60">
                                <div class="label_title w-25">
                                    套录/Z39.50分类号默认截取长度
                                </div>
                                <el-input v-model.number="data.interceptionLength" :disabled='edit' placeholder="请输入内容" class="w-20 m-r-20"></el-input>
                                <el-button type="primary" @click="edit=false" class=" m-r-10">编辑</el-button>
                                <el-button type="primary" @click="$router.push('parameters/add')">查看</el-button>
                            </div>
                            <div class="display_flex w-70">
                                <div class="label_title w-25">
                                    编目保存时删除空字段
                                </div>
                                <el-radio-group v-model="data.emptyIs">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                </el-tab-pane>
            </el-tabs>
        </div>
         <!-- 弹框 -->
        <el-dialog title="添加数据" :visible.sync="createModel" width="40%" :close-on-click-modal='false'  @close='close'>
                <el-form :model="form" :rules="rules" ref="form" label-width="100px" class=" m-b-30">
                    
                        <el-form-item label="添加名称" prop='name' >
                            <el-input v-model="form.name" ></el-input>
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
            activeName: 'basics',  
            meta:'',
            height:'',
            dataUrl:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=LANGUAGE',
            listTitle:[
                {name:'文献语种',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=LANGUAGE',type:'LANGUAGE'},
                // {name:'采购方式',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=PurchaseMethod',type:'PurchaseMethod'},
                // {name:'开本尺寸',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=FormatSize',type:'FormatSize'},
                // {name:'装帧方式',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=BindingMethod',type:'BindingMethod'},
                // {name:'责任方式',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=RESPONSIBILITY',type:'RESPONSIBILITY'},
                {name:'文献类型',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=MEDIUM',type:'MEDIUM'},
                // {name:'文献来源',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=SOURCE',type:'SOURCE'},
                {name:'货币类型',url:'/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=CURRENCY',type:'CURRENCY'}
            ],
            boxName:'LANGUAGE',  //当前选择类型
            form:{}, //表单
            showModel:false,//弹框
            createModel:false, //弹框
            loadings:false, //加载
            options:[], //选择
            rules:{
                name: [{ required: true, message: '请输入', trigger: 'blur' }]
            },

            // 截取
            edit:true,
            data:{
                interceptionLength:'',
                emptyIs:''
            },
            
        };
    },
    created() {
        this.height = this.$height()
        this.metaList()
        this.getDefa()
    },
    methods: {
        getDefa(){
            let params={
                ceptionType:'DEFAULT',
                platformId:JSON.parse(localStorage.getItem('user')).platform.id
            }
            this.ax.get("/manage/unit/system/systemSettings/classificationInterception",{params})
                .then(res=>{
                    if(res.content.length>0){
                        this.data = res.content[0]
                    }
                    
                })
        },
        save(){
            // // console.log(indexOf(this.data.interceptionLength))
            // if(){

            // }
            let params= this.data

            params.ceptionType='DEFAULT',
            params.platformId=JSON.parse(localStorage.getItem('user')).platform.id

           
            this.ax.post('/manage/unit/system/systemSettings/classificationInterception',params)
                .then(res=>{
                    // console.log(res)
                     this.edit =true
                     this.$message.success('保持成功');
                })
        },
        // 切换
        handelClick(e){
             this.loading();
            if(this.activeName=='LITERATURE'){
              
            }else{
               
            }
             setTimeout(res=>{
                   this.sloading()
                },800)
           
        },
        // 选择type
        getList(e){
                this.loading();
                this.boxName = e.type
                this.dataUrl = e.url
                setTimeout(it=>{
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=LANGUAGE`, e);
                })
                 setTimeout(res=>{
                   this.sloading()
                },800)
        },
        // 修改
        editUpdate(e) {
            this.loadings = true;
            this.form = JSON.parse(JSON.stringify(e[0]))
            this.createModel = true;
            setTimeout(res => {
                this.loadings = false;
            }, 500);
        },
        // 删除
        deleteUpdate(e) {
            let ids = e.map(it=>{
                return it.id
            }).join(',')
            this.loading();
            this.ax
                .delete('/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=LANGUAGE`, res);
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
            this.form.bookCatalogParameterType=this.boxName;
            this.ax
                .post('/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail', this.form)
                .then(res => {
                    this.sloading();
                    this.createModel = false;
                    this.bus.$emit(`flash_/manage/unit/system/systemSettings/bookCatalogParameterTypeDetail?bookCatalogParameterType=LANGUAGE`, res);
                })
                .catch(res => {
                    this.sloading();
                });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.BookCatalogParameterTypeDetail' } }).then(res => {
                res.delete='DELETE'
                res.subs.map(it => {

                    if (it.key == 'createTime') {
                        it.displayInList = false;
                        // it.searchable = false;
                    }
                    if(it.key=='bookCatalogParameterType'){
                        this.options= it.searchOption
                    }
                    it.searchable = false
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style>
.parameters{
    position: absolute;
}
.parameters .title_box{
        width:5.75rem;
        height:2.38rem;
        background:#ffffff;
        border:1px solid #e6e6e6;
        border-radius:5px;
        text-align: center;
        line-height: 2.38rem;
        font-size: 0.88rem;
        color: #333;
        margin-right: 1.44rem;
        cursor: pointer;
}
.parameters .active,.parameters .title_box:hover{
    background: #267FF9;
    color: #fff;
    transition: 0.5s;
}
</style>
