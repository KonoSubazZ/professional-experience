 <template>
    <div class="container" :style="'height:'+height+'px'">
            <List
                :dataUrl="'/manage/unit/journal/journalBookingBinding/journalBookingPage?bindingStatus=1&receiveStatus=2'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="jump"
                ref="list"
                 :style="$height(170)"
                :chooseBox='true'
            ></List>
    </div>
</template>

<script>
import List from '../../../view/List';
import ticketUtil from '../../../../utils/ticket'
export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
          height:''
        };
    },
    created() {
        this.getCycle();
      this.calcTableHeight();
      window.addEventListener('resize', () => {
        this.calcTableHeight();
      });
    },
    methods: {
      calcTableHeight(val) {
        setTimeout(res=>{

          this.height = document.documentElement.clientHeight -170;

        },100)
      },
        // 修改
        editUpdate(e) {
             this.$router.push({
                 path:'/circulation/parameter/readerType/addReaderType',
                 query:{params:JSON.stringify(e[0])}
             })


        },
         jump(e){
            // console.log(e)
            this.$router.push({
                path:'search/show',
                query:{id:e[0].id}
            })
        },
        // 删除
        deleteUpdate(e) {
            this.loading();
            let ids=e.map(it=>{
                return it.id
            }).join(',')
            this.loading();
            this.ax
                .delete('/manage/unit/system/systemSettings/collectionPlace?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/journal/journalBookingBinding/journalBookingDetailAfter`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        open(){
            this.$router.push('/circulation/parameter/readerType/addReaderType')
        },
         // 获取周期
        getCycle(){
            this.ax.get('/manage/unit/general/cycle',{params:{size:999,platformId:JSON.parse(localStorage.getItem("user")).platform.id}})
                .then(res=>{
                  let arr = res.content.map(it=>{
                       return {name:it.name,key:it.id}
                   })
                    this.metaList(arr);
                })
        },
        metaList(arr) {
            this.meta={
                edit:'EDIT',
                 subs:[
                     {name:'ISSN',key:'issn',displayInList:true,searchable:true},
                     {name:'刊名',key:'title',displayInList:true,searchable:true},
                     {name:'分类号',key:'classificationNumber',displayInList:true},
                     {name:'责任者',key:'responsible',displayInList:true},
                     {name:'价格',key:'price',displayInList:true},
                      {name:'复本',key:'copy',displayInList:true},
                       {name:'订购期数',key:'orderPeriod',displayInList:true},
                     {name:'订购年份',key:'year',displayInList:true,searchable:true},
                     {name:'周期名称',key:'cycleName',displayInList:true},
                     {name:'周期名称',key:'cycleId',searchable:true,searchOption:arr},

                    

                     {name:'是否装订',key:'bindingStatus',displayInList:true,searchOption:[
                         {name:'未装订',key:0,color:''},
                         {name:'已装订',key:1,color:''},
                     ]},
                    
                     
                 ]
            }
        },
    }
};
</script>

<style>
</style>
