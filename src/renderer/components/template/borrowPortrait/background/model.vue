<template>
  <div>
    <!-- 模态框 -->
    <transition name="fade">
      <div v-if="showModal" class="modal-mask">
        <div class="modal-container">
          <div class="modal-header">
            <p class="modal-title">提示</p>
            <span class="modal-close" @click="closeModal">&times;</span>
          </div>
          <div class="modal-content">
            <p>确定放弃当前操作回到首页吗？</p>
          </div>
          <div class="modal-footer">
            <el-button @click="cancelModal" class="btn"
              >取消（{{ time }}）</el-button
            >
            <el-button type="primary" @click="confirmModal" class="btn"
              >确认</el-button
            >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    models: Boolean, // 指定属性名和类型
  },
  data() {
    return {
      timerId: null,
      time: 5,
      showModal: false,
    };
  },
  //   onload(){
  // this.showModal=this.models
  //   },
  created() {
    this.showModal = this.models;
    console.log(this.showModal, "this.showModal");
  },
  watch: {
    models(newbool, oldbool) {
      console.log(oldbool);
      this.showModal = newbool;
    },
    showModal(newValue, oldValue) {
      console.log(oldValue);
      this.$emit("bool", newValue);
      if (newValue == true) {
        this.timerId = setInterval(() => {
          this.time--;
        }, 1000);
      } else {
        this.time = 5;
        clearInterval(this.timerId);
      }
    },
    time(newData, oldData) {
      console.log(oldData);
      if (newData == 0) {
        this.showModal = false;
        this.time = 5;
      }
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    confirmModal() {
      // 在确认按钮点击时执行的操作
      this.closeModal();
      this.$router.replace("/");
    },
    cancelModal() {
      // 在取消按钮点击时执行的操作
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal-mask {
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  background-color: #fff;
  width: 41vw;
  height: 170px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 18px;
  line-height: 1;
  color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-title {
  margin: 0;
}

.modal-close {
  cursor: pointer;
}

.modal-content {
  text-align: left;
  padding: 10px 15px !important;
  color: #606266;
  font-size: 23px !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 4px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn {
  width: 130px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
