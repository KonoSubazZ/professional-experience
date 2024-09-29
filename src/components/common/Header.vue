<template>
    <div class="header">
        <div class="logo" :style="width">
            <div class="logo_name" v-if="$route.path.replace('#', '') == '/subIndex'">蓝鲸图书馆后台管理系统</div>
            <div class="logo_name" v-else-if="$route.path.replace('#', '') == '/index' || type == '1'">区域集群管理平台</div>
            <div v-else>
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link"> {{ chooseName }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="btn_laber" command="index">主页</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="library">编目模块</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="circulation">流通模块</el-dropdown-item>

                        <el-dropdown-item class="btn_laber" command="periodical">期刊模块</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="opac">OPAC管理</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="operator">系统模块</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="echarts">报表模块</el-dropdown-item>
                        <el-dropdown-item class="btn_laber" command="doc">帮助文档</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="header-right display_flex">
            <!-- 弹出框 -->
            <el-popover class="m-r-30" placement="bottom" v-model="visible" width="200" trigger="click">
                <div v-for="(item, index) of list" :key="index">
                    <span @click="messageInfos(item)">{{ index + 1 }}.{{ item.note }}</span>
                </div>
                <div v-if="list.length == 0">暂无消息</div>
                <!-- 标记 -->
                <el-badge @click="visible = !visible" :value="list.length" type="primary" class="item f-s-12 m-r-30" slot="reference">
                    <div class="cursor f-s-20">
                        <i class="el-icon-bell"></i>
                    </div>
                </el-badge>
            </el-popover>
            <div class="header-user-con">
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item command="changePass">修改登录密码</el-dropdown-item> -->
                        <el-dropdown-item divided class="btn_laber" command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
