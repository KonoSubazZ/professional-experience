 <template>
    <div class="container">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>MARC统一字段参数</div>
            <div class="display_flex">
                <!-- <div class="cursor text_center m-r-20" @click="add">
                    <img src="../../../assets/img/saves.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div>

                <div class="cursor text_center m-r-20" @click="back">
                    <img src="../../../assets/img/return.png" class="btn_img" />
                    <div class="f-s-14">返回</div>
                </div> -->
                 <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-caret-right' @click="add" >保存</el-button>
                                <el-button type="primary" plain icon="el-icon-setting"  @click="back" >返回</el-button>
                    </el-button-group>
            </div>
        </div>
        <div class="padding_20">
            <fromData
                ref="form"
                :row="3"
                :list="list"
                :model="form"
                v-if="$route.query.url=='BOOK'"
            ></fromData>

            <fromData ref="form" :row="3" :list="lists" :model="form" v-else></fromData>
        </div>
    </div>
</template>

<script>
import fromData from '../../view/form';

export default {
    components: { fromData },
    data() {
        return {
            bus: this.bus(this),
            list: [
                { name: 'ISBN', id: 'isbn' },
                { name: '统一书号', id: 'isbnUnite' },
                { name: '价格', id: 'priceStr' },

                { name: '正题名', id: 'positiveTitle' },
                { name: '副题名', id: 'subTitle' },
                { name: '分辑名', id: 'sectionTitle' },
                { name: '分辑号', id: 'sectionNumber' },

                { name: '并列题名', id: 'tiedTitle' },
                { name: '第一责任者', id: 'firstResponsible' },
                { name: '其他责任者', id: 'otherResponsible' },

                { name: '出版地', id: 'publisherPlace' },
                { name: '出版社', id: 'publisher' },
                { name: '出版年', id: 'publicationDate' },
                { name: '重印年', id: 'reprintYear' },

                { name: '丛书名', id: 'seriesTitle' },
                { name: '丛书责任者', id: 'seriesOwner' },
                { name: '版次', id: 'edition' },
                { name: '装帧方式', id: 'bindingMethod' },

                { name: '页码', id: 'pageNumber' },
                { name: '图表', id: 'chart' },
                { name: '开本尺寸', id: 'formatSize' },
                { name: '附件', id: 'annex' },

                { name: '一般性附注', id: 'generalNotes' },
                { name: '主题词', id: 'keywords' },
                { name: '内容摘要', id: 'contentSummary' },

                { name: '分类号', id: 'classificationNumber' },
                { name: '种次号', id: 'speciesNumber' },
                { name: '辅助区分', id: 'auxiliaryNumber' }
            ],
            lists: [
                { name: 'ISSN号', id: 'issn' },
                { name: '统一刊号', id: 'unifiedIssue' },
                { name: '邮发刊号', id: 'postNumber' },
                { name: '国外发行刊号', id: 'issuedAbroad' },

                { name: '刊名', id: 'title' },
                { name: '当年原名', id: 'oldTitle' },
                { name: '卷册信息', id: 'volumeInformation' },
                { name: '第一责任者', id: 'responsible' },

                { name: '单价', id: 'priceStr' },
                { name: '总价', id: 'totalPriceStr' },
             
                { name: '出版地', id: 'publisherPlace' },
                { name: '出版社', id: 'publisher' },
                { name: '出版年', id: 'publicationDate' },
                { name: '出版周期', id: 'publishingCycle' },

                { name: '页码', id: 'pageNumber' },
                { name: '尺寸', id: 'formatSize' },
                { name: '装帧方式', id: 'bindingMethod' },
                { name: '其他号', id: 'otherNumber' },

                { name: '备注', id: 'note' },
                { name: '分类号', id: 'classificationNumber' }
            ],
            form: {}
        };
    },
    created() {

        this.height = this.$height();
        if (this.$route.query) {
            this.getList(this.$route.query.id);
        }
    },
    methods: {
        add() {
            let url = '';
            if (this.$route.query.url == 'BOOK') {
                url = '/manage/unit/system/systemSettings/bookBaseCorrespond';
            } else {
                url = '/manage/unit/system/systemSettings/journalBaseCorrespond';
            }

            for (let key in this.form) {
                // console.log(key);
                if (this.form[key] == null) {
                    this.form[key] = '';
                }
                // this.arr.push({ name: key, value: String(object[key]) });
            }
            this.ax.post(url, this.form).then((res) => {
                // console.log(res);
                this.$message.success('保存成功');
                this.back();
            });
        },
        getList(marcTypeDetailId) {
            let url = '';
            if (this.$route.query.url == 'BOOK') {
                url = '/manage/unit/system/systemSettings/bookBaseCorrespond';
            } else {
                url = '/manage/unit/system/systemSettings/journalBaseCorrespond';
            }
            this.ax.get(url, { params: { marcTypeDetailId } }).then((res) => {
                // console.log(res);
                this.form = res;
            });
        }
    }
};
</script>

<style>
</style>
