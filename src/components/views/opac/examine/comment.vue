<template>
    <div>
        <!-- <List 
            :dataUrl="'/manage/unit/opac/auditManagement/readerComment'"
             :disableMeta='true'
            :tableMeta='meta'
            :isHeaderHeigt='30'
            ref="list"
            :chooseBox='true'
            @selected='selected'
            
             > -->
        <List :dataUrl="'/manage/unit/system/bookCommentRecord/getBookCommentRecordList'" :disableMeta='true'
            :tableMeta='meta' :isHeaderHeigt='30' ref="list" :chooseBox='true' @selected='selected'>
            <template slot="addition-actions">

                <el-button-group>
                    <el-button type="primary" plain icon='el-icon-circle-check' @click="passed">通过</el-button>
                    <el-button type="primary" plain icon="el-icon-circle-close" @click="failed">拒绝</el-button>
                    <el-button type="primary" plain icon="el-icon-circle-close" @click="open">设置</el-button>
                </el-button-group>
            </template>
            <template slot="addition-table-actions" slot-scope="scope">
                <!-- <el-button type="text" v-if="scope.item.row.approvalStatus == 'PENDING_REVIEW'" class="m-r-10 "
                    @click="lookFor(scope.item.row)">详情</el-button>
                <el-button type="text" v-if="scope.item.row.approvalStatus == 'PENDING_REVIEW'" class="m-r-10 color_dan"
                    @click="fail(scope.item.row)">拒绝</el-button>

                <el-button type="text" v-if="scope.item.row.approvalStatus == 'PENDING_REVIEW'" class="m-r-10"
                    @click="pass(scope.item.row)">通过</el-button> -->
                <el-button type="text" class="m-r-10 " @click="handleShowComment(scope.item.row)">详情</el-button>
                <el-button type="text" class="m-r-10 color_dan" @click="handleComment(scope.item.row, 2)">拒绝</el-button>

                <el-button type="text" class="m-r-10" @click="handleComment(scope.item.row, 1)">通过</el-button>


            </template>
        </List>
        <el-dialog title="审核设置" :visible.sync="dialogVisible" width="20%">
            <el-form :inline="false" :model="settingsForm">

                <el-form-item label="评论条件">
                    <el-radio-group v-model="settingsForm.commentRestrictions">
                        <el-radio :label="0">借阅</el-radio>
                        <el-radio :label="1">看过</el-radio>
                        <el-radio :label="2">所有人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="评论审核">
                    <el-switch v-model="settingsForm.commentModeration"></el-switch>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelSettings">取 消</el-button>
                <el-button type="primary" @click="saveSettings">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import List from '../../../view/List'

