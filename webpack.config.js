const webpackProd = require('./webpack.prod.js')
const webpackDev = require('./webpack.dev.js')
const { NODE_ENV } = require('./env.js')

// 分割不同环境下的配置项
module.exports = (env, argv) => {
  //  TODO 这里打印结果会被包含在 stats.json 导致 webpack-bundle-analyze 解析失败
  // env && console.log('webpack env: ', env)
  // console.log('node-env: ', process.env.NODE_ENV)
  // console.log('argv.mode: ', argv.mode)
  const mode = argv.mode || process.env.NODE_ENV

  switch (mode) {
    case NODE_ENV.PROD:
      return webpackProd
    case NODE_ENV.DEV:
      return webpackDev
    default:
      throw new Error(`mode:${mode}; 这是什么环境？？？`)
  }
}
