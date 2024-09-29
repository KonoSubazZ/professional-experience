<template>
    <div>
        <div class="container libraryInfo" :style="'height:' + height + 'px'">
            <div class="padding_20 m-b-20">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="条码打印" name="first">
                        <div>
                            <form-view :list="list" :row="1" :model="form" @getForm="getForm"></form-view>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="display_flex choose">
                    <el-button-group>
                        <el-button type="primary" plain icon="el-icon-setting" @click="setting">打印设置</el-button>
                        <el-button type="primary" plain icon="el-icon-printer" @click="lookFor">预览</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog title="设置" :visible.sync="showSet" width="80%" top="5vh" @close="closeMode" :close-on-click-modal="false">
            <setData :type="'BARCODE'"></setData>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModes">关 闭</el-button>
                <!-- <el-button type="primary" @click="save('form')">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
const qs = require('qs');
import formView from '../../view/form';
import setData from './console/barAdd';
export default {
    components: {
        formView,
        setData
    },
    data() {
        return {
            bus: this.bus(this),
            height: '', //高度
            activeName: 'first',
            form: {},
            forms: {},
            list: [
                { name: '文献条码范围', id: 'codeStart', type: 'around', end: 'codeEnd' },
                { name: '选择模板', id: 'temp', type: 'select', options: [] }
            ],
            showSet: false,
            rules: {},
            checked: '',
            options: [],
            tableData: []
        };
    },
    created() {
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.getList();
        document.onkeydown = (e) => {
            let key = window.event.keyCode;
            // console.log(e);
            // f
            if (e.keyCode == 70 && e.path.length == 4) {
                // this.search()
            }
            // t
            if (e.keyCode == 84 && e.path.length == 4) {
                // this.add()
            }
            // c
            if (e.keyCode == 67 && e.path.length == 4) {
                // this.add()
            }
        };
    },
    methods: {
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 170;
            }, 100);
        },
        closeModes() {
            this.showSet = false;
            this.getList();
        },
        closeMode() {
            this.getList();
        },
        getList() {
            this.ax
                .get('/manage/unit/catalog/bibliography/printSetting', {
                    params: { type: 'BARCODE', platformId: JSON.parse(localStorage.getItem('user')).platform.id, size: 999, page: 0 }
                })
                .then((res) => {
                    // console.log(res,'barCode.res')
                    this.list[1].options = res.content;
                });
        },
        getForm(val) {
            // // console.log()
            this.form = val;
        },

        lookFor() {
            //预览
            let table;
            if (this.activeName == 'first') {
                if (this.form.codeEnd) {
                    this.form.barCodeEnd = this.form.codeEnd;

                    this.form.barCodeStart = this.form.codeStart;
                } else {
                    return this.$message.error('请输入文献条码');
                }
                this.list[1].options.map((it) => {
                    if (it.id == this.form.temp) {
                        table = it;
                    }
                });
                if (!this.form.temp) {
                    return this.$message.error('请选择模板');
                    // return;
                }
                this.$router.push({
                    path: 'barCode/barCodeFor',
                    query: { info: JSON.stringify(this.form), params: JSON.stringify(table) }
                });
            }
        },
        setting() {
            //打印设置
            this.showSet = true;
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
</style>
