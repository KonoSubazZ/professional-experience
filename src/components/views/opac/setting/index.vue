<template>
    <div class="container" :style="'height:'+height+'px'">
        <div class="top_title m-b-10 display_flex between">
            <div class="title">抬头图案/平台名称设置</div>
            <div class="display_flex">
                <el-button type="primary" icon="el-icon-collection" @click="save">保存</el-button>
            </div>
        </div>
        <div class="padding_20 overauto">
            <div class="title">抬头图案</div>
            <up-load @getImg="getImg" :fileFormat="'.png, .jpg, .jpeg'" :headImg="ruleForm.photo" class="m-b-20"></up-load>

            <div class="title">H5轮播图</div>
            <div class="display_flex">
                <up-load @getImg="getImgs" v-if="ruleForm.h5Banner.length<5" :clear="true" :fileFormat="'.png, .jpg, .jpeg'" class="m-b-20"></up-load>

                <div class="icon_178 relative m-b-20 m-r-20" v-for="(it, index) of ruleForm.h5Banner" :key="index">
                    <img src="@/assets/img/false.png" class="iocn_del cursor" @click="ruleForm.h5Banner.splice(index, 1)" />
                    <el-image class="icon_178 relative" :src="it" :preview-src-list="ruleForm.h5Banner" fit="cover"> </el-image>
                </div>
            </div>

            <div class="title ">OPAC平台名称设置</div>
            <el-input v-model="ruleForm.title" placeholder="请输入OPAC平台名称" class="m-b-20 w-20"></el-input>

            <div class="title ">H5二维码名称设置</div>
            <el-input v-model="ruleForm.subtitle" maxlength='5' placeholder="H5二维码名称设置，最多5个字" class="m-b-20 w-20"></el-input>
        </div>
    </div>
</template>

<script>
import upLoad from '../../upLoad';
export default {
    components: {
        upLoad
    },
    props: {
        info: {}
    },
    data() {
        return {
            bus: this.bus(this),
            // 高度
            height: '',
            h5Url: '',
            PCUrl: '',
            Url: '',
            updata: false, //是否修改
            // 参数
            ruleForm: {
                photo: '',
                title: '',
                h5Banner:''
            },

            options: [],
            //  规则
            rules: {
                communityId: [{ required: true, message: '请选择名称', trigger: 'blur' }],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                    { type: 'number', message: '排序必须为数字值' }
                ],
                title: [{ required: true, message: '请输入描述', trigger: 'blur' }]
            },
            // timer
            timer: false,
            screenWidth: ''
        };
    },

    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientHeight;
                that.screenWidth = window.screenWidth;
            })();
        };
    },
    watch: {
        screenWidth(val) {
            // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
            if (!this.timer) {
                // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
                this.screenWidth = val;
                this.timer = true;

                setTimeout(() => {
                    // 打印screenWidth变化的值
                    this.height = this.$height();
                    //  // console.log(123)
                    this.timer = false;
                }, 400);
            }
        }
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getSet();
        // this.getUrl()
        // this.getH5Url()
        // this.getPCUrl()
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        // 获取content
        getImg(data) {
            this.ruleForm.photo = data;
        },
        getImgs(data) {
            this.ruleForm.h5Banner.push(data);
        },
        // 获取设置
        getSet() {
            this.ax
                .get('/manage/unit/opac/opacSettings/opacSettings', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then(res => {
                    if(!res.h5Banner){
                        res.h5Banner=[]
                    }else{
                        res.h5Banner = res.h5Banner.split(',')
                    }
                    this.ruleForm = res;
                });
        },
        // 新增保存
        save(formName) {
            let obj = JSON.parse(JSON.stringify(this.ruleForm))
            obj.h5Banner = obj.h5Banner.join(',')
            obj.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax.post('/manage/unit/opac/opacSettings/opacSettings', obj).then(res => {
                this.$message.success('保存成功');
            });
        }
    }
};
</script>

<style scoped>
.text {
    user-select: text;
}
.icon_178{
    width: 178px;
    height: 178px;
}
.relative{
    position: relative;
}
</style>
