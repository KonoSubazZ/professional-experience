<template>
    <div>
        <div class="container">
         <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               书目信息
           </div>
           <div class="display_flex">
              
            </div>
       </div> 
      <div class="padding_20 m-b-10">
            <div class="display_flex ">
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">正题名</span>
                    <span class='tableList' :title="tableList.positiveTitle">{{tableList.positiveTitle}}</span> 
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">ISBN</span>
                    <span class='tableList' :title="tableList.isbn" >{{tableList.isbn}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">第一责任者</span>
                    <span class='tableList' :title="tableList.firstResponsible">{{tableList.firstResponsible}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">出版社</span>
                    <span class='tableList' :title="tableList.publisher">{{tableList.publisher}}</span>
                </div>
                <div class='w-20 m-b-20 display_flex start'>
                    <span class="label m-r-10">出版时间 </span>
                    <span class='tableList' :title="tableList.publicationDate">{{tableList.publicationDate}}</span>
                </div>
                
            </div>

       </div>

      
       <div class="display_flex between header_title padding_20 m-b-20">
           <div class="">
               书本馆藏信息
           </div>
           <div class="display_flex">
              
        </div>
       </div>
        <div class="padding_20 m-b-80" >
                <div class="f-s-14 m-b-20 display_flex" v-if="newCode">
                    <div class="m-r-10">新文献条码:</div>
                    <el-input placeholder="文献条码" class="m-r-20 w-15" disabled v-model="newCode"></el-input>
                </div>
                        <el-table
                            class="m-b-20"
                            ref="multipleTable"
                            :data="[tableList]"
                            tooltip-effect="dark"
                            style="width: 100%"
                           
                           >
                           <el-table-column
                            prop="barCode"
                            label="文献条码">
                            </el-table-column>
                            
                            <el-table-column
                            prop="callNumber"
                            label="索书号">
                             </el-table-column>

                             <el-table-column
                            prop="rackName"
                            label="架位号">
                             </el-table-column>
                           
                            <el-table-column
                            prop="collectionPlaceName"
                            label="馆藏地址">
                             </el-table-column>

                             <el-table-column
                            prop="bookStatus"
                            label="状态">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.bookStatus=='LEND'?'借出':scope.row.bookStatus=='InCollection'?'在馆':scope.row.bookStatus=='CULLING'?'注销':scope.row.bookStatus=='LOST'?'丢失':'损坏'}}
                                </div>
                            </template>
                            </el-table-column>

                            <el-table-column
                            prop="lendNumber"
                            label="借阅次数">
                             </el-table-column>
                            
                           
                        </el-table>
 
        </div>
         </div>
    </div>
</template>

<script>
export default {
    props:['tableList','newCode'],
    data() {
        return {bus: this.bus(this),};
    },
    created() {},
    methods: {}
};
</script>

<style>
</style>
