<template>
    <div class="face-auth" :class="appType == 'two' ? 'top-35' : ''">
        <div class="face-start" v-if="status == 'start'">
            <img class="margin-center" :class="
                skin == 'child'
                    ? 'w-status-img'
                    : skin == 'dark'
                        ? 'w-status-dark'
                        : 'w-status-light'
            " :src="require('@/assets/images/' + skin + '/face_start.png')" alt />
            <div class="mt-40">
                <button class="form-blue-btn font-24" @click="start">
                    开始人脸扫描
                </button>
            </div>
        </div>
        <div class="face-loading mt-110-upper" v-if="status == 'loading'">
            <div class="w-scan margin-center posi-rela" style="width:500px" :class="appType == 'two' ? 'two-card-scan' : ''">
                <img class="loading" :class="appType == 'two' ? 'two-card-scan' : ''"
                    src="@/assets/images/child/face_loading.png" alt />
                <div class="posi-scan w-scan-posi" :class="appType == 'two' ? 'two-scan-posi' : ''"
                    v-loading="faceLoading" element-loading-text="识别中">
                    <div id="video" class="video-box" v-if="startStatus == 'loading'">
                        <video width="100%" style="object-fit: cover" height="100%"></video>
                        <div class="video-canvas">
                            <canvas width="100%" height="100%"></canvas>
                        </div>
                    </div>
                    <div class="scan-top"></div>
                    <span class="times" v-if="picTimeShow">{{ picTime }}</span>
                </div>
            </div>

            <canvas width="100%" height="100%"></canvas>
        </div>
        <div class="face-error" v-if="status == 'error'">
            <img class="margin-center" :class="
                skin == 'child'
                    ? 'w-status-img'
                    : skin == 'dark'
                        ? 'w-status-dark'
                        : 'w-status-light'
            " :src="require('@/assets/images/' + skin + '/auth_error.png')" alt />
            <div class="flex-row flex-center">
                <img class="w-24" style="margin-right: 1rem" src="@/assets/images/child/error_icon.png" alt />
                <div class="color-red font-18">{{ caption }}</div>
            </div>
            <div class="flex-row flex-center mt-40">
                <button class="form-blue-btn font-24 mr-10" @click="start">
                    继续尝试
                </button>
                <button class="form-yellow-btn font-24" @click="recertify">
                    更换认证方式
                </button>
            </div>
        </div>
    </div>
</template>

<script>
//人脸认证模块
import test from "@/api/hardWare_renderer.js";

