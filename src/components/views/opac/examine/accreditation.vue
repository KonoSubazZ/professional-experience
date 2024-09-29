 <template>
    <div>
        <List
            :dataUrl="'/manage/unit/opac/auditManagement/weChatReader'"
            :disableMeta="true"
            :tableMeta="meta"
            :isHeaderHeigt="30"
            :searchName="{ approvalStatus: 'PENDING_REVIEW' }"
            ref="list"
        >
            <template slot="addition-actions">
                <el-button type="primary" plain icon="el-icon-circle-check" @click="passed">通过</el-button>
                <!-- <el-button type="primary" plain icon="el-icon-circle-close"  @click="back" >拒绝</el-button> -->
            </template>
            <template slot="addition-table-actions" slot-scope="scope">
                <el-button type="text" v-if="scope.item.row.approvalStatus == 'PENDING_REVIEW'" class="m-r-10" @click="pass(scope.item.row)"
                    >通过</el-button
                >
            </template>
        </List>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return { bus: this.bus(this), meta: '' };
    },
    created() {
        this.metaList();
    },
    methods: {
        // 修改
        editUpdate(e) {
            // console.log(e);
            this.$router.push({
                path: 'index/addNote',
                query: { info: JSON.stringify(e[0]) }
            });
        },
        jump() {
            this.$router.push('index/addNote');
        },
        selected(val) {
            this.chooseBox = val;
        },
        lookFor(val) {
            this.$alert(val.content, {
                confirmButtonText: '确定',
                callback: (action) => {}
            });
        },
        pass(val) {
            this.loading();
            let params = {
                approvalStatus: 'PASS',
                weChatReaderId: val.weChatReaderId
            };
            this.ax.post('/manage/unit/opac/auditManagement/auditWeChatReader', params).then((res) => {
                this.sloading();
                this.bus.$emit(`flash_/manage/unit/opac/auditManagement/weChatReader`, res);
                this.$message.success('操作成功');
            });
        },
        passed() {
            if (this.chooseBox.length == 0) {
                return this.$message.success('请选择单个读者');
            }
            this.pass(this.chooseBox[0]);
        },
        failed() {
            if (this.chooseBox.length == 0) {
                return this.$message.success('请选择单个评论');
            }
            this.fail(this.chooseBox[0]);
        },
        fail(val) {
            this.loading();
            let params = {
                approvalStatus: 'REJECTED',
                weChatReaderId: val.weChatReaderId
            };
            this.ax.post('/manage/unit/opac/auditManagement/auditWeChatReader', params).then((res) => {
                this.sloading();
                this.bus.$emit(`flash_/manage/unit/opac/auditManagement/weChatReader`, res);
                this.$message.success('操作成功');
            });
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.WeChatReader' } }).then((res) => {
                res.insertable = false;
                res.delete = 'NONE';
                res.edit = 'NONE';
                res.subs.map((it) => {
                    if (
                        it.key == 'platformId' ||
                        it.key == 'isbn' ||
                        it.key == '' ||
                        it.key == 'publisher' ||
                        it.key == 'firstResponsible'
                    ) {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                });
                let list = [
                    { key: 'number', displayInList: true, name: '读者证号' },
                    { key: 'name', displayInList: true, name: '读者姓名', searchable: true },
                    { key: 'readerTypeName', displayInList: true, name: '读者类型' },
                    { key: 'certificateNumber', displayInList: true, name: '读者身份证号' },
                    {
                        key: 'gender',
                        displayInList: true,
                        name: '性别',
                        searchOption: [
                            { key: 'MALE', name: '男' },
                            { key: 'FEMALE', name: '女' }
                        ]
                    },
                    { key: 'photo', displayInList: true, name: '照片', type: 'IMAGE' }
                ];

                res.subs = list.concat(res.subs);
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
