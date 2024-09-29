 <template>
    <div class="container" :style="height">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>报表格式设置</div>
            <div class="display_flex">
                  <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-circle-plus-outline' @click="add" >新增格式</el-button>
                                <el-button type="primary" plain icon="el-icon-delete"  @click="del" >删除格式</el-button>
                                <el-button type="primary" plain icon="el-icon-setting"  @click="save" >保存格式</el-button>
                    </el-button-group>
                <!-- <div @click="add" class="cursor text_center m-r-20">
                    <img src="../../../../../assets/img/add.png" class="btn_img" />
                    <div class="f-s-14">新增格式</div>
                </div>
                <div @click="del" class="cursor text_center m-r-20">
                    <img src="../../../../../assets/img/del.png" class="btn_img" />
                    <div class="f-s-14">删除格式</div>
                </div>
                <div @click="save" class="cursor text_center m-r-20">
                    <img src="../../../../../assets/img/saves.png" class="btn_img" />
                    <div class="f-s-14">保存格式</div>
                </div> -->
                <!-- <div @click="back" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
            </div>
        </div>
        <div class="padding_20">
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="140px"
                class="w-100 m-b-30"
            >
                <el-form-item label="报表格式" class="w-100">
                    <el-select
                        v-model="choose"
                        clearable
                        placeholder="请选择"
                        class="w-100"
                        @change="changeName"
                    >
                        <el-option
                            v-for="items in list"
                            :key="items.id"
                            :label="items.name"
                            :value="items.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="格式名" class="w-100">
                    <el-input placeholder="请输入" maxlength="20" v-model="form.name" clearable></el-input>
                </el-form-item>

                <div class="display_flex wrap">
                    <el-form-item label="报表标题" class="w-30">
                        <el-input placeholder="请输入" maxlength="20" v-model="form.title" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="列宽" prop='columnWidth' class="w-30">
                        <el-input
                            placeholder="请输入"
                            maxlength="20"
                            v-model.number="form.columnWidth"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="字体" class="w-30">
                        <el-select v-model="form.font" clearable placeholder="请选择" class="w-100">
                            <el-option
                                v-for="items in fontList"
                                :key="items"
                                :label="items"
                                :value="items"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="display_flex wrap">
                    <el-form-item label="字体大小" class="w-30">
                        <el-select
                            v-model="form.fontSize"
                            clearable
                            placeholder="请选择"
                            class="w-100"
                        >
                            <el-option
                                v-for="items in sizeList"
                                :key="items"
                                :label="items"
                                :value="items"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行高" class="w-30">
                        <el-input
                            placeholder="请输入"
                            maxlength="20"
                            v-model="form.rowHeight"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="单元格水平对齐方式" class="w-30">
                        <el-select
                            v-model="form.alignmentType"
                            clearable
                            placeholder="请选择"
                            class="w-100"
                        >
                            <el-option
                                v-for="items in alignmentType"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="display_flex wrap">
                    <el-form-item label="边框粗细" class="w-30">
                        <el-select
                            v-model="form.borderType"
                            clearable
                            placeholder="请选择"
                            class="w-100"
                        >
                            <el-option
                                v-for="items in borderType"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单元格垂直对齐方式" class="w-30">
                        <el-select
                            v-model="form.verticalAlignmentType"
                            clearable
                            placeholder="请选择"
                            class="w-100"
                        >
                            <el-option
                                v-for="items in verticalAlignmentType"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item label="其他设置" class="w-100">
                    <el-checkbox v-model="form.collectionStatus">读者所属馆</el-checkbox>
                    <el-checkbox v-model="form.userNameStatus">用户名</el-checkbox>
                    <el-checkbox v-model="form.printDateStatus">打印日期</el-checkbox>
                </el-form-item>
            </el-form>
        </div>

        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>字段列表</div>
            <div class="display_flex"></div>
        </div>
        <div class="display_flex between padding_20 start">
            <el-table class="w-50" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTable">
                <el-table-column type="selection" align="center" width="150"></el-table-column>
                <el-table-column width="600" align="center" prop="classNameCN" label="字段名"></el-table-column>
            </el-table>
            <div class="w-40">
                <div class="m-b-20">字段信息设置</div>
                <div class="display_flex m-b-20">
                    <div class="w-10 f-s-14 color_3 m-r-10">字段名</div>
                    <el-input class="w-80" disabled v-model="showTetx.classNameCN"></el-input>
                </div>
                <div class="display_flex m-b-20">
                    <div class="w-10 f-s-14 color_3 m-r-10">宽度</div>
                    <el-input class="w-80" v-model="showTetx.columnWidth"></el-input>
                </div>
                <div class="display_flex">
                    <el-button type="primary" class="m-r-20" @click="listAdd">添加</el-button>

                    <el-button type="primary" class="m-r-20" @click="saveList">保存</el-button>
                </div>
            </div>
        </div>

        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>已选字段列表</div>
            <div class="display_flex"></div>
        </div>
        <div class="display_flex between padding_20 start m-b-80">
            <el-table :data="addChoose" >
                <el-table-column  align="center" prop="classNameCN" label="字段名"></el-table-column>
                <el-table-column  align="center" prop="columnWidth" label="宽度"></el-table-column>
                <el-table-column width="240" align="center" label="操作" >
                     <template slot-scope="scope">
                    <div class="table-action flex-row flex-wrap flex_center">
                        <el-button size="mini" type="text" class="m-r-20" @click="changeIndex(scope.$index,-1)" v-if="scope.$index!=0">上移</el-button>
                        <el-button size="mini" type="text" class="m-r-20" @click="changeIndex(scope.$index,1)" v-if="scope.$index!=addChoose.length-1">下移</el-button>
                        <el-button size="mini" type="text" class="m-r-20" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" class="m-r-20 color_dan" @click="delRow(scope.$index)">删除</el-button>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import formModel from '../../../../view/form';