export default {
    props: ["nextPath"],
    data() {
        return {
            status: "start", //人脸认证状态.start,loading,error
            startStatus: "start",
            setTimeout: "",
            testReader: "",
            loginStatus: false, //登录状态
            oldPressList: [], //未删除确认密码的进度数组
            picTime: '',
            picTimeShow: false,
            faceLoading: false,
        };
    },
    computed: {
        skin() {
            return this.$store.state.Setting.skin;
        },
        list() {
            return this.$store.state.Borrow.progreeList;
        },
        backStatus() {
            return this.$store.state.Setting.back;
        },
        caption() {
            return this.$store.state.Borrow.caption;
        },
        appType() {
            return this.$store.state.Setting.appType;
        },
        face() {
            return this.$store.state.User.face;
        },
        User() {
            return this.$store.state.User;
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
    watch: {
        backStatus(val) {
            if (!val) {
                this.authFail();
            }
        },
    },
    created() {
        this.$store.dispatch("add_to_log", "人脸认证");
        this.testReader = test.init();
        this.$store.dispatch("modifyCaption", "请点击开始扫描");
        this.oldPressList = this.$func.setNextTrue(
            JSON.parse(JSON.stringify(this.list))
        );
        let list = JSON.parse(JSON.stringify(this.list));
        list = list.filter((it) => {
            return it.name != "确认密码";
        });
        // this.$store.dispatch("modifyUserInfo", {
        //   name: "chenlin",
        // });
        this.$store.dispatch("modifyProgreeList", this.$func.setNextTrue(list));
    },
    destroyed() {
        this.$store.commit("set_label_name", "");
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.setTime) {
            clearTimeout(this.setTime)

        }
    },
    methods: {
        /**
         * @description:开始人脸扫描
         */
        start() {
            this.$store.commit("set_label_name", "camera");
            this.checkCamera();
            const times = 3;
            if (!this.timer) {
                this.picTime = times;
                this.picTimeShow = true;
                this.timer = setInterval(() => {
                    if (this.picTime > 1 && this.picTime <= times) {
                        this.picTime--;
                    } else {
                        this.picTimeShow = false;
                        clearInterval(this.timer)
                        this.timer = null;
                    }
                }, 1000);
            }
        },
        /**
         * 测试摄像头 未知型号
         */
        checkCamera() {
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.enumerateDevices
            ) {
                this.$store.dispatch(
                    "add_to_error_log",
                    "当前浏览器不支持该功能"
                );
                // this.$func.toast({
                //     content: "当前浏览器不支持该功能，请联系管理员",
                //     type: "ERROR",
                // });
                this.mediaStatus = false;
            } else {
                navigator.mediaDevices
                    .enumerateDevices()
                    .then((data) => {
                        // this.infoList = data.map((it) => {
                        //     return (
                        //         it.kind + ":" + it.label + "id=" + it.deviceId
                        //     );
                        // });
                        this.$nextTick(() => {
                            let list = data.filter((it) => {
                                return (
                                    (this.appType == "two" &&
                                        it.kind == "videoinput") ||
                                    it.label.indexOf("RGB") > -1 ||
                                    (this.appType == "one" &&
                                        it.kind == "videoinput")
                                );
                            });
                            if (!list || !list.length) {
                                this.mediaStatus = false;
                                this.authFail("未找到摄像头");
                                return;
                            }
                            navigator.mediaDevices
                                .getUserMedia({
                                    video: {
                                        deviceId: {
                                            exact:list.filter(as=>as.label.indexOf('RGB')>-1).length!=0?list.filter(as=>as.label.indexOf('RGB')>-1)[0].deviceId:list[1].deviceId,
                                        },
                                    },
                                })
                                .then((stream) => {
                                    this.status = "loading";
                                    this.startStatus = "loading";
                                    this.$store.dispatch(
                                        "modifyCaption",
                                        "请将脸部对准摄像头，确保光线充足"
                                    );
                                    this.$store.dispatch("modifyBack", true);
                                    setTimeout(() => {
                                        let video = document.querySelector(
                                            "#video video"
                                        );
                                        video.src = window.URL.createObjectURL(
                                            stream
                                        );
                                        video.play();
                                        if (this.interval) {
                                            clearInterval(this.interval);
                                        }
                                        this.interval = setInterval(() => {
                                            this.pictrue();
                                        }, 3000);
                                    }, 0);
                                })
                                .catch((err) => {
                                    this.$store.dispatch(
                                        "add_to_error_log",
                                        "未获取到视频流"
                                    );
                                    // this.$func.toast({
                                    //     content: "获取视频失败，请联系管理员",
                                    //     type: "ERROR",
                                    // });
                                });
                        });
                    })
                    .catch((err) => {
                        this.$store.dispatch(
                            "add_to_error_log",
                            "未获取到摄像头列表"
                        );
                        // this.$func.toast({
                        //     content: "获取视频列表失败，请联系管理员",
                        //     type: "ERROR",
                        // });
                    });
            }
        },
        /**
         * 截取图片
         */
        pictrue() {
            let canvas = document.getElementsByTagName("canvas")[0];
            let video = document.getElementsByTagName("video")[0];
            let v = document.getElementById("video");
            let vInfo = v.getBoundingClientRect();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.style.objectFit = "cover";
            let context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            this.$store.dispatch("add_to_log", "开始调用人脸认证api");

            let status = this.testReader.testFace({
                img: canvas
                    .toDataURL("image/png")
                    .replace("data:image/png;base64,", ""),
            });
            this.$store.dispatch("add_to_log", "人脸认证分数:" + status);

            if (status == 600) {
                this.$store.dispatch("add_to_error_log", "调用人脸api失败");
            } else {
                if (
                    (status * 100 >=
                        this.setting
                            .selfServiceCardMachineIsFaceRecognitionScore &&
                        this.appType == "two") ||
                    (status * 100 >=
                        this.setting.selfServiceBorrowIsFaceRecognitionScore &&
                        this.appType == "one")
                ) {
                    this.$store.dispatch("add_to_log", "人脸认证成功");
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                    this.$store.dispatch(
                        "modifyFace",
                        canvas
                            .toDataURL("image/png")
                            .replace("data:image/png;base64,", "")
                    );
                    this.faceLogin();
                }
            }
        },
        /**
         * 人脸登录
         */
        faceLogin() {
            if (this.loginStatus) {
                return;
            }
            this.faceLoading = true;
            this.$store.dispatch("add_to_log", "人脸认证登录");
            this.$axios
                .post("/hardware/interface/readerLogin", {
                    photo: this.face,
                    platformId: this.platform.id,
                    type: 1,
                    hardwareType: this.Setting.appType == "one" ? 1 : 2,
                })
                .then((res) => {
                    let data = res.data;
                    clearInterval(this.interval);
                    console.log(data, "chen");
                    this.$store.commit("set_user_info", data);
                    this.$store.commit("set_read_card", data.number);
                    this.$store.dispatch("add_to_log", "人脸认证登录成功");
                    this.getAfterInfo(data);
                    this.faceLoading = false;

                })
                .catch((err) => {
                    this.$message.warning(err)
                    const times = 3;
                    if (!this.timer) {
                        this.picTime = times;
                        this.picTimeShow = true;
                        this.timer = setInterval(() => {
                            if (this.picTime > 1 && this.picTime <= times) {
                                this.picTime--;
                            } else {
                                this.picTimeShow = false;
                                clearInterval(this.timer)
                                this.timer = null;
                            }
                        }, 1000);
                    }
                    this.setTime = setTimeout(() => {
                        this.pictrue();
                    }, 3000);
                    this.loginStatus = false;
                    this.faceLoading = false;
                    this.$store.dispatch(
                        "add_to_error_log",
                        "人脸认证登录失败"
                    );
                });
        },
        /**
         * 获取是否有逾期数据
         */
        getAfterInfo(data) {
            let query = {
                readerNumber: data.number,
                platformId: this.platform.id,
            };
            console.log(data, query);
            this.$axios
                .get("/hardware/interface/borrowingInformationOverdue", query)
                .then((over) => {
                    console.log(over);
                    this.loginStatus = false;
                    let list = over.data.content || [];
                    list.forEach((it) => {
                        it.borrowAlso = this.$func.changeDate(it.borrowAlso);
                    });
                    if (!list || !list.length) {
                        this.authSuccess();
                    } else {
                        this.$store.dispatch("modifyOverduce", list);
                        this.$router.push({
                            path: "/overduce",
                        });
                    }
                })
                .catch((err) => {
                    this.$store.dispatch(
                        "add_to_error_log",
                        "获取逾期数据接口调用失败"
                    );
                    this.$store.dispatch("modifyCaption", '逾期信息有异常');
                    this.status = "error";
                    // this.$func.toast({
                    //     content: "系统出现错误，暂时不能认证，请联系管理员",
                    //     type: "ERROR",
                    // });
                });
        },
        /**
         * @description:重新选择认证方式。
         */
        recertify() {
            this.$store.dispatch(
                "modifyProgreeList",
                this.$func.setPrevFalse(
                    JSON.parse(JSON.stringify(this.oldPressList))
                )
            );
            this.$router.go(-1);
        },
        /**
         * @description:逾期
         */
        authOverduce() {
            this.$router.push("/overduce");
        },
        /**
         * @description:人脸认证失败
         */
        authFail(msg) {
            this.startStatus = "start";
            if (this.interval) {
                clearInterval(this.interval);
            }
            if (this.setTime) {
                clearTimeout(this.setTime)

            }
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            console.log(666, msg);
            this.$store.dispatch("add_to_log", msg || "人脸认证失败");
            this.$nextTick(() => {
                this.$store.commit("set_label_name", "fail");
            });
            this.$store.dispatch("modifyCaption", msg || "人脸识别失败");
            this.$store.dispatch("modifyBack", false);
            this.status = "error";
        },
        /**
         * @description:"认证成功"
         */
        authSuccess() {
            this.$router.push({
                path: this.$func.getNextPath(this.list),
            });
        },
    },
};
</script>

