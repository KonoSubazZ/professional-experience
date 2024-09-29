<template>
    <el-select v-model="value" placeholder="请选择" filterable clearable v-el-select-loadmore="loadmore" class="w-100">
        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
export default {
    directives: {
        'el-select-loadmore': {
            bind(el, binding) {
                // 获取element-ui定义好的scroll盒子

                const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
                SELECTWRAP_DOM.addEventListener('scroll', function () {
                    /**
                    * scrollHeight 获取元素内容高度(只读)
                    * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                    * clientHeight 读取元素的可见高度(只读)
                    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
                    const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;

                    if (condition) { binding.value() }
                });
            }
        }
    },
    data() {
        return {
            value: '',
            options: [

            ],
            total: 0,
            formData: { page: 0, size: 20, }
        }
    },
    watch: {
        value(newV) {
            const item = this.options.find(item => item.id === newV)
            this.$emit('handleSelect', item);
        }
    },
    mounted() {
        this.getList(this.formData);
    },
    methods: {

        loadmore() {
            if (this.options.length >= this.total) {
                return
            }
            this.formData.page++;
            this.getList(this.formData);
        },
        async getList(formData) {
            // 这里是接口请求数据, 带分页条件 
            const url = '/manage/unit/report/journalReport/readerUnit'
            const params = {
                presenceStatus: 1,
                platformId: this.$platform(),
                ...formData

            }
            const { content: data, totalPages: pages, totalElements: total
            } = await this.ax.get(url, { params })
            this.options = [...this.options, ...data];
            console.log(data, this.options);
            this.total = total;
        }
    }
}</script>