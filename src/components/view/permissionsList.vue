<template>
    <div v-if="type == 2">
        <div>
            <el-tabs v-model="activeName">
                <el-tab-pane :label="items.name" :name="items.name" v-for="items of tableData" :key="items.path">
                    <div class="box_title display_flex">
                        <div class="w-20 box_item">一级</div>
                        <div class="w-25 box_item">二级</div>
                        <div class="w-40 box_item">权限管理</div>
                        <div class="w-15 box_item">全选</div>
                    </div>
                    <div :style="$height(550)" class="over">
                        <div class="display_flex b-b-1 box_tree over f-s-14 b-l-1" v-for="(item, i) of items.sub" :key="i">
                            <div class="w-20">
                                {{ item.name }}
                            </div>

                            <div class="w-80 b-l-1 b-r-1" style="min-height: 3.19rem" v-if="item.sub.length > 0">
                                <div v-for="it of item.sub" :key="it.path" class="w-100 box_tree_item display_flex between b-b-1">
                                    <div class="w-30">{{ it.name }}</div>

                                    <div class="display_flex start w-50 wrap padding_20 b-l-1 b-r-1">
                                        <div v-for="res of it.permissions" :key="res.id" class="w-50 text_left">
                                            <el-checkbox
                                                v-model="res.check"
                                                @change="select(res, it)"
                                                :title="res.name"
                                                class="titleName"
                                                >{{ res.name }}</el-checkbox
                                            >
                                        </div>
                                    </div>
                                    <div class="w-20">
                                        <el-checkbox @change="selectAll($event, it)" v-model="it.checkedAll"></el-checkbox>
                                    </div>
                                </div>
                            </div>

                            <div class="w-80 b-l-1 b-r-1" style="min-height: 3.19rem" v-else>
                                <div class="w-100 box_tree_item b-b-1 display_flex between">
                                    <div class="w-30" style="min-height: 3.19rem"></div>

                                    <div class="display_flex start w-50 wrap padding_20 b-l-1 b-r-1">
                                        <div v-for="res of item.permissions" :key="res.id" class="w-50 text_left">
                                            <el-checkbox
                                                v-model="res.check"
                                                @change="select(res, item)"
                                                :title="res.name"
                                                class="titleName"
                                                >{{ res.name }}</el-checkbox
                                            >
                                        </div>
                                    </div>
                                    <div class="w-20">
                                        <el-checkbox @change="selectAll($event, item)" v-model="item.checkedAll"></el-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <div v-else-if="type == 1">
        <div class="box_title display_flex">
            <div class="w-20 box_item">一级</div>
            <div class="w-25 box_item">二级</div>
            <div class="w-40 box_item">权限管理</div>
            <div class="w-15 box_item">全选</div>
        </div>
        <div class="display_flex b-b-1 box_tree f-s-14 b-l-1" v-for="(item, i) of tableData" :key="i">
            <div class="w-20">
                {{ item.name }}
            </div>

            <div class="w-80 b-l-1 b-r-1" style="min-height: 3.19rem" v-if="item.sub.length > 0">
                <div v-for="it of item.sub" :key="it.path" class="w-100 box_tree_item display_flex between b-b-1">
                    <div class="w-30">{{ it.name }}</div>

                    <div class="display_flex start w-50 wrap padding_20 b-l-1 b-r-1">
                        <div v-for="res of it.permissions" :key="res.id" class="w-30 text_left">
                            <el-checkbox v-model="res.check" @change="select(res, it)" :title="res.name" class="w-100 titleName">{{
                                res.name
                            }}</el-checkbox>
                        </div>
                    </div>
                    <div class="w-20">
                        <el-checkbox @change="selectAll($event, it)" v-model="it.checkedAll"></el-checkbox>
                    </div>
                </div>
            </div>

            <div class="w-80 b-l-1 b-r-1" style="min-height: 3.19rem" v-else>
                <div class="w-100 box_tree_item b-b-1 display_flex between">
                    <div class="w-30" style="min-height: 3.19rem"></div>

                    <div class="display_flex start w-50 wrap padding_20 b-l-1 b-r-1">
                        <div v-for="res of item.permissions" :key="res.id" class="w-30 text_left">
                            <el-checkbox v-model="res.check" @change="select(res, item)" :title="res.name" class="w-100 titleName">{{
                                res.name
                            }}</el-checkbox>
                        </div>
                    </div>
                    <div class="w-20">
                        <el-checkbox @change="selectAll($event, item)" v-model="item.checkedAll"></el-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['tableData'],
    data() {
        return { bus: this.bus(this), type: JSON.parse(localStorage.getItem('user')).type, activeName: '编目模块' };
    },
    created() {
        // // console.log(this.tableData)
    },
    watch: {
        tableData(val) {
            // // console.log(val)
            this.isAll(val);
        }
    },
    methods: {
        select(val, value) {
            this.isAll(value);
        },
        selectAll(value, val) {
            if (value) {
                this.mapList(val, true);
            } else {
                this.mapList(val, false);
            }
        },
        mapList(val, right) {
            val.permissions.map((it) => {
                it.check = right;
            });
            this.$emit('change', this.tableData);
        },
        // 是否全选
        isAll(val) {
            if (val.permissions.length > 0) {
                let right = 0;
                val.permissions.map((it) => {
                    if (it.check) {
                        right++;
                    }
                });
                if (right == val.permissions.length) {
                    return (val.checkedAll = true);
                } else {
                    return (val.checkedAll = false);
                }
            } else {
                val.sub.map((it) => {
                    this.isAll(it);
                });
            }
            this.$emit('change', this.tableData);
        }
    }
};
</script>

<style>
.box_title {
    width: 100%;
    height: 2.5rem;
    background: #f2f2f2;
}
.box_item {
    text-align: center;
    height: 1.25rem;
    font-size: 0.88rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: rgba(51, 51, 51, 1);
}
.b-b-1 {
    border-bottom: 1px solid #e9e9e9;
}
.b-r-1 {
    border-right: 1px solid #e9e9e9;
}
.b-l-1 {
    border-left: 1px solid #e9e9e9;
}
.b-t-1 {
    border-top: 1px solid #e9e9e9;
}
.box_tree {
    text-align: center;
    box-sizing: border-box;
}
.over {
    overflow: auto;
}
.box_tree_item {
    /* height: 3.19rem; */
    line-height: 3.19rem;
}
.box_tree_ite {
    line-height: 3.19rem;
    /* padding-left: 30px; */
    /* box-sizing: border-box; */
}
.text_left {
    text-align: left;
    overflow: hidden;
}
.titleName {
    width: 85%;
    overflow: hidden;
    /* text-overflow: ellipsis; */
}
</style>