export default {
    components: {
        formModel
    },
    props:['url'],
    data() {
         var checkColumnWidth = (rule, value, callback) => {
        
                if (value > 100 ) {
                callback(new Error('最大只能100'));
                } else {
                callback();
              }
      
      };
        return {
            height: '',
            choose: '',
            form: {},
            rules: {
                columnWidth: [
                     { validator: checkColumnWidth, trigger: 'blur' }
                ],
            },
            list: [],
            fontList: [],
            sizeList: [],
            borderType: [
                { name: '无', id: 0 },
                { name: '细', id: 1 },
                { name: '中', id: 2 },
                { name: '粗', id: 3 }
            ],
            verticalAlignmentType: [
                { name: '居中', id: 0 },
                { name: '靠上', id: 1 },
                { name: '靠下', id: 2 }
            ],
            alignmentType: [
                { name: '靠左', id: 0 },
                { name: '居中', id: 1 },
                { name: '靠右', id: 2 }
            ],
            tableData: [],
            showTetx: {
                classNameCN: '',
                columnWidth: ''
            },
            addChoose:[],
            chooseList: []
        };
    },
    created() {
        this.height = this.$height();
        this.getAllList();
        this.searchInfo();
        this.getSize();
        this.getFied();
    },
    watch:{
        url(val){
            if(val){
                this.getFied();
            }
        },
    },
    methods: {
        changeIndex(index,add){
            let arr = this.addChoose
            if(add==1){
                 arr[index].classOrder = arr[index].classOrder+1
                 arr[index+1].classOrder = arr[index+1].classOrder-1
                 arr[index] = arr.splice(index+1, 1, arr[index])[0]
                 this.addChoose = arr

            }else{
                arr[index].classOrder = arr[index].classOrder-1
                arr[index-1].classOrder = arr[index-1].classOrder+1
                arr[index] = arr.splice(index-1, 1, arr[index])[0]
                 this.addChoose = arr

            }
        },
        edit(val){
            // console.log(val)
            this.showTetx = val
        },
        delRow(index){
            // // console.log(val)
            this.addChoose.splice(index,1)
        },
        listAdd() {
            this.chooseList.map(it=>{
                it.columnWidth = this.showTetx.columnWidth
            })            
            this.addChoose.map(it=>{
                this.chooseList.map((item,i)=>{
                    if(it.id==item.id){
                        this.chooseList.splice(i,1)
                    }
                })
            })
              this.addChoose = this.addChoose.concat(this.chooseList)
            this.chooseList=[]
            this.showTetx={
                classNameCN: '',
                columnWidth: ''
            }
            this.$refs.multipleTable.clearSelection();
        },
        saveList() {


            this.loading()
            if(this.addChoose.length==0){
                 this.sloading()
            }else{
                 this.$emit('showList',this.addChoose)
                 this.sloading()
            }
              
            
           
            // // console.log(this.tableData)
        },
        // add
        add() {
            this.form = {};
            this.choose = '';
        },
        // del
        del() {
            this.loading();
            this.ax
                .delete('/manage/unit/report/journalReport/excelFormat?id=' + this.choose)
                .then(res => {
                    this.sloading();
                    this.$message.success('操作成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        // save
        save() {
            this.loading();
            this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax
                .post('/manage/unit/report/journalReport/excelFormat', this.form)
                .then(res => {
                    this.sloading();
                    this.$message.success('保存成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },

        // changeName
        changeName() {
            this.list.map(it => {
                if (this.choose == it.id) {
                    this.form = it;
                }
            });
              this.$emit('chooseName',this.form)
        },
        getAllList() {
            this.ax.get('/manage/unit/report/journalReport/excelFormat').then(res => {
                this.list = res.content;
            });
        },
        searchInfo() {
            this.ax.get('/manage/unit/report/journalReport/font').then(res => {
                this.fontList = res;
            });
        },
        // 获取字体
        getSize() {
            this.ax.get('/manage/unit/report/journalReport/fontSize').then(res => {
                this.sizeList = res;
            });
        },
        // 获取字段
        getFied() {
            this.ax.get(this.url).then(res => {
                this.tableData = res;
            });
        },
        handleSelectionChange(val) {
            this.chooseList = val;
            if (val.length > 0) {
                this.showTetx.classNameCN = val
                    .map(it => {
                        //    // console.log(it)
                        return it.classNameCN;
                    })
                    .join(',');
            } else {
                this.showTetx = {
                    classNameCN: ''
                };
            }
            
        }
    }
};
</script>

<style scoped>
.color_3 {
    color: #333;
}
</style>
