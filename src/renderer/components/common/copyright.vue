<template>
  <div class="copyright font-18" :style="{ color: color }">
  使用单位：{{ platform }}
    <!-- ©2009-{{year}} 北京蓝鲸知图科技有限公司 版权所有 备案号: 京ICP备15018878号-4 -->
  </div>
</template>

<script>
export default {
  props: ["color",'platform'],
  methods: {},
  computed:{
      year(){   
          return new Date().getFullYear();
      }
  }
};
</script>

<style lang="less" scoped>
.copyright {
  position: fixed;
  bottom: 1rem;
  color: white;
  text-align: center;
  width: 100%;
  // font-size: 14px;
  left: 0;
}
</style>  