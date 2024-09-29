<template>
    <div id="background">
        <div class="back-header">
            <div class="header-title">
                <img
                    class="title-setting"
                    v-if="setting.titleType == 'setting'"
                    src="@/assets/images/child/setting.png"
                    alt
                />
                <img
                    class="title-name"
                    v-if="setting.titleType == 'title'"
                    src="@/assets/images/child/library_title.png"
                    alt
                />
            </div>
            <div class="header-operating">
                <img
                    class="operating-img pointer"
                    @click="goHome"
                    src="@/assets/images/child/home.png"
                    alt
                />
                <img
                    class="operating-img pointer"
                    v-if="setting.back"
                    @click="prev"
                    src="@/assets/images/child/back.png"
                    alt
                />
                <div
                    class="operating-menu"
                    v-if="userInfo && userInfo.name && !overduce"
                    id="menu-btn"
                    @click="showMenu = true"
                >
                    <img
                        class="header-opreating"
                        src="@/assets/images/child/header_opreating.png"
                        alt
                    />
                    <div class="opreating-modal pd-20">
                        <div class="font-32">
                            {{ type ? typeList[type] : "逾期" }}
                        </div>
                        <img
                            class="w-24"
                            src="@/assets/images/child/arrow_bottom.png"
                            alt
                        />
                    </div>

                    <div
                        class="menu-list font-24 pd-20"
                        id="menu-list"
                        v-if="showMenu"
                    >
                        <div
                            v-for="(item, index) in menuList"
                            :key="index"
                            @click="change(item)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="back-body">
            <img
                class="flower flower-left flower-top"
                src="@/assets/images/child/flower_left_top.png"
                alt
            />
            <img
                class="flower flower-left flower-bottom"
                src="@/assets/images/child/flower_left_bottom.png"
                alt
            />
            <img
                class="flower flower-right flower-top"
                src="@/assets/images/child/flower_right_top.png"
                alt
            />
            <img
                class="flower flower-right flower-bottom"
                src="@/assets/images/child/flower_right_bottom.png"
                alt
            />
            <div class="body-box">
                <div class="caption-user flex-row flex-between">
                    <div
                        class="user-info"
                        :class="userInfo && userInfo.name ? '' : 'transparent'"
                    >
                        <img
                            class="w-user-bg"
                            src="@/assets/images/child/user_bg.png"
                            alt
                        />
                        <div class="info-text font-30">
                            {{ userInfo ? userInfo.name : "" }}
                        </div>
                    </div>
                    <captionTime :time="time" v-if="setting.showTime"></captionTime>
                </div>
                <slot name="body"></slot>
            </div>
        </div>

        <copyright :color="'#333'" />
    </div>
</template>

