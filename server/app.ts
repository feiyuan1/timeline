import Koa = require('koa')
import webpack = require('webpack')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})
const { getSSRMiddleware } = require('./utils/sSRMiddleware')
const webpackMiddleware = require('./webpackMiddleware')
const proxy = require('koa-better-http-proxy')
const logger = require(path.resolve('./serverUtils/log.js'))

// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
const webpackState: webpack.CustomWebpackState = {
  outputFileSystem: fs
}
const app = new Koa()
const serverRenderMiddleware = getSSRMiddleware()

app.use(async (ctx: Koa.Context, next) => {
  logger.log('request path: ', ctx.response.request.path)
  await next()
})

if (process.env.NODE_ENV === 'production') {
  /**
   * ssr logic
   */
  app.use(webpackMiddleware(webpackState))
  app.use(async (ctx: Koa.CustomContext, next) => {
    if (!webpackState.stats) {
      throw 'the webpackStats is null'
    }
    // @ts-expect-error webpackState.stats 一定存在
    ctx.webpackState = webpackState
    await next()
  })
  app.use(serve(clientConfig.output.path, { defer: true }))
  app.use(serverRenderMiddleware)
}

app.use(async (ctx: Koa.Context, next: Koa.Next) => {
  if (ctx.path.startsWith('/api')) {
    const target = 'http://localhost:3001'
    return proxy(target)(ctx, next)
  }
  await next()
})

module.exports = app
