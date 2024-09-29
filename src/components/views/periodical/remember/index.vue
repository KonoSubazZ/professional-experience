 <template>
    <div class="container" :style="'height:'+height+'px'">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               期刊记到
           </div>
            
       </div>
        <List 
            :dataUrl="'/manage/unit/journal/journalBookingDetail/journalBookingPage'"
            :disableMeta='true'
            :tableMeta='meta'
            @edit="editUpdate"
            :isSort='true'
            ref="list"
            :style="$height(255)"
             >
        </List>
      
    </div>
</template>

<script>
import viewForm from '../../../view/form'
import List from '../../../view/List'
export default {
    components:{
        viewForm,
        List
    },
    data() {
        return {bus: this.bus(this),
            unit:[],
           height:'',
           meta:''
        };
    },
    created() {
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
        this.getUnit()
            .then(res=>{
                this.metaList()
            })
      
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        getForm(val){
            this.form = val
            // console.log(val)
        },
        // 获取供应商
        getUnit(){
           return new Promise(resolve=>{
                this.ax.get('/manage/unit/journal/journalBooking/deliveryUnit',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                    // console.log(res)
                    this.unit = res.content
                    resolve()
                })
           })
        },
         // 新增保存
        save(formName) {
          
         
            // this.ruleForm.roles = this.mapList();
            // this.form.permissions = this.pushSelect()
              this.form.platformId = JSON.parse(localStorage.getItem("user")).platform.id
              this.$refs[formName].$refs[formName].validate(valid => {
                    if (valid) {
                         this.loading();
                        this.ax
                            .post('/manage/unit/catalog/circulationParameters/readerType', this.form)
                            .then(res => {
                                this.sloading();
                                this.$message.success('保存成功');
                                 this.bus.$emit(`flash_/manage/unit/catalog/circulationParameters/readerType`, res);
                                this.back()
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
        },
        editUpdate(e){
            // console.log(e)
              this.$router.push({
                path:'/periodical/remember/info',
                query:{id:e[0].id}
            })
        },
        metaList(){
           this.ax.get('/manage/meta',{params:{path:'com.cq1080.library.cluster.bean.entity.JournalBooking'}})
            .then(res=>{
             
                // if(this.activeName =='BOOK'){
                    res.delete='NONE'
                    res.insertable = false
                    res.subs.map(it=>{
                            if(it.key=='createTime' || it.key == 'platformId' || it.key == 'marcType'|| it.key=='bindingStatus'){
                                it.displayInList=false
                                it.searchable=false
                            }
                        })

                    
               

                res.subs.unshift(
                    {
                        key:'issn',
                        name:'ISSN',
                        displayInList: true,
                        searchable: true
                    },
                    {
                        key:'title',
                        name:'刊名',
                        displayInList: true,
                        searchable: false,
                        
                    },
                     {
                        key:'cycleName',
                        name:'出版周期/总期',
                        displayInList: true,
                        searchable: false
                    },
                      {
                        key:'deliveryUnit',
                        name:'供货单位',
                        displayInList: false,
                        searchable: true,
                        searchOption:this.unit.map(it => {
                            let arr ={
                                key:it.name,
                                name:it.name
                            }
                            return arr
                        })
                    },
                     {
                        key:'year',
                        name:'订购年份',
                        displayInList: true,
                        searchable: true
                    },
                     {
                        key:'volume',
                        name:'卷',
                        displayInList: true,
                        searchable: false
                    },
                     {
                        key:'price',
                        name:'价格（单卷）',
                        displayInList: true,
                        searchable: false
                    },
                    // {
                    //     key:'copy',
                    //     name:'复本',
                    //     displayInList: true,
                    //     searchable: false
                    // },
                    {
                        key:'handleNumber',
                        name:'记到份数',
                        displayInList: true,
                        searchable: false
                    },
                     {
                        key:'note',
                        name:'备注',
                        displayInList: true,
                        searchable: false
                    },
                      {
                        key:'receiveTime',
                        name:'记到日期',
                        type:'TIMESTAMP',
                        displayInList: true,
                        searchable: false
                    },
                    
                )

                this.meta = res
                // }
            })
        },
       
    }
};
</script>

<style>

</style>
