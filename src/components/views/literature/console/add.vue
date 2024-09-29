<template>
    <div>
        <div class>
            <div class="display_flex m-b-20">
                <div class="f-s-14 label padding_20 ">选择模板</div>
                <el-select
                            v-model="type"
                            filterable
                            clearable
                            class="w-100"
                            @change="getType"
                        >
                            <el-option
                                v-for="items in option"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                </el-select>
            </div>
            <form-view :list="list" :row="3" @getForm="getForm" :model='form' class="m-b-30"></form-view>

            <div class="top_title display_flex m-b-35">
                <div class="title_info">标签内容组配方式</div>
            </div>
            <div>
                <div class="display_flex between titleBox">
                    <div class="w-10">字段内容</div>
                    <div class="w-10">加前缀</div>
                    <div class="w-10">加后缀</div>
                    <div class="w-10">字体大小</div>
                    <div class="w-10">字体粗细</div>
                    <div class="w-10">尾部换行</div>
                    <div class="w-10">是否显示</div>
                </div>
                <div class="display_flex between floor">
                    <div class="w-10">
                        <el-select
                            v-model="number.one[0]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in options"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.one[1]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.one[2]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.one[3]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-select
                            v-model="number.one[4]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in optionsW"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.one[5]"></el-checkbox>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.one[6]" ></el-checkbox>
                    </div>
                </div>
                <div class="display_flex between floor">
                    <div class="w-10">
                        <el-select
                            v-model="number.two[0]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in options"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.two[1]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.two[2]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.two[3]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-select
                            v-model="number.two[4]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in optionsW"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.two[5]" ></el-checkbox>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.two[6]" ></el-checkbox>
                    </div>
                </div>
                <div class="display_flex between floor">
                    <div class="w-10">
                        <el-select
                            v-model="number.three[0]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in options"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.three[1]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.three[2]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.three[3]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-select
                            v-model="number.three[4]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in optionsW"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.three[5]"></el-checkbox>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.three[6]" ></el-checkbox>
                    </div>
                </div>
                <div class="display_flex between floor">
                    <div class="w-10">
                        <el-select
                            v-model="number.four[0]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in options"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.four[1]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.four[2]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.four[3]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-select
                            v-model="number.four[4]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in optionsW"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.four[5]"   ></el-checkbox>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.four[6]"   ></el-checkbox>
                    </div>
                </div>
                <div class="display_flex between floor m-b-30">
                    <div class="w-10">
                        <el-select
                            v-model="number.five[0]"
                            filterable
                            clearable
                            class="w-100"
                        >
                            <el-option
                                v-for="items in options"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.five[1]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.five[2]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-input placeholder="请输入" v-model="number.five[3]" clearable></el-input>
                    </div>
                    <div class="w-10">
                        <el-select
                            v-model="number.five[4]"
                            filterable
                            clearable
                            class="w-100"
                            
                        >
                            <el-option
                                v-for="items in optionsW"
                                :key="items.id"
                                :label="items.name"
                                :value="items.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.five[5]" ></el-checkbox>
                    </div>
                    <div class="w-10">
                        <el-checkbox v-model="number.five[6]" ></el-checkbox>
                    </div>
                </div>
                <div class="footer display_flex ">
                   <el-button @click="del"  type="danger">删除模板</el-button>
                   <el-button type="primary" @click="save">保存模板</el-button>
                </div>
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
        return {bus: this.bus(this),
            height: '', //高度
            activeName: 'first',
            form: {},
            forms: {},
            optionsW:[
                {name:'细',id:'400'},
                {name:'粗',id:'600'},
                {name:'加粗',id:'700'},
            ],
            number: {
                one: ['classificationNumber'],
                two: ['speciesNumber'],
                three: ['auxiliaryNumber'],
                four: ['publicationDate'],
                five: ['barCode']
            },
            list: [
                 { name: '模板名称', id: 'name' },
                 { name: '标签宽度(mm)', id: 'width', type: '' },
                 { name: '标签高度(mm)', id: 'height', type: '' },
                 { name: '标签上边距(mm)', id: 'padding', type: '' },
                 { name: '列间隙(mm)', id: 'columnSpacing', type: '' },
                 { name: '行间隙(mm)', id: 'lineSpacing', type: '' },
                 { name: '页面顶边距(mm)', id: 'top', type: '' },
                
                 { name: '页面左边距(mm)', id: 'left', type: '' },

                  { name: '页面高度(mm)', id: 'pageHeight', type: '' },

                   { name: '页面宽度(mm)', id: 'pageWidth', type: '' },
                 { name: '每页行数', id: 'linesNumber', type: '' },
                 { name: '每页列数', id: 'columnNumber', type: '' },
                 {name:'单个打印次数',id:'number'},
                 {name:'打印字体',
                 id:'family', 
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
                    ]},
                 {
                    name: '对齐方式',
                    id: 'alignmentType',
                    type: 'select',
                    options: [
                        { name: '左对齐', id: 'LEFT' },
                        { name: '右对齐', id: 'RIGHT' },
                        { name: '居中', id: 'CENTER' }
                    ]
                 },
               
            ],
            type:'', //选择模板下，收集数据
            option:[],
            // rules: {},
            // checked: '',
            options: [
                { name: '分类号', id: 'classificationNumber' },
                { name: '种次号', id: 'speciesNumber' },
              { name: '四角号码', id: 'sihms' },
              { name: '著者号', id: 'authorNumber' },
              { name: '著者首拼', id: 'authorNumberSZM' },
                { name: '辅助区分号', id: 'auxiliaryNumber' },
                { name: '年份', id: 'publicationDate' },
                { name: '条码号', id: 'barCode' },
                { name: '架位号', id: 'rackName' }
            ],
            // tableData: []
        };
    },
    created() {
        this.getList()
    },
    methods: {
        getType(val){
            let number = 0
           this.option.map(it=>{
               if(it.id == val){
                    let obj = JSON.parse(it.content)
                    console.log("调用getType66",obj);
                    this.form = obj.content
                    this.form.id = it.id
                    // number = obj.number
                   if(obj.number){
                     this.number = obj.number
                   }

               }else{
                   number++
               }
           })
           if(number==this.option.length){
               this.form.id==null
           }
        },
        getForm(val) {
            this.form = val;
        },
        
        save(){
            this.getList();
            let names = this.option.map(e=>e.name);
            // console.log(this.type,'this.getType')
            // console.log((this.type != ''),'判断');
            if((this.type != '')==false){//
              if(names.includes(this.form.name)){
                return this.$message.error('模板名称重复');
            }  
            }
            let params={}

            params.name = this.form.name

            // params.one=this.number.one.join(',')
            // params.two=this.number.two.join(',')
            // params.three=this.number.three.join(',')
            // params.four=this.number.four.join(',')
            // params.five=this.number.five.join(',')
            params.content = JSON.stringify({
                content:this.form,
                number:this.number
            })
            params.type='BOOKMARK'
            params.id = this.form.id
            params.platformId=JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.post('/manage/unit/catalog/bibliography/printSetting',params)
                .then(res=>{
                    this.getList()
                    this.$message.success('保存成功');
                })
        },
        del(){
            // console.log(this.form)
            this.ax.delete('/manage/unit/catalog/bibliography/printSetting?ids='+this.form.id)
                .then(res=>{
                    this.form={}
                     this.$message.success('删除成功');
                     this.getList()
                     this.type=''
                })
        },
        getList(){
            this.ax.get('/manage/unit/catalog/bibliography/printSetting',{params:{type:'BOOKMARK',platformId:JSON.parse(localStorage.getItem("user")).platform.id,size:999,page:0}})
                .then(res=>{
                    this.option = res.content

                })
        },
        print() {

        }
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
.floor{
    padding: 5px;
    border: 1px solid #ddd;
    border-top: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
}
.footer{
    justify-content: flex-end;
}

.label{
    width: 150px;
    text-align: right;
}
</style>
