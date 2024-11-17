import Koa = require('koa')
import webpack = require('webpack')
import webpackMiddleware from './webpackMiddleware'
const serve = require('koa-static')
const Router = require('koa-router')
const path = require('path')
const { toTreeSync } = require('memfs/lib/print')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})
const koaDevMiddleware = require('./koaDevMiddleware')
const { getSSRMiddleware } = require('./utils/sSRMiddleware')
require('./types')

const webpackState: webpack.CustomWebpackState = {}
// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

const app = new Koa()
const serverRenderMiddleware = getSSRMiddleware()
const router = new Router()
const apiRouter = new Router({ prefix: '/api' })
// const middlewares = []

app.use(async (ctx: Koa.Context, next) => {
  // eslint-disable-next-line no-console
  console.log('request path: ', ctx.response.request.path)
  await next()
})

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(clientConfig)
  app.use(
    koaDevMiddleware(compiler, {
      ...clientConfig.devServer.devMiddleware,
      publicPath: clientConfig.output.publicPath
    })
  )
  app.use(async (ctx: Koa.Context, next) => {
    const { devMiddleware } = ctx.state.webpack
    const outputFileSystem = devMiddleware.outputFileSystem
    const jsonWebpackStats = devMiddleware.stats.toJson({ normal: true })
    webpackState.stats = jsonWebpackStats
    const { assetsByChunkName } = jsonWebpackStats
    // eslint-disable-next-line no-console
    console.log(
      'webpack finish: ',
      assetsByChunkName,
      toTreeSync(outputFileSystem)
    )
    await next()
  })
} else if (process.env.NODE_ENV === 'production') {
  app.use(webpackMiddleware(webpackState))
  app.use(serve(clientConfig.output.path))
}

app.use(async (ctx: Koa.CustomContext, next) => {
  if (!webpackState.stats) {
    throw 'the webpackStats is null'
  }
  ctx.webpackState = webpackState
  await next()
})
app.use(serverRenderMiddleware)
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

// app.use(middlewares)
module.exports = app
