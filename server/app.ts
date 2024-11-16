import Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const path = require('path')
import webpack = require('webpack')
const { toTreeSync } = require('memfs/lib/print')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})
const koaDevMiddleware = require('./koaDevMiddleware')
const { getSSRMiddleware } = require('./utils/sSRMiddleware')
interface CustomWebpackState {
  stats?: webpack.StatsCompilation
}
const webpackState: CustomWebpackState = {}
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
  webpack(clientConfig, (err, stats: webpack.StatsCompilation) => {
    const statsJson = stats.toJson({ normal: true })
    webpackState.stats = statsJson
    // eslint-disable-next-line no-console
    console.log('stats json: ', statsJson.warnings)
  })
  app.use(serve(clientConfig.output.path))
}

app.use(async (ctx, next) => {
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
