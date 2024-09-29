<template>
    <div class="fingerprint-auth">
        <img src="../../../assets/images/light/fingerprint_auth.png" alt=""
            style="width: 300px;height: 300px;margin:0 auto;">
        <span :style="{ color: (status == 'fail' ? 'red' : '#1DA1F2') }"
            style="display: flex;justify-content: center;">{{ message }}</span>

    </div>
</template>

<script>
//人脸认证模块
export default {
    props: ["nextPath"],
    data() {
        return {
            message: "请在指纹采集器按压手指",
            WS_HOST: "127.0.0.1:9950",
            socket: null,
            status: 'init',
        };
    },
    computed: {
        list() {
            return this.$store.state.Borrow.progreeList;
        },
        Setting() {
            return this.$store.state.Setting;
        },
        setting() {
            return this.$store.state.Setting.manageSetting;
        },
        platform() {
            return this.$store.state.Setting.platform;
        },

    },
    created() {
        this.$store.dispatch("modifyCaption", "请开始指纹认证");
        this.initFingerprint();
        this.$store.dispatch(
            "modifyProgreeList",
            this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
        );

    },

    methods: {

        /**
         * @description:初始化指纹设备
         */
        initFingerprint() {
            let _this = this
            // WebSocket服务端地址
            const wsUrl = `ws://${this.WS_HOST}/websocket`;

            // 创建WebSocket实例
            try {
                this.socket = new WebSocket(wsUrl);
            } catch (error) {
                this.message = '指纹识别异常,请尝试其他方式登录!'

            }

            // 当WebSocket连接成功打开时
            this.socket.onopen = function (event) {
                console.log("wsConnection open!");

                // 打开指纹设备
                _this.connectFingerprint()
            };

            // 接收服务器消息
            this.socket.onmessage = function (event) {

                if (event.data.includes("识别成功")) {
                    const data = event.data.split(',');
                    const [_, readerNumber, password] = data
                    _this.readerLogin(readerNumber)
                }

                if (event.data.includes("未查询到")) {
                    _this.status = 'fail'
                    _this.message = '指纹识别失败,请先注册指纹或尝试其他方式登录!'
                }
            };

            // 连接关闭时
            this.socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    console.log('[close] Connection died');
                }
            };

            // 错误处理
            this.socket.onerror = function (error) {
                _this.status = 'fail'
                _this.message = '指纹识别异常'

            };
        },

        /**
         * @description 连接指纹设备
         */
        connectFingerprint() {
            let _this = this
            this.$axios.get(`http://${this.WS_HOST}/zk/fingerInit`)
                .then(res => {
                    if (res.msg === '打开成功') {
                        console.log('[指纹初始化成功]');
                        this.status = 'success'
                        _this.verifyFingerprint()
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },

        /**
         * @description 关闭指纹设备
         */
        closeFingerprint() {
            this.$axios.get(`http://${this.WS_HOST}/zk/close`)
                .then(res => {
                    console.log('[关闭指纹设备]');
                })
                .catch(err => {
                    console.log(err);
                })
        },

        /**
         * @description 验证指纹
         */
        verifyFingerprint() {
            this.$axios.get(`http://${this.WS_HOST}/zk/Verify?platformId=${this.platform.id}`,)
                .then(response => {
                    this.message = '长按等待识别'
                    this.$store.commit("set_label_name", "fingerprint");

                })
                .catch(error => {
                    console.log(error);
                    this.message = '指纹识别异常,请尝试其他方式登录!'
                });
        },

        /**
         * @description: 读者登录
         * @param {} readerNumber 
         */
        readerLogin(readerNumber) {
            let query = {
                platformId: this.platform.id,
                readerNumber: readerNumber, //读者证号或者二维码读取的读者证号
                type: 2,
                hardwareType: this.Setting.appType == "one" ? 1 : 2,
            };

            this.$axios
                .post("/hardware/interface/readerLogin", query)
                .then((result) => {
                    let data = result.data;
                    this.$store.dispatch("add_to_log", "未使用密码登录成功");
                    this.$store.dispatch("modifyUserInfo", data);
                    this.$store.dispatch("modifyReadCard", data.number);

                    this.goNextPath();
                })
                .catch((err) => {
                    this.$store.dispatch(
                        "add_to_error_log",
                        "未使用密码登录失败"
                    );
                    this.$func.toast(
                        {
                            content: err || "认证错误",
                            type: "WARNING",
                        },
                        () => {
                            _this.loading = false;
                        }
                    );
                });
        },

        /**
         * @description 登录成功后下一步
         */
        goNextPath() {

            const routeMap = {
                "/borrow/fingerprintAuth": "/borrow/book",
                "/renew/fingerprintAuth": "/renew/select",
                "/search/fingerprintAuth": "/search/projects",
            }
            const toPath = routeMap[this.$route.path]
            console.log("🚀 ~ goNextPath ~ toPath:", toPath)

            setTimeout(() => {
                this.$router.push({
                    path: toPath
                });
            }, 300);
        },
    },
    beforeDestroy() {
        this.$store.commit("set_label_name", "");
        this.closeFingerprint();
        this.socket.close();
    },
};
</script>

<style lang="less" scoped>
.fingerprint-auth {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 500px;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #fff;
}
</style>