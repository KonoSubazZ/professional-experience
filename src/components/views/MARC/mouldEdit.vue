<template>
    <div>
        <div class="container libraryInfo" :style="$height()" @click="closeMenu">
            <div class="padding_20">
                <el-tabs
                    v-model="activeName"
                    class="m-b-20"
                >
                    <el-tab-pane label="MARC编目" name="second" class="Marc">
                        <table border="0" cellpadding="0" cellspacing="0" @contextmenu="openMenu">
                            <tr class="w-100 MarcTitle MarcText">
                                <td>
                                    <div class="textBox f-s-12 f-w-b">字段名称</div>
                                </td>
                                <td>
                                    <div class="box_marc f-s-12 f-w-b">字段标识符</div>
                                </td>
                                <td>
                                    <div class="box_marcs f-s-12 f-w-b">指</div>
                                </td>
                                <td>
                                    <div class="w-50 f-s-12 f-w-b padding_20">内容</div>
                                </td>
                            </tr>
                            <tr v-for="(item,i) of form.newMarc" :key="i">
                                <td class="textMarc">
                                     <el-input
                                        v-model="item[0]"
                                        class=""
                                        :id="'code'+i"
                                    ></el-input>
                                </td>
                                <td class="textCode">
                                    <el-input
                                        v-model="item[1]"
                                        class="w-100"
                                        :id="'code'+i"
                                        maxlength="3"
                                    ></el-input>
                                </td>
                                <td class="textQ">
                                    <el-input
                                        v-model="item[2]"
                                        :id="'index'+i"
                                        maxlength="2"
                                    ></el-input>
                                </td>

                                <td class="w-84">
                                    <div class="w-100">
                                        <textarea
                                            spellcheck="false"
                                            v-model="item[3]"
                                            class="textareas"
                                            style="border:0"
                                            :id="'input'+i"
                                        ></textarea>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                </el-tabs>
                <!-- 已有 -->
              
                <div class="display_flex choose">
                    <div @click="save('formData')" class="text_center cursor m-r-20">
                        <img src="../../../assets/img/add.png" class="btn_img" />
                        <div class="f-s-14">保存(F8)</div>
                    </div>
                    <div @click="back" class="text_center cursor m-r-20">
                        <img src="../../../assets/img/return.png" class="btn_img" />
                        <div class="f-s-14">取消(F9)</div>
                    </div>
                </div>
            </div>

            <div
                class="marcMenus"
                id="marcMenus"
                :style="menu?'display:block':'display:none'"
                @click="getFun">
                <div class="display_flex between f-s-12 muens" data-index="2">
                    <div data-index="2">插入字段</div>
                    <div data-index="2">Insert</div>
                </div>
    
            </div>
        </div>
    </div>
</template>

