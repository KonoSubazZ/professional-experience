<template>
   <div>
        <div class="container libraryInfo " :style='height' >
            <div class="  padding_20 m-b-20">
                <el-tabs v-model="activeName" >
                    <el-tab-pane label="书标打印预览" name="first" >
                        <div id="workInfo">
                            <div v-for="(item,j) of info" :key='j'>
                                    <div  class="display_flex  wrap workInfo start  box "
                                    :style="'width:'+css.pageWidth+
                                    'px;padding-bottom:'+css.bottom+
                                    'px;max-height:'+css.pageHeight+
                                    'px;padding-left:'+css.left+
                                    'px;padding-top:'+css.top+
                                    'px;font-family:'+params.content.family"
                                    v-for="(it,index) of item" :key='index'>

                                            <div  class="cope_text box"
                                            :style="'display:block;height:'+css.height+'px;width:'+css.width+'px;padding-top:'+css.padding+'px;margin-bottom:'+css.lineSpacing+'px;margin-right:'+css.columnSpacing+'px;'"
                                            :class="css.align"  v-for="(item,i) of it" :key="i">
                                                    <span v-if="params.number && params.number.one[6]" :style="'display:inline-block;font-size:'+params.number.one[3]+'px;font-weight:'+params.number.one[4]">
                                                        <span >{{params.number.one[1]}}</span>
                                                        <span>{{item[params.number.one[0]]}}</span>
                                                        <span>{{params.number.one[2]}}</span>
                                                    </span>

                                                    <div v-if="params.number && params.number.one[5]"></div>

                                                    <span v-if="params.number && params.number.two[6]" :style="'display:inline-block;font-size:'+params.number.two[3]+'px;font-weight:'+params.number.two[4]">
                                                        <span>{{params.number.two[1]}}</span>
                                                        <span>{{item[params.number.two[0]]}}</span>
                                                        <span>{{params.number.two[2]}}</span>
                                                    </span>

                                                    <div v-if="params.number && params.number.two[5]"></div>

                                                    <span v-if="params.number && params.number.three[6] && item[params.number.three[0]]!='null'" :style="'display:inline-block;font-size:'+params.number.three[3]+'px;font-weight:'+params.number.three[4]">
                                                        <span v-if="item[params.number.three[0]]">{{params.number.three[1]}}</span>
                                                        <span>{{ item[params.number.three[0]] }}</span>
                                                        <span>{{params.number.three[2]}}</span>
                                                    </span>

                                                    <div v-if="params.number && params.number.three[5]"></div>

                                                    <span v-if="params.number && params.number.four[6]" :style="'display:inline-block;font-size:'+params.number.four[3]+'px;font-weight:'+params.number.four[4]">
                                                        <span>{{params.number.four[1]}}</span>
                                                        <span>{{item[params.number.four[0]]}}</span>
                                                        <span>{{params.number.four[2]}}</span>
                                                    </span>

                                                    <div v-if="params.number && params.number.four[5]"></div>

                                                    <span v-if="params.number && params.number.five[6]" :style="'display:inline-block;font-size:'+params.number.five[3]+'px;font-weight:'+params.number.five[4]">
                                                        <span>{{params.number.five[1]}}</span>
                                                        <span>{{item[params.number.five[0]]}}</span>
                                                        <span>{{params.number.five[2]}}</span>
                                                    </span>


                                            </div>
                                    </div>
                            </div>
                      </div>

                    </el-tab-pane>
                </el-tabs>
                 <div class="display_flex choose">
                 <el-button-group>
                                <el-button type="primary" plain icon="el-icon-arrow-left"  @click="back" >返回</el-button>
                                <el-button type="primary" plain icon="el-icon-printer"  @click="print" >打印</el-button>

                    </el-button-group>
               </div>

            </div>

        </div>
         <iframe id="printf" src width="0" height="0" frameborder="0"></iframe>
   </div>
</template>

<script>

