<template>
    <div>
        <div class="container " >
            
                       
                            <List
                                :dataUrl="'/manage/unit/catalog/collectionHandling/irregularBookBase'"
                                :disableMeta="true"
                                :tableMeta="meta"
                                @edit="editBook"
                                ref="list"
                                @delete="deleteBook"
                            >
                               
                            </List>
                  

         </div>
    </div>
</template>

<script>
import List from '../../view/List';
import fromData from '../../view/form'

const qs = require('qs');
export default {
    components: {
        List,
        fromData
    },
    data() {
        return {bus: this.bus(this),
            meta:''
        };
    },
    created() {
       
       
        this.metasList()
        document.onkeydown = e => {
            let key = window.event.keyCode;
            // console.log(e);
        };
    },
    methods: {
        
        // 获取meta
        metasList() {
            this.meta = {
                insertable: false,
                edit: 'EDIT',
                delete: 'DELETE_BOTH',
                subs: [
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'positiveTitle',
                        searchable: true,
                        name: '正题名'
                    },
                    {
                        clickable: false,
                        displayInList: false,
                        key: 'isbn',
                        searchable: false,
                        name: 'ISBN'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: false,
                        key: 'firstResponsible',
                        name: '第一责任者'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'publisher',
                        name: '出版社'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        key: 'classificationNumber',
                        name: '分类号'
                    },
                    {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'managerName',
                        name: '操作员'
                    },
                     {
                        clickable: false,
                        displayInList: true,
                        searchable: true,
                        key: 'createTime',
                        type: "TIMESTAMP",
                        name: '编目时间'
                    }
                ]
            };
        },
        del(){},
       
        deleteBook(val){
            this.loading()
            let ids = val.map(it=>{
                return it.id
            }).join(',')
            this.ax.delete('/manage/unit/catalog/collectionHandling/irregularBookBase?ids='+ids)
                .then(res=>{
                    this.bus.$emit('flash_/manage/unit/catalog/collectionHandling/irregularBookBase')
                       this.$message.success('删除成功');
                        this.sloading()
                })
        },
        editBook(val){
             let bookBase=val[0]
            
             this.$router.push({
               path:'/catalogue/literature/library/libraryBookInfo',
               query:{ infos:JSON.stringify(bookBase)}
           })
        },
    }
};
</script>

<style scoped>

</style>
