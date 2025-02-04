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
        reject(0)
      }

      const statsJson = stats.toJson('normal')
      logger.log(`>  >  >  > webpack client compilation info`)
      logger.log(
        stats.toString({
          entrypoints: true,
          chunkGroups: true,
          modules: false,
          colors: true,
          warnings: true,
          errors: true
        })
      )
      webpackState.stats = statsJson
      webpackState.outputFileSystem = fs
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
