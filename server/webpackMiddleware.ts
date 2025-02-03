import Koa = require('koa')
import webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const logger = require('./utils/index')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})

const webpackMiddleware = (webpackState: webpack.CustomWebpackState) => {
  const p = new Promise((resolve, reject) => {
    const compiler = webpack(clientConfig, (err, stats) => {
      if (err) {
        logger.error([{ message: 'client webpack error:' }, err])
      }

      const statsJson = stats.toJson('normal')
      if (stats.hasErrors()) {
        logger.mutiError(
          statsJson.errors.concat([
            {
              message: `webpack compile failed with ${statsJson.errors.length} errors`
            }
          ])
        )
        reject(0)
      }
      webpackState.stats = statsJson
      webpackState.outputFileSystem = fs
      if (statsJson.warnings.length) {
        logger.mutiError(
          [
            {
              message: `WARNING: webpack compile successed with ${statsJson.warnings.length} WARNINGs`
            }
          ].concat(statsJson.warnings)
        )
      }
      resolve(0)
    })

    // 监听 client 端文件变更，并重新执行 compiler.run 方法
    compiler.watch({}, () => {})
  })

  return async (ctx: Koa.Context, next: Koa.Next) => {
    await p
    await next()
  }
}

module.exports = webpackMiddleware
