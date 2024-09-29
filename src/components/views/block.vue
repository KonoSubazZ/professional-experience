<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        
    </div>
</template>

<script>
export default {
    data() {
        return {bus: this.bus(this),
           
        };
    },
    created() {
       
    },
    methods: {
     
    }
};
</script>

<style>
.top_title{
    height: 3.78rem;
    width: 100%;
    border-bottom: 1px solid #DCDCDC;
    padding: 0 20px;
    box-sizing: border-box;
}
.title{
    color: #333;
    font-size:1rem;
    font-weight:normal;
    line-height:3.78rem;
}
.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
    line-height: 42px; 
}
.btn_img{
    width: 1.38rem;
    height: 1.31rem;
}
.el-dialog__header{
    border-bottom: 1px solid #ddd;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
  .padding_40{
      padding: 0 40px;
  }
  .label_title{
    height:1.25rem;
    font-size:0.88rem;
    font-weight:400;
    line-height:1.25rem;
    color:#999999;
    text-align: right;
    margin-right: 10px;
}
.el-tabs__item{
    height:3.81rem ;
    line-height: 3.81rem;
}
.b-b-1{
    border-bottom: 1px solid #ddd;
}
.noServe{
    text-align: center;
    padding-top: 100px;
    font-size: 30px;
}
</style>
