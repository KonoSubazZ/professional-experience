const state = {
  progreeList: [], //进度列表
  caption: "", //提示。
};

const mutations = {
  setting_progree_list(state, value) {
    state.progreeList = value;
  },
  setting_caption(state, value) {
    state.caption = value;
  },
};

const actions = {
  modifyProgreeList({ commit }, value) {
    commit("setting_progree_list", value);
  },
  modifyCaption({ commit }, value) {
    commit("setting_caption", value);
  },
};

export default {
  state,
  mutations,
  actions,
};
