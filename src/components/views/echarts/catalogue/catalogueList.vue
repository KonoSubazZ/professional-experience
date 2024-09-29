<template>
    <div class="container padding_20">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>编目清单列表</div>
            <div class="display_flex">
                 <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-download' @click="exportAll" >导出</el-button>
                                 <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="printing" >打印</el-button>
                                <el-button type="primary" plain icon="el-icon-back"  @click="back" >返回</el-button>
                    </el-button-group>
                <!-- <div @click="exportAll" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/export.png" class="btn_img" />
                    <div class="f-s-14">导出</div>
                </div>
                <div @click="printing" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/printing.png" class="btn_img" />
                    <div class="f-s-14">打印</div>
                </div>
                <div @click="back" class="text_center cursor m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
            </div>
        </div>
  
        <div id="workInfo">
             <List
           
                    :data="data"
                    :disableMeta="true"
                    :tableMeta="meta"
                    :disableTableAction="true"
                    @search="search"
                    ref="list"
                ></List>
        </div>
       <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
            form: {},
            data: {},
            arr: [],
            lists: [],
            format: '',
            list: []
        };
    },
    created() {
         this.form = JSON.parse(this.$route.query.info);
        this.metaList();
        this.getForMat();
        this.getFied();
        // console.log(this.$route.query);
       
        this.list = JSON.parse(this.$route.query.list);
        this.format = JSON.parse(this.$route.query.format);
    },
    methods: {
        exportAll() {
            // let newTab;
            // newTab = window.open();
          this.loading()
            let format = {};
            let list;
            if (this.list.length == 0) {
                list = this.lists;
            } else {
                list = this.list;
            }
            // // console.log(this.format.id)
            if (!this.format.id) {
                this.arr.map((it) => {
                    if (it.id == '1') {
                        format = it;
                    }
                });
            } else {
                format = this.format;
            }
            let url
            if(this.form.fun==1){
                url='/manage/unit/catalog/catalogExcel/bookBaseResForCreateExcel'
            }else{
                url='/manage/unit/catalog/catalogExcel/bookResForCreateExcel'
            }
            this.ax
                .post(url, { bookBaseReq: this.form, format, list }) //需要修改地方 导出
                .then(res=>{
                  // newTab.location = res
                  window.location = res
                  this.sloading()
                }).catch(err=>{
              this.sloading()
            })
        },
        // 获取
        getList() {
            let url;
            if (this.form.fun == 1) {
                url = '/manage/unit/catalog/catalogExcel/bookBaseRes';
            } else {
                url = '/manage/unit/catalog/catalogExcel/bookRes';
            }
            this.ax.get(url, { params: this.form }).then((res) => {
                //获取内容   需要修改
                res.content.map(it=>{
                    // it.allTitle = it.positiveTitle+'/'+it.sectionTitle+'/'+it.positiveTitle
                    it.allTitle = it.positiveTitle
                    if(it.subTitle){
                        it.allTitle+='/'+it.subTitle
                    }
                     if(it.sectionTitle){
                        it.allTitle+='/'+it.sectionTitle
                    }
                     if(it.sectionNumber){
                        it.allTitle+='/'+it.sectionNumber
                    }
                })
                 this.data = res
            });
        },
        getForMat() {
            this.ax
                .get('/manage/unit/report/journalReport/excelFormat') // 获取格式
                .then((res) => {
                    // // console.log(res)
                    this.arr = res.content;
                });
        },
        // 查询
        search(val) {
            // console.log(val);
            // val.platformId =
            this.form = Object.assign(this.form, val);
            this.getList();
        },
        // 获取字段
        getFied() {
            let url
              if (this.form.fun == 1) {
                url = '/manage/unit/catalog/catalogExcel/bookBaseResForExcelField';
            } else {
                url = '/manage/unit/catalog/catalogExcel/bookResForExcelField';
            }
            this.ax
                .get(url) //需要修改
                .then((res) => {
                    this.lists = res;
                });
        },
        metaList() {
             // console.log(this.form.fun)
            if (this.form.fun == 2) {
                // console.log(2)
                this.meta = {
                    edit: 'NONE',
                    export: 'NONE',
                    delete: 'NONE',
                    insertable: false,
                    subs: [
                        { name: '题名', key: 'allTitle', displayInList: true },
                        { name: 'ISBN', key: 'isbn', displayInList: true },
                        { name: '条形码', key: 'barCode', displayInList: true },

                        { name: '出版社', key: 'publisher', displayInList: true },
                        { name: '索书号', key: 'callNumber', displayInList: true },
                        { name: '分类号', key: 'classificationNumber', displayInList: true },

                        { name: '种次号', key: 'speciesNumber', displayInList: true },
                        { name: '辅助区分号', key: 'auxiliaryNumber', displayInList: true },
                        { name: '馆藏地址', key: 'collectionPlaceName', displayInList: true },

                        { name: '入库时间', key: 'warehousingTime', displayInList: true },
                        { name: '入库人员', key: 'managerName', displayInList: true },
                        { name: '编目时间', key: 'createTime', displayInList: true },

                        { name: '编目人员', key: 'managerNameBase', displayInList: true },
                        { name: '状态', key: 'bookStatus', displayInList: true },
                        { name: '单价', key: 'price', displayInList: true }
                    ]
                };
            } else {
                this.meta = {
                    edit: 'NONE',
                    export: 'NONE',
                    delete: 'NONE',
                    insertable: false,
                    subs: [
                        { name: '题名', key: 'positiveTitle', displayInList: true },
                        { name: 'ISBN', key: 'isbn', displayInList: true },
                        { name: '条形码', key: 'barCode', displayInList: true },
                        { name: '出版社', key: 'publisher', displayInList: true },
                        { name: '索书号', key: 'callNumber', displayInList: true },
                        { name: '分类号', key: 'classificationNumber', displayInList: true },
                        { name: '种次号', key: 'speciesNumber', displayInList: true },
                        { name: '辅助区分号', key: 'auxiliaryNumber', displayInList: true },
                        { name: '馆藏地址', key: 'collectionPlaceName', displayInList: true },
                        { name: '编目人员', key: 'managerName', displayInList: true },
                        { name: '编目时间', key: 'createTime', displayInList: true },
                        { name: '册数', key: 'bookNumber', displayInList: true },
                        { name: '单价', key: 'price', displayInList: true },
                        { name: '合计金额', key: 'totalPrice', displayInList: true }
                    ]
                };
            }
        },
        printing(){
              let meta = [
                        { name: '题名', key: 'positiveTitle', displayInList: true },
                        { name: 'ISBN', key: 'isbn', displayInList: true },
                        { name: '条形码', key: 'barCode', displayInList: true },
                      
                        { name: '索书号', key: 'callNumber', displayInList: true },
                      
                        { name: '册数', key: 'bookNumber', displayInList: true },
                        { name: '单价', key: 'price', displayInList: true }
                      
            ]

            window.open(`/#/print?data=${JSON.stringify(this.data)}&meta=${JSON.stringify(meta)}`);
        },
    }
};
</script>

<style>
</style>
