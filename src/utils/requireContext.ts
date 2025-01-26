// 匹配多个模块，每个模块有唯一的模块 id，可用于 module.hot.accept
export function getMultModuleKey(require: __WebpackModuleApi.RequireContext) {
  // resolve 方法返回模块 id
  return require.keys().map((key) => require.resolve(key))
}

export function getMultModule<T extends object>(
  require: __WebpackModuleApi.RequireContext
) {
  // require 本身接收 request 参数
  return require.keys().map((key) => require<T>(key))
}
