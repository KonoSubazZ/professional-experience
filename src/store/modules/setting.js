const state = {
  changeVersion: "online",
  typesOf: "",
  classification: "", //大分类下面的小分类
  datalist: [], //文件储存的列表
  //设置页面
  filepath: "E:/pubu/page", //文件存储的路径
  row: 3, //图书
  low: 2, //视频
  buttonHeight: true, //设置按钮固定还是可拖拽
  pull: 1, //流速：数字越大流速越快
  color: "#EBE4CE", //当前主题颜色
  closeTime: null, //关机时间
  closeWin: "never", //设置计算机关闭的周期
  indexNum: 1, //图书分类的第几个
  readHeight: true, //阅读高度固定
  time: 60000, //超时关闭
  httpAddress: " https://sc.erl.bwlib.cn", //下载地址
  radioeffect: false,
  downloadAddress: " https://sc.erl.bwlib.cn",
  videoStatus: false,
  musicStatus: false,
  smallClassifyId: '',
  rightnowCheckedCityList: {}
};
const mutations = {
  setRightnowChckedCityList(state, value) {
    state.rightnowCheckedCityList = value
  },
  setChangeVersion(state, stateb) {
    state.changeVersion = stateb
  },
  sethandlists(state, stateb) {
    console.log(stateb, '11');
    state.datalist = stateb;
  },
  sethandclassification(state, stateb) {
    state.classification = stateb;
    console.log(state);
  },
  sethandtypesOf(state, stateb) {
    state.typesOf = stateb;
  },
  sethandfilepath(state, stateb) {
    console.log(stateb);
    state.filepath = stateb;
  },
  sethandpull(state, stateb) {
    state.pull = stateb;
  },
  sethandrow(state, stateb) {
    state.row = stateb;
  },
  sethandlow(state, stateb) {
    state.low = stateb;
    console.log(state.low, "111111111111");
  },
  setCloseWin(state, stateb) {
    state.closeWin = stateb;
    console.log(state.closeWin);
  },
  setCloseTime(state, stateb) {
    state.closeTime = stateb;
    console.log(state.closeTime);
  },
  setButtonHeight(state, stateb) {
    state.buttonHeight = stateb;
  },
  setIndexNum(state, stateb) {
    state.indexNum = stateb;
    console.log(state.indexNum);
  },
  setReadHeight(state, stateb) {
    state.readHeight = stateb;
  },
  setColor(state, stateb) {
    state.color = stateb;
  },
  setTime(state, stateb) {
    if (typeof stateb != "number") {
      state.time = 60000;
    } else {
      state.time = stateb;
    }
  },
  setRadioeffect(state, stateb) {
    state.radioeffect = stateb;
  },
  setDownloadAddress(state, stateb) {
    state.downloadAddress = stateb;
  },
  setMusic(state, stateb) {
    state.musicStatus = stateb;
  },
  setVideo(state, stateb) {
    state.videoStatus = stateb;
  },
};
const actions = {
  handlRightnowChckedCityList({ commit }, value) {
    commit("setRightnowChckedCityList", value)
  },
  handlChangeVersion({ commit }, value) {
    commit("setChangeVersion", value)
  },
  handlists({ commit }, value) {
    commit("sethandlists", value);
  },
  handRadioeffect({ commit }, value) {
    commit("setRadioeffect", value);
  },
  handclassification({ commit }, value) {
    commit("sethandclassification", value);
  },
  handtypesOf({ commit }, value) {
    commit("sethandtypesOf", value);
  },
  handfilepath({ commit }, value) {
    commit("sethandfilepath", value);
  },
  handpull({ commit }, value) {
    commit("sethandpull", value);
  },
  handrow({ commit }, value) {
    commit("sethandrow", value);
  },
  handlow({ commit }, value) {
    commit("sethandlow", value);
  },
  handCloseWin({ commit }, value) {
    commit("setCloseWin", value);
  },
  handCloseTime({ commit }, value) {
    commit("setCloseTime", value);
  },
  handButtonHeight({ commit }, value) {
    commit("setButtonHeight", value);
  },
  handIndexNum({ commit }, value) {
    commit("setIndexNum", value);
  },
  handReadHeight({ commit }, value) {
    commit("setReadHeight", value);
  },
  handColor({ commit }, value) {
    commit("setColor", value);
  },
  handTime({ commit }, value) {
    commit("setTime", value);
  },
  handImei({ commit }, value) {
    commit("setImei", value);
  },
  handDownloadAddress({ commit }, value) {
    commit("setDownloadAddress", value);
  },
  handVideo({ commit }, value) {
    commit("setVideo", value);
  },
  handMusic({ commit }, value) {
    commit("setMusic", value);
  },
};

export default {
  state,
  mutations,
  actions,
};