<script>
import List from '../../view/List';
import Vue from 'vue';
export default {
    components: {
        List
    },
    data() {
        return {
            activeName: 'second',
            menu:false,
            form:{},
            chooseValueIndex:'',
            chooseValue:''
        };
    },
    created() {
        console.log(JSON.parse(this.$route.query.info))
        let info  = JSON.parse(this.$route.query.info)
        if(info.newMarc){
         
        }else{
            info.newMarc=',,,'
        }
         info.newMarc = info.newMarc.split(';').map(it=>{
               it = it.split(',')
               return it
           })
        console.log(info.newMarc)
        this.form  = info
    },
    mounted() {
        document.onkeydown = (e) => {
            // // console.log(e);
            let key = window.event.keyCode;
            if (key == 17) {
                return;
            }
            if (key == '78' && e.altKey) {
                this.form.newMarc = [];
                this.form.newMarc = this.form.marcFieldDetails.map((it) => {
                    let arr = [];
                    arr[0] = it.note;
                    arr[1] = it.code;
                    arr[2] = '';
                    arr[3] = '';
                    return arr;
                });
            }

            // save
            if (key == 119) {
                e.preventDefault();
                this.save('formData');
            }
            // back
            else if (key == 120) {
                this.back();
            } else if (key == '33' && e.path.length == 21) {
                //page
                e.preventDefault();
                let input = document.getElementById('input0');
                input.focus();
            } else if (key == '34' && e.path.length == 21) {
                //page
                e.preventDefault();
                let id = this.form.newMarc.length - 1;
                let input = document.getElementById('input' + id);
                // // console.log(input);
                input.focus();
            } else if (key == '36' && e.path.length >= 21) {
                //home

                let id = e.target.id;

                let num1 = id.toString().replace(/[^\d\.\d]/gi, '');
                // // console.log(num1);
                id = id.replace(num1, '');
                // // console.log(id);
                let input = '';
                if (e.target.selectionStart == this.selectionStart) {
                    this.selectionStart = -1;
                    if (id == 'input') {
                        input = 'index';
                    } else if (id == 'index') {
                        input = 'code';
                    }
                    // // console.log(input + num1);
                    let doc = document.getElementById(input + num1);
                    // // console.log(doc);
                    doc.focus();
                } else {
                    this.selectionStart = 0;
                }

                //  let id = this.form.newMarc.length-1
                //  let input = document.getElementById('input'+id)
                //  input.focus();
            } else if (key == '38' && e.path.length == 21) {
                //方向
                let id = e.path[0].id;
                id = id.replace('input', '');

                id -= 1;
                if (id < 0) {
                    id = 0;
                } else if (id > this.form.newMarc.length) {
                    id = this.form.newMarc.length;
                }
                let input = document.getElementById('input' + id);
                input.focus();
            } else if (key == '40' && e.path.length == 21) {
                //方向
                let id = e.path[0].id;
                id = id.replace('input', '');
                id = id * 1 + 1;
                if (id < 0) {
                    id = 0;
                } else if (id > this.form.newMarc.length) {
                    id = this.form.newMarc.length;
                }
                let input = document.getElementById('input' + id);
                input.focus();
            } else if (key == 112) {
                e.preventDefault();
                let price = document.getElementById('price');
                price.focus();
            } else if (key == 113) {
                e.preventDefault();
                let addnumber = document.getElementById('addnumber');
                addnumber.focus();
            } else if (key == 114) {
                e.preventDefault();
                let code = document.getElementById('code');
                code.focus();
                speciesNumber;
            } else if (key == 115) {
                let speciesNumber = document.getElementById('speciesNumber');
                speciesNumber.focus();
            } else if (key == '78' && e.ctrlKey) {
                e.preventDefault();
            } else if (key == '13' && e.ctrlKey) {
                //插入
                document.execCommand('insertText', 'false', '▼');
            } else if (key == '45' && e.path.length == 21) {
                //字段

                this.form.newMarc.splice(this.chooseValueIndex * 1 + 1, 0, ['', '', '', '']);
            } else if (key == '68' && e.ctrlKey) {
                //ctrl+d
                e.preventDefault();
                this.form.newMarc.splice(this.chooseValueIndex, 1);
            } else if (key == '68' && e.altKey) {
                //alt+c
                e.preventDefault();

                let index = this.form.newMarc[this.chooseValueIndex][3].lastIndexOf('▼');

                if (index != -1) {
                    let str = this.form.newMarc[this.chooseValueIndex][3].slice(index);
                    let arr = this.form.newMarc;
                    arr[this.chooseValueIndex][3] = arr[this.chooseValueIndex][3].replace(str, '');
                    this.form.newMarc = arr;
                    this.checkContent('', this.chooseValueIndex, 'input' + this.chooseValueIndex);
                    Vue.set(this.form.newMarc, '', '');
                }
            } else if (key == '67' && e.shiftKey && e.ctrlKey && !e.altKey) {
                // c+s+c
                sessionStorage.setItem('marc', JSON.stringify(this.form.newMarc));
            } else if (key == '86' && e.shiftKey && e.ctrlKey && !e.altKey) {
                //c+s+v
                this.form.newMarc = JSON.parse(sessionStorage.getItem('marc'));
            } else if (key == '83' && e.altKey && !e.shiftKey && !e.ctrlKey) {
                //alt+s
                this.save('formData');
            } else if (key == '66' && e.ctrlKey && !e.shiftKey && !e.altKey) {
                //拼音
                //   // console.log(123)
                //  Vue.set(this.form.newMarc, '', '');
                 e.preventDefault();
               
                let start = e.path[0].selectionStart;
                let end = e.path[0].selectionEnd;
                let chooose = e.path[0].value.slice(start, end);

                let str = this.pinyin(chooose, { style: this.pinyin.STYLE_NORMAL }).join(' ');

                document.execCommand('insertText', 'false', chooose);

                this.form.newMarc[this.chooseValueIndex][3] = this.form.newMarc[this.chooseValueIndex][3] + '▼9' + str;

                //  this.$forceUpdate()
               
            } else if (key == '80' && !e.ctrlKey && e.altKey && !e.shiftKey) {
                //排序
                this.form.newMarc.sort((a, b) => {
                    return a[1] - b[1];
                });
            } else if (key == '89' && !e.ctrlKey && e.altKey && !e.shiftKey) {
                //校验
                this.checkValue();
            }
        };
    },
    methods: {
            
        // 保存
        save() {
            // console.log(this.form.newMarc)
              this.form.newMarc = this.form.newMarc.map((it) => {
                                it = it.join(',');
                                return it;
                            })
                            .join(';');
              this.sloading();
                    this.ax
                        .post('/manage/unit/system/systemSettings/marcTemplate', this.form)
                        .then(res => {
                            this.sloading();
                            this.$message.success('保存成功');
                            this.back()
                            this.bus.$emit(`flash_/manage/unit/system/systemSettings/marcTemplate`, res);
                        })
                        .catch(res => {
                            this.sloading();
                        });
        },
         // 右键菜单
        openMenu(e) {
            // console.log(e);

            e.preventDefault();

            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            if(start && end){
                let str = e.target.value.slice(start, end);

                // // console.log(e.target.value);

                if (str == '' || str == null) {
                    this.chooseValue = e.target.value;
                } else {
                    this.chooseValue = str;
                }
            }
            let marcMenus = document.getElementById('marcMenus');

            var x = e.clientX; // 鼠标的x坐标
            var y = e.clientY; //鼠标的y坐标
            // // console.log(y);
            let hei = document.documentElement.clientHeight;
            // // console.log(hei);
            if (y >= hei - marcMenus.offsetHeight || hei - y < 420) {
                if (marcMenus.offsetHeight) {
                    y = y - marcMenus.offsetHeight;
                } else {
                    y = y - 400;
                }
            }
            // // console.log(y);
            marcMenus.style.top = y + 'px';
            marcMenus.style.left = x + 'px';

            this.menu = true;
        },
        closeMenu() {
            this.menu = false;
        },
         // 菜单点击
        getFun(e) {
            let index = e.target.dataset.index;
            if (index == 2) {
                if(this.form.newMarc){
                    //插入
                   this.form.newMarc.splice(this.chooseValueIndex * 1 + 1, 0, ['', '', '', '']);
                }else{
                     this.form.newMarc =  []
                     this.form.newMarc.splice(this.chooseValueIndex * 1 + 1, 0, ['', '', '', '']);
                }
            }
        },

       
    }
};
</script>

