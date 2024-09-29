<template>
  <div id="background">
    <div class="back-header bg-light">
      <div class="header-body posi-abso flex-row flex-between align-center">
        <div class="font-38 color-white font-hei">
          {{
          setting.titleType == "title" ? "自助办证借还一体机" : "配置服务器"
          }}
        </div>
        <div class="header-operating color-white text-center">
          <div class="operating-img pointer" @click="goHome">
            <img src="@/assets/images/dark/home.png" alt />
            <div class="font-16 nowarp mt-10">首页</div>
          </div>
          <div class="operating-img pointer" @click="goBack" v-if="setting.back">
            <img src="@/assets/images/dark/back.png" alt />
            <div class="font-16 nowarp mt-10">返回</div>
          </div>
          <button
            class="operating-menu pointer pd-20"
            id="menu-btn"
            v-if="userInfo && userInfo.name"
            @blur="showMenu=false"
            @click="showMenu=!showMenu"
          >
            <div class="font-24">{{type?typeList[type]:''}}</div>
            <div>
              <img class="w-down" src="@/assets/images/light/menu-down.png" alt />
            </div>
            <div class="menu-list font-24 pd-20" id="menu-list" v-if="showMenu">
              <div v-for="(item,index) in menuList" :key="index" @click="change(item)">{{item.name}}</div>
            </div>
          </button>
          <div>
            <slot name="header"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="caption-user flex-row">
      <div class="user-info flex-row color-333" v-if="userInfo && userInfo.name">
        <el-image class="w-40 mr-10 bg-light bor-rad-round" style="overflow: hidden;width: 6rem;height: 6rem;"
                    :src="userInfo.photo != '' && userInfo.photo != null ?http + '/' + userInfo.photo : require('@/assets/images/dark/user_tag.png')"
                    :fit="'cover'"></el-image>
        <span class="font-24">{{ userInfo ? userInfo.name : "" }}</span>
      </div>
      <captionTime :color="'#1DA1F2'" v-if="setting.showTime"></captionTime>
    </div>
    <div class="back-body bor-rad-20">
      <slot name="body"></slot>
    </div>

    <copyright :color="'#333'" />
  </div>
</template>

<script>
import copyright from "@/components/common/copyright";
import captionTime from "@/components/common/captionTime";
export default {
  components: {
    copyright,
    captionTime
  },
  props: {
    setting: {
      type: Object,
      value: {
        showTime: true,
        titleType: "title",
        back: true
      }
    }
  },
  data() {
    return {
      typeList: {
        borrow: "借书",
        return: "还书",
        renew: "续借",
        search: "查询"
      },
      showMenu: false,
      menuList: [
        {
          name: "借书",
          list: [
            {
              name: "选择认证方式",
              select: true,
              ico: "auth_"
            },
            {
              name: "进行认证",
              select: true,
              ico: "loading_"
            },
            {
              name: "确认密码",
              select: true,
              ico: "password_",
              path: "/borrow/password"
            },
            {
              name: "放置图书",
              select: false,
              ico: "book_",
              path: "/borrow/book"
            },
            {
              name: "确认信息",
              select: false,
              ico: "info_",
              path: "/borrow/info"
            },
            {
              name: "借书成功",
              select: false,
              ico: "success_"
            }
          ]
        },
        {
          name: "还书",
          list: [
            {
              name: "放置图书",
              select: false,
              ico: "book_",
              path: "/return/"
            },
            {
              name: "确认信息",
              select: false,
              ico: "info_",
              path: "/return/info"
            },
            {
              name: "还书成功",
              select: false,
              ico: "success_"
            }
          ]
        },
        {
          name: "续借",
          list: [
            {
              name: "选择认证方式",
              select: true,
              ico: "auth_"
            },
            {
              name: "进行认证",
              select: true,
              ico: "loading_"
            },
            {
              name: "确认密码",
              select: true,
              ico: "password_",
              path: "/renew/password"
            },
            {
              name: "选择图书",
              select: false,
              ico: "select_",
              path: "/renew/select"
            },
            {
              name: "续借成功",
              select: false,
              ico: "success_"
            }
          ]
        },
        {
          name: "查询",
          list: [
            {
              name: "选择认证方式",
              select: true,
              ico: "auth_"
            },
            {
              name: "进行认证",
              select: true,
              ico: "loading_"
            },
            {
              name: "确认密码",
              select: true,
              ico: "password_",
              path: "/search/password"
            },
            {
              name: "选择查询项目",
              select: false,
              ico: "projects_",
              path: "/search/projects"
            }
          ]
        }
      ]
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.User.userInfo;
    },
    type() {
      return this.$route.meta.type;
    },
    http() {
            return this.$store.state.Setting.httpUrl
                ? this.$store.state.Setting.httpUrl : "";
        },
  },
  created() {
    let _this = this;
    window.onclick = e => {
      if (e.path[1].id != "menu-list" && e.path[0].id != "menu-btn") {
        _this.showMenu = false;
      }
    };
  },
  methods: {
    /**
     * @description:切换流程
     */
    change(item) {
      let href = window.location.href.split("#");
      let path = this.$func.getNextPath(item.list);
      if (path != href[1]) {
        this.$store.dispatch("modifyProgreeList", item.list);
        href[1] = path;
        console.log(href);
        window.location.href = href.join("#");
      } else {
        // this.showMenu = false;
      }
    },
    goHome() {
      this.$router.replace("/");
      // location.reload();
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.operating-menu {
  width: 25% !important;
  float: right;
  position: relative;
  background-color: white;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin: 2%;
  border: none;
  outline: none;
  cursor: pointer;
  .header-opreating {
    width: 100%;
    height: auto;
  }

  .menu-list {
    top: 110%;
    left: 0;
    position: absolute;
    background-color: white;
    border-radius: 4px;
    width: 100%;
    text-align: left;
    z-index: 999;
    box-shadow: 0px 3px 6px rgba(29, 161, 242, 0.19);
    animation: showList 0.2s;
    div {
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 10%;
      }
    }
  }
}
@keyframes showList {
  0% {
    transform: translateY(50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
#background {
  width: 100vw;
  height: 100vh;
  background-color: white;
  background-image: url("~@/assets/images/light/back_bottom.png");
  background-size: 100%;
  background-position: bottom left;
  background-repeat: no-repeat;
  .back-header {
    height: 11%;
    width: 100%;
    position: relative;
    .header-body {
      top: 10%;
      left: 0;
      width: 100%;
      padding: 0 8.333%;
      box-sizing: border-box;
      .header-operating {
        width: 50%;
        float: right;
        .operating-img {
          width: 5%;
          height: auto;
          float: right;
          margin: 2%;
        }
      }
    }
  }
  .caption-user {
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 83.33%;
  }
  .back-body {
    position: absolute;
    top: 19%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 83.33%;
    height: 70%;
    // background-color: red;
  }
}
</style>
