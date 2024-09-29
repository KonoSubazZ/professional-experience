<template>
    <div :class="otherClass" class="upload">
        <!-- fun getImg  获得图片地址-->
        <!-- prop  url-地址  clear-是否清空  show-展示上传  headImg-图展示  types-类型 -->
        <el-upload
            v-loading="loading"
            class="avatar-uploader"
            :action="src"
            :show-file-list="show == true"
            :data="{ type }"
            :name="'file'"
            :accept='fileFormat?fileFormat:""'
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            
        >
            <video v-if="upType=='video'" class="avatar" :src="img" ></video>
            
            <img v-else-if="img != '' && img != undefined && !upType" :src="img" class="avatar" style="width: 100%;height: 100%" />

            

            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            <img src="../../assets/img/false.png" v-if="img != '' && img != undefined" class="iocn_del cursor" @click.stop="clearImg" style="width: 30px;height: 30px;top:0;right: 0" />
        </el-upload>
        <div class="color_dan f-s-14 text_center">{{please}}</div>
    </div>
</template>

<script>

export default {
    props: {
        upType:'',
        url: '',
        clear: '',
        headImg: '',
        types: '',
        show: '',
        fileFormat:'',
        otherClass: '',
        please:'',
    },
    data() {
        return {
            loading: false,
            clearFiles: false,
            src:'/other/uploadFile',
            img: '',
            type: 1,
            headers: {
                // accessToken: JSON.parse(sessionStorage.getItem(process.env.VUE_APP_PROJECTNAME + '_user')).token
                 accessToken:JSON.parse(localStorage.getItem("user")).token
            },
            fileList: [],
            upName: ''
        };
    },
    created() {
        // //// // console.log(this.url)

        if (this.url !== undefined) {
            this.src = this.url;
        }
        if (this.types !== undefined) {
            this.type = this.types;
        }
        if (this.headImg) {
            this.img = this.headImg;
        }
    },
    watch: {
        headImg(val) {
            this.img = val;
           
        },
        clear() {
            if (this.clear) {
                this.img = '';
            }
        }
    },
    mounted() {},
    methods: {
        handleAvatarSuccess(res, file) {
            this.loading = false;
            if (this.clear == false) {
                this.img = res.data;
            } else {
                this.img = '';
            }
            // console.log(res.data);
            this.$emit('getImg', res.data);
        },
        clearImg(){
             this.img = '';
             this.$emit('getImg', '');
        },
        beforeAvatarUpload(file) {
            this.$emit('changeImg', file);
            console.log(file)
            this.loading = true;
            let name = file.name;
        // || file.type=='application/pdf'
            this.upName = file.name;
           let pass = name.indexOf('.xls')!==-1 || name.indexOf('.xlsx')!==-1  || file.type == 'image/jpeg'  || file.type == 'image/png' || name.indexOf('.docx')!==-1|| name.indexOf('.doc')!==-1
            if (!pass) {
                this.$message.warning('上传文件类型错误');
                this.loading = false;
                return false;
            }
        }
    }
};
</script>

<style >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.upload .el-upload--text {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
}

.small .el-upload--text {
    width: 66px !important;
    height: 66px !important;
}
.small .avatar {
    width: 66px;
    height: 66px;
    display: block;
    object-fit: cover;
}
.small .avatar-uploader-icon{
    width: 66px;
    height: 66px;
    line-height: 66px;
    font-size: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

</style>
