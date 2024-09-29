<template>
  <captionTime :caption="caption" @timeEnd="timeEnd"></captionTime>
</template>
<script>
import captionTime from "@/components/common/captionTime";
export default {
  components: {
    captionTime
  },
  computed: {
    caption() {
      return this.$store.state.Borrow.caption;
    },
    listLength() {
      return this.$store.state.Borrow.progreeList.filter(it => {
        return it.select;
      }).length;
    }
  },
  methods: {
    /**
     * @description:时间结束
     */
    timeEnd() {
      if (this.listLength >= 3) {
        this.$router.replace("/");
      }
      this.$router.go(-1);
    }
  }
};
</script>

<style>
</style>