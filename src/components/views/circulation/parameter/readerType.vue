<template>
    <div class="container">       
            <List
                :dataUrl="'/manage/unit/circulation/circulationParameters/readerType'"
                :disableMeta="true"
                :tableMeta="meta"
                @edit="editUpdate"
                ref="list"
                @delete="deleteUpdate"
                @create="open"
                 :chooseBox='true'
            ></List>
    </div>
</template>

<script>
import List from '../../../view/List';

export default {
    components: { List },
    data() {
        return {bus: this.bus(this),
            meta: '',
        };
    },
    created() {
        this.metaList();
        this.getReader()
    },
    methods: {
       
        // 修改
        editUpdate(e) {
             this.$router.push({
                 path:'/circulation/parameter/readerType/addReaderType',
                 query:{params:JSON.stringify(e[0])}
             })


        },
         //查询读者
        async getReader(){
          let params = {
            platformId: JSON.parse(localStorage.getItem("user")).platform.id,
            page:0,
            size:99999
          }
          return await this.ax.get('/manage/unit/circulation/readerManagement/reader', {params});
        },
        // 删除
        async deleteUpdate(e) {
          const reader = await this.getReader();
          for(let i = 0;i<e.length;i++){
            if(reader.content.length>0 && reader.content.map(it=>it.readerTypeId).includes(e[i].id)){
              return this.$message.error('当前读者类型下有读者,不允许进行删除')
            }
          }

            this.loading();
            let ids=e.map(it=>{
                return it.id
            }).join(',')
            this.loading();
            this.ax
                .delete('/manage/unit/circulation/circulationParameters/readerType?ids=' + ids)
                .then(res => {
                    this.sloading();
                    this.bus.$emit(`flash_/manage/unit/circulation/circulationParameters/readerType`, res);
                    this.$message.success('删除成功');
                })
                .catch(res => {
                    this.sloading();
                });
        },
        open(){
            this.$router.push('/circulation/parameter/readerType/addReaderType')
        },
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.ReaderType' } }).then(res => {
                res.delete='DELETE'
                res.subs.map(it => {
                    if (it.key == 'createTime' || it.key == 'type' || it.key == 'platformId') {
                        it.displayInList = false;
                        it.searchable = false;
                    }
                });
              res.subs = res.subs.map(e=>({
                  ...e,
                  name:e.name=='读者在押金'?'读者押金':e.name
                }))
              this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
