<script setup lang="ts">

import { ref } from 'vue';
const iframeSrc = ref('')
if (navigator.userAgent.includes('Electron')) {
  // Electron环境下的操作
  console.log('Electron环境')
  const { getAppPath } = window.electron;
  const userDataPath = getAppPath();
  iframeSrc.value = 'file://' + userDataPath + '/extraResources/lizi.html';
} else {
  // 网页环境下的操作
  console.log('网页环境')
  if(import.meta.env.DEV){
    // 开发环境
    iframeSrc.value = '/lizi.html'
  }else{
    // 生产环境
    iframeSrc.value = '/dataView/lizi.html'
  }
  
}

</script>

<template>
  <div class="canvas" style="opacity: .4;z-index:-1;">
    <iframe frameborder="0" :src="iframeSrc" scrolling="no"
      style="width: 100vw;height: 100vh;position: absolute;top: 0;left: 0;">
    </iframe>
  </div>
  <RouterView></RouterView>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
