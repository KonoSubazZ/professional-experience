
/**
 * @author 钟豪
 * @example 在javaScript中使用webpack中的context方法,可以自行百度
 */
const files = require.context(".", false, /\.js$/);
const modules = {};
files.keys().forEach((key) => {
  if (key === "./index.js") return;
  modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

export default modules;
