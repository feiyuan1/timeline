import Koa = require('koa')
import webpack = require('webpack')
const serve = require('koa-static')
const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})
const { getSSRMiddleware } = require('./utils/sSRMiddleware')
const webpackMiddleware = require('./webpackMiddleware')
require('./types')

const webpackState: webpack.CustomWebpackState = {
  outputFileSystem: fs
}
// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

const app = new Koa()
const serverRenderMiddleware = getSSRMiddleware()
const router = new Router()
const apiRouter = new Router({ prefix: '/api' })

app.use(async (ctx: Koa.Context, next) => {
  // eslint-disable-next-line no-console
  console.log('request path: ', ctx.response.request.path)
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

app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

module.exports = app