<style lang="less" scoped>
.times {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 15rem;
    color: #fff;
}

@keyframes toTop {
    0% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(-100%);
    }
}

#video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.face-info {
    position: absolute;
    top: 30%;
    left: 0;
    right: 0;
    margin: 0 auto;
}

.face-auth {
    position: absolute;
    top: 30%;
    left: 0;
    right: 0;
    margin: 0 auto;

    .face-start {
        text-align: center;
    }

    .font-18 {
        font-size: 1.7rem !important;
    }

    .font-24 {
        font-size: 1.7rem;
    }

    .w-status-light {
        width: 26rem;
    }

    .form-blue-btn,
    .form-yellow-btn {
        padding: 1rem 2rem !important;
    }

    .face-loading {
        .loading {
            width: 100%;
            height: 100%;
        }

        .posi-scan {
            position: absolute;
            //   background-color: rgba(0, 0, 0, 0.5);
            top: 50%;
            left: 0;
            right: 0;
            margin: 0 auto;
            border-radius: 50%;
            overflow: hidden;
            transform: translateY(-50%);

            .video {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }

            .scan-top {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                // transform: translateY(-30%);
                background: linear-gradient(#1da1f2, rgba(255, 255, 255, 0));
                animation: toTop 2s ease-in infinite;
            }
        }
    }

    .w-scan {
        width: 40rem;
        height: 40rem;
    }

    .posi-scan {
        width: 22rem;
        height: 22rem;
    }
}

.video-canvas {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    // opacity: ;
}

.two-card-scan {
    height: 450px !important;
    width: 450px !important;
}

.two-scan-posi {
    width: 248px !important;
    height: 248px !important;
}

.two-scan-card {
    width: 400px;
    height: 400px;
}

.top-35 {
    top: 35% !important;
}
</style>