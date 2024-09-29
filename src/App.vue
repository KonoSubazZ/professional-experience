<template>
  <router-view />
</template>

<script>
export default {
  name: "app",
  created() {},
};
</script>
<style lang="scss">
.change {
  height: 340px;
  position: relative;
}

.customid {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.process {
  height: 4vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    .el-dialog__title {
      font-size: 2vw;
      line-height: 5vw;
    }
  }
}

.picker {
  width: 20vw !important;
  margin-left: 8vw;

  .el-time-panel__content {
    .el-time-spinner {
      .el-time-spinner__wrapper {
        max-height: 9.5vh;

        .el-scrollbar__wrap {
          .el-scrollbar__view {
            .el-time-spinner__item {
              font-size: 2vw;
              height: 3vw;
            }
          }
        }
      }
    }
  }

  .el-time-panel__footer {
    height: 2vh;

    .el-time-panel__btn {
      margin-top: 1.7vw;
      font-size: 2.7vw;
    }
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  color: #2c3e50;
}

nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
