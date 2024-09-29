<template>
    <div class="container">
        <div class="top_title m-b-30 display_flex between">
            <div class="title">管理员管理</div>
            <div class="display_flex" v-if="from==null">
                <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-back' @click="back" >取消</el-button>
                                <el-button type="primary" plain icon="el-icon-collection"  @click="save('ruleForm')" >保存</el-button>
                    </el-button-group>
            </div>
        </div>
        <div class="padding_20">
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="180px"
            >
                <el-form-item prop="name" label="管理员姓名">
                    <div class="label"></div>
                    <el-input v-model="ruleForm.name" placeholder="请输入管理员姓名"></el-input>
                </el-form-item>

                <el-form-item prop="mobile" label="登录账号">
                    <div class="label"></div>
                    <el-input v-model="ruleForm.mobile" maxlength="11" placeholder="登录账号"></el-input>
                </el-form-item>

                <el-form-item :prop="from==null?'password':''" label="登录密码">
                    <div class="label"></div>
                    <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>

                <el-form-item prop="phone" label="电话号码">
                    <div class="label"></div>
                    <el-input v-model="ruleForm.phone" maxlength="11" placeholder="电话号码"></el-input>
                </el-form-item>

               
                <el-form-item label="选择角色">
                    <div class="label"></div>
                    <div class="display_flex  flex_wrap">
                        <div v-for="(item,i) of roleList" :key="i" class="w-10 m-r-10">
                            <el-checkbox v-model="item.check" @change="choose(item)">{{item.name}}</el-checkbox>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="foot_btn" v-if="from!=null">
            <el-button @click="$emit('close')">取 消</el-button>
            <el-button type="primary" @click="save('ruleForm')">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['from'],
    data() {
        return {bus: this.bus(this),
            ruleForm: {
                roles: []
            },
            roleList: [],
            options:[],
            checked: false,
            value1:[],
            rules: {
                roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
                name: [{ required: true, message: '请输入用户', trigger: 'blur' }],
                password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入手机', trigger: 'blur' }]
                // startTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }]
            }
        };
    },
    created() {
        this.getPlace()
        this.getRole().then(res => {
          
            if (this.from) {
                  this.chooseLsit(this.from);
                this.ruleForm = this.from;
               
            }
        });
    },
    watch: {
        from(val) {
           
            this.getRole().then(res => {
                if (this.from) {
                    // // console.log(val);
                     this.chooseLsit(val);
                    this.ruleForm = val;
                
                }
            });
        }
    },
    methods: {
        getPlace(){
            this.ax.get('/manage/unit/report/journalReport/bookCollection',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    this.options = res.content
                })
        },
        // 选择
        choose(val) {
            // // console.log(val);
            // val = !val;
        },
        // 查看全部角色
        getRole() {
            let platformId = JSON.parse(localStorage.getItem("user")).platform.id
            return this.ax.get('/manage/auth/role', { params: { size: 99,platformId } }).then(res => {
                // // console.log(res);
               res.content.map(it=>{
                    it.check = false
                })
                 return this.roleList = res.content
            });
        },
        // 遍历数组，返回选中的
        mapList() {
            let list = this.roleList.filter(it => {
                if (it.check) {
                    return it;
                }
            });
            return list;
        },
        // 筛选数组，用于筛选选择
        chooseLsit(val) {
            this.roleList.map(item => {
                // // console.log(item)
               val.roles.map(it => {
                    if (item.id == it.id) {
                        item.check = true;
                    }
                });
            });
            // // console.log(this.roleList);
        },
        savePlace(managerId){
            this.ax.post('/manage/unit/manager/managerDetail/managerCollection',{collectionPlaceNameList:this.value1,managerId})
                .then(res=>{
                      this.$message.success('保存成功');
                })
        },
        // 新增保存
        save(formName) {
            this.loading();
            this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.ruleForm.platformId = JSON.parse(localStorage.getItem("user")).platform.id
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // console.log(this.value1)
                    this.ax
                        .post('/manage/manager', this.ruleForm)
                        .then(res => {
                            this.sloading();
                           
                            this.savePlace(res.id)
                           
                           
                            this.bus.$emit(`flash_/manage/manager`, res);
                            this.ruleForm = {
                                roles: [],
                                name: ''
                            };
                            if(this.from==null){
                                this.back();
                            }else{
                                this.$emit('close')
                            }
                        })
                        .catch(res => {
                            this.sloading();
                        });
                } else {
                    this.sloading();
                    this.$message.error('请根据提示输入');
                    return false;
                }
            });
        }
    }
};
</script>

<style>
.foot_btn {
    float: right;
    padding: 20px;
}
</style>
