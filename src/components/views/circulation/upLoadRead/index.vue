<template>
    <div>
        <div class="container" :style="'height:' + height + 'px'">
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>读者资料导入</div>
            </div>
            <div class="padding_20 m-b-20">
                <div class="display_flex m-b-30">
                    <div class="f-s-14 m-r-5">模板示范文件</div>
                    <el-button type="primary" @click="jump" class>下载</el-button>
                </div>
                <div class="display_flex start">
                    <el-upload class="upload m-b-20 m-r-20" style="width: 360px" :limit='1' v-loading="loadings"
                        ref='upload' drag action="/manage/unit/circulation/readerManagement/readerUpload" :data='type'
                        :name='"file"'  :file-list='listTable' :headers='headers' :on-success="handleAvatarSuccess"
                        :auto-upload="false" :on-change="beforeAvatarUpload" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>

                    <el-button type="primary" @click="submit" class>开始上传</el-button>
                </div>
            </div>
            <div class="display_flex between header_title padding_20 m-b-20">
                <div class>读者照片导入</div>
            </div>
            <div class="padding_20 m-b-20">
                <div class="m-b-20">头像压缩包,只支持ZIP压缩(建议头像大小2寸)</div>
                <div class="display_flex start">
                    <el-upload class="upload m-b-20 m-r-20" style="width: 360px" v-loading="loadings" drag :limit='1'
                        ref='uploads' action="/manage/unit/circulation/readerManagement/readerPhotoUpload" :data='type'
                        :name='"file"' :headers='headers' :file-list.sync='listTables' :on-error='handerror'
                        :on-success="handleAvatarSuccesse" :auto-upload="false" :before-upload="beforeAvatarUploads"
                        :on-change="handleSubmitsChange" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <el-button type="primary" @click="submits" class>开始上传</el-button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>

export default {
    components: {

    },
    data() {
        return {
            bus: this.bus(this),
            loadings: false,
            type: {
                platformId: JSON.parse(localStorage.getItem("user")).platform.id
            },
            pass: true,
            listTable: [],
            listTables: [],
            headers: {
                accessToken: JSON.parse(localStorage.getItem("user")).token
            },
            height: ''
        };
    },
    created() {
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
    },
    methods: {
        // --------------------------这个是新增的,为了能获取到上传列表的数据---修改了这里

        // 读者照片导入
        handleSubmitsChange(file, fileList) {
            this.listTables = fileList
        },
        // -----------------------------
        calcTableHeight(val) {
            setTimeout(res => {
                this.height = document.documentElement.clientHeight - 170;
            }, 100)
        },
        jump() {//"下载"按钮的回调
            this.ax.get('/manage/unit/circulation/readerManagement/readerUpload')
                .then(res => {
                    let name = res.split('/')[2]
                    // console.log(name)
                    this.FileSaver(res, name)
                })
        },

        submit() {//第一个  “开始上传”按钮的回调
            if (!this.listTable.length) return
            if (!this.upName) {
                return
            }
            this.loading()
            this.$refs.upload.submit();
        },
        submits() {//第二个  "开始上传"按钮的回调
            if (!this.listTables.length) return
            this.loading()
            this.$refs.uploads.submit();
        },
        handerror(res) {//“读者照片导入”失败的回调
            // console.log(res)
            this.sloading()
            this.$message.error(res)
        },
        handleAvatarSuccess(res, file) {//“读者资料导入”成功的回调；
            this.sloading()
            this.listTable = []
            console.log(this.listTable)
            if (res.code == 400) {
                this.$message.error(res.msg)
                this.loadings = false
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
                return
            }
            // //// console.log(file)
            this.loadings = false
            if (res.data) {
                this.FileSaver(res.data, res.data)
            } else {
                this.$message.success('上传成功')
                this.$refs.uploads.clearFiles()
                this.$refs.upload.clearFiles()
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
            }


        },
        handleAvatarSuccesse(res, file) {//"读者照片导入"成功的回调
            this.sloading()
            // // console.log(res)
            if (res.code == 400) {
                this.$message.error(res.msg)
                this.loadings = false
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
                return
            }
            // //// console.log(file)
            this.loadings = false
            if (res.data !== '导入成功') {
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
                this.$message.error('上传失败，请重新操作')
                // this.again(res.data)
            } else {
                this.$message.success('上传成功')
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
            }


        },
        again(arr) {//"读者照片导入"再次调用
            this.sloading()
            this.$message.error('上传部分失败，请保存查看')
            this.ax.post('/manage/unit/circulation/readerManagement/erroeReaderUploadExecl', { mapList: arr })
                .then(res => {
                    this.FileSaver(res, res)
                    this.listTable = []
                    this.listTables = []
                })

        },
        beforeAvatarUploads(file) {//"读者照片导入"

            this.loadings = true

            let name = file.name

            this.upName = file.name
            console.log(name)
            let pass = name.indexOf('.zip') !== -1
            this.pass = pass
            if (!pass) {
                this.$message.warning('上传文件类型错误')
                this.sloading()
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
                this.loadings = false
                return false
            }
        },
        beforeAvatarUpload(file,fileList) {//“读者资料导入”
            this.listTable = fileList
            let name = file.name
            this.upName = file.name
            let pass = name.indexOf('.xls') !== -1 || name.indexOf('.xlsx') !== -1
            // this.listTable.push(file)
            if (!pass) {
                this.$message.warning('上传文件类型错误')
                setTimeout(it => {
                    this.listTable = []
                    this.listTables = []
                }, 1000)
                this.loadings = false
                return false
            }

        },

    }
};
</script>

<style scoped >
.el-upload {
    width: 100% !important;
    height: 100% !important;
}
</style>
