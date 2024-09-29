<template>
    <div>
        <v-head class="cope_none"></v-head>
        <!-- <img src="../../assets/img/indexBg.png" class="bgindex img" alt=""> -->
        <div class="containeres" :style="this.$height(70)">
            <div class="page display_flex start between">
                <div class="w-20 m-r-10 background_f b-b-1 h-100">
                    <div class="tree_header">
                        <div>帮助文档目录</div>
                    </div>
                    <div>
                        <el-menu class="sidebar-el-menu" :style="$height(180)" text-color="#333" active-text-color="#1DA1F2">
                            <div v-for="item of tableData" :key="item.id">
                                <div v-if="item.subs.length > 0">
                                    <el-submenu :index="item.title + item.id">
                                        <template slot="title">
                                            <div @click="getInfo(item)">
                                                <span slot="title">{{ item.title }}</span>
                                            </div>
                                        </template>
                                        <div v-for="items of item.subs" :key="items.id">
                                            <div v-if="items.subs && items.subs.length > 0">
                                                <el-submenu :index="items.title + items.id">
                                                    <template slot="title">
                                                        <div @click="getInfo(items)">
                                                            <span slot="title">{{ items.title }}</span>
                                                        </div>
                                                    </template>
                                                    <div v-for="its of items.subs" :key="its.id">
                                                        <el-menu-item :index="its.title + its.id">
                                                            <div @click="getInfo(its)">
                                                                <span slot="title">{{ its.title }}</span>
                                                            </div>
                                                        </el-menu-item>
                                                    </div>
                                                </el-submenu>
                                            </div>
                                            <div v-else>
                                                <el-menu-item :index="items.title + items.id">
                                                    <div @click="getInfo(items)">
                                                        <span slot="title">{{ items.title }}</span>
                                                    </div>
                                                </el-menu-item>
                                            </div>
                                        </div>
                                    </el-submenu>
                                </div>
                                <div v-else @click="getInfo(item)">
                                    <el-menu-item :index="item.title + item.id">
                                        <span slot="title">{{ item.title }}</span>
                                    </el-menu-item>
                                </div>
                            </div>
                        </el-menu>
                    </div>
                </div>
                <!-- 主体内容 -->
                <div class="w-80 background_f conents_body" :style="$height(180)">
                    <div v-if="forms.note">
                        <div v-html="forms.note" class="conents_center" :style="$height(200)"></div>
                    </div>
                    <!-- 新增加 -->
                    <div v-else>
                        <!-- <span>内容持续更新当中……</span> -->
                        <h2 style="text-align:center"><span style="color: rgb(0, 0, 0);">点击目录查看帮助文档内容！</span></h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹框  （暂时未使用到） -->
        <el-dialog title="标题管理" :visible.sync="createModel" width="30%" :close-on-click-modal="false" @close="close">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="m-b-30">
                <el-form-item label="上级字段" prop="parentId" v-if="form.level == 1">
                    <el-select v-model="form.parentId" placeholder="请选择" class="w-100">
                        <el-option v-for="item in tableData" :key="item.id" :label="item.title" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="标题名称">
                    <el-input v-model="form.title" maxlength="200" placeholder="请输入标题名称"></el-input>
                </el-form-item>

                <el-form-item label="排序字段">
                    <el-input v-model.number="form.sort" placeholder="请输入整数" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createModel = false">取 消</el-button>
                <el-button type="primary" @click="save_mar">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import viewEditor from '../page/VueEditor';
import vHead from './Header.vue';
export default {
    components: {
        viewEditor,
        vHead
    },
    data() {
        return {
            bus: this.bus(this),
            list: null,
            tableData: [{ title: '', id: 0, subs: [{ id: '' }] }],

            // options: [],
            createModel: false,//标题按钮的控制
            disabled: true,
            type: 0,
            forms: {},
            form: {},
            rules: {
                type: [{ parentId: true, message: '请选择', trigger: 'change' }],
                title: [{ required: true, message: '请输入', trigger: 'blur' }],
                sort: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getList(0);
    },
    methods: {
        getInfo(val) {
            // console.log(val)
            this.forms = val;
            this.disabled = false;
        },
        clearInfo(val) {
            this.disabled = true;
            this.forms = val;
        },
        getList(parentId) {
            let params = {
                parentId,
                level: 1
            };
            this.ax.get('/manage/unit/general/instructions', { params }).then((res) => {
                this.tableData = res;
                console.log(this.tableData)
            });
        },

        add(type) {//未调用
            this.createModel = true;
            this.form.level = type;
        },
        save_mar() {//弹框里边的函数
            if (this.form.level == 0) {
                this.form.parentId = 0;
            }
            this.ax.post('/database/instructions', this.form).then((res) => {
                this.createModel = false;
                this.getList(0);
                this.$message.success('保存成功');
            });
        },
        close() {
            this.form.level = '';
        },
        getMsg(val) {//未调用
            // // console.log(val)
            this.forms.note = val;
        },
        save() {
            this.ax.post('database/instructions', this.forms).then((res) => {
                this.$message.success('保存成功');
            });
        }
    }
};
</script>

<style scoped>
.containeres {
    padding: 20px 15%;
    position: relative;
    box-sizing: border-box;
    z-index: 1;
    overflow: auto;
    background: #f4f5f5;
}
/* .containeres ::-webkit-scrollbar{
	width: 20px;
    height: 100%;
    color: transparent;
}  */
.page {
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid #ddd;
}
.tree_header {
    width: 100%;
    text-align: center;
    line-height: 3.5rem;

    height: 3.5rem;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
    box-sizing: border-box;
}
.leftBox {
    border-radius: 15px;
    overflow: hidden;
}
.tree_body {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
}
/* .classify{ */
/* background: #F9F9F9; */
/* } */
.background_f {
    /* background: #fff; */
    overflow: hidden;
}
.h-100 {
    height: 100%;
}
.b-b-1 {
    /* border: 1px solid #ddd; */
    border-right: 1px solid #ddd;
}
.bgindex {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 0;
}
.conents_body {
    margin-top: 56px;

    box-sizing: border-box;
    overflow: hidden;
}
.conents_center {
    overflow: auto;
    padding: 0 5% 10px 5%;
}
.sidebar-el-menu {
    overflow: auto;
}
/*.conents_center>>>.ql-video{*/
/*  width: 100%;*/
/*  height: 300px;*/
/*}*/
</style>
