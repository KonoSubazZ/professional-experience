<template>
  <component :prefix="'/' + prefix" :is="type"></component>
</template>

<script>
export default {
  components: {
    childType: () => import("@/components/template/child/common/type.vue"),
    darkType: () => import("@/components/template/dark/common/type.vue"),
    lightType: () => import("@/components/template/light/common/type.vue"),
    lightPortraitType: () => import("@/components/template/borrowPortrait/common/type.vue"),
  },
  computed: {
    type() {
      return this.$store.state.Setting.skin + "Type";
    },
    prefix() {
      return this.$route.meta.type;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.$router.replace("/");
      }
    },
  },
  created() {
    this.$store.dispatch("add_to_log", "选择认证方式");
    this.$store.dispatch("modifyCaption", "请选择认证方式");
    this.$store.dispatch("add_to_error_log", "选择认证方式");
    this.$store.commit("set_label_name", "type");
  },
  destroyed() {
    this.$store.commit("set_label_name", "");
  },
};
</script>

<style>
</style>