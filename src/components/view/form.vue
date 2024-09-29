<template>
    <!-- 'row'一排几个    'list' 需要的list:[name id type,] 'rule' 规则 -->

    <div class="padding_20">
        <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth ? labelWidth : '150px'"
            class="w-100 m-b-30">
            <!-- row == 3 -->
            <div v-if="row == '3'" class="display_flex wrap between w-100">
                <div v-for="item of list" :key="item.id" class="w-30">
                    <el-form-item :label="item.name" :prop="item.id" class="w-100">
                        <!-- select  -->
                        <!-- <LoadMoreSelect v-if="item.relation =='readerUnitName'"/> -->

                        <el-select filterable v-model="form[item.id]" clearable placeholder="请选择"
                            :disabled="item.disable" class="w-100"
                            @change="changeName(item.relation, form[item.id], item.options)"
                            @clear="clear(item.relation)"
                            v-if="item.type == 'select' && item.relation != 'readerUnitName'">
                            <el-option v-for="items in item.options" :key="items.id" :label="items.name"
                                :value="items.id"></el-option>
                        </el-select>
                        <el-select v-model="form.fatherid" placeholder="请选择" ref="selectUpResId"
                            v-else-if="item.type == 'selectTree' && item.relation != 'readerUnitNameTree'">
                            <el-option hidden :key="form.fatherid" :label="fatherName" :value="form.fatherid">
                            </el-option>
                            <el-tree :current-node-key="form.fatherid" class="tree_body" :props="propsSelect"
                                :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current
                                lazy>
                            </el-tree>
                        </el-select>
                        <!-- around -->
                        <div class="display_flex" v-else-if="item.type == 'around'">
                            <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                                v-model="form[item.id]" @input="$emit('get-form', form)" clearable></el-input>
                            <div class="padding_20">——</div>
                            <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                                v-model="form[item.end]" @input="$emit('get-form', form)" clearable></el-input>
                        </div>
                        <!-- aroundTimes -->
                        <div class="display_flex" v-else-if="item.type == 'aroundTimes'">
                            <el-date-picker class="w-100" :disabled="item.disable" @change="$emit('get-form', form)"
                                v-model="form[item.id]" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期"></el-date-picker>
                            <div class="padding_20">——</div>
                            <el-date-picker class="w-100" :disabled="item.disable" value-format="yyyy-MM-dd HH:mm:ss"
                                @change="$emit('get-form', form)" v-model="form[item.end]" type="date"
                                placeholder="选择日期"></el-date-picker>
                        </div>
                        <!-- times -->
                        <el-date-picker class="w-100" :disabled="item.disable" v-else-if="item.type == 'times'"
                            v-model="form[item.id]" value-format="timestamp" type="date"
                            @change="$emit('get-form', form)" placeholder="选择日期"></el-date-picker>
                        <!-- password -->
                        <el-input v-else-if="item.isNumber" :disabled="item.disable" placeholder="请输入"
                            :maxlength="item.max ? item.max : 20" v-model.number="form[item.id]"
                            @input="$emit('get-form', form)" clearable></el-input>
                        <el-input v-else-if="item.type == 'password'" auto-complete="new-password"
                            :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 200"
                            :show-password="true" v-model="form[item.id]" @input="$emit('get-form', form)"
                            clearable></el-input>
                        <!-- radio -->
                        <el-radio-group v-model="form[item.id]" v-else-if="item.type == 'radio'">
                            <el-radio v-for="(items, index) in item.options" :key="index" :label="items.id">{{
                                items.name }}</el-radio>
                        </el-radio-group>
                        <el-input v-else-if="item.type == 'certificateNumber'" :disabled="item.disable"
                            :placeholder="!item.placeholder ? '请输入' : ''" :maxlength="item.max ? item.max : 20"
                            v-model="form[item.id]" @blur="inputBlur(form[item.id])" @input="$emit('get-form', form)"
                            clearable></el-input>
                        <el-input v-else :disabled="item.disable" :placeholder="!item.placeholder ? '请输入' : ''"
                            :maxlength="item.max ? item.max : 20" v-model="form[item.id]"
                            @blur="inputBlur(form[item.id])" @input="$emit('get-form', form)" clearable></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- row ==1  -->
            <div v-else-if="row == '1'" class>
                <div v-for="item of list" :key="item.id" class="w-100">
                    <el-form-item :label="item.name" :prop="item.id" class="w-100">
                        <!-- 读者单位下拉加载更多 -->
                        <LoadMoreSelect v-if="item.type == 'select' && item.relation == 'readerUnitName'"
                            @handleSelect="handleSelectValue" />
                        <el-select @clear="clear(item.relation)" v-model="form[item.id]" filterable clearable
                            placeholder="请选择" :disabled="item.disable" class="w-100"
                            @change="changeName(item.relation, form[item.id], item.options)"
                            v-else-if="item.type == 'select' && item.relation !== 'readerUnitName'">
                            <el-option v-for="(items, index) in item.options" :key="index" :label="items.name"
                                :value="items.id"></el-option>
                        </el-select>

                        <el-select v-model="form.fatherid" placeholder="请选择" ref="selectUpResId"
                            v-else-if="item.type == 'selectTree' && item.relation != 'readerUnitNameTree'" class="w-100">
                            <el-option hidden :key="form.fatherid" :label="fatherName" :value="form.fatherid">
                            </el-option>
                            <el-tree :current-node-key="form.fatherid" class="tree_body" :props="propsSelect"
                                :load="loadNodeSelect" @node-click="handleNodeClick" node-key="id" highlight-current
                                lazy>
                            </el-tree>
                        </el-select>

                        <el-date-picker class="w-100" :disabled="item.disable" v-else-if="item.type == 'times'"
                            v-model="form[item.id]" type="date" @change="$emit('get-form', form)"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>

                        <el-date-picker class="w-100" :disabled="item.disable" v-else-if="item.type == 'Alltimes'"
                            v-model="form[item.id]" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                            @change="$emit('get-form', form)" placeholder="选择日期"></el-date-picker>

                        <div class="display_flex" v-else-if="item.type == 'aroundTimes'">
                            <el-date-picker class="w-100" :disabled="item.disable"
                                @change="$emit('get-form', form); changeStart(item.id, item.end)"
                                v-model="form[item.id]" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptionsStart(item.id, item.end)"
                                placeholder="选择日期"></el-date-picker>
                            <div class="padding_20">————</div>
                            <el-date-picker class="w-100" :disabled="item.disable" value-format="yyyy-MM-dd HH:mm:ss"
                                @change="$emit('get-form', form); changeEnd(item.id, item.end)" v-model="form[item.end]"
                                type="date" :picker-options="pickerOptionsEnd(item.id, item.end)"
                                placeholder="选择日期"></el-date-picker>
                        </div>

                        <div class="display_flex" v-else-if="item.type == 'aroundDateTimes'">
                            <el-date-picker class="w-100" :disabled="item.disable"
                                @change="$emit('get-form', form); changeStart(item.id, item.end)"
                                v-model="form[item.id]" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptionsStart(item.id, item.end)"
                                placeholder="选择日期"></el-date-picker>
                            <div class="padding_20">————</div>
                            <el-date-picker class="w-100" :disabled="item.disable" value-format="yyyy-MM-dd HH:mm:ss"
                                @change="$emit('get-form', form); changeEnd(item.id, item.end)" v-model="form[item.end]"
                                type="datetime" default-time="23:59:59"
                                :picker-options="pickerOptionsEnd(item.id, item.end)"
                                placeholder="选择日期"></el-date-picker>
                        </div>

                        <div class="display_flex" v-else-if="item.type == 'around'">
                            <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                                v-model="form[item.id]" @input="$emit('get-form', form)" clearable></el-input>
                            <div class="padding_20">————</div>
                            <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                                v-model="form[item.end]" @input="$emit('get-form', form)" clearable></el-input>
                        </div>

                        <el-input v-else-if="item.type == 'textarea'" :disabled="item.disable" placeholder="请输入"
                            :maxlength="item.max ? item.max : 200" :rows="2" v-model="form[item.id]"
                            @input="$emit('get-form', form)" clearable></el-input>

                        <el-input v-else-if="item.type == 'number'" :disabled="item.disable" placeholder="请输入"
                            v-model="form[item.id]" oninput="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g, '')"
                            @input="$emit('get-form', form)" clearable></el-input>

                        <el-radio-group v-model="form[item.id]" v-else-if="item.type == 'radio'"
                            :disabled="item.disable">
                            <el-radio v-for="(items, index) in item.options" :key="index" :label="items.id">{{
                                items.name }}</el-radio>
                        </el-radio-group>
                        <!--                      :maxlength="item.max?item.max:30"-->
                        <el-input v-else :disabled="item.disable" :id="item.chooseId" placeholder="请输入"
                            v-model="form[item.id]" @input="$emit('get-form', form)" clearable></el-input>
                    </el-form-item>
                </div>
            </div>

            <div v-else class="display_flex wrap">
                <div v-for="item of list" :key="item.id" class="w-20 m-r-20">
                    <el-select @clear="clear(item.relation)" v-model="form[item.id]" filterable clearable
                        :placeholder="item.name" :disabled="item.disable" class="w-100"
                        @change="changeName(item.relation, form[item.id], item.options)" v-if="item.type == 'select'">
                        <el-option :label="'全部' + item.name" :value="null">全部{{ item.name }}</el-option>
                        <el-option v-for="items in item.options" :key="items.id" :label="items.name"
                            :value="items.id"></el-option>
                    </el-select>

                    <el-date-picker class="w-100" :disabled="item.disable" v-else-if="item.type == 'times'"
                        v-model="form[item.id]" type="date" @change="$emit('get-form', form)" value-format="yyyy-MM-dd"
                        placeholder="选择日期"></el-date-picker>

                    <el-date-picker class="w-100" :disabled="item.disable" v-else-if="item.type == 'Alltimes'"
                        v-model="form[item.id]" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                        @change="$emit('get-form', form)" placeholder="选择日期"></el-date-picker>

                    <div class="display_flex" v-else-if="item.type == 'aroundTimes'">
                        <el-date-picker class="w-100" :disabled="item.disable" style="min-width: 150px"
                            @change="$emit('get-form', form)" v-model="form[item.id]" type="date"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
                        <div class="padding_20">—</div>
                        <el-date-picker class="w-100" :disabled="item.disable" style="min-width: 150px"
                            value-format="yyyy-MM-dd HH:mm:ss" @change="$emit('get-form', form)"
                            v-model="form[item.end]" type="date" placeholder="选择日期"></el-date-picker>
                    </div>

                    <div class="display_flex" v-else-if="item.type == 'year'">
                        <el-date-picker class="w-100" :disabled="item.disable" @change="$emit('get-form', form)"
                            v-model="form[item.id]" value-format="yyyy" type="year"
                            :placeholder="item.name"></el-date-picker>
                    </div>

                    <div class="display_flex" v-else-if="item.type == 'around'">
                        <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                            v-model="form[item.id]" @input="$emit('get-form', form)" clearable></el-input>
                        <div class="padding_20">————</div>
                        <el-input :disabled="item.disable" placeholder="请输入" :maxlength="item.max ? item.max : 20"
                            v-model="form[item.end]" @input="$emit('get-form', form)" clearable></el-input>
                    </div>

                    <el-input v-else-if="item.type == 'textarea'" :disabled="item.disable" placeholder="请输入"
                        :maxlength="item.max ? item.max : 200" :rows="2" v-model="form[item.id]"
                        @input="$emit('get-form', form)" clearable></el-input>

                    <el-input v-else-if="item.type == 'password'" auto-complete="new-password" :disabled="item.disable"
                        placeholder="请输入" :maxlength="item.max ? item.max : 200" show-password v-model="form[item.id]"
                        @input="$emit('get-form', form)" clearable></el-input>
                    <el-input v-else :disabled="item.disable" :placeholder="item.name"
                        :maxlength="item.max ? item.max : 20" v-model="form[item.id]" @input="$emit('get-form', form)"
                        clearable></el-input>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import LoadMoreSelect from './LoadMoreSelect.vue'
