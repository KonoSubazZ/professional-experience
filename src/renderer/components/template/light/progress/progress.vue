<template>
  <div class="progress">
    <div
      class="item"
      v-for="(item,index) in list"
      :key="index"
      :style="{left:(15.5*index+left)+'%',zIndex:(10-index)}"
    >
      <div class="start">
        <img :src="require('@/assets/images/light/progress'+(item.select?'_select':'')+'.png')" alt />
      </div>
      <div class="posi-center flex-row flex-center" v-if="!item.menu">
        <img
          class="w-40 mr-5"
          :src="require('@/assets/images/light/'+item.ico+(item.select?'white':'gary')+'.png')"
          alt
        />
        <span class="font-18" :class="item.select?'color-white':'color-999'">{{item.name}}</span>
      </div>
      <div class="posi-center flex-row flex-center pointer" v-if="item.menu">
        <downMenu>
          <template v-slot:content>
            <div class="flex-row flex-center">
              <img
                class="w-40 mr-5"
                :src="require('@/assets/images/light/'+item.ico+(item.select?'white':'gary')+'.png')"
                alt
              />
              <span class="font-18 mr-5" :class="item.select?'color-white':'color-999'">{{item.name}}</span>
              <img src="@/assets/images/light/menu_down.png" class="w-down" alt />
            </div>
          </template>
        </downMenu>
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
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    left() {
      return (100 - (this.list.length * 15.5 + 8)) / 2;
    }
  }
};
</script>

<style lang="less" scoped>
.progress {
  position: absolute;
  width: 100%;
  height: 12%;
  .item {
    position: absolute;
    width: 23%;
    // height: 12%;
  }
}
</style>