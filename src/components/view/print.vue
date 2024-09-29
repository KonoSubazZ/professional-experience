<template>
    <div>
        <!-- 弹框 -->
        <el-dialog
            :title="isAdd ? '新增模板' : '打印设置'"
            :visible.sync="dialogFormVisible"
            width="30%"
            :close-on-click-modal="false"
            @close="close"
        >
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ViewFrom from './form';
export default {
    component: {},
    data() {
        return { bus: this.bus(this), isAdd: true };
    },
    created() {},
    methods: {}
};
</script>

<style scoped>
</style>
