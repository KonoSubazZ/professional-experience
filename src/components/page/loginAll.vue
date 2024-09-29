<template>
    <div class="login">
        <!-- 顶部logo -->
        <div class="login_top display_flex">
            <div class="display_flex end">
                <img src="../../assets/img/logo.png" class="logo m-r-15" />
                <div>
                    <div class="logo_title">The intelligent library system</div>
                    <div class="china_title">蓝鲸图书馆管理系统</div>
                </div>
            </div>
        </div>
        <div>
            <!-- <img src="../../assets/img/login.png"  class=""> -->
            <div class="login_background"></div>
            <div class="login_box display_flex">
                <img src="../../assets/img/logoBooks.png" class="login_book" />
                <div class="input_box">
                    <div class="login_header display_flex between m-b-45">
                        <div class="btn_choose cursor" :class="type_btn == 1 ? 'active_btn' : ''" @click="getType(1)">
                            <div class="m-b-20 title_login">集群登录</div>
                            <div class="through"></div>
                        </div>

                        <div class="btn_choose cursor" :class="type_btn == 2 ? 'active_btn' : ''" @click="getType(2)">
                            <div class="m-b-20 title_login">子平台登录</div>
                            <div class="through"></div>
                        </div>
                    </div>
                    <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                        <el-form-item prop="platformId" v-if="type_btn == 2">
                            <el-select v-model="param.platformId" @change="getPlatformId" filterable placeholder="请选择"
                                class="w-100">
                                <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="username">
                            <el-input v-model="param.username" placeholder="账号"> </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="密码" v-model="param.password"
                                @keyup.enter.native="submitForm()">
                            </el-input>
                        </el-form-item>
                        <div>
                            <el-button type="primary" class="login-btn" @click="submitForm()">登录</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="com">北京蓝鲸知图科技有限公司 400-001-4516</div>
        <!-- 底部 -->
        <div class="bottom">
            <div class="display_flex" style="justify-content: center">
                <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202100618"
                    class="black">
                    <img src="../../assets/img/hz.png" />
                    <p class="bottom_text">京公网安备 11011202100618号</p>
                </a>
                <a href="http://beian.miit.gov.cn" target="_blank">
                    <span class="bottom_text" style="margin-left: 20px;">京ICP备15018878号-4</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        var validatePass = (rule, value, callback) => {
            //  // console.log()
            let index = value.indexOf(' ');
            if (value === '') {
                callback(new Error('请输入'));
            } else if (index != -1) {
                callback(new Error('请不要输入空格'));
            } else {
                callback();
            }
        };
        return {
            param: {
                username: '', //
                password: '', //123456
                clientId: 'manager',
                platformId: ''
            },
            // 选择
            platforms: [],
            type_btn: 1,
            rules: {
                username: [{ validator: validatePass, trigger: 'blur' }],
                password: [{ validator: validatePass, trigger: 'blur' }]
                // platformId: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        };
    },

    created() {
        this.getList();
        localStorage.setItem('alone', 2);

        this.ax.get('/other/checkLoginUrl').then((res) => {
            let pass = true;
            res.map((it) => {
                if (it == 'loginAll') {
                    pass = false;
                }
            });
            if (pass) {
                this.$router.push(res[0]);
            }
        });
        this.param.platformId = localStorage.getItem('chooseId') ? localStorage.getItem('chooseId') * 1 : '';

        this.type_btn = localStorage.getItem('chooseType') ? localStorage.getItem('chooseType') * 1 : 1;
        //  localStorage.removeItem('alone')
        // if(localStorage.getItem('user')){
        //     //   this.$router.push('/user/index');
        // }else{

        // }
        // // console.log(this.$store.getters.getIndex)
    },
    methods: {
        getPlatformId(e) {
            localStorage.setItem('chooseId', e);
        },
        getType(e) {
            this.type_btn = e;
            localStorage.setItem('chooseType', e);
        },
        // 获取子平台
        getList() {
            this.ax.get('/login/platform').then((res) => {
                // // console.log(res)
                this.platforms = res.content;
            });
        },
        // 登录
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.param.type = this.type_btn;

                    this.doLogin();
                } else {
                    this.$message.error('请根据提示输入');
                    //// console.log('error submit!!');
                    return false;
                }
            });
        },
        doLogin() {
            this.loading();
            this.param.code = 'A01'
            this.ax
                .post('login/login', this.param)
                .then((it) => {
                    // console.log(it)
                    this.sloading();

                    localStorage.setItem('user', JSON.stringify(it));
                    let info = {
                        username: this.param.username,
                        password: this.Base64.encode(this.param.password)
                    }
                    localStorage.setItem('admin', JSON.stringify(info))
                    if (this.type_btn == 1) {
                        sessionStorage.setItem('login', 'index');
                        //  this.$store.commit('saveIndex', 'index' )
                        this.$router.replace('/index');
                    } else {
                        sessionStorage.setItem('login', 'subIndex');
                        //  this.$store.commit('saveIndex', 'subIndex' )
                        this.$router.replace('/subIndex');
                    }
                })
                .catch((res) => {
                    this.sloading();
                });
        }
    }
};
</script>

<style scoped>
.login_top {
    height: 6.88rem;
    width: 65rem;
    /* justify-content: flex-end; */
    margin: 0 auto;
}

.logo {
    width: 170px;
    height: 70px;
}

.logo_title {
    height: 2.31rem;
    font-size: 1.63rem;
    font-weight: bold;
    line-height: 2.31rem;
    color: #0b748b;
    text-shadow: 2px 6px 2px #ccc;
    font-style: italic;
}

.login_background {
    width: 100%;
    height: 37.44rem;
    object-fit: cover;
    position: absolute;
    z-index: 0;
    background: linear-gradient(90deg, #3178b3, #4091dd);
}

.china_title {
    color: #aaa;
    font-size: 14px;
    /* line-height: 30px; */
}

.title_login {
    letter-spacing: 2px;
    font-size: 16px;
    color: #0b748b;
}

.login_box {
    /* position: absolute; */
    /* top: ; */
    /* padding-top: 8.88rem; */
    height: 37.44rem;
    width: 65rem;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.input_box {
    width: 25.44rem;
    height: 26.88rem;
    background: rgba(255, 255, 255, 1);
    padding: 2.44rem 1.8rem;
    box-sizing: border-box;
}

.login_book {
    width: 29.82rem;
    height: 20.71rem;
    object-fit: cover;
    margin-right: 9.44rem;
}

.login_header {
    padding: 0 4rem;
    box-sizing: border-box;
    font-weight: normal;
    color: #333333;
}

.btn_choose {
    text-align: center;
    transition: 0.5s;
}

.through {
    width: 0;
    background: #fff;
    transition: 0.5s;
}

.active_btn .through {
    width: 2.38rem;
    height: 0.28rem;
    background: rgba(29, 161, 242, 1);
    margin: 0 auto;
}

.bottom {
    position: fixed;
    bottom: 2rem;
    width: 100%;
    text-align: center;
}

.black {
    align-items: center;
    display: flex;
}

.bottom_text {
    float: left;
    margin: 0px 0px 0px 0.2rem;
    color: #939393;
    font-size: 0.9rem;
}

.com {
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #333;
}

.login-btn {
    width: 100%;
    height: 2.88rem;
}
</style>