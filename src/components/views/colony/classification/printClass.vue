<template>
    <div class="container">
        <!-- <div class="m-b-20"></div> -->
       <!-- <el-button type="primary" plain icon="el-icon-printer" class="m-l-20"  @click="print('cla')">打印</el-button> -->
        <div  class="over">
            <div class="padding_20 m-b-20" id="cla">
                <div class="display_flex title b-b-1">
                    <div class="w-30">五大类</div>

                    <div class="w-30">22个基本类</div>

                    <div class="w-10">国家标准</div>
                    <div class="w-10">本馆情况</div>
                    <div class="w-10">缺口</div>
                    <div class="w-10">测算结果</div>
                </div>
                <div class="b-l-1 b-r-1">
                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItem">
                            <div class="w-50 b-r-1">第一大类</div>
                            <div class="w-50 b-r-1">马列主义、毛泽东思想</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1">A</div>
                            <div class="w-90 b-r-1">马列主义、毛泽东思想、邓小平理论</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{tableData[0].countryProp}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[0].prop}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[0].gapProp}}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[0].status=='达标'?'color_suc':'color_dan'">{{tableData[0].status}}</div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex">
                            <div class="w-50 b-r-1 containerItem">第二大类</div>
                            <div class="w-50 b-r-1 containerItem">哲学</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1">B</div>
                            <div class="w-90 b-r-1">哲学、宗教</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{tableData[1].countryProp}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[1].prop}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[1].gapProp}}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[1].status=='达标'?'color_suc':'color_dan'">{{tableData[1].status}}</div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItems">
                            <div class="w-50 b-r-1" style="height:459px;line-height:459px">第三大类</div>
                            <div class="w-50">社会科学</div>
                        </div>

                        <div class="w-30 b-l-1 b-r-1">
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">C</div>
                                <div class="w-90">社会科学总论</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">D</div>
                                <div class="w-90">政治、法律</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">E</div>
                                <div class="w-90">军事</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">F</div>
                                <div class="w-90">经济</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">G</div>
                                <div class="w-90">文化、科学、教育、体育</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">H</div>
                                <div class="w-90">语言、文字</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">I</div>
                                <div class="w-90">文字</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">J</div>
                                <div class="w-90">艺术</div>
                            </div>
                            <div class="display_flex w-100 containerItem">
                                <div class="w-10 b-r-1">K</div>
                                <div class="w-90">历史、地理</div>
                            </div>
                        </div>

                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:459px;line-height:459px"
                        >{{tableData[2].countryProp}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:459px;line-height:459px"
                        >{{tableData[2].prop}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:459px;line-height:459px"
                        >{{tableData[2].gapProp}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:459px;line-height:459px"
                            :class="tableData[2].status=='达标'?'color_suc':'color_dan'"
                        >{{tableData[2].status}}</div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItems">
                            <div class="w-50 b-r-1" style="height:510px;line-height:510px">第四大类</div>
                            <div class="w-50">自然科学</div>
                        </div>
                        <div class="w-30 b-l-1 b-r-1">
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">N</div>
                                <div class="w-90">自科科学总论</div>
                            </div>

                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">O</div>
                                <div class="w-90">数理科学与化学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">P</div>
                                <div class="w-90">天文、地球科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">Q</div>
                                <div class="w-90">生物科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">R</div>
                                <div class="w-90">医药、卫生</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">S</div>
                                <div class="w-90">农业科学</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">T</div>
                                <div class="w-90">工业技术</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">U</div>
                                <div class="w-90">交通运输</div>
                            </div>
                            <div class="display_flex w-100 containerItem b-b-1">
                                <div class="w-10 b-r-1">V</div>
                                <div class="w-90">航空、航天</div>
                            </div>
                            <div class="display_flex w-100 containerItem">
                                <div class="w-10 b-r-1">X</div>
                                <div class="w-90">环境科学、安全科学</div>
                            </div>
                        </div>

                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:510px;line-height:510px"
                        >{{tableData[3].countryProp}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:510px;line-height:510px"
                        >{{tableData[3].prop}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:510px;line-height:510px"
                        >{{tableData[3].gapProp}}</div>
                        <div
                            class="w-10 b-r-1 containerItems"
                            style="height:510px;line-height:510px"
                            :class="tableData[3].status=='达标'?'color_suc':'color_dan'"
                        >{{tableData[3].status}}</div>
                    </div>

                    <div class="display_flex containers b-b-1">
                        <div class="w-30 display_flex containerItem">
                            <div class="w-50 b-r-1">第五大类</div>
                            <div class="w-50 b-r-1">综合性图书</div>
                        </div>
                        <div class="w-30 display_flex containerItem">
                            <div class="w-10 b-r-1">Z</div>
                            <div class="w-90">综合性图书</div>
                        </div>

                        <div class="w-10 b-r-1 containerItem">{{tableData[4].countryProp}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[4].prop}}</div>
                        <div class="w-10 b-r-1 containerItem">{{tableData[4].gapProp}}</div>
                        <div class="w-10 b-r-1 containerItem" :class="tableData[4].status=='达标'?'color_suc':'color_dan'">{{tableData[4].status}}</div>
                    </div>
                </div>

     
            </div>

        

         
          
        </div>
    </div>
</template>

<script>


export default {
   
    data() {
        return {
        
            tableData: [
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }],
                [{ countryProp: 0, prop: 0, gapProp: 0, status: 0 }]
            ],
          
        };
    },
    created() {
       this.tableData = JSON.parse(this.$route.query.info)
       // console.log(this.tableData)
       setTimeout(res=>{
           window.print()
       },1000)
    },
    methods: {
    
         
       

        
         
    }
};
</script>

<style scoped>
.searchInfo {
    padding-top: 20px;
}
.color_d {
    text-align: center;
    color: #dddddd;
}
.over {
    /* overflow: auto; */
    padding:50px 0;
}
.title {
    font-size: 14px;
    height: 40px;
    overflow: hidden;
    background: #f1f5f9;
}
.title > div {
    text-align: center;
    line-height: 40px;
    height: 40px;
}
.containers {
    font-size: 14px;
}
.containerItem {
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.b-b-1 {
    border-bottom: 1px solid #e9e9e9;
}
.b-r-1 {
    border-right: 1px solid #e9e9e9;
}
.b-l-1 {
    border-left: 1px solid #e9e9e9;
}
.b-t-1 {
    border-top: 1px solid #e9e9e9;
}
.containerItems {
    height: 100%;
    text-align: center;
}
</style>
