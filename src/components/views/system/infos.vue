<template>
    <div class="container" :style="'height:' + height + 'px'" v-loading="loading" style="position:relative;">
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class="">平台信息</div>
            <div class="display_flex">
                <el-button type="primary" @click="jump" v-if="type == 'SingleVision'">高级设置</el-button>
                <el-button v-if="!edit" type="primary" @click="updateData()">修改</el-button>
                <el-button v-else type="primary" @click="save">保存</el-button>
                <el-button v-if="edit" type="primary" @click="edit = false">取消</el-button>

            </div>
        </div>
        <!-- <div id="qrcode" style="width: 200px;height: 200px;position: absolute;left: 60%;margin-top:10px;">
            <img v-if="QRcodeData != ''" :src="QRcodeData" style="width: 100%;height: 100%;"></img>
            <img v-else src="../../../assets/img/qrcodeimg.png" style="width: 100%;height: 100%;"></img>
            <el-button v-if="QRcodeData != ''" type="primary" style="width: 100%;margin-top:10px;"
                @click="uploadQRcode">下载</el-button>
            <el-button v-else type="primary" style="width: 100%;margin-top:10px;" @click="getQRcode">生成二维码</el-button>
        </div> -->
        <div class="padding_20">
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">平台名称</div>
                <div v-if="!edit">{{ info.name }}</div>
                <el-input v-else class="w-40" placeholder="请输入" :maxlength="30" v-model="info.name"
                    clearable></el-input>
            </div>
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">设备登录密码</div>
                <div v-if="!edit">{{ info.password }}</div>
                <el-input v-else placeholder="请输入" class="w-40" :maxlength="30" v-model="info.password"
                    clearable></el-input>
            </div>
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">馆藏地址</div>
                <div v-if="!edit">{{address }}</div>
                <el-input v-else placeholder="请输入馆藏地址（例：河北省廊坊市固安县***图书馆）" class="w-40" v-model="address"
                    clearable></el-input>
            </div>
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">馆内简介</div>
                <div v-if="!edit">{{ briefIntroduction }}</div>
                <el-input type="textarea" :rows="2" v-else placeholder="请输入" class="w-40"
                    v-model="briefIntroduction" clearable>
                </el-input>
            </div>
            <!-- <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">小程序地址</div>
                <div v-if="!edit">{{ info.miniProgramAddress }}</div>
                <el-input v-else placeholder="请输入" class="w-40" v-model="info.miniProgramAddress" clearable></el-input>
            </div> -->
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">联系电话</div>
                <div v-if="!edit">{{ info.phone }}</div>
                <el-input v-else placeholder="请输入" :maxlength="30" class="w-40" v-model="info.phone"
                    clearable></el-input>
            </div>
            <div class="display_flex m-b-20">
                <div class="m-r-20 w-10">备注</div>
                <div v-if="!edit">{{ info.note }}</div>
                <el-input v-else placeholder="请输入" class="w-40" :maxlength="30" v-model="info.note"
                    clearable></el-input>
            </div>
            <div class="display_flex between wrap m-b-30">
                <div class="w-50">
                    <div class="title">OPAC手机端访问地址</div>
                    <el-button type="primary" class="m-b-20" icon="el-icon-monitor" @click="getH5Url">获取</el-button>
                    <div class="m-b-20 text">
                        <span>{{ h5Url ? h5Url : '' }} </span>
                        <el-button v-if="h5Url" icon="el-icon-document" class="cobyOrderSn" data-clipboard-action="copy"
                            :data-clipboard-text="h5Url" :disabled="disabled" type="text" @click="copy"
                            style="font-size: 16px">复制</el-button>
                    </div>
                </div>

                <div class="w-50">
                    <div class="title">OPAC PC端访问地址</div>
                    <el-button type="primary" class="m-b-20" icon="el-icon-monitor"
                        @click="getOPACterminalUrl">获取</el-button>
                    <div class="text m-b-20">
                        <span>{{ opacTerminalUrl ? opacTerminalUrl : '' }} </span>
                        <el-button icon="el-icon-document" v-if="opacTerminalUrl" class="cobyOrderSn"
                            data-clipboard-action="copy" :data-clipboard-text="opacTerminalUrl" :disabled="disabled"
                            type="text" @click="copy" style="font-size: 16px">复制</el-button>
                    </div>
                </div>
                <div class="w-50">
                    <div class="title">硬件后台访问地址</div>
                    <el-button type="primary" class="m-b-20" icon="el-icon-monitor" @click="getEndUrl">获取</el-button>
                    <div class="text m-b-20">
                        <div v-if="endUrl && superAdmin">
                            <span>{{ endUrl ? endUrl : '' }} </span>

                            <el-button icon="el-icon-document" class="cobyOrderSn" data-clipboard-action="copy"
                                :data-clipboard-text="endUrl" :disabled="disabled" type="text" @click="copy"
                                style="font-size: 16px">复制</el-button>
                            <el-button type="primary" class="m-b-20" @click="openUrl">跳转</el-button>
                        </div>
                    </div>
                </div>
                <div class="w-50">
                    <div class="title">设备访问地址</div>
                    <el-button type="primary" class="m-b-20" icon="el-icon-monitor" @click="getUrl">获取</el-button>
                    <div class="text m-b-40">
                        <span>{{ Url ? Url : '' }} </span>
                        <el-button icon="el-icon-document" v-if="Url" class="cobyOrderSn" data-clipboard-action="copy"
                            :data-clipboard-text="Url" :disabled="disabled" type="text" @click="copy"
                            style="font-size: 16px">复制</el-button>
                    </div>
                </div>
                <div class="w-50">
                    <div class="title">OPAC 终端访问地址</div>
                    <el-button type="primary" class="m-b-20" icon="el-icon-monitor" @click="getPCUrl">获取</el-button>
                    <div class="text m-b-40">
                        <span>{{ PCUrl ? PCUrl : '' }} </span>
                        <el-button icon="el-icon-document" v-if="PCUrl" class="cobyOrderSn" data-clipboard-action="copy"
                            :data-clipboard-text="PCUrl" :disabled="disabled" type="text" @click="copy"
                            style="font-size: 16px">复制</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="高级设置" top="5vh" :close-on-click-modal="false" :visible.sync="dialogVisible" width="40%">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="域名配置" name="first">
                    <formData :row="1" :labelWidth="'100px'" :list="list" :model="forms"></formData>
                </el-tab-pane>
                <el-tab-pane label="微信支付配置" name="second">
                    <formData :row="1" :labelWidth="'100px'" :list="list" :model="forms"></formData>
                </el-tab-pane>
                <el-tab-pane label="短信配置" name="thrs">
                    <formData :row="1" :labelWidth="'160px'" :list="list" :model="forms"></formData>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveWx">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import formData from '../../view/form';
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
export default {
    components: {
        formData
    },
    data() {
        return {
            disabled: false,
            activeName: 'first',
            list: [],
            forms: {},
            info: {},
            dialogVisible: false,
            type: '',
            edit: false,
            Url: '',
            PCUrl: '',
            h5Url: '',
            endUrl: '',
            height: '',
            opacTerminalUrl: '',//opac终端url
            loading: false,
            QRcodeData: "",
            briefIntroduction:"",
            address:""
        };
    },
    computed: {
        superAdmin() {
            return JSON.parse(localStorage.getItem("user")).info.type == 'SUPER_MANAGER';
        }
    },
    created() {
        this.calcTableHeight();
        window.addEventListener('resize', () => {
            this.calcTableHeight();
        });
        this.getInfo();
        let userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
            this.type = userInfo.userType;
        }


    },
    methods: {
        //小程序二维码生成start
        // getQRcode() {
        //     if (this.info.miniProgramAddress == '' || this.info.miniProgramAddress == undefined) {
        //         this.loading = true
        //         this.ax
        //             .get('/manage/unit/system/systemSettings/hardwareLoginUrl', {
        //                 params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
        //             })
        //             .then((res) => {
        //                 this.info.miniProgramAddress = res
        //                 if (this.QRcodeData == '') {
        //                     QRCode.toDataURL(res)
        //                         .then(url => {
        //                             this.QRcodeData = url
        //                         })
        //                         .catch(err => {
        //                             console.error(err)
        //                         })
        //                 }
        //                 this.loading = false
        //             });
        //     }
        // },
        //小程序二维码生成end
        uploadQRcode() {
            //表示图片显示的路径  一般都是data:image/jpeg;base64,iVBORw0KGgoAAAANS
            const byteCharacters = atob(this.QRcodeData.split(',')[1])
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            //区分是什么类型的 svg 或者是png 格式 切记不同类型后缀不同。使用错误可能会下载图片打不开
            var blobs = ''
            if (this.active == 'first' || this.active == 'second' ||
                this.active == 'third') {
                blobs = 'image/svg+xml'
            }
            if (this.active == 'four') {
                blobs = 'image/png'
            }
            this.downLong = false
            let url = window.URL.createObjectURL(
                new Blob([byteArray], { type: blobs })
            );
            let link = document.createElement("a"); //创建a标签
            link.style.display = "none"; //将a标签隐藏
            link.href = url; //给a标签添加下载链接
            link.setAttribute("download", '小程序二维码.png');
            document.body.appendChild(link);
            link.click(); //执行a标签
        },
        updateData() {
            if (this.info.miniProgramAddress == '' || this.info.miniProgramAddress == undefined) {
                this.loading = true
                this.ax
                    .get('/manage/unit/system/systemSettings/hardwareLoginUrl', {
                        params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                    })
                    .then((res) => {
                        this.info.miniProgramAddress = res
                        this.loading = false
                        this.edit = true
                    });
            } else {
                this.edit = true
            }
        },
        openUrl() {
            if (this.endUrl) {
                let { username, password } = JSON.parse(localStorage.getItem('admin'));
                let encodePassword = this.Base64.decode(password);
                window.open(this.endUrl + `&user=${username}&password=${encodePassword}`)
            } else {
                this.$message.error('当前跳转的地址不存在');
            }
        },
        copy(val) {
            const _this = this;
            var clipboard = new Clipboard('.cobyOrderSn');
            clipboard.on('success', function (val) {
                _this.disabled = true;
                setTimeout(() => {
                    _this.disabled = false;
                    // 销毁实例防止多次触发
                    clipboard.destroy();
                }, 3000);
                _this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            });
            clipboard.on('error', function () {
                _this.$message.error('复制失败，请手动复制');
            });
        },
        calcTableHeight(val) {
            setTimeout((res) => {
                this.height = document.documentElement.clientHeight - 170;
            }, 100);
        },
        handleClick() {
            if (this.activeName == 'first') {
                this.getSet();
            } else if (this.activeName == 'second') {
                this.getWx();
            } else {
                this.getsms();
            }
        },
        jump() {
            this.dialogVisible = true;
            if (this.activeName == 'first') {
                this.getSet();
            } else if (this.activeName == 'second') {
                this.getWx();
            } else {
                this.getsms();
            }
        },
        saveWx() {
            if (this.activeName == 'first') {
                this.saveSet();
            } else if (this.activeName == 'second') {
                this.savesWx();
            } else {
                this.saveSms();
            }
        },
        savesWx() {
            this.ax.post('/manage/unit/system/systemSettings/wechatPayConfig', this.forms).then((res) => {
                this.$message.success('保存成功');
            });
        },
        saveSet() {
            this.ax.post('/manage/unit/system/systemSettings/unitedSetting', this.forms).then((res) => {
                this.$message.success('保存成功');
            });
        },
        saveSms() {
            this.ax.post('/manage/unit/system/systemSettings/alibabaSmsConfig', this.forms).then((res) => {
                this.$message.success('保存成功');
            });
        },
        getSet() {
            this.ax.get('/manage/unit/system/systemSettings/unitedSetting').then((res) => {
                this.list = [{ name: '访问地址', id: 'address' }];
                this.forms = res;
            });
        },
        getsms() {
            this.ax.get('/manage/unit/system/systemSettings/alibabaSmsConfig').then((res) => {
                console.log(res, 'getsms函数');
                this.list = [
                    { name: 'AccessKeyID公钥', id: 'accessKeyId' },
                    { name: 'SecretAccessKey密钥', id: 'secretAccessKy' },
                    { name: 'SMS服务域名', id: 'endPoint' },
                    { name: '地域ID', id: 'regionId' },
                    { name: '短信签名', id: 'signName' }
                ];
                this.forms = res;
            });
        },
        getWx() {
            this.ax.get('/manage/unit/system/systemSettings/wechatPayConfig').then((res) => {
                console.log(res, 'getWx函数');
                this.list = [
                    { name: 'appId', id: 'appId' },
                    { name: '商户号', id: 'mchId' },
                    { name: '商户秘钥', id: 'mchKey' },
                    { name: '回调地址', id: 'notifyUrl' }
                ];
                this.forms = res;
            });
        },
        // 修改
        save() {
            this.loading = true
            this.ax.post('/manage/unit/system/systemSettings/platfrom', this.info).then((res) => {
                var data = {
                    platformId: JSON.parse(localStorage.getItem('user')).platform.id,
                    platformAddress: this.address,
                    platformNote: this.briefIntroduction,
                    pictureUrl: ""
                }
                this.ax.post('/applets/platformReplenish/addOrModifyRecord', data).then((res) => {
                    this.$message.success('保存成功');
                    this.edit = false;
                    this.loading = false;
                    this.getInfo()
                });
            });
        },
        getInfo() {
            let platformId = JSON.parse(localStorage.getItem('user')).platform.id;
            this.ax.get('/manage/unit/system/systemSettings/platfrom', { params: { platformId } }).then((res) => {
                if (res.miniProgramAddress) {
                    QRCode.toDataURL(res.miniProgramAddress)
                        .then(url => {
                            this.QRcodeData = url
                        })
                        .catch(err => {
                            console.error(err)
                        })
                }
                this.ax.get('/applets/platformReplenish/queryRecord', { params: { platformId } }).then((res1) => {
                    if(res1 != null){
                        this.briefIntroduction = res1.platformNote
                        this.address = res1.platformAddress
                    }
                    this.info = res;
                });
            });
        },
        getUrl() {
            this.ax
                .get('/manage/unit/system/systemSettings/hardwareLoginUrl', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    // // console.log(res)
                    // this.Url = res;
                    this.Url = res.replace('1.6', '1.111');//1.111测试环境
                });
        },

        getPCUrl() {
            this.ax
                .get('/manage/unit/system/systemSettings/opacClientUrl', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    // // console.log(res)
                    // this. = res;
                    this.PCUrl = res.replace('1.6', '1.111');//1.111测试环境
                });
        },
        getOPACterminalUrl() {
            this.ax
                .get('/manage/unit/system/systemSettings/opacPcUrl', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    // // console.log(res)
                    // this.PCUrl = res;
                    this.opacTerminalUrl = res.replace('1.6', '1.111');//1.111测试环境
                });
        },
        getH5Url() {
            this.ax
                .get('/manage/unit/system/systemSettings/opacH5Url', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    // // console.log(res)
                    // this.h5Url = res;
                    this.h5Url = res.replace('1.6', '1.111');//1.111测试环境
                });
        },
        getEndUrl() {
            this.ax
                .get('/manage/unit/system/systemSettings/hardwareBackgroundUrl', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    // // console.log(res)
                    // this.endUrl = res;
                    this.endUrl = res.replace('1.6', '1.111');//1.111测试环境
                });
        }
    }
};
</script>

<style scoped></style>
