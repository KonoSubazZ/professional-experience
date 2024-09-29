<template>
  <div class="progress">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="progress-item" v-if="!item.menu">
        <img
          class="progress-img"
          :src="
            require('@/assets/images/light/' +
              item.ico +
              (item.select ? 'white' : 'gary') +
              '.png')
          "
          alt
        />
        <div
          class="progress-name"
          :class="item.select ? 'color-blue' : 'color-999'"
        >
          {{ item.name }}
        </div>
        <img
          class="progress-icon"
          :src="
            require('@/assets/images/light/pro-' +
              (item.select ? 'white' : 'gary') +
              '.png')
          "
          alt=""
        />
      </div>
      <div class="posi-center flex-row flex-center pointer" v-if="item.menu">
        <downMenu>
          <template v-slot:content>
            <div class="progress-item">
              <img
                class="progress-img"
                :src="
                  require('@/assets/images/light/' +
                    item.ico +
                    (item.select ? 'white' : 'gary') +
                    '.png')
                "
                alt
              />
              <div class="flex-row" style="margin-top:1rem">
                <div
                  class="progress-name"
                  style="margin-top:0rem;"
                  :class="item.select ? 'color-blue' : 'color-999'"
                >
                  {{ item.name }}
                </div>
                <img

                  src="@/assets/images/light/menu_down.png"
                  class="w-down"
                  alt
                />
              </div>
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
    downMenu,
  },
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    left() {
      return (100 - (this.list.length * 15.5 + 8)) / 2;
    },
  },
};
</script>

<style lang="less" scoped>
.progress {
  position: fixed;
  width: 100%;
  left: 0;
  padding: 0 1rem;
  box-sizing: border-box;
  // height: 12%;
  display: flex;
  justify-content: center;
  .item {
    // flex: 1;
    text-align: center;
    position: relative;
    &:last-of-type {
      .progress-icon {
        display: none;
      }
    }
    width: 16.16%;
  }
}
.progress-img {
  width: 6.25rem;
  height: 6.25rem;
  margin: 0 auto;
}
.progress-name {
  font-size: 1.25rem;
  margin-top: 1rem;
}
.progress-icon {
  position: absolute;
  width: 1.56rem;
  height: 1.06rem;
  right: 0;
  top: 50%;
  transform: translateY(-50%) translateX(50%);
}
</style>