<template>
  <div class="table-info mt-110-table">
    <div>
      <div class="table font-14">
        <div class="tr h-40">
          <div
            class="th"
            :class="type == 'borrow' || status == 'success' ? 't-27' : 't-18'"
          >
            书名
          </div>
          <div class="th t-10">定价</div>
          <div class="th t-18">出版社</div>
          <div class="th t-10">索书号</div>
          <div class="th t-11">条码号</div>
          <div class="th t-11">架位号</div>
          <div class="th t-12">应还日期</div>
          <div class="th t-10" v-if="type == 'return' && status != 'success'">
            是否超期
          </div>
        </div>
        <div class="max-table">
          <div class="tr h-52" v-for="(item, index) in bookList" :key="index">
            <div
              class="td"
              :class="type == 'borrow' || status == 'success' ? 't-27' : 't-18'"
            >
              {{ item.name }}
            </div>
            <div class="td t-10">{{ item.price }}</div>
            <div class="td t-18">{{ item.press }}</div>
            <div class="td t-10">{{ item.code }}</div>
            <div class="td t-11">{{ item.code }}</div>
            <div class="td t-11">{{ item.code }}</div>
            <div class="td t-12">{{ item.time }}</div>
            <div class="td t-10" v-if="type == 'return' && status != 'success'">
              否
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-row flex-center mt-40" v-if="status == 'confirm'">
      <button class="form-blue-btn font-24" @click="confirmBorrow">
        {{ type == "borrow" ? "确认借书" : "确认还书1" }}
      </button>
    </div>
    <div
      class="flex-row flex-center mt-40"
      v-if="status == 'success' && type == 'borrow'"
    >
      <button class="form-blue-btn font-24 mr-10" @click="reback">返回</button>
      <button class="form-yellow-btn font-24" @click="print">
        打印凭条并返回
      </button>
    </div>
  </div>
</template>

<script>
import testReader from "@/api/hardWare_renderer";
export default {
  data() {
    return {
      bookList: [
       
      ],
      status: "success",
    };
  },
  computed: {
    list() {
      return this.$store.state.Borrow.progreeList;
    },
    type() {
      return this.$route.meta.type;
    },
  },
  created() {
    this.$store.dispatch(
      "modifyProgreeList",
      this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
    );
    this.$store.dispatch(
      "modifyCaption",
      this.type == "borrow" ? "确定借书信息" : "确认还书信息"
    );
  },
  methods: {
    /**
     * @description:确定借书or确定还书
     */
    confirmBorrow() {
      this.status = "success";
      this.$store.dispatch(
        "modifyProgreeList",
        this.$func.setNextTrue(JSON.parse(JSON.stringify(this.list)))
      );
      this.$store.dispatch(
        "modifyCaption",
        this.type == "borrow" ? "借书成功" : "还书成功"
      );
    },
    /**
     * @description:打印凭条
     */
    print() {
      let test = testReader();
      console.log(test);
      let url = test.startPrint(
        document.getElementById("printStyle").innerHTML,
        (data) => {
          console.log(data);
        }
      );
      console.log(url);
      // this.reback();
    },
    /**
     * @description:返回
     */
    reback() {
      this.$router.replace("/");
    },
  },
};
</script>

<style lang="less" scoped>
.t-18 {
  width: 18%;
}
.t-27 {
  width: 27%;
}
.t-13 {
  width: 13%;
}
.t-12 {
  width: 12%;
}
.t-11 {
  width: 11%;
}
.t-10 {
  width: 10%;
}
.flex-one {
  flex: 1;
}
.table-info {
  position: absolute;
  top: 40%;

  width: 80%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.table {
  border: 1px solid rgba(29, 161, 242, 1);
  width: 100%;
  .max-table {
    &::-webkit-scrollbar {
      /* 这里的宽是指竖向滚动条的宽，高是指横向滚动条的高*/
      width: 4px;

      height: 0px;
      background-color: transparent;
    }
    /* 滚动条凹槽，还可以设置边框属性。此处属性也可以直接在容器中设置 */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #1da1f2;
    }
  }
  .tr {
    display: flex;
  }
  .th {
    background-color: #f0f8fd;
    border: 1px solid #f0f8fd;
    text-align: center;
    font-weight: bold;
  }
  .td {
    text-align: center;
  }
}
</style>