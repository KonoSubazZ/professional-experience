 <template>
    <div class="container" :style="'height:'+height+'px'">
            <list
                :dataUrl="'/manage/unit/journal/journalBookingBinding/journalBookingPage?receiveStatus=2&bindingStatus=0'"
                :disableMeta="true"
                :tableMeta="meta"
                 ref="list"
                 @edit='jump'
                 :style="$height(170)"
                :chooseBox='true'
            >
    
            </list>
    </div>
</template>

<script>
import list from '../../../view/List';
import ticketUtil from '../../../../utils/ticket'
export default {
    components: { list },
    data() {
        return {bus: this.bus(this),
            meta: '',
           height:'',
            chooseData:[],
            place:[],
            batch:[],
            form:{},
            rules:{},
            createModel:false,
        };
    },
    created() {
        this.getCycle()
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
        jump(e){
            // console.log(e)
            this.$router.push({
                path:'index/info',
                query:{id:e[0].id}
            })
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
                      {name:'复本',key:'receiveNumber',displayInList:true},
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
        }

    }
};
</script>

<style>
</style>
