 <template>
    <div class="container setting" :style="'height:'+height+'px'">
        <div class="padding_20">
            <el-tabs v-model="activeName" @tab-click="handelClick">
                <el-tab-pane label="本馆参数配置" name="BOOK">
                    <div>
                        <el-form ref="form" :model="form" label-width="340px">
                            <!-- <el-form-item label="Z39.50下载模式" class="w-100" >
                                <el-radio-group v-model="form.downloadMode" class="w-100">
                                    <el-radio   class="w-20"  :label="1">先简后详(节约数据用量)</el-radio>
                                    <el-radio  class="w-20" :label="2">直接下载详细MARC(可能造成浪费）</el-radio>
                                </el-radio-group>
                            </el-form-item> -->
                            <el-form-item label="条码自动记忆">
                                <el-radio-group v-model="form.automaticMemory" class="w-100">
                                <el-radio :label='true'  class="w-15">自动记忆</el-radio>
                                <el-radio :label="false"  class="w-20">人工填写</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="保存后弹出新增查重界面">
                                <el-radio-group v-model="form.newCheck" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="非中央库数据直接套路(仅限命中1条)">
                                <el-radio-group v-model="form.directCopy" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20"  >否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="无命中数据直接新增记录弹窗">
                                <el-radio-group v-model="form.directAdd" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="中央库数据直接添加复本(仅限命中1条)">
                                <el-radio-group v-model="form.directDuplication" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="默认打开编目方式">
                                <el-radio-group v-model="form.openMethod" class="w-100">
                                <el-radio :label="1"  class="w-15">表单编目</el-radio>
                                <el-radio :label="2"  class="w-20">MARC编目</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="不规范MARC保存（MARC实时检测）">
                                <el-radio-group v-model="form.marcTesting" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>

                             <el-form-item label="种次号补缺生成">
                                <el-radio-group v-model="form.specType" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>

                              <el-form-item label="索书号重复可保存" class="w-100">
                                <el-radio-group v-model="form.callNumberType" class="w-100">
                                <el-radio :label="true"  class="w-15">是</el-radio>
                                <el-radio :label="false"  class="w-20">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                          <el-form-item label="按ISBN查重时开启题名查重" class="w-100">
                            <el-radio-group v-model="rechecking" class="w-100">
                              <el-radio :label="true"  class="w-15">是</el-radio>
                              <el-radio :label="false"  class="w-20">否</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Z39.50服务器选择" name="JOURNAL">
                         <div class="display_flex ">
                            <div class="serveBox">
                                <div class="serveTtitle">Z39.50服务器列表</div>
                                <div class="chooseServe">
                                    <div v-for="(item,i) of allServe" class="serveName" :key="i" :class="leftChoose==i?'activeName':''" @click="leftChoose=i">
                                            {{item.serviceName}}
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-d-arrow-right" @click="addServe(true)" :disabled='allServe.length>0?false:true'></el-button>
                               </div>
                                <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-arrow-right" @click="addServe(false)"  :disabled='allServe.length>0?false:true'></el-button>
                               </div>
                                <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-arrow-left" @click="delServe(false)"  :disabled='chooseServe.length>0?false:true'></el-button>
                               </div>
                                <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-d-arrow-left"  @click="delServe(true)"  :disabled='chooseServe.length>0?false:true' ></el-button>
                               </div>
                                
                                  
                            </div>
                             <div class="serveBox">
                                <div class="serveTtitle">已选Z39.50服务器列表</div> 
                                <div class="chooseServe">
                                    <div v-for="(item,i) of chooseServe" class="serveName" :key="i" :class="rightChoose==i?'activeName':''" @click="rightChoose=i">
                                        {{item.serviceName}}
                                    </div>
                                </div>
                            </div>
                             <div>
                                  <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-top" @click="changeIndex(1)"   :disabled='rightChoose==0 || chooseServe.length==1?true:false' ></el-button>
                                 </div>
                                   <div class='m-b-10'>
                                    <el-button type="primary" icon="el-icon-bottom" @click="changeIndex(-1)"    :disabled='rightChoose>=chooseServe.length-1 || chooseServe.length==1 ?true:false' ></el-button>
                                 </div>
                               
                            </div>
                         </div>
                </el-tab-pane>
            </el-tabs>
            <div class="display_flex choose">
                    <el-button-group>
                                <el-button type="primary" plain class="add m-r-20" icon='el-icon-refresh-right' @click="save('form')" >保存</el-button>
                                <el-button type="primary" plain icon="el-icon-refresh-left"  @click="refreshBack" >还原</el-button>
                    </el-button-group>
            </div>
        </div>
        
    </div>
</template>

<script>
import List from '../../view/List'
import ticketUtil from '../../../utils/ticket';
import metaUtil from '../../../utils/meta';
export default {
     components:{List},
    data() {
        return {bus: this.bus(this),
           activeName:'BOOK',
           form:{},
           leftChoose:0,
           rightChoose:0,
           allServe:[],
           chooseServe:[],
           height:'',
          rechecking:false
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getSetting()
        this.getServe()

    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        refreshBack(){
              this.loading()
           if(this.activeName=='BOOK'){
          let params = this.form
               params.presenceStatus=1
               params.automaticMemory=true
                 params.downloadMode=1
                  params.newCheck=true
                   params.directCopy=false
                    params.directAdd=true
                     params.directDuplication=true
                      params.openMethod=1
                       params.marcTesting=true
                        params.callNumberType=false
             params.specType=true
             this.rechecking=false

           this.ax.post('/manage/unit/catalog/catalogingParameters/catalogSetting',params)
                .then(res=>{
                    this.$message.success('保存成功');
                     sessionStorage.setItem('setting', JSON.stringify(this.form));
                  sessionStorage.setItem('rechecking',  JSON.stringify(this.rechecking));
                    this.sloading()
                 })
           }else{
                let params={
                   marcDatabaseIds:[],
                   platformId:JSON.parse(localStorage.getItem("user")).platform.id
               }
                this.ax.post('/manage/unit/catalog/catalogingParameters/marcDatabase',params)
                .then(res=>{
                    this.$message.success('保存成功');
                    this.delServe(true)
                    this.sloading()
                   
                 })
           }
        },
        // 获取编目设置
        getSetting(){

          let params={
                platformId:JSON.parse(localStorage.getItem("user")).platform.id
            }
            this.ax.get('/manage/unit/catalog/catalogingParameters/catalogSetting',{params})
                .then(res=>{
                  this.form = res
                  this.rechecking = JSON.parse(sessionStorage.getItem('rechecking'))? JSON.parse(sessionStorage.getItem('rechecking')):false
                })

        },
        // 获取全部数据库
        getServe(){
            this.ax.get('/manage/unit/catalog/catalogingParameters/marcDatabase',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                        res.content.map((it,i)=>{
                                if(it.isUsing){
                                    let obj = res.content[i]
                                    this.chooseServe.push(obj)
                                }
                        })
                        this.allServe = res.content.filter(it=>{
                            return !it.isUsing
                        })
                           this.chooseServe.sort((a, b) => {
                                return a.sort - b.sort;
                            });
                })
        },
        // 右
        addServe(all){
            // // console.log(all)
            if(all){
                // // console.log(1)
                this.chooseServe =this.chooseServe.concat(this.allServe.splice(0)) 
            }else{
                //  // console.log(this.allServe.splice(this.leftChoose,1)[0])
                let obj = this.allServe.splice( this.leftChoose,1)[0]
                if(obj){
                     this.chooseServe.push(obj) 
                }else{
                    return this.$message.error('请选择服务器');
                }
               

               

                 
            }
           
        },
        delServe(all){
            if(all){
                  this.allServe = this.allServe.concat(this.chooseServe.splice(0)) 
            }else{

                  let obj = this.chooseServe.splice( this.rightChoose,1)[0]
                if(obj){
                     this.allServe.push(obj) 
                }else{
                    return this.$message.error('请选择服务器');
                }
            }
           
        },
        // changeIndex
        changeIndex(index){
            if(index==1){
                 
                 this.chooseServe[this.rightChoose] =  this.chooseServe.splice(this.rightChoose-1, 1,  this.chooseServe[this.rightChoose])[0]
                  this.rightChoose-=1
            }else{
                 
                 this.chooseServe[this.rightChoose] =  this.chooseServe.splice(this.rightChoose+1, 1,  this.chooseServe[this.rightChoose])[0]
                 this.rightChoose+=1
            }
        },
        // 保存
        save(){
            this.loading()
           if(this.activeName=='BOOK'){
                this.ax.post('/manage/unit/catalog/catalogingParameters/catalogSetting',this.form)
                .then(res=>{
                    this.$message.success('保存成功');
                     sessionStorage.setItem('setting', JSON.stringify(this.form));
                  sessionStorage.setItem('rechecking',  JSON.stringify(this.rechecking));
                    this.sloading()
                   
                 })
           }else{
               let params={
                   marcDatabaseIds:this.chooseServe.map(it=>{
                       return it.id
                   }),
                   platformId:JSON.parse(localStorage.getItem("user")).platform.id
               }
                this.ax.post('/manage/unit/catalog/catalogingParameters/marcDatabase',params)
                .then(res=>{
                    this.$message.success('保存成功');
               
                    this.sloading()
                   
                 })
           }
        },
        // 切换
         handelClick(e){

             this.loading();

             setTimeout(res=>{
                   this.sloading()
                },500)
           

        },
    }
};
</script>

<style>
.setting .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
    /* height: 32px; */
        line-height: 32px;
}
.setting{
    position: relative;
}
.setting .choose{
    position: absolute;
    top: 10px;
    right: 20px;
}
    .serveBox{
        margin:0 50px;
        width:465px;
        height:659px;
        border:1px solid rgba(207,207,207,1);
        opacity:1;
        border-radius:4px;   
    }
    .serveTtitle{
        width:100%;
        height:50px;
        background:rgba(245,245,245,1);
        opacity:1;
        border-radius:4px 4px 0px 0px;
        line-height: 50px;
        color: #333;
        font-weight: 400;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .chooseServe{
        padding: 0 20px;
        overflow: auto;
        height:600px;
        box-sizing: border-box;
    }
    .serveName{
        width:100%;
        box-sizing: border-box;
        font-size:14px;
        font-weight:400;
        line-height:19px;
        color:rgba(51,51,51,1);
        margin:10px 0;
        cursor: pointer;
        padding: 10px;
        border-radius: 10px;
    }
    .serveName:hover,.activeName{
        background: #ddd;
        
    }
</style>
