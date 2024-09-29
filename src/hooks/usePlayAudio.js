import { ref, onMounted, onUnmounted } from 'vue';

export default function usePlayAudio(src) {
  const audio = ref(new Audio(src));

  const play = () => {
    audio.value.play();
  };

  const pause = () => {
    audio.value.pause();
  };

  onMounted(() => {
    // 在组件挂载后自动播放音频
    play();
  });

  onUnmounted(() => {
    // 在组件卸载时停止播放音频并释放资源
    pause();
    audio.value = null;
  });

  return {
    play,
    pause
  };
}
