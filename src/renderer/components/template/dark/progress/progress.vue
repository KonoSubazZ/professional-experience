<template>
  <div class="progress">
    <div class="item" v-for="(item,index) in list" :key="index">
      <div class="start w-80" :style="{backgroundColor:item.select?'#1DA1F2':'#E3E3E3'}">
        <img
          class="w-40 start_img"
          :src="require('@/assets/images/dark/'+item.ico+(item.select?'white':'gary')+'.png')"
          alt
        />
        <div
          class="start_name font-18 bottom-30 flex-row pointer"
          :class="item.select?'color-blue':'color-999'"
          v-if="!item.menu"
        >
          <span class="mr-5" style="margin:0 auto">{{item.name}}</span>
        </div>

        <div class="start_name bottom-30 pointer" v-if="item.menu">
          <downMenu>
            <template v-slot:content>
              <div class="flex-row font-18" :class="item.select?'color-blue':'color-999'">
                <span class="mr-5">{{item.name}}</span>
                <img v-if="item.menu" src="@/assets/images/dark/menu_down.png" class="w-down" alt />
              </div>
            </template>
          </downMenu>
        </div>
      </div>
      <div
        class="loading w-progress-border"
        v-if="index<list.length-1"
        :style="{borderColor:list[index+1].select?'#1DA1F2':'#919191'}"
      ></div>
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
    }
  }
};
</script>

<style lang="less" scoped>
.progress {
  position: absolute;

  left: 0;
  right: 0;
  margin: 4% auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    display: flex;
    align-items: center;
  }
  .start {
    position: relative;
    border-radius: 100%;
    .start_name {
      text-align: center;
      font-weight: bold;
      position: absolute;
      //   margin-bottom: -50px;
      width: 140%;
      //   text-align: center;
      left: -22%;
      right: 0;
      margin: 0 auto;
      white-space: nowrap;
    }
    .start_img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }
  .loading {
    border-bottom: 1.5px dotted;
  }
}
</style>