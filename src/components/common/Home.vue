<template>
    <div>
        <div class="wrapper">
            <v-head class="cope_none"></v-head>
            <v-sidebar class="cope_none"></v-sidebar>
            <div class="content-box" :class="{ 'content-collapse': collapse }">
                <v-tags ref="tags"></v-tags>
                <div class="content">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                    <el-backtop target=".content"></el-backtop>
                </div>
            </div>
        </div>
        <v-bottom></v-bottom>
        <!-- <div class="bottom_box"></div> -->
    </div>
</template>

<script>
import vHead from './Header.vue';
import vBottom from './bottom';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
    data() {
        return { bus: this.bus(this), tagsList: [], refTagsList: [], collapse: false, index: ''};
    },
    components: {
        vHead,
        vSidebar,
        vBottom,
        vTags
    },
    created() {
        this.$nextTick(() => {
            this.refTagsList = this.$refs.tags.tagsList;
        });

        bus.$on('collapse-content', (msg) => {
            this.collapse = msg;
        });
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', (msg) => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
  methods: {
        closeTags() {
            for (let i = 0; i < this.refTagsList.length; i++) {
                const item = this.refTagsList[i];
                if (item.title === '编辑图书') {
                    this.$refs.tags.closeTags(i);
                }
            }
        }
    }
};
</script>


<style >
.bottom_box {
    width: 100%;
    height: 2.5rem;
    background: #dedede;
    position: fixed;
    bottom: 0;
}
/* 公共样式 */
.el-menu {
    border: 0px !important;
}
</style>
