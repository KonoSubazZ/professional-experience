<template>
    <div>
        <div class="container libraryInfo" :style="height">
            <div class="padding_20 m-b-20">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="条码打印预览" name="first">
                        <div id="workInfo">
                            <!--  box-sizing: border-box; -->
                            <div
                                class="display_flex wrap start box"
                                :style="
                                    'display:block;height:' +
                                     +
                                    'px;padding-left:' +
                                    css.left +
                                    'px;padding-top:' +
                                    css.top +
                                    'px;width:' +
                                    (css.width * params.content.columnNumber + css.lineSpacing) +
                                    'px;font-family:' +
                                    params.content.family
                                "
                            >
                                <div
                                    class="box"
                                    :style="
                                        'display:inline-block;height:' +
                                        css.height +
                                        'px;width:' +
                                        css.width +
                                        'px;padding-top:' +
                                        css.padding +
                                        'px;margin-bottom:' +
                                        css.lineSpacing +
                                        'px;margin-right:' +
                                        css.columnSpacing +
                                        'px;font-size:' +
                                        params.content.size +
                                        'px'
                                    "
                                    :class="css.align"
                                    v-for="(item, i) of list"
                                    :key="i"
                                >
                                    <div v-if="params.content">{{ params.content.title }}</div>
                                    <img :id="'a' + item" style="width: 90%; height: 55%" />
                                    <div>{{ item }}</div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="display_flex choose">
                    <!-- <div @click="print" class="text_center cursor m-r-20">
                        <img src="../../../assets/img/lookFor.png" class="btn_img" />
                        <div class="f-s-14">打印</div>
                    </div>el-icon-printer -->
                    <el-button-group>
                        <el-button type="danger" plain icon="el-icon-arrow-left" @click="back">返回</el-button>
                        <el-button type="primary" plain icon="el-icon-printer" @click="print">打印</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>
        <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
    </div>
</template>

<script>
const qs = require('qs');
import formView from '../../view/form';
export default {
    components: {
        formView
    },

    data() {
        var JsBarcode = require('jsbarcode');
        return {
            height: '', //高度
            activeName: 'first',
            css: {},
            info: {},
            list: [],
            params: [],
            lists: []
        };
    },
    created() {
        this.height = this.$height();
        if (this.$route.query.info) {
            this.info = JSON.parse(this.$route.query.info);
        }
        if (this.$route.query.params) {
            this.params = JSON.parse(JSON.parse(this.$route.query.params).content);
            // console.log(this.params);
            this.getCss(this.params); //设置打印样式
        }
    },
    mounted() {},
    methods: {
        getCss(res) {
            // console.log(res.content,'11111111111111111')
            // // console.log(this.params.number && this.params.number.hhh)
            if (res.content.width) {
                this.css.width = (res.content.width / 25.4) * 96;
            }
            if (res.content.height) {
                this.css.height = (res.content.height / 25.4) * 96;
            }
            if (res.content.padding) {
                this.css.padding = (res.content.padding / 25.4) * 96;
            }
            if (res.content.left) {
                this.css.left = (res.content.left / 25.4) * 96;
            }
            if (res.content.top) {
                this.css.top = (res.content.top / 25.4) * 96;
            }
            if (res.content.columnSpacing) {
                this.css.columnSpacing = (res.content.columnSpacing / 25.4) * 96;
            }
            if (res.content.lineSpacing) {
                this.css.lineSpacing = (res.content.lineSpacing / 25.4) * 96;
            }
            if (res.content.columnNumber) {
                let width;

                switch (res.columnNumber) {
                    case 1:
                        width = 'w-100';
                        break;

                    case 2:
                        width = 'w-50';
                        break;
                    case 3:
                        width = 'w-30';
                        break;
                    case 4:
                        width = 'w-25';
                        break;

                    default:
                        width = 'w-20';
                        break;
                }
                this.css.widths = width;
            }
            if (res.content.alignmentType == 'CENTER') {
                this.css.align = 'text_c';
            } else if (res.content.alignmentType == 'LEFT') {
                this.css.align = 'text_l';
            } else if (res.content.alignmentType == 'RIGHT') {
                this.css.align = 'text_r';
            }
            if (res.content.number) {
                for (let index = 1; index < res.content.number; index++) {
                    this.info = this.info.concat(this.info);
                }
            }
            this.getPrant();
            // this.info.sort((a,b)=>{
            //     return a.id-b.id
            // })
            // // console.log(this.info)
            // if(res.content.linesNumber && res.content.columnNumber){
            //   this.info =   this.split_array(this.info,res.content.linesNumber*res.content.columnNumber)
            // }

            // this.info.slice()
        },
        getPrant() {
            let params = {
                endBarCode: this.info.codeEnd,
                startBarCode: this.info.codeStart
            };
            this.ax.get('/manage/unit/catalog/bibliography/barCode', { params }).then((res) => {
                this.list = res;
                setTimeout((res) => {
                    this.list.map((it, i) => {
                        JsBarcode(`#a${it}`, it, {
                            width: 1, //设置条之间的宽度
                            height: 70, //高度
                            displayValue: false
                        });
                    });
                });
            });
        },
        print() {
            let printPage = document.getElementById('workInfo');
            var f = document.getElementById('printf');
            f.contentDocument.write(printPage.innerHTML);
            f.contentDocument.write(`<style type="text/css">
    .display_flex{
		display: flex;
		align-items: center;
        page-break-after:always;
	}
	.start{
		align-items: flex-start;
	}
	.wrap{
		flex-wrap: wrap;
	}
    .text_c{text-align: center;}
    .text_l{
        text-align: left;
    }
    .text_r{
        text-align: right;
    }
    .box{
        height:(css.height * params.content.linesNumber + css.columnSpacing);
        box-sizing: border-box;
    }
    .workInfo:not(:first-child){
        padding-top: 8px;
    }
    </style>`);
            f.contentDocument.close();
            f.contentWindow.print();
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
.laber {
    color: #333;
    font-size: 16px;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
}
.text_c {
    text-align: center;
}
.text_l {
    text-align: left;
}
.text_r {
    text-align: right;
}
.box {
    box-sizing: border-box;
}
</style>
