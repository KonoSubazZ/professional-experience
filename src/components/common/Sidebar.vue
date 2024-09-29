<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#1F2D3D"
            text-color="#fff"
            :unique-opened="true"
            active-text-color="#1DA1F2"
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs.length > 1">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <img :src="item.icon" class="icon" />
                            <span slot="title">
                                {{ item.title }}
                                <span class="red" v-if="item.countKey">({{ sideBarCount[item.countKey] || 0 }})</span>
                            </span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                                <span class="red" v-if="subItem.countKey">({{ sideBarCount[subItem.countKey] || 0 }})</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.subs[0].index" :key="item.index">
                        <img :src="item.icon" class="icon" />
                        <span slot="title">
                            {{ item.title }}
                            <span class="red" v-if="item.countKey">({{ sideBarCount[item.countKey] || 0 }})</span>
                        </span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import { fileURLToPath } from 'url';
import { relativeTimeThreshold } from 'moment';

export default {
    data() {
        return { bus: this.bus(this), permissions: [], collapse: false, items: [], sideBarCount: {} };
    },
    computed: {
        onRoutes() {
            let path = '';
            this.items.forEach((it) => {
                if (it.subs.length > 0) {
                    it.subs.forEach((item) => {
                        if (this.$route.path.indexOf(item.index) != -1) {
                            path = item.index;
                        }
                    });
                }
            });
            return path;
        }
    },
    methods: {
        getPermission() {
            return this.ax.get('manage/manager/permission');
        },
        menus(res) {
            // debugger
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            let user = JSON.parse(localStorage.getItem('user'));
            // user.permissions =res
            this.permissions = user.permissions;
            let allowedMenu = this.permissions.map((it) => {
                return it.path;
            });

            let paths_path = '';
            let routers = this.$router.options.routes.filter((it) => {
                if (user.type == 1) {
                    return it.name == 'home';
                } else if (user.type == 2 || user.type == 3) {
                    this.$store.commit('saveIndex', JSON.parse(sessionStorage.getItem('saveIndex')).index);
                    if (this.$store.getters.getIndex == 'library') {
                        paths_path = 'catalogue';
                        return it.name == 'catalogue';
                    } else if (this.$store.getters.getIndex == 'operator') {
                        paths_path = 'manage';
                        return it.name == 'manage';
                    } else if (this.$store.getters.getIndex == 'circulation') {
                        paths_path = 'circulation';
                        return it.name == 'circulation';
                    } else if (this.$store.getters.getIndex == 'periodical') {
                        paths_path = 'periodical';
                        return it.name == 'periodical';
                    } else if (this.$store.getters.getIndex == 'opac') {
                        paths_path = 'opac';
                        return it.name == 'opac';
                    } else if (this.$store.getters.getIndex == 'echarts') {
                        paths_path = 'echarts';
                        return it.name == 'echarts';
                    } else if (this.$store.getters.getIndex == 'workStation') {
                        paths_path = 'workStation';
                        return it.name == 'workStation';
                    }
                }
            })[0].children;

            //   // // console.log(routers)
            let userType = user.info && user.info.type;
            let whiteList = [];
            this.items = routers.map((it) => {
                let item = {
                    icon: it.icon,
                    title: it.meta.title,
                    index: it.path,
                    hide: it.hide,
                    countKey: it.countKey
                };

                if (it.children) {
                    item.subs = it.children
                        .map((child) => {
                            let path;
                            if (user.type == 'SUPER_MANAGER' || user.type == 1) {
                                path = child.path.indexOf('/') == 0 ? child.path : it.path + '/' + child.path;
                                //  // console.log(path)
                            } else if (user.type == 2 || user.type == 3) {
                                path =
                                    child.path.indexOf('/' + paths_path) == 0
                                        ? child.path
                                        : '/' + paths_path + '/' + it.path + '/' + child.path;
                            }

                            return {
                                index: path,
                                title: child.meta.title,
                                menu: it.meta.title + ',' + child.meta.title,
                                hide: child.hide,
                                countKey: child.countKey
                            };
                        })
                        .filter((sub) => {
                            if (userType == 'SUPER_MANAGER' || (sub.meta && sub.meta.whiteList)) {
                                return true;
                            } else {
                                let isTure = false;

                                allowedMenu.map((it) => {
                                    //  // console.log(it)
                                    if (it.split(',').length == 2) {
                                        if (it.indexOf(sub.menu.split(',')[0]) > -1) {
                                            return (isTure = true);
                                        }
                                    } else {
                                        if (it.indexOf(sub.menu) > -1) {
                                            return (isTure = true);
                                        }
                                    }
                                });

                                return isTure;
                            }
                        });
                }
                //  // console.log(item)
                return item;
                // }
            });
            // // console.log(this.items)
            this.items = this.items.filter((it) => {
                //    // // console.log(it)
                if (!it.subs || !it.subs.length || it.hide) {
                    return false;
                }

                it.subs = it.subs.filter((item) => {
                    // // console.log(item.index)
                    if (item.hide) {
                        return false;
                    }
                    return true;
                });
                return true;
            });
            // // console.log(this.items)
            this.sloading();
            bus.$emit('allowMenu', this.items);
        }
    },
    created() {
        // this.getPermission()
        // .then(res=>{
        this.menus();
        // })
        bus.$on('getMenus', () => {
            //   this.getPermission()
            //     .then(res=>{
            this.menus();
            // })
        });
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    height: 99%;
    overflow: hidden;
    padding-bottom: 110px;
    box-sizing: border-box;
    /* padding-bottom: 200px; */
}
.sidebar ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
    box-shadow: 0px 10px 10px rgba(230, 230, 230, 1);
}
.sidebar > ul {
    height: 100%;
    overflow: auto;
}
.red {
    color: red;
}
.icon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
}
</style>
