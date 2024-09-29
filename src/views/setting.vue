<template>
    <div class="box">
        <div class="box_center">
            <p class="title">配置地址</p>
            <div class="content">
                <el-form ref="form" :model="form" status-icon label-width="130px">
                    <el-form-item label="服务器地址：" prop="http">
                        <el-input v-model="http" placeholder="请输入服务器地址" type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4 }" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit('form')">完成并返回</el-button>
                    </el-form-item>
                    <el-form-item label="配置地址格式: " prop="https">
                        <span style="color: #333;">{{ ExampleURL }} </span>
                        <span style="color:#333;cursor: pointer;" @click="handleCopyURL">复制 </span>

                    </el-form-item>
                </el-form>


            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { parseURL } from "@/utils/index.js"
const $router = useRouter()
const http = ref("");
const ExampleURL = "http://0.0.0.0:0000/dataView/index.html#/?platformId=2&userId=1"
const handleCopyURL = () => {
    navigator.clipboard.writeText(ExampleURL)
        .then(() => {
            ElMessage({
                message: '复制成功.',
                type: 'success',
            })
        })
        .catch(err => {
            // 如果用户没有授权，则抛出异常
            ElMessage({
                message: '复制失败.',
                type: 'warning',
            })
        });
}
const submit = () => {
    try {
        if (!http.value) return ElMessage.error('请配置大数据地址')
        const setting = parseURL(http.value)
        console.log(setting,'setting');
        window.localStorage.setItem('setting', JSON.stringify(setting))
        $router.push('/Index')
        ElMessage.success("配置成功")
        setTimeout(() => {
            window.location.reload()
        }, 100)
    } catch (error) {
        console.log(error);
        ElMessage.error("配置地址有误")
    }
}
onMounted(() => {
    if (JSON.parse(window.localStorage.getItem('setting'))) {
        http.value = JSON.parse(window.localStorage.getItem('setting')).http
    }

})
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .box_center {
        width: 30%;
        min-height: 30%;
        background-color: rgba(255, 255, 255, 0.356);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px !important;
        box-sizing: border-box;

        .title {
            flex: 1;
            margin-top: 30px;
            text-align: center;
            font-size: 30px;
            color: #fefefe;
            text-shadow: 0 0 0.5em #0a2be6, 0 0 0.2em #5c5c5c;
        }

        .content {
            flex: 4;
            width: 100%;
            padding: 30px;
            margin-top: 20px;
        }
    }
}
</style>