import axios from 'axios';
export default {
    data() {
        return {
            bus: this.bus(this),
            changePassDialog: false,
            chooseName: '',
            collapse: false,
            fullscreen: false,
            type: '',
            name: '未登录',
            message: 2,
            newPass: {},
            width: 'width:250px',
            list: [],
            userMessage: [],
            visible: false,
            unread: 0,
            index: ''
        };
    },
    computed: {
        username() {
            let username = '未登录';
            try {
                username = JSON.parse(localStorage.getItem('user')).info.name;
                this.type = JSON.parse(localStorage.getItem('user')).type;
            } catch (e) {}
            return username ? username : this.name;
        }
    },
    created() {
        let time = (6000*10)*5
        setInterval(() => {
            this.getNews();
        }, time);//五分钟
        // },1000);
        if (sessionStorage.getItem('saveIndex')) {
            this.chooseName = JSON.parse(sessionStorage.getItem('saveIndex')).name;
        }

        if (sessionStorage.getItem('login')) {
            this.index = sessionStorage.getItem('login');
        }
        bus.$on('userMesssage', (data) => {
            data.map((it) => {
                it.createTime = this.getTime(it.createTime);
            });
            this.userMessage = data;
            this.unread = data.filter((it) => {
                return !it.readState;
            }).length;
        });
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    },
    methods: {
        getNews() {
            axios
                .get(window.location.origin + '/manage/unit/general/reminderMessage', {
                    params: { platformId: JSON.parse(localStorage.getItem('user')).platform.id }
                })
                .then((res) => {
                    console.log(res,'sdadad')
                    if (res.data.length > 0) {
                        this.list = res.data;
                    } else {
                        this.list = [];
                    }
                });
        },
        messageInfos(item) {
            this.ax
                .get('/manage/unit/general/readMessageInfo', { params: { id: item.messageInfoId } })
                .then((res) => {
                    // console.log(res)
                    this.$message.success('当前消息已读');
                    this.getNews();
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        updateMessageRead(id) {//未调用
            let query = {};
            if (id) {
                query.id = id;
            }
            this.ax.post('common/message', query).then((it) => {
                if (id) {
                    this.unread--;
                } else {
                    this.unread = 0;
                }
            });
        },
        changePassword() {//未调用
            this.$router.push({
                path: '/personal/changePwd'
            });
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            this.loading();
            if (command == 'loginout') {
                this.sloading();
                this.doLogout();
            } else if (command == 'index') {
                this.sloading();
                this.$router.replace({
                    path: '/subIndex'
                });
            } else if (command == 'library') {
                this.chooseName = '编目模块';
                let params = { name: '编目模块', index: 'library', path: '/catalogue/literature/library' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/catalogue/literature/library'
                });
                bus.$emit('getMenus');
            } else if (command == 'operator') {
                this.chooseName = '系统模块';
                let params = { name: '系统设置', index: 'operator', path: '/manage/parameter/admin' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/manage/parameter/infos'
                });
                bus.$emit('getMenus');
            } else if (command == 'periodical') {
                this.chooseName = '期刊模块';
                let params = { name: '期刊预订', index: 'periodical', path: '/periodical/reserve/accept' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/periodical/reserve/accept'
                });
                bus.$emit('getMenus');
            } else if (command == 'circulation') {
                this.chooseName = '流通模块';
                let params = { name: '流通管理', index: 'circulation', path: '/circulation/manage/index' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/circulation/manage/index'
                });
                bus.$emit('getMenus');
            } else if (command == 'opac') {
                this.chooseName = 'OPAC设置';
                let params = { name: 'OPAC设置', index: 'opac', path: '/opac/recommend/index' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/opac/recommend/index'
                });
                bus.$emit('getMenus');
            } else if (command == 'echarts') {
                this.chooseName = '报表模块';
                let params = { name: '报表模块', index: 'echarts', path: '/echarts/periodical/booking' };
                sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/echarts/periodical/booking'
                });
                bus.$emit('getMenus');
            } else if (command == 'doc') {
                this.chooseName = '帮助文档';
                 this.sloading();
                 let params = { name: '帮助文档', index: 'doc', path: '/doc' };
                 sessionStorage.setItem('saveIndex', JSON.stringify(params));
                this.$router.replace({
                    path: '/doc'
                });
                bus.$emit('getMenus');
            }
        },
        doLogout() {//退出登录
            if (localStorage.getItem('alone') == 1) {
                // localStorage.removeItem('alone');
                localStorage.removeItem('user');
                localStorage.removeItem('admin');
                sessionStorage.clear();
                let path = '/loginAlone?id=' + localStorage.getItem('platformId');
                // console.log(path)
                this.$router.push(path);
            } else if (localStorage.getItem('alone') == 2) {
                // localStorage.removeItem('alone');
                localStorage.removeItem('user');
                localStorage.removeItem('admin');
                sessionStorage.clear();
                this.$router.push('/loginAll');
            } else if (localStorage.getItem('alone') == 3) {
                // localStorage.removeItem('alone');
                localStorage.removeItem('user');
                localStorage.removeItem('admin');
                sessionStorage.clear();
                this.$router.push('/singleVisionLogin');
            } else {
                //localStorage.clear()
                sessionStorage.clear();
                // localStorage.removeItem('alone');
                localStorage.removeItem('user');
                localStorage.removeItem('admin');
                this.$router.push('/login');
            }

            // localStorage.clear()
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            if (this.collapse) {
                this.width = 'width:0px;';
            } else {
                this.width = 'width:250px';
            }
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {  //未调用
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 18px;
    color: #fff;
    background: #1f2d3d;
    z-index: 10;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
    background: #1f2d3d;
    /* color: #fff; */
}
.collapse-btn:hover {
    background: #1f2d3d;
    color: #fff;
}
.header .logo {
    float: left;
    /* width: ; */
    line-height: 70px;
    transition: 0.4s;
    color: #fff;
    overflow: hidden;
    /* text-align: center; */
    background: #1f2d3d;
}
/* .collapse-btn:hover {
    background: #fff;
} */
.header .logo {
    float: left;

    line-height: 70px;
    transition: 0.4s;
    color: #fff;

    /* background: #304156; */
}
.logo .logo_name {
    width: 250px;
    text-align: center;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    background: #fff;
}
.btn-bell .el-icon-bell {
    background: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown {
    font-size: 16px;
    text-align: center;
    margin: 0 auto;
    display: block;
}

.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.user-name .el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.tips {
    text-align: center;
}
.message_box {
    max-height: 500px;
    overflow: auto;
}
.btn_message {
    padding: 10px;
}
.color_gre {
    color: #d8d8d8;
}
.btn_laber {
    height: 40px;
    line-height: 40px;
    width: 120px;
    background: linear-gradient(90deg, #1f2d3d, #1f6cc4);
}
</style>
