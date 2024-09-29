import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
const store = createStore({
  plugins: [createPersistedState()],
  state: {
    head_text: "",
    userInfo: {},
    platform: {},
    cabinetInfo: {},
    uuid: "",
    doorStatus: "",
    outLoginTime: 30 * 1000, //退出登录时间
    status: "start", // 盘点图书状态
    lockException: false, // 锁是否异常
  },
  mutations: {
    updateHead_text(state, payload) {
      state.head_text = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setUUID(state, payload) {
      state.uuid = payload;
    },
    setPlatform(state, payload) {
      state.platform = payload;
    },
    setCabinetInfo(state, payload) {
      state.cabinetInfo = payload;
    },
    setDoorStatus(state, payload) {
      state.doorStatus = payload;
    },
    setOutLoginTime(state, number) {
      state.outLoginTime = number;
    },
    setStatus(state, number) {
      state.status = number;
    },
    setLockException(state, payload) {
        state.lockException = payload;
      },
  },
  actions: {
    updateHead_text(context, payload) {
      context.commit("updateHead_text", payload);
    },
    setUserInfo(context, payload) {
      context.commit("setUserInfo", payload);
    },
    setUUID(context, payload) {
      context.commit("setUUID", payload);
    },
    setPlatform(context, payload) {
      context.commit("setPlatform", payload);
    },
    setCabinetInfo(context, payload) {
      context.commit("setCabinetInfo", payload);
    },
    setDoorStatus(context, payload) {
      context.commit("setDoorStatus", payload);
    },
    setOutLoginTime(context, number) {
      context.commit("setOutLoginTime", number);
    },
    setStatus(context, number) {
      context.commit("setStatus", number);
    },
    setLockException(context, number) {
        context.commit("setLockException", number);
      },
  },
  getters: {
    getHead_text(state) {
      return state.head_text;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getUUID(state) {
      return state.uuid;
    },
    platform(state) {
      return state.platform;
    },
    getCabinetInfo(state) {
      return state.cabinetInfo;
    },
    getDoorStatus(state) {
      return state.doorStatus;
    },
    getStatus(state) {
      return state.status;
    },
    getLockException(state) {
        return state.lockException;
      },
  },
  modules: {},
});
export default store;
