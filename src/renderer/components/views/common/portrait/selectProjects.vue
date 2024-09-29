<template>
  <div>
    <div v-if="skin == 'child'" class="type-list flex-row flex-center">
      <div
        class="type-item w-type flex-row flex-center"
        @click="go(item, index)"
        v-for="(item, index) in arr"
        :key="index"
      >
        <div class="item-box flex-row">
          <img
            class="w-50 mr-10"
            :src="require('@/assets/images/' + skin + '/' + item.ico + '.png')"
            alt
          />
          <div class="font-24 font-bold">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div v-if="skin == 'light' || skin=='lightPortrait'" class="type flex-row flex-wrap flex-center">
      <div
        class="item  bor-rad-20"
        :class="index<2?'w-250':'w-500'"
        v-for="(item, index) in arr"
        @click="go(item, index)"
        :key="index"
      >
        <div class="item-img">
          <img
            :src="require('@/assets/images/' + skin + '/' + item.ico + '.png')"
            alt
          />
        </div>
        <div :style="{ color: item.color }" class="item-name font-20">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-if="skin == 'dark'" class="type-dark flex-row flex-center">
      <div
        class="item-father"
        :style="{ backgroundColor: item.bacKTwo }"
        v-for="(item, index) in arr"
        @click="go(item, index)"
        :key="index"
      >
        <div class="item w-dark-type" :style="{ backgroundColor: item.back }">
          <div class="item-img">
            <img
              :src="
                require('@/assets/images/' + skin + '/' + item.ico + '.png')
              "
              alt
            />
          </div>
          <div class="item-name color-white font-20">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["prefix"],
  data() {
    return {
      arr: [
        {
          name: "个人信息",
          key: "/peopleInfo",
          ico: "people",
          color: "#02C8DB",
          back: "#1DA1F2",
          bacKTwo: "rgba(29,161,242,0.2)",
          path: "/peopleInfo",
        },
        {
          name: "借阅历史",
          key: "/history",
          ico: "history",
          color: "#FC9733",
          back: "#02D8F0",
          bacKTwo: "rgba(2,216,240,0.2)",
          path: "/borrowHistory",
        },
        {
          name: "当前借阅",
          key: "/current",
          ico: "current",
          color: "#3C90FA",
          back: "#0F316D",
          bacKTwo: "rgba(15,49,109,0.2)",
          path: "/currentBorrow",
        },
      ],
    };
  },
  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    backStatus() {
      return this.$store.state.Setting.back;
    },
  },
  watch: {
    backStatus(val) {
      if (!val) {
        this.reback();
      }
    },
  },
  destroyed() {
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "");
    });
  },
  created() {
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$nextTick(() => {
      this.$store.commit("set_label_name", "search");
    });
    this.$store.dispatch("modifyCaption", "请选择查询项目");
    console.log(this.skin)
  },
  methods: {
        /**
     * @description:返回
     */
    reback() {
      this.$router.replace("/");
    },
    /**
     * @description:选择认证方式
     */
    go(item, index) {
      console.log("/portrait/search" + item.path);
      this.$router.push({
        path: "/portrait/search" + item.path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.w-250{
  width: 18rem;
  height: 18rem;
}
.font-20{
  font-size: 1.5rem;
}
.w-500{
  width: 38rem;
  height: 18rem;
}
.flex-wrap{
  flex-wrap: wrap;
}
.type-list {
  .type-item {
    cursor: pointer;
    margin: 0 2%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 20px 3px rgba(255, 238, 232, 1);
  }
}
.type {
  position: absolute;
  top: 30%;
  width: 100%;
  .item {
    box-shadow: 0px 3px 20px rgba(29, 161, 242, 0.15);
    margin: 0 1rem 2rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    flex-direction: column;
    .item-img {
      width: 8rem;
    }
    .item-name {
      margin-top: 2rem;
    }
  }
}
.type-dark {
  position: absolute;
  top: 30%;
  width: 100%;
  .item-father {
    padding: 2px;
    box-sizing: border-box;
    margin: 0 2%;
  }
  .item {
    // box-shadow: 0px 3px 20px rgba(29, 161, 242, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    flex-direction: column;
    .item-img {
      width: 25%;
    }
    .item-name {
      margin-top: 10%;
    }
  }
}
</style>