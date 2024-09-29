<template>
  <div id="box">
    <div
      v-if="skin == 'light' || skin == 'lightPortrait'"
      class="type1 type flex-row flex-wrap flex-center"
    >
      <div
        class="item bor-rad-20"
        :class="index < 2 ? 'w-250' : 'w-250'"
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
    <div
      v-if="skin == 'light' || skin == 'lightPortrait'"
      class="type2 type flex-row flex-wrap flex-center"
    >
      <div
        class="item bor-rad-20"
        :class="index < 2 ? 'w-250' : 'w-250'"
        v-for="(item, index) in arr2"
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
    <div
      v-if="skin == 'light' || skin == 'lightPortrait'"
      class="type3 type flex-row flex-wrap flex-center"
    >
      <div
        class="item bor-rad-20"
        :class="index < 2 ? 'w-250' : 'w-250'"
        v-for="(item, index) in arr3"
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
    <div
      v-if="skin == 'light' || skin == 'lightPortrait'"
      class="type4 type flex-row flex-wrap flex-center"
    >
      <div
        class="item bor-rad-20"
        :class="index < 2 ? 'w-250' : 'w-250'"
        v-for="(item, index) in arr4"
        @click="goChild('payment')"
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
      ],
      arr2: [
        {
          name: "借阅历史",
          key: "/history",
          ico: "history",
          color: "#FC9733",
          back: "#02D8F0",
          bacKTwo: "rgba(2,216,240,0.2)",
          path: "/borrowHistory",
        },
      ],
      arr3: [
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
      arr4: [
        {
          name: "充值",
          key: "/current",
          ico: "payment1",
          color: "#FB8788",
          back: "#0F316D",
          bacKTwo: "rgba(15,49,109,0.2)",
        },
      ],
      listarr: {
        payment: [
          {
            name: "选择认证方式",
            select: true,
            ico: "auth_",
            path: "/payment/",
          },
          // {
          //   name: "进行认证",
          //   select: false,
          //   ico: "loading_",
          // },
          // {
          //   name: "确认密码",
          //   select: false,
          //   ico: "password_",
          //   path: "/payment/password",
          // },
          {
            name: "充值面额选择",
            select: false,
            ico: "deno_",
            path: "/payment/deno",
          },
          {
            name: "进行支付",
            select: false,
            ico: "pay_",
            path: "/payment/payment",
          },
          {
            name: "充值成功",
            select: false,
            ico: "success_",
          },
        ],
      },
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
    console.log(this.skin);
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
    goChild(name) {
      let list = this.listarr[name];
      if(list[0].path=='/payment/'){
        this.$store.dispatch("modifyProgreeList", list);
        this.$router.push({
        path:'/payment/deno',
      });
      console.log(list);
      }
    },
  },
};
</script>

<style lang="less" scoped>
#box{
  position: absolute;
    top: 25%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.w-250 {
  width: 18rem;
  height: 18rem;
}
.font-20 {
  font-size: 1.5rem;
}
.w-500 {
  width: 38rem;
  height: 18rem;
}
.flex-wrap {
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
  width: 18rem !important;
    height: 18rem !important;
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
.type1 {
  margin: 0 3rem 3rem 0
}
.type2 {
  margin: 0 3rem 3rem 0
}
.type3 {
    margin: 0 3rem 3rem 0
}
.type4 {
  margin: 0 3rem 3rem 0
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