<template>
  <component :is="ceshi"></component>
</template>

<script>
export default {
  components: {
    brow: () => import("./ceshi/brow.vue"),
    card: () => import("./ceshi/card.vue"),
  },
  data() {
    return {
      obj: {
        one: "brow",
        two: "card",
      },
    };
  },
  computed: {
    ceshi() {
      if (process.env.application ==='card_machine'){
        return "card"
      }
      return  "brow"
    },
  },
};
</script>

<style>
</style>