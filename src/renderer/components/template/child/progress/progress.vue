<template>
  <div class="progress">
    <div class="item" v-for="(item,index) in list" :key="index">
      <div class="start">
        <img
          class="w-120"
          :src="require('@/assets/images/child/start'+(item.select?'_select':'')+'.png')"
          alt
        />
<!--        <img-->
<!--          class="w-40 start_img"-->
<!--          :src="require('@/assets/images/child/'+item.ico+'white.png')"-->
<!--          alt-->
<!--        />-->
        <div
          class="start_name font-18 bottom-30"
          :class="item.select?'color-333':'color-999'"
          v-if="!item.menu"
        >{{item.name}}</div>

        <div class="start_name pointer font-18 bottom-30" v-if="item.menu">
          <downMenu>
            <template v-slot:content>
              <div class="flex-row flex-center">
                <span
                  class="font-18 mr-5"
                  :class="item.select?'color-333':'color-999'"
                >{{item.name}}</span>
                <img src="@/assets/images/child/menu_down.png" class="w-down" alt />
              </div>
            </template>
          </downMenu>
        </div>
      </div>
      <div class="loading" v-if="index<list.length-1">
        <img
          class="w-loading"
          :src="require('@/assets/images/child/loading'+(list[index+1].select?'_select':'')+'.png')"
          alt
        />
      </div>
    </div>
  </div>
</template>

<script>
import downMenu from "@/components/views/common/downMenu";

export default {
  components: {
    downMenu
  },
  props: ["prefix"],
  data() {
    return {};
  },
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
    }
  },
  methods: {
    go(path) {
      this.$router.push({
        path: this.$props.prefix + path
      });
    }
  }
};
</script>

<style lang="less" scoped>
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    display: flex;
    align-items: center;
  }
  .start {
    position: relative;
    .start_name {
      text-align: center;
      font-weight: bold;
      position: absolute;
      //   margin-bottom: -50px;
      width: 100%;
      white-space: nowrap;
    }
    .start_img {
      position: absolute;
      top: 50%;
      transform: translateY(-35%);
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }
}
</style>