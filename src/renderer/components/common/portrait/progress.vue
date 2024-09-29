<template>
  <div class="posi-rela">
    <component :prefix="prefix" :is="progress"></component>
  </div>
</template>

<script>
export default {
  props: ["prefix"],
  components: {
    childProgress: () =>
      import("@/components/template/child/progress/progress.vue"),
    darkProgress: () =>
      import("@/components/template/dark/progress/progress.vue"),
    lightProgress: () =>
      import("@/components/template/light/progress/progress.vue"),
    lightPortraitProgress: () =>
      import("@/components/template/borrowPortrait/progress/progress.vue")
  },
  computed: {
    progress() {
      return this.$store.state.Setting.skin + "Progress";
    }
  }
};
</script>

<style>
</style>