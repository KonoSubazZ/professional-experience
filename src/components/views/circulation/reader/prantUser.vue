<template>
    <div class="backBG">
        <div class="display_flex end w-100">
            <el-button type="primary" @click="print">打印</el-button>
            <el-button @click="back">返回</el-button>
        </div>

        <div id="A4">
            <div class="A4 display_flex wrap between" style="padding-bottom:22px" v-for="(item, index) of list"
                :key='index'>
                <div class="cardBox" v-for="(items, j) of item" :key='j'>
                    <div class="marleft">
                        <div class="logo_iocn">
                            <img v-if="items.photo != ''" :src="items.photo" />
                            <img v-else src="../../../../assets/img/headicon.png">
                        </div>
                        <img :id="'a' + items.number" style="width:100%;height:35px;margin-top: 20px" v-if="items.number" />
                        <span v-else></span>
                    </div>
                    <div class="right_box">
                        <div class="display_flex m-b-20">
                            <div>{{ items.readerUnitName }}</div>
                        </div>
                        <div class="display_flex m-b-10">
                            <div class="readTitle">读者姓名:</div>
                            <div class="readInfo">{{ items.name }}</div>
                        </div>
                        <div class="display_flex m-b-10" v-for="item of check" :key="item">
                            <div class="readTitle">{{ data[item] }}:</div>
                            <div class="readInfo">{{ items[item] }}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {

    data() {
        var JsBarcode = require('jsbarcode');
        return {
            bus: this.bus(this),
            check: [],
            info: {},
            data: [],
            list: []
        };
    },
    created() {
        this.info = JSON.parse(this.$route.query.info);
        // console.log(this.info);
        // return
        this.check = JSON.parse(this.$route.query.check);
        let arr = JSON.parse(this.$route.query.data);
        this.info.map(items => {
            arr.map(it => {
                this.data[it.id] = it.name
                if (it.type == 'times') {
                    items[it.id] = this.getTime(items[it.id], 'YYYY-MM-DD')
                }
                if (it.type == 'select') {
                    it.options.map(its => {
                        if (its.id == items[it.id]) {
                            items[it.id] = its.name
                        }
                    })
                }
            })
        })
        let number = Math.ceil(this.info.length / 8)
        for (let index = 0; index < number; index++) {
            let arrs = this.info.slice(8 * (index * 1), 8 * (index * 1 + 1))
            this.list.push(arrs)
        }
        let listArr = [].concat(...this.list)//把一个大数组中多个小数组进行合并
        setTimeout(() => {
            listArr.map((it, i) => {//修改了这里,之前是this.list[0]
                if (it.number != null) {
                    JsBarcode(`#a${it.number}`, it.number, {
                        width: 1,//设置条之间的宽度
                        height: 70,//高度
                        displayValue: false
                    });
                }
            });
        })


        // console.log(this.list);
    },
    methods: {
        getValueFromItem(item, key) {
            if (key.indexOf('.') < 0) {
                return item[key];
            }
            let keys = key.split('.');

            keys.forEach((it) => {
                let previous = item;
                item = item[it];
                if (!item) {
                    item = previous;
                }
            });
            return item;
        },
        getStyle(valueItem, metaItem) {
            let style = {
                color: '#333'
            };
            if (metaItem.color) {
                style = {
                    color: metaItem.color
                };
            }

            if (metaItem.clickable) {
                style.color = '#409EFF';
                style.cursor = 'pointer';
            }
            return style;
        },
        print() {
            let printPage = document.getElementById('A4');
            var f = document.getElementById('printf');
            f.contentDocument.write(printPage.innerHTML);
            f.contentDocument.write(`
            <style type="text/css">
                .A4{
                    background: #fff;
                    margin:0 auto;
                }
                .title {
                    text-align: center;
                    font-size: 30px;
                }

                .userHeader {
                    width: 160px;
                    height: 200px;
                    border: 1px solid #ddd;
                }
                .display_flex{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .wrap{
                    flex-wrap: wrap;
                }
                .between{
                    justify-content: space-between;
                }
                .cardBox{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 30px;
                    background: #fff;
                    width: 353.5px;
                    height: 204px;
                    margin-bottom: 18px;
                    padding:14px;
                    box-sizing: border-box;
                    border:1px dashed #ddd;
                }
                .logo_iocn{
                    border:1px dashed #ddd;
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                }
                .logo_iocn img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
}
                .readTitle{
                    margin-right: 9px;
                    width: 85px;
                    text-align: right;
                    font-size:12px;
                }
                .readInfo{
                    width: 100px;
                    font-size:12px;
                }
                .start{
                    align-items: flex-start;
                }
                .m-r-20{ 
                    margin-right: 20px;
                }
                .m-b-10{
                    margin-bottom: 10px;
                }
                .m-b-20{
                    margin-bottom: 20px;
                }
                .m-b-30{
                    margin-bottom: 30px;
                }
                .w-40{
                    width: 40% !important;
                }
                .w-50{
                    width: 50% !important;
                }
                .w-80{
                    width: 80% !important;
                }
                .padding_20{
                    padding: 0 20px;
                }
                .text_right{
                    text-align: right;
                    width: 130px;
                }
                .wrap{
                    flex-wrap: wrap;
                }
                .right_box{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  }
                .marleft{
                   margin-left: 30px;
                }
            </style>`);
            f.contentDocument.close();
            f.contentWindow.print();
        }
    }
};
</script>

<style scoped>
.right_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.marleft {
    margin-left: 30px;
}

.backBG {
    background: #e4e3e3;
    padding-top: 50px;
    padding: 50px;
    overflow: auto;
}

.A4 {
    background: #ddd;
    margin: 0 auto;
    width: 800px;
    border: 1px solid #ddd;
    overflow: auto;
    min-height: 500px;
    padding: 20px;
    box-sizing: border-box;
    align-items: flex-start;
}

.title {
    text-align: center;
    font-size: 30px;
}

.userHeader {
    width: 160px;
    height: 200px;
    border: 1px solid #ddd;
}

.text_right {
    text-align: right;
    width: 130px;
}

.cardBox {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    background: #fff;
    width: 353.5px;
    height: 204px;
    margin-bottom: 18px;
    padding: 14px;
    box-sizing: border-box;
}

.logo_iocn {
    border: 1px dashed #ddd;
    width: 90px;
    height: 90px;
    border-radius: 50%;
}

.logo_iocn img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.readTitle {
    margin-right: 9px;
    width: 85px;
    text-align: right;
    font-size: 12px;
}

.readInfo {
    width: 100px;
    font-size: 12px;
}
</style>
