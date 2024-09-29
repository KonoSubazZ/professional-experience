const state = {
  userInfo: {},
  readCard: "", //读者卡信息
  codeInfo: "", //二维码信息
  idNumberInfo: "", //身份证信息
  authType: "", // 1-人脸识别 2-读者卡 3-身份证 4-二维码
  clear: false,
  overduceList: [], //逾期数据
  orderCard: "", //办卡订单信息
  orderPay: "", //充值订单信息
  face: "", //人脸照片信息
  payNumber:"",//充值金额
};

const mutations = {
  set_user_info(state, value) {
    state.userInfo = value;
  },
  set_user_clear(state, value) {
    state.clear = value;
  },
  set_read_card(state, value) {
    state.readCard = value;
    state.authType = 2;
  },
  set_idNumber_info(state, value) {
    console.log('我',value);
    state.idNumberInfo = value;
    state.authType = 3;
  },
  set_code_info(state, value) {
    state.codeInfo = value;
    state.authType = 4;

  },
  set_overduce_info(state, value) {
    state.overduceList = value;
  },
  set_card_order(state, value) {
    state.orderCard = value;
  },
  set_pay_order(state, value) {
    state.orderPay = value;
  },
  set_face(state, value) {
    state.face = value;
  },
  set_pay_number(state,value){
    state.payNumber = value;
  },
  initUser(state, value) {
    state.readCard = "";
    state.codeInfo = "",
      state.idNumberInfo = "";
    state.authType = '';
    state.face = '';
    state.orderPay = '';
    state.orderCard = '';
    state.overduceList = [];
    state.userInfo = {};
  }
};

const actions = {
  modifyUserInfo({
    commit
  }, value) {
    commit("set_user_info", value);
  },
  modifyUserClear({
    commit
  }, value) {
    commit("set_user_clear", value);
  },
  clearUserInfo({
    commit
  }) {
    commit("set_user_info", {});
    commit("set_user_clear", false);
  },
  modifyReadCard({
    commit
  }, value) {
    commit("set_read_card", value);
  },
  modifyIdNumber({
    commit
  }, value) {
    commit("set_idNumber_info", value);
  },
  modifyCodeInfo({
    commit
  }, value) {
    commit("set_code_info", value);
  },
  modifyOverduce({
    commit
  }, value) {
    commit("set_overduce_info", value)
  },
  initUser({
    commit
  }) {
    commit("initUser")
  },
  modifyOrderCard({
    commit
  }, value) {
    commit("set_card_order", value)
  },
  modifyOrderPay({
    commit
  }, value) {
    commit("set_pay_order", value)
  },
  modifyFace({
    commit
  }, value) {
    commit("set_face", value)
  }
};
export default {
  state,
  mutations,
  actions,
};