<script>
import copyright from "@/components/common/copyright";
import captionTime from "@/components/common/captionTime";
export default {
    components: {
        copyright,
        captionTime,
    },
    /**设置 */
    props: {
        setting: {
            type: Object,
            value: {
                showTime: true,
                titleType: "title",
                back: true,
            },
        },
    },
    data() {
        return {
            showMenu: false,
            menuList: [
                {
                    name: "借书",
                    key: "selfServiceBorrowIsLoan",
                    list: [
                        {
                            name: "选择认证方式",
                            select: true,
                            ico: "auth_",
                        },
                        {
                            name: "进行认证",
                            select: true,
                            ico: "loading_",
                        },
                        {
                            name: "确认密码",
                            select: true,
                            ico: "password_",
                            path: "/borrow/password",
                        },
                        {
                            name: "放置图书",
                            select: false,
                            ico: "book_",
                            path: "/borrow/book",
                            jumpPath: "/borrow/book",
                        },
                        {
                            name: "确认信息",
                            select: false,
                            ico: "info_",
                            path: "/borrow/info",
                        },
                        {
                            name: "借书成功",
                            select: false,
                            ico: "success_",
                        },
                    ],
                },
                {
                    name: "还书",
                    key: "selfServiceBorrowIsRestitution",
                    list: [
                        {
                            name: "放置图书",
                            select: false,
                            ico: "book_",
                            path: "/return/book",
                            jumpPath: "/return",
                        },
                        {
                            name: "确认信息",
                            select: false,
                            ico: "info_",
                            path: "/return/info",
                        },
                        {
                            name: "还书成功",
                            select: false,
                            ico: "success_",
                        },
                    ],
                },
                {
                    name: "续借",
                    key: "selfServiceBorrowIsRenew",
                    list: [
                        {
                            name: "选择认证方式",
                            select: true,
                            ico: "auth_",
                        },
                        {
                            name: "进行认证",
                            select: true,
                            ico: "loading_",
                        },
                        {
                            name: "确认密码",
                            select: true,
                            ico: "password_",
                            path: "/renew/password",
                        },
                        {
                            name: "选择图书",
                            select: false,
                            ico: "select_",
                            path: "/renew/select",
                            jumpPath: "/renew/select",
                        },
                        {
                            name: "续借成功",
                            select: false,
                            ico: "success_",
                        },
                    ],
                },
                {
                    name: "查询",
                    key: "selfServiceBorrowIsInquire",
                    list: [
                        {
                            name: "选择认证方式",
                            select: true,
                            ico: "auth_",
                        },
                        {
                            name: "进行认证",
                            select: true,
                            ico: "loading_",
                        },
                        {
                            name: "确认密码",
                            select: true,
                            ico: "password_",
                            path: "/search/password",
                        },
                        {
                            name: "选择查询项目",
                            select: false,
                            ico: "projects_",
                            path: "/search/projects",
                            jumpPath: "/search/projects",
                        },
                    ],
                },
            ],
            typeList: {
                borrow: "借书",
                return: "还书",
                renew: "续借",
                search: "查询",
            },
            time:30
        };
    },
    created() {
        let _this = this;
        window.onclick = (e) => {
            if (e.path[1].id != "menu-list" && e.path[1].id != "menu-btn") {
                _this.showMenu = false;
            }
        };
        this.$bus.$on("changeTime", (data) => {
            this.time = data;
        });
    },
    computed: {
        clear() {
            return this.$store.state.User.clear;
        },
        userInfo() {
            return this.$store.state.User.userInfo;
        },
        type() {
            return this.$route.meta.type;
        },
        overduce() {
            return this.$store.state.User.overduceList.length;
        },
        manageSetting() {
            return this.$store.state.Setting.manageSetting;
        },
    },
    methods: {
        /**
         * @description:切换流程
         */
        change(item) {
            if (!this.manageSetting[item.key]) {
                this.$alert("暂未开放此功能", "提示");
                return;
            }

            let href = window.location.href.split("#");
            let path = this.$func.getNextKey(item.list, "jumpPath");
            console.log(href, path);

            if (path != href[1]) {
                this.$store.dispatch("modifyProgreeList", item.list);
                href[1] = path;

                window.location.href = href.join("#");
            } else {
                // this.showMenu = false;
            }
        },
        /**
         *  @description:回到首页
         */
        goHome() {
            this.$confirm("确定放弃当前操作回到首页吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info",
            }).then((res) => {
                this.$router.replace("/");
            });
        },
        /**
         * @description:回到上一页
         */
        prev() {
            if (this.clear) {
                this.$store.dispatch("clearUserInfo");
            }
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="less" scoped>
.operating-menu {
    width: 25% !important;
    float: right;
    position: relative;
    margin: 2%;
    cursor: pointer;
    .header-opreating {
        width: 100%;
        height: auto;
    }
    .opreating-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 32px;
    }
    .menu-list {
        position: absolute;
        background-color: white;
        border-radius: 20px;
        width: 100%;
        z-index: 999;
        box-shadow: 0px 3px 6px rgba(29, 161, 242, 0.19);
        animation: showList 0.2s;
        div {
            cursor: pointer;
            &:not(:last-child) {
                margin-bottom: 10%;
            }
        }
    }
}
@keyframes showList {
    0% {
        transform: translateY(50%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
#background {
    min-width: 768px;
    width: 100vw;
    height: 100vh;
    background: url("~@/assets/images/child/all_bg.png");
    background-size: 100% 100%;
    padding: 2.5% 10%;
    box-sizing: border-box;
    .back-body {
        width: 100%;
        height: 70%;
        margin: 4% auto;
        background-color: white;
        border-radius: 20px;
        position: relative;
        box-shadow: 0 8px 0 0 #c1e1ff;
        .flower {
            position: absolute;
            width: 13%;
            height: auto;
        }
        .flower-top {
            top: 0;
        }
        .flower-bottom {
            bottom: 0;
        }
        .flower-right {
            right: 0;
        }
        .flower-left {
            left: 0;
        }
        .body-box {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99;
            padding: 5% 10%;
            box-sizing: border-box;
            .caption-user {
                position: absolute;
                top: 5%;
                width: 80%;

                .user-info {
                    position: relative;
                    img {
                        height: auto;
                    }
                    .info-text {
                        position: absolute;
                        top: 0;
                        left: 32%;
                        bottom: 0;
                        right: 8%;
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
            //   background-color: red;
        }
    }
    .back-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header-title {
        img {
            width: 100%;
            height: 100%;
            display: block;
        }
        width: 50%;
        min-width: 380px;
        flex: 1;
        .title-setting {
            width: 40%;
            min-width: 150px;
        }
        .title-name {
            width: 80%;
            min-width: 300px;
        }
    }
    .header-operating {
        width: 50%;
        float: right;
        .operating-img {
            width: 12%;
            height: auto;
            float: right;
            margin: 2%;
        }
    }
}
</style>
