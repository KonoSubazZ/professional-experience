<template>
  <component :is="back" :setting="setting">
    <!-- <template v-slot:headerTitle>配置服务器</template> -->
    <template v-slot:header></template>
    <template v-slot:body>
      <slot name="body"></slot>
    </template>
  </component>
</template>

<script>
export default {
  components: {
    childBack: () =>
      import("@/components/template/child/background/background.vue"),
    darkBack: () =>
      import("@/components/template/dark/background/background.vue"),
    lightBack: () =>
      import("@/components/template/light/background/background.vue"),
    lightPortraitBack: () =>
      import("@/components/template/borrowPortrait/background/background.vue"),
    cardBack: () =>
      import("@/components/template/light/background/background.vue")
  },
  props: {
    setting: {
      type: Object,
      value: {}
    }
  },
  computed: {
    back() {
      return this.$store.state.Setting.skin + "Back";
    }
  }
};
</script>
