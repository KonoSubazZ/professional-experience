<template>
  <background :setting="setting">
    <template v-slot:header>
      <!-- <div class="operating-img">
        <img class="header-opreating" src="@/assets/images/child/header_opreating.png" alt />
        <div class="opreating-modal pd-20">
          <div class="font-32">借书</div>
          <img class="w-24" src="@/assets/images/child/arrow_bottom.png" alt />
        </div>
      </div>-->
    </template>
    <template v-slot:body>
      <div class="mt-40">
        <Progress :list="list"></Progress>
      </div>
      <div class="mt-110">
        <router-view></router-view>
      </div>
    </template>
  </background>
</template>

<script>
import background from "@/components/template/card/background/background";
import Progress from "@/components/common/progress";
export default {
  components: {
    background,
    Progress
  },
  data() {
    return {
      setting: {
        showTime: true,
        titleType: "title"
      }
    };
  },
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.operating-img {
  width: 26% !important;
  //   background-color: red;
  position: relative;
  .header-opreating {
    width: 100%;
    height: auto;
  }
  .opreating-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 32px;
  }
}
</style>