const qs = require('qs');
import formView from '../../view/form'
export default {
    components:{
        formView
    },
    data() {
        return {bus: this.bus(this),
             height:'', //高度
             activeName:'first',
             params:{},
             css:{

             },
             info:[]
        };
    },
    created() {
       this.height = this.$height()

       let arrs = JSON.parse(this.$route.query.info);

       let arr = JSON.parse(this.$route.query.params)

       this.params = JSON.parse(arr.content)
        let allNumber=this.params.content.columnNumber*1 * this.params.content.linesNumber*1

        let page =  Math.ceil(arrs.length*this.params.content.number*1 /allNumber)

        if(this.params.content.number){
                let arres = []
                arrs.map(it=>{
                    for (let index = 0; index < this.params.content.number; index++) {
                               arres.push(it)
                    }
                })
                arrs = arres
            }
        for (let index = 0; index < page; index++) {
            let obj = arrs.slice(allNumber*(index*1),allNumber*(index*1+1))
            this.info.push(obj)

        }
        console.log(this.params.number.two)
         this.getCss(this.params) //设置打印样式
    },
    methods: {
        getDPI() {
            var arrDPI = new Array;
            var devicePixelRatio = window.devicePixelRatio || 1;
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth)* devicePixelRatio;
            arrDPI[1] = parseInt(tmpNode.offsetHeight)*devicePixelRatio;
            tmpNode.parentNode.removeChild(tmpNode);

            return arrDPI[0];

        },
        getCss(res){
          let dpi = this.getDPI()
            // console.log(this.css,'this.css')
            if(res.content.width){
                // console.log(res.content.width,'res.content.width');
                this.css.width =Math.ceil( (res.content.width/25.4)*dpi)
                // console.log(this.css.width,'this.css.width_dpi');

            }
             if(res.content.height){
                // console.log(res.content.height,'res.content.height');
                this.css.height = Math.floor((res.content.height/25.4)*dpi)
                // console.log(this.css.height,'this.css.height_dpi');

            }
             if(res.content.padding){
                // console.log(res.content.padding,'res.content.padding');
                this.css.padding = Math.ceil((res.content.padding/25.4)*dpi)

            }
             if(res.content.left){
                // console.log(res.content.left,'res.content.left');
                this.css.left =Math.ceil( (res.content.left/25.4)*dpi)

            }
              if(res.content.top){
                // console.log(res.content.top,'res.content.top');
                this.css.top =Math.ceil( (res.content.top/25.4)*dpi)

            }

            if(res.content.columnSpacing){
                // console.log(res.content.columnSpacing,'res.content.columnSpacing');
                this.css.columnSpacing = Math.ceil((res.content.columnSpacing/25.4)*dpi)

            }
             if(res.content.lineSpacing){
                // console.log(res.content.lineSpacing,'res.content.lineSpacing');
                this.css.lineSpacing = Math.ceil( (res.content.lineSpacing/25.4)*dpi )
            }
            // console.log(res.content.pageHeight,'pageHeight');
            this.css.pageHeight = Math.floor(( res.content.pageHeight/25.4)*dpi)
            // console.log(res.content.pageWidth,'pageWidth');
            this.css.pageWidth = Math.ceil(( res.content.pageWidth/25.4)*dpi )

            this.css.bottom = this.css.pageHeight-this.css.top - this.css.height * res.content.linesNumber*1 - (res.content.linesNumber*1)*res.content.lineSpacing
            // console.log(this.css.bottom,'bottom');
           if(res.content.columnNumber){
            // console.log(res.content.columnNumber,'columnNumber');
               let width

               switch (res.columnNumber) {
                 case 1:
                     width = 'w-100'
                     break;

                  case 2:
                     width = 'w-50'
                     break;
                  case 3:
                     width = 'w-30'
                     break;
                  case 4:
                     width = 'w-25'
                     break;

                 default:
                     width = 'w-20'
                     break;
             }
             this.css.widths = width

            }
            if(res.content.alignmentType=='CENTER'){
                this.css.align ='text_c'
            }else if(res.content.alignmentType=='LEFT'){
                   this.css.align ='text_l'
            }else if(res.content.alignmentType=='RIGHT'){
                   this.css.align ='text_r'
            }
            if(res.content.linesNumber && res.content.columnNumber){
              this.info =   this.split_array(this.info,res.content.linesNumber*res.content.columnNumber)
            }
        },
        split_array(arr, len){//在getCss方法中调用
              var a_len = arr.length;
              var result = [];
              for(var i=0;i<a_len;i+=len){
                       result.push(arr.slice(i,i+len));
             }
             return result;
        },
         print() {
            let printPage = document.getElementById('workInfo');
            var f = document.getElementById('printf');
            f.contentDocument.write(printPage.innerHTML);//写入打印的内容；
             //写入打印内容的样式；
             f.contentDocument.write(`<style type="text/css">
                .display_flex{
                    display: flex;
                    align-items: center;
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
                    box-sizing: border-box;
                }
                .workInfo{
                    page-break-after:always;
                }
                .workInfo:last-child{
                    padding-bottom: 0 !important;
                }
    </style>`);
            f.contentDocument.close();
            f.contentWindow.print();
        }
    }
};
</script>

<style scoped>


.libraryInfo .el-tabs__item{
    line-height: 60px;
    height: 60px;
}
.libraryInfo{
    position: relative;
}
.libraryInfo .choose{
    position: absolute;
    top: 10px;
    right: 20px;
}
.libraryInfo .info{
    height:1.38rem;
    font-size:1rem;
    font-weight:normal;
    line-height:1.38rem;
    color:#000000;
    width: 100%;

}
.b-b-1{
     border-bottom: 1px solid #ddd;
}

.laber{
    color: #333;
    font-size: 16px;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;

}

.workInfo{
    margin: 0 auto;
    background: #ddd;
    margin-bottom: 10px;
}

.text_c{text-align: center}
    .text_l{
        text-align: left;
    }
    .text_r{
        text-align: right;

    }
    .cope_text {
        user-select: text;

    }
    .box{
        box-sizing: border-box;
        /* border:1px solid #333; */
    }
    .page{

        margin-bottom: 100px;
    }
</style>
