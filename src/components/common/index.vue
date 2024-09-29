<template>
    <div>
        <v-header></v-header>
        <div class="subIndex">
            <img src="../../assets/img/index_background.png" class="background_index" />
            <div class="display_flex grounp wrap">
                <div class="index_box m-r-20 m-b-20 cursor" :class="'index' + i" v-for="(item, i) of list" :key="i" @click="jump(item)">
                    <div>
                        <img :src="item.src" class="index_icon m-b-20" />
                        <div class="index_bar f-w-s">{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </div>
        <v-bottom></v-bottom>
    </div>
</template>

<script>
import vHeader from './Header';
import vBottom from './bottom';
export default {
    data() {
        return {
            bus: this.bus(this),
            list: [
                {
                    name: '编目模块',
                    index: 'library',
                    src: require('../../assets/img/index1.png'),
                    path: '/catalogue/literature/library',
                    hide: false
                },

                {
                    name: '流通模块',
                    index: 'circulation',
                    src: require('../../assets/img/index2.png'),
                    path: '/circulation/manage/index',
                    hide: false
                },

                {
                    name: '期刊模块',
                    index: 'periodical',
                    src: require('../../assets/img/index3.png'),
                    path: '/periodical/reserve/accept',
                    hide: false
                },

                {
                    name: '读者管理',
                    index: 'circulation',
                    src: require('../../assets/img/index4.png'),
                    path: '/circulation/reader/index',
                    hide: false
                },

                {
                    name: '报表模块',
                    index: 'echarts',
                    src: require('../../assets/img/index5.png'),
                    path: '/echarts/periodical/booking',
                    hide: false
                },

                {
                    name: 'OPAC设置',
                    index: 'opac',
                    src: require('../../assets/img/index6.png'),
                    path: '/opac/recommend/index',
                    hide: false
                },

                {
                    name: '系统设置',
                    index: 'operator',
                    src: require('../../assets/img/index7.png'),
                    path: '/manage/parameter/admin',
                    hide: false
                },

                { name: '帮助中心', src: require('../../assets/img/index8.png'), path: '/doc', hide: false }
            ],
            promiss: [],
            dialogVisible: false
        };
    },
    components: {
        vBottom,
        vHeader
    },
    created() {
        // this.isBig();
        this.promiss = JSON.parse(localStorage.getItem('user')).permissions;
        let type = JSON.parse(localStorage.getItem('user')).info.type;
        if (type != 'SUPER_MANAGER') {
            this.promiss.map((it) => {
                this.list.map((item) => {
                    if (it.path.indexOf(item.name) != -1) {
                        item.hide = true;
                        it.check = true;
                    }
                });
            });
        } else {
            this.list.map((item) => {
                item.hide = true;
            });
        }
    },
    methods: {
        isBig() {
            let ratio = 0,
                screen = window.screen,
                ua = navigator.userAgent.toLowerCase();

            if (window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            } else if (~ua.indexOf('msie')) {
                if (screen.deviceXDPI && screen.deviceXDPI) {
                    ratio = screen.deviceXDPI / screen.logicaLXDPI;
                }
            } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
                ratio = window.outerWidth / window.innerWidth;
            }
            if (ratio) {
                ratio = Math.round(ratio * 100);
            }
            if (ratio !== 100) {
                this.$alert(
                    `您当前网页使用比例为${ratio}%,为了不影响您的浏览体验,请使用Ctrl+0按键，或者[查看]--[网页缩放]--修改为100%`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        callback: (action) => {}
                    }
                );
            }
        },
        jump(e) {
            // if(e.path=='/doc'){
            //     this.$router.push({
            //                     path:e.path
            //                 })
            // }
            if (e.hide) {
                this.mapList(e.name).then((res) => {
                    sessionStorage.setItem('saveIndex', JSON.stringify(e));
                    this.$router.push({
                        path: e.path
                    });
                });
            } else {
                return this.$message.error('当前没有权限');
            }
        },
        mapList(name) {
            return new Promise((resolve) => {
                let choose = [];
                this.promiss.map((it) => {
                    if (it.path.indexOf(name) != -1) {
                        choose.push(it);
                    }
                });
                //  this.bus.$emit('allowMenu', choose);
                resolve();
            });
        }
    }
};
</script>


<style scoped>
.subIndex {
    text-align: center;
    padding-top: 6%;
}
.background_index {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}
.grounp {
    position: relative;
    z-index: 10;
    width: 77.77rem;
    box-sizing: border-box;
    margin: 0 auto;
}
.index_title {
    height: 3.88rem;
    font-size: 2.75rem;
    font-weight: normal;
    line-height: 3.88rem;
    color: #000000;
    margin-bottom: 9.56rem;
}
.index_box {
    width: 18.13rem;
    height: 16.88rem;
    box-sizing: border-box;
    border-radius: 20px;
    text-align: center;
    font-size: 1.5rem;
    color: #fff;
    padding-top: 4.63rem;
}
.index0 {
    background: linear-gradient(92deg, rgba(222, 212, 99, 1) 0%, rgba(148, 208, 83, 1) 100%);
}
.index1 {
    background: linear-gradient(180deg, rgba(247, 174, 2, 1) 0%, rgba(253, 149, 58, 1) 100%);
}
.index2 {
    background: linear-gradient(360deg, rgba(250, 121, 150, 1) 0%, rgba(253, 147, 126, 1) 100%);
}
.index3 {
    background: linear-gradient(360deg, rgba(255, 100, 96, 1) 0%, rgba(255, 148, 95, 1) 100%);
}

.index4 {
    background: linear-gradient(271deg, rgba(4, 195, 235, 1) 0%, rgba(0, 220, 175, 1) 100%);
}
.index5 {
    background: linear-gradient(94deg, rgba(47, 176, 243, 1) 0%, rgba(61, 142, 251, 1) 100%);
}
.index6 {
    background: linear-gradient(89deg, rgba(189, 151, 248, 1) 0%, rgba(161, 109, 244, 1) 100%);
}
.index7 {
    background: linear-gradient(90deg, rgba(110, 152, 238, 1) 0%, rgba(87, 90, 223, 1) 100%);
}
.index_icon {
    width: 4.25rem;
    height: 4.25rem;
}
/* .index_bar{
    width: 80%;
    margin: 0 5%;
    text-align: left;
} */
</style>
