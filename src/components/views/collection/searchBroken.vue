<template>
    <div class="container">
        <div class="padding_20">


            <div class="display_flex p-t-20 m-b-20">

                <div class="display_flex  w-20 ">
                    <el-input class="w-100" v-model="startCode" @keyup.enter.native="searchCode"
                        placeholder='起始文献条码范围'></el-input>
                </div>
                <div class="padding_20">———</div>
                <div class="display_flex  w-20 m-r-20">
                    <el-input class="w-100" v-model="endCode" @keyup.enter.native="searchCode"
                        placeholder='终止文献条码范围'></el-input>
                </div>
                <div class="display_flex between w-50">
                    <el-button type="primary" :loading='load' @click="searchCode">查询</el-button>

                    <el-button type="primary" @click="exportTxt">导出空缺条形码</el-button>
                </div>
            </div>
            <!-- 列表 -->
            <div :style="'height:' + height + 'px'">
                <el-table height='100%' :data="tableData.content" style="width: 100%">
                    <el-table-column type="index" align='center' label="序号">
                    </el-table-column>
                    <el-table-column prop="code" align='center' label="文献条码">
                    </el-table-column>
                </el-table>
                <!--                      <div class="pagination" v-if="tableData">-->
                <!--                        <el-pagination-->
                <!--                            background-->
                <!--                            layout="sizes,total, prev, pager, next"-->
                <!--                            :current-page="tableData.number+1"-->
                <!--                            :page-sizes="[20,100,200,300,500]"-->
                <!--                            :page-size="tableData.size"-->
                <!--                            :total="tableData.totalElements"-->
                <!--                            @size-change="onPageSizeChange"-->
                <!--                            @current-change="onPageChange"-->
                <!--                        ></el-pagination>-->
                <!--                      </div>-->
            </div>



        </div>

    </div>
</template>

<script>
import List from '../../view/List';
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
import upLoad from '../textUp';
export default {
    components: { List, upLoad },
    data() {
        return {
            bus: this.bus(this),
            startCode: '',
            endCode: '',
            form: {},
            load: false,
            tableData: {
                content: []
            },
            height: '',
            pageInfo: { page: 0, size: 20 },
        };
    },
    created() {
        this.getMeta();
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
    },
    methods: {
        calcTableHeight(val) {
            setTimeout(res => {

                this.height = document.documentElement.clientHeight - 240;

            }, 100)
        },
        //分页
        // onPageSizeChange(e) {
        //   this.pageInfo.size = e;
        //   this.loading()
        //   this.searchCode();
        // },
        // onPageChange(e) {
        //   this.pageInfo.page = e - 1;
        //   this.loading()
        //   this.searchCode();
        // },
        searchCode() {
            if (!this.startCode && !this.endCode) return this.$message.error('请输入文献条码范围')
            this.form.startCode = this.startCode
            this.form.endCode = this.endCode
            // this.form.page =  this.pageInfo.page
            //  this.form.page = this.pageInfo.size
            this.load = true
            this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.ax.get('/manage/unit/catalog/collectionHandling/brokenNumber', { params: this.form })
                .then(res => {
                    this.load = false
                    this.tableData.content = res.map(it => {
                        return { code: it }
                    })
                })
        },

        getCode(startCode, endCode) {

            let num1 = startCode.replace(/[^0-9]/ig, "");
            let num2 = endCode.replace(/[^0-9]/ig, "");
            let str1 = startCode.replace(/[^a-zA-Z]/g, '')
            let str2 = endCode.replace(/[^a-zA-Z]/g, '')


            if (str1 != str2) {
                this.$message.error('请输入想等的前缀');
                return false
            }
            if (num1.length != num2.length || num1 >= num2) {
                this.$message.error('请输入正确的范围并且长度相等');
                return false
            }
            this.form.prefix = str1
            this.form.startCode = num1
            this.form.endCode = num2
            return true
            // let arr=[]
            // for(let i=0;i<=num2-num1;i++){
            //     arr.push( (num1*1+i*1 ) )
            // }

            // return  { str:str1, num: arr }

        },
        // 获取meta
        getMeta() {
            this.meta = {
                insertable: false,
                edit: 'NONE',
                delete: 'NONE',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'code',
                        name: '文献条码',
                        searchOption: null,
                        sort: 0
                    }
                ]

            }
        },
        exportTxt() {
            if (this.startCode == '') {
                return
            }
            this.loading()
            this.ax.get('/manage/unit/catalog/collectionHandling/exportBrokenNumber', { params: this.form })
                .then(res => {
                    // // console.log(res)
                    this.FileSaver.saveAs(res, res);
                    this.sloading()
                    //   newTab.location = res
                }).catch(err => {
                    this.sloading()
                })
        },
    }
};
</script>

<style scoped>
.label {
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: normal;
    line-height: 1.25rem;
    color: #333333;
}
</style>
