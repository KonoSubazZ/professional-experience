<template>
    <div class="container">       
            <List
                :dataUrl="'/manage/unit/workstation/workStationSystemSetting/workStationLog'"
                :disableMeta="true"
                :tableMeta="meta"
                ref="list"
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
            form:{}
        };
    },
    created() {
        this.metaList();
    },
    methods: {
        metaList() {
            this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.WorkStationLog' } }).then(res => {
                res.insertable=false
                res.subs.map(it => {
                    if (it.key == 'name' || it.key == 'content' ) {
                        it.displayInList = true;
                       
                    }else{
                         it.searchable = false;
                    }
                    if(it.key == 'name'){
                        it.searchable = true;
                    }
                });
                // console.log(res);
                this.meta = res;
            });
        }
    }
};
</script>

<style>
</style>
