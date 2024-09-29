<template>
  <div>
    <el-dropdown trigger="click" @command="handleCommand">
      <div>
        <slot name="content"></slot>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="peopleInfo">个人信息</el-dropdown-item>
        <el-dropdown-item command="borrowHistory">借阅历史</el-dropdown-item>
        <el-dropdown-item command="currentBorrow">当前借阅</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: {
        peopleInfo: {
          name: "个人信息",
          select: true,
          ico: "people_",
          menu: true
        },
        borrowHistory: {
          name: "借阅历史",
          select: true,
          ico: "history_",
          menu: true
        },
        currentBorrow: {
          name: "当前借阅",
          select: true,
          ico: "current_",
          menu: true
        }
      }
    };
  },

  computed: {
    skin() {
      return this.$store.state.Setting.skin;
    },
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    routerName() {
      return this.$route.name;
    }
  },
  methods: {
    /**
     * 点击下拉切换
     */
    handleCommand(e) {
      if (e == this.routerName) {
        return;
      }
      // console.log(this.list);
      let list = JSON.parse(JSON.stringify(this.list)).filter((it, ix) => {
        return ix < this.list.length - 1;
      });
      // list.push(this.menu[e]);
      this.$store.dispatch("modifyProgreeList", list);
      this.$router.push({
        path: "/search/" + e
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>