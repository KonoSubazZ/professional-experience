<template>
    <div>
        <div class>
            <div class="display_flex m-b-20">
                <div class="f-s-14 label padding_20">选择模板</div>
                <el-select v-model="type" filterable clearable class="w-100" @change="getType">
                    <el-option v-for="items in option" :key="items.id" :label="items.name" :value="items.id"></el-option>
                </el-select>
            </div>
            <form-view :list="list" :row="3" @getForm="getForm" :model="form" class="m-b-30"></form-view>

            <div class="footer display_flex">
                <el-button @click="del" type="danger">删除模板</el-button>
                <el-button type="primary" @click="save">保存模板</el-button>
            </div>
        </div>
    </div>
</template>

<script>
const qs = require('qs');
import formView from '../../../view/form';
export default {
    components: {
        formView
    },
    data() {
        return {
            bus: this.bus(this),
            height: '', //高度
            activeName: 'first',
            form: {}, //收集设置选择的数据；
            forms: {},
            list: [
                { name: '模板名称', id: 'name' },
                { name: '标题名', id: 'title' },
                { name: '标签宽度(mm)', id: 'width', type: '' },
                { name: '标签高度(mm)', id: 'height', type: '' },
                { name: '标签上边距(mm)', id: 'padding', type: '' },
                { name: '列间隙(mm)', id: 'columnSpacing', type: '' },
                { name: '行间隙(mm)', id: 'lineSpacing', type: '' },
                { name: '页面顶边距(mm)', id: 'top', type: '' },
                { name: '页面左边距(mm)', id: 'left', type: '' },
                { name: '每页行数', id: 'linesNumber', type: '' },
                { name: '每页列数', id: 'columnNumber', type: '' },
                { name: '字体大小', id: 'size', type: '' },
                { name: '单个打印次数', id: 'number' },
                {
                    name: '打印字体',
                    id: 'family',
                    type: 'select',
                    options: [
                        { name: 'Arial', id: 'Arial' },
                        { name: 'Times New Roman', id: 'Times New Roman' },
                        { name: '宋体', id: 'SimSun' },
                        { name: '黑体', id: 'SimHei' },
                        { name: '微软雅黑', id: 'Microsoft YaHei' },
                        { name: '微软正黑体', id: 'Microsoft JhengHei' },
                        { name: '新宋体', id: 'NSimSun' },
                        { name: '华文中宋', id: 'STZhongsong' },
                        { name: '楷体', id: 'KaiTi' },
                        { name: '新细明体', id: 'PMingLiU' },
                        { name: 'Consolas', id: 'Consolas' }
                    ]
                },
                {
                    name: '对齐方式',
                    id: 'alignmentType',
                    type: 'select',
                    options: [
                        { name: '左对齐', id: 'LEFT' },
                        { name: '右对齐', id: 'RIGHT' },
                        { name: '居中', id: 'CENTER' }
                    ]
                }
            ],
            type: '',
            option: [],
            rules: {},
            checked: '',
            options: [
                { name: '分类号', id: 'classificationNumber' },
                { name: '种次号', id: 'speciesNumber' },
                { name: '辅助区分号', id: 'auxiliaryNumber' },
                { name: '年份', id: 'publicationDate' },
                { name: '条码号', id: 'barCode' },
                { name: '自定义', id: 'block' }
            ],
            tableData: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getType(val) {
            let number = 0;
            this.option.map((it) => {
                if (it.id == val) {
                    let obj = JSON.parse(it.content);
                    this.form = obj.content;
                    this.form.id = it.id;
                    this.number = obj.number;
                } else {
                    number++;
                }
            });
            if (number == this.option.length) {
                this.form.id == null;
            }
        },
        getForm(val) {
            this.form = val;
        },
        save() {
            this.getList();
            let names = this.option.map(e=>e.name);
            // console.log(this.type,'this.getType')
            // console.log((this.type != ''),'判断');
            if((this.type != '')==false){//
              if(names.includes(this.form.name)){
                return this.$message.error('模板名称重复');
            }  
            }
            let params = {};
            params.name = this.form.name;
            // params.one=this.number.one.join(',')
            // params.two=this.number.two.join(',')
            // params.three=this.number.three.join(',')
            // params.four=this.number.four.join(',')
            // params.five=this.number.five.join(',')
            params.content = JSON.stringify({
                content: this.form,
                number: this.number
            });
            params.type = 'BARCODE';
            params.id = this.form.id;
            params.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax.post('/manage/unit/catalog/bibliography/printSetting', params).then((res) => {
                this.getList();
                this.$message.success('保存成功');
            });
        },
        del() {
            // console.log(this.form)
            this.ax.delete('/manage/unit/catalog/bibliography/printSetting?ids=' + this.form.id).then((res) => {
                this.form = {};
                this.$message.success('删除成功');
                this.getList();
                this.type = '';
            });
        },
        getList() {
            //获取模板列表
            this.ax
                .get('/manage/unit/catalog/bibliography/printSetting', {
                    type: 'BARCODE',
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 999, page: 0 }
                })
                .then((res) => {
                    this.option = res.content;
                });
        },
        print() {}
    }
};
</script>

<style scoped>
.libraryInfo .el-tabs__item {
    line-height: 60px;
    height: 60px;
}
.libraryInfo {
    position: relative;
}
.libraryInfo .choose {
    position: absolute;
    top: 10px;
    right: 20px;
}
.libraryInfo .info {
    height: 1.38rem;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.38rem;
    color: #000000;
    width: 100%;
}
.b-b-1 {
    border-bottom: 1px solid #ddd;
}
.add {
    margin-left: 150px;
}
.titleBox {
    background: #f1f5f9;
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}
.floor {
    padding: 5px;
    border: 1px solid #ddd;
    border-top: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
}
.footer {
    justify-content: flex-end;
}

.label {
    width: 150px;
    text-align: right;
}
</style>