export default {
    props: ['row', 'list', 'rule', 'model', 'labelWidth'],
    components: { LoadMoreSelect },
    data() {
        return {
            propsSelect: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            bus: this.bus(this),
            form: {},
            start: '',
            end: '',
            rules: this.rule,
            fatherName: ""
            //    isbnFiled: [{ required: true, message: '请选择', trigger: 'change' }],
            //    isbnFiled: [{ required: true, message: '请输入', trigger: 'blur' }],
        };
    },
    created() {
        if (this.model) {
            this.form = this.model;
        }
    },
    watch: {
        model(val) {
            if (val) {
                this.form = val;
            }
        this.form.fatherid = this.$route.query.readerUnitName
        this.form.fatherName = this.$route.query.readerUnitName
        },

    },
    methods: {

        handleNodeClick(node) {
            this.form.fatherName = node.name
            this.form.readerUnitName = node.name
            this.fatherName = node.name
        },
        loadNodeSelect(node, resolve) {
            if (node.level === 0) {
                this.metaListfatherSelect(resolve);
            }
            if (node.level >= 1) {
                var searchNodeID = node ? node.data.id : null;
                if (searchNodeID == null) {
                    return resolve([]);
                }
                this.metaListchildSelect(searchNodeID, resolve);
            };
        },
        metaListfatherSelect(resolve) {
            this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
                params: {
                    size: 99999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1
                }
            }).then(res => {
                return resolve(res.content);
            })
        },
        metaListchildSelect(searchNodeID, resolve) {
            this.ax.get('/manage/unit/circulation/readerManagement/readerUnit', {
                params: {
                    size: 999999, page: 0, platformId: JSON.parse(localStorage.getItem("user")).platform.id, presenceStatus: 1, childId: searchNodeID
                }
            }).then(res => {
                return resolve(res.content);
            })
        },
        handleSelectValue(value) {
            // console.log(value, 'value');
            this.form.readerUnitNameId = value.id
            this.form.readerUnitName = value.name
            this.$emit('getForm', this.form);
        },

        changeStart(a, b) {
            this.start = a;
            this.end = b;
        },
        changeEnd(a, b) {
            this.start = a;
            this.end = b;
        },
        pickerOptionsStart() {
            let item = {
                disabledDate: time => {
                    let endDateVal = this.form[this.end]
                    if (endDateVal) {
                        return time.getTime() > new Date(endDateVal).getTime()
                    }
                }
            }
            return item
        },
        pickerOptionsEnd() {
            let item = {
                disabledDate: time => {
                    let beginDateVal = this.form[this.start]
                    if (beginDateVal) {
                        return (
                            time.getTime() <
                            new Date(beginDateVal).getTime() - 860000
                        )
                    }
                }
            }
            return item
        },
        clear(e) {
            this.form[e] = '';
            this.$emit('getForm', this.form);
        },
        changeName(e, id, row, item) {
            if (!this.form.medium) {


                if (e) {
                    row.map((it) => {
                        if (it.id == id) {
                            this.form[e] = it.name;
                        }
                    });
                } else {
                    // this.form[e] = '';//20231118 注释掉了这个e如果没有的话是undefined,所以没用---修改了这里
                }
                this.$emit('getForm', this.form);
            } else {
                //20231118 后加的这个循环为了获取到财务统计预览模块的readerUnitName参数---修改了这里
                let formTwo = {}
                row.map((it) => {
                    // console.log(it,'--it');
                    if (it.id == id) {
                        formTwo = it
                    }
                });
                this.$emit('getFormTwo', formTwo)//20231113财务统计和馆藏批处理的文献类型要名字不要id,,所以增加Two转门获取财务的读者单位名字
            }
        },
        inputBlur() {

            if (this.form.certificateNumber.length === 18) {
                let number = this.form.certificateNumber.slice(6, 14);
                let year = number.slice(0, 4);
                let month = number.slice(4, 6);
                let day = number.slice(6, 8);
                let date = new Date(`${year}-${month}-${day}`).getTime();
                this.form.birthday = date
            }
            this.$emit('getForm', this.form);
        },
        inputBlur() {
            if (this.form.certificateNumber.length === 18) {
                let number = this.form.certificateNumber.slice(6, 14);
                let year = number.slice(0, 4);
                let month = number.slice(4, 6);
                let day = number.slice(6, 8);
                let date = new Date(`${year}-${month}-${day}`).getTime();
                this.form.birthday = date
            }
            this.$emit('getForm', this.form);
        },
    }
};
</script>

<style></style>
