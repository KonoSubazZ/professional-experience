function parseURL(url) {
  const urlObj = new URL(url);
  // 获取URL中的哈希值
  const hash = urlObj.hash;

  // 如果哈希值存在且包含查询参数
  const params = {};
  if (hash && hash.includes("?")) {
    // 分割哈希值，获取查询参数部分
    const queryParams = hash.split("?")[1];
    // 分割查询参数，获取键值对数组
    const pairs = queryParams.split("&");
    
    pairs.forEach((pair) => {
      const keyValue = pair.split("=");
      const key = decodeURIComponent(keyValue[0]);
      const value = decodeURIComponent(keyValue[1]);
      params[key] = value;
    });

    // 输出参数
    console.log(params);
    console.log(params.userId);
  } else {
    console.log("URL中没有查询参数。");
  }
  return {
    http: urlObj.href,
    httpUrl: urlObj.origin,
    wsURL: urlObj.host,
    portNumber: urlObj.port || 9021,
    userId: params.userId,
    platformId: params.platformId,
  };
}

export { parseURL };
