<template>
  <div class="copyright" :style="{ color: color }">
    技术支持:蓝鲸知图
    <!-- ©2009-{{year}} 北京蓝鲸知图科技有限公司 版权所有 备案号: 京ICP备15018878号-4 -->
  </div>
</template>

<script>
export default {
  props: ["color"],
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
  font-size: 1.25rem;
  left: 0;
}
</style>