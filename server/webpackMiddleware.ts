import Koa = require('koa')
import webpack = require('webpack')
const path = require('path')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})

const webpackMiddleware = (webpackState: webpack.CustomWebpackState) => {
  const p = new Promise((resolve) => {
    webpack(clientConfig, (err, stats: webpack.StatsCompilation) => {
      const statsJson = stats.toJson({ normal: true })
      webpackState.stats = statsJson
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

export default webpackMiddleware
