<template>
  <overdue></overdue>
</template>

<script>
import overdue from "@/components/common/overdue";
export default {
  components: {
    overdue
  },
  created() {
    this.$store.dispatch(
      "modifyCaption",
      "当前权限被锁定，请先处理逾期罚款，处理后自动恢复"
    );
  }
};
</script>

<style>
</style>