<style >
.container .el-form-item--mini.el-form-item,.container  .el-form-item--small.el-form-item{
    margin-bottom: 5px;
}
.Marc .el-input--small .el-input__inner{
    height: 20px;
    line-height: 20px;
}
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
.library_bottom {
    width: 100%;
    height: 2.5rem;
    background: #ffffff;
    box-shadow: 0px -1px 1px #94949429;
    padding: 0 20px !important;
    font-size: 0.88rem;
    color: #777777;
    box-sizing: border-box;
}
.library_bottom div {
    padding: 0 20px;
}
.fromFirst {
    /* overflow: scroll; */
    box-sizing: border-box;
    padding: 5px;
}
.MarcTitle {
    width: 100%;
    text-align: left;
    /* padding: 0 20px; */
    height: 40px;
    background: rgba(241, 245, 249, 1);
}
.MarcContents {
    width: 100%;
    text-align: left;
    /* padding: 0 20px; */
    min-height: 45px;
}
.MarcText {
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    color: rgba(48, 49, 57, 1);
}
.MarcContent {
    height: 50px;
    line-height: 50px;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 20px;
    box-sizing: border-box;
}
.MarcContents {
    box-sizing: border-box;
    padding-right: 10px;
    border: 1px solid rgba(221, 221, 221, 0.1);
}

.MarcContents:not(:first-child) {
    border-top: 0;
}
.MarcContents input {
    border: 0;
}
.box_marc {
    width: 70px;
    border-right: 1px solid #ddd;
    text-align: center;
    box-sizing: border-box;
    height: 45px;
    line-height: 45px;
    /* min-height: 44px; */
}
.maxbe {
    position: relative;
}
.maxbe_a {
    position: absolute;
    top: 10px;
    left: 22px;
}

.textBox {
    /* background: #0abebe; */
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-right: 1px solid #ddd;
}

.textarea {
    resize: none;
}
.textareas,
.textareas:focus {
    resize: none;
    border: 0;
    box-sizing: border-box;
    outline: none;
}
.box_marcs {
    height: 40px;
    line-height: 40px;
    width: 50px;
    border-right: 1px solid #dddddd;
    text-align: center;
    /* margin:auto; */
}
.textMarc {
    width: 120px;
    background: #ddeeee;
    text-align: center;
    line-height: 11px;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
    box-sizing: border-box;
}

.textMarc .el-input__inner {
    border: 0 !important;
}
.textCode {
    width: 70px;
    border-bottom: 1px solid #ddd;
    /* border: 0 !important; */
    border-right: 1px solid #ddd !important;
}
.textCode .el-input__inner,
.textQ .el-input__inner {
    border: 0 !important;
}
.textCode .el-input.is-active .el-input__inner,
.textCode .el-input__inner:focus,
.textQ .el-input.is-active .textQ .el-input__inner,
.textQ .el-input__inner:focus {
    border: 0;
}
.textQ {
    width: 50px;
    /* border: 0 !important; */
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd !important;
}
.textareas {
    width: 100%;
    height: 100%;
    line-height: 22px;
}
.w-84 {
    width: 84%;
}

.marcMenus {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 200px;
    min-height: 80px;
    background: #e8f7f8;
    border: 1px solid #f5f5f5;
    box-shadow: 0 0 1px #777777;
    /* display: none; */
    padding: 0 0 0 20px;
}

.muens {
    background: #fff;
    padding: 5px 10px;
}
.muens:hover {
    background: #f5f5f5;
}
.hr {
    height: 0px;
    width: 100%;

    background: #fff;
    padding: 5px 0;
}
.br {
    border-bottom: 1px solid #ddd;
}
.blockDel{
    height: 64px;
}
</style>
