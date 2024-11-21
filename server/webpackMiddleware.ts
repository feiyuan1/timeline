import Koa = require('koa')
import webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const logger = require('./utils/log')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})

const webpackMiddleware = (webpackState: webpack.CustomWebpackState) => {
  const p = new Promise((resolve) => {
    webpack(clientConfig, (err, stats) => {
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
      }
      webpackState.stats = statsJson
      webpackState.outputFileSystem = fs
      // mock webpack-cli console log
      // eslint-disable-next-line no-console
      console.log('stats json: ', statsJson.warnings)
      resolve(0)
    })
  })

  return async (ctx: Koa.Context, next: Koa.Next) => {
    await p
    await next()
  }
}

module.exports = webpackMiddleware