export default {
    components: { List },
    data() {
        return {
            bus: this.bus(this),
            meta: '',
            chooseBox: [],
            dialogVisible: false,
            _id: '', // 修改主键id
            settingsForm: {
                commentModeration: false, // 评论条件
                commentRestrictions: 0,// 评论条件

            }

        };
    },
    created() {
        this.metaList();
        // this.getSettings()


    },
    methods: {
        open() {
            this.dialogVisible = true;
            this.getSettings()
        },
        handleShowComment(item) {
            console.log(item, 'item');
            this.$alert('评论内容 : ' + item.comment, {
                confirmButtonText: '确定',
                callback: action => {
                    console.log("详情点击了!");
                }
            });
        },
        async getSettings() {
            try {
                const { data } = await this.axios.get('/manage/unit/system/securitySettings/querying');

                // this.settingsForm.commentModeration = Number(data.commentModeration)
                // this.settingsForm.commentRestrictions = data.commentRestrictions == 0 ? true : false
                if (data.commentCondition == 0) {
                    this.settingsForm.commentRestrictions = 2
                } else {
                    this.settingsForm.commentRestrictions = Number(data.commentRestrictions)
                    console.log(data.commentRestrictions,'--借阅看过--');

                }
                this.settingsForm.commentModeration = data.commentModeration == 1 ? true : false
                this._id = data.id

            } catch (error) {
                console.log(error);
            }

        },
        cancelSettings() {
            this.dialogVisible = false;
            this.getSettings();


        },
        async saveSettings() {
            this.dialogVisible = false;
            // 接口
            const url = '/manage/unit/system/securitySettings/addOrModify';
            let params;
            if (this.settingsForm.commentRestrictions == 2) {
                params = {
                    id: this._id,
                    commentModeration: this.settingsForm.commentModeration ? 1 : 0,
                    commentRestrictions: 0,
                    commentCondition: 0

                }

            } else {
                params = {
                    id: this._id,
                    commentModeration: this.settingsForm.commentModeration ? 1 : 0,
                    commentRestrictions: this.settingsForm.commentRestrictions,
                    commentCondition: 1

                }

            }




            try {
                await this.axios.post(url, params)
                this.$message.success("保存成功!")
            } catch (error) {
                this.$message({
                    message: error,
                    type: 'warning'
                });
            }

        },

        async handleComment(item, status) {
            const url = '/manage/unit/system/bookCommentRecord/addOrModifyBinding';
            const params = {
                id: item.id,
                reviewStatus: status,
            }
            try {
                await this.axios.post(url, params)
                this.$message.success('操作成功!');
                this.bus.$emit(`flash_/manage/unit/system/bookCommentRecord/getBookCommentRecordList`);
            } catch (error) {
                this.$message({
                    message: error,
                    type: 'warning'
                });
            }


        },
        selected(val) {
            this.chooseBox = val
        },
        lookFor(val) {
            this.$alert(val.content, {
                confirmButtonText: '确定',
                callback: action => {
                    console.log("详情点击了!");
                }
            });
        },
        pass(val) {
            this.loading()
            let params = {
                approvalStatus: 'PASS',
                readerCommentId: val.id
            }
            this.ax.post('/manage/unit/opac/auditManagement/readerComment', params)
                .then(res => {
                    this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/auditManagement/readerComment`, res);
                    this.$message.success('操作成功');
                })
        },
        passed() {
            if (this.chooseBox.length == 0) {
                return this.$message.success('请选择单个评论');
            }
            this.pass(this.chooseBox[0])
        },
        failed() {
            if (this.chooseBox.length == 0) {
                return this.$message.success('请选择单个评论');
            }
            this.fail(this.chooseBox[0])
        },
        fail(val) {
            this.loading()
            let params = {
                approvalStatus: 'REJECTED',
                readerCommentId: val.id
            }
            this.ax.post('/manage/unit/opac/auditManagement/readerComment', params)
                .then(res => {
                    this.sloading()
                    this.bus.$emit(`flash_/manage/unit/opac/auditManagement/readerComment`, res);
                    this.$message.success('操作成功');
                })
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.ReaderComment' } })
                .then(res => {
                    res.insertable = false
                    res.export = 'NONE'
                    res.edit = 'NONE'
                    res.delete = 'NONE'
                    res.subs.map(it => {
                        if (it.key == 'platformId' || it.key == 'readerNumber' || it.key == 'isbn' || it.key == '' || it.key == 'publisher' || it.key == 'firstResponsible') {

                            it.searchable = false
                        }
                    })
                    const arr = [{
                        "key": "readerName",
                        "name": "读者姓名",
                        "searchable": true,
                        "displayInList": true,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sortable": false,
                    }, {
                        "key": "number",
                        "name": "读者证号",
                        "searchable": true,
                        "displayInList": true,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sortable": false,
                    },
                    {

                        "key": "isbn",
                        "name": "ISBN",
                        "searchable": true,
                        "displayInList": true,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sortable": false,

                    },
                    {

                        "key": "positiveTitle",
                        "name": "正题名",
                        "searchable": true,
                        "displayInList": true,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sortable": false,

                    }, {
                        "key": "reviewStatus",
                        "name": "审核状态",
                        "searchable": true,
                        "displayInList": true,
                        "subs": null,
                        "searchOption": [{
                            key: 0, name: "待审核"
                        }, { key: 1, name: "审核通过" }, { key: 2, name: "审核未通过" }],
                        "type": null,
                        "sortable": false,
                    }, {
                        "key": "comment",
                        "name": "评论内容",
                        "searchable": false,
                        "displayInList": true,
                        "displayName": false,
                        "delete": null,
                        "edit": null,
                        "print": null,
                        "export": null,
                        "insertable": false,
                        "deleteKey": null,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sort": 10,
                        "sortable": false,
                        "clickable": false,
                        "path": null
                    }, {
                        "key": "updateTime",
                        "name": "审核时间",
                        "searchable": true,
                        "displayInList": true,
                        "displayName": false,
                        "delete": "DELETE",
                        "edit": "EDIT",
                        "print": "NONE",
                        "export": "NONE",
                        "insertable": false,
                        "deleteKey": null,
                        "subs": null,
                        "searchOption": null,
                        "type": "TIMESTAMP",
                        "sort": 10,
                        "sortable": false,
                        "clickable": false,
                        "path": null
                    }, {
                        "key": "createTime",
                        "name": "创建时间",
                        "searchable": true,
                        "displayInList": true,
                        "displayName": false,
                        "delete": "DELETE",
                        "edit": "EDIT",
                        "print": "NONE",
                        "export": "NONE",
                        "insertable": false,
                        "deleteKey": null,
                        "subs": null,
                        "searchOption": null,
                        "type": "TIMESTAMP",
                        "sort": 10,
                        "sortable": false,
                        "clickable": false,
                        "path": null
                    }
                    ];
                    res.subs.push({
                        "key": "comment",
                        "name": "评论内容",
                        "searchable": false,
                        "displayInList": true,
                        "displayName": false,
                        "delete": null,
                        "edit": null,
                        "print": null,
                        "export": null,
                        "insertable": false,
                        "deleteKey": null,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sort": 10,
                        "sortable": false,
                        "clickable": false,
                        "path": null
                    })
                    res.subs.push({
                        "key": "reviewStatus",
                        "name": "审核状态",
                        "searchable": false,
                        "displayInList": true,
                        "displayName": false,
                        "delete": null,
                        "edit": null,
                        "print": null,
                        "export": null,
                        "insertable": false,
                        "deleteKey": null,
                        "subs": null,
                        "searchOption": null,
                        "type": null,
                        "sort": 10,
                        "sortable": false,
                        "clickable": false,
                        "path": null
                    })
                    // console.log(res)
                    res.subs = arr
                    this.meta = res

                    console.log(this.meta, '--this.meta--');

                })
        },
    }
};
</script>

<style></style>
