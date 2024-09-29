 <template>
    <div class="container" :style='height'>
        <div class="display_flex between header_title padding_20 m-b-20">
            <div class>公共参数</div>
            <div class="display_flex">
                <!-- <div @click="save('form')" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/saves.png" class="btn_img" />
                    <div class="f-s-14">保存</div>
                </div>
                <div @click="edit=true" class="cursor text_center m-r-20">
                    <img src="../../../../assets/img/saves.png" class="btn_img" />
                    <div class="f-s-14">修改</div>
                </div> -->
                 <el-button-group>
                                <el-button type="primary" plain class="add " icon='el-icon-receiving' @click="save('form')" >保存</el-button>
                                 <el-button type="primary" plain class="add " icon='el-icon-edit-outline' @click="edit=true" >修改</el-button>
                    </el-button-group>
            </div>
        </div>
        <div>
            <div class="headerBox  display_flex">
                <div class="w-25">类别</div>
                <div class="w-15">完全中学</div>
                <div class="w-15">高级中学</div>
                <div class="w-15">初级中学</div>
                <div class="w-15">小学</div>
                <div class="w-15">其他</div>
            </div>
            <div class="display_flex Boxcontent">
                <div class="w-25">
                    <div>第一大类</div>
                    <div>第二大类</div>
                    <div>第三大类</div>
                    <div>第四大类</div>
                    <div>第五大类</div>
                    <div>人均藏书量</div>
                    <div>报刊（种）</div>
                    <div>工具书</div>
                </div>
                <div class="w-15 Boxcontent" v-if="edit">
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.first"  class='w-100'  placeholder='请输入0-100整数' @blur="getNumber(CompleteJuniorHighSchool.first,'first',CompleteJuniorHighSchool)"  clearable></el-input>
                  
                        <el-input v-model.number="CompleteJuniorHighSchool.second" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(CompleteJuniorHighSchool.second,'second',CompleteJuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.third" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(CompleteJuniorHighSchool.third,'third',CompleteJuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.fourth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(CompleteJuniorHighSchool.fourth,'fourth',CompleteJuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.fifth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(CompleteJuniorHighSchool.fifth,'fifth',CompleteJuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.averageBookCollection" class='w-100' placeholder='请输入整数'   clearable></el-input>
                   
                        <el-input v-model.number="CompleteJuniorHighSchool.pressKind" class='w-100' placeholder='请输入整数'   clearable></el-input>

                        <el-input v-model.number="CompleteJuniorHighSchool.tools" class='w-100'  placeholder='请输入0-100整数' @blur="getOtherNumber(CompleteJuniorHighSchool.tools,'tools',CompleteJuniorHighSchool)"    clearable></el-input>
                   

                </div>
                 <div class="w-15 Boxcontent" v-else>
                   
                        <div  class='w-100' >{{(CompleteJuniorHighSchool.first*100).toFixed(2)}}%</div>

                         <div  class='w-100' >{{(CompleteJuniorHighSchool.second*100).toFixed(2)}}%</div>

                          <div  class='w-100' >{{(CompleteJuniorHighSchool.third*100).toFixed(2)}}%</div>

                           <div  class='w-100' >{{(CompleteJuniorHighSchool.fourth*100).toFixed(2)}}%</div>

                            <div  class='w-100' >{{(CompleteJuniorHighSchool.fifth*100).toFixed(2)}}%</div>

                             <div  class='w-100' >{{CompleteJuniorHighSchool.averageBookCollection}}</div>

                              <div  class='w-100' >{{CompleteJuniorHighSchool.pressKind}}</div>

                               <div  class='w-100' >{{CompleteJuniorHighSchool.tools}}</div>

                
                   

                </div>

                 <div class="w-15 Boxcontent" v-if="edit">
                   
                        <el-input v-model.number="SeniorMiddleSchool.first" class='w-100'  placeholder='请输入0-100整数' @blur="getNumber(SeniorMiddleSchool.first,'first',SeniorMiddleSchool)"  clearable></el-input>
                  
                        <el-input v-model.number="SeniorMiddleSchool.second" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(SeniorMiddleSchool.second,'second',SeniorMiddleSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="SeniorMiddleSchool.third" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(SeniorMiddleSchool.third,'third',SeniorMiddleSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="SeniorMiddleSchool.fourth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(SeniorMiddleSchool.fourth,'fourth',SeniorMiddleSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="SeniorMiddleSchool.fifth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(SeniorMiddleSchool.fifth,'fifth',SeniorMiddleSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="SeniorMiddleSchool.averageBookCollection" class='w-100' placeholder='请输入整数'   clearable></el-input>
                   
                        <el-input v-model.number="SeniorMiddleSchool.pressKind" class='w-100' placeholder='请输入整数'   clearable></el-input>

                        <el-input v-model.number="SeniorMiddleSchool.tools" class='w-100' placeholder='请输入0-100整数' @blur="getOtherNumber(SeniorMiddleSchool.tools,'tools',SeniorMiddleSchool)"    clearable></el-input>
                   

                </div>
                                 <div class="w-15 Boxcontent" v-else>
                   
                        <div  class='w-100' >{{(SeniorMiddleSchool.first*100).toFixed(2)}}%</div>

                         <div  class='w-100' >{{(SeniorMiddleSchool.second*100).toFixed(2)}}%</div>

                          <div  class='w-100' >{{(SeniorMiddleSchool.third*100).toFixed(2)}}%</div>

                           <div  class='w-100' >{{(SeniorMiddleSchool.fourth*100).toFixed(2)}}%</div>

                            <div  class='w-100' >{{(SeniorMiddleSchool.fifth*100).toFixed(2)}}%</div>

                             <div  class='w-100' >{{SeniorMiddleSchool.averageBookCollection}}</div>

                              <div  class='w-100' >{{SeniorMiddleSchool.pressKind}}</div>

                               <div  class='w-100' >{{(SeniorMiddleSchool.tools)}}</div>

                
                   

                </div>

                 <div class="w-15 Boxcontent" v-if="edit">
                   
                        <el-input v-model.number="JuniorHighSchool.first" class='w-100'  placeholder='请输入0-100整数' @blur="getNumber(JuniorHighSchool.first,'first',JuniorHighSchool)"  clearable></el-input>
                  
                        <el-input v-model.number="JuniorHighSchool.second" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(JuniorHighSchool.second,'second',JuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="JuniorHighSchool.third" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(JuniorHighSchool.third,'third',JuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="JuniorHighSchool.fourth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(JuniorHighSchool.fourth,'fourth',JuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="JuniorHighSchool.fifth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(JuniorHighSchool.fifth,'fifth',JuniorHighSchool)"  clearable></el-input>
                   
                        <el-input v-model.number="JuniorHighSchool.averageBookCollection" class='w-100' placeholder='请输入整数'   clearable></el-input>
                   
                        <el-input v-model.number="JuniorHighSchool.pressKind" class='w-100' placeholder='请输入整数'   clearable></el-input>

                        <el-input v-model.number="JuniorHighSchool.tools" class='w-100' placeholder='请输入0-100整数' @blur="getOtherNumber(JuniorHighSchool.tools,'tools',JuniorHighSchool)"  clearable></el-input>
                   

                </div>
                                 <div class="w-15 Boxcontent" v-else>
                   
                        <div  class='w-100' >{{(JuniorHighSchool.first*100).toFixed(2)}}%</div>

                         <div  class='w-100' >{{(JuniorHighSchool.second*100).toFixed(2)}}%</div>

                          <div  class='w-100' >{{(JuniorHighSchool.third*100).toFixed(2)}}%</div>

                           <div  class='w-100' >{{(JuniorHighSchool.fourth*100).toFixed(2)}}%</div>

                            <div  class='w-100' >{{(JuniorHighSchool.fifth*100).toFixed(2)}}%</div>

                             <div  class='w-100' >{{JuniorHighSchool.averageBookCollection}}</div>

                              <div  class='w-100' >{{JuniorHighSchool.pressKind}}</div>

                               <div  class='w-100' >{{JuniorHighSchool.tools}}</div>

                
                   

                </div>

                 <div class="w-15 Boxcontent" v-if="edit">
                   
                        <el-input v-model.number="PrimarySchool.first" class='w-100'   placeholder='请输入0-100整数' @blur="getNumber(PrimarySchool.first,'first',PrimarySchool)"  clearable></el-input>
                  
                        <el-input v-model.number="PrimarySchool.second" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(PrimarySchool.second,'second',PrimarySchool)"  clearable></el-input>
                   
                        <el-input v-model.number="PrimarySchool.third" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(PrimarySchool.third,'third',PrimarySchool)"  clearable></el-input>
                   
                        <el-input v-model.number="PrimarySchool.fourth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(PrimarySchool.fourth,'fourth',PrimarySchool)"  clearable></el-input>
                   
                        <el-input v-model.number="PrimarySchool.fifth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(PrimarySchool.fifth,'fifth',PrimarySchool)"  clearable></el-input>
                   
                        <el-input v-model.number="PrimarySchool.averageBookCollection"  class='w-100' placeholder='请输入整数'   clearable></el-input>
                   
                        <el-input v-model.number="PrimarySchool.pressKind" class='w-100'  placeholder='请输入整数'   clearable></el-input>

                        <el-input v-model.number="PrimarySchool.tools" class='w-100' placeholder='请输入0-100整数' @blur="getOtherNumber(PrimarySchool.tools,'tools',PrimarySchool)"  clearable></el-input>
                   

                </div>
                                 <div class="w-15 Boxcontent" v-else>
                   
                        <div  class='w-100' >{{(PrimarySchool.first*100).toFixed(2)}}%</div>

                         <div  class='w-100' >{{(PrimarySchool.second*100).toFixed(2)}}%</div>

                          <div  class='w-100' >{{(PrimarySchool.third*100).toFixed(2)}}%</div>

                           <div  class='w-100' >{{(PrimarySchool.fourth*100).toFixed(2)}}%</div>

                            <div  class='w-100' >{{(PrimarySchool.fifth*100).toFixed(2)}}%</div>

                             <div  class='w-100' >{{PrimarySchool.averageBookCollection}}</div>

                              <div  class='w-100' >{{PrimarySchool.pressKind}}</div>

                               <div  class='w-100' >{{PrimarySchool.tools}}</div>

                
                   

                </div>

                 <div class="w-15 Boxcontent" v-if="edit">
                   
                        <el-input v-model.number="Other.first" class='w-100'  placeholder='请输入0-100整数' @blur="getNumber(Other.first,'first',Other)"  clearable></el-input>
                  
                        <el-input v-model.number="Other.second" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(Other.second,'second',Other)"  clearable></el-input>
                   
                        <el-input v-model.number="Other.third" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(Other.third,'third',Other)"  clearable></el-input>
                   
                        <el-input v-model.number="Other.fourth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(Other.fourth,'fourth',Other)"  clearable></el-input>
                   
                        <el-input v-model.number="Other.fifth" class='w-100' placeholder='请输入0-100整数' @blur="getNumber(Other.fifth,'fifth',Other)"  clearable></el-input>
                   
                        <el-input v-model.number="Other.averageBookCollection" class='w-100' placeholder='请输入整数'   clearable></el-input>
                   
                        <el-input v-model.number="Other.pressKind" class='w-100' placeholder='请输入整数'   clearable></el-input>

                        <el-input v-model.number="Other.tools" class='w-100' placeholder='请输入0-100整数' @blur="getOtherNumber(Other.tools,'tools',Other)"   clearable></el-input>
                   

                </div>
                                 <div class="w-15 Boxcontent" v-else>
                   
                        <div  class='w-100' >{{(Other.first*100).toFixed(2)}}%</div>

                         <div  class='w-100' >{{(Other.second*100).toFixed(2)}}%</div>

                          <div  class='w-100' >{{(Other.third*100).toFixed(2)}}%</div>

                           <div  class='w-100' >{{(Other.fourth*100).toFixed(2)}}%</div>

                            <div  class='w-100' >{{(Other.fifth*100).toFixed(2)}}%</div>

                             <div  class='w-100' >{{Other.averageBookCollection}}</div>

                              <div  class='w-100' >{{Other.pressKind}}</div>

                               <div  class='w-100' >{{Other.tools}}</div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {bus: this.bus(this),
            list: [],
            height:'',
            CompleteJuniorHighSchool: {},
            SeniorMiddleSchool:  {},
            JuniorHighSchool:  {},
            PrimarySchool:  {},
            edit:false,
            Other:  {}
        };
    },
    created() {
        this.getSet();
        this.height=this.$height()
    },
    methods: {
        getOtherNumber(val,id,arr){
             if(val>0 && val<1){
              

           }
           else if(val>-1 && val<101){
               arr[id] = val

           }else{
               return  this.$message.warning('请输入正确的数字');
           }
        },

        getNumber(val,id,arr){
            // // console.log(val)
            // // console.log(val>=0 )
            // // console.log( val<=100)
            if(val>0 && val<1){
              

           }
           else if(val>-1 && val<101){
               arr[id] = val/100

           }else{
               return  this.$message.warning('请输入正确的数字');
           }
        },
        save() {
             this.loading()
            
            let params={
                completeJuniorHighSchool: this.CompleteJuniorHighSchool,
                 seniorMiddleSchool:this.SeniorMiddleSchool,
                    juniorHighSchool: this.JuniorHighSchool,
                    primarySchool: this.PrimarySchool,
                    other: this.Other,
                    platformId:JSON.parse(localStorage.getItem("user")).platform.id
            }

            this.ax.post('/manage/united/subPlatform/platformLabelParameter',params)
                .then(res=>{
                     this.sloading()
                      this.$message.success('保存成功');
                      this.edit=false
                })
                .catch(res=>{
                    this.sloading()
                })
        },
       
        getSet() {
            this.loading()
            this.ax.get('/manage/united/subPlatform/platformLabelParameter',{params:{platformId:JSON.parse(localStorage.getItem("user")).platform.id}}).then(res => {
                // console.log(res);
                res.map(it => {
                     this.sloading()
                    // this.list = res;/
                    if (it.label == 'CompleteJuniorHighSchool') {
                        this.CompleteJuniorHighSchool = it;
                    } else if (it.label == 'SeniorMiddleSchool') {
                        this.SeniorMiddleSchool = it;
                    } else if (it.label == 'JuniorHighSchool') {
                        this.JuniorHighSchool = it;
                    } else if (it.label == 'PrimarySchool') {
                        this.PrimarySchool = it;
                    } else if (it.label == 'OTHER') {
                        this.Other = it;
                    }
                   
                });
                //  // console.log( this.CompleteJuniorHighSchool)
            });
        }
    }
};
</script>

<style scoped>
.headerBox {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    background: #f1f5f9;
    font-size: 14px;
    /* padding: 0 20px; */
    color: #303139;
    line-height: 40px;
    /* text-align: center; */
}
.headerBox div{
      padding: 0 50px;
      box-sizing: border-box;
}
.Boxcontent div div{
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
}
</style>
