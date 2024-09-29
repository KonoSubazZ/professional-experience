<template>
    <div class="box">
        <!-- 页面首次加载的弹框,配置党建版的 -->
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
            style="position: absolute;top: 30vh;" title="初次使用请选择版本" :visible.sync="dialogVisibleSetting" width="30%">
            <el-radio-group v-model="radioSetting">
                <el-radio :label="0">通用版</el-radio>
                <el-radio :label="1">党建版</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmVersion">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisibleSetting: true,
            radioSetting: 0,//版本选择
        }
    },
    methods: {
        // 确认版本
        confirmVersion() {
            localStorage.setItem('confirmVersion', this.radioSetting);
            this.dialogVisibleSetting = false
            this.$router.push('/')
        },
    }
}
</script>
<style lang="scss" scoped>
.box {
    height: 100vh;
    overflow: hidden;
    background-color: #2954f0;
}
</style>