<template>
    <!-- <el-popconfirm :title="tip?tip:'确认删除？'" confirmButtonText='是' cancelButtonText='否' @onConfirm="onConfirm" placement="top">  -->
    <el-button
        slot="reference"
        type="text"
        :size="size ? size : 'mini'"
        :loading="loading"
        class="color_dan"
        @click="open"
        icon="el-icon-delete"
        >{{ delNames ? delNames : '删除' }}</el-button
    >
    <!-- </el-popconfirm> -->
</template>
<script>
export default {
    props: ['tip', 'size', 'loading', 'delNames'],
    data() {
        return {
            deleteTitle:'是否确认删除?',
        };
    },
    methods: {
        open(e) {
            e.preventDefault();
            console.log(this.$route.path,'--e');
            // 20240125新增,如果当前是在分类浏览页面就修改删除提示  ------修改了这里
            // console.log(123)
            if(this.$route.path=='/catalogue/literature/classify'){this.deleteTitle = '将会删除书目信息及馆藏信息，是否继续删除？'}
            this.$confirm(this.deleteTitle, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$emit('deletes');
                })
                .catch(() => {});
        }
    }
};
</script>
<style scoped>
